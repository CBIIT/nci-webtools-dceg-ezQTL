library(tidyverse)
library(ggplot2)
library(cowplot)
library(hrbrthemes)
library(scales)
library(ggsci)

coloc_QC <- function(gwasfile,qtlfile,ldfile,leadsnp=NULL,distance=100000,zscore_gene=NULL,output_plot_prefix=NULL){
  gwas <- read_delim(gwasfile,delim = '\t',col_names = T)
  eqtl <- read_delim(qtlfile,delim = '\t',col_names = T,col_types = cols('variant_id'='c'))
  ld.matrix <- read_delim(ldfile,delim = '\t',col_names = F,col_types = cols('X1'='c')) %>% rename(chr=X1,pos=X2,rsnum=X3,ref=X4,alt=X5)
  ld.info <- ld.matrix %>% select(chr,pos,rsnum,ref,alt) %>% mutate(Seq=seq_along(chr))
  ld.matrix <- ld.matrix %>% select(-c(chr,pos,rsnum,ref,alt)) %>% as.matrix
  
  if(is.null(leadsnp)){
    leadsnp <- gwas %>% arrange(pvalue) %>% slice(1) %>% pull(rsnum)  
  }
  
  leadchr <- gwas %>% filter(rsnum==leadsnp) %>% pull(chr)
  leadpos <- gwas %>% filter(rsnum==leadsnp) %>% pull(pos)
  leadpos1 <- leadpos - distance
  leadpos2 <- leadpos + distance
  
  gwas <- gwas %>% filter(chr==leadchr,pos>=leadpos1,pos<=leadpos2)
  eqtl <- eqtl %>% filter(chr==leadchr,pos>=leadpos1,pos<=leadpos2)
  #ld.info <- ld.info %>% filter(chr==leadchr,pos>=leadpos1,pos<=leadpos2)
  leadindex <- ld.info %>% filter(rsnum==leadsnp) %>% pull(Seq)
  
  ld.data <- bind_cols(
    ld.info,
    tibble(LD=ld.matrix[,leadindex])
  ) %>% filter(chr==leadchr,pos>=leadpos1,pos<=leadpos2)
  
  ## overlap
  orsnum <- gwas %>% filter(rsnum %in% eqtl$rsnum,rsnum %in% ld.data$rsnum) %>% pull(rsnum)
  eqtl2 <- eqtl %>% group_by(rsnum,pos) %>% arrange(pval_nominal) %>% summarise(pvalue=min(pval_nominal),n=n()) %>% ungroup()
  
  
  ndifgene <- eqtl %>% count(gene_id) %>% count(n) %>% dim() %>% .[[1]]
  
  
  pcol <- c('#cccccc','#1a9850')
  p1 <- eqtl2 %>% mutate(tmp=rsnum %in% orsnum) %>% arrange(tmp) %>% 
    ggplot(aes(pos/1000000,-log10(pvalue),fill=rsnum %in% orsnum))+
    geom_point(aes(size=n),pch=21,stroke=0.3,col="black")+
    theme_ipsum_rc(axis_title_just = 'm',grid = "XY",axis = F,ticks = T,axis_title_size= 14)+
    labs(fill=paste0("Overlapped Variants: ",length(orsnum)),x='',y='Minimal QTL P-value (-log10)',size="QTL-n")+
    theme(legend.position = 'top',panel.background = element_blank(),legend.background = element_blank())+
    scale_fill_manual(values = pcol)+
    scale_x_continuous(breaks = pretty_breaks())+
    panel_border(color = 'black')+
    ggrepel::geom_text_repel(data = eqtl2 %>% filter(rsnum==leadsnp),aes(label=rsnum))+
    geom_point(data = eqtl2 %>% filter(rsnum==leadsnp),pch=2,col="red",size=2,fill=NA,stroke=1)
  
  if(ndifgene > 1 ){
    p1 <- p1 +  scale_size_binned(breaks = pretty_breaks())
  }
  
  p2 <- gwas %>% 
    ggplot(aes(pos/1000000,-log10(pvalue),fill=rsnum %in% orsnum))+
    geom_point(pch=21,stroke=0.2,col="black",size=2.5)+
    theme_ipsum_rc(axis_title_just = 'm',grid = "XY",axis = F,ticks = T,axis_title_size= 14)+
    labs(fill="Overlapped Variants",x='',y='GWAS P-value (-log10)')+
    theme(legend.position = 'none',panel.background = element_blank())+
    scale_fill_manual(values = pcol)+
    scale_x_continuous(breaks = pretty_breaks())+
    panel_border(color = 'black')+
    ggrepel::geom_text_repel(data = gwas %>% filter(rsnum==leadsnp),aes(label=rsnum) )+
    geom_point(data = gwas %>% filter(rsnum==leadsnp),pch=2,col="red",size=2,stroke=1)
  
  
  p3 <- ld.data %>% mutate(tmp=rsnum %in% orsnum) %>% arrange(tmp) %>% 
    ggplot(aes(pos/1000000,(LD)^2,fill=rsnum %in% orsnum))+
    geom_point(pch=21,stroke=0.2,col="black",size=2.5)+
    theme_ipsum_rc(axis_title_just = 'm',grid = "XY",axis = F,ticks = T,axis_title_size= 14)+
    labs(fill="Overlapped Variants",x=paste0('Chromosome ',leadchr,'\n'),y="LD Matrix (R^2)")+
    theme(legend.position = 'none',panel.background = element_blank())+
    scale_fill_manual(values = pcol)+
    scale_x_continuous(breaks = pretty_breaks())+
    panel_border(color = 'black')+
    ggrepel::geom_text_repel(data = ld.data %>% filter(rsnum==leadsnp),aes(label=rsnum))+
    geom_point(data = ld.data %>% filter(rsnum==leadsnp),pch=2,col="red",size=2,stroke=1)
  
  pall1 <- plot_grid(p1+theme(plot.margin = margin(b = 2)),p2+theme(plot.margin = margin(b = 2)),p3+theme(plot.margin = margin(b = 2)),align = 'v',axis = 'lr',ncol = 1,rel_heights = c(1.3,1,1))
  
  # effect size plot # 
  
  if(is.null(zscore_gene)){
    gene_ids <- eqtl %>% arrange(pval_nominal) %>% select(gene_symbol) %>% slice(1) %>% pull(gene_symbol)  
  }else{
    gene_ids <- zscore_gene
  }
  
  
  qdata <- left_join(
    eqtl %>% filter(rsnum %in% orsnum,gene_symbol %in% gene_ids) %>% mutate(Z=slope/slope_se) %>% mutate(Gene=paste0(gene_id,'/',gene_symbol)) %>% select(rsnum, pos, Z,Gene),
    gwas %>% filter(rsnum %in% orsnum) %>% select(rsnum,pos,zscore)
  ) %>% 
    left_join(
      ld.data %>% select(rsnum,pos,LD)
    ) %>% 
    mutate(label=if_else(rsnum==leadsnp,rsnum,''))
  
  unique(qdata$Gene)
  
  pall2 <- qdata %>% ggplot(aes(zscore,Z,fill=LD))+
    facet_wrap(~Gene,ncol = 1)+
    geom_abline(slope = 1,col='#cccccc',linetype=2)+
    geom_hline(yintercept = 0,col='#cccccc')+
    geom_vline(xintercept = 0,col='#cccccc')+
    geom_point(pch=21,stroke=0.2,col="black",size=2.5)+
    # theme_ipsum_rc(axis_title_just = 'm',grid = F,axis = F,ticks = T,axis_title_size= 14)+
    labs(fill="LD to GWAS Leadsnp\n",x='GWAS-Zscore',y='QTL-Zscore')+
    theme(legend.position = 'top',legend.key.width = unit(2,'cm'),panel.spacing = unit(0.5, "lines"),panel.background = element_blank(),panel.grid = element_blank(),strip.background = element_blank())+
    scale_fill_gsea(limits=c(-1,1))+
    panel_border(color = 'black')+
    geom_point(data = qdata %>% filter(rsnum==leadsnp),pch=2,col="black",size=2,stroke=0.5)+
    ggrepel::geom_text_repel(aes(label=label))
  
  if(is.null(output_plot_prefix)){
    return(list(pall1,pall2))
  }else{
    ggsave(filename = paste0(output_plot_prefix,"_QC_overlapping.svg"),plot = pall1,width = 12,height = 12)
    ggsave(filename = paste0(output_plot_prefix,"_QC_zscore.svg"),plot = pall2,width = 10,height = 8)
  }
  
}


