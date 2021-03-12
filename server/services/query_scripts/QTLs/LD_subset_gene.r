#setwd('/Volumes/data/NF_eQTL_ALL/CAVIAR_newGWAS_2019/LD/test/')
library(tidyverse)
args = commandArgs(trailingOnly=TRUE)
ldfile <- args[1]
tmpdir <- args[2]
ecaviarfile <- args[3]
ld.matrix <- read_delim(ldfile,delim = '\t',col_names = F,col_types = cols('X1'='c')) %>% rename(chr=X1,pos=X2,rsnum=X3,ref=X4,alt=X5)
ld.info <- ld.matrix %>% mutate(Seq=seq_along(chr)) %>%  select(rsnum,Seq)
ld.matrix <- ld.matrix %>% select(-c(chr,pos,rsnum,ref,alt)) %>% as.matrix


ecaviar <- read_delim(paste0(tmpdir,'/',ecaviarfile),delim='\t',col_names=F) 
colnames(ecaviar) <- c("gene_id","leadsnp","leadsnpincluded","rsnum","type")

genelist <- unique(ecaviar$gene_id)

for (gene in genelist){
  
  ld.matrix.seq <- NULL
  ld.matrix.seq2 <- NULL
  
  filename1 <- paste0(tmpdir,'/',gene,"/emerald.LD.txt")
  snplist <- ecaviar %>% filter(gene_id==gene,type=="ALL") %>% select(rsnum)
  rsindex <- snplist %>% left_join(ld.info) %>% pull(Seq)
  ld.matrix.seq <- ld.matrix[rsindex,rsindex]
  write.table(ld.matrix.seq, file=filename1, row.names=FALSE, col.names=FALSE,sep = '\t')
  
  filename2 <- paste0(tmpdir,'/',gene,"/emerald.50.LD.txt")
  snplist2 <- ecaviar %>% filter(gene_id==gene,type=="SNP50") %>% select(rsnum)
  rsindex2 <- snplist2 %>% left_join(ld.info) %>% pull(Seq)
  ld.matrix.seq2 <- ld.matrix[rsindex2,rsindex2]
  write.table(ld.matrix.seq2, file=filename2, row.names=FALSE, col.names=FALSE,sep = '\t')
}
### LEAVE EMPTY LINE BELOW ###
