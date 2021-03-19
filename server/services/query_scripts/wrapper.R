qtlsCalculateMain <- function(rfile, workingDirectory, select_qtls_samples, select_gwas_sample, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef) {
  source(rfile)
  main(workingDirectory, select_qtls_samples, select_gwas_sample, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef)

}

qtlsCalculateLocusAlignmentBoxplots <- function(rfile, workingDirectory, select_qtls_samples, quantificationFile, genotypeFile, info) {
  source(rfile)
  locus_alignment_boxplots(workingDirectory, select_qtls_samples, quantificationFile, genotypeFile, info)
}

qtlsCalculateLocusColocalizationECAVIAR <- function(rfile, workingDirectory, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, select_ref, select_dist, request) {
  source(rfile)
  locus_colocalization_eCAVIAR(workingDirectory, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, select_ref, select_dist, request)
}

qtlsCalculateLocusColocalizationHyprcolocLD <- function(rfile, workingDirectory, ldfile, select_ref, select_chr, select_pos, select_dist, request) {
  source(rfile)
  locus_colocalization_hyprcoloc_ld(workingDirectory, ldfile, select_ref, select_chr, select_pos, select_dist, request)
}

qtlsCalculateLocusColocalizationHyprcoloc <- function(rfile, workingDirectory, select_gwas_sample, select_qtls_samples, select_dist, select_ref, gwasFile, associationFile, ldfile, request) {
  source(rfile)
  locus_colocalization_hyprcoloc(workingDirectory, select_gwas_sample, select_qtls_samples, select_dist, select_ref, gwasFile, associationFile, ldfile, request)
}