hycoloc_barplot <- function(hydata,output_plot=NULL,plot_width=NULL,plot_height=NULL){
  
  ngene <- nrow(hydata)
  
  if(ngene>20){
    p <- hydata %>% 
      mutate(label=if_else(is.na(candidate_snp)|posterior_prob<0.5,NA_character_,paste0(gene_symbol,"/",candidate_snp))) %>% 
      #mutate(label=paste0(gene_symbol,"/",candidate_snp)) %>% 
      mutate(gene_symbol=fct_reorder(gene_symbol,posterior_prob)) %>% 
      ggplot(aes(gene_symbol,posterior_prob,fill=posterior_prob))+
      geom_hline(yintercept = 0.5,col='#2CA02CFF',size=0.5)+
      geom_col(width = 0.5,col='black',size=0.25)+
      scale_fill_material("deep-purple")+
      geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = 0.1,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20)+
      scale_y_continuous(limits = c(0,1),breaks = pretty_breaks(),expand = c(0,0))+
      labs(x='QTL Trait',y='Posterior Probability\n')+
      theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'Yy',axis = "XY",axis_col = 'black',base_family='Roboto Condensed')+
      theme(axis.text.x = element_blank(),legend.position = 'none',panel.grid = element_line(linetype = 5))
    
  }else{
    
    p <- hydata %>% 
      mutate(label=if_else(is.na(candidate_snp)|posterior_prob<0.5,NA_character_,candidate_snp)) %>% 
      #mutate(label=paste0(gene_symbol,"/",candidate_snp)) %>% 
      mutate(gene_symbol=fct_reorder(gene_symbol,posterior_prob)) %>% 
      ggplot(aes(gene_symbol,posterior_prob,fill=posterior_prob))+
      geom_hline(yintercept = 0.5,col='#2CA02CFF',size=0.5)+
      geom_col(width = 0.5,col='black',size=0.25)+
      scale_fill_material("deep-purple")+
      geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = 0.1,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20)+
      scale_y_continuous(limits = c(0,1),breaks = pretty_breaks(),expand = c(0,0))+
      labs(x='QTL Trait',y='Posterior Probability\n')+
      theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'Yy',axis = "XY",axis_col = 'black',base_family='Roboto Condensed')+
      theme(axis.text.x = element_text(angle = 90,hjust = 1,vjust = 0.5),legend.position = 'none',panel.grid = element_line(linetype = 5))
    
  }
  
  if(is.null(output_plot)){
    return(p)
  }else{
    xleng <- 4+ngene*0.5
    xleng <- if_else(xleng>15,15,xleng)
    yleng <- 7
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p,width = plot_width,height = plot_height)
  }
}




