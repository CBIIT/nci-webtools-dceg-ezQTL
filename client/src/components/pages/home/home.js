import React from 'react';

export function Home() {
  return (
    <div className="p-3">
      <div id="home-logo" className="text-center">
        <img height="150" src="assets/images/ezqtl-logo.png" alt="ezQTL Logo" />
      </div>
      <div className="mt-4 text-center">
        <p>
          ezQTL is a web-based tool for integrative QTL (Quantitative Trait
          Loci) visualization and colocalization with GWAS data for individual
          loci to aid GWAS annotation.
        </p>
      </div>
      <div className="mt-3">
        <p>
          <b>Integrative GWAS-QTL features:</b>
        </p>
      </div>
      <div className="mt-3">
        <div className="row mx-5 justify-content-center">
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus QC:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Systematically check, format and visualize all input datasets
              including QTL data, GWAS data and LD data. A comprehensive QC
              report and three plots will be generated including the variant
              allele match, ambiguous alleles, variants overlap summary,
              recommendation of reference variants for colocalization,{' '}
              <i>etc.</i>
            </p>
          </div>
          <div className="mt-3 w-100"></div>
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus Alignment:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Simultaneously and interactively visualize association P-values
              and linkage disequilibrium (LD) patterns for GWAS and QTL datasets
              using two{' '}
              <a href="http://locuszoom.org/" target="_blank" rel="noreferrer">
                LocusZoom
              </a>
              -style plots for a given trait (e.g. gene expression) in a locus
              of interest. Actions applied to each variant on the LocusZoom plot
              include linking to different databases (e.g.{' '}
              <a
                href="https://ldlink.nci.nih.gov/"
                target="_blank"
                rel="noreferrer"
              >
                LDlink
              </a>
              ,{' '}
              <a
                href="https://www.ebi.ac.uk/gwas/"
                target="_blank"
                rel="noreferrer"
              >
                GWAS Catalog
              </a>
              ,{' '}
              <a
                href="https://gnomad.broadinstitute.org/"
                target="_blank"
                rel="noreferrer"
              >
                gnomAD
              </a>
              ), defining as a new LD reference variant and showing the
              molecular QTL boxplots for the genotype groups of that variant. A
              P-value correlation plot between these two LocusZoom plots is
              generated to visualize colocalization.
            </p>
          </div>
          <div className="mt-3 w-100"></div>
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus Colocalization:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Perform colocalization analysis between GWAS and QTL results
              within a locus using two different approaches (
              <a
                href="https://github.com/jrs95/hyprcoloc"
                target="_blank"
                rel="noreferrer"
              >
                HyPrColoc
              </a>
              ,{' '}
              <a
                href="http://zarlab.cs.ucla.edu/tag/ecaviar/"
                target="_blank"
                rel="noreferrer"
              >
                eCAVIAR
              </a>
              ). These results will be visualized and compared in order to
              highlight the potential colocalized variants at both variant and
              gene levels between two approaches.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p>
          <b>QTL-Only features:</b>
        </p>
      </div>
      <div className="mt-3">
        <div className="row mx-5 justify-content-center">
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus Table:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Provides a sortable table of user-provided dataset, or public
              dataset (e.g. GTEx QTLs) for any given trait (e.g. gene
              expression, methylation probe, etc.) in a region. QTL results are
              annotated with linkage disequilibrium to any given index SNP and
              linked to multiple external databases (LDlink, GWAS Catalog,
              gnomAD).
            </p>
          </div>
          <div className="mt-3 w-100"></div>
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus Quantification:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Visualization of the quantification data used in the QTL testing
              involving the locus of interest including the quantification
              distribution and correlation of each trait. The quantification
              data are also used to generate the boxplots for QTLs.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p>
          <b>Other features:</b>
        </p>
      </div>
      <div className="mt-3">
        <div className="row mx-5 justify-content-center">
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus LD:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Integratively visualize association data with gene structure and
              linkage disequilibrium matrices from the user-input or public
              datasets including{' '}
              <a
                href="https://www.internationalgenome.org/"
                target="_blank"
                rel="noreferrer"
              >
                1000 genomes
              </a>{' '}
              and{' '}
              <a
                href="https://www.ukbiobank.ac.uk/"
                target="_blank"
                rel="noreferrer"
              >
                UK biobank
              </a>
              . GWAS or QTL association P-values will be plotted with extensive
              LD information from a defined population. A threshold will be
              applied to highlight the top significant variants in association
              data.
            </p>
          </div>
          <div className="mt-3 w-100"></div>
          <div className="col-sm-4 col-lg-2">
            <p>
              <u>
                <i>Locus Download:</i>
              </u>
            </p>
          </div>
          <div className="col-sm-8 col-lg-10">
            <p>
              Provides the link to download the compressed folder which includes
              all datasets after QC, colocalization results, an ezQTL log file,
              and all of the high resolution figures in svg format for future
              publication.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p>
          <b>Citations:</b>
          <br />
          ezQTL, a web-based tool for integrative visualization of Quantitative
          Trait Loci for GWAS annotation. (<i>manuscript in preparation</i>)
        </p>
      </div>
      <div className="mt-5">
        <p>
          <b>Credits:</b>
          <br />
          ezQTL was developed by Dr.{' '}
          <a
            href="https://dceg.cancer.gov/about/staff-directory/zhang-tongwu"
            target="_blank"
            rel="noreferrer"
          >
            Tongwu Zhang
          </a>{' '}
          and Dr.{' '}
          <a
            href="https://dceg.cancer.gov/about/staff-directory/choi-jiyeon"
            target="_blank"
            rel="noreferrer"
          >
            Jiyeon Choi
          </a>{' '}
          in the lab of Dr.{' '}
          <a
            href="https://dceg.cancer.gov/about/staff-directory/biographies/K-N/brown-kevin"
            target="_blank"
            rel="noreferrer"
          >
            Kevin Brown
          </a>
          , in collaboration with the NCI Center for Biomedical Informatics and
          Information Technology (CBIIT). Support for this project comes from
          the Division of Cancer Epidemiology and Genetics Informatics Tool
          Challenge as well as the{' '}
          <a
            href="https://dceg.cancer.gov/about/organization/tdrp/ltg"
            target="_blank"
            rel="noreferrer"
          >
            Laboratory of Translational Genomics
          </a>
          .
        </p>
        <p>
          ezQTL’s{' '}
          <a
            href="https://github.com/CBIIT/nci-webtools-dceg-ezQTL"
            target="_blank"
            rel="noreferrer"
          >
            source code
          </a>{' '}
          is available under the{' '}
          <a
            href="https://ldlink.nci.nih.gov/license.txt"
            target="_blank"
            rel="noreferrer"
          >
            MIT license
          </a>
          , an{' '}
          <a href="https://opensource.org/" target="_blank" rel="noreferrer">
            Open Source Initiative
          </a>{' '}
          approved license.
        </p>
        <p>
          Questions or comments? Contact{' '}
          <a href="mailto:NCIezQTLWebAdmin@mail.nih.gov">support</a>.
        </p>
      </div>
    </div>
  );
}
