locus_colocalization_eCAVIAR <- function(workDir, gwasFile, assocFile, LDFile, select_ref, select_dist, request, bucket) {
  source('services/query_scripts/QTLs/ezQTL_ztw.R')
  setwd(workDir)
  library(jsonlite)
  library(tidyverse)
  library(ggrepel)
  library(aws.s3)

  gwasFile <- paste0(workDir, '/', 'tmp/', request, '/ezQTL_input_gwas.txt')
  assocFile <- paste0(workDir, '/', 'tmp/', request, '/ezQTL_input_qtl.txt')
  if (!identical(LDFile, 'false')) {
    LDFile <- paste0(workDir, '/', 'tmp/', request, '/ezQTL_input_ld.gz')
  }


  ## execute eCAVIAR calculation: shell script
  if (identical(LDFile, 'false')) {
    cmd <- paste0('sh server/services/query_scripts/QTLs/qtls-locus-colocalization-ecaviar.sh ', gwasFile, ' ', assocFile, ' ', select_ref, ' ', select_dist, ' ', 'false', ' ', request, ' ', workDir)
    system(cmd)
  } else {
    cmd <- paste0('sh server/services/query_scripts/QTLs/qtls-locus-colocalization-ecaviar.sh ', gwasFile, ' ', assocFile, ' ', select_ref, ' ', select_dist, ' ', LDFile, ' ', request, ' ', workDir)
    system(cmd)
  }


  # ## move eCAVIAR final output to static/output/ folder
  # cmd <- paste0('mv tmp/', request, '/', request, '.eCAVIAR.txt', ' ', '../static/output')
  # system(cmd)

  ## remove eCAVIAR temp files folder
  unlink(paste0(workDir, '/', 'tmp/', request, '/', request, '.', 'ECAVIAR_TMP'), recursive = TRUE)

  ## read output file
  # ecaviarfile <- paste0('../static/output/', request, '.eCAVIAR.txt')
  ecaviarfile <- paste0(workDir, '/', 'tmp/', request, '/', request, '.eCAVIAR.txt')
  ecaviardata <- read_delim(ecaviarfile, delim = "\t", col_names = T)
  ecaviardata_colnames <- colnames(ecaviardata)
  ## cast p-value columns to string to prevent json rounding
  if (length(ecaviardata) > 1) {
    ecaviardata[10] <- lapply(ecaviardata[10], as.character)
    ecaviardata[13] <- lapply(ecaviardata[13], as.character)
  }
  ecdata = setNames(as.data.frame(ecaviardata), ecaviardata_colnames)
  ecaviar_visualize(ecdata, output_plot_prefix = paste0('tmp/', request, '/', 'ecaviar_table'))
  ## parse outputfile to JSON and return to frontend
  locus_colocalization_ecaviar_data <- list(ecdata)
  dataSourceJSON <- c(toJSON(list(ecaviar = list(request = request, data = locus_colocalization_ecaviar_data))))
  return(dataSourceJSON)
}