hycoloc_boxplot <- function(hydata_score,output_plot=NULL,plot_width=NULL,plot_height=NULL){
  
  ngene <- hydata_score %>% select(gene_symbol) %>% unique() %>% nrow()
  
  if(ngene<1){
    errinfo <- "ERROR: No coloclaization trait found between GWAS and QTL"
    return(errinfo)
  }else {
    p <- hydata_score %>% 
      mutate(label=if_else(snpscore>0.05,rsnum,NA_character_)) %>% 
      ggplot(aes(snpscore,gene_symbol))+
      geom_vline(xintercept = 0.05,col='#2CA02CFF',size=0.5)+
      geom_boxplot(outlier.size = 2,outlier.shape = 21,outlier.fill = "#D62728FF",size=0.3)+
      geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = 0.1,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20)+
      scale_x_continuous(breaks = pretty_breaks())+
      labs(x='SNP Score',y='QTL Trait')+
      theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'XY',axis_col = 'black',base_family='Roboto Condensed')+
      theme(legend.position = 'none',panel.grid.major.x = element_line(linetype = 5))+
      panel_border()
  }
  
  if(is.null(output_plot)){
    return(p)
  }else{
    xleng <- 10
    yleng <- 2+ngene
    yleng <- if_else(yleng>10,10,yleng)
    
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p,width = plot_width,height = plot_height)
  }
}




