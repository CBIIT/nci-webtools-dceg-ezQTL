#!/bin/sh
## download software from here: http://genetics.cs.ucla.edu/caviar/
set -e 

gwasfile=$1
qtlfile=$2
leadsnp=$3
#gene=$4
dist=$4
#popshort=$5
#ldfile=$5
ldinfo=$5
request=$6
dataPath=$7
scriptPath=$8
outputPath=$9

LD_subset_gene="${scriptPath}/LD_subset_gene.r"


# localpath=$(pwd)
output=$outputPath/eCAVIAR.txt
rm -rf $output 
touch $output

#TMPDIR=/lscratch/$SLURM_JOB_ID 
# tmpfold=$(mktemp -d -t )
# echo $tmpfold
# echo $tmpfold >run.log
# cd $tmpfold

tmpfold=$outputPath/ECAVIAR_TMP
mkdir $tmpfold

tmpinfo=`grep -m 1 $leadsnp $gwasfile` 
# echo $tmpinfo >>run.log
chr=`echo $tmpinfo |awk '{print $1}' ` 
position=`echo $tmpinfo |awk '{print $2}'` 
minpos=$(( position - dist ))
if [ "$minpos" -lt 0 ]; then 
  minpos=0
fi 

#echo "ztw"

maxpos=$(( position + dist ))
dist2=1000000
minpos2=$(( position - dist2 ))
if [ "$minpos2" -lt 0 ]; then 
  minpos2=0
fi 

maxpos2=$(( position + dist2 ))

## define file for LD calculation ##
# kgpath=${vQTLfolder}"/1kginfo/"
kgpath="${dataPath}/1kginfo/"
kgvcfpath=${kgpath}"ALL.chr"${chr}".phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz"
# poppanel=${kgpath}"integrated_call_samples_v3.20130502.ALL.panel"
#emerald="/data/zhangt8/NF_eQTL_ALL/vQTL/tools/emeraLD/bin/emeraLD"
multallelic=${kgpath}"multiallelic_variants.txt"

kgsnp=${kgpath}"/SNP_1kginfo.txt.gz"

### remove multivariants for GWAS ###
cp $multallelic $tmpfold/multiallelic_variants.txt
cut -f 4-8 $qtlfile |sort|uniq |awk 'a[$1]++{print $1}'|sort|uniq >>$tmpfold/multiallelic_variants.txt
cut -f 1-5 $gwasfile |sort|uniq |awk 'a[$5]++{print $5}'|sort|uniq  >>$tmpfold/multiallelic_variants.txt

### check if any QTL SNPs overlap with GWAS in the SNP region ###
tabix $kgsnp ${chr}:${minpos}-${maxpos} |awk -F "\t" -v OFS="\t" '!a[$NF]++ && $NF!~/;/ && $NF~/^rs/{print $NF,$2}'|awk -F "\t" -v OFS="\t" -v gwasfile=$gwasfile -v qtlfile=$qtlfile  'BEGIN{while((getline < "multiallelic_variants.txt" )>0) x[$1]=1; while((getline < gwasfile )>0) a[$5]=1; while((getline < qtlfile) >0) b[$4]=0;}{if(($1 in a) && ($1 in b) && (!($1 in x)))  print $1,$2 }' >$tmpfold/common.snp.full

test1=$(wc -l ${tmpfold}/common.snp.full|awk '{print $1}')
#echo $test1
if [ "$test1" -eq 0 ] ; then
  echo "No overlapping SNPs among QTLs, GWAS and 1kg SNPs" >>$tmpfold/run.log
  exit 0 
fi


### select only genes with enough overalping SNPs (default >10) ###
awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$2;next;} $4 in a {print $1,$4,a[$4]}' $tmpfold/common.snp.full $qtlfile|sort -k1,1 -k3,3n >$tmpfold/common.snp.full.gene
cut -f 1 $tmpfold/common.snp.full.gene |uniq -c  |awk '$1>10{print $2}' |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=1;next;}$1 in a {print $0}' - $tmpfold/common.snp.full.gene  >$tmpfold/common.snp.full.gene2
cut -f 1 $tmpfold/common.snp.full.gene2 |uniq -c |awk -v OFS="\t"  '{print $2,$1}' >>$tmpfold/run.log

test2=$(wc -l ${tmpfold}/common.snp.full.gene2|awk '{print $1}')
#echo $test2
if [ "$test2" -eq 0 ] ; then
  echo "No overlapping SNPs among QTLs, GWAS and 1kg SNPs with the criteria: n>10" >>$tmpfold/run.log
  exit 0 
fi

mv $tmpfold/common.snp.full.gene2 $tmpfold/common.snp.full.gene

