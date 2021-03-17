import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';

export function QTLsGWASResultsForm() {
  const {
    submitted,
    isLoading,
    // all_gene_variants,
    locus_alignment,
    inputs,
    select_ref
  } = useSelector((state) => state.qtlsGWAS);

  const [_selectPop, _setSelectPop] = useState('');
  const [_selectGene, _setSelectGene] = useState('');
  const [_selectRef, _setSelectRef] = useState('');

  useEffect(() => _setSelectPop(inputs['select_pop'][0]), [inputs]);
  useEffect(() => _setSelectGene(locus_alignment.top['gene_symbol']), [locus_alignment]);
  useEffect(() => _setSelectRef(select_ref), [select_ref]);

  return (
    <>
      <LoadingOverlay active={isLoading} />
      <Form className="row py-1 px-2 justify-content-between">
        <div className="col-md-9">
          <Form.Group className="row">
            <div className="col-md-4">
              <Form.Label className="mb-0">Population</Form.Label>
              <Form.Control
                id="qtls-results-population-input"
                disabled={!submitted}
                value={_selectPop}
                onChange={(e) => {
                  _setSelectPop(e.target.value);
                }}
                // custom
              />
                {/* <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option> */}
              {/* </Form.Control> */}
            </div>
            <div className="col-md-4">
              <Form.Label className="mb-0">Reference Gene</Form.Label>
              <Form.Control
                id="qtls-results-gene-input"
                disabled={!submitted}
                value={_selectGene}
                onChange={(e) => {
                  _setSelectGene(e.target.value);
                }}
                // custom
              />
            </div>
            <div className="col-md-4">
              <Form.Label className="mb-0">LD Reference SNP</Form.Label>
              <Form.Control
                id="qtls-results-snp-input"
                disabled={!submitted}
                value={_selectRef ? _selectRef : ''}
                onChange={(e) => {
                  _setSelectRef(e.target.value);
                }}
                // custom
              />
            </div>
          </Form.Group>
        </div>
        <div className="col-md-auto">
          <Form.Label className="mb-0"></Form.Label>
          <Button
            disabled={!submitted}
            className="d-block"
            variant="primary"
            type="button"
            // onClick={() => {
            //     if (validateForm()) handleSubmit();
            // }}
          >
            Recalculate
          </Button>
        </div>
      </Form>
    </>
  );
}
