import React, { useContext, useState } from 'react';
import { RootContext } from '../../../../index';
import { useDispatch, useSelector } from 'react-redux';
// import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import { LocusAlignmentPlot } from './locus-alignment-plot';
import { LocusAlignmentScatterPlot } from './locus-alignment-scatter-plot';
import { BoxplotsModal } from '../../../controls/boxplots-modal/boxplots-modal';
import {
  updateQTLsGWAS,
  drawLocusAlignmentScatter,
} from '../../../../services/actions';
import { Form } from 'react-bootstrap';

export function LocusAlignment() {
  const dispatch = useDispatch();
  const { getInitialState } = useContext(RootContext);

  const {
    submitted,
    isError,
    locus_alignment,
    locus_alignment_boxplots,
    locus_alignment_gwas_scatter,
    locus_alignment_gwas_scatter_threshold,
  } = useSelector((state) => state.qtlsGWAS);

  return (
    <div className="px-3 py-2" style={{ minHeight: '250px' }}>
      <BoxplotsModal
        isLoading={locus_alignment_boxplots.isLoading}
        show={locus_alignment_boxplots.visible}
        onHide={() =>
          dispatch(
            updateQTLsGWAS({
              locus_alignment_boxplots:
                getInitialState().qtlsGWAS.locus_alignment_boxplots,
            })
          )
        }
      />
      {/* {!submitted && (
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
      )} */}
      {submitted && !isError && locus_alignment.data && (
        <>
          <p>
            The two{' '}
            <a href="http://locuszoom.org/" target="_blank" rel="noreferrer">
              LocusZoom
            </a>{' '}
            plots below show the association P-values for QTLs (top panel), and
            GWAS (bottom panel). If no GWAS data is uploaded, a single LocusZoom
            plot will be shown for QTLs only, and vice versa.
          </p>
          <p>
            In the top panel, the LD reference SNP can be customized. By
            default, the LD information (r<sup>2</sup>) will be calculated based
            on the 1000 Genomes Dataset (phase 3, version 5), but can be
            replaced by selecting the UKBB dataset or a user’s own uploaded LD
            matrix. Use the blue arrowhead in the top left corner to display or
            hide the file uploading menu on the left.
          </p>
          <p>
            The pink diamond in the top LocusZoom plot shows the best (most
            significant) QTL variant for the selected "Reference Gene”. The red
            circle indicates the current LD reference variant, which will be
            simultaneously updated in both GWAS and QTLs LocusZoom plots when a
            different LD reference variant is selected. The circle and pink
            diamond displayed in the QTL plot overlap in the initial result
            output.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <LocusAlignmentPlot />
          </div>

          <div className="text-center footnote">
            <p>
              <small>
                <i>
                  Click on the SNP to show additional information and actions.
                  please note, this figure will not be included in the download
                  folder. you can click "Download plot" button on the top-right
                  corner of this plot and then change the downloaded file type
                  from ".txt" to ".svg".
                </i>
              </small>
            </p>
          </div>
          {locus_alignment_gwas_scatter &&
            locus_alignment_gwas_scatter.data &&
            locus_alignment_gwas_scatter.data.length > 0 && (
              <>
                <div className="w-100 mt-1 mb-2 border"></div>

                <div className="mt-3">
                  <p>
                    The following scatter plot shows the correlation between
                    -log10(GWAS <i>P</i>-value) and -log10(QTLs <i>P</i>-value).
                    The "<i>P</i>-value threshold” can be used to filter QTL and
                    GWAS variants based on their <i>P</i>-values before
                    visualizing the <i>P</i>-value correlation. For detailed
                    colocalization analyses, please check the "Locus
                    Colocalization” sub-module.
                  </p>

                  <Form className="row justify-content-center">
                    <div className="col-md-3">
                      <Form.Label className="mb-0">
                        -log<sub>10</sub> <i>P</i>-value Threshold
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0.0"
                        // max="1.0"
                        id="locus-alignment-scatter-threshold-input"
                        disabled={!submitted}
                        value={locus_alignment_gwas_scatter_threshold}
                        onChange={(e) => {
                          const threshold = isNaN(parseFloat(e.target.value))
                            ? 0.0
                            : parseFloat(e.target.value);
                          // if (e.target.value && parseFloat(e.target.value) && parseFloat(e.target.value) >= 0) {
                          dispatch(
                            updateQTLsGWAS({
                              locus_alignment_gwas_scatter_threshold: threshold,
                            })
                          );
                          // console.log('threshold', threshold, '');
                          if (threshold >= 0.0) {
                            // console.log(
                            //   'REDRAW SCATTER?',
                            //   locus_alignment_gwas_scatter['raw'],
                            //   null,
                            //   locus_alignment['top']['gene_symbol'],
                            //   threshold
                            // );
                            dispatch(
                              drawLocusAlignmentScatter(
                                locus_alignment_gwas_scatter['raw'],
                                null,
                                locus_alignment['top']['gene_symbol'],
                                Math.pow(10, threshold * -1.0)
                              )
                            );
                          }
                          // }
                        }}
                        isInvalid={locus_alignment_gwas_scatter_threshold < 0.0}
                        // custom
                      />
                      <Form.Control.Feedback type="invalid">
                        Enter threshold {`>=`} 0.0
                      </Form.Control.Feedback>
                    </div>
                  </Form>

                  <div style={{ overflowX: 'auto' }}>
                    <LocusAlignmentScatterPlot />
                  </div>
                </div>
              </>
            )}
        </>
      )}
    </div>
  );
}
