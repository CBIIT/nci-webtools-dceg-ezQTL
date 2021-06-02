#!/usr/bin/python3
# encoding=utf8

'''
Version 6
(1)Remove Header
(2)Transform Original Matrix to a New full Matrix
(3)Clean output

### Example: ###

(Good Example)
chr10_100000001_103000001

2020-08-04T18:41:03.695Z        145.9 kB       chr10_74000001_77000001
2020-08-04T18:43:45.387Z        571.2 MB       chr10_74000001_77000001.npz

(Good Example)

python3 scr-0-LD-Selection-Extraction_V8.py -q chr10:74000001-74001011 -r /data/sangj2/5-Tongwu/z-3-EZ-QTL/0-0-LD-Selection-03-29-2021/Alkes_group.txt -o z-Test-6234-3-T.txt
python3 scr-0-LD-Selection-Extraction_V8.py -q chr11:59050001-59080001 -r /data/sangj2/5-Tongwu/z-3-EZ-QTL/0-0-LD-Selection-03-29-2021/Alkes_group.txt -o z-Test-6234-7-T.txt




'''
import re
import os
import argparse
import sys
import scipy.sparse as sparse
import pandas as pd
import numpy as np
import tensorflow as tf

# def Basic_Variables():
# ### This is the path of Alkes_group file
# Tagate_Path = "/Users/sangj2/z-0-Projects/z-2-tongwu/z-3-EZ-QTL/0-0-LD-Selection-03-29-2021/0-LD-Raw-Path/Alkes_group.txt"

# return Tagate_Path


def Parse():
    parser = argparse.ArgumentParser()
    parser.add_argument('-q', '--query_postion',
                        required=True, type=str, help="query_postion")
    #parser.add_argument('-l', '--LD_File_Dir', required=True, type=str, help="the Dir Path where LD files were located")
    parser.add_argument('-o', '--output_Path', required=True,
                        type=str, help="output_Path")
    parser.add_argument('-r', '--Path_LD_File_List',
                        required=True, type=str, help="output_dir")

    args = parser.parse_args()
    # return args.query_postion, args.LD_File_Dir, args.output_Path, args.Path_LD_File_List
    return args.query_postion, args.output_Path, args.Path_LD_File_List


def GenerateDir(Path):
    if os.path.exists(Path):
        pass
    else:
        os.system("mkdir %s" % (Path))


