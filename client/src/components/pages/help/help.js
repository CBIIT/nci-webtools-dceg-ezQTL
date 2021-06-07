import React from 'react';

export function Help() {
  return (
    <div className="px-2">
      <div id="help-logo" className="text-center">
        <img height="150" src="assets/images/ezqtl-logo.png" alt="ezQTL Logo" />
      </div>
      <div className="mt-3">
        <p>
          ezQTL is designed to be an easy and intuitive tool for colocalization
          analysis between QTL and GWAS data. This documentation page provides
          detailed descriptions of input and output file formats and answers to
          typical questions we collected. The source code of ezQTL can be found
          on GitHub. The documentation is divided into the following sections:{' '}
        </p>
      </div>
      <div className="mt-3">
        <p>
          <b>Input file format of ezQTL</b>
        </p>
        <p>
          On the left panel of the "Analyses” tab, you can click{' '}
          <a href="assets/files/MX2.examples.gz" download>
            Downloaded example files
          </a>
          to download the example files for a locus in a melanoma GWAS study.
          Also, you could load them automatically in the ezQTL and check results
          by clicking "load Sample Data”. The QTLs association input files for
          ezQTL can have a very general format of QTL (e.g. QTL downloaded from
          the{' '}
          <a
            href="https://www.gtexportal.org/home/"
            target="_blank"
            rel="noreferrer"
          >
            GTEx Portal
          </a>{' '}
          or output from{' '}
          <a
            href="http://www.bios.unc.edu/research/genomic_software/Matrix_eQTL/"
            target="_blank"
            rel="noreferrer"
          >
            Matrix eQTL
          </a>{' '}
          and{' '}
          <a
            href="http://fastqtl.sourceforge.net/"
            target="_blank"
            rel="noreferrer"
          >
            FastQTL
          </a>
          ). ezQTL requires a few specific column names in any order. Warnings
          will be given in Locus QC if the file formats don’t not match. For the
          colocalization analysis, ezQTL will use the "rsnum” as the key to link
          the three input datasets (QTL/GWAS/LD Matrix). Missing values in the
          "rsnum” column of these three input dataset will be replaced by the
          "chr:pos:ref:alt”. The input genomic coordinates of each input dataset
          should match the genome build specified in the left panel. The
          following description shows examples of each input file format for
          ezQTL.
        </p>
        <br />
        <p>
          <b>QTL Association Data</b>
        </p>
        <p>
          "gene_id” is used as an index identification in order to filter the
          QTL data for the LocusZoom-style plot and colocalization analysis. The
          "gene_symbol” will be used for the selection and display of each
          trait. "gene_id” can be identical to "gene_symbol”. The "rsnum” is
          used to index the QTL data and can be used as the LD reference
          variants in the Locus Alignment. The minimal columns required for the
          QTL dataset include gene_id, gene_symbol, variant_id, rsnum, chr, pos,
          ref, alt, tss_distance (a standard GTEx pipeline includes
          "tss_distance” but you can add any number here to make the program run
          if you do not have this information in the input file), pval_nominal,
          slop and slop_se. Here is a example table for QTL Data:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">gene_id</th>
                <th scope="col">gene_symbol</th>
                <th scope="col">variant_id</th>
                <th scope="col">rsnum</th>
                <th scope="col">chr</th>
                <th scope="col">pos</th>
                <th scope="col">ref</th>
                <th scope="col">alt</th>
                <th scope="col">tss_distance</th>
                <th scope="col">pval_nominal</th>
                <th scope="col">slope</th>
                <th scope="col">slope_se</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ENSG00000157601.9</td>
                <td>MX1</td>
                <td>21:42642038</td>
                <td>rs8133778</td>
                <td>21</td>
                <td>42642038</td>
                <td>A</td>
                <td>G</td>
                <td>-150193</td>
                <td>0.686</td>
                <td>0.057</td>
                <td>0.140</td>
              </tr>
              <tr>
                <td>ENSG00000160179.14</td>
                <td>ABCG1</td>
                <td>21:42642038</td>
                <td>rs8133778</td>
                <td>21</td>
                <td>42642038</td>
                <td>A</td>
                <td>G</td>
                <td>-977761</td>
                <td>0.217</td>
                <td>-0.173</td>
                <td>0.139</td>
              </tr>
              <tr>
                <td>ENSG00000182240.11</td>
                <td>BACE2</td>
                <td>21:42642038</td>
                <td>rs8133778</td>
                <td>21</td>
                <td>42642038</td>
                <td>A</td>
                <td>G</td>
                <td>102310</td>
                <td>0.806</td>
                <td>-0.031</td>
                <td>0.127</td>
              </tr>
              <tr>
                <td>ENSG00000183421.7</td>
                <td>RIPK4</td>
                <td>21:42642038</td>
                <td>rs8133778</td>
                <td>21</td>
                <td>42642038</td>
                <td>A</td>
                <td>G</td>
                <td>-545228</td>
                <td>0.730</td>
                <td>-0.054</td>
                <td>0.156</td>
              </tr>
              <tr>
                <td>ENSG00000183486.8</td>
                <td>MX2</td>
                <td>21:42642038</td>
                <td>rs8133778</td>
                <td>21</td>
                <td>42642038</td>
                <td>A</td>
                <td>G</td>
                <td>-91832</td>
                <td>0.713</td>
                <td>-0.053</td>
                <td>0.144</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <p>
          <b>Quantification Data</b>
        </p>
        <p>
          The "gene_id” column is used as the index identification to link the
          quantification data to QTL data. The column names after "gene_id” are
          the individual sample names and the values can be raw data, normalized
          data or log transformed data or residuals after regressing on the
          variables; Here is an example table for Quantification Data:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">chr</th>
                <th scope="col">start</th>
                <th scope="col">end</th>
                <th scope="col">gene_id</th>
                <th scope="col">C56_1</th>
                <th scope="col">C136_1</th>
                <th scope="col">C10_1</th>
                <th scope="col">C171_1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>21</td>
                <td>42520059</td>
                <td>42520060</td>
                <td>ENSG00000226496.1</td>
                <td>3.99</td>
                <td>3.37</td>
                <td>5.42</td>
                <td>4.03</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42539727</td>
                <td>42539728</td>
                <td>ENSG00000182240.11</td>
                <td>13014.08</td>
                <td>13268.56</td>
                <td>17585.04</td>
                <td>13436.05</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42733869</td>
                <td>42733870</td>
                <td>ENSG00000183486.8</td>
                <td>322.94</td>
                <td>2014.49</td>
                <td>1364.76</td>
                <td>2135.06</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42792230</td>
                <td>42792231</td>
                <td>ENSG00000157601.9</td>
                <td>484.53</td>
                <td>1555.70</td>
                <td>2100.77</td>
                <td>2204.26</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42814668</td>
                <td>42814669</td>
                <td>ENSG00000228318.1</td>
                <td>0.05</td>
                <td>3.61</td>
                <td>1.26</td>
                <td>2.93</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <p>
          <b>Genotype Data</b>
        </p>
        <p>
          The individual sample names (starting at the 5th column) should be the
          same as Quantification Data (but they do not need to be in the same
          order). The genotype can be in different formats (for example, "0/1”
          or "CT”) (0=reference allele and 1=alternative allele). The chr, pos,
          ref and alt information are used as index id linked to QTL data. Chr
          and pos should match the genome build specified in the left panel. Ref
          and alt alleles should match ref and alt alleles in the QTL data. Here
          is an example table for Genotype Data:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">chr</th>
                <th scope="col">pos</th>
                <th scope="col">ref</th>
                <th scope="col">alt</th>
                <th scope="col">C56_1</th>
                <th scope="col">C136_1</th>
                <th scope="col">C10_1</th>
                <th scope="col">C171_1</th>
                <th scope="col">C104_1</th>
                <th scope="col">C72_1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>21</td>
                <td>42642038</td>
                <td>A</td>
                <td>G</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/0</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42642096</td>
                <td>A</td>
                <td>G</td>
                <td>0/0</td>
                <td>0/0</td>
                <td>0/0</td>
                <td>0/1</td>
                <td>0/1</td>
                <td>0/0</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42642405</td>
                <td>G</td>
                <td>A</td>
                <td>0/0</td>
                <td>0/0</td>
                <td>0/0</td>
                <td>0/0</td>
                <td>0/0</td>
                <td>0/0</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42642642</td>
                <td>A</td>
                <td>G</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>1/1</td>
                <td>0/1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <p>
          <b>LD Matrix Data</b>
        </p>
        <p>
          No column name is allowed in the LD Matrix Data. The first 5 columns
          are chr, pos, rsnum, ref and alt, respectively, which record the basic
          information for the LD among all the variants in the locus of
          interest. The remaining columns are the pairwise matrix, representing
          the LD (R value) between two variants. Here is an example table for LD
          Matrix Data:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">21</th>
                <th scope="col">42642038</th>
                <th scope="col">rs8133778</th>
                <th scope="col">A</th>
                <th scope="col">G</th>
                <th scope="col">1.000</th>
                <th scope="col">0.198</th>
                <th scope="col">-0.051</th>
                <th scope="col">0.020</th>
                <th scope="col">0.101</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>21</td>
                <td>42642096</td>
                <td>rs68087522</td>
                <td>A</td>
                <td>G</td>
                <td>0.198</td>
                <td>1.000</td>
                <td>-0.010</td>
                <td>-0.010</td>
                <td>-0.052</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42642110</td>
                <td>rs542372488</td>
                <td>T</td>
                <td>C</td>
                <td>-0.051</td>
                <td>-0.010</td>
                <td>1.000</td>
                <td>-0.001</td>
                <td>-0.005</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42642322</td>
                <td>rs73368336</td>
                <td>C</td>
                <td>T</td>
                <td>0.020</td>
                <td>-0.010</td>
                <td>-0.001</td>
                <td>1.000</td>
                <td>-0.005</td>
              </tr>
              <tr>
                <td>21</td>
                <td>42642405</td>
                <td>rs77240271</td>
                <td>G</td>
                <td>A</td>
                <td>0.101</td>
                <td>-0.052</td>
                <td>-0.005</td>
                <td>-0.005</td>
                <td>1.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <p>
        The following example command can be used to extract this information
        from the raw genotype data of a custom LD reference dataset in vcf
        format using{' '}
        <a
          href="https://github.com/statgen/emeraLD"
          target="_blank"
          rel="noreferrer"
        >
          emeraLD
        </a>
        : <br />
        <code>
          emeraLD --matrix -i input.vcf.gz --stdout --extra --phased |sed
          's/:/\t/' |bgzip > output.LD.gz
        </code>
      </p>
      <br />
      <p>
        <b>GWAS Data</b>
      </p>
      <p>
        The "rsnum” is used as index id linking GWAS data to QTL Data and LD
        Matrix Data. An example script has been included in the ezQTL{' '}
        <a
          href="https://github.com/CBIIT/nci-webtools-dceg-vQTL"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{' '}
        to transfer the GWAS summary statistics from NHGRI GWAS catalog into
        ezQTL GWAS Data format. The minimal columns required for GWAS Data
        include chr, pos, ref, alt, rsnum, pvalue, zscore, effect and se. Here
        is an example table for GWAS Data Data:
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th scope="col">chr</th>
              <th scope="col">pos</th>
              <th scope="col">ref</th>
              <th scope="col">alt</th>
              <th scope="col">rsnum</th>
              <th scope="col">pvalue</th>
              <th scope="col">zscore</th>
              <th scope="col">effect</th>
              <th scope="col">se</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>21</td>
              <td>42642038</td>
              <td>A</td>
              <td>G</td>
              <td>rs8133778</td>
              <td>0.806</td>
              <td>-0.246</td>
              <td>-0.003</td>
              <td>0.011</td>
            </tr>
            <tr>
              <td>21</td>
              <td>42642093</td>
              <td>C</td>
              <td>T</td>
              <td>rs771407982</td>
              <td>0.206</td>
              <td>-1.264</td>
              <td>-1.455</td>
              <td>1.152</td>
            </tr>
            <tr>
              <td>21</td>
              <td>42642096</td>
              <td>A</td>
              <td>G</td>
              <td>rs68087522</td>
              <td>0.330</td>
              <td>0.974</td>
              <td>0.018</td>
              <td>0.018</td>
            </tr>
            <tr>
              <td>21</td>
              <td>42642322</td>
              <td>C</td>
              <td>T</td>
              <td>rs73368336</td>
              <td>0.543</td>
              <td>-0.608</td>
              <td>-0.181</td>
              <td>0.298</td>
            </tr>
            <tr>
              <td>21</td>
              <td>42642405</td>
              <td>G</td>
              <td>A</td>
              <td>rs77240271</td>
              <td>0.078</td>
              <td>-1.761</td>
              <td>-0.047</td>
              <td>0.027</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Check{' '}
        <a
          href="https://huwenboshi.github.io/data%20management/2017/11/23/tips-for-formatting-gwas-summary-stats.html"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{' '}
        for details about the relationship for Z-score, p-value, effect size or
        odds ratio for association studies, which will be useful to prepare GWAS
        Data.
      </p>
      <div className="mt-5">
        <p>
          <b>Public data source</b>
        </p>
        <p>
          We aim to collect as many published QTL datasets with full association
          data available as possible. However, due to the file size limitation,
          most studies only make the genome-wide significant QTL dataset
          available for downloading and could not be used as part of our data
          sources. For the GWAS summary data, we mostly downloaded the formatted
          datasets using the{' '}
          <a
            href="https://github.com/mikegloudemans/gwas-download"
            target="_blank"
            rel="noreferrer"
          >
            bash script
          </a>{' '}
          from the{' '}
          <a href="http://locuscompare.com/" target="_blank" rel="noreferrer">
            locuscompare
          </a>
          . In addition, we include most publicly available cancer related GWAS
          summary data from{' '}
          <a
            href="https://www.ebi.ac.uk/gwas/"
            target="_blank"
            rel="noreferrer"
          >
            GWAS Catalog
          </a>{' '}
          and other web sources. For the LD Matrix Data, the current build of
          1000 genomes VCF data (both GRCh37 and GRCh38 available) and
          pre-calculated UK BioBank LD (GRCh37 only) reference are included.
          Check the ‘Public Data Source’ table for the detailed public data
          sources.
        </p>
        <p>
          Please <a href="mailto:http://tongwu.zhang@nih.gov">contact us</a> if
          you have any public full association data not included here.
        </p>
      </div>
      <div className="mt-5">
        <p>
          <b>Relationship between input datasets and module functions</b>
        </p>
        <p>
          The following table shows the data requirement for each module in
          ezQTL. Only Locus Colocalization requires three major input datasets
          together (QTL/GWAS/LD Matrix). All other modules require at least one
          major data input as indicated in this table. Locus Table and Locus
          Quantification require at least two input datasets as highlighted in
          the red box. Locus QC will be the first step for data processing and
          generate modified post-QC datasets (including QTL/GWAS/LD Matrix
          depending on input datasets) as input files for the rest of the
          modules. All other modules will work independently and simultaneously
          after Locus QC.
        </p>
        <img
          className="w-100"
          src="assets/images/data_input_relationship.svg"
        />
      </div>
      <div className="mt-5">
        <p>
          <b>Colocalization Analysis</b>
        </p>
        <p>
          Three methods are used in colocalization analyses between GWAS and all
          QTLs (including all phenotypes/traits in QTLs such as all genes in
          eQTL files) in the "Locus Colocalization” sub-modules and the "Locus
          Alignment” module. The first method is similar to{' '}
          <a href="http://locuscompare.com/" target="_blank" rel="noreferrer">
            LocusCompare
          </a>
          , which investigates the correlation between the GWAS -log10(p-value)
          and QTL -log10(p-value), and is visualized separately in the "Locus
          Alignment” module. Both Pearson and Spearman correlation coefficients
          and p-values are calculated for each phenotype. An association p-value
          threshold can be applied to this regression module. The second method
          uses{' '}
          <a
            href="https://github.com/jrs95/hyprcoloc"
            target="_blank"
            rel="noreferrer"
          >
            HyPrColoc
          </a>{' '}
          to prioritize the common "causal” variants for the shared genetic
          etiology across multiple related traits. Two tables were generated
          including the colocalized traits information, potential causal
          variants and variant ranked scores. The third method is{' '}
          <a
            href="http://genetics.cs.ucla.edu/caviar/"
            target="_blank"
            rel="noreferrer"
          >
            eCAVIAR
          </a>
          , a statistical framework that quantifies the probability of the
          variant to be causal both in GWAS and eQTL studies, while allowing the
          arbitrary number of causal variants.
        </p>
      </div>
      <div className="mt-5">
        <p>
          <b>Comparison between ezQTL and other tools</b>
        </p>
        <p>
          The table below summarizes the major features of ezQTL and comparisons
          to other tools at the time of the development. We are planning to
          include more features or modules in ezQTL in the future.
        </p>
        <img className="w-100" src="assets/images/ezQTL_comparison.svg" />
      </div>
      <div className="mt-5">
        <p>
          <b>Frequently Asked Questions</b>
        </p>
        <p>
          <i>
            What is a colocalization analysis, and are there any other
            approaches to perform colocalization analysis than what is provided
            by ezQTL?
          </i>
        </p>
        <p>
          Colocalization is a statistical method examining if the same "causal”
          variant is underlying both eQTL and GWAS signals, as opposed to some
          SNPs showing significant P-values in both assays by chance. Two major
          challenges for performing colocalization analysis between GWAS and
          eQTL are the linkage disequilibrium and multiple causal variants for
          some loci. There have been extensive efforts in developing and
          applying different colocalization approaches. Currently, ezQTL only
          includes two widely used algorithms eCAVIAR and HyPrColoc based on
          their performance. We may include more colocalization algorithms in
          the future.
        </p>
        <p>
          <i>
            What is the LD Matrix data? Should I calculate LD matrix data from
            my own GWAS or QTL samples?
          </i>
        </p>
        <p>
          Linkage Disequilibrium (LD) refers to the non-random association of
          alleles at two or more loci in the general population. For the
          colocalization analysis between GWAS and QTL, the LD produces an
          inherent ambiguity in interpreting the results. Most colocalization
          algorithms (including eCAVIAR and HyPrColoc) require LD matrix data
          for integrating GWAS and eQTL, ideally from the same population or a
          reference population of matching genetic ancestry. For ezQTL, the LD
          matrix data can be pre-calculated from a large-scale public study with
          known population ancestry (i.e. we provide LD matrices from 1000
          genomes and UK BioBank reference sets) or calculated from the user
          study (typically GWAS data). If the samples used in QTL and GWAS
          studies are from the same ancestry but of different ancestry from the
          provided public LD datasets, we recommend to calculate the LD Mattix
          from the user study (individual-level genotype data from > 500
          individuals are recommended to be used). Users can visualize the
          difference of LD Matrices between user’s study and public study by
          using the Locus LD module.
        </p>
        <p>
          <i>What is the genome build version for the public data source?</i>
        </p>
        <p>
          For the LD matrices in public data source, the 1000 genomes support
          both GRCh37 and GRCh38 for all the populations. The UK BioBank only
          supports the GRCh37 for now. For QTL in public data source, both GTEx
          sQTL and eQTL support both GRCh37 and GRh38. The rest of the QTL data
          mostly support GRCh38. For the GWAS, almost all the GWAS studies only
          support GRCh37. The genome build should be matched among QTL, GWAS and
          LD Matrix datasets. A liftover module will be developed in the future
          to support conversion of genome build versions between GRCh37 and
          GRCh38 for all datasets.
        </p>
      </div>
    </div>
  );
}
