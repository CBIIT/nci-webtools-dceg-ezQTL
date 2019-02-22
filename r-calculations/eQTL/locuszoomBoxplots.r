eqtl_locuszoom_boxplots <- function(workDir, exprFile, genoFile, info) {
  setwd(workDir)
  library(tidyverse)
  # library(forcats)
  library(jsonlite)
  # initialize locuszoom boxplots data as empty until data file detected
  locuszoom_boxplots_data <- list(c())

  gdatafile <- paste0('tmp/', genoFile)
  edatafile <- paste0('tmp/', exprFile)

  gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
  edata <- read_delim(edatafile,delim = "\t",col_names = T)

  # parse info json to data frame
  info <- paste0('[', info, ']')  %>%
    fromJSON(info, simplifyDataFrame = TRUE)

  # cexpdata <- edata %>% 
  #   filter(gene_id==gene) %>% 
  #   gather(Sample,exp,-(chr:gene_id))
  cexpdata <- edata %>% 
    filter(gene_id=='ENSG00000143520.6') %>% 
    gather(Sample,exp,-(chr:gene_id))

  cexpdata <- gdata %>% 
    gather(Sample,Genotype,-(chr:alt)) %>% 
    right_join(info) %>%
    left_join(cexpdata)

  locuszoom_boxplots_data <- list(setNames(as.data.frame(cexpdata),c("chr","pos","ref","alt","Sample","Genotype","gene_id","gene_symbol","variant_id","rsnum", "tss_distance", "pval_nominal", "slope", "slope_se", "R2","start","end","exp")))
  dataSource <- c(locuszoom_boxplots_data)
  return(dataSource)
}

