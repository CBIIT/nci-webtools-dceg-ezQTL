import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import ReactSelect, { createFilter } from 'react-select';
import {
  updateAlert,
  updateQTLsGWAS,
  qtlsGWASCalculation,
} from '../../../../services/actions';
import { PopulationSelect } from '../../../controls/population-select/population-select';

export function QTLsGWASResultsForm(props) {
  const dispatch = useDispatch();

  const {
    submitted,
    isLoading,
    all_gene_variants,
    locus_alignment,
    inputs,
    gene_list,
    select_gene,
    select_pop,
    request,
    ldProject,
    phenotype,
    qtlPublic,
    ldPublic,
    gwasPublic,
    qtlKey,
    ldKey,
    gwasKey,
    genome,
    locusInformation,
  } = useSelector((state) => state.qtlsGWAS);

  const { select_ref, select_position, select_chromosome } =
    locusInformation[0];

  const [_selectRef, _setSelectRef] = useState('');

  // set inital select_gene and select_ref
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

    if (select_ref) _setSelectRef(select_ref);
    else _setSelectRef(locus_alignment['top']['rsnum']);
  }, [locus_alignment, gene_list]);

  const validateForm = () => {
    dispatch(updateQTLsGWAS({ isLoading: true }));
    const matchSNP = all_gene_variants['data'].filter(
      (item) => item.rsnum === _selectRef
    );
    if (
      !_selectRef ||
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
      recalculate: true,
      recalculateAttempt: false,
      recalculatePop: false,
      recalculateGene: false,
      recalculateDist: false,
      recalculateRef: false,
      ldProject,
      phenotype,
      qtlPublic,
      gwasPublic,
      ldPublic,
      qtlKey: qtlKey,
      ldKey: ldKey,
      gwasKey: gwasKey,
      select_chromosome:
        qtlPublic || ldPublic || gwasPublic ? select_chromosome.value : false,
      select_position:
        qtlPublic || ldPublic || gwasPublic ? select_position : false,
      genome_build: genome.value,
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
              <Form.Label
                id={'recalculate-reference-' + props.tab}
                className="mb-0"
              >
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
                inputId={'qtls-results-gene-input-' + props.tab}
                // label=""
                value={select_gene}
                aria-labelledby={'recalculate-reference-' + props.tab}
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
              <Form.Label id={'recalculate-snp-' + props.tab} className="mb-0">
                LD Reference SNP
              </Form.Label>
              <Form.Control
                id={'qtls-results-snp-input-' + props.tab}
                aria-labelledby={'recalculate-snp-' + props.tab}
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
        <div className="col-md-auto mt-4">
          <Button
            disabled={
              !submitted ||
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
