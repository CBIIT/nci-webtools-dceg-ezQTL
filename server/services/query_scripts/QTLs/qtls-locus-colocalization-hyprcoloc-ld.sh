#!/bin/bash
## download software from here: http://genetics.cs.ucla.edu/caviar/
set -e 

leadsnp=$1
chr=$2
position=$3
dist=$4
# popshort=$5
request=$5
workdir=$6
bucket=$7
# request=$6
# envfile=$7
# source $envfile

#eCAVIAR

prefix=${workdir}/tmp/${request}/${request}.${leadsnp}_ldtmp
mkdir -p $prefix 
cd $prefix 

minpos=$(( position - dist ))
if [ "$minpos" -lt 0 ]; then 
	minpos=0
fi 

maxpos=$(( position + dist ))


## define file for LD calculation ##
# kgpath=$vQTLfolder"/1kginfo/"
# echo $(pwd)
kgpath="s3://${bucket}/ezQTL/1kginfo/"
kgvcfpath=${kgpath}"ALL.chr"${chr}".phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz"
# poppanel=${kgpath}"integrated_call_samples_v3.20130502.ALL.panel"

### LD file from 1kg project ###

# cat $poppanel |grep -w $popshort |cut -f 1  >extracted.panel
poppanel=${workdir}/tmp/${request}/${request}.extracted.panel

bcftools view -S $poppanel -O z -o input.vcf.gz  $kgvcfpath ${chr}":"${minpos}"-"${maxpos}
bcftools index -t input.vcf.gz
#$emeraLD --matrix -i input.vcf.gz --stdout --extra | tr ':' '\t' |bgzip > ../${output}.LD.gz
## fixed the bugs when the snps alternative allele including :, such as <INS:ME:ALU> esv3607152
emeraLD --matrix -i input.vcf.gz --stdout --extra |sed 's/:/\t/' |bgzip > ../${request}.LD.gz

cd ../../
rm -rf $prefix 

