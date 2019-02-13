eqtl_main <- function(workDir, exprFile, genoFile, request) {
  setwd(workDir)
  library(tidyverse)
  # library(forcats)
  # library(jsonlite)

  ## parse info here ##

  ## gene expressions calculations ##
  locuszoom_boxplots_data <- eqtl_locuszoom_boxplots(workDir, exprFile, genoFilem info)

  dataSource <- c(locuszoom_boxplots_data)
  ## remove all generated temporary files in the /tmp directory
  # unlink(paste0('tmp/*',request,'*'))
  return(dataSource)
}

eqtl_locuszoom_boxplots <- function(workDir, exprFile, genoFile, info) {
  # initialize locuszoom boxplots data as empty until data file detected
  locuszoom_boxplots_data <- list(c())
  # check to see if boxplot data files are present
  gdatafile <- paste0('tmp/', genoFile)
  edatafile <- paste0('tmp/', exprFile)

  gdata <- read_delim(gdatafile,delim = "\t",col_names = T)
  edata <- read_delim(edatafile,delim = "\t",col_names = T)

  cexpdata <- edata %>% 
    filter(gene_id==gene) %>% 
    gather(Sample,exp,-(chr:gene_id))

  cexpdata <- gdata %>% 
    gather(Sample,Genotype,-(chr:alt)) %>% 
    right_join(info) %>% ## info is the data of the indivudual point where the box plots are calculated on
    left_join(cexpdata)

  locuszoom_boxplots_data <- list(setNames(as.data.frame(edata_boxplot),c("chr","pos","ref","alt","Sample","Genotype","gene_id","gene_symbol","variant_id","rsnum","start","end","exp")))
  return(locuszoom_boxplots_data)
}

