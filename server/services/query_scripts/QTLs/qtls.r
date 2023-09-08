appScriptsPath <- Sys.getenv("APP_SCRIPTS")
appDataFolder <- Sys.getenv(("APP_DATA_FOLDER"))
bucket <- Sys.getenv("DATA_BUCKET")

locus_alignment_define_window <- function(recalculateAttempt, recalculatePop, recalculateGene, recalculateDist,
                                          recalculateRef, in_path, kgvcfpath, chromosome, minpos, maxpos, genome_build) {
  if (identical(recalculateAttempt, "false") || identical(recalculateGene, "true") ||
    identical(recalculateDist, "true") || identical(recalculateRef, "true") ||
    identical(recalculatePop, "true")) {
    idx_path_grch37 <- file.path(appDataFolder, "1kginfo")
    idx_path_grch38 <- file.path(appDataFolder, "1kginfo_GRCh38")

    idx_path <- ifelse(genome_build == "GRCh37", idx_path_grch37, idx_path_grch38)

    cmd <- paste0("cd ", idx_path, "; bcftools view -O z -o ", in_path, " ", kgvcfpath, " ", chromosome, ":", minpos, "-", maxpos, ";")
    system(cmd)
    cmd <- paste0("bcftools index ", in_path)
    system(cmd)
  }
}

getPublicLD <- function(ldKey, request, chromosome, minpos, maxpos, ldProject) {
  outputFolder <- file.path(Sys.getenv("OUTPUT_FOLDER"), request)

  ldTemp <- file.path(outputFolder, "input.vcf.gz")
  LDFile <- file.path(outputFolder, "LD.gz")
  if (ldProject == "1000genomes") {
    ldPathS3 <- paste0("s3://", bucket, "/ezQTL/", ldKey)
    ldLog <- file.path(outputFolder, "publicLD.log")
    cat(paste0("Getting ", ldPathS3, "\n"), file = ldLog, sep = "\n", append = T)

    cmd <- paste0("cd ", appDataFolder, "/", dirname(ldKey), "; bcftools view -S ", outputFolder, "/extracted.panel -m2 -M2 -O z -o ", ldTemp, " ", ldPathS3, " ", chromosome, ":", minpos, "-", maxpos)
    cat(paste(cmd, system(cmd, intern = TRUE), sep = "\n"), file = ldLog, sep = "\n", append = T)
    cmd <- paste0("bcftools index -t ", ldTemp)
    cat(paste(cmd, system(cmd, intern = TRUE), sep = "\n"), file = ldLog, sep = "\n", append = T)
    cmd <- paste0("emeraLD --matrix -i ", ldTemp, ' --stdout --extra --phased |sed "s/:/\t/" |bgzip > ', LDFile)
    cat(paste(cmd, system(cmd, intern = TRUE), sep = "\n"), file = ldLog, sep = "\n", append = T)

    out <- read_delim(LDFile, delim = "\t", col_names = F)
    if (dim(out)[1] > 0) {
      info <- out[, 1:5]
    } else {
      # No LD data available
      info <- data.frame(chr = integer(), pos = integer(), id = character(), ref = character(), alt = character())
    }
  } else if (ldProject == "UKBB") {
    cmd <- paste0("python3 ", appScriptsPath, "/LD_extract_UKBB_npz.py -q chr", chromosome, ":", minpos, "-", maxpos, " -b ", bucket, " -o ", LDFile)
    system(cmd)

    out <- read_delim(LDFile, delim = "\t", col_names = F, col_types = cols("X2" = "c"))
    if (dim(out)[1] > 0) {
      out %>%
        rename(id = X1, chr = X2, pos = X3, ref = X4, alt = X5) %>%
        relocate(chr, pos, id) %>%
        write_delim(LDFile, delim = "\t", col_names = F)
      info <- out[, 1:5]
    } else {
      info <- data.frame(chr = integer(), pos = integer(), id = character(), ref = character(), alt = character())
    }
  }
  if (length(unique(info$chr)) > 1) {
    stop("Multiple chromosomes detected in GWAS Data File, make sure data is on one chromosome only.")
  } else {
    if (dim(out)[2] > 5) {
      out <- as.matrix(out[, -(1:5)])
      colnames(out) <- NULL
    } else {
      out <- as.double(1)
    }
    ld_data <- list("Sigma" = out, "info" = info)
  }
  saveRDS(ld_data, file = file.path(outputFolder, "ld_data.rds"))
}

