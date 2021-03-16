import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import { LocusAlignmentPlot } from './locus-alignment-plot';

export function LocusAlignment() {
  const {
    submitted,
    isError,
    locus_alignment
  } = useSelector((state) => state.qtlsGWAS);

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      {!submitted && (
        <LoadingOverlay
          active={true}
          content={
            <>Select data in the left panel and click <b>Calculate</b> to see results here.</>
          }
        />
      )}
      {submitted && isError && (
        <LoadingOverlay
          active={true}
          content={
            <b className="text-danger">Please check input files. Reset form to try again.</b>
          }
        />
      )}
      {submitted && !isError && locus_alignment.data && (
        <>
          <p>
            Two{' '}
            <a href="http://locuszoom.org/" target="_blank" rel="noreferrer">
              LocusZoom
            </a>{' '}
            plots below show the association <i>P</i>-values for QTLs (top
            panel), and GWAS (bottom panel). If no GWAS data is uploaded, a
            single LocusZoom plot will be shown for QTLs only.
            <br />
            <br />
            On the panel above, 1000 Genomes populations and LD reference SNP
            can be customized; by default, the LD information (r<sup>2</sup>)
            will be calculated based on the 1000 Genomes Dataset (phase 3,
            version 5) but can be replaced by the user uploading their own LD
            matrix. Use the blue arrowhead on the top left corner to show or
            hide file uploading menu on the left.
          </p>
          <p>
            The pink diamond in the LocusZoom plot shows the best (most
            significant) QTL variant for the selected “Reference Gene”. Red
            circle indicates the current LD reference variant, which will be
            simultaneously updated in both GWAS and QTLs LocusZoom plots.
          </p>
              
          <div style={{overflowX: 'auto'}}>
            <LocusAlignmentPlot />
          </div>

          <div className="text-center footnote">
            <p>
              <small>
                Click on the SNP to show additional information and actions
              </small>
            </p>
          </div>

          <div className="w-100 mt-1 mb-2 border"></div>

          {/* scatter && */}
          <div className="mt-3">
            <p>
              The following scatter plot shows the correlation between
              -log10(GWAS <i>P</i>-value) and -log10(QTLs <i>P</i>-value). The “
              <i>P</i>-value threshold” can be used to filter QTL and GWAS
              variants based on their <i>P</i>-values before visualizing the{' '}
              <i>P</i>-value correlation. For detailed colocalization analyses,
              please check the “Locus Colocalization” sub-module.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
