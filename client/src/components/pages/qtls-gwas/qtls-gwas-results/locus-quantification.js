import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import { Form, Button } from 'react-bootstrap';
import ReactSelect, { createFilter } from 'react-select';
import Zoom from '../../../controls/zoom/zoom';
import {
  updateQTLsGWAS,
  qtlsGWASCalculateQuantification,
} from '../../../../services/actions';

export function LocusQuantifiation() {
  const {
    quantificationFile,
    genotypeFile,
    traitID,
    genotypeID,
    log2,
    submitted,
    request,
    isLoadingQuantification,
  } = useSelector((state) => state.qtlsGWAS);

  const [_log2, setLog2] = useState({ value: false, label: 'False' });

  useEffect(() => {
    if (log2) setLog2({ value: true, label: 'True' });
    else setLog2({ value: false, label: 'False' });
  }, []);

  const dispatch = useDispatch();

  async function handleRecalculate() {
    dispatch(updateQTLsGWAS({ log2: _log2.value }));

    dispatch(
      qtlsGWASCalculateQuantification({
        request: request,
        exprFile: quantificationFile,
        genoFile: genotypeFile,
        traitID: traitID,
        genotypeID: genotypeID,
        log2: _log2.value,
      })
    );
  }

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      {request && genotypeFile && quantificationFile && (
        <div>
          <LoadingOverlay active={isLoadingQuantification} />
          <Zoom
            plotURL={`api/results/${request}/quantification_cor.svg`}
            plotId="1"
            className="border rounded p-3 mb-2"
            maxHeight="800px"
            descAbove={
              <p>
                The following asymmetric heatmap shows the pairwise correlation
                among all the traits based on the quantification values. Both
                Pearson and Spearman correlation coefficients were calculated as
                upper and lower triangles in the heatmap, respectively.
              </p>
            }
          />
          <br />
          <Zoom
            plotURL={`api/results/${request}/quantification_dis.svg`}
            plotId="2"
            className="border rounded p-3 mb-2"
            maxHeight="800px"
            descAbove={
              <p>
                The ridgeline density plot below indicates the distribution of
                quantification for all of the traits and is sorted by the median
                quantification value.
              </p>
            }
          />
          <br />
          <p>
            A typical QTL boxplot is shown below with statistical tests in the
            subtitles. This plot is created by the ggbetweenstats function from
            ggstatsplot package. Check the original ggstatsplot for the details
            of the statistical tests. You could use the residuals as the
            quantification value after regressing on the covariables if your
            original QTL study has any covariables.
          </p>
          <p>
            Choose trait ID (e.g. ENSG00000183486.8) and Genotype ID (e.g.
            21:42743496:C:T) for boxplot of the specific QTL association.
          </p>
          <Form className="row justify-content-between">
            <>
              <div className="col-md-9">
                <Form.Group className="row">
                  <Form.Group className="col-md-4">
                    <Form.Label
                      id="quantification-trait"
                      className="mb-0 mr-auto"
                    >
                      Trait ID
                    </Form.Label>
                    <Form.Control
                      type="text"
                      aria-labelledby="quantification-trait"
                      id="qtls-quantification-trait"
                      placeholder="None"
                      disabled={!submitted}
                      value={traitID}
                      onChange={(e) => {
                        dispatch(updateQTLsGWAS({ traitID: e.target.value }));
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="col-md-4">
                    <Form.Label
                      id="quantification-genotype"
                      className="mb-0 mr-auto"
                    >
                      Genotype ID
                    </Form.Label>
                    <Form.Control
                      type="text"
                      aria-labelledby="quantification-genotype"
                      id="qtls-quantification-genotype"
                      placeholder="None"
                      disabled={!submitted}
                      value={genotypeID}
                      onChange={(e) => {
                        dispatch(
                          updateQTLsGWAS({ genotypeID: e.target.value })
                        );
                      }}
                    />
                  </Form.Group>

                  <div className="col-md-4">
                    <Form.Label id="quantification-log" className="mb-0">
                      log<sub>2</sub>
                    </Form.Label>
                    <ReactSelect
                      isDisabled={!submitted}
                      aria-labelledby="quantification-log"
                      inputId="qtls-results-quantification-log2"
                      value={_log2}
                      onChange={(option) => {
                        setLog2(option);
                      }}
                      options={[
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                      ]}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      filterOption={createFilter({ ignoreAccents: false })}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-auto mt-4">
                <Button
                  disabled={!submitted}
                  className="d-block"
                  variant="primary"
                  type="button"
                  onClick={() => handleRecalculate()}
                >
                  Recalculate
                </Button>
              </div>
            </>
          </Form>
          <Zoom
            plotURL={`api/results/${request}/quantification_qtl.svg`}
            plotId="3"
            className="border rounded p-3 mb-2"
            maxHeight="800px"
          />
        </div>
      )}
    </div>
  );
}