createExtractedPanel <- function(select_pop, kgpanel, request) {
  outputFolder <- file.path(Sys.getenv("OUTPUT_FOLDER"), request)
  panelPath <- file.path(outputFolder, "extracted.panel")
  # Remove pre-existing panel
  unlink(panelPath)
  select_pop_list <- unlist(strsplit(select_pop, "+", fixed = TRUE))
  for (pop_i in select_pop_list) {
    if (pop_i %in% kgpanel$super_pop) {
      kgpanel %>%
        filter(super_pop == pop_i) %>%
        select(sample) %>%
        write_delim(panelPath, delim = "\t", col_names = F, append = TRUE, quote = "none")
    } else if (pop_i %in% kgpanel$pop) {
      kgpanel %>%
        filter(pop == pop_i) %>%
        select(sample) %>%
        write_delim(panelPath, delim = "\t", col_names = F, append = TRUE, quote = "none")
    }
  }
}

# locus_alignment_get_ld <- function(recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, in_path, request, chromosome, qdata_region_pos) {
#   if (identical(recalculateAttempt, 'false') || identical(recalculateGene, 'true') || identical(recalculateDist, 'true') || identical(recalculateRef, 'true') || (identical(recalculateAttempt, 'true') && identical(recalculatePop, 'true'))) {
#     cmd <- paste0('bcftools view -S tmp/', request, '/', request, '.', 'extracted', '.panel -R ', paste0('tmp/', request, '/', request, '.', 'locus.bed'), ' -O z  ', in_path, '|bcftools sort -O z -o tmp/', request, '/', request, '.', 'input', '.vcf.gz')
#     system(cmd)
#     cmd <- paste0('bcftools index -t tmp/', request, '/', request, '.', 'input', '.vcf.gz')
#     system(cmd)
#     regionLD <- paste0(chromosome, ":", min(qdata_region_pos), "-", max(qdata_region_pos))
#     in_bin <- '/usr/local/bin/emeraLD'
#     getLD <- emeraLD2R(path = paste0('tmp/', request, '/', request, '.', 'input', '.vcf.gz'), bin = in_bin)
#     ld_data <- getLD(region = regionLD)
#     saveRDS(ld_data, file = file.path("tmp/", request, '/', request, ".ld_data.rds"))
#   }
# }

gwas_example <- function(gwasdata, qdata_region) {
  gwasdata <- merge(x = qdata_region, y = gwasdata, by = c("pos", "rsnum"), all.x = TRUE) %>%
    select(chr.y, pos, variant_id, gene_id, gene_symbol, ref.y, alt.y, rsnum, pvalue, zscore, effect, slope, se, R2, tss_distance)
  names(gwasdata) <- c("chr", "pos", "variant_id", "gene_id", "gene_symbol", "ref", "alt", "rsnum", "pvalue", "zscore", "effect", "slope", "se", "R2", "tss_distance")
  ## cast column types to string to prevent rounding of decimals
  gwasdata_string <- gwasdata
  gwasdata_string[9:14] <- lapply(gwasdata_string[9:14], as.character)
  gwasdata_string_colnames <- colnames(gwasdata_string)
  gwas_example_data <- list(setNames(as.data.frame(gwasdata_string), gwasdata_string_colnames))
  return(gwas_example_data)
}

locus_alignment_gwas_scatter <- function(gwasdata, qdata_region) {
  ## coloculization ####
  tmpdata <- qdata_region %>%
    select(chr, pos, ref, alt, pval_nominal, R2) %>%
    left_join(gwasdata) %>%
    filter(!is.na(pvalue), !is.na(pval_nominal))

  # tmptest <- cor.test(-log10(tmpdata$pvalue),-log10(tmpdata$pval_nominal),method = 'spearman')
  # tmptitle <- paste0('rho=',round(tmptest$estimate,3),', p=',round(tmptest$p.value,3))

  # tmptest_spearman <- cor.test(-log10(tmpdata$pvalue), - log10(tmpdata$pval_nominal), method = 'spearman')
  # tmptest_pearson <- cor.test(-log10(tmpdata$pvalue), - log10(tmpdata$pval_nominal), method = 'pearson')
  # tmptitle <- paste0('rho=', round(tmptest_spearman$estimate, 3), ', r=', round(tmptest_pearson$estimate, 3))

  if (length(tmpdata$pvalue) > 5 & length(tmpdata$pvalue) == length(tmpdata$pval_nominal)) {
    tmptest_spearman <- cor.test(-log10(tmpdata$pvalue), -log10(tmpdata$pval_nominal), method = "spearman")
    tmptest_pearson <- cor.test(-log10(tmpdata$pvalue), -log10(tmpdata$pval_nominal), method = "pearson")
    tmptitle <- paste0("rho=", round(tmptest_spearman$estimate, 3), ", r=", round(tmptest_pearson$estimate, 3))
  } else {
    tmptitle <- "rho=NA, r=NA"
  }

  tmpdata_colnames <- colnames(tmpdata)
  locus_alignment_gwas_scatter_data <- list(setNames(as.data.frame(tmpdata), tmpdata_colnames))

  return(list(locus_alignment_gwas_scatter_data, tmptitle))
}

