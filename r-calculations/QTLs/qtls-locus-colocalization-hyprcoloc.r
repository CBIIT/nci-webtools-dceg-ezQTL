locus_colocalization_hyprcoloc <- function(workDir, select_gwas_sample, select_qtls_samples, gwasfile, qtlfile, ldfile, request) {
  setwd(workDir)
  .libPaths(c(.libPaths(),"~/R"))
  library(hyprcoloc)
  library(tidyverse)
  library(jsonlite)
##  args = commandArgs(trailingOnly=TRUE)
##  gwasfile <- args[1]
##  qtlfile <- args[2]
##  ldfile <- args[3]
##  prefix <- args[4]

  if (identical(select_gwas_sample, 'true')) {
    gwasfile <- paste0('../static/assets/files/', 'MX2.GWAS.txt')
  } else {
    gwasfile <- paste0('input/', gwasfile)
  }
  if (identical(select_qtls_samples, 'true')) {
    qtlfile <- paste0('../static/assets/files/', 'MX2.eQTL.txt') 
  } else {
    qtlfile <- paste0('input/', qtlfile)
  }
  
  ldfile <- paste0("tmp/", ldfile)


  ## for jiyeon ##
  
  trait1 <- read_delim(gwasfile,delim = '\t',col_names = T,col_types = cols('chr'='c','ref'='c','alt'='c'))
  trait2 <- read_delim(qtlfile,delim = '\t',col_names = T,col_types = cols('chr'='c','variant_id'='c','ref'='c','alt'='c'))
  
  gene2symbol <-  trait2 %>% select(gene_id,gene_symbol) %>% unique()
  
  ld.matrix <- read_delim(ldfile,delim = '\t',col_names = F,col_types = cols('X1'='c')) %>% rename(chr=X1,pos=X2,rsnum=X3,ref=X4,alt=X5)
  ld.info <- ld.matrix %>% select(chr,pos,rsnum,ref,alt) %>% mutate(Seq=seq_along(chr))
  
  ld.matrix <- ld.matrix %>% select(-c(chr,pos,rsnum,ref,alt)) %>% as.matrix
  ## ld =
  
  result_hyprcoloc <- tibble(iteration=integer(),traits=character(), posterior_prob=double(), regional_prob=double(), candidate_snp=character(), posterior_explained_by_snp=double(), dropped_trait=character())
  result_snpscore <- tibble(rsnum=character(),snpscore=double())
  
  
  ### keep the gene id with at least 20 snps ###
  nminal <- 20
  gene_id_filtered <- trait2 %>% count(gene_id,sort=T) %>% arrange(desc(n)) %>% filter(n>nminal) %>% pull(gene_id)
  trait2 <- trait2 %>% filter(gene_id %in% gene_id_filtered)
  ###
  
  
  
  for(i in unique(trait2$gene_id)){
    geneid <- i
    
    tdata <- trait1 %>% 
      left_join(
        trait2 %>% filter(gene_id==geneid),by = c('chr'='chr','pos'='pos','ref'='ref','alt'='alt')
      ) %>%
      mutate(rsnum=if_else(rsnum.x!=rsnum.y,paste(chr,pos,ref,alt,sep = ':'),rsnum.x)) %>% 
      filter(!is.na(slope),!is.na(effect),!is.na(se),!is.na(slope_se)) %>% 
      filter(slope!=0,effect!=0,se!=0,slope_se!=0) %>% 
      filter(str_detect(rsnum,"rs")) %>%
      as.data.frame()
    rownames(tdata) <- tdata$rsnum
    betas <- tdata[,c("effect","slope")] %>% rename(GWAS=effect,QTL=slope) %>% as.matrix()
    ses <-   tdata[,c("se","slope_se")] %>% rename(GWAS=se,QTL=slope_se) %>% as.matrix()
    traits <- c('GWAS','QTL')
    rsid=rownames(tdata)
    
    rsindex=tdata %>% select(chr,pos,rsnum) %>% left_join(ld.info) %>% select(Seq,rsnum) %>% filter(!is.na(Seq))  ##
    ld.matrix.seq <- ld.matrix[rsindex$Seq,rsindex$Seq]
    rownames(ld.matrix.seq) <- rsindex$rsnum
    colnames(ld.matrix.seq) <- rsindex$rsnum
    betas <- betas[rsindex$rsnum,] ## 
    ses <- ses[rsindex$rsnum,] ##
    
    binary.traits <- c(1,0)
    res <- hyprcoloc(betas, ses, trait.names=traits, snp.id=rsid,binary.outcomes = binary.traits,snpscores = TRUE,ld.matrix = ld.matrix.seq);
    
    result_hyprcoloc <- bind_rows(result_hyprcoloc,res[[1]] %>% mutate(gene_id=geneid))
    if(length(res)>1) {
      tmpres <- res[[2]][[1]] %>% as.data.frame() %>% rownames_to_column() %>% mutate(gene_id=geneid)
      colnames(tmpres) <- c("rsnum","snpscore","gene_id")
      result_snpscore <- bind_rows(result_snpscore,tmpres)
    }
  }
  
  result_hyprcoloc <- result_hyprcoloc %>% left_join(gene2symbol)
  
  if(dim(result_snpscore)[1] > 0) {
    result_snpscore <- result_snpscore %>% left_join(gene2symbol)
  }
  
  result_hyprcoloc <- result_hyprcoloc %>% arrange(desc(posterior_explained_by_snp)) 
  ## parse result_hyprcoloc dataframe to JSON
  result_hyprcoloc_colnames <- colnames(result_hyprcoloc)
  result_hyprcoloc_data <- list(setNames(as.data.frame(result_hyprcoloc), result_hyprcoloc_colnames))
  
  result_snpscore <- result_snpscore %>% arrange(desc(snpscore))
  ## parse result_snpscore dataframe to JSON
  result_snpscore_colnames <- colnames(result_snpscore)
  result_snpscore_data <- list(setNames(as.data.frame(result_snpscore), result_snpscore_colnames))
  
  result_hyprcoloc_filename <- paste0(request,".hyprcoloc.txt")
  result_snpscore_filename <- paste0(request,".hyprcoloc_snpscore.txt")
  result_hyprcoloc %>% write_delim(paste0('../static/output/',result_hyprcoloc_filename),delim = '\t',col_names = T)  
  result_snpscore %>% write_delim(paste0('../static/output/',result_snpscore_filename),delim = '\t',col_names = T)
  
  #save.image(file=paste0(prefix,".hyprcoloc.RData"))
  dataSourceJSON <- c(toJSON(list(hyprcoloc=list(request=request, result_hyprcoloc=list(data=result_hyprcoloc_data), result_snpscore=list(data=result_snpscore_data), output=list(filenames=list(result_hyprcoloc_filename=result_hyprcoloc_filename, result_snpscore_filename=result_snpscore_filename))))))
  return(dataSourceJSON)
}
