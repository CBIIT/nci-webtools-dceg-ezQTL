eqtl_main <- function(workDir, assocFile, exprFile, genoFile, gwasFile) {
  setwd(workDir)
  library(tidyverse)
  library(hrbrthemes)
  library(scales)
  library(ggrepel)
  library(forcats)
  library(jsonlite)

  ## parameters define ##
  select_pop <- "EUR"
  gene <- NULL
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
  gene_symbols <- list(qdata_tmp$gene_symbol)

  ## call calculations for eqtl modules: locuszoom and gene expressions ##
  ## locuszoom calculations ##
  eqtl_locuszoom_data <- eqtl_locuszoom(workDir, qdata, qdata_tmp, select_pop, gene, rsnum)
  locus_zoom_data <- eqtl_locuszoom_data[[1]]
  rcdata_region_data <- eqtl_locuszoom_data[[2]]
  qdata_top_annotation_data <- eqtl_locuszoom_data[[3]]
  ## gene expressions calculations ##
  gene_expressions_data <- eqtl_gene_expressions(workDir, qdata_tmp, exprFile, genoFile)
  ## locuszoom gwas data ##
  gwas_example_data <- eqtl_gwas_example(workDir, gwasFile)
  ## combine results from eqtl modules calculations and return ##
  dataSource <- c(gene_symbols, gene_expressions_data, locus_zoom_data, rcdata_region_data, qdata_top_annotation_data, gwas_example_data)
  return(dataSource)
}

eqtl_locuszoom <- function(workDir, qdata, qdata_tmp, select_pop, gene, rsnum) { 
  chromosome <- qdata$chr[1]
  rcdatafile <- paste0('Recombination_Rate_CEU/CEU-',chromosome,'-final.txt.gz')
  rcdata <- read_delim(rcdatafile,delim = "\t",col_names = T)
  colnames(rcdata) <- c('pos','rate','map','filtered')
  rcdata$pos <- as.integer(rcdata$pos)




  # # expression data
  # # chromosome <- unique(edata$chr)
  # # minpos <- min(edata$start)
  # # maxpos <- max(edata$end)
  # chromosome <- unique(qdata$chr)
  # minpos <- min(qdata$pos)
  # maxpos <- max(qdata$pos)

  # ## download regional vcf file (only need do once for each locus)
  # #kgvcfpath <- paste0('ftp://ftp.1000genomes.ebi.ac.uk//vol1/ftp/release/20130502/ALL.chr',chromosome,'.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz')
  # kgvcfpath <- paste0(workDir, '/eQTL/ALL.chr', chromosome, '.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz')

  # # bcftools outputs to file called in_path
  # in_path <- paste0(workDir, '/eQTL/chr',chromosome,'_',minpos,'_',maxpos,'.vcf.gz')
  # cmd <- paste0('bcftools view -O z -o ', in_path, ' ', kgvcfpath,' ', chromosome, ":", minpos, '-',maxpos)
  # system(cmd)

  # ### indexl vcf file ###
  # # then it creates a .csi index for this file
  # cmd <- paste0('bcftools index -t ', in_path)
  # system(cmd)


  # ### read variant recombination data
  # ### make sure select the corrected population of Recombination rates data ###
  # ## ftp://ftp.1000genomes.ebi.ac.uk//vol1/ftp/technical/working/20130507_omni_recombination_rates/
  # ## default is CEU coresponsed to EUR populaiton

  # popshort <- "CEU"  ### need to find the superpop recomendation data 
  # #kgpanel %>% count(pop,super_pop,sort = T) %>% group_by(super_pop) %>% slice(1)

  # cmd=paste0("tabix Recombination_Rate/",popshort,".txt.gz ",chromosome,":",minpos,"-",maxpos," >rc_temp.txt")
  # system(cmd)
  # rcdata <- read_delim('rc_temp.txt',delim = "\t",col_names = F)
  # colnames(rcdata) <- c('chr','pos','rate','map','filtered')
  # rcdata$pos <- as.integer(rcdata$pos)
  # # unlink('rc_temp.txt')

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