locus_colocalization_correlation <- function(gwasdata, qdata) {
  tryCatch(
    {
      # p_cutoff <- 0.01 ### kevin, a parameter for user to choose max pvalue cut-off for both eQTL and GWAS ##
      tmpdata <- qdata %>%
        select(gene_symbol, gene_id, chr, pos, ref, alt, pval_nominal) %>%
        left_join(gwasdata) %>%
        filter(!is.na(pvalue), !is.na(pval_nominal))
      # filter(!is.na(pvalue),!is.na(pval_nominal),pvalue<p_cutoff,pval_nominal<p_cutoff)
      tmpgeneid <- tmpdata %>%
        count(gene_id, sort = T) %>%
        filter(n > 10) %>%
        pull(gene_id)
      tmpdata <- tmpdata %>%
        filter(gene_id %in% tmpgeneid)

      if (length(tmpgeneid) < 1) {
        errinfo <- paste0("\nERROR: the number of overlapped variants with both eQTL and GWAS data is less than 10 for all traits. P-value correlation will not be calculated")
        cat(errinfo, file = logfile, sep = "\n", append = T)
        stop("ezQTL QC failed for p-value correlation analysis")
      }
      tmpdata <- left_join(
        tmpdata %>%
          group_by(gene_id, gene_symbol) %>%
          do(tidy(cor.test(.$pvalue, .$pval_nominal, method = "spearman"))) %>%
          ungroup() %>%
          select(gene_id, gene_symbol, spearman_r = estimate, spearman_p = p.value),
        tmpdata %>%
          group_by(gene_id, gene_symbol) %>%
          do(tidy(cor.test(.$pvalue, .$pval_nominal, method = "pearson"))) %>%
          ungroup() %>% select(gene_id, gene_symbol, pearson_r = estimate, pearson_p = p.value)
      )
      ## cast column types to string to prevent rounding of decimals
      tmpdata_string <- tmpdata
      tmpdata_string[3:6] <- lapply(tmpdata_string[3:6], as.character)
      locus_colocalization_correlation_colnames <- colnames(tmpdata_string)
      locus_colocalization_correlation_data <- list(setNames(as.data.frame(tmpdata_string), locus_colocalization_correlation_colnames))
      return(locus_colocalization_correlation_data)
    },
    error = function(e) {
      return(e$message)
    }
  )
}

locus_colocalization <- function(gwasdata, qdata, gwasFile, assocFile, request) {
  locus_colocalization_correlation_data <- locus_colocalization_correlation(gwasdata, qdata)
  return(list(locus_colocalization_correlation_data))
}

