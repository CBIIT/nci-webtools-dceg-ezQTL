locus_colocalization_hyprcoloc_ld <- function(workDir, select_ref, chr, pos, select_dist, request) {
  library(jsonlite)
  setwd(workDir)
  ## execute LD calculation: shell script
  cmd <- paste0('sh QTLs/qtls-locus-colocalization-hyprcoloc-ld.sh ', select_ref, ' ', chr, ' ', pos, ' ', select_dist, ' ', request) 
  system(cmd)
  filename <- paste0(request,".LD.gz")
  ## return completion message
  dataSourceJSON <- c(toJSON(list(hyprcoloc_ld=list(request=request, filename=filename))))
  return(dataSourceJSON)
}
