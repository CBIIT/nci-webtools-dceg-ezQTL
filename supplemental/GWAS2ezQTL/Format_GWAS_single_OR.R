# 1: required R package
library(tidyverse)
args = commandArgs(trailingOnly=TRUE)

# 2: possible names for each column for each of the data files in the NHGRI-EBI GWAS Catalog
chr<- c('chromosome','Chromosome','CHR','#CHR','#CHROM','Chr')
pos <- c('Pos','base_pair_location','Position','POS','pos')
ref <- c('other_allele','REF','Allele1','NonEffectAllele','Baseline','NEA')
alt <- c('effect_allele','EffectAllele','Effect','EA','ALT','Allele2')
rsnum <- c('ID','rsnum','variant_id','#MARKER','OrigSNPname','SNP')
pvalue <- c('p_value','overall_pvalue','P','PVALUE','pval','P-value')
effect <- c('beta','BETA','EFFECT1','Effect')
se <- c('standard_error','overall_SE','SE','STDERR','sebeta')
odds_ratio <- c('odds_ratio','overall_OR','OR')

# 3: set gwasfile variable to the first argument
gwasfile <- args[1]

# 4: trait_file variable (will become first column in output table) and short_file_name (will be used to name the output file)
trait_file <- str_remove(str_remove(gwasfile,'.*/GWAS_'),'_[^_]*_[0-9]*.tsv.gz$')
short_file_name <- str_remove(gwasfile,'.*/')

# 5: read in the gwasfile that you wish to format
gwas_data <- read_delim(gwasfile,delim = '\t',col_names = T,col_types = cols('chromosome'='c'))

# 6: Name each of the columns what it is required to be for GWAS input data in ezQTL
colnames(gwas_data) [colnames(gwas_data) %in% chr] <- 'chr'
colnames(gwas_data) [colnames(gwas_data) %in% pos] <- 'pos'
colnames(gwas_data) [colnames(gwas_data) %in% ref] <- 'ref'
colnames(gwas_data) [colnames(gwas_data) %in% alt] <- 'alt'
colnames(gwas_data) [colnames(gwas_data) %in% rsnum] <- 'rsnum'
colnames(gwas_data) [colnames(gwas_data) %in% pvalue] <- 'pvalue'
colnames(gwas_data) [colnames(gwas_data) %in% effect] <- 'effect'
colnames(gwas_data) [colnames(gwas_data) %in% se] <- 'se'
colnames(gwas_data) [colnames(gwas_data) %in% odds_ratio] <- 'odds_ratio'

# prints the trait_file variable so that you can keep track of where the script is in processing (example in the logs output and error files) 
  print(trait_file)

# 7: Add the trait_file variable to the table as the first column, ‘trait’, and select for the required columns that have now been renamed: trait, chr, pos, ref, alt, rsnum, pvalue, effect, se, odds_ratio
  gwas_data <- gwas_data %>% mutate(trait = trait_file) %>% select(trait,chr,pos,ref,alt,rsnum,pvalue,effect,se,odds_ratio) 

# 8: determination of and calculations for effect, zscore, and se 
# effect
if(sum(is.na(gwas_data$effect)) > 0){
  if((sum(gwas_data$odds_ratio <0)) >= 1){
    gwas_data$effect <- gwas_data$odds_ratio}
  else{
    gwas_data$effect <- log(gwas_data$odds_ratio)}
}else{
  gwas_data$effect <- gwas_data$effect}

  #print(gwas_data$effect)

# zscore
gwas_data <- gwas_data %>% mutate(zscore=if_else(effect<0,-1*abs(qnorm(pvalue/2)),abs(qnorm(pvalue/2)))) %>% select(trait,chr,pos,ref,alt,rsnum,pvalue,zscore,effect,se)

# se
if(sum(is.na(gwas_data$se)) > 0){
  gwas_data$se <-gwas_data$effect/gwas_data$zscore
}else{
  gwas_data$se <- gwas_data$se}

# 9: select the columns needed for GWAS data in ezQTL
gwas_data <- gwas_data %>% select(trait,chr,pos,ref,alt,rsnum,pvalue,zscore,effect,se)

# 10: Write to a file in a formatted directory
gwas_data %>% write_delim(paste0('../formated/GWAS_NHGRI_EBI/GWAS_NHGRI_EBI_',short_file_name),delim = '\t',col_names = T)
