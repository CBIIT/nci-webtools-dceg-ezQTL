Here are the descriptions of the files included in the folder generated from “Download Results” function.

The example file names are based on the sample data files available from “Load Sample Data”. 

a7995380-7d4d-11ec-9004-2133f990a878 (Temporary Folder Name; This is also used as the prefix for the ezQTL analysis )

(Original user’s input or public data files before QC processing in selected locus)
|----MX2.GWAS.txt (GWAS association file)
|----MX2.eQTL.txt (molecular QTL association file; in this case, eQTL file)
|----MX2.LD.gz (LD matrix file)
|----MX2.quantification.txt (trait quantification file; in this case, gene expression file)
|----MX2.genotyping.txt (Genotype data file)


(ezQTL QC processing related files for Locus QC)
|----ezQTL.log (QC log information for Locus QC)
|----a7995380-7d4d-11ec-9004-2133f990a878_QC_QTLminP.svg (summary of QTL traits in the input data; QTL minimal p-value plot)
|----a7995380-7d4d-11ec-9004-2133f990a878_QC_overlapping.svg (Variant overlap summary plot among QTL, GWAS and LD data) 
|----a7995380-7d4d-11ec-9004-2133f990a878_QC_zscore.svg (GWAS-QTL allele match summary plot)
|----a7995380-7d4d-11ec-9004-2133f990a878.locus.bed (overlapped variants in bed format)
|----a7995380-7d4d-11ec-9004-2133f990a878.extracted.panel (extracted samples list from a public LD database, such as the 1000 Genomes, based on the selected population)



(ezQTL QC-processed files; only included the QC-passed variants for selected locus)
|----ezQTL_input_gwas.txt (QC-processed GWAS association file)
|----ezQTL_input_qtl.txt (QC-processed QTL association file)
|----ezQTL_input_ld.gz (QC-processed LD matrix file)


(Locus LD visualization files)
|----LD_Output.pdf (LD visualization in pdf format)
|----LD_Output.png (LD visualization in png format)



(Locus Colocalization related files)
|----a7995380-7d4d-11ec-9004-2133f990a878.hyprcoloc.txt (HyPrColoc colocalization result)
|----hyprcoloc_table.svg (visualization of HyPrColoc colocalization)
|----a7995380-7d4d-11ec-9004-2133f990a878.hyprcoloc_snpscore.txt (HyPrColoc-generated SNP scores)
|----hyprcoloc_snpscore_table.svg (visualization of HyPrColoc SNP scores)
|----a7995380-7d4d-11ec-9004-2133f990a878.eCAVIAR.txt (eCAVIAR colocalization result)
|----ecaviar_table_barplot.svg (visualization of eCAVIAR colocalization)
|----ecaviar_table_boxplot.svg (visualization of posterior probability of all tested variants from eCAVIAR colocalization analysis)
|----a7995380-7d4d-11ec-9004-2133f990a878_Summary.svg (visualization of summary colocalization from HyPrColoc and eCAVIAR)

(Locus Quantification related files)
|----quantification_cor.svg (pairwise correlation of traits quantification)
|----quantification_dis.svg (distribution of quantification for all traits)
|----quantification_qtl.svg (box plot of QTLs for selected trait and variant)



(System temporary files, which may be different depending on the inputs)
|----state.json
|----a7995380-7d4d-11ec-9004-2133f990a878.rc_temp.txt
|----a7995380-7d4d-11ec-9004-2133f990a878.run.log