def load_NPZ(query_Start, query_End, return_Targated_Str):
    query_postion, LD_File_Dir, output_Path, Path_LD_File_List = Parse()

    # No output_dir is provided. Here we use "Temp" as output_dir
    output_dir = "Temp"
    GenerateDir(output_dir)

    # Count is the index of gz file and npz file, the line of gz and npz file are same.
    Count = 0

    # 000 Parse npz file
    LD_npz_Path = "%s/%s.npz" % (LD_File_Dir, return_Targated_Str)
    LD_arr = sparse.load_npz(LD_npz_Path).toarray()

    # 001 Parse gz file
    #LD_gz_Path = "%s/%s" % (LD_File_Dir,return_Targated_Str)
    LD_gz_Path = "%s/%s.gz" % (LD_File_Dir, return_Targated_Str)
    LD_gz_unzip_Path = "%s/%s" % (output_dir, return_Targated_Str)
    gzip_cmd = "gunzip -c %s > %s" % (LD_gz_Path, LD_gz_unzip_Path)
    print(gzip_cmd)
    os.system(gzip_cmd)

    gz_npz_arr = []
    Header = ["SNP", "CHR", "BP", "A1", "A2"]

    # Di yi lun Bianli of LD_gz_File
    LD_gz_File = open(LD_gz_unzip_Path)
    LD_gz_index_Po_Dict = {}
    LD_Count = 0
    for line in LD_gz_File:
        if re.match(r'rsid', line):
            pass
        elif re.match(r'\n', line):
            pass
        else:
            ss = line.split("	")
            for i in range(0, len(ss)):
                L_Key = LD_Count
                L_Value = ss[2]

                LD_gz_index_Po_Dict.setdefault(L_Key, L_Value)
            LD_Count += 1
    print(len(LD_gz_index_Po_Dict))
    LD_gz_File.close()

    # Di 2 lun Bianli of LD_gz_File
    LD_gz_File = open(LD_gz_unzip_Path)
    for line in LD_gz_File:
        if re.match(r'rsid', line):
            pass
        elif re.match(r'\n', line):
            pass
        else:
            ss = line.split("	")
            Position = int(ss[2])
            SNP_ID = ss[0]

            if Position > int(query_Start) and Position < int(query_End):
                # zhege shi tou wenjian
                Header.append(SNP_ID)
                gz_arr = line.strip().split("	")
                npz_arr = LD_arr[Count].tolist()
                # print(len(npz_arr))
                for i in range(0, len(npz_arr)):
                    if int(LD_gz_index_Po_Dict[i]) > int(query_Start) and int(LD_gz_index_Po_Dict[i]) < int(query_End):
                        gz_arr.append(npz_arr[i])
                gz_npz_arr.append(gz_arr)
            Count += 1

            # print(Count)
            # #print(len(gz_arr))
            # #final_gz_npz_arr = gz_arr + npz_arr
            # #print(final_gz_npz_arr)
    # #print(query_Start,query_End)
    LD_gz_File.close()
    # print(gz_npz_arr)

    gz_npz_pd = pd.DataFrame(gz_npz_arr)
    ###########gz_npz_pd.columns = Header
    ###########gz_npz_pd.to_csv(output_Path,sep="\t",index=False, header=False)
    # gz_npz_pd.to_csv(output_Path,sep="\t",index=False,header=False)

    # 003 Important update: change the old Half Maxtrix to Full Maxtrix
    gz_npz_pd_temp = gz_npz_pd.iloc[:, 5:]
    # print(gz_npz_pd_temp)

    gz_npz_np_temp = gz_npz_pd_temp.to_numpy()
    # print(gz_npz_np_temp)

    # 003-2 Here is the copy and transform process
    gz_npz_np_T_temp = gz_npz_np_temp + \
        gz_npz_np_temp.T - np.diag(np.diag(gz_npz_np_temp))

    # Here change from np[i][i] = 0.5 to np[i][i] = 1.0
    num_rows, num_cols = gz_npz_np_T_temp.shape
    for i in range(num_rows):
        for j in range(num_cols):
            if i == j:
                # print(gz_npz_np_T_temp[i,j])
                gz_npz_np_T_temp[i, j] = 1.0

    gz_npz_pd_T_temp = pd.DataFrame(gz_npz_np_T_temp)
    print("Generate Results...")

    # 003-3 Add columns
    gz_Final_pd_Part1 = gz_npz_pd.iloc[:, 0:5]
    gz_Final_pd_Part2 = pd.concat(
        [gz_Final_pd_Part1, gz_npz_pd_T_temp], axis=1)

    # gzip the Ouput_Path
    Output_Path = "%s/Output_%s.txt" % (output_dir,
                                        query_postion.replace(":", "-"))
    gz_Final_pd_Part2.to_csv(output_Path, sep="\t", index=False, header=False)

    print("Compressing results...")
    gzip_Cmd = "gzip %s" % (output_Path)
    os.system(gzip_Cmd)

    # Delete The output_dir
    os.system("rm -rf %s" % output_dir)


