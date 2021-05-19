loadAWS <- function() {
  if (Sys.getenv("AWS_ACCESS_KEY_ID") == '') {
    library(aws.ec2metadata)

    if (is_ec2()) {
      awsConfig = aws.signature::locate_credentials()
      Sys.setenv("AWS_ACCESS_KEY_ID" = awsConfig$key,
           "AWS_SECRET_ACCESS_KEY" = awsConfig$secret,
           "AWS_DEFAULT_REGION" = awsConfig$region,
           "AWS_SESSION_TOKEN" = ifelse(is.null(awsConfig$session_token), '', awsConfig$session_token))
    }
  }
}

locus_colocalization_hyprcoloc_ld <- function(workDir, ldfile, select_ref, chr, pos, select_dist, request, bucket) {
  library(jsonlite)
  setwd(workDir)
  loadAWS()
  if (identical(ldfile, 'false')) {
    ## execute LD calculation: shell script
    cmd <- paste0('sh server/services/query_scripts/QTLs/qtls-locus-colocalization-hyprcoloc-ld.sh ', select_ref, ' ', chr, ' ', pos, ' ', select_dist, ' ', request, ' ', workDir, ' ', bucket) 
    system(cmd)
    filename <- paste0('tmp/', request, '/', request, ".LD.gz")
  } else {
    filename <- paste0('tmp/', request, '/ezQTL_input_ld.gz')
  }
  
  ## return completion message
  dataSourceJSON <- c(toJSON(list(hyprcoloc_ld=list(request=request, filename=filename))))
  return(dataSourceJSON)
}
### LEAVE EMPTY LINE BELOW ###
