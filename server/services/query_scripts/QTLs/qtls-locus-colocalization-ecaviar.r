locus_colocalization_eCAVIAR <- function(workDir, select_gwas_sample, select_qtls_samples, gwasFile, assocFile, LDFile, select_ref, select_dist, request, bucket) {
  source('services/query_scripts/QTLs/ezQTL_ztw.R')
  setwd(workDir)
  library(jsonlite)
  library(tidyverse)
  library(ggrepel)
  library(aws.s3)

  ## use sample data files or user-uploaded data files
  if (identical(select_gwas_sample, 'true')) {
    publicGWASFile = 'ezQTL/MX2.examples/MX2.GWAS.rs.txt'
    gwasFile <- paste0(workDir, '/tmp/', request, '/MX2.GWAS.rs.txt')

    # download example files from s3 and save to request dir
    save_object(publicGWASFile, bucket, file = gwasFile)
  } else {
    gwasFile <- paste0(workDir, '/', 'tmp/', request, '/', gwasFile)
  }
  if (identical(select_qtls_samples, 'true')) {
    publicAssocFile = 'ezQTL/MX2.examples/MX2.eQTL.txt'
    publicLDFile = 'ezQTL/MX2.examples/MX2.LD.gz'
    assocFile <- paste0(workDir, '/tmp/', request, '/MX2.eQTL.txt')
    LDFile <- paste0(workDir, '/tmp/', request, '/MX2.LD.gz')

    # download example files from s3 and save to request dir
    save_object(publicAssocFile, bucket, file = assocFile)
    save_object(publicLDFile, bucket, file = LDFile)
  } else {
    assocFile <- paste0(workDir, '/', 'tmp/', request, '/', assocFile)
    if (!identical(LDFile, 'false')) {
      LDFile <- paste0(workDir, '/', 'tmp/', request, '/', LDFile)
    }
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

