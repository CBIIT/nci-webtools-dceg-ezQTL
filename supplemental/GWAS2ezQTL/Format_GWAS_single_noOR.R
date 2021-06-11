# 1: required R package
library(tidyverse)
args = commandArgs(trailingOnly=TRUE)

# 2: possible names for each column for each of the data files in the NHGRI-EBI GWAS Catalog
chr<- c('chromosome','Chromosome','CHR','#CHR','#CHROM','Chr')
pos <- c('Pos','base_pair_location','Position','POS','pos')
ref <- c('other_allele','REF','Allele1','NonEffectAllele','Baseline','NEA')
alt <- c('effect_allele','EffectAllele','EA','ALT','Allele2')
rsnum <- c('ID','rsnum','variant_id','#MARKER','OrigSNPname','SNP')
pvalue <- c('p_value','overall_pvalue','P','PVALUE','pval','P-value')
effect <- c('beta','BETA','EFFECT1','Effect','overall_OR')
se <- c('standard_error','overall_SE','SE','STDERR','sebeta')

# 3: set gwasfile variable to the first argument
gwasfile <- args[1]

# 4: trait_file variable (will become first column in output table) and short_file_name (will be used to name the output file)
trait_file <- str_remove(str_remove(gwasfile,'.*/GWAS_'),'_[^_]*_[0-9]*.tsv.gz$')
short_file_name <- str_remove(gwasfile,'.*/')

# 5: read in the gwasfile that you wish to format
gwas_data <- read_delim(gwasfile,delim = '\t',col_names = T)

# 6: Name each of the columns what it is required to be for GWAS input data in ezQTL
colnames(gwas_data) [colnames(gwas_data) %in% chr] <- 'chr'
colnames(gwas_data) [colnames(gwas_data) %in% pos] <- 'pos'
colnames(gwas_data) [colnames(gwas_data) %in% ref] <- 'ref'
colnames(gwas_data) [colnames(gwas_data) %in% alt] <- 'alt'
colnames(gwas_data) [colnames(gwas_data) %in% rsnum] <- 'rsnum'
colnames(gwas_data) [colnames(gwas_data) %in% pvalue] <- 'pvalue'
colnames(gwas_data) [colnames(gwas_data) %in% effect] <- 'effect'
colnames(gwas_data) [colnames(gwas_data) %in% se] <- 'se'

# prints the trait_file variable so that you can keep track of where the script is in processing (example in the logs output and error files) 
print(trait_file)

# 7: Add the trait_file variable to the table as the first column, ‘trait’, and select for the required columns that have now been renamed: trait, chr, pos, ref, alt, rsnum, pvalue, effect, se
gwas_data <- gwas_data %>% mutate(trait = trait_file) %>% select(trait,chr,pos,ref,alt,rsnum,pvalue,effect,se)

# 8: zscore calculation and select columns needed to run GWAS data through ezQTL
gwas_data <- gwas_data %>% mutate(zscore=effect/se) %>% select(trait,chr,pos,ref,alt,rsnum,pvalue,zscore,effect,se)

# 9: Write to a file in a formatted directory
gwas_data %>% write_delim(paste0('../formated/test/GWAS_NHGRI_EBI_',short_file_name),delim = '\t',col_names = T)
