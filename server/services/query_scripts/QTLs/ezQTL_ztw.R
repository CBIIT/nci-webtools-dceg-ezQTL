library(tidyverse)
library(ggplot2)
library(cowplot)
library(hrbrthemes)
library(scales)
library(ggsci)

coloc_QC <- function(gwasfile, qtlfile, ldfile, leadsnp=NULL, distance=100000, zscore_gene=NULL, output_plot_prefix=NULL){
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



