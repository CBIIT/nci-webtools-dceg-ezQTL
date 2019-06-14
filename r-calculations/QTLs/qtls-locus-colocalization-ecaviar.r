locus_colocalization_eCAVIAR <- function(workDir, select_gwas_sample, select_qtls_samples, gwasFile, assocFile, select_ref, select_dist, select_pop, request, envFile) {
  library(jsonlite)
  library(tidyverse)
  setwd(workDir)

  # gwasFile <- paste0('tmp/', gwasFile)
  # assocFile <- paste0('tmp/', assocFile)
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

  cmd <- paste0('sh QTLs/eCAVIAR_vQTL.sh ', gwasFile, ' ', assocFile, ' ', select_ref, ' ', select_dist, ' ', select_pop, ' ', request, ' ', envFile) 
  system(cmd)

  ecaviarfile <- paste0('tmp/', request, '.eCAVIAR.txt')
  ecaviardata <- read_delim(ecaviarfile, delim = "\t", col_names = T)

  ecaviardata_colnames <- colnames(ecaviardata)
  locus_colocalization_ecaviar_data <- list(setNames(as.data.frame(ecaviardata), ecaviardata_colnames))

  dataSourceJSON <- c(toJSON(list(ecaviar=list(data=locus_colocalization_ecaviar_data))))
  return(dataSourceJSON)
}

