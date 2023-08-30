import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Zoom from '../../../controls/zoom/zoom';
import { Form, Button } from 'react-bootstrap';
import ReactSelect, { createFilter } from 'react-select';
import {
  updateQTLsGWAS,
  qtlsGWASLocusLDCalculation,
} from '../../../../services/actions';

export function LocusLD() {
  const {
    submitted,
    inputs,
    genome,
    locus_alignment,
    gene_list,
    select_gene,
    ldThreshold,
    ldAssocData,
    ldError,
    request,
    isLoading,
    isLoadingLD,
  } = useSelector((state) => state.qtlsGWAS);

  async function handleRecalculate() {
    dispatch(
      qtlsGWASLocusLDCalculation({
        request: request,
        gwasFile: inputs['gwas_file'][0],
        associationFile: inputs['association_file'][0],
        LDFile: inputs['ld_file'][0],
        leadsnp: locus_alignment['top']['rsnum'],
        genome_build: genome['value'],
        ldThreshold: ldThreshold,
        ldAssocData: ldAssocData.value,
        select_gene: select_gene,
      })
    );
  }
  const dispatch = useDispatch();

  return (
    <div style={{ minHeight: '500px' }}>
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
      <LoadingOverlay active={isLoadingLD} />
      {submitted && request && !isLoading && !isLoadingLD && (
        <>
          <div className="px-3 py-2">
            <Form className="row justify-content-between">
              <LoadingOverlay
                active={
                  !inputs ||
                  (inputs.association_file[0] == 'false' &&
                    inputs.gwas_file[0] == 'false')
                }
                content={<b>No QTL or GWAS data. Recalculation disabled.</b>}
              />
              <>
                <div className="col-md-9">
                  <Form.Group className="row">
                    <div className="col-md-4">
                      <Form.Label
                        id="ld-association-data"
                        className="mb-0 mr-auto"
                      >
                        LD Association Data
                      </Form.Label>
                      <ReactSelect
                        isDisabled={!submitted}
                        aria-labelledby="ld-association-data"
                        inputId="qtls-results-ld-association-data"
                        placeholder="None"
                        value={ldAssocData}
                        onChange={(option) => {
                          dispatch(updateQTLsGWAS({ ldAssocData: option }));
                          if (option.value === 'GWAS')
                            dispatch(updateQTLsGWAS({ select_gene: '' }));
                        }}
                        options={[
                          { value: 'QTL', label: 'QTL' },
                          { value: 'GWAS', label: 'GWAS' },
                        ]}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        filterOption={createFilter({ ignoreAccents: false })}
                      />
                    </div>
                    <div className="col-md-4">
                      <Form.Label className="mb-0">
                        Trait for QTL{' '}
                        {ldAssocData.value === 'QTL' && (
                          <span
                            style={{
                              display:
                                submitted && !isLoading ? 'inline' : 'none',
                              color: 'red',
                            }}
                          >
                            *
                          </span>
                        )}
                      </Form.Label>
                      <ReactSelect
                        isDisabled={!submitted || ldAssocData.value !== 'QTL'}
                        inputId="qtls-results-ld-gene-input"
                        // label=""
                        value={ldAssocData.value === 'QTL' ? select_gene : null}
                        placeholder="None"
                        options={gene_list ? gene_list.data : []}
                        getOptionLabel={(option) => option.gene_symbol}
                        getOptionValue={(option) => option.gene_id}
                        onChange={(option) =>
                          dispatch(updateQTLsGWAS({ select_gene: option }))
                        }
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        filterOption={createFilter({ ignoreAccents: false })}
                      />
                    </div>
                    <div className="col-md-4">
                      <Form.Label
                        id="ld-association-threshold"
                        className="mb-0"
                      >
                        -log<sub>10</sub> Association Threshold
                      </Form.Label>
                      <Form.Control
                        type="number"
                        aria-labelledby="ld-association-threshold"
                        step="any"
                        min="0"
                        id="qtls-ld-threshold"
                        placeholder="None"
                        disabled={!submitted}
                        value={ldThreshold}
                        onChange={(e) => {
                          dispatch(
                            updateQTLsGWAS({ ldThreshold: e.target.value })
                          );
                        }}
                        // custom
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
          </div>
          <hr />
          <div className="px-3 py-2">
            {ldError && <b className="text-center text-danger">{ldError}</b>}
            <p>
              Locus LD will integratively visualize association data with gene
              structures and linkage disequilibrium matrices from the user-input
              or public datasets including{' '}
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
              . Locus LD can work independently without any additional input
              dataset. The visualization function is adapted from the
              IntRegionaPlot function in the IntAssoPlot R package. A maximum 5
              Mbp locus is allowed for this LD visualization. The LD reference
              SNP and the LD reference populations are based on what is defined
              in the input file uploading menu. LD plot will be generated
              without any (QTL/GWAS) association data and can be downloaded.
            </p>
            <p>
              <u>LD Association data</u>: Select the association files for
              displaying the p-values. If no association file is provided, by
              default, it will only highlight the LD reference SNP.
            </p>
            <p>
              <u>Trait for QTL</u>: If a QTL is selected as the LD Association
              data, select the trait in the QTL association file for displaying
              the p-values.
            </p>
            <p>
              <u>Association threshold</u>: A threshold will be applied to
              -log10(P-value) in order to highlight the top significant variants
              in association data.
            </p>
          </div>
          <hr />
          <div className="px-3 py-2">
            <Zoom
              plotURL={`api/data/${request}/LD_Output.png`}
              className="border rounded p-3"
              maxHeight="100%"
            />
          </div>
        </>
      )}
    </div>
  );
}