## large region ##
tabix $kgsnp ${chr}:${minpos2}-${maxpos2} |awk -F "\t" -v OFS="\t" '!a[$NF]++ && $NF!~/;/ && $NF~/^rs/{print $NF,$2}'|awk -F "\t" -v OFS="\t" -v gwasfile=$gwasfile -v qtlfile=$qtlfile  'BEGIN{while((getline < "multiallelic_variants.txt" )>0) x[$1]=1; while((getline < gwasfile )>0) a[$5]=1; while((getline < qtlfile) >0) b[$4]=0;}{if(($1 in a) && ($1 in b) && (!($1 in x)))  print $1,$2 }' >$tmpfold/common.snp.full2
awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$2;next;} $4 in a {print $1,$4,a[$4]}' $tmpfold/common.snp.full2 $qtlfile|sort -k1,1 -k3,3n >$tmpfold/common.snp.full.gene.tmp
cut -f 1 $tmpfold/common.snp.full.gene |uniq |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=1;next;}$1 in a {print $0}' - $tmpfold/common.snp.full.gene.tmp >$tmpfold/common.snp.full.gene2
rm $tmpfold/common.snp.full.gene.tmp



### select final list of SNPs for each gene ###

genelist=`cat $tmpfold/common.snp.full.gene |cut -f 1|uniq `
leadsnp_ori=$leadsnp
rm -rf $tmpfold/ecaviar_list.txt 

while read -r gene; do
  leadsnp=$leadsnp_ori
  leadsnp_included="Y"
  commonlead=$(awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene' $tmpfold/common.snp.full.gene |grep $leadsnp |wc -l)

  if [ "$commonlead" -ne 1 ] ; then
    echo -n "Warning: the orignal lead snp $leadsnp are not found for $gene, use the nearby one:" >>$tmpfold/run.log
    leadsnp=`awk -F "\t" -v OFS="\t" -v pos=$position -v gene=$gene 'BEGIN{tag=0;}$1==gene{ if($3<pos) {tag=1;next;} if($3>pos && tag==1){print $2; exit 0;}}' $tmpfold/common.snp.full.gene ` 
    echo "$leadsnp as leadsp" >>$tmpfold/run.log
    leadsnp_included="N"
  fi

  if [ "$leadsnp" == "" ] ; then
    echo "no leadsnp found for $gene" >>$tmpfold/run.log
    #exit 0 
    continue
  fi

  mkdir -p $tmpfold/$gene

  awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene{print $2}' $tmpfold/common.snp.full.gene2 | grep -C 50 $leadsnp >$tmpfold/$gene/common.snp.50
  snp50num=`wc -l $tmpfold/$gene/common.snp.50|awk '{print $1}' `

  awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene{print $2}' $tmpfold/common.snp.full.gene |cat - $tmpfold/$gene/common.snp.50 |awk -F "\t" -v OFS="\t" -v gene=$gene 'NR==FNR{a[$1]=1;next;}$1==gene && ($2 in a) {print $2}' - $tmpfold/common.snp.full.gene2 >$tmpfold/$gene/common.snp

 
  cat $gwasfile |cut -f 5,7|awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - $tmpfold/$gene/common.snp  >$tmpfold/$gene/GWAS.z
  cat $gwasfile |cut -f 5,7|awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - $tmpfold/$gene/common.snp.50 >$tmpfold/$gene/GWAS.z.50
  cat $qtlfile |awk -F "\t" -v OFS="\t" -v gene=$gene  '$1==gene{print $4,$11/$12}' |awk -F "\t" -v OFS="\t" '!a[$1]++' |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - $tmpfold/$gene/common.snp >$tmpfold/$gene/eQTL.z
  cat $qtlfile |awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene{print $4,$11/$12}' |awk -F "\t" -v OFS="\t" '!a[$1]++' |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}{print a[$1]}' - $tmpfold/$gene/common.snp.50 >$tmpfold/$gene/eQTL.z.50

  cat $gwasfile |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}($5 in a)||FNR==1 {print $0}' $tmpfold/$gene/common.snp - >$tmpfold/$gene/GWAS.txt
  cat $qtlfile |awk -F "\t" -v OFS="\t" -v gene=$gene  'NR==1||$1==gene{print $0}' |awk -F "\t" -v OFS="\t" '!a[$4]++' |awk -F "\t" -v OFS="\t" 'NR==FNR{a[$1]=$0;next;}($4 in a)||FNR==1{print $0}'  $tmpfold/$gene/common.snp - >$tmpfold/$gene/eQTL.txt


  if [ "$snp50num" -ne 101 ] ; then
    echo "Warning not enough 50 snps for testing for $gene, continue......" >>$tmpfold/run.log
    #exit 0
    #continue
  fi

  cat $tmpfold/$gene/common.snp|awk -F "\t" -v OFS="\t" -v gene=$gene -v leadsnp=$leadsnp  -v leadsnp_included=$leadsnp_included '{print gene,leadsnp,leadsnp_included,$1,"ALL"}' >> $tmpfold/ecaviar_list.txt
  cat $tmpfold/$gene/common.snp.50|awk -F "\t" -v OFS="\t" -v gene=$gene -v leadsnp=$leadsnp  -v leadsnp_included=$leadsnp_included '{print gene,leadsnp,leadsnp_included,$1,"SNP50"}' >> $tmpfold/ecaviar_list.txt     

