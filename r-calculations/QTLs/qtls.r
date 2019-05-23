main <- function(workDir, select_qtls_samples, select_gwas_sample, assocFile, exprFile, genoFile, gwasFile, request, select_pop, select_gene, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef) {
  setwd(workDir)
  library(tidyverse)
  # library(forcats)
  library(jsonlite)

  ## parameters define ##
  if (identical(select_pop, 'false')) {
    ## set default population to EUR if none chosen
    select_pop <- "CEU+TSI+FIN+GBR+IBS"
  }
  if (identical(select_gene, 'false')) {
    ## set default gene to top gene if none chosen
    gene <- NULL
  } else {
    gene <- select_gene
  }
  if (identical(select_ref, 'false')) {
    ## set default rsnum to top gene's rsnum if none chosen
    rsnum <- NULL
  } else {
    rsnum <- select_ref
  }

  ## load 1kg pop panel file ##
  kgpanel <- read_delim('data/Population_Panel/integrated_call_samples_v3.20130502.ALL.panel',delim = '\t',col_names = T) %>% 
    select(sample:gender)
  popinfo <- kgpanel %>% 
    select(pop,super_pop) %>% 
    unique()

  ## read and parse association data file ###
  if (identical(select_qtls_samples, 'true')) {
    qdatafile <- paste0('../static/assets/files/', '1q21_3.eQTL.txt') 
  } else {
    qdatafile <- paste0('tmp/', assocFile)
  }
  qdata <- read_delim(qdatafile,delim = "\t",col_names = T,col_types = cols(variant_id='c'))
  qdata <- qdata %>% 
    arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% 
    group_by(gene_id,variant_id,rsnum,ref,alt) %>% 
    slice(1) %>% 
    ungroup()

  # return all gene variants
  all_gene_variants <- qdata %>%
    select(gene_id, rsnum)
  all_gene_variants_colnames <- colnames(all_gene_variants)
  all_gene_variants_data <- list(setNames(as.data.frame(all_gene_variants), all_gene_variants_colnames))

  qdata_tmp <- qdata %>% 
    group_by(gene_id,gene_symbol) %>% 
    arrange(pval_nominal) %>% 
    slice(1) %>% 
    ungroup() %>% 
    arrange(pval_nominal)

  # return most significant variants for all genes
  top_gene_variants <- qdata_tmp %>%
    select(gene_id, gene_symbol, rsnum)
  top_gene_variants_colnames <- colnames(top_gene_variants)
  top_gene_variants_data <- list(setNames(as.data.frame(top_gene_variants), top_gene_variants_colnames))

  # added code to isolate gene_symbols and put in variable
  # gene_symbols <- list(qdata_tmp$gene_symbol)
  gene_list <- qdata_tmp %>%
    select(gene_id, gene_symbol)
  gene_list_colnames <- colnames(gene_list)
  gene_list_data <- list(setNames(as.data.frame(gene_list), gene_list_colnames))

  ## call calculations for qtls modules: locus alignment and locus quantification ##
  ## locus alignment calculations ##
  locus_alignment <- locus_alignment(workDir, select_gwas_sample, qdata, qdata_tmp, kgpanel, select_pop, gene, rsnum, request, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef, gwasFile)
  locus_alignment_data <- locus_alignment[[1]]
  rcdata_region_data <- locus_alignment[[2]]
  qdata_top_annotation_data <- locus_alignment[[3]]
  locus_alignment_scatter <- locus_alignment[[4]]
  locus_alignment_scatter_data <- locus_alignment_scatter[[1]]
  locus_alignment_scatter_title <- locus_alignment_scatter[[2]]
  ## locus quantification calculations ##
  locus_quantification <- locus_quantification(workDir, select_qtls_samples, qdata_tmp, exprFile, genoFile)
  locus_quantification_data <- locus_quantification[[1]]
  locus_quantification_heatmap_data <- locus_quantification[[2]]
  ## locus alignment gwas data ##
  gwas_example_data <- gwas_example(workDir, select_gwas_sample, gwasFile)
  ## combine results from QTLs modules calculations and return ##
  dataSourceJSON <- c(toJSON(list(info=list(recalculateAttempt=recalculateAttempt, recalculatePop=recalculatePop, recalculateGene=recalculateGene, recalculateRef=recalculateRef, select_qtls_samples=select_qtls_samples, select_gwas_sample=select_gwas_sample, top_gene_variants=list(data=top_gene_variants_data), all_gene_variants=list(data=all_gene_variants_data), gene_list=list(data=gene_list_data), inputs=list(association_file=assocFile, expression_file=exprFile, genotype_file=genoFile, gwas_file=gwasFile, select_pop=select_pop, select_gene=select_gene, select_ref=select_ref, request=request)), locus_quantification=list(data=locus_quantification_data), locus_quantification_heatmap=list(data=locus_quantification_heatmap_data), locus_alignment=list(data=locus_alignment_data, rc=rcdata_region_data, top=qdata_top_annotation_data), locus_alignment_scatter=list(data=locus_alignment_scatter_data, title=locus_alignment_scatter_title), gwas=list(data=gwas_example_data))))
  ## remove all generated temporary files in the /tmp directory

  # unlink(paste0('tmp/*',request,'*'))
  
  # return(dataSource)
  return(dataSourceJSON)
}

