eqtl_main <- function(workDir, assocFile, exprFile, genoFile, gwasFile, request, select_pop, select_gene, recalculate) {
  setwd(workDir)
  library(tidyverse)
  # library(forcats)
  library(jsonlite)

  ## parameters define ##
  ## set default population to EUR
  if (identical(select_pop, 'false')) {
    select_pop <- "EUR"
  }
  if (identical(select_gene, 'false')) {
    gene <- NULL
  } else {
    gene <- select_gene
  }
  rsnum <- NULL

  ## load 1kg pop panel file ##
  kgpanel <- read_delim('eQTL/integrated_call_samples_v3.20130502.ALL.panel',delim = '\t',col_names = T) %>% 
    select(sample:gender)
  popinfo <- kgpanel %>% 
    select(pop,super_pop) %>% 
    unique()

  ## read and parse association data file ###
  qdatafile <- paste0('tmp/', assocFile)
  qdata <- read_delim(qdatafile,delim = "\t",col_names = T,col_types = cols(variant_id='c'))
  qdata <- qdata %>% 
    arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% 
    group_by(gene_id,variant_id,rsnum,ref,alt) %>% 
    slice(1) %>% 
    ungroup()

  qdata_tmp <- qdata %>% 
    group_by(gene_id,gene_symbol) %>% 
    arrange(pval_nominal) %>% 
    slice(1) %>% 
    ungroup() %>% 
    arrange(pval_nominal)

  # added code to isolate gene_symbols and put in variable
  # gene_symbols <- list(qdata_tmp$gene_symbol)
  gene_list <- qdata_tmp %>%
    select(gene_id, gene_symbol) 
  gene_list_data <- list(setNames(as.data.frame(gene_list),c("gene_id","gene_symbol")))

  ## call calculations for eqtl modules: locuszoom and gene expressions ##
  ## locuszoom calculations ##
  eqtl_locuszoom_data <- eqtl_locuszoom(workDir, qdata, qdata_tmp, kgpanel, select_pop, gene, rsnum, request)
  locus_zoom_data <- eqtl_locuszoom_data[[1]]
  rcdata_region_data <- eqtl_locuszoom_data[[2]]
  qdata_top_annotation_data <- eqtl_locuszoom_data[[3]]
  ## gene expressions calculations ##
  gene_expressions_data <- eqtl_gene_expressions(workDir, qdata_tmp, exprFile, genoFile)
  ## locuszoom gwas data ##
  gwas_example_data <- eqtl_gwas_example(workDir, gwasFile)
  ## combine results from eqtl modules calculations and return ##
  dataSourceJSON <- c(toJSON(list(info=list(recalculate=recalculate, gene_list=list(data=gene_list_data), inputs=list(association_file=assocFile, expression_file=exprFile, genotype_file=genoFile, gwas_file=gwasFile, select_pop=select_pop, select_gene=select_gene, request=request)), gene_expressions=list(data=gene_expressions_data), locuszoom=list(data=locus_zoom_data, rc=rcdata_region_data, top=qdata_top_annotation_data), gwas=list(data=gwas_example_data))))
  ## remove all generated temporary files in the /tmp directory

  # unlink(paste0('tmp/*',request,'*'))
  
  # return(dataSource)
  return(dataSourceJSON)
}

