locus_colocalization_hyprcoloc <- function(workDir, select_gwas_sample, select_qtls_samples, select_dist, select_ref, gwasfile, qtlfile, ldfile, request, qtlKey, select_chromosome, select_position, bucket) {
  source('services/query_scripts/QTLs/ezQTL_ztw.R')
  setwd(workDir)
  .libPaths(c(.libPaths(), "~/R"))
  library(hyprcoloc)
  library(tidyverse)
  library(jsonlite)
  library(ggrepel)
  library(aws.s3)

  ##  args = commandArgs(trailingOnly=TRUE)
  ##  gwasfile <- args[1]
  ##  qtlfile <- args[2]
  ##  ldfile <- args[3]
  ##  prefix <- args[4]

  if (identical(select_gwas_sample, 'true')) {
    gwasfile <- getS3File('ezQTL/MX2.examples/MX2.GWAS.rs.txt', bucket)
  } else {
    gwasfile <- paste0('tmp/', request, '/ezQTL_input_gwas.txt')
  }
  if (identical(select_qtls_samples, 'true')) {
    qtlfile <- getS3File('ezQTL/MX2.examples/MX2.eQTL.txt', bucket)
    ldfile <- 'ezQTL/MX2.examples/MX2.LD.gz'

    ld.matrix <- s3read_using(read_delim, delim = '\t', col_names = F, col_types = cols('X1' = 'c'), object = ldfile, bucket = bucket) %>% rename(chr = X1, pos = X2, rsnum = X3, ref = X4, alt = X5)
  } else {
    qtlfile <- paste0('tmp/', request, '/ezQTL_input_qtl.txt')

    ld.matrix <- read_delim(paste0('tmp/', request, '/', ldfile), delim = '\t', col_names = F, col_types = cols('X1' = 'c')) %>% rename(chr = X1, pos = X2, rsnum = X3, ref = X4, alt = X5)
  }


  ## for jiyeon ##

  trait1 <- read_delim(gwasfile, delim = '\t', col_names = T, col_types = cols('chr' = 'c', 'ref' = 'c', 'alt' = 'c'))
  cedistance <- strtoi(select_dist, base = 0L)
  index1 <- which(trait1$rsnum == select_ref)[1]
  if (is.na(index1)) return(toJSON(list(error = paste0(select_ref, ' not found in GWAS data'))))
  minpos1 <- trait1$pos[index1] - cedistance
  if (minpos1 < 0) {
    minpos1 = 0
  }
  maxpos1 <- trait1$pos[index1] + cedistance

  trait1 <- subset(trait1, pos > minpos1 & pos < maxpos1)
  trait2 <- read_delim(qtlfile, delim = '\t', col_names = T, col_types = cols('chr' = 'c', 'variant_id' = 'c', 'ref' = 'c', 'alt' = 'c'))
  index2 <- which(trait2$rsnum == select_ref)[1]
  minpos2 <- trait2$pos[index2] - cedistance
  if (minpos2 < 0) {
    minpos2 = 0
  }
  maxpos2 <- trait2$pos[index2] + cedistance

  trait2 <- subset(trait2, pos > minpos2 & pos < maxpos2)

  gene2symbol <- trait2 %>% select(gene_id, gene_symbol) %>% unique()

  # ld.matrix <- read_delim(ldfile, delim = '\t', col_names = F, col_types = cols('X1' = 'c')) %>% rename(chr = X1, pos = X2, rsnum = X3, ref = X4, alt = X5)
  ld.info <- ld.matrix %>% select(chr, pos, rsnum, ref, alt) %>% mutate(Seq = seq_along(chr))

  ld.matrix <- ld.matrix %>% select(-c(chr, pos, rsnum, ref, alt)) %>% as.matrix
  ## ld =

  result_hyprcoloc <- tibble(iteration = integer(), traits = character(), posterior_prob = double(), regional_prob = double(), candidate_snp = character(), posterior_explained_by_snp = double(), dropped_trait = character())
  result_snpscore <- tibble(rsnum = character(), snpscore = double())


  ### keep the gene id with at least 20 snps ###
  nminal <- 20
  gene_id_filtered <- trait2 %>% count(gene_id, sort = T) %>% arrange(desc(n)) %>% filter(n > nminal) %>% pull(gene_id)
  trait2 <- trait2 %>% filter(gene_id %in% gene_id_filtered)
  ###



  for (i in unique(trait2$gene_id)) {
    geneid <- i

    tdata <- trait1 %>%
      left_join(
        trait2 %>% filter(gene_id == geneid), by = c('chr' = 'chr', 'pos' = 'pos', 'ref' = 'ref', 'alt' = 'alt')
      ) %>%
      mutate(rsnum = if_else(rsnum.x != rsnum.y, paste(chr, pos, ref, alt, sep = ':'), rsnum.x)) %>%
      filter(!is.na(slope), !is.na(effect), !is.na(se), !is.na(slope_se)) %>%
      filter(slope != 0, effect != 0, se != 0, slope_se != 0) %>%
      filter(str_detect(rsnum, "rs")) %>%
      as.data.frame()
    rownames(tdata) <- tdata$rsnum
    betas <- tdata[, c("effect", "slope")] %>% rename(GWAS = effect, QTL = slope) %>% as.matrix()
    ses <- tdata[, c("se", "slope_se")] %>% rename(GWAS = se, QTL = slope_se) %>% as.matrix()
    traits <- c('GWAS', 'QTL')
    # rsid=rownames(tdata)

    rsindex = tdata %>% select(chr, pos, rsnum) %>% left_join(ld.info) %>% select(Seq, rsnum) %>% filter(!is.na(Seq)) ##
    ld.matrix.seq <- ld.matrix[rsindex$Seq, rsindex$Seq]
    rownames(ld.matrix.seq) <- rsindex$rsnum
    colnames(ld.matrix.seq) <- rsindex$rsnum
    betas <- betas[rsindex$rsnum,] ## 
    ses <- ses[rsindex$rsnum,] ##

    binary.traits <- c(1, 0)
    res <- hyprcoloc(betas, ses, trait.names = traits, snp.id = rsindex$rsnum, binary.outcomes = binary.traits, snpscores = TRUE, ld.matrix = ld.matrix.seq);

    result_hyprcoloc <- bind_rows(result_hyprcoloc, res[[1]] %>% mutate(gene_id = geneid))
    if (length(res) > 1) {
      tmpres <- res[[2]][[1]] %>% as.data.frame() %>% rownames_to_column() %>% mutate(gene_id = geneid)
      colnames(tmpres) <- c("rsnum", "snpscore", "gene_id")
      result_snpscore <- bind_rows(result_snpscore, tmpres)
    }
  }

  result_hyprcoloc <- result_hyprcoloc %>% left_join(gene2symbol)

  if (dim(result_snpscore)[1] > 0) {
    result_snpscore <- result_snpscore %>% left_join(gene2symbol)
  }

  result_hyprcoloc <- result_hyprcoloc %>% arrange(desc(posterior_explained_by_snp))
  ## parse result_hyprcoloc dataframe to JSON
  result_hyprcoloc_colnames <- colnames(result_hyprcoloc)
  hyprcoloc_data <- setNames(as.data.frame(result_hyprcoloc), result_hyprcoloc_colnames)
  hycoloc_barplot(hyprcoloc_data, output_plot = paste0('tmp/', request, '/', 'hyprcoloc_table.svg'))
  result_hyprcoloc_data = list(hyprcoloc_data)

  result_snpscore <- result_snpscore %>% arrange(desc(snpscore))
  ## parse result_snpscore dataframe to JSON
  result_snpscore_colnames <- colnames(result_snpscore)
  snpscore_data <- setNames(as.data.frame(result_snpscore), result_snpscore_colnames)
  hycoloc_boxplot(snpscore_data, output_plot = paste0('tmp/', request, '/', 'hyprcoloc_snpscore_table.svg'))
  result_snpscore_data = list(snpscore_data)

  result_hyprcoloc_filename <- paste0(request, ".hyprcoloc.txt")
  result_snpscore_filename <- paste0(request, ".hyprcoloc_snpscore.txt")
  result_hyprcoloc %>% write_delim(paste0('tmp/', request, '/', result_hyprcoloc_filename), delim = '\t', col_names = T)  
  result_snpscore %>% write_delim(paste0('tmp/', request, '/', result_snpscore_filename), delim = '\t', col_names = T)

  #save.image(file=paste0(prefix,".hyprcoloc.RData"))
  dataSourceJSON <- c(toJSON(list(hyprcoloc = list(request = request, result_hyprcoloc = list(data = result_hyprcoloc_data), result_snpscore = list(data = result_snpscore_data)))))
  return(dataSourceJSON)
}
### LEAVE EMPTY LINE BELOW ###