locus_alignment <- function(qdata, qdata_tmp, gwasdata, ld_data, kgpanel, select_pop, gene, rsnum, request, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, gwasFile, assocFile, LDFile, select_ref, cedistance, top_gene_variants, select_chromosome, select_position, ldProject, qtlKey, ldKey, gwasKey, genome_build) {
  outputFolder <- file.path(Sys.getenv("OUTPUT_FOLDER"), request)

  if (identical(select_ref, "false")) {
    ## set default rsnum to top gene's top rsnum if no ref gene or ld ref chosen
    if (is.null(gene)) {
      rsnum <- top_gene_variants$rsnum[[1]]
    } else {
      ## set default rsnum to ref gene's top rsnum if ref gene is chosen
      rsnum <- top_gene_variants[top_gene_variants$gene_id == gene, ]$rsnum[[1]]
    }
  } else {
    rsnum <- rsnum
  }
  index <- which(qdata$rsnum == rsnum)[1]
  rsnum <- qdata$rsnum[index]
  # determine position automaticaly if using user uploaded data
  if (identical(qtlKey, "false")) {
    chromosome <- qdata$chr[index]
    minpos <- qdata$pos[index] - cedistance
    if (minpos < 0) {
      minpos <- 0
    }
    maxpos <- qdata$pos[index] + cedistance
  } else {
    # public data/user-specified position
    chromosome <- select_chromosome
    select_position <- strtoi(select_position, base = 0L)
    minpos <- ifelse(select_position - cedistance < 0, 0, select_position - cedistance)
    maxpos <- select_position + cedistance
  }
  # chromosome <- unique(qdata$chr)
  # minpos <- min(qdata$pos)
  # maxpos <- max(qdata$pos)

  ## subset gene variant with cis-QTL Distance window
  qdata <- subset(qdata, pos > minpos & pos < maxpos)

  kgvcfpath_grch37 <- paste0("s3://", bucket, "/ezQTL/1kginfo/ALL.chr", chromosome, ".phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz")
  kgvcfpath_grch38 <- paste0("s3://", bucket, "/ezQTL/1kginfo_GRCh38/ALL.chr", chromosome, ".shapeit2_integrated_snvindels_v2a_27022019.GRCh38.phased.vcf.gz")

  kgvcfpath <- ifelse(genome_build == "GRCh37", kgvcfpath_grch37, kgvcfpath_grch38)

  in_path <- file.path(outputFolder, paste0("chr", chromosome, "_", minpos, "_", maxpos, ".vcf.gz"))

  if (identical(LDFile, "false") || identical(recalculateAttempt, "true")) {
    locus_alignment_define_window(recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, in_path, kgvcfpath, chromosome, minpos, maxpos, genome_build)
  }

  # popshort <- "CEU"  ### need to find the superpop recomendation data
  select_pop_list <- unlist(strsplit(select_pop, "+", fixed = TRUE))

  if (length(select_pop_list) == 1) {
    if (select_pop_list == "GWD" || select_pop_list == "PJL" || select_pop_list == "BEB" || select_pop_list == "STU" || select_pop_list == "ITU" || select_pop_list == "MSL" || select_pop_list == "ESN") {
      popshort <- "CEU"
    } else {
      popshort <- select_pop_list
    }
  } else {
    if (select_pop == "YRI+LWK+GWD+MSL+ESN+ASW+ACB") {
      popshort <- "YRI"
    } else if (select_pop == "MXL+PUR+CLM+PEL") {
      popshort <- "MXL"
    } else if (select_pop == "CHB+JPT+CHS+CDX+KHV") {
      popshort <- "CHB"
    } else if (select_pop == "CEU+TSI+FIN+GBR+IBS") {
      popshort <- "CEU"
    } else if (select_pop == "GIH+PJL+BEB+STU+ITU") {
      popshort <- "GIH"
    } else {
      popshort <- "CEU"
    }
  }

  cmd <- paste0("cd ", file.path(appDataFolder, "Recombination_Rate"), "; tabix s3://", bucket, "/ezQTL/Recombination_Rate/", popshort, ".txt.gz ", chromosome, ":", minpos, "-", maxpos, " -D > ", outputFolder, "/rc_temp.txt")
  system(cmd)
  rcdata <- read_delim(file.path(outputFolder, "rc_temp.txt"), delim = "\t", col_names = F)
  if (ncol(rcdata)) {
    colnames(rcdata) <- c("chr", "pos", "rate", "map", "filtered")
  }
  rcdata$pos <- as.integer(rcdata$pos)

  ### main funciton for the LD calculation

  if (is.null(gene)) {
    gene <- qdata %>%
      arrange(pval_nominal, desc(abs(slope)), abs(tss_distance)) %>%
      slice(1) %>%
      pull(gene_id)
  }

  if (is.null(rsnum)) {
    tmp <- qdata %>%
      filter(gene_id == gene) %>%
      arrange(pval_nominal) %>%
      slice(1)
    variant <- tmp %>%
      pull(variant_id)
    rsnum <- tmp %>%
      pull(rsnum)
    info <- tmp %>%
      select(gene_id:alt)
  } else {
    rsnum0 <- rsnum
    tmp <- qdata %>%
      filter(gene_id == gene, rsnum == rsnum0)
    variant <- tmp %>%
      pull(variant_id)
    # rsnum <- tmp %>% pull(rsnum)
    info <- tmp %>%
      select(gene_id:alt)
  }

  ### limit data region to plot ###
  qdata_region <- qdata %>%
    filter(gene_id == gene)
  rcdata_region <- rcdata %>%
    filter(pos <= max(qdata_region$pos), pos >= min(qdata_region$pos))
  rcdata_region_colnames <- colnames(rcdata_region)
  rcdata_region_data <- list(setNames(as.data.frame(rcdata_region), rcdata_region_colnames))
  qdata_top_annotation <- qdata_region %>%
    filter(variant_id == variant)
  qdata_top_annotation_colnames <- colnames(qdata_top_annotation)
  qdata_top_annotation_data <- list(setNames(as.data.frame(qdata_top_annotation), qdata_top_annotation_colnames))

  source(file.path(appScriptsPath, "emeraLD2R.r"))

  ### output region as bed file
  qdata_region %>%
    mutate(start = pos - 1) %>%
    select(chr, start, pos) %>%
    arrange(chr, start, pos) %>%
    unique() %>%
    write_delim(file.path(outputFolder, "locus.bed"), delim = "\t", col_names = F)

  ## remove any previous extracted panel if exists
  unlink(file.path(outputFolder, "extracted.panel"))
  ## read multiple population selections
  # select_pop_list <- unlist(strsplit(select_pop, "+", fixed = TRUE))
  for (pop_i in select_pop_list) {
    if (pop_i %in% kgpanel$super_pop) {
      kgpanel %>%
        filter(super_pop == pop_i) %>%
        select(sample) %>%
        write_delim(file.path(outputFolder, "extracted.panel"), delim = "\t", col_names = F, append = TRUE)
    } else if (pop_i %in% kgpanel$pop) {
      kgpanel %>%
        filter(pop == pop_i) %>%
        select(sample) %>%
        write_delim(file.path(outputFolder, "extracted.panel"), delim = "\t", col_names = F, append = TRUE)
    }
  }

  if (identical(LDFile, "false") || identical(recalculateAttempt, "true")) {
    if (identical(ldKey, "false")) {
      # locus_alignment_get_ld(recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, in_path, request, chromosome, qdata_region$pos)
      # do not auto generate LD if no LD data input provided
      # empty ld_data
      # ld_data <-
      ld_data <- list("Sigma" = as.double(1), "info" = data.frame(chr = integer(), pos = integer(), id = character(), ref = character(), alt = character()))
    } else {
      # getPublicLD(bucket, ldKey, request, chromosome, minpos, maxpos, ldProject)
      # LDFile = paste0(request, '.input.vcf.gz')
      ld_data <- readRDS(file.path(outputFolder, "ld_data.rds"))
    }
  }

  index <- which(ld_data$info$id == rsnum | str_detect(ld_data$info$id, paste0(";", rsnum)) | str_detect(ld_data$info$id, paste0(rsnum, ";")))

  ### snp may not found in the LD matrix file, means this snp missing from 1kg ### then use the next one

  if (length(index) != 0) {
    ld_info <- as.data.frame(ld_data$Sigma[index, ])
    colnames(ld_info) <- "R2"
    # rownames(ld_info) <- ld_data$info$id
    # qdata_region$R2 <- (ld_info[qdata_region$rsnum,"R2"])^2
    # use the chr:pos as index instead of rsnum
    rownames(ld_info) <- make.unique(paste0(ld_data$info$chr, ":", ld_data$info$pos))
    qdata_region$R2 <- (ld_info[paste0(qdata_region$chr, ":", qdata_region$pos), "R2"])^2
    # write.table(qdata_region, file = paste0("../static/output/",request,".variant_details.txt"), sep = "\t", dec = ".",row.names = FALSE, col.names = TRUE)
    ## cast column types to string to prevent rounding of decimals
    qdata_region_string <- qdata_region
    qdata_region_string[10:13] <- lapply(qdata_region_string[10:13], as.character)
    qdata_region_string_colnames <- colnames(qdata_region_string)
    locus_alignment_data <- list(setNames(as.data.frame(qdata_region_string), qdata_region_string_colnames))
  } else {
    qdata_region$R2 <- NA
    # write.table(qdata_region, file = paste0("../static/output/",request,".variant_details.txt"), sep = "\t", dec = ".",row.names = FALSE, col.names = TRUE)
    ## cast column types to string to prevent rounding of decimals
    qdata_region_string <- qdata_region
    qdata_region_string[10:13] <- lapply(qdata_region_string[10:13], as.character)
    qdata_region_string_colnames <- colnames(qdata_region_string)
    locus_alignment_data <- list(setNames(as.data.frame(qdata_region_string), qdata_region_string_colnames))
  }

  # initialize GWAS data as empty until data file detected
  gwas_example_data <- list(c())
  # initialize scatter data as empty until data file detected
  locus_alignment_gwas_scatter_data_title <- list(c(), c())
  # initialize colocalization data as empty until data file detected
  locus_colocalization_data <- list(c())
  # if GWAS data file is loaded
  if (!identical(gwasFile, "false") || !identical(gwasKey, "false")) {
    ## return relevent gwas data ##
    gwas_example_data <- gwas_example(gwasdata, qdata_region)
    ## return locus alignment gwas scatter data
    locus_alignment_gwas_scatter_data_title <- locus_alignment_gwas_scatter(gwasdata, qdata_region)
    ## return locus colocalization data
    locus_colocalization_data <- locus_colocalization(gwasdata, qdata, gwasFile, assocFile, request)
  }
  return(list(locus_alignment_data, rcdata_region_data, qdata_top_annotation_data, locus_alignment_gwas_scatter_data_title, gwas_example_data, locus_colocalization_data))
}

