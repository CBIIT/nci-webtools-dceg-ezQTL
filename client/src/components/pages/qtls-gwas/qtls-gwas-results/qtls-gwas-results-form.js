import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import ReactSelect, { createFilter } from 'react-select';
import {
  updateAlert,
  updateQTLsGWAS,
  qtlsGWASCalculation,
} from '../../../../services/actions';
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
    select_pop,
    request,
    ldProject,
    qtlKey,
    ldKey,
    gwasKey,
    qtlPublic,
    ldPublic,
    gwasPublic,
    select_chromosome,
    select_position,
    email,
    select_qtls_samples,
    select_gwas_sample,
  } = useSelector((state) => state.qtlsGWAS);

  const [_selectRef, _setSelectRef] = useState('');

  // set inital select_gene
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

  useEffect(() => _setSelectRef(select_ref), [select_ref]);

  const validateForm = () => {
    dispatch(updateQTLsGWAS({ isLoading: true }));
    const matchSNP = all_gene_variants['data'].filter(
      (item) => item.rsnum === _selectRef
    );
    if (
      _selectRef.length === 0 ||
      (_selectRef.length > 0 && matchSNP.length > 0)
    ) {
      dispatch(
        updateAlert({
          show: false,
          message: ``,
        })
      );
      return true;
    } else {
      dispatch(
        updateAlert({
          show: true,
          message: `${_selectRef} not found in the association data file for the chosen reference gene. Please enter another variant.`,
          variant: 'warning',
        })
      );
      dispatch(updateQTLsGWAS({ isLoading: false }));
      return false;
    }
  };

  async function handleSubmit() {
    const params = {
      request,
      select_qtls_samples,
      select_gwas_sample,
      associationFile:
        inputs['association_file'][0] === 'false'
          ? false
          : inputs['association_file'][0],
      quantificationFile:
        inputs['quantification_file'][0] === 'false'
          ? false
          : inputs['quantification_file'][0],
      genotypeFile:
        inputs['genotype_file'][0] === 'false'
          ? false
          : inputs['genotype_file'][0],
      gwasFile:
        inputs['gwas_file'][0] === 'false' ? false : inputs['gwas_file'][0],
      LDFile: inputs['ld_file'][0] === 'false' ? false : inputs['ld_file'][0],
      select_pop: select_pop,
      select_gene: select_gene['gene_id'],
      select_dist: inputs['select_dist'][0],
      select_ref: _selectRef && _selectRef.length > 0 ? _selectRef : false,
      recalculateAttempt: true,
      recalculatePop: true,
      recalculateGene: true,
      recalculateDist: false,
      recalculateRef: true,
      ldProject: ldProject.value,
      qtlKey: qtlPublic ? qtlKey : false,
      ldKey: ldPublic ? ldKey : false,
      gwasKey: gwasPublic ? gwasKey : false,
      select_chromosome: select_chromosome.value,
      select_position,
      email,
    };

    // clear all locus colocalization results
    dispatch(
      updateQTLsGWAS({
        activeColocalizationTab: 'hyprcoloc',
        hyprcolocError: '',
        hyprcoloc_ld: null,
        hyprcoloc_table: {
          data: [],
          globalFilter: '',
        },
        hyprcolocSNPScore_table: {
          data: [],
          globalFilter: '',
        },
        isLoadingHyprcoloc: false,
        ecaviar_table: {
          data: [],
          globalFilter: '',
        },
        isLoadingECaviar: false,
      })
    );

    dispatch(qtlsGWASCalculation(params));
  }

  return (
    <>
      {/* <LoadingOverlay active={isLoading} /> */}
      <Form className="row justify-content-between">
        <div className="col-md-9">
          <Form.Group className="row">
            <div className="col-md-4">
              <Form.Label className="mb-0">
                Population{' '}
                <span
                  style={{
                    display: submitted && !isLoading ? 'inline' : 'none',
                    color: 'red',
                  }}
                >
                  *
                </span>
              </Form.Label>
              <PopulationSelect
                id="qtls-results-population-input"
                disabled={!submitted || ldProject == 'UKBB'}
                mergeState={(data) => dispatch(updateQTLsGWAS(data))}
              />
            </div>
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
            disabled={
              !submitted ||
              !select_pop ||
              select_pop.length <= 0 ||
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
