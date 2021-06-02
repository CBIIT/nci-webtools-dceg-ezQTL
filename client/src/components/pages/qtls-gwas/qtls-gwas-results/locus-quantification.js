import React from 'react';
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
    select_qtls_samples,
    quantificationFile,
    genotypeFile,
    traitID,
    genotypeID,
    log2,
    submitted,
    request,
    isLoadingQuantification
  } = useSelector((state) => state.qtlsGWAS);

  const dispatch = useDispatch();

  async function handleRecalculate() {

    dispatch(qtlsGWASCalculateQuantification({
      request: request,
      select_qtls_samples: select_qtls_samples,
      exprFile: quantificationFile,
      genoFile: genotypeFile,
      traitID: traitID,
      genotypeID: genotypeID,
      log2: log2.value
    }));
  }

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      <LoadingOverlay active={isLoadingQuantification} />
      <Zoom
        plotURL={`api/results/${request}/quantification_cor.svg`}
        className="border rounded p-3 mb-2"
        maxHeight="800px"
      />
      <Zoom
        plotURL={`api/results/${request}/quantification_dis.svg`}
        className="border rounded p-3 mb-2"
        maxHeight="800px"
      />

      <Form className="row justify-content-between">
        <>
          <div className="col-md-9">
            <Form.Group className="row">
              <Form.Group className="col-md-4">
                <Form.Label className="mb-0 mr-auto">
                  Trait ID
                  </Form.Label>
                <Form.Control
                  type="text"
                  id="qtls-quantification-trait"
                  placeholder='None'
                  disabled={!submitted}
                  value={traitID}
                  onChange={(e) => {
                    dispatch(updateQTLsGWAS({ traitID: e.target.value }));
                  }}
                />
              </Form.Group>

              <Form.Group className="col-md-4">
                <Form.Label className="mb-0 mr-auto">
                  Genotype ID
                  </Form.Label>
                <Form.Control
                  type="text"
                  id="qtls-quantification-genotype"
                  placeholder='None'
                  disabled={!submitted}
                  value={genotypeID}
                  onChange={(e) => {
                    dispatch(updateQTLsGWAS({ genotypeID: e.target.value }));
                  }}
                />
              </Form.Group>


              <div className="col-md-4">
                <Form.Label className="mb-0">log<sub>2</sub></Form.Label>
                <ReactSelect
                  isDisabled={!submitted}
                  inputId="qtls-results-quantification-log2"
                  value={log2}
                  onChange={(option) => {
                    dispatch(updateQTLsGWAS({ log2: option }))
                  }}
                  options={
                    [
                      { value: true, label: 'True' },
                      { value: false, label: 'False' }
                    ]
                  }
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                  filterOption={createFilter({ ignoreAccents: false })}
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
        </>

      </Form>

      <Zoom
        plotURL={`api/results/${request}/quantification_qtl.svg`}
        className="border rounded p-3 mb-2"
        maxHeight="800px"
      />
    </div>
  );
}
