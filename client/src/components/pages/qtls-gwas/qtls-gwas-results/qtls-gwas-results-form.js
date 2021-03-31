import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
// import Select from '../../../controls/select/select';
import ReactSelect, { createFilter } from 'react-select';
import { updateAlert, updateQTLsGWAS } from '../../../../services/actions';
// import { Multiselect } from 'multiselect-react-dropdown';

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
    select_gene
  } = useSelector((state) => state.qtlsGWAS);

  const [_selectPop, _setSelectPop] = useState([]);
  const [_selectGene, _setSelectGene] = useState([]);
  const [_selectRef, _setSelectRef] = useState('');

  useEffect(() => _setSelectPop(inputs ? inputs['select_pop'][0] : []), [inputs]);
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
    if (matchSNP.length > 0) {
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
  }

  return (
    <>
      <LoadingOverlay active={isLoading} />
      <Form className="row py-1 px-2 justify-content-between">
        <div className="col-md-9">
          <Form.Group className="row">
            <div className="col-md-4">
              <Form.Label className="mb-0">
                Population <span style={{ display: submitted && !isLoading ? 'inline' : 'none', color: 'red' }}>*</span>
              </Form.Label>
              {/* <Form.Control
                id="qtls-results-population-input"
                disabled={!submitted}
                value={_selectPop}
                onChange={(e) => {
                  _setSelectPop(e.target.value);
                }}
                // custom
              /> */}
              {/* <Multiselect
                options={[{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]} // Options to display in the dropdown
                // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                // onSelect={this.onSelect} // Function will trigger on select event
                // onRemove={this.onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
                showCheckbox
              /> */}
                {/* <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option> */}
              {/* </Form.Control> */}
            </div>
            <div className="col-md-4">
              <Form.Label className="mb-0">
                Reference Gene <span style={{ display: submitted && !isLoading ? 'inline' : 'none', color: 'red' }}>*</span>
              </Form.Label>
              {/* <Form.Control
                id="qtls-results-gene-input"
                disabled={!submitted}
                value={_selectGene}
                onChange={(e) => {
                  _setSelectGene(e.target.value);
                }}
                // custom
              /> */}
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
              (_selectPop.length <= 0) || 
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
