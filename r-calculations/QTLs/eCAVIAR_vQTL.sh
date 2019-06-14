#!/bin/bash
## download software from here: http://genetics.cs.ucla.edu/caviar/
set -e 

gwasfile=$1
qtlfile=$2
leadsnp=$3
#gene=$4
dist=$4
# popshort=$5
# request=$6
# envfile=$7
request=$5
envfile=$6

source $envfile

localpath=$(pwd)
output=$localpath/tmp/${request}.eCAVIAR.txt
rm -rf $output 
touch $output

# tmpfold=$(mktemp -d -t MX2)
# echo $tmpfold
# cd $tmpfold

tmpfold=tmp/${request}.ECAVIAR_TMP
mkdir $tmpfold

tmpinfo=`grep -m 1 $leadsnp $gwasfile` 
# echo $tmpinfo
chr=`echo $tmpinfo |awk '{print $1}' ` 
position=`echo $tmpinfo |awk '{print $2}'` 
minpos=$(( position - dist ))
if [ "$minpos" -lt 0 ]; then 
	minpos=0
fi 

maxpos=$(( position + dist ))

### for minal 50 snps ### 
dist2=1000000
minpos2=$(( position - dist2 ))
if [ "$minpos2" -lt 0 ]; then 
	minpos2=0
fi 

maxpos2=$(( position + dist2 ))

## define file for LD calculation ##
kgpath=${vQTLfolder}"/1kginfo/"
kgvcfpath=${kgpath}"ALL.chr"${chr}".phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz"
# poppanel=${kgpath}"integrated_call_samples_v3.20130502.ALL.panel"
#emerald="/data/zhangt8/NF_eQTL_ALL/vQTL/tools/emeraLD/bin/emeraLD"

kgsnp=${kgpath}"/SNP_1kginfo.txt.gz"

##### overalp rs ##### 
$tabix $kgsnp ${chr}:${minpos}-${maxpos} |awk -v OFS="\t" '!a[$NF]++ && $NF!~/;/ && $NF~/^rs/{print $NF,$2}'|awk -F "\t" -v OFS="\t" -v gwasfile=$gwasfile -v qtlfile=$qtlfile  'BEGIN{while((getline < gwasfile )>0) a[$5]=1; while((getline < qtlfile) >0) b[$4]=0;}{if(($1 in a) && ($1 in b))  print $1,$2 }' >$tmpfold/common.snp.full
$tabix $kgsnp ${chr}:${minpos2}-${maxpos2} |awk -v OFS="\t" '!a[$NF]++ && $NF!~/;/ && $NF~/^rs/{print $NF,$2}'|awk -F "\t" -v OFS="\t" -v gwasfile=$gwasfile -v qtlfile=$qtlfile  'BEGIN{while((getline < gwasfile )>0) a[$5]=1; while((getline < qtlfile) >0) b[$4]=0;}{if(($1 in a) && ($1 in b))  print $1,$2 }' >$tmpfold/common.snp.full2

### if no gwas leadsnp in eQTL file, use the neary-by SNPs. and set up the tag for this
leadsnp_included="Y"
commonlead=$(grep $leadsnp $tmpfold/common.snp.full |wc -l)

if [ "$commonlead" -ne 1 ] ; then
	echo "warning: the orignal lead snp $leadsnp are not found, use the nearby one:" >>$tmpfold/run.log
	leadsnp=`awk -F "\t" -v OFS="\t" -v pos=$position '$2>pos{print $1; exit 0;}' $tmpfold/common.snp.full ` 
	echo "$leadsnp as leadsp" >>$tmpfold/run.log
	leadsnp_included="N"
	
fi

grep -C 50 $leadsnp $tmpfold/common.snp.full2|cut -f 1 >$tmpfold/common.snp.50
snp50num=`wc -l $tmpfold/common.snp.50|awk '{print $1}' `

cut -f 1 $tmpfold/common.snp.full |cat - $tmpfold/common.snp.50 |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=1;next;}$1 in a {print $1}' - $tmpfold/common.snp.full2 >$tmpfold/common.snp 

### LD file from 1kg project ###

# cat $poppanel |grep -w $popshort |cut -f 1  >tmp/extracted.panel
poppanel=tmp/${request}.extracted.panel

$bcftools view -S $poppanel -O v $kgvcfpath ${chr}":"${minpos}"-"${maxpos}|awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=1;next;}/^#/ || $3 in a {print $0}' $tmpfold/common.snp -|$bcftools sort -O z -o $tmpfold/input.vcf.gz 
$bcftools index -t $tmpfold/input.vcf.gz
$emeraLD --matrix -i $tmpfold/input.vcf.gz --out $tmpfold/emerald

$bcftools view $tmpfold/input.vcf.gz |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=1;next;}/^#/ || $3 in a {print $0}' $tmpfold/common.snp.50 - |$bcftools sort -O z -o $tmpfold/input50.vcf.gz
$bcftools index -t $tmpfold/input50.vcf.gz
$emeraLD --matrix -i $tmpfold/input50.vcf.gz --out $tmpfold/emerald.50