def load_NPZ_2(query_Start, query_End, return_Targated_Str):
    #query_postion, LD_File_Dir, output_Path, Path_LD_File_List = Parse()
    query_postion, output_Path, Path_LD_File_List = Parse()

    GS_URL = "https://storage.googleapis.com/broad-alkesgroup-public/UKBB_LD"

    # No output_dir is provided. Here we use "Temp" as output_dir
    output_dir = "Temp"
    GenerateDir(output_dir)

    # Count is the index of gz file and npz file, the line of gz and npz file are same.
    Count = 0

    # 000 Parse npz file (using tf)
    LD_npz_File = "%s.npz" % (return_Targated_Str)
    LD_npz_URL = "%s/%s.npz" % (GS_URL, return_Targated_Str)
    LD_npz_Path = tf.keras.utils.get_file(LD_npz_File, LD_npz_URL)
    print(LD_npz_URL)
    #LD_npz_Path = "%s/%s.npz" % (LD_File_Dir,return_Targated_Str)
    LD_arr = sparse.load_npz(LD_npz_Path).toarray()

    # 001 Parse gz file
    LD_gz_File = "%s.gz" % (return_Targated_Str)
    LD_gz_URL = "%s/%s.gz" % (GS_URL, return_Targated_Str)
    LD_gz_Path = tf.keras.utils.get_file(LD_gz_File, LD_gz_URL)
    print(LD_gz_URL)

    ####LD_gz_Path = "%s/%s" % (LD_File_Dir,return_Targated_Str)
    #LD_gz_Path = "%s/%s.gz" % (LD_File_Dir,return_Targated_Str)
    LD_gz_unzip_Path = "%s/%s" % (output_dir, return_Targated_Str)
    gzip_cmd = "gunzip -c %s > %s" % (LD_gz_Path, LD_gz_unzip_Path)
    print(gzip_cmd)
    os.system(gzip_cmd)

    gz_npz_arr = []
    Header = ["SNP", "CHR", "BP", "A1", "A2"]

    # Di yi lun Bianli of LD_gz_File
    LD_gz_File = open(LD_gz_unzip_Path)
    LD_gz_index_Po_Dict = {}
    LD_Count = 0
    for line in LD_gz_File:
        if re.match(r'rsid', line):
            pass
        elif re.match(r'\n', line):
            pass
        else:
            ss = line.split("	")
            for i in range(0, len(ss)):
                L_Key = LD_Count
                L_Value = ss[2]

                LD_gz_index_Po_Dict.setdefault(L_Key, L_Value)
            LD_Count += 1
    print(len(LD_gz_index_Po_Dict))
    LD_gz_File.close()

    # Di 2 lun Bianli of LD_gz_File
    LD_gz_File = open(LD_gz_unzip_Path)
    for line in LD_gz_File:
        if re.match(r'rsid', line):
            pass
        elif re.match(r'\n', line):
            pass
        else:
            ss = line.split("	")
            Position = int(ss[2])
            SNP_ID = ss[0]

            if Position > int(query_Start) and Position < int(query_End):
                # zhege shi tou wenjian
                Header.append(SNP_ID)
                gz_arr = line.strip().split("	")
                npz_arr = LD_arr[Count].tolist()
                # print(len(npz_arr))
                for i in range(0, len(npz_arr)):
                    if int(LD_gz_index_Po_Dict[i]) > int(query_Start) and int(LD_gz_index_Po_Dict[i]) < int(query_End):
                        gz_arr.append(npz_arr[i])
                gz_npz_arr.append(gz_arr)
            Count += 1

            # print(Count)
            # #print(len(gz_arr))
            # #final_gz_npz_arr = gz_arr + npz_arr
            # #print(final_gz_npz_arr)
    # #print(query_Start,query_End)
    LD_gz_File.close()
    # print(gz_npz_arr)

    gz_npz_pd = pd.DataFrame(gz_npz_arr)
    ###########gz_npz_pd.columns = Header
    ###########gz_npz_pd.to_csv(output_Path,sep="\t",index=False, header=False)
    # gz_npz_pd.to_csv(output_Path,sep="\t",index=False,header=False)

    # 003 Important update: change the old Half Maxtrix to Full Maxtrix
    gz_npz_pd_temp = gz_npz_pd.iloc[:, 5:]
    # print(gz_npz_pd_temp)

    gz_npz_np_temp = gz_npz_pd_temp.to_numpy()
    # print(gz_npz_np_temp)

    # 003-2 Here is the copy and transform process
    gz_npz_np_T_temp = gz_npz_np_temp + \
        gz_npz_np_temp.T - np.diag(np.diag(gz_npz_np_temp))

    # Here change from np[i][i] = 0.5 to np[i][i] = 1.0
    num_rows, num_cols = gz_npz_np_T_temp.shape
    for i in range(num_rows):
        for j in range(num_cols):
            if i == j:
                # print(gz_npz_np_T_temp[i,j])
                gz_npz_np_T_temp[i, j] = 1.0

    gz_npz_pd_T_temp = pd.DataFrame(gz_npz_np_T_temp)
    print("Generate Results...")

    # 003-3 Add columns
    gz_Final_pd_Part1 = gz_npz_pd.iloc[:, 0:5]
    gz_Final_pd_Part2 = pd.concat(
        [gz_Final_pd_Part1, gz_npz_pd_T_temp], axis=1)

    # gzip the Ouput_Path
    Output_Path = "%s/Output_%s.txt" % (output_dir,
                                        query_postion.replace(":", "-"))
    gz_Final_pd_Part2.to_csv(output_Path, sep="\t", index=False, header=False)

    print("Compressing results...")
    gzip_Cmd = "gzip %s" % (output_Path)
    os.system(gzip_Cmd)

    # Delete The output_dir
    print(LD_gz_Path)
    print(LD_npz_Path)
    os.system("rm -rf %s" % output_dir)
    os.system("rm %s" % LD_gz_Path)
    os.system("rm %s" % LD_npz_Path)


