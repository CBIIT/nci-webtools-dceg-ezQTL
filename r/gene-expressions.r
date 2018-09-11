# options(warn=-1)

setwd('C:\\Users\\jiangk3\\Desktop\\vQTL R_package')

library(tidyverse)
library(hrbrthemes)
library(scales)
library(ggrepel)
library(forcats)
library(jsonlite)


locus <- "1q21_3"
gdatafile <- paste0(locus,'.genotyping.txt')
edatafile <- paste0(locus,'.expression.txt')
qdatafile <- paste0(locus,'.eQTL.txt')

gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
edata <- read_delim(edatafile,delim = "\t",col_names = T)
qdata <- read_delim(qdatafile,delim = "\t",col_names = T,col_types = cols(variant_id='c'))
qdata <- qdata %>% arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% group_by(gene_id,variant_id,rsnum,ref,alt) %>% slice(1) %>% ungroup()

chromosome <- qdata$chr[1]





rcdatafile <- paste0('Recombination_Rate_CEU/CEU-',chromosome,'-final.txt.gz')
rcdata <- read_delim(rcdatafile,delim = "\t",col_names = T)
colnames(rcdata) <- c('pos','rate','map','filtered')
rcdata$pos <- as.integer(rcdata$pos)



tmp <- qdata %>% group_by(gene_id,gene_symbol) %>% arrange(pval_nominal) %>% slice(1) %>% ungroup() %>% arrange(pval_nominal) %>% slice(1:15)

edata_boxplot <- edata %>% gather(Sample,exp,-(chr:gene_id)) %>% right_join(tmp %>% select(gene_id,gene_symbol) %>% unique())

edata_boxplot <- edata_boxplot %>% left_join(
  edata_boxplot %>% group_by(gene_id) %>% summarise(mean=mean(exp))
) %>% 
  left_join(tmp %>% select(gene_id,pval_nominal)) %>% 
  mutate(gene_symbol=fct_reorder(gene_symbol,(pval_nominal)))

setNames(as.data.frame(edata_boxplot),c("chr","start","end","gene_id","Sample","exp","gene_symbol","mean","pval_nominal"))

#edata_boxplot_json <- toJSON(setNames(as.data.frame(edata_boxplot),c("chr","start","end","gene_id","Sample","exp","gene_symbol","mean","pval_nominal")))

#edata_boxplot_json
