locus_colocalization_eCAVIAR <- function(workDir, select_gwas_sample, select_qtls_samples, gwasFile, assocFile, LDFile, select_ref, select_dist, request) {
  library(jsonlite)
  library(tidyverse)
  setwd(workDir)
  ## use sample data files or user-uploaded data files
  if (identical(select_gwas_sample, 'true')) {
    gwasFile <- paste0('../static/assets/files/', 'MX2.GWAS.rs.txt')
  } else {
    gwasFile <- paste0('tmp/',request,'/', gwasFile)
  }
  if (identical(select_qtls_samples, 'true')) {
    assocFile <- paste0('../static/assets/files/', 'MX2.eQTL.txt') 
    LDFile <- paste0('../static/assets/files/', 'MX2.LD.gz')
  } else {
    assocFile <- paste0('tmp/',request,'/', assocFile)
    if (!identical(LDFile, 'false')) {
      LDFile <- paste0('tmp/',request,'/', LDFile)
    }
  }

  ## execute eCAVIAR calculation: shell script
  if (identical(LDFile, 'false')) {
    cmd <- paste0('sh QTLs/qtls-locus-colocalization-ecaviar.sh ', gwasFile, ' ', assocFile, ' ', select_ref, ' ', select_dist, ' ', 'false', ' ', request) 
    system(cmd)
  } else {
    cmd <- paste0('sh QTLs/qtls-locus-colocalization-ecaviar.sh ', gwasFile, ' ', assocFile, ' ', select_ref, ' ', select_dist, ' ', LDFile, ' ', request) 
    system(cmd)
  }


  ## move eCAVIAR final output to static/output/ folder
  cmd <- paste0('mv tmp/', request, '.eCAVIAR.txt', ' ', '../static/output')
  system(cmd)

  ## remove eCAVIAR temp files folder
  unlink(paste0('tmp/',request,'.','ECAVIAR_TMP'), recursive = TRUE)
  
  ## read output file
  ecaviarfile <- paste0('../static/output/', request, '.eCAVIAR.txt')
  ecaviardata <- read_delim(ecaviarfile, delim = "\t", col_names = T)
  ecaviardata_colnames <- colnames(ecaviardata)
  ## cast p-value columns to string to prevent json rounding
  if (length(ecaviardata) > 1) {
    ecaviardata[10] <- lapply(ecaviardata[10], as.character)
    ecaviardata[13] <- lapply(ecaviardata[13], as.character)
  }
  ## parse outputfile to JSON and return to frontend
  locus_colocalization_ecaviar_data <- list(setNames(as.data.frame(ecaviardata), ecaviardata_colnames))
  dataSourceJSON <- c(toJSON(list(ecaviar=list(request=request, data=locus_colocalization_ecaviar_data))))
  return(dataSourceJSON)
}
### LEAVE EMPTY LINE BELOW ###


workingDirectory <- "/Users/jiangk3/Desktop/dev/nci-webtools-dceg-vQTL/r-calculations"
select_gwas_sample <- "false"
select_qtls_samples <- "false"
gwasFile <- "1562699926201.MX2.GWAS.rs.txt"
assocFile <- "1562699926201.MX2.eQTL.txt"
##LDFile <- "888888888.MX2.LD.gz"
LDFile <- "false"
request <- "1562699926201"
select_ref_eCAVIAR <- "rs408825"
select_dist_eCAVIAR <- "50000"

##locus_colocalization_eCAVIAR(workingDirectory, select_gwas_sample, select_qtls_samples, gwasFile, assocFile, LDFile, select_ref_eCAVIAR, select_dist_eCAVIAR, request)