ecaviar_visualize <- function(ecdata,output_plot_prefix=NULL,plot_width=NULL,plot_height=NULL){
  
  ecdata2 <- ecdata %>% 
    mutate(CLPP=as.numeric(CLPP),CLPP2=as.numeric(CLPP2)) %>% 
    select(gene_symbol,rsnum,Leadsnp,leadsnp_included,CLPP,CLPP2) %>% 
    pivot_longer(cols = c(CLPP,CLPP2),names_to = 'Group',values_to = 'CLPP') %>% 
    filter(!is.na(CLPP)) %>% 
    mutate(Group=if_else(Group=="CLPP","window=100kb","window=50 SNPs")) 
  
  
  genelevel <- ecdata2 %>% group_by(gene_symbol) %>% arrange(desc(CLPP)) %>% slice(1) %>% ungroup() %>% arrange(CLPP) %>% pull(gene_symbol)
  nudge_y <- 0.03*max(ecdata2$CLPP)
  ngene <- length(genelevel)
  
  p1 <- ecdata2 %>% 
    group_by(gene_symbol,Group) %>% 
    arrange(desc(CLPP)) %>% 
    slice(1) %>% 
    ungroup() %>% 
    mutate(label=if_else(is.na(rsnum)|CLPP<0.01,NA_character_,rsnum)) %>% 
    mutate(gene_symbol=factor(gene_symbol,levels = genelevel)) %>% 
    ggplot(aes(gene_symbol,CLPP,fill=CLPP))+
    facet_wrap(~Group,ncol = 1)+
    geom_hline(yintercept = 0.01,col='#2CA02CFF',size=0.5)+
    geom_col(width = 0.5,col='black',size=0.25)+
    scale_fill_material("deep-purple")+
    geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = nudge_y,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20)+
    scale_y_continuous(breaks = pretty_breaks(),expand = c(0,0))+
    labs(x='QTL Trait',y='Colocalization Posterior Probability (CLPP)\n')+
    theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'Yy',axis = "XY",axis_col = 'black',base_family='Roboto Condensed')+
    theme(axis.text.x = element_text(angle = 90,hjust = 1,vjust = 0.5),legend.position = 'none',panel.grid = element_line(linetype = 5))
  
  p2 <- ecdata2 %>% 
    mutate(gene_symbol=factor(gene_symbol,levels = genelevel)) %>% 
    mutate(label=if_else(CLPP>0.01,rsnum,NA_character_)) %>% 
    ggplot(aes(CLPP,gene_symbol))+
    geom_vline(xintercept = 0.01,col='#2CA02CFF',size=0.5)+
    facet_wrap(~Group,ncol = 1)+
    geom_boxplot(outlier.size = 2,outlier.shape = 21,outlier.fill = "#D62728FF",size=0.3)+
    geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = 0.1,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20,force = 5)+
    scale_x_continuous(breaks = pretty_breaks())+
    labs(x='Colocalization Posterior Probability (CLPP)',y='QTL Trait')+
    theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'XY',axis_col = 'black',base_family='Roboto Condensed')+
    theme(legend.position = 'none',panel.grid.major.x = element_line(linetype = 5))+
    panel_border()
  
  
  
  if(is.null(output_plot_prefix)){
    return(list(p1,p2))
  }else{
    output_plot <- paste0(output_plot_prefix,"_barplot.svg")
    xleng <- 4+ngene*0.5
    xleng <- if_else(xleng>15,15,xleng)
    yleng <- 12
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p1,width = plot_width,height = plot_height)
    
    output_plot <- paste0(output_plot_prefix,"_boxplot.svg")
    xleng <- 10
    yleng <- 2*(2+ngene)
    yleng <- if_else(yleng>16,16,yleng)
    
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p2,width = plot_width,height = plot_height)
  }
  
  
}