cat $gwasfile |cut -f 5,7|awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - $tmpfold/common.snp  >$tmpfold/GWAS.z
cat $gwasfile |cut -f 5,7|awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - $tmpfold/common.snp.50  >$tmpfold/GWAS.z.50

genelist=`cat $qtlfile|awk '!a[$1]++ && NR>1{print $1}' `

# cd tmp/

cd $tmpfold/

while read -r gene; do 

prefix=${leadsnp}_${gene}
mkdir -p $prefix 
cd $prefix 

## make sure GWAS peak snp and gene are in eQTL dataset ## 
eqtlpeaksnp=$(grep $gene ../../../$qtlfile |grep $leadsnp |wc -l)
gwaspeaksnp=$(grep $leadsnp ../../../$gwasfile |wc -l)

if [ "$eqtlpeaksnp" -ne 1 ] || [ "$gwaspeaksnp" -ne 1 ] ; then
	echo "$prefix: no eQTL found for GWAS lead SNP $leadsnp and gene $gene, or no this leadsnp found in gwas file, abort......" >>$tmpfold/run.log
	#exit 0
	continue
fi

cat ../../../$qtlfile |awk -F "\t" -v OFS="\t" -v gene=$gene  '$1==gene{print $4,$11/$12}' |awk -F "\t" -v OFS="\t" '!a[$1]++' |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - ../common.snp >${prefix}_eQTL.z

### perform eCAVIAR
$eCAVIAR -l ../emerald.LD.txt -l ../emerald.LD.txt -z ../GWAS.z -z ${prefix}_eQTL.z -o ${prefix}_eCAVIAR >${prefix}_eCAVIAR.log 2>&1 

### perform eCAVIAR using up/down-stream 50 snps surrounding by index SNP

if [ "$snp50num" -ne 101 ] ; then
	echo "Warning not enough 50 snps for testing, abort......" >>$tmpfold/run.log
	#exit 0
	#continue
fi

cat ../../../$qtlfile |awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene{print $4,$11/$12}' |awk -F "\t" -v OFS="\t" '!a[$1]++' |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - ../common.snp.50 >${prefix}_eQTL.z.50

$eCAVIAR -l ../emerald.50.LD.txt -l ../emerald.50.LD.txt -z ../GWAS.z.50 -z ${prefix}_eQTL.z.50 -o ${prefix}_eCAVIAR.50 >${prefix}_eCAVIAR.50.log 2>&1 

#awk -F "\t" -v OFS="\t" -v gene=$gene -v leadsnp=$leadsnp -v type="ALL_SNPs" '{if(NR==1) print "Gene\tLeadsnp\tType"$0;else print gene,leadsnp,type,$0}'  ${prefix}_eCAVIAR_col >> $output
#awk -F "\t" -v OFS="\t" -v gene=$gene -v leadsnp=$leadsnp -v type="50_SNPs" '{if(NR==1) print "Gene\tLeadsnp\tType"$0;else print gene,leadsnp,type,$0}'  ${prefix}_eCAVIAR.50_col >> $output
awk -F "\t" -v OFS="\t" -v gene=$gene -v leadsnp=$leadsnp 'NR==FNR{a[$1]=$2"\t"$3;next;}{if(FNR==1) print "Gene\tLeadsnp",$0,"Prob_in_pCausalSet2\tCLPP2";else {if($1 in a) key=a[$1];else key="-\t-";print gene,leadsnp,$0,key}}' ${prefix}_eCAVIAR.50_col ${prefix}_eCAVIAR_col >>$output

cd ../
#rm -rf $prefix

done <<< "$genelist"

#awk -F "\t" -v OFS="\t" 'NR==FNR{a[$5]=$6"\t"$7;next;}{if(FNR==1) a["rsnum"]="gwas_pvalue\tgwas_z"; if($4 in a) print $0,a[$4]}' $gwasfile $qtlfile |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1"@"$3]=$2"\t"$4"\t"$5"\t"$6"\t"$7; next;}{if(FNR==1) a["gene_id@rsnum"]="Leadsnp\tProb_in_pCausalSet\tCLPP\tProb_in_pCausalSet2\tCLPP2";if($1"@"$4 in a) print $0,a[$1"@"$4]}' $output -  >result.txt
awk -F "\t" -v OFS="\t" 'NR==FNR{a[$5]=$6"\t"$7;next;}{if(FNR==1) a["rsnum"]="gwas_pvalue\tgwas_z"; if($4 in a) print $0,a[$4]}' ../../$gwasfile ../../$qtlfile |awk -F "\t" -v OFS="\t"  -v tag=$leadsnp_included 'NR==FNR{a[$1"@"$3]=$2"\t"$4"\t"$5"\t"$6"\t"$7"\t"tag; next;}{if(FNR==1) a["gene_id@rsnum"]="Leadsnp\tProb_in_pCausalSet\tCLPP\tProb_in_pCausalSet2\tCLPP2\tleadsnp_included";if($1"@"$4 in a) print $0,a[$1"@"$4]}' $output -  >result.txt

mv result.txt $output 

# echo $(pwd)
# rm -rf  $tmpfold