locus_alignment_define_window <- function(recalculateAttempt, in_path, kgvcfpath, chromosome, minpos, maxpos) {
  if (identical(recalculateAttempt, 'false')) {
    cmd <- paste0('bcftools view -O z -o ', in_path, ' ', kgvcfpath,' ', chromosome, ":", minpos, '-',maxpos)
    system(cmd)
    cmd <- paste0('bcftools index ', in_path)
    system(cmd)
  }
}

locus_alignment_get_ld <- function(recalculateAttempt, recalculatePop, in_path, request, locus, chromosome, qdata_region_pos) {
  if (identical(recalculateAttempt, 'false') || (identical(recalculateAttempt, 'true') && identical(recalculatePop, 'true'))) {
    cmd <- paste0('bcftools view -S tmp/',request,'.','extracted','.panel -R ',paste0('tmp/',request,'.',locus,'.bed'),' -O z  ', in_path,'|bcftools sort -O z -o tmp/',request,'.','input','.vcf.gz')
    system(cmd)
    cmd <- paste0('bcftools index -t tmp/',request,'.','input','.vcf.gz')
    system(cmd)
    regionLD <- paste0(chromosome,":",min(qdata_region_pos),"-",max(qdata_region_pos))
    in_bin <- '/usr/local/bin/emeraLD'
    getLD <- emeraLD2R(path = paste0('tmp/',request,'.','input','.vcf.gz'), bin = in_bin) 
    ld_data <- getLD(region = regionLD)
    saveRDS(ld_data, file=paste0("tmp/",request,".ld_data.rds"))
  }
}

gwas_example_scatter <- function(gwasdata, qdata_region) {
  ## coloculization ####
  tmpdata <- qdata_region %>% 
    select(chr,pos,ref,alt,pval_nominal,R2) %>% 
    left_join(gwasdata) %>% 
    filter(!is.na(pvalue),!is.na(pval_nominal)) 

  tmptest <- cor.test(-log10(tmpdata$pvalue),-log10(tmpdata$pval_nominal),method = 'spearman')
  tmptitle <- paste0('rho=',round(tmptest$estimate,3),', p=',round(tmptest$p.value,3))

  tmpdata_colnames <- colnames(tmpdata)
  gwas_example_scatter_data <- list(setNames(as.data.frame(tmpdata), tmpdata_colnames))

  return(list(gwas_example_scatter_data, tmptitle))
}

locus_alignment <- function(workDir, select_gwas_sample, qdata, qdata_tmp, kgpanel, select_pop, gene, rsnum, request, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef, gwasFile) { 
  chromosome <- unique(qdata$chr)
  minpos <- min(qdata$pos)
  maxpos <- max(qdata$pos)

  kgvcfpath <- paste0(workDir, '/data/1000G/ALL.chr', chromosome, '.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz')
  
  in_path <- paste0(workDir, '/tmp/',request,'.','chr',chromosome,'_',minpos,'_',maxpos,'.vcf.gz')
  
  locus_alignment_define_window(recalculateAttempt, in_path, kgvcfpath, chromosome, minpos, maxpos)

  popshort <- "CEU"  ### need to find the superpop recomendation data 

  cmd = paste0("tabix data/Recombination_Rate/",popshort,".txt.gz ",chromosome,":",minpos,"-",maxpos," >tmp/",request,'.',"rc_temp",".txt")
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
  rcdata_region_colnames <- colnames(rcdata_region)
  rcdata_region_data <- list(setNames(as.data.frame(rcdata_region), rcdata_region_colnames))
  qdata_top_annotation <- qdata_region %>% 
    filter(variant_id==variant)
  qdata_top_annotation_colnames <- colnames(qdata_top_annotation)
  qdata_top_annotation_data <- list(setNames(as.data.frame(qdata_top_annotation), qdata_top_annotation_colnames))

  source('QTLs/emeraLD2R.r')

  locus <- "1q21_3"

  ### output region as bed file
  qdata_region %>% 
    mutate(start=pos-1) %>% 
    select(chr,start,pos) %>% 
    arrange(chr,start,pos) %>% 
    unique() %>% 
    write_delim(paste0('tmp/',request,'.',locus,'.bed'),delim = '\t',col_names = F)

  ## remove any previous extracted panel if exists
  unlink(paste0('tmp/',request,'.','extracted','.panel'))
  ## read multiple population selections
  select_pop_list <- unlist(strsplit(select_pop, "+", fixed = TRUE))
  for(pop_i in select_pop_list){
    if (pop_i %in% kgpanel$super_pop) {
      kgpanel %>% 
        filter(super_pop==pop_i) %>% 
        select(sample) %>% 
        write_delim(paste0('tmp/',request,'.','extracted','.panel'),delim = '\t',col_names = F, append = TRUE)
    } else if (pop_i %in% kgpanel$pop) {
      kgpanel %>% 
        filter(pop==pop_i) %>% 
        select(sample) %>% 
        write_delim(paste0('tmp/',request,'.','extracted','.panel'),delim = '\t',col_names = F, append = TRUE)
    }
  }

  locus_alignment_get_ld(recalculateAttempt, recalculatePop, in_path, request, locus, chromosome, qdata_region$pos)

  ld_data <- readRDS(paste0("tmp/",request,".ld_data.rds"))

  index <- which(ld_data$info$id==rsnum|str_detect(ld_data$info$id,paste0(";",rsnum))|str_detect(ld_data$info$id,paste0(rsnum,";")))

  ### snp may not found in the LD matrix file, means this snp missing from 1kg ### then use the next one

  if (length(index) != 0) {
    ld_info <- as.data.frame(ld_data$Sigma[,index])
    colnames(ld_info) <- "R2"
    rownames(ld_info) <- ld_data$info$id
    qdata_region$R2 <- (ld_info[qdata_region$rsnum,"R2"])^2
    write.table(qdata_region, file = paste0("../static/tmp/",request,".variant_details.txt"), sep = "\t", dec = ".",row.names = FALSE, col.names = TRUE)
    qdata_region_colnames <- colnames(qdata_region)
    locus_alignment_data <- list(setNames(as.data.frame(qdata_region), qdata_region_colnames))
  } else {
    qdata_region$R2 <- NA
    write.table(qdata_region, file = paste0("../static/tmp/",request,".variant_details.txt"), sep = "\t", dec = ".",row.names = FALSE, col.names = TRUE)
    qdata_region_colnames <- colnames(qdata_region)
    locus_alignment_data <- list(setNames(as.data.frame(qdata_region), qdata_region_colnames))
  }
  # initialize scatter data as empty until data file detected
  gwas_example_scatter_data_title <- list(c(), c())
  # get GWAS scatter data
  if (!identical(gwasFile, 'false') || identical(select_gwas_sample, 'true')) {
    if (identical(select_gwas_sample, 'false')) {
      gwasdatafile <- paste0('tmp/', gwasFile)
    } else {
      gwasdatafile <- paste0('../static/assets/files/', '1q21_3.GWAS.txt')
    }
    gwasdata <- read_delim(gwasdatafile,delim = "\t",col_names = T)
    gwas_example_scatter_data_title <- gwas_example_scatter(gwasdata, qdata_region)
  }
  return(list(locus_alignment_data, rcdata_region_data, qdata_top_annotation_data, gwas_example_scatter_data_title))
}

locus_quantification_heatmap <- function(edata_boxplot) {
  tmpdata <- edata_boxplot %>% 
    select(Sample,gene_symbol,exp) %>% 
    spread(Sample,exp) 

  tmpdata_colnames <- colnames(tmpdata)

  return(list(setNames(as.data.frame(tmpdata), tmpdata_colnames)))
}

locus_quantification <- function(workDir, select_qtls_samples, tmp, exprFile, genoFile) {
  # initialize boxplot data as empty until data file detected
  locus_quantification_data <- list(c())
  # initialize heatmap data as empty until data file detected
  locus_quantification_heatmap_data <- list(c())
  # check to see if boxplot data files are present
  if ((!identical(genoFile, 'false') & !identical(exprFile, 'false')) || identical(select_qtls_samples, 'true')) {
    if (identical(select_qtls_samples, 'false')) {
      gdatafile <- paste0('tmp/', genoFile)
      edatafile <- paste0('tmp/', exprFile)
    } else {
      gdatafile <- paste0('../static/assets/files/', '1q21_3.genotyping.txt') 
      edatafile <- paste0('../static/assets/files/', '1q21_3.expression.txt') 
    }
    
    gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
    edata <- read_delim(edatafile,delim = "\t",col_names = T)

    tmp <- tmp %>% 
      slice(1:30)
    
    edata_boxplot <- edata %>% 
      gather(Sample,exp,-(chr:gene_id)) %>% 
      right_join(tmp %>% select(gene_id,gene_symbol) %>% unique())

    edata_boxplot <- edata_boxplot %>% 
      left_join(edata_boxplot %>% group_by(gene_id) %>% summarise(mean=mean(exp))) %>% 
      left_join(tmp %>% select(gene_id,pval_nominal)) %>% 
      mutate(gene_symbol=fct_reorder(gene_symbol,(pval_nominal)))

    edata_boxplot_colnames <- colnames(edata_boxplot)
    locus_quantification_data <- list(setNames(as.data.frame(edata_boxplot), edata_boxplot_colnames))

    locus_quantification_heatmap_data <- locus_quantification_heatmap(edata_boxplot)
  }
  return(list(locus_quantification_data, locus_quantification_heatmap_data))
}

gwas_example <- function(workDir, select_gwas_sample, gwasFile) {
  # initialize GWAS data as empty until data file detected
  gwas_example_data <- list(c())
  # return outputs in list with GWAS data
  if (!identical(gwasFile, 'false') || identical(select_gwas_sample, 'true')) {
    if (identical(select_gwas_sample, 'false')) {
      gwasdatafile <- paste0('tmp/', gwasFile)
    } else {
      gwasdatafile <- paste0('../static/assets/files/', '1q21_3.GWAS.txt')
    }
    gwasdata <- read_delim(gwasdatafile,delim = "\t",col_names = T)
    gwasdata_colnames <- colnames(gwasdata)
    gwas_example_data <- list(setNames(as.data.frame(gwasdata), gwasdata_colnames))
  }
  return(gwas_example_data)
}

locus_alignment_boxplots <- function(workDir, select_qtls_samples, exprFile, genoFile, info) {
  setwd(workDir)
  library(tidyverse)
  # library(forcats)
  library(jsonlite)
  # initialize locus alignment boxplots data as empty until data file detected
  locus_alignment_boxplots_data <- list(c())
  if ((!identical(genoFile, 'false') & !identical(exprFile, 'false')) || identical(select_qtls_samples, 'true')) {
    if (identical(select_qtls_samples, 'false')) {
      gdatafile <- paste0('tmp/', genoFile)
      edatafile <- paste0('tmp/', exprFile)
    } else {
      gdatafile <- paste0('../static/assets/files/', '1q21_3.genotyping.txt') 
      edatafile <- paste0('../static/assets/files/', '1q21_3.expression.txt') 
    }

    gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
    edata <- read_delim(edatafile,delim = "\t",col_names = T)

    # parse info json to data frame
    info <- paste0('[', info, ']')  %>%
      fromJSON(info, simplifyDataFrame = TRUE)
    info <- select(info, gene_id, gene_symbol, variant_id, rsnum, chr, pos, ref, alt)

    cexpdata <- edata %>% 
      filter(gene_id==info$gene_id) %>% 
      gather(Sample,exp,-(chr:gene_id))

    cexpdata <- gdata %>% 
      gather(Sample,Genotype,-(chr:alt)) %>% 
      right_join(info) %>%
      left_join(cexpdata)

    cexpdata_colnames <- colnames(cexpdata)
    locus_alignment_boxplots_data <- list(setNames(as.data.frame(cexpdata), cexpdata_colnames))
  }
  dataSourceJSON <- c(toJSON(list(locus_alignment_boxplots=list(data=locus_alignment_boxplots_data))))
  return(dataSourceJSON)
}