locus_quantification_heatmap <- function(edata_boxplot) {
  tmpdata <- edata_boxplot %>%
    select(Sample, gene_symbol, exp) %>%
    spread(Sample, exp)

  tmpdata_colnames <- colnames(tmpdata)

  return(list(setNames(as.data.frame(tmpdata), tmpdata_colnames)))
}

locus_quantification <- function(tmp, exprFile, genoFile, edata, gdata, traitID, genotypeID, request) {
  outputFolder <- file.path(Sys.getenv("OUTPUT_FOLDER"), request)
  library(ggasym)
  library(ggridges)
  library(ggstatsplot)
  source(file.path(appScriptsPath, "ezQTL_ztw.R"))
  # initialize boxplot data as empty until data file detected
  locus_quantification_data <- list(c())
  # initialize heatmap data as empty until data file detected
  locus_quantification_heatmap_data <- list(c())
  # check to see if boxplot data files are present
  if ((!identical(genoFile, "false") & !identical(exprFile, "false"))) {
    if (identical(genotypeID, "")) {
      genotypeID <- NULL
    }

    if (identical(traitID, "")) {
      traitID <- NULL
    }

    corPath <- file.path(outputFolder, "quantification_cor.svg")
    locus_quantification_cor(edata, tmp, corPath)
    disPath <- file.path(outputFolder, "quantification_dis.svg")
    locus_quantification_dis(edata, tmp, output_plot = disPath)
    qtlPath <- file.path(outputFolder, "quantification_qtl.svg")
    locus_quantification_qtl(gdata, edata, output_plot = qtlPath, log2 = FALSE)
  }
  # return(list(locus_quantification_data, locus_quantification_heatmap_data))
}

