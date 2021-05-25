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

qtlsCalculateQC <- function(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldFile, qtlKey, gwasKey, ldKey, leadsnp, distance, select_chromosome, select_position, select_pop, ldProject, gwasPhenotype, request, plotPath, inputPath, logPath, qtlPublic, gwasPublic, ldPublic, workDir, bucket) {
  source(rfile)
  library(data.table)
  setwd(workDir)

  dir.create(file.path(workDir, paste0('tmp/', request)))

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
    if (identical(gwasKey, 'false')) {
      if (identical(gwasFile, 'false'))
        gwasFile <- NULL
      else
        gwasFile <- paste0(workDir, '/tmp/', request, '/', gwasFile)
    }
    else {
      gwasFile = paste0(workDir, '/tmp/', request, '/', request, '.gwas_temp.txt')
      if (!file.exists(gwasFile)) {
        loadAWS()
        gwasPathS3 = paste0('s3://', bucket, '/ezQTL/', gwasKey)
        cmd = paste0("cd data/", dirname(gwasKey), "; tabix ", gwasPathS3, " ", select_chromosome, ":", minpos, '-', maxpos, " -Dh >", gwasFile)
        system(cmd)

        gdata <- read_delim(paste0('tmp/', request, '/', request, '.gwas_temp.txt'), delim = "\t", col_names = T)
        names(gdata)[names(gdata) == "#trait"] <- "trait"
        gdata %>% filter(trait == gwasPhenotype) %>% write_delim(paste0('tmp/', request, '/', request, '.gwas_temp.txt'), delim = '\t', col_names = T)
      }
    }
  }
  if (identical(select_qtls_samples, 'true')) {
    associationFile <- getS3File('ezQTL/MX2.examples/MX2.eQTL.txt', bucket)

    publicLDFile = 'ezQTL/MX2.examples/MX2.LD.gz'
    ldFile <- paste0(workDir, '/tmp/', request, '/MX2.LD.gz')

    save_object(publicLDFile, bucket, file = ldFile)
  } else {

    if (identical(qtlKey, 'false')) {

      if (identical(associationFile, 'false'))
        associationFile = NULL
      else
        associationFile <- paste0(workDir, '/tmp/', request, '/', associationFile)
    }
    else {
      associationFile = paste0(workDir, '/tmp/', request, '/', request, '.qtl_temp.txt')
      if (!file.exists(associationFile)) {
        loadAWS()
        qtlPathS3 = paste0('s3://', bucket, '/ezQTL/', qtlKey)
        cmd = paste0("cd data/", dirname(qtlKey), "; tabix ", qtlPathS3, " ", select_chromosome, ":", minpos, '-', maxpos, " -Dh >", associationFile)
        system(cmd)

        # rename #gene_id to gene_id
        qdata <- read_delim(paste0('tmp/', request, '/', request, '.qtl_temp.txt'), delim = "\t", col_names = T, col_types = cols(variant_id = 'c'))
        names(qdata)[names(qdata) == "#gene_id"] <- "gene_id"
        qdata %>% write_delim(paste0('tmp/', request, '/', request, '.qtl_temp.txt'), delim = '\t', col_names = T)
      }
    }

    if (identical(ldKey, 'false')) {
      if (identical(ldFile, 'false'))
        ldFile = NULL
      else
        ldFile <- paste0(workDir, '/tmp/', request, '/', ldFile)
    }
    else {
      ldFile = paste0(workDir, '/tmp/', request, '/', request, '.LD.gz')
      if (!file.exists(ldFile)) {
        kgpanelFile = getS3File('ezQTL/1kginfo/integrated_call_samples_v3.20130502.ALL.panel', bucket)
        kgpanel <- read_delim(kgpanelFile, delim = '\t', col_names = T) %>%
        select(sample:gender)

        createExtractedPanel(select_pop, kgpanel, request)
        getPublicLD(bucket, ldKey, request, select_chromosome, minpos, maxpos, ldProject)
      }
    }
  }

  if (identical(leadsnp, 'false'))
    leadsnp <- NULL

  if (identical(qtlPublic, 'false'))
    qtlPublic <- FALSE
  else
    qtlPublic <- TRUE

  if (identical(ldPublic, 'false'))
    ldPublic <- FALSE
  else
    ldPublic <- TRUE

  if (identical(gwasPublic, 'false'))
    gwasPublic <- FALSE
  else
    gwasPublic <- TRUE


  print(ldFile)
  coloc_QC(gwasFile, gwasPublic, associationFile, qtlPublic, ldFile, ldPublic, leadsnp, NULL, cedistance, NULL, plotPath, inputPath, logPath)
}

qtlsColocVisualize <- function(rfile, hydata, ecdata, request) {
  library(plyr)
  source(rfile)

  hydata <- ldply(hydata, data.frame)
  ecdata <- ldply(ecdata, data.frame)

  coloc_visualize(as.data.frame(hydata), as.data.frame(ecdata), request)
}

qtlsCalculateLD <- function(rfile, select_gwas_sample, select_qtls_samples, gwasFile, associationFile, ldFile, genome_build, outputPath, leadsnp, distance, ldThreshold, ldAssocData, select_gene, request, workDir, bucket) {
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

  if (identical(ldThreshold, ''))
    ldThreshold = NULL


  # select tabix gtf file
  # GRCh37: gencode.v19.annotation.gtf.gz
  # GRCh38: gencode.v37.annotation.gtf.gz
  tabixFile <- ifelse(genome_build == 'GRCh37', 'gencode.v19.annotation.gtf.gz', 'gencode.v37.annotation.gtf.gz')
  tabixPath = paste0('s3://', bucket, '/ezQTL/tabix/', tabixFile)

  if (identical(ldAssocData, 'GWAS') & !is.null(gwasFile))
    IntRegionalPlot(genome_build = genome_build, association_file = gwasFile, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = ldThreshold, label_gene_name = TRUE)
  else if (identical(ldAssocData, 'QTL') & !is.null(associationFile))
    IntRegionalPlot(chr = 21, left = 42759805, right = 42859805, trait = select_gene, genome_build = genome_build, association_file = associationFile, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = ldThreshold, label_gene_name = TRUE)
  else {
    IntRegionalPlot(genome_build = genome_build, association_file = NULL, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = ldThreshold, label_gene_name = TRUE)
  }
}