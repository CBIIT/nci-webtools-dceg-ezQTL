import React from 'react';

export function Home() {
  return (
    <div className="px-2">
      <div id="home-logo" className="text-center">
        <img height="150" src="assets/images/ezqtl-logo.png" alt="ezQTL Logo" />
      </div>
      <div className="mt-4">
        <p>
          <b>V</b>isualization of <b>Q</b>uantitative <b>T</b>rait <b>L</b>oci (
          <b>vQTL</b>) is a web-based tool for integrative QTL visualization and
          colocalization with GWAS data for individual loci to aid GWAS
          annotation.
        </p>
      </div>
      <div className="mt-3">
        <p>Integrative GWAS-QTL features:</p>
      </div>
      <div className="mt-3">
        <div className="row mx-5 justify-content-center">
          <div className="col-md-3">
            <p>Locus Alignment:</p>
          </div>
          <div className="col-md-8">
            <p>
              Simultaneously and interactively visualize association <i>P</i>
              -values and linkage disequilibrium patterns for GWAS and QTL
              datasets using two LocusZoom plots for a given gene in a locus of
              interest. A <i>P</i>-value correlation plot between these two
              LocusZoom plots is generated to visualize colocalization.
            </p>
          </div>
          <div className="mt-3 w-100"></div>
          <div className="col-md-3">
            <p>Locus Colocalization:</p>
          </div>
          <div className="col-md-8">
            <p>
              Perform colocalization analysis between GWAS and QTLs results
              within a locus using two different methods (HyPrColoc, eCAVIAR).
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p>eQTL-Only features:</p>
      </div>
      <div className="mt-3">
        <div className="row mx-5 justify-content-center">
          <div className="col-md-3">
            <p>Locus Table:</p>
          </div>
          <div className="col-md-8">
            <p>
              Provides a sortable table of user-provided, GTEx, or NCI QTLs for
              any given gene (or other QTL features, e.g. methylation probe,
              etc.) in a region. QTL results are annotated with linkage
              disequilibrium to any given index SNP and links to multiple
              external databases (LDlink, GWAS Catalog, gnomAD).
            </p>
          </div>
          <div className="mt-3 w-100"></div>
          <div className="col-md-3">
            <p>Locus Quantification:</p>
          </div>
          <div className="col-md-8">
            <p>
              Visualize the quantification data used in the QTL testing in the
              locus of interest. The quantification data are also used to
              generate the boxplot for QTLs.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p>
          <b>Software Version / Date: </b>first release, vQTL 1.0 - 08/01/2019
          <br />
          Coming soon:
          <br />
          <br />
          Integration of GTEx eQTLs and spliceQTLs
          <br />
          <br />
          Integration of human primary melanocyte eQTLs (see Zhang <i>et al.</i>
          , 2018, <i>Genome Res</i>)
        </p>
      </div>
      <div className="mt-5">
        <p>
          <b>Citations:</b>
          <br />
          ezQTL, a web-based tool for integrative visualization of Quantitative
          Trait Loci for GWAS annotation. (<i>manuscript in preparation</i>)
        </p>
        <p>
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
          Information Technology. Support for this project comes from the
          Division of Cancer Epidemiology and Genetics Informatics Tool
          Challenge.
        </p>
        <p>
          Questions or comments? Contact us via{' '}
          <a href="mailto:http://tongwu.zhang@nih.gov">email</a>.
        </p>
      </div>
    </div>
  );
}