locus_alignment_boxplots <- function(exprFile, genoFile, info, request) {
  inputFolder <- file.path(Sys.getenv("INPUT_FOLDER"), request)
  library(tidyverse)
  # library(forcats)
  library(jsonlite)
  # initialize locus alignment boxplots data as empty until data file detected
  locus_alignment_boxplots_data <- list(c())
  if ((!identical(genoFile, "false") & !identical(exprFile, "false"))) {
    gdatafile <- file.path(inputFolder, genoFile)
    edatafile <- file.path(inputFolder, exprFile)

    gdata <- read_delim(gdatafile, delim = "\t", col_names = T)
    edata <- read_delim(edatafile, delim = "\t", col_names = T)

    # parse info json to data frame
    info <- paste0("[", info, "]") %>%
      fromJSON(info, simplifyDataFrame = TRUE)
    info <- select(info, gene_id, gene_symbol, variant_id, rsnum, chr, pos, ref, alt)

    cexpdata <- edata %>%
      filter(gene_id == info$gene_id) %>%
      gather(Sample, exp, -(chr:gene_id))

    cexpdata <- gdata %>%
      gather(Sample, Genotype, -(chr:alt)) %>%
      right_join(info) %>%
      left_join(cexpdata)

    cexpdata_colnames <- colnames(cexpdata)
    locus_alignment_boxplots_data <- list(setNames(as.data.frame(cexpdata), cexpdata_colnames))
  }
  dataSourceJSON <- c(toJSON(list(locus_alignment_boxplots = list(data = locus_alignment_boxplots_data))))
  return(dataSourceJSON)
}

