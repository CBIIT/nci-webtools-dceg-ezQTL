eQTL_main <- function(workDir, assocFile, genoFile, exprFile, gwasFile) {
  setwd(workDir)

  library(tidyverse)
  library(hrbrthemes)
  library(scales)
  library(ggrepel)
  library(forcats)


  ##parameters define ###

  select_pop <- "EUR"
  gene <- NULL
  rsnum <- NULL


  ### load 1kg pop panel file ####

  kgpanel <- read_delim('integrated_call_samples_v3.20130502.ALL.panel',delim = '\t',col_names = T) %>% 
    select(sample:gender)

  popinfo <- kgpanel %>% 
    select(pop,super_pop) %>% 
    unique()

  ### read eQTL module data ####
  # locus <- "1q21_3"
  qdatafile <- paste0('uploads/', assocFile)
  edatafile <- paste0('uploads/', exprFile)
  gdatafile <- paste0('uploads/', genoFile)

  edata <- read_delim(edatafile,delim = "\t",col_names = T)
  gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
  qdata <- read_delim(qdatafile,delim = "\t",col_names = T,col_types = cols(variant_id='c'))
  qdata <- qdata %>% 
    arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% group_by(gene_id,variant_id,rsnum,ref,alt) %>% slice(1) %>% ungroup()

  chromosome <- unique(edata$chr)
  minpos <- min(edata$start)
  maxpos <- max(edata$end)

  ## download regional vcf file (only need do once for each locus)
  kgvcfpath <- paste0('ftp://ftp.1000genomes.ebi.ac.uk//vol1/ftp/release/20130502/ALL.chr',chromosome,'.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz')
  in_path <- paste0('chr',chromosome,'_',minpos,'_',maxpos,'.vcf.gz')
  cmd <- paste0('bcftools view -O z -o ',in_path,' ',kgvcfpath,' ',chromosome,":",minpos,'-',maxpos)
  system(cmd)

  ### indexl vcf file ###
  cmd <- paste0('bcftools index ',in_path)
  system(cmd)


  ### read variant recombination data
  ### make sure select the corrected population of Recombination rates data ###
  ## ftp://ftp.1000genomes.ebi.ac.uk//vol1/ftp/technical/working/20130507_omni_recombination_rates/
  ## default is CEU coresponsed to EUR populaiton

  popshort <- "CEU"  ### need to find the superpop recomendation data 
  #kgpanel %>% count(pop,super_pop,sort = T) %>% group_by(super_pop) %>% slice(1)

  cmd=paste0("tabix Recombination_Rate/",popshort,".txt.gz ",chromosome,":",minpos,"-",maxpos," >rc_temp.txt")
  system(cmd)
  rcdata <- read_delim('rc_temp.txt',delim = "\t",col_names = F)
  colnames(rcdata) <- c('chr','pos','rate','map','filtered')
  rcdata$pos <- as.integer(rcdata$pos)
  unlink('rc_temp.txt')




  ### boxplot  for all the genes###

  tmp <- qdata %>% group_by(gene_id,gene_symbol) %>% arrange(pval_nominal) %>% slice(1) %>% ungroup() %>% arrange(pval_nominal) %>% slice(1:15)

  edata_boxplot <- edata %>% gather(Sample,exp,-(chr:gene_id)) %>% right_join(tmp %>% select(gene_id,gene_symbol) %>% unique())

  edata_boxplot <- edata_boxplot %>% left_join(
    edata_boxplot %>% group_by(gene_id) %>% summarise(mean=mean(exp))
  ) %>% 
    left_join(tmp %>% select(gene_id,pval_nominal)) %>% 
    mutate(gene_symbol=fct_reorder(gene_symbol,(pval_nominal)))

  edata_boxplot %>% 
    ggplot(aes(gene_symbol,log2(exp+0.1)))+
    geom_boxplot(outlier.shape=NA)+geom_jitter(position=position_jitter(w=0.2,h=0.1),size=1.2,shape=21,fill="blue",alpha=0.5)+
    theme_ipsum_rc(axis = "xy",axis_title_just = "m",axis_title_size = 14)+
    labs(x="",y="Gene expression (log2)")+
    theme(axis.text.x = element_text(angle = 90,hjust = 1,vjust = 0.5))


  ### main funciton for the LD calculation 

  if(is.null(gene)){
    gene <- qdata %>% arrange(pval_nominal,desc(abs(slope)),abs(tss_distance)) %>% slice(1) %>% pull(gene_id)
  }

  if(is.null(rsnum)){
    tmp <-  qdata %>% filter(gene_id==gene) %>% arrange(pval_nominal) %>% slice(1) 
    variant <- tmp %>% pull(variant_id)
    rsnum <- tmp %>% pull(rsnum)
    info <- tmp %>% select(gene_id:alt)
  } else {
    rsnum0 <- rsnum
    tmp <-  qdata %>% filter(gene_id==gene, rsnum==rsnum0) 
    variant <- tmp %>% pull(variant_id)
    #rsnum <- tmp %>% pull(rsnum)
    info <- tmp %>% select(gene_id:alt)
  }


  ### limit data region to plot ###
  qdata_region <- qdata %>% 
    filter(gene_id==gene)
  rcdata_region <- rcdata %>% 
    filter(pos<=max(qdata_region$pos),pos>=min(qdata_region$pos))
  qdata_top_annotation <- qdata_region %>% 
    filter(variant_id==variant)

  ### calculated the LD proxy to the reference variant
  ### need to change the path to emeraLD binary file: bin = "~/Terminal/software/emeraLD/bin/emeraLD"
  source('emeraLD2R.r')
  #chang in_path to loca 1000genome vcf file and limited the population. here are the sliced vcf files ### 
  #in_path <- "ftp://ftp.1000genomes.ebi.ac.uk//vol1/ftp/release/20130502/ALL.chr1.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz"
  ## my script to etract the slice vcf file in EUR population ###
  #cat 1q21_3.eQTL.txt|awk '{print $5"\t"$6-1"\t"$6}'|sort|uniq >1q21_3.bed    
  #bcftools view -S eur.panel -R 1q21_3.bed -O z -o chr1_149039120_152938045.vcf.gz /fdb/1000genomes/release/20130502/ALL.chr1.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz

  ### output region as bed file
  qdata_region %>% 
    mutate(start=pos-1) %>% 
    select(chr,start,pos) %>% 
    arrange(chr,start,pos) %>% 
    unique() %>% 
    write_delim(paste0(locus,'.bed'),delim = '\t',col_names = F)

  if (select_pop %in% kgpanel$super_pop) {
    kgpanel %>% filter(super_pop==select_pop) %>% select(sample) %>% write_delim('extracted.panel',delim = '\t',col_names = F)
  } else if (select_pop %in% kgpanel$pop) {
    kgpanel %>% filter(pop==select_pop) %>% select(sample) %>% write_delim('extracted.panel',delim = '\t',col_names = F)
  }


  cmd <- paste0('bcftools view -S extracted.panel -R ',paste0(locus,'.bed'),' -O z  ', in_path,'|bcftools sort -O z -o input.vcf.gz')
  system(cmd)
  cmd <- paste0('bcftools index -t input.vcf.gz')
  system(cmd)
  regionLD <- paste0(chromosome,":",min(qdata_region$pos),"-",max(qdata_region$pos))
  in_bin <- '/usr/local/bin/emeraLD'
  getLD <- emeraLD2R(path = 'input.vcf.gz', bin = in_bin) 
  ld_data <- getLD(region = regionLD)

  index <- which(ld_data$info$id==rsnum|str_detect(ld_data$info$id,paste0(";",rsnum))|str_detect(ld_data$info$id,paste0(rsnum,";")))

  ### snp may not found in the LD matrix file, means this snp missing from 1kg ### then use the next one


  if(length(index)!=0){
    ld_info <- as.data.frame(ld_data$Sigma[,index])
    colnames(ld_info) <- "R2"
    rownames(ld_info) <- ld_data$info$id
    qdata_region$R2 <- (ld_info[qdata_region$rsnum,"R2"])^2
    
    ## locus zoom plot ###
    
    qdata_region %>% 
      ggplot(aes(x=pos/1000000))+
      geom_point(aes(y=-log10(pval_nominal),fill=R2),pch=21,col="white",stroke=0.1,size=2.5)+
      theme_ipsum_rc(axis_title_just = "m",axis_title_size = 14,axis = 'xy',grid = "xy",axis_col = "black",ticks = TRUE)+
      scale_x_continuous(breaks = pretty_breaks(n = 10))+
      scale_fill_viridis_c(direction = -1,na.value = "gray50",option = "D",alpha = 1)+
      labs(x=paste0("Chromosome ",chromosome," (Mb)"),y="-log10(P-value)",fill="R2\n")+
      geom_label_repel(aes(x=pos/1000000,y=-log10(pval_nominal),label=rsnum),force = 5,data = qdata_top_annotation)+
      geom_line(aes(x=pos/1000000,y=rate/10),data=rcdata_region,col="blue",size=0.5)+
      scale_y_continuous(breaks = pretty_breaks(n = 10),sec.axis = sec_axis(~.*10, name = "Recombination Rate (cM/Mb)"))+
      theme(legend.position = "top",legend.key.width=unit(2,"cm"),legend.key.height=unit(0.2,"cm"),axis.text.y.right = element_text(color = "blue"),axis.title.y.right = element_text(color = "blue"))
    
    
  }else{
    qdata_region$R2 <- NA
    
    qdata_region %>% 
      ggplot(aes(x=pos/1000000))+
      geom_point(aes(y=-log10(pval_nominal)),fill="gray50",pch=21,col="white",stroke=0.1,size=2.5)+
      theme_ipsum_rc(axis_title_just = "m",axis_title_size = 14,axis = 'xy',grid = "xy",axis_col = "black",ticks = TRUE)+
      scale_x_continuous(breaks = pretty_breaks(n = 10))+
      scale_fill_viridis_c(direction = -1,na.value = "gray50",option = "D",alpha = 1)+
      labs(x=paste0("Chromosome ",chromosome," (Mb)"),y="-log10(P-value)",fill="R2\n")+
      geom_label_repel(aes(x=pos/1000000,y=-log10(pval_nominal),label=rsnum),force = 5,data = qdata_top_annotation)+
      geom_line(aes(x=pos/1000000,y=rate/10),data=rcdata_region,col="blue",size=0.5)+
      scale_y_continuous(breaks = pretty_breaks(n = 10),sec.axis = sec_axis(~.*10, name = "Recombination Rate (cM/Mb)"))+
      theme(legend.position = "top",legend.key.width=unit(2,"cm"),legend.key.height=unit(0.2,"cm"),axis.text.y.right = element_text(color = "blue"),axis.title.y.right = element_text(color = "blue"))
    
  }



  ## boxplot when click the links ### 
  ##for example, click the default_variant

  cexpdata <- edata %>% 
    filter(gene_id==gene) %>% 
    gather(Sample,exp,-(chr:gene_id))

  cexpdata <- gdata %>% 
    gather(Sample,Genotype,-(chr:alt)) %>% 
    right_join(info) %>% 
    left_join(cexpdata)

  cexpdata %>% 
    ggplot(aes(Genotype,-log2(exp+0.1)))+
    geom_boxplot(fill = gray(0.9),outlier.shape=NA)+
    geom_jitter(position=position_jitter(w=0.3,h=0.1),size=2.5,shape=21, aes(fill=Genotype))+
    xlab("")+
    ylab(paste0(info$gene_symbol," mRNA expression (log2)\n"))+
    theme_ipsum_rc(axis="xy")+
    theme(legend.position="bottom",axis.title.y=element_text(size=12,hjust=0.5,vjust=0.5))+
    scale_fill_manual(paste0(rsnum," genotype:\n ",info$ref,"->",info$alt),values = c("#3366cc", "#dc3912", "#109618"))
}