coloc_visualize <- function(hydata,ecdata,output_plot=NULL,plot_width=NULL,plot_height=NULL){
  
  genelevel <- hydata %>% arrange(posterior_prob) %>% pull(gene_symbol)
  
  p1 <- hydata %>% 
    mutate(label=if_else(is.na(candidate_snp)|posterior_prob<0.5,NA_character_,candidate_snp)) %>% 
    #mutate(label=paste0(gene_symbol,"/",candidate_snp)) %>% 
    mutate(gene_symbol=fct_reorder(gene_symbol,posterior_prob)) %>% 
    ggplot(aes(gene_symbol,posterior_prob,fill=posterior_prob))+
    geom_hline(yintercept = 0.5,col='#2CA02CFF',size=0.5)+
    geom_col(width = 0.5,col='black',size=0.25)+
    scale_fill_material("deep-purple")+
    ggrepel::geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = 0.1,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20)+
    scale_y_continuous(limits = c(0,1),breaks = pretty_breaks(),expand = c(0,0))+
    labs(x='QTL Trait',y='HyPrColoc: Posterior Probability\n')+
    theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'Yy',axis = "XY",axis_col = 'black',base_family='Roboto Condensed')+
    theme(axis.text.x = element_blank(),axis.title.x = element_blank(),legend.position = 'none',panel.grid = element_line(linetype = 5))
  
  
  ecdata2 <- ecdata %>% 
    mutate(CLPP=as.numeric(CLPP),CLPP2=as.numeric(CLPP2)) %>% 
    select(gene_symbol,rsnum,Leadsnp,leadsnp_included,CLPP,CLPP2) %>% 
    pivot_longer(cols = c(CLPP,CLPP2),names_to = 'Group',values_to = 'CLPP') %>% 
    filter(!is.na(CLPP)) %>% 
    mutate(Group=if_else(Group=="CLPP","window=100kb","window=50 SNPs")) 
  
  nudge_y <- 0.03*max(ecdata2$CLPP)
  ngene <- length(genelevel)
  
  p2 <- ecdata2 %>% 
    group_by(gene_symbol) %>% 
    arrange(desc(CLPP)) %>% 
    slice(1) %>% 
    ungroup() %>% 
    mutate(label=if_else(is.na(rsnum)|CLPP<0.01,NA_character_,rsnum)) %>% 
    mutate(gene_symbol=factor(gene_symbol,levels = genelevel)) %>% 
    ggplot(aes(gene_symbol,CLPP,fill=CLPP))+
    geom_hline(yintercept = 0.01,col='#2CA02CFF',size=0.5)+
    geom_col(width = 0.5,col='black',size=0.25)+
    scale_fill_material("deep-purple")+
    ggrepel::geom_text_repel(aes(label=label),hjust=1,vjust=0,nudge_y = nudge_y,segment.color="black",segment.curvature = -0.1,segment.ncp = 3,segment.angle = 20)+
    scale_y_continuous(breaks = pretty_breaks(),expand = c(0,0))+
    labs(x='QTL Trait',y='eCAVIAR: Colocalization Posterior Probability\n')+
    theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,grid = 'Yy',axis = "XY",axis_col = 'black',base_family='Roboto Condensed')+
    theme(axis.text.x = element_text(angle = 90,hjust = 1,vjust = 0.5),legend.position = 'none',panel.grid = element_line(linetype = 5))
  
  p <- plot_grid(p1+theme(plot.margin = margin(b = 2)),p2+theme(plot.margin = margin(t = 2)),align = 'v',axis = 'lr',ncol = 1)
  
  if(is.null(output_plot)){
    return(p)
  }else{
    xleng <- 4+ngene*0.5
    xleng <- if_else(xleng>15,15,xleng)
    yleng <- 12
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p,width = plot_width,height = plot_height)
  }
}