eqtl_locuszoom <- function(workDir, qdata, qdata_tmp, kgpanel, select_pop, gene, rsnum, request) { 
  chromosome <- unique(qdata$chr)
  minpos <- min(qdata$pos)
  maxpos <- max(qdata$pos)

  kgvcfpath <- paste0(workDir, '/eQTL/ALL.chr', chromosome, '.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz')

  in_path <- paste0(workDir, '/tmp/',request,'.','chr',chromosome,'_',minpos,'_',maxpos,'.vcf.gz')
  cmd <- paste0('bcftools view -O z -o ', in_path, ' ', kgvcfpath,' ', chromosome, ":", minpos, '-',maxpos)
  system(cmd)

  cmd <- paste0('bcftools index ', in_path)
  system(cmd)

  popshort <- "CEU"  ### need to find the superpop recomendation data 

  cmd = paste0("tabix Recombination_Rate/",popshort,".txt.gz ",chromosome,":",minpos,"-",maxpos," >tmp/",request,'.',"rc_temp",".txt")
  system(cmd)
  rcdata <- read_delim(paste0('tmp/',request,'.','rc_temp','.txt'),delim = "\t",col_names = F)
  colnames(rcdata) <- c('chr','pos','rate','map','filtered')
  rcdata$pos <- as.integer(rcdata$pos)

  ### main funciton for the LD calculation 

  if (is.null(gene)) {
    gene <- qdata %>% 
      arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% 
      slice(1) %>% 
      pull(gene_id)
  }

  if (is.null(rsnum)) {
    tmp <-  qdata %>% 
      filter(gene_id==gene) %>% 
      arrange(pval_nominal) %>% 
      slice(1) 
    variant <- tmp %>% 
      pull(variant_id)
    rsnum <- tmp %>% 
      pull(rsnum)
    info <- tmp %>% 
      select(gene_id:alt)
  } else {
    rsnum0 <- rsnum
    tmp <-  qdata %>% 
      filter(gene_id==gene, rsnum==rsnum0) 
    variant <- tmp %>% 
      pull(variant_id)
    #rsnum <- tmp %>% pull(rsnum)
    info <- tmp %>% 
      select(gene_id:alt)
  }

  ### limit data region to plot ###
  qdata_region <- qdata %>% 
    filter(gene_id==gene)
  rcdata_region <- rcdata %>% 
    filter(pos<=max(qdata_region$pos),pos>=min(qdata_region$pos))
  rcdata_region_data <- list(setNames(as.data.frame(rcdata_region),c("chr","pos","rate","map","filtered")))
  qdata_top_annotation <- qdata_region %>% 
    filter(variant_id==variant)
  qdata_top_annotation_data <- list(setNames(as.data.frame(qdata_top_annotation),c("gene_id","gene_symbol","variant_id","rsnum","chr","pos","ref","alt","tss_distance","pval_nominal","slope","slope_se")))

  source('eQTL/emeraLD2R.r')

  locus <- "1q21_3"

  ### output region as bed file
  qdata_region %>% 
    mutate(start=pos-1) %>% 
    select(chr,start,pos) %>% 
    arrange(chr,start,pos) %>% 
    unique() %>% 
    write_delim(paste0('tmp/',request,'.',locus,'.bed'),delim = '\t',col_names = F)

  if (select_pop %in% kgpanel$super_pop) {
    kgpanel %>% 
    filter(super_pop==select_pop) %>% 
    select(sample) %>% 
    write_delim(paste0('tmp/',request,'.','extracted','.panel'),delim = '\t',col_names = F)
  } else if (select_pop %in% kgpanel$pop) {
    kgpanel %>% 
    filter(pop==select_pop) %>% 
    select(sample) %>% 
    write_delim(paste0('tmp/',request,'.','extracted','.panel'),delim = '\t',col_names = F)
  }

  cmd <- paste0('bcftools view -S tmp/',request,'.','extracted','.panel -R ',paste0('tmp/',request,'.',locus,'.bed'),' -O z  ', in_path,'|bcftools sort -O z -o tmp/',request,'.','input','.vcf.gz')
  system(cmd)
  cmd <- paste0('bcftools index -t tmp/',request,'.','input','.vcf.gz')
  system(cmd)
  regionLD <- paste0(chromosome,":",min(qdata_region$pos),"-",max(qdata_region$pos))
  in_bin <- '/usr/local/bin/emeraLD'
  getLD <- emeraLD2R(path = paste0('tmp/',request,'.','input','.vcf.gz'), bin = in_bin) 
  ld_data <- getLD(region = regionLD)

  # saveRDS(ld_data, file=paste0("tmp/",request,".ld_data.rds"))
  # ld_data <- readRDS(paste0("tmp/",request,".ld_data.rds"))

  index <- which(ld_data$info$id==rsnum|str_detect(ld_data$info$id,paste0(";",rsnum))|str_detect(ld_data$info$id,paste0(rsnum,";")))

  ### snp may not found in the LD matrix file, means this snp missing from 1kg ### then use the next one

  if (length(index) != 0) {
    ld_info <- as.data.frame(ld_data$Sigma[,index])
    colnames(ld_info) <- "R2"
    rownames(ld_info) <- ld_data$info$id
    qdata_region$R2 <- (ld_info[qdata_region$rsnum,"R2"])^2
    locus_zoom_data <- list(setNames(as.data.frame(qdata_region),c("gene_id","gene_symbol","variant_id","rsnum","chr","pos","ref","alt","tss_distance","pval_nominal","slope","slope_se","R2")))
  } else {
    qdata_region$R2 <- NA
    locus_zoom_data <- list(setNames(as.data.frame(qdata_region),c("gene_id","gene_symbol","variant_id","rsnum","chr","pos","ref","alt","tss_distance","pval_nominal","slope","slope_se","R2")))
  }
  return(list(locus_zoom_data, rcdata_region_data, qdata_top_annotation_data))
}

eqtl_gene_expressions <- function(workDir, tmp, exprFile, genoFile) {
  # initialize boxplot data as empty until data file detected
  gene_expressions_data <- list(c())
  # check to see if boxplot data files are present
  if (!identical(genoFile, 'false') & !identical(exprFile, 'false')) {
    gdatafile <- paste0('tmp/', genoFile)
    edatafile <- paste0('tmp/', exprFile)

    gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
    edata <- read_delim(edatafile,delim = "\t",col_names = T)

    tmp <- tmp %>% 
      slice(1:15)
    
    edata_boxplot <- edata %>% 
      gather(Sample,exp,-(chr:gene_id)) %>% 
      right_join(tmp %>% select(gene_id,gene_symbol) %>% unique())

    edata_boxplot <- edata_boxplot %>% 
      left_join(edata_boxplot %>% group_by(gene_id) %>% summarise(mean=mean(exp))) %>% 
      left_join(tmp %>% select(gene_id,pval_nominal)) %>% 
      mutate(gene_symbol=fct_reorder(gene_symbol,(pval_nominal)))

    gene_expressions_data <- list(setNames(as.data.frame(edata_boxplot),c("chr","start","end","gene_id","Sample","exp","gene_symbol","mean","pval_nominal")))
  }
  return(gene_expressions_data)
}

eqtl_gwas_example <- function(workDir, gwasFile) {
  # initialize GWAS data as empty until data file detected
  gwas_example_data <- list(c())
  # return outputs in list with GWAS data
  if (!identical(gwasFile, 'false')) {
    gwasdatafile <- paste0('tmp/', gwasFile)
    gwasdata <- read_delim(gwasdatafile,delim = "\t",col_names = T)
    gwas_example_data <- list(setNames(as.data.frame(gwasdata),c("chr","pos","ref","alt","rs","pvalue")))
  }
  return(gwas_example_data)
}
