import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import ReactSelect, { createFilter } from 'react-select';
import { updateAlert, updateQTLsGWAS } from '../../../../services/actions';
import { PopulationSelect } from '../../../controls/population-select/population-select';

export function QTLsGWASResultsForm() {
  const dispatch = useDispatch();

  const {
    submitted,
    isLoading,
    all_gene_variants,
    locus_alignment,
    inputs,
    select_ref,
    gene_list,
    select_gene,
    select_pop
  } = useSelector((state) => state.qtlsGWAS);

  const [_selectGene, _setSelectGene] = useState([]);
  const [_selectRef, _setSelectRef] = useState('');

  useEffect(() => {
    if (!select_gene) {
      const option = locus_alignment['top']['gene_symbol'] && gene_list['data'] ? gene_list['data'].filter((item) => item.gene_symbol === locus_alignment['top']['gene_symbol']) : [];
      _setSelectGene(option);
      if (option.length > 0) {
        dispatch(updateQTLsGWAS({ select_gene: option }));
      }
    }
  }, [locus_alignment, gene_list]);
  useEffect(() => _setSelectGene(select_gene), [select_gene]);
  useEffect(() => _setSelectRef(select_ref), [select_ref]);

  const validateForm = () => {
    dispatch(updateQTLsGWAS({ isLoading: true }));
    const matchSNP = all_gene_variants['data'].filter((item) => item.rsnum === _selectRef);
    if (_selectRef.length === 0 || (_selectRef.length > 0 && matchSNP.length > 0)) {
      dispatch(updateAlert({
        show: false,
        message: ``
      }));
      return true;
    } else {
      dispatch(updateAlert({
        show: true,
        message: `${_selectRef} not found in the association data file for the chosen reference gene. Please enter another variant.`,
        variant: 'warning'
      }));
      dispatch(updateQTLsGWAS({ isLoading: false }));
      return false;
    }
  }

  async function handleSubmit() {
    console.log("yay!");
    dispatch(updateQTLsGWAS({ isLoading: false }));
  }

  return (
    <>
      {/* <LoadingOverlay active={isLoading} /> */}
      <Form className="row justify-content-between">
        <div className="col-md-9">
          <Form.Group className="row">
            <div className="col-md-4">
              <Form.Label className="mb-0">
                Population <span style={{ display: submitted && !isLoading ? 'inline' : 'none', color: 'red' }}>*</span>
              </Form.Label>
              <PopulationSelect
                id="qtls-results-population-input"
                disabled={!submitted}
              />
            </div>
            <div className="col-md-4">
              <Form.Label className="mb-0">
                Reference Gene <span style={{ display: submitted && !isLoading ? 'inline' : 'none', color: 'red' }}>*</span>
              </Form.Label>
              <ReactSelect
                isDisabled={!submitted}
                inputId="qtls-results-gene-input"
                // label=""
                value={_selectGene}
                options={gene_list ? gene_list.data : []}
                getOptionLabel={option => option.gene_symbol}
                getOptionValue={option => option.gene_id}
                onChange={(option) => dispatch(updateQTLsGWAS({ select_gene: option }))}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPortalTarget={document.body}
                filterOption={createFilter({ ignoreAccents: false })}
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
                isInvalid={
                  _selectRef &&
                  _selectRef.length > 0 &&
                  !/^rs\d+$/.test(_selectRef)
                }
                // custom
              />
              <Form.Control.Feedback type="invalid">
                Enter valid RS number. 
                <br />
                Leave empty for default.
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </div>
        <div className="col-md-auto">
          <Form.Label className="mb-0"></Form.Label>
          <Button
            disabled={!submitted || 
              (!select_pop || select_pop.length <= 0) || 
              (_selectRef &&
                _selectRef.length > 0 &&
                !/^rs\d+$/.test(_selectRef))
            }
            className="d-block"
            variant="primary"
            type="button"
            onClick={() => {
                if (validateForm()) handleSubmit();
            }}
          >
            Recalculate
          </Button>
        </div>
      </Form>
    </>
  );
}