locus_quantification_cor <- function(qdata,qtldata,output_plot=NULL,plot_width=NULL,plot_height=NULL){
  
  id2symbol <- qtldata %>% select(gene_id,gene_symbol) %>% unique()
  
  mqdata <- qdata %>% select(-chr,-start,-end,-gene_id) %>% as.matrix()
  rownames(mqdata) <- qdata %>% select(gene_id) %>% left_join(id2symbol) %>% pull(gene_symbol)
  mqdata <- t(mqdata)
  # Pearson correlation
  pear <- corrr::correlate(mqdata, method = "pearson", quiet= TRUE) %>%
    corrr::shave(upper = TRUE) %>%
    corrr::stretch() %>%
    stats::na.omit() %>%
    dplyr::rename(pearson_r = "r")
  # Spearman correlation
  spear <- corrr::correlate(mqdata, method = "spearman", quiet= TRUE) %>%
    corrr::shave(upper = TRUE) %>%
    corrr::stretch() %>%
    stats::na.omit() %>%
    dplyr::rename(spearman_r = "r")
  
  df <- dplyr::full_join(pear, spear, by = c("x", "y")) %>%
    ggasym::asymmetrise(x, y)
  
  
  p <- ggplot(df) +
    geom_asymmat(aes(x = x, y = y,
                     fill_tl = pearson_r, fill_br = spearman_r)) +
    scale_fill_tl_distiller(type = "div", palette = "RdYlBu",
                            na.value = "grey90",
                            guide = guide_colourbar(direction = "vertical",barheight = unit(6,'cm'),
                                                    order = 1,
                                                    title.position = "top")) +
    scale_fill_br_distiller(type = "div", palette = "RdYlBu",
                            na.value = "grey90",
                            guide = guide_colourbar(direction = "vertical",barheight = unit(6,'cm'),
                                                    order = 2,
                                                    title.position = "top")) +
    theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14,axis_text_size = 10,grid = FALSE,axis = FALSE,ticks = FALSE)+
    theme(panel.background = element_rect(fill = "grey25"),axis.text.x = element_text(angle = 90,hjust = 1,vjust = 0.5),
          panel.grid = element_blank(),plot.title = element_text(hjust = 0.5)) +
    scale_x_discrete(expand = c(0, 0)) +
    scale_y_discrete(expand = c(0, 0)) +
    coord_equal() +
    panel_border(size = 0.5,colour = 'black')+
    labs(x = "Spearman Correlations", y = "Pearson Correlations",
         title = "Comparing Pearson and Spearman Correlations",
         fill_tl = "Pearson r", fill_br = "Spearman r")
  
  ngene <- dim(mqdata)[2]
  
  if(is.null(output_plot)){
    return(p)
  }else{
    xleng <- 2+ngene*0.5
    xleng <- if_else(xleng>15,15,xleng)
    yleng <- xleng
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p,width = plot_width,height = plot_height)
  }
}







locus_quantification_dis<- function(qdata,qtldata,genesets=NULL,output_plot=NULL,plot_width=NULL,plot_height=NULL){
  
  id2symbol <- qtldata %>% select(gene_id,gene_symbol) %>% unique()
  if(is.null(genesets)){
    genesets <- qtldata %>% group_by(gene_symbol) %>% arrange(pval_nominal) %>% slice(1) %>% ungroup() %>% arrange(pval_nominal) %>% slice(1:15) %>% pull(gene_symbol)
  }
  genesets2 <- id2symbol %>% filter(gene_symbol %in% genesets) %>% pull(gene_id)
  qdata2 <- qdata %>% 
    filter(gene_id %in% genesets2) %>% 
    left_join(id2symbol) %>% 
    pivot_longer(cols = -c(chr,start,end,gene_id,gene_symbol),names_to = 'sample',values_to = 'expression') %>% 
    mutate(expression=log2(expression+1e-3))
  
  genelevel <- qdata2 %>% group_by(gene_symbol) %>% summarise(mexp=median(expression,na.rm = TRUE)) %>% arrange(mexp) %>% pull(gene_symbol)
  
  p <- qdata2 %>% 
    mutate(gene_symbol=factor(gene_symbol,levels = genelevel)) %>% 
    ggplot(aes(x=expression,y=gene_symbol,fill=stat(x)))+
    #stat_density_ridges(quantile_lines = TRUE, quantiles = 2,fill='#cccccc')+
    geom_density_ridges_gradient() + 
    scale_fill_viridis_c(option = 'C')+
    scale_x_continuous(expand = c(0, 0),breaks = pretty_breaks()) +
    scale_y_discrete(expand = c(0, 0)) +
    coord_cartesian(clip = "off") +
    theme_ipsum_rc(axis_title_just = 'm',axis_title_size = 14)+
    labs(x="Quantification (log2)",y='QTL Trait')+
    theme(legend.position = 'none')
  
  ngene <- length(genesets)
  
  if(is.null(output_plot)){
    return(p)
  }else{
    xleng <- 10
    yleng <- 4+ngene*0.4
    yleng <- if_else(yleng>15,15,yleng)
    if(is.null(plot_width)){ plot_width <-  xleng}
    if(is.null(plot_height)){ plot_height <-  yleng}
    ggsave(filename = output_plot,plot = p,width = plot_width,height = plot_height)
  }
}

