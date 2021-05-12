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

qtlsCalculateQC <- function(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldFile, qtlKey, gwasKey, ldKey, leadsnp, distance, select_chromosome, select_position, ldProject, request, plotPath, inputPath, logPath, workDir, bucket) {
  source(rfile)
  library(data.table)
  source(paste0(workDir, '/', 'server/', 'services/', 'query_scripts/', 'QTLs/', 'qtls.r'))

  if (identical(distance, 'false')) {
    ## set default cisDistance to 100 Kb (100,000 bp) if none supplied
    cedistance <- 100 * 1000
  } else {
    cedistance <- strtoi(distance, base = 0L) * 1000
  }

  select_position = strtoi(select_position, base = 0L)
  minpos = ifelse(select_position - cedistance < 0, 0, select_position - cedistance)
  maxpos = select_position + cedistance

  if (identical(select_gwas_sample, 'true')) {
    gwasFile <- getS3File('ezQTL/MX2.examples/MX2.GWAS.rs.txt', bucket)
  } else {

    if(identical(gwasKey, 'false')){

      if(identical(gwasFile, 'false'))
        gwasFile <- NULL
      else 
        gwasFile <- paste0(workDir, '/tmp/', request, '/', gwasFile)
    }
    else{
      loadAWS()
      gwasPathS3 = paste0('s3://', bucket, '/ezQTL/', gwasKey)
      gwasFile = paste0(request, ".gwas_temp.txt")
      cmd = paste0("cd data/", dirname(gwasKey), "; tabix ", gwasPathS3, " ", select_chromosome, ":", minpos, '-', maxpos, " -Dh >", workDir, "/tmp/", request, '/', gwasFile)
      system(cmd)
      gwasFile <- paste0('tmp/', request, '/', request, '.', 'gwas_temp', '.txt')
    }
  }
  if (identical(select_qtls_samples, 'true')) {
    associationFile <- getS3File('ezQTL/MX2.examples/MX2.eQTL.txt', bucket)

    publicLDFile = 'ezQTL/MX2.examples/MX2.LD.gz'
    ldFile <- paste0(workDir, '/tmp/', request, '/MX2.LD.gz')

    save_object(publicLDFile, bucket, file = ldFile)
  } else {

    if(identical(gwasKey, 'false')){

      if(identical(associationFile, 'false'))
        associationFile = NULL
      else
        associationFile <- paste0(workDir, '/tmp/', request, '/', associationFile)
    }
    else{
      loadAWS()
      qtlPathS3 = paste0('s3://', bucket, '/ezQTL/', qtlKey)
      assocFile = paste0(request, ".qtl_temp.txt")
      cmd = paste0("cd data/", dirname(qtlKey), "; tabix ", qtlPathS3, " ", select_chromosome, ":", minpos, '-', maxpos, " -Dh >", workDir, "/tmp/", request, '/', assocFile)
      system(cmd)
      associationFile <- paste0('tmp/', request, '/', request, '.', 'qtl_temp', '.txt')
    }
    if(identical(ldKey, 'false')){
      if(identical(ldFile, 'false'))
        ldFile = NULL
      else
        ldFile <- paste0(workDir, '/tmp/', request, '/', ldFile)
    }
    else{
      getPublicLD(bucket, ldKey, request, select_chromosome, minpos, maxpos, ldProject)
      ldFile <- paste0('tmp/', request, '/', request, '.input.vcf.gz')
    }
  }

  if(identical(leadsnp,'false'))
    leadsnp <- NULL

  coloc_QC(gwasFile, TRUE, associationFile, TRUE, ldFile, TRUE, leadsnp, NULL, cedistance, NULL, plotPath, inputPath, logPath)
}

qtlsColocVisualize <- function(rfile, hydata, ecdata, request) {
  library(plyr)
  source(rfile)

  hydata <- ldply(hydata, data.frame)
  ecdata <- ldply(ecdata, data.frame)

  coloc_visualize(as.data.frame(hydata), as.data.frame(ecdata), request)
}

qtlsCalculateLD <- function(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldFile, genome_build, outputPath, leadsnp, request, workDir, bucket) {
  source(rfile)
  loadAWS()

  if (identical(select_gwas_sample, 'true')) {
    gwasFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_gwas.txt')
  } else {
    if (identical(gwasFile, 'false'))
      gwasFile <- NULL
    else
      gwasFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_gwas.txt')
  }

  if (identical(select_qtls_samples, 'true')) {
    associationFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_qtl.txt')
    ldFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_ld.gz')

  } else {
    if (identical(associationFile, 'false'))
      associationFile = NULL
    else
      associationFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_qtl.txt')

    if (identical(ldFile, 'false'))
      ldFile = NULL
    else
      ldFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_ld.gz')
  }

  # select tabix gtf file
  # GRCh37: gencode.v19.annotation.gtf.gz
  # GRCh38: gencode.v37.annotation.gtf.gz
  tabixFile <- ifelse(genome_build == 'GRCh37', 'gencode.v19.annotation.gtf.gz', 'gencode.v37.annotation.gtf.gz')
  tabixPath = paste0('s3://', bucket, '/ezQTL/tabix/', tabixFile)

  if (!is.null(gwasFile))
    IntRegionalPlot(genome_build = genome_build, association_file = gwasFile, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = 5, label_gene_name = TRUE)
  else if (!is.null(associationFile))
    IntRegionalPlot(chr = 21, left = 42759805, right = 42859805, trait = 'MX2', genome_build = genome_build, association_file = associationFile, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = 5, label_gene_name = TRUE)
}