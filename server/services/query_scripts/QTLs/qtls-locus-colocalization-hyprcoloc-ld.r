locus_colocalization_hyprcoloc_ld <- function(workDir, ldfile, select_ref, chr, pos, select_dist, request) {
  library(jsonlite)
  setwd(workDir)
  if (identical(ldfile, 'false')) {
    ## execute LD calculation: shell script
    cmd <- paste0('sh server/services/query_scripts/QTLs/qtls-locus-colocalization-hyprcoloc-ld.sh ', select_ref, ' ', chr, ' ', pos, ' ', select_dist, ' ', request, ' ', workDir) 
    system(cmd)
    filename <- paste0('tmp/',request,'/',request, ".LD.gz")
  } else {
    filename <- paste0(ldfile)
  }
  
  ## return completion message
  dataSourceJSON <- c(toJSON(list(hyprcoloc_ld=list(request=request, filename=filename))))
  return(dataSourceJSON)
}
### LEAVE EMPTY LINE BELOW ###