main <- function(assocFile, exprFile, genoFile, gwasFile, LDFile, request, select_pop, select_gene, select_dist, select_ref, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef, ldProject, qtlKey, ldKey, gwasKey, select_chromosome, select_position, genome_build) {
  inputFolder <- file.path(Sys.getenv("INPUT_FOLDER"), request)
  outputFolder <- file.path(Sys.getenv("OUTPUT_FOLDER"), request)
  library(tidyverse)
  # library(forcats)
  library(jsonlite)
  library(broom)
  library(data.table)

  # initialize messages to empty
  warningMessages <- list()
  errorMessages <- list()

  # log file path
  logfile <<- file.path(outputFolder, "ezQTL.log")

  ## parameters define ##
  if (identical(select_pop, "false")) {
    ## set default population to EUR if none chosen
    select_pop <- "CEU+TSI+FIN+GBR+IBS"
  }
  if (identical(select_gene, "false")) {
    ## set default gene to top gene if none chosen
    gene <- NULL
  } else {
    gene <- select_gene
  }
  if (identical(select_ref, "false")) {
    ## set default rsnum to top gene's rsnum if none chosen
    rsnum <- NULL
  } else {
    rsnum <- select_ref
  }
  if (identical(select_dist, "false")) {
    ## set default cisDistance to 100 Kb (100,000 bp) if none supplied
    cedistance <- 100 * 1000
  } else {
    cedistance <- strtoi(select_dist, base = 0L) * 1000
  }

  select_position <- strtoi(select_position, base = 0L)
  minpos <- ifelse(select_position - cedistance < 0, 0, select_position - cedistance)
  maxpos <- select_position + cedistance

  ## load 1kg pop panel file ##
  kgpanelFile <- getS3File("ezQTL/1kginfo/integrated_call_samples_v3.20130502.ALL.panel", bucket)
  kgpanel <- read_delim(kgpanelFile, delim = "\t", col_names = T) %>%
    select(sample:gender)
  popinfo <- kgpanel %>%
    select(pop, super_pop) %>%
    unique()

  ## read and parse association data file ###
  qdata <- NULL

  # load association data from user upload
  if (!identical(assocFile, "false") || !identical(qtlKey, "false")) {
    qdatafile <- file.path(outputFolder, "ezQTL_input_qtl.txt")
    qdata <- read_delim(qdatafile, delim = "\t", col_names = T, col_types = cols(variant_id = "c", ref = "c", alt = "c"))
  }
  if (!identical(LDFile, "false")) {
    LDFile <- file.path(outputFolder, LDFile)
  }


  # check if there are multiple chromosomes in the input assoc file
  if (length(unique(qdata$chr)) > 1) {
    errorMessages <- c(errorMessages, "Multiple chromosomes detected in Association Data File, make sure data is on one chromosome only.")
    # dataSourceJSON <- c(toJSON(list(info=list(messages=list(errors=errorMessages)))))
    # return(dataSourceJSON)
  }

  # if boxplot data files are loaded
  edata <- "false"
  gdata <- "false"
  if ((!identical(genoFile, "false") & !identical(exprFile, "false"))) {
    gdatafile <- file.path(inputFolder, genoFile)
    edatafile <- file.path(inputFolder, exprFile)


    gdata <- read_delim(gdatafile, delim = "\t", col_names = T)
    # check if there are multiple chromosomes in the input genotype file
    if (length(unique(gdata$chr)) > 1) {
      errorMessages <- c(errorMessages, "Multiple chromosomes detected in Genotype Data File, make sure data is on one chromosome only.")
      # dataSourceJSON <- c(toJSON(list(info=list(messages=list(errors=errorMessages)))))
      # return(dataSourceJSON)
    }
    edata <- read_delim(edatafile, delim = "\t", col_names = T)
    # check if there are multiple chromosomes in the input expression (quantification) file
    if (length(unique(edata$chr)) > 1) {
      errorMessages <- c(errorMessages, "Multiple chromosomes detected in Quantification Data File, make sure data is on one chromosome only.")
      # dataSourceJSON <- c(toJSON(list(info=list(messages=list(errors=errorMessages)))))
      # return(dataSourceJSON)
    }
  }

  ## if LD File is loaded
  ld_data <- "false"
  if (!identical(LDFile, "false")) {
    out <- fread(input = file.path(outputFolder, "ezQTL_input_ld.gz"), header = FALSE, showProgress = FALSE)

    info <- out[, 1:5]
    colnames(info) <- c("chr", "pos", "id", "ref", "alt")
    if (length(unique(info$chr)) > 1) {
      errorMessages <- c(errorMessages, "Multiple chromosomes detected in GWAS Data File, make sure data is on one chromosome only.")
    } else {
      out <- as.matrix(out[, -(1:5)])
      colnames(out) <- NULL
      ld_data <- list("Sigma" = out, "info" = info)
    }
  }

  ## if GWAS File is loaded
  gwasdata <- "false"
  if (!identical(gwasFile, "false") || !identical(gwasKey, "false")) {
    gwasdatafile <- file.path(outputFolder, "ezQTL_input_gwas.txt")

    gwasdata <- read_delim(gwasdatafile, delim = "\t", col_names = T)
    # check if there are multiple chromosomes in the input GWAS file
    if (length(unique(gwasdata$chr)) > 1) {
      errorMessages <- c(errorMessages, "Multiple chromosomes detected in GWAS Data File, make sure data is on one chromosome only.")
      # dataSourceJSON <- c(toJSON(list(info=list(messages=list(errors=errorMessages)))))
      # return(dataSourceJSON)
    }
    # when only gwas data is inputted
    if (is.null(qdata)) {
      source(file.path(appScriptsPath, "ezQTL_ztw.R"))
      qdata <- gwas2qtl(gwasdata)
    }
  }

  ## return errors if there are any
  if (length(errorMessages) > 0) {
    dataSourceJSON <- c(toJSON(list(info = list(messages = list(errors = errorMessages)))))
    return(dataSourceJSON)
  }

  ## check if initial LD Reference rsnum input is in qdata
  ## if not found, set value to null and throw warning message
  if (!is.null(rsnum) && !(rsnum %in% qdata$rsnum)) {
    message <- paste0(rsnum, " not found in Association data file. Using default variant with most significant P-value as LD Reference.")
    warningMessages <- c(warningMessages, message)
    rsnum <- NULL
    select_ref <- "false"
  }

  qdata <- qdata %>%
    arrange(pval_nominal, desc(abs(slope)), abs(tss_distance)) %>%
    group_by(gene_id, variant_id, rsnum, ref, alt) %>%
    slice(1) %>%
    ungroup()

  # return all gene variants
  all_gene_variants <- qdata %>%
    select(gene_id, rsnum)
  all_gene_variants_colnames <- colnames(all_gene_variants)
  all_gene_variants_data <- list(setNames(as.data.frame(all_gene_variants), all_gene_variants_colnames))

  qdata_tmp <- qdata %>%
    group_by(gene_id, gene_symbol) %>%
    arrange(pval_nominal) %>%
    slice(1) %>%
    ungroup() %>%
    arrange(pval_nominal)

  # return most significant variants for all genes
  top_gene_variants <- qdata_tmp %>%
    select(gene_id, gene_symbol, rsnum)
  top_gene_variants_colnames <- colnames(top_gene_variants)
  top_gene_variants_data <- list(setNames(as.data.frame(top_gene_variants), top_gene_variants_colnames))

  # added code to isolate gene_symbols and put in variable
  # gene_symbols <- list(qdata_tmp$gene_symbol)
  gene_list <- qdata_tmp %>%
    select(gene_id, gene_symbol)
  gene_list_colnames <- colnames(gene_list)
  gene_list_data <- list(setNames(as.data.frame(gene_list), gene_list_colnames))

  ## call calculations for qtls modules: locus alignment and locus quantification ##
  ## locus alignment calculations ##
  locus_alignment <- locus_alignment(
    qdata, qdata_tmp, gwasdata, ld_data,
    kgpanel, select_pop, gene, rsnum, request, recalculateAttempt, recalculatePop,
    recalculateGene, recalculateDist, recalculateRef, gwasFile, assocFile, LDFile,
    select_ref, cedistance, top_gene_variants, select_chromosome, select_position,
    ldProject, qtlKey, ldKey, gwasKey, genome_build
  )
  locus_alignment_data <- locus_alignment[[1]]
  rcdata_region_data <- locus_alignment[[2]]
  qdata_top_annotation_data <- locus_alignment[[3]]
  locus_alignment_gwas_scatter <- locus_alignment[[4]]
  locus_alignment_gwas_scatter_data <- locus_alignment_gwas_scatter[[1]]
  locus_alignment_gwas_scatter_title <- locus_alignment_gwas_scatter[[2]]
  gwas_example_data <- locus_alignment[[5]]
  locus_colocalization_data <- locus_alignment[[6]]
  locus_colocalization_correlation_data <- locus_colocalization_data[[1]]
  ## locus quantification calculations ##
  locus_quantification <- locus_quantification(qdata, exprFile, genoFile, edata, gdata, "", "", request)
  # locus_quantification_data <- locus_quantification[[1]]
  # locus_quantification_heatmap_data <- locus_quantification[[2]]

  ## Reassign LD file if public LD data is used
  if (identical(LDFile, "false") && !identical(ldKey, "false")) {
    LDFile <- paste0(request, ".LD.gz")
  }

  ## combine results from QTLs modules calculations and return ##
  dataSourceJSON <- c(toJSON(list(
    info = list(
      recalculateAttempt = recalculateAttempt, recalculatePop = recalculatePop, recalculateGene = recalculateGene,
      recalculateDist = recalculateDist, recalculateRef = recalculateRef,
      top_gene_variants = list(data = top_gene_variants_data),
      all_gene_variants = list(data = all_gene_variants_data),
      gene_list = list(data = gene_list_data),
      inputs = list(
        association_file = assocFile, quantification_file = exprFile,
        genotype_file = genoFile, gwas_file = gwasFile, ld_file = basename(LDFile),
        select_pop = select_pop, select_gene = select_gene, select_dist = select_dist,
        select_ref = select_ref, request = request
      ),
      messages = list(warnings = warningMessages, errors = errorMessages)
    ), locus_alignment = list(
      data = locus_alignment_data, rc = rcdata_region_data,
      top = qdata_top_annotation_data
    ),
    locus_alignment_gwas_scatter = list(
      data = locus_alignment_gwas_scatter_data,
      title = locus_alignment_gwas_scatter_title
    ),
    gwas = list(data = gwas_example_data),
    locus_colocalization_correlation = list(data = locus_colocalization_correlation_data)
  )))
  ## remove all generated temporary files in the /tmp directory

  # unlink(paste0('tmp/*',request,'*'))

  # return(dataSource)
  return(dataSourceJSON)
}
### LEAVE EMPTY LINE BELOW ###
