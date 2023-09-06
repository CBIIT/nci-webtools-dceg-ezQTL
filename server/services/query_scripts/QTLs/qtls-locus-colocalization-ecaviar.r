appScriptsPath <- Sys.getenv("APP_SCRIPTS")
appDataFolder <- Sys.getenv(("APP_DATA_FOLDER"))

locus_colocalization_eCAVIAR <- function(gwasFile, assocFile, LDFile, select_ref, select_dist, request, bucket) {
  source(file.path(appScriptsPath, "ezQTL_ztw.R"))
  outputFolder <- file.path(Sys.getenv("OUTPUT_FOLDER"), request)
  library(jsonlite)
  library(tidyverse)
  library(ggrepel)
  library(aws.s3)

  gwasFile <- file.path(outputFolder, "ezQTL_input_gwas.txt")
  assocFile <- file.path(outputFolder, "ezQTL_input_qtl.txt")
  if (!identical(LDFile, "false")) {
    LDFile <- file.path(outputFolder, "ezQTL_input_ld.gz")
  }


  ## execute eCAVIAR calculation: shell script
  if (identical(LDFile, "false")) {
    cmd <- paste0(
      "sh ", appScriptsPath, "/qtls-locus-colocalization-ecaviar.sh ",
      gwasFile, " ", assocFile, " ", select_ref, " ", select_dist, " ", "false", " ",
      request, " ", appDataFolder, " ", appScriptsPath, " ", outputFolder
    )
    system(cmd)
  } else {
    cmd <- paste0(
      "sh ", appScriptsPath, "/qtls-locus-colocalization-ecaviar.sh ",
      gwasFile, " ", assocFile, " ", select_ref, " ", select_dist, " ", LDFile, " ",
      request, " ", appDataFolder, " ", appScriptsPath, " ", outputFolder
    )
    system(cmd)
  }


  # ## move eCAVIAR final output to static/output/ folder
  # cmd <- paste0('mv tmp/', request, '/', request, '.eCAVIAR.txt', ' ', '../static/output')
  # system(cmd)

  ## remove eCAVIAR temp files folder
  unlink(file.path(outputFolder, "ECAVIAR_TMP"), recursive = TRUE)

  ## read output file
  # ecaviarfile <- paste0('../static/output/', request, '.eCAVIAR.txt')
  ecaviarfile <- file.path(outputFolder, "eCAVIAR.txt")
  ecaviardata <- read_delim(ecaviarfile, delim = "\t", col_names = T)
  ecaviardata_colnames <- colnames(ecaviardata)
  ## cast p-value columns to string to prevent json rounding
  if (length(ecaviardata) > 1) {
    ecaviardata[10] <- lapply(ecaviardata[10], as.character)
    ecaviardata[13] <- lapply(ecaviardata[13], as.character)
  }
  ecdata <- setNames(as.data.frame(ecaviardata), ecaviardata_colnames)
  ecaviar_visualize(ecdata, output_plot_prefix = file.path(outputFolder, "ecaviar_table"))
  ## parse outputfile to JSON and return to frontend
  locus_colocalization_ecaviar_data <- list(ecdata)
  dataSourceJSON <- c(toJSON(list(ecaviar = list(request = request, data = locus_colocalization_ecaviar_data))))
  return(dataSourceJSON)
}