done <<< "$genelist"

if [ ! -f "$tmpfold/ecaviar_list.txt" ]; then
    echo "ecaviar_list.txt does not exist" >>$tmpfold/run.log
    exit 0
fi


### LD file from 1kg project ###

if [ ! -f "$ldinfo" ]; then
    # cat $poppanel |grep -w $ldinfo |cut -f 1  >${request}.extracted.panel
    # bcftools view -S tmp/${request}.extracted.panel -O v $kgvcfpath ${chr}":"${minpos}"-"${maxpos}|awk -F "\t" -v OFS="\t" 'NR==FNR{a[$4]=1;next;}/^#/ || $3 in a {print $0}' $tmpfold/ecaviar_list.txt -|bcftools sort -O z -o $tmpfold/${request}.input.vcf.gz 
    # bcftools index -t $tmpfold/${request}.input.vcf.gz 
    emeraLD --matrix -i ${outputPath}/input.vcf.gz --stdout --extra |sed 's/:/\t/' |bgzip > $tmpfold/emerald.LD.gz
    ldinfo=$tmpfold/emerald.LD.gz
    
fi

#Rscript to generate the LD informaiton for each genes
Rscript $LD_subset_gene ${ldinfo} $tmpfold ecaviar_list.txt


genelist=`cat $tmpfold/ecaviar_list.txt |cut -f 1|uniq `

cd $tmpfold

while read -r gene; do 
  cd $gene

  ## make sure GWAS peak snp and gene are in eQTL dataset ## 
  eqtlpeaksnp=$(grep $leadsnp eQTL.z|wc -l)
  gwaspeaksnp=$(grep $leadsnp GWAS.z |wc -l)

  if [ "$eqtlpeaksnp" -ne 1 ] || [ "$gwaspeaksnp" -ne 1 ] ; then
    echo "$prefix: no eQTL found for GWAS lead SNP $leadsnp and gene $gene, or no this leadsnp found in gwas file, abort......" >>../run.log
    #exit 0
    cd ../
    continue
  fi

  # echo "eCAVIAR for $gene ------------------------ALL"
  eCAVIAR -l emerald.LD.txt -l emerald.LD.txt -z GWAS.z -z eQTL.z -o eCAVIAR >>../run.log 2>&1 

  # echo "eCAVIAR for $gene ------------------------SNP50"
  eCAVIAR -l emerald.50.LD.txt -l emerald.50.LD.txt -z GWAS.z.50 -z eQTL.z.50 -o eCAVIAR.50 >>../run.log 2>&1 

  leadsnp=`cat ../ecaviar_list.txt|cut -f 1-3 |sort|uniq|awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene{print $2}'`
  leadsnp_included=`cat ../ecaviar_list.txt|cut -f 1-3 |sort|uniq|awk -F "\t" -v OFS="\t" -v gene=$gene '$1==gene{print $3}'`

  awk -F "\t" -v OFS="\t" -v gene=$gene -v leadsnp=$leadsnp 'NR==FNR{a[$1]=$2"\t"$3;next;}{if(FNR==1) print "Gene\tLeadsnp",$0,"Prob_in_pCausalSet2\tCLPP2";else {if($1 in a) key=a[$1];else key="-\t-";print gene,leadsnp,$0,key}}' eCAVIAR.50_col eCAVIAR_col >eCAVIAR_out.txt
  awk -F "\t" -v OFS="\t" 'NR==FNR{a[$5]=$6"\t"$7;next;}{if(FNR==1) a["rsnum"]="gwas_pvalue\tgwas_z"; if($4 in a) print $0,a[$4]}' GWAS.txt eQTL.txt |awk -F "\t" -v OFS="\t"  -v tag=$leadsnp_included -v leadsnp_ori=$leadsnp_ori 'NR==FNR{a[$1"@"$3]=$2"\t"$4"\t"$5"\t"$6"\t"$7"\t"tag"\t"leadsnp_ori; next;}{if(FNR==1) a["gene_id@rsnum"]="Leadsnp\tProb_in_pCausalSet\tCLPP\tProb_in_pCausalSet2\tCLPP2\tleadsnp_included\tleadsnp_ori";if($1"@"$4 in a) print $0,a[$1"@"$4]}' eCAVIAR_out.txt -  >eCAVIAR_out.txt2
  cd ../
  #rm -rf $pref
    
done <<< "$genelist"

cat */eCAVIAR_out.txt2 |awk -F "\t" -v OFS="\t" '!a[$0]++' > $output 
cp run.log ../ecaviar.run.log

# rm -rf  $tmpfold
