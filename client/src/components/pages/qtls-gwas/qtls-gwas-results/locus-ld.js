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
    select_gwas_sample,
    select_qtls_samples,
    gwasFile,
    associationFile,
    inputs,
    LDFile,
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
  }
    = useSelector((state) => state.qtlsGWAS);

  async function handleRecalculate() {

    dispatch(qtlsGWASLocusLDCalculation({
      request: request,
      select_gwas_sample: select_gwas_sample,
      select_qtls_samples: select_qtls_samples,
      gwasFile: inputs['gwas_file'][0],
      associationFile: inputs['association_file'][0],
      LDFile: inputs['ld_file'][0],
      leadsnp: locus_alignment['top']['rsnum'],
      genome_build: genome['value'],
      ldThreshold: ldThreshold,
      ldAssocData: ldAssocData.value,
      select_gene: select_gene
    }));
  }
  const dispatch = useDispatch();

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
      {submitted && ldError && (
        <LoadingOverlay
          active={true}
          content={<b className="text-danger">{ldError}</b>}
        />
      )}
      <LoadingOverlay active={isLoadingLD} />
      {submitted && !ldError && !isLoading && !isLoadingLD && (
        <>
          <Form className="row justify-content-between" style={{minHeight: '100px'}}>
            <LoadingOverlay
              active={!gwasFile && !associationFile}
              content={<b>No QTL or GWAS data. Recalculation disabled.</b>}
            />

            {(gwasFile || associationFile) && <>
              <div className="col-md-9">
                <Form.Group className="row">
                  <Form.Group className="col-md-4">
                    <Form.Label className="mb-0 mr-auto">
                      LD Association Data
                  </Form.Label>
                    <ReactSelect
                      isDisabled={!submitted}
                      inputId="qtls-results-ld-association-data"
                      placeholder="None"
                      value={ldAssocData}
                      onChange={(option) => {
                        dispatch(updateQTLsGWAS({ ldAssocData: option }))
                        if (option.value === 'GWAS')
                          dispatch(updateQTLsGWAS({ select_gene: '' }))
                      }}
                      options={
                        [
                          { value: 'QTL', label: 'QTL' },
                          { value: 'GWAS', label: 'GWAS' }
                        ]
                      }
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      filterOption={createFilter({ ignoreAccents: false })}
                    />
                  </Form.Group>

                  <div className="col-md-4">
                    <Form.Label className="mb-0">
                      Trait for QTL{' '}
                      {ldAssocData.value === 'QTL' && <span
                        style={{
                          display: submitted && !isLoading ? 'inline' : 'none',
                          color: 'red',
                        }}
                      >
                        *
                </span>}
                    </Form.Label>
                    <ReactSelect
                      isDisabled={!submitted || ldAssocData.value !== 'QTL'}
                      inputId="qtls-results-gene-input"
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
                    <Form.Label className="mb-0">-log<sub>10</sub> Association Threshold</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      min="0"
                      id="qtls-ld-threshold"
                      placeholder='None'
                      disabled={!submitted}
                      value={ldThreshold}
                      onChange={(e) => {
                        dispatch(updateQTLsGWAS({ ldThreshold: e.target.value }));
                      }}
                    // custom
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-auto">
                <Form.Label className="mb-0"></Form.Label>
                <Button
                  disabled={
                    !submitted
                  }
                  className="d-block"
                  variant="primary"
                  type="button"
                  onClick={() => handleRecalculate()}
                >
                  Recalculate
                </Button>
              </div>
            </>}
          </Form>
          <hr />
          <Zoom
            plotURL={`api/results/${request}/LD_Output.png`}
            className="border rounded p-3"
            maxHeight="100%"
          />
        </>
      )}
    </div>
  );
}