def Process():
    #query_postion, LD_File_Dir, output_Path, Path_LD_File_List = Parse()
    query_postion, output_Path, Path_LD_File_List = Parse()

    Targate_Path = Path_LD_File_List
    Targate_File = open(Targate_Path)
    Targate_Dict = {}

    for line in Targate_File:
        if re.search(r'(gz)$', line):
            ID = line.split("/")[-1].strip("").split(".")[0]
            ss = ID.split("_")
            targate_Chr = ss[0]
            targate_Start = ss[1]
            targate_End = ss[2]
            Value = "%s_%s" % (targate_Start, targate_End)
            Targate_Dict.setdefault(targate_Chr, []).append(Value)
    Targate_File.close()

    # print(Tagate_Arr)

    # Check Query Postion
    # print(query_postion,output_dir)
    # chr9:100060001-103000001
    # print(query_postion)

    query_ss = query_postion.split(":")
    query_Chr = query_ss[0]
    query_Start = query_ss[1].split("-")[0]
    query_Start = int(query_Start)
    query_End = query_ss[1].split("-")[1]
    query_End = int(query_End)

    Targate_arr = Targate_Dict[query_Chr]
    return_Targated_Str = "0"

    for i in Targate_arr:
        # print(i)
        t_Start = i.split("_")[0]
        t_Start = int(t_Start)
        t_End = i.split("_")[1]
        t_End = int(t_End)
        # print(t_Start,t_End)
        #flag = 0
        if query_Start >= t_Start and query_End <= t_End:
            return_Targated_Str = "%s_%s_%s" % (query_Chr, t_Start, t_End)
            break
            # ####### 000 Parse npz file
            # LD_npz_Path = "%s/%s.npz" % (GS_URL,return_Targated_Str)
            # if os.path.exists(LD_npz_Path):
            # print(return_Targated_Str)
            # break

    # 000002	Use	 load_NPZ function to get LD Value in targeted region
    if return_Targated_Str == "0":
        Error_msg = "Your Input Region %s is invalid, please provide another position in right format, such as chr9:100060001-103000001" % (
            query_postion)
        print(Error_msg)
    else:
        load_NPZ_2(query_Start, query_End, return_Targated_Str)


def Test():
    # goolge cloud yuancheng fangwen npz wenjian de fangfa
    # https://www.tensorflow.org/tutorials/load_data/numpy

    from io import BytesIO
    import tensorflow as tf
    import numpy as np
    from tensorflow.python.lib.io import file_io

    url = 'gs://broad-alkesgroup-public/UKBB_LD/chr10_38000001_41000001.npz'
    #url = 'gs://cloud-samples-data/bigquery/us-states/us-states-by-date.csv'
    #f = BytesIO(file_io.read_file_to_string(url, binary_mode=True))
    #data = np.load(f)
    #LD_arr = sparse.load_npz(url).toarray()

    DATA_URL = 'https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz'
    Test_URL = "https://storage.googleapis.com/broad-alkesgroup-public/UKBB_LD/chr10_38000001_41000001.npz"
    Test_URL = "https://storage.googleapis.com/broad-alkesgroup-public/UKBB_LD/chr10_10000001_13000001.npz"

    Test_URL_gz = "https://storage.googleapis.com/broad-alkesgroup-public/UKBB_LD/chr10_10000001_13000001.gz"

    #path = tf.keras.utils.get_file('mnist.npz', DATA_URL)
    path = tf.keras.utils.get_file('chr10_10000001_13000001.npz', Test_URL)
    LD_gz_Path = tf.keras.utils.get_file(
        'chr10_10000001_13000001.gz', Test_URL_gz)

    # with np.load(path) as data:
    # train_examples = data['x_train']
    # train_labels = data['y_train']
    # test_examples = data['x_test']
    # test_labels = data['y_test']
    print(LD_gz_Path)
    #File = open(path)
    # for line in File:
    # print(line)
    # File.close()

    #data = np.load(path)
    # print(data)

    #LD_arr = sparse.load_npz(path).toarray()
    # print(LD_arr)


if __name__ == "__main__":
    Process()
    # Test()

    print("11")


# cloud-samples-data/bigquery/us-states/us-states-by-date.csv

# https://storage.googleapis.com/cloud-samples-data/bigquery/us-states/us-states-by-date.csv
