import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Zoom from '../../../controls/zoom/zoom';
import { Form, Button } from 'react-bootstrap';
import ReactSelect, { createFilter } from 'react-select';
import {
  updateQTLsGWAS,
  qtlsGWASLocusQCCalculation,
} from '../../../../services/actions';


export function LocusLD() {
  const {
    submitted,
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

  useEffect(() => {
    if (!select_gene) {
      const option =
        locus_alignment['top']['gene_symbol'] && gene_list['data']
          ? gene_list['data'].filter(
            (item) =>
              item.gene_symbol === locus_alignment['top']['gene_symbol']
          )
          : [];

      if (option.length > 0) {
        dispatch(updateQTLsGWAS({ select_gene: option[0] }));
      }
    }
  }, [locus_alignment, gene_list]);

  const dispatch = useDispatch();
  const [tissueOnly, viewTissueOnly] = useState(false);
  const [attempt, setAttempt] = useState(false);

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
          <Form className="row justify-content-between">

            <div className="col-md-9">
              <Form.Group className="row">
                <Form.Group className="col-md-4">
                  <Form.Label className="mb-0 mr-auto">
                    LD Association Data
                  </Form.Label>
                  <ReactSelect
                    isDisabled={!submitted}
                    inputId="qtls-results-ld-association-data"
                    value={ldAssocData}
                    onChange={(option) =>
                      dispatch(updateQTLsGWAS({ ldAssocData: option }))
                    }
                    options={
                      [
                        {value: 'QTL', label: 'QTL'},
                        {value: 'GWAS', label: 'GWAS'}
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
                    Reference Gene{' '}
                    <span
                      style={{
                        display: submitted && !isLoading ? 'inline' : 'none',
                        color: 'red',
                      }}
                    >
                      *
                </span>
                  </Form.Label>
                  <ReactSelect
                    isDisabled={!submitted}
                    inputId="qtls-results-gene-input"
                    // label=""
                    value={select_gene}
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
                  <Form.Label className="mb-0">Association Threshold</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    min="0"
                    max="1"
                    id="qtls-ld-threshold"
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
              >
                Recalculate
            </Button>
            </div>
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
