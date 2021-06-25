import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Zoom from '../../../controls/zoom/zoom';

export function LocusQC() {
  const {
    submitted,
    qcError,
    request,
    isLoading,
    locus_qc,
    gwasFile,
    gwasKey,
    isLoadingQC,
    isQueue,
  } = useSelector((state) => state.qtlsGWAS);

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      {!submitted && (
        <LoadingOverlay
          active={true}
          content={
            <>
              Select data in the left panel and click <b>Calculate</b> to see
              results here.
            </>
          }
        />
      )}
      {submitted && qcError && (
        <LoadingOverlay
          active={true}
          content={<b className="text-danger">{qcError}</b>}
        />
      )}
      {submitted &&
        isQueue &&
        !locus_qc &&
        !qcError &&
        !isLoading &&
        !isLoadingQC && (
          <LoadingOverlay
            active={true}
            content={<>Reset the left panel to continue.</>}
          />
        )}
      {submitted && locus_qc && !qcError && !isLoading && !isLoadingQC && (
        <>
          {locus_qc.length > 0 && (
            <div>
              <p>
                Locus QC will systematically check, format and visualize all
                input datasets including QTL data, GWAS data and LD data. A
                comprehensive QC report and up to three modes of visualization
                will be generated, which depends on different numbers of input
                datasets.
              </p>
              <p>
                The following ezQTL QC report includes the number of variants,
                variant allele match, ambiguous alleles, variants overlap
                summary, recommendation of the reference variants for
                colocalization, etc. This report will be slightly different
                depending on the number of input datasets. Additional warnings
                will be given if issues are detected for the variants
                overlapping across different datasets. The final set of
                overlapped SNPs will be used for the colocalization analyses.
              </p>
              <div className="border mb-2">
                <div className="p-2 mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                  {locus_qc[0]}
                </div>

                <div className="row">
                  {locus_qc.slice(1).map((text, i) => {
                    const splitText = text.split('\n');
                    const firstLine = splitText.splice(0, 1) + '\n';

                    return (
                      <div
                        className="col-md-4 px-4 mb-3"
                        key={i}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {splitText.length !== 0 ? (
                          <>
                            <b>{firstLine}</b>
                            {splitText.join('\n')}
                          </>
                        ) : (
                          <>{firstLine}</>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {request && (
            <Zoom
              plotURL={`api/results/${request}/${request}_QC_QTLminP.svg`}
              className="border rounded p-3 mb-2"
              maxHeight="800px"
              descAbove={
                <p>
                  The following barplot shows the summary of association P-value
                  of each trait in the QTL dataset. The QTL traits are sorted
                  according to the most significant P-value. The top significant
                  associated variants for each trait are highlighted and labeled
                  with the rs number. The color-coding of the variants was based
                  on P-value scale. Due to figure size limitation, only the top
                  50 traits are included in this figure.
                </p>
              }
            />
          )}

          {gwasFile || gwasKey ? (
            <Zoom
              plotURL={`api/results/${request}/${request}_QC_overlapping.svg`}
              className="border rounded p-3 mb-2"
              maxHeight="1000px"
              descAbove={
                <p>
                  The figure below depicts the variant overlap among QTL data,
                  GWAS data and LD matrix depending on the input datasets. The
                  green circle indicates overlapping variants among all the
                  input datasets, and the gray circle indicates the remaining
                  variants in each dataset. The LD reference variant (defined in
                  the input file uploading menu) is highlighted as a red
                  triangle in each plot. The LD matrix figure highlights the
                  R-squared to this LD reference. The size of the circle in the
                  QTL plot represents the number of traits (e.g. genes) for
                  which a variant association was tested in the QTL dataset.
                </p>
              }
            />
          ) : (
            <div className="border rounded p-3 mb-2">No GWAS data.</div>
          )}

          {gwasFile || gwasKey ? (
            <Zoom
              plotURL={`api/results/${request}/${request}_QC_zscore.svg`}
              className="border rounded p-3"
              maxHeight="800px"
              descAbove={
                <p>
                  The following figure shows the correlation of Z-scores between
                  QTL and GWAS data. For the matched alleles in both the QTL and
                  GWAS datasets, we expect to observe a strong positive or
                  negative correlation for a colocalized locus. Variants marked
                  by "X” are C/G or A/T variants that are difficult to match.
                  This could be useful information to check if two alleles are
                  an exact match for all overlapping variants in the QTL and
                  GWAS datasets. Please see the "snp_not_match.txt” file from
                  the Locus Download module for further troubleshooting. Alleles
                  are matched for the public datasets we provided. For the
                  user-provided datasets, we recommend using alternative alleles
                  as the direction of associations for the best results.
                </p>
              }
            />
          ) : (
            <div className="border rounded p-3 mb-2">No GWAS data.</div>
          )}
        </>
      )}
    </div>
  );
}
