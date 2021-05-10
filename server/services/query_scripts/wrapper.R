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

# get raw s3 object
getS3File <- function(key, bucket) {
  loadAWS()
  library(aws.s3)
  return(rawToChar(get_object(key, bucket)))
}

qtlsCalculateMain <- function(rfile, workingDirectory, select_qtls_samples, select_gwas_sample, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, ldProject, qtlKey, ldKey, gwasKey, select_chromosome, select_position, bucket) {
  source(rfile)
  main(workingDirectory, select_qtls_samples, select_gwas_sample, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, ldProject, qtlKey, ldKey, gwasKey, select_chromosome, select_position, bucket)
}

qtlsCalculateLocusAlignmentBoxplots <- function(rfile, workingDirectory, select_qtls_samples, quantificationFile, genotypeFile, info, request, bucket) {
  source(rfile)
  locus_alignment_boxplots(workingDirectory, select_qtls_samples, quantificationFile, genotypeFile, info, request, bucket)
}

qtlsCalculateLocusColocalizationECAVIAR <- function(rfile, workingDirectory, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, select_ref, select_dist, request, bucket) {
  source(rfile)
  locus_colocalization_eCAVIAR(workingDirectory, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, LDFile, select_ref, select_dist, request, bucket)
}

qtlsCalculateLocusColocalizationHyprcolocLD <- function(rfile, workingDirectory, ldfile, select_ref, select_chr, select_pos, select_dist, request, bucket) {
  source(rfile)
  locus_colocalization_hyprcoloc_ld(workingDirectory, ldfile, select_ref, select_chr, select_pos, select_dist, request, bucket)
}

qtlsCalculateLocusColocalizationHyprcoloc <- function(rfile, workingDirectory, select_gwas_sample, select_qtls_samples, select_dist, select_ref, gwasFile, associationFile, ldfile, request, qtlKey, select_chromosome, select_position, bucket) {
  source(rfile)
  locus_colocalization_hyprcoloc(workingDirectory, select_gwas_sample, select_qtls_samples, select_dist, select_ref, gwasFile, associationFile, ldfile, request, qtlKey, select_chromosome, select_position, bucket)
}

qtlsCalculateQC <- function(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldFile, leadsnp, distance, zscore_gene, request, plotPath, inputPath, logPath, workDir, bucket) {
  source(rfile)
  library(data.table)

  if (identical(select_gwas_sample, 'true')) {
    gwasFile <- getS3File('ezQTL/MX2.examples/MX2.GWAS.rs.txt', bucket)
  } else {

    if(identical(gwasFile, 'false'))
      gwasFile <- NULL
    else 
      gwasFile <- paste0(workDir, '/tmp/', request, '/', gwasFile)
  }
  if (identical(select_qtls_samples, 'true')) {
    associationFile <- getS3File('ezQTL/MX2.examples/MX2.eQTL.txt', bucket)

    publicLDFile = 'ezQTL/MX2.examples/MX2.LD.gz'
    ldFile <- paste0(workDir, '/tmp/', request, '/MX2.LD.gz')

    save_object(publicLDFile, bucket, file = ldFile)
  } else {

    if(identical(associationFile, 'false'))
      associationFile = NULL
    else
      associationFile <- paste0(workDir, '/tmp/', request, '/', associationFile)

    if(identical(ldFile, 'false'))
      ldFile = NULL
    else
      ldFile <- paste0(workDir, '/tmp/', request, '/', ldFile)
  }

  coloc_QC(gwasFile, TRUE, associationFile, TRUE, ldFile, TRUE, leadsnp, NULL, distance, zscore_gene, plotPath, inputPath, logPath)
}

qtlsColocVisualize <- function(rfile, hydata, ecdata, request) {
  library(plyr)
  source(rfile)

  hydata <- ldply(hydata, data.frame)
  ecdata <- ldply(ecdata, data.frame)

  coloc_visualize(as.data.frame(hydata), as.data.frame(ecdata), request)
}

qtlsCalculateLD <- function(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldFile, tabixPath, outputPath, leadsnp, request, workDir, bucket) {
  source(rfile)

  if (identical(select_gwas_sample, 'true')) {
    gwasFile <- paste0(workDir,'/tmp/',request, '/ezQTL_input_gwas.txt')
  } else {
    if(identical(gwasFile, 'false'))
      gwasFile <- NULL
    else 
      gwasFile <- paste0(workDir,'/tmp/',request, '/ezQTL_input_gwas.txt')
  }

  if (identical(select_qtls_samples, 'true')) {
    associationFile <-  paste0(workDir,'/tmp/',request, '/ezQTL_input_qtl.txt')
    ldFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_ld.gz')

  } else {
    if(identical(associationFile, 'false'))
      associationFile = NULL
    else
      associationFile <-  paste0(workDir,'/tmp/',request, '/ezQTL_input_qtl.txt')

    if(identical(ldFile, 'false'))
      ldFile = NULL
    else
      ldFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_ld.gz')
  }

  if(!is.null(gwasFile))
    IntRegionalPlot(genome_build = 'GRCh37',association_file = gwasFile,LDfile = ldFile,gtf_tabix_folder = tabixPath,output_file = outputPath,leadsnp = leadsnp, threshold = 5,label_gene_name = TRUE)
  else if(!is.null(associationFile))
    IntRegionalPlot(chr = 21, left=42759805, right=42859805, trait = 'MX2', genome_build = 'GRCh37',association_file = associationFile,LDfile = ldFile,gtf_tabix_folder = tabixPath,output_file = outputPath,leadsnp = leadsnp, threshold = 5,label_gene_name = TRUE)
}