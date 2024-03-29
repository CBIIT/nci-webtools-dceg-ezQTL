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

qtlsCalculateMain <- function(rfile, workingDirectory, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, ldProject, qtlKey, ldKey, gwasKey, select_chromosome, select_position, bucket, genome_build) {
  source(rfile)
  main(workingDirectory, associationFile, quantificationFile, genotypeFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, ldProject, qtlKey, ldKey, gwasKey, select_chromosome, select_position, bucket, genome_build)
}

qtlsRecalculateQuantification <- function(rfile, workDir, exprFile, genoFile, traitID, genotypeID, log2, request, bucket) {
  source(rfile)
  setwd(workDir)

  gdatafile <- paste0('tmp/', request, '/', genoFile)
  edatafile <- paste0('tmp/', request, '/', exprFile)

  gdata <- read_delim(gdatafile, delim = "\t", col_names = T)
  # check if there are multiple chromosomes in the input genotype file
  if (length(unique(gdata$chr)) > 1) {
    errorMessages <- c(errorMessages, "Multiple chromosomes detected in Genotype Data File, make sure data is on one chromosome only.")
  }
  edata <- read_delim(edatafile, delim = "\t", col_names = T)
  # check if there are multiple chromosomes in the input expression (quantification) file
  if (length(unique(edata$chr)) > 1) {
    errorMessages <- c(errorMessages, "Multiple chromosomes detected in Quantification Data File, make sure data is on one chromosome only.")
  }

  qtlPath <- paste0(workDir, '/', 'tmp/', request, '/quantification_qtl.svg')

  if (identical(traitID, ''))
    traitID <- NULL

  if (identical(genotypeID, ''))
    genotypeID <- NULL


  locus_quantification_qtl(gdata, edata, genotypeID, traitID, qtlPath, log2)
}

qtlsCalculateLocusAlignmentBoxplots <- function(rfile, workingDirectory, quantificationFile, genotypeFile, info, request, bucket) {
  source(rfile)
  locus_alignment_boxplots(workingDirectory, quantificationFile, genotypeFile, info, request, bucket)
}

qtlsCalculateLocusColocalizationECAVIAR <- function(rfile, workingDirectory, gwasFile, associationFile, LDFile, select_ref, select_dist, request, bucket) {
  source(rfile)
  locus_colocalization_eCAVIAR(workingDirectory, gwasFile, associationFile, LDFile, select_ref, select_dist, request, bucket)
}

qtlsCalculateLocusColocalizationHyprcoloc <- function(rfile, workingDirectory, select_dist, select_ref, gwasFile, associationFile, ldfile, request, bucket) {
  source(rfile)
  locus_colocalization_hyprcoloc(workingDirectory, select_dist, select_ref, gwasFile, associationFile, ldfile, request, bucket)
}

qtlsCalculateQC <- function(rfile, gwasFile, associationFile, ldFile, qtlKey, gwasKey, ldKey, leadsnp, distance, select_chromosome, select_position, select_pop, ldProject, gwasPhenotype, request, plotPath, inputPath, logPath, qtlPublic, gwasPublic, ldPublic, workDir, bucket) {
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

  if (identical(ldPublic, 'false')) {
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


  if (identical(leadsnp, 'false'))
    leadsnp <- NULL

  if (identical(select_position, 'false'))
    leadpos <- NULL
  else
    leadpos <- select_position

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


  tryCatch({
    coloc_QC(gwasfile = gwasFile, gwasfile_pub = gwasPublic, qtlfile = associationFile, qtlfile_pub = qtlPublic, ldfile = ldFile, ldfile_pub = ldPublic, leadsnp = leadsnp, leadpos = leadpos, distance = cedistance, zscore_gene = NULL, output_plot_prefix = plotPath, output_prefix = inputPath, logfile = logPath)
    return('{}')
  }, error = function(e) {
    library(jsonlite)
    print(e)
    return(toJSON(list(error = e$message), pretty = TRUE, auto_unbox = TRUE))
  })
}

qtlsColocVisualize <- function(rfile, hydata, ecdata, request) {
  library(plyr)
  source(rfile)

  hydata <- ldply(hydata, data.frame)
  ecdata <- ldply(ecdata, data.frame)

  coloc_visualize(as.data.frame(hydata), as.data.frame(ecdata), request)
}

qtlsCalculateLD <- function(rfile, gwasFile, associationFile, ldFile, genome_build, outputPath, leadsnp, position, ldThreshold, ldAssocData, select_gene, request, workDir, bucket) {
  source(rfile)
  loadAWS()


  if (identical(gwasFile, 'false'))
    gwasFile <- NULL
  else
    gwasFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_gwas.txt')

  if (identical(associationFile, 'false'))
    associationFile = NULL
  else
    associationFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_qtl.txt')

  if (identical(ldFile, 'false'))
    ldFile = NULL
  else
    ldFile <- paste0(workDir, '/tmp/', request, '/ezQTL_input_ld.gz')


  if (identical(ldThreshold, ''))
    ldThreshold = NULL


  # select tabix gtf file
  # GRCh37: gencode.v19.annotation.gtf.gz
  # GRCh38: gencode.v37.annotation.gtf.gz
  tabixFile <- ifelse(genome_build == 'GRCh37', 'gencode.v19.annotation.gtf.gz', 'gencode.v37.annotation.gtf.gz')
  tabixPath = paste0('s3://', bucket, '/ezQTL/tabix/', tabixFile)

  # change work directory to tabix index directory
  setwd(paste0(workDir, '/data/tabix'))

  if (identical(ldAssocData, 'GWAS') & !is.null(gwasFile))
    IntRegionalPlot(genome_build = genome_build, association_file = gwasFile, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = ldThreshold, label_gene_name = TRUE)
  else if (identical(ldAssocData, 'QTL') & !is.null(associationFile))
    IntRegionalPlot(chr = 21, left = 42759805, right = 42859805, trait = select_gene, genome_build = genome_build, association_file = associationFile, LDfile = ldFile, gtf_tabix_file = tabixPath, output_file = outputPath, leadsnp = leadsnp, threshold = ldThreshold, label_gene_name = TRUE)
  else {
    if (identical(leadsnp, 'false'))
      IntRegionalPlot(genome_build = genome_build, gtf_tabix_file = tabixPath, leadsnp_pos = position, association_file = NULL, LDfile = ldFile, label_gene_name = TRUE, output_file = outputPath)
    else
      IntRegionalPlot(genome_build = genome_build, gtf_tabix_file = tabixPath, leadsnp = leadsnp, association_file = NULL, LDfile = ldFile, label_gene_name = TRUE, output_file = outputPath)
  }
}