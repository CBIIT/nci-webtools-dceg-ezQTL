locus_colocalization_eCAVIAR <- function(workDir, select_gwas_sample, select_qtls_samples, gwasFile, assocFile, select_ref, select_dist, request, envFile) {
  library(jsonlite)
  library(tidyverse)
  setwd(workDir)
  ## use sample data files or user-uploaded data files
  if (identical(select_gwas_sample, 'true')) {
    gwasFile <- paste0('../static/assets/files/', 'MX2.GWAS.txt')
  } else {
    gwasFile <- paste0('tmp/', gwasFile)
  }
  if (identical(select_qtls_samples, 'true')) {
    assocFile <- paste0('../static/assets/files/', 'MX2.eQTL.txt') 
  } else {
    assocFile <- paste0('tmp/', assocFile)
  }
  envFile <- paste0('QTLs/', envFile)
  ## execute eCAVIAR calculation: shell script
  cmd <- paste0('sh QTLs/eCAVIAR_vQTL.sh ', gwasFile, ' ', assocFile, ' ', select_ref, ' ', select_dist, ' ', request, ' ', envFile) 
  system(cmd)
  ## move eCAVIAR final output to static/output/ folder
  cmd <- paste0('mv tmp/', request, '.eCAVIAR.txt', ' ', '../static/output')
  system(cmd)
  ## remove eCAVIAR temp files folder
  unlink(paste0('tmp/',request,'.','ECAVIAR_TMP'), recursive = TRUE)
  ## read output file
  ecaviarfile <- paste0('../static/output/', request, '.eCAVIAR.txt')
  ecaviardata <- read_delim(ecaviarfile, delim = "\t", col_names = T)
  ecaviardata_colnames <- colnames(ecaviardata)
  ## parse outputfile to JSON and return to frontend
  locus_colocalization_ecaviar_data <- list(setNames(as.data.frame(ecaviardata), ecaviardata_colnames))
  dataSourceJSON <- c(toJSON(list(ecaviar=list(data=locus_colocalization_ecaviar_data))))
  return(dataSourceJSON)
}
