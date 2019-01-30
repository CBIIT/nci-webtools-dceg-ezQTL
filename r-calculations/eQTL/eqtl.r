eqtl_main <- function(workDir, genoFile, exprFile, assocFile, gwasFile) {
  library(tidyverse)
  library(hrbrthemes)
  library(scales)
  library(ggrepel)
  library(forcats)
  library(jsonlite)

  dataSource <- eqtl(workDir, genoFile, exprFile, assocFile, gwasFile)
  return(dataSource)
}

eqtl <- function(workDir, genoFile, exprFile, assocFile, gwasFile) {
  setwd(workDir)
  
  gdatafile <- paste0('uploads/', genoFile)
  edatafile <- paste0('uploads/', exprFile)
  qdatafile <- paste0('uploads/', assocFile)

  gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
  edata <- read_delim(edatafile,delim = "\t",col_names = T)
  qdata <- read_delim(qdatafile,delim = "\t",col_names = T,col_types = cols(variant_id='c'))
  qdata <- qdata %>% 
    arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% 
    group_by(gene_id,variant_id,rsnum,ref,alt) %>% 
    slice(1) %>% 
    ungroup()

  chromosome <- qdata$chr[1]

  rcdatafile <- paste0('Recombination_Rate_CEU/CEU-',chromosome,'-final.txt.gz')
  rcdata <- read_delim(rcdatafile,delim = "\t",col_names = T)
  colnames(rcdata) <- c('pos','rate','map','filtered')
  rcdata$pos <- as.integer(rcdata$pos)

  # calculate gene expression boxplots
  tmp <- qdata %>% 
    group_by(gene_id,gene_symbol) %>% 
    arrange(pval_nominal) %>% 
    slice(1) %>% 
    ungroup() %>% 
    arrange(pval_nominal) %>% 
    slice(1:15)

  edata_boxplot <- edata %>% 
    gather(Sample,exp,-(chr:gene_id)) %>% 
    right_join(tmp %>% 
    select(gene_id,gene_symbol) %>% 
    unique())

  edata_boxplot <- edata_boxplot %>% 
    left_join(edata_boxplot %>% group_by(gene_id) %>% summarise(mean=mean(exp))) %>% 
    left_join(tmp %>% select(gene_id,pval_nominal)) %>% 
    mutate(gene_symbol=fct_reorder(gene_symbol,(pval_nominal)))

  gene_expression_data <- list(setNames(as.data.frame(edata_boxplot),c("chr","start","end","gene_id","Sample","exp","gene_symbol","mean","pval_nominal")))

  # calculate locus zoom plot

  tmp <- qdata %>% 
    arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% 
    slice(1)
  default_gene <- tmp$gene_id
  default_vairnat <- tmp$variant_id
  default_rsnum <- tmp$rsnum
  defaul_info <-tmp %>% 
    select(gene_id:alt)

  qdata_region <- qdata %>% 
    filter(gene_id==default_gene)
  rcdata_region <- rcdata %>% 
    filter(pos<=max(qdata_region$pos),pos>=min(qdata_region$pos))
  rcdata_region_data <- list(setNames(as.data.frame(rcdata_region),c("pos","rate","map","filtered")))
  qdata_top_annotation <- qdata_region %>% 
    filter(variant_id==default_vairnat)
  qdata_top_annotation_data <- list(setNames(as.data.frame(qdata_top_annotation),c("gene_id","gene_symbol","variant_id","rsnum","chr","pos","ref","alt","tss_distance","pval_nominal","slope","slope_se")))

  source('eQTL/emeraLD2R.r')
  in_path <- paste0(workDir, '/eQTL/chr1_149039120_152938045.vcf.gz')
  in_bin <- '/usr/local/bin/emeraLD'
  # in_bin <- '/usr/bin/emeraLD'
  regionLD <- paste0(chromosome,":",min(qdata_region$pos),"-",max(qdata_region$pos))
  getLD <- emeraLD2R(path = in_path, bin = in_bin) 
  ld_data <- getLD(region=regionLD)

  index <- which(ld_data$info$id==default_rsnum|str_detect(ld_data$info$id,paste0(";",default_rsnum))|str_detect(ld_data$info$id,paste0(default_rsnum,";")))
  ld_info <- as.data.frame(ld_data$Sigma[,index])
  colnames(ld_info) <- "R2"
  rownames(ld_info) <- ld_data$info$id

  qdata_region$R2 <- (ld_info[qdata_region$rsnum,"R2"])^2

  locus_zoom_data <- list(setNames(as.data.frame(qdata_region),c("gene_id","gene_symbol","variant_id","rsnum","chr","pos","ref","alt","tss_distance","pval_nominal","slope","slope_se","R2")))
  
  # initialize GWAS data as empty until data file detected
  gwas_example_data <- list(c())
  # return outputs in list
  dataSource <- c(gene_expression_data, locus_zoom_data, rcdata_region_data, qdata_top_annotation_data, gwas_example_data)

  # return outputs in list with GWAS data
  if (!identical(gwasFile, 'false')) {
    gwasdatafile <- paste0('uploads/', gwasFile)
    gwasdata <- read_delim(gwasdatafile,delim = "\t",col_names = T)
    gwas_example_data <- list(setNames(as.data.frame(gwasdata),c("chr","pos","ref","alt","rs","pvalue")))
    dataSource <- c(gene_expression_data, locus_zoom_data, rcdata_region_data, qdata_top_annotation_data, gwas_example_data)
  }

  return(dataSource)
}
