import React, { useState, useMemo, useEffect } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateQTLsGWAS,
  qtlsGWASECaviarCalculation,
} from '../../../../services/actions';
import Table from '../../../controls/table/table';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Plot from '../../../controls/plot/plot';

export function LocusColocalization() {
  const dispatch = useDispatch();

  const {
    activeColocalizationTab,
    hyprcolocError,
    hyprcoloc_table,
    hyprcolocSNPScore_table,
    isLoadingHyprcoloc,
    ecaviar_table,
    isLoadingECaviar,
    isError,
    request,
    inputs,
    select_gwas_sample,
    select_qtls_samples,
    locus_alignment,
  } = useSelector((state) => state.qtlsGWAS);

  const radios = [
    { name: 'HyPrColoc', value: 'hyprcoloc' },
    { name: 'eCAVIAR', value: 'ecaviar' },
  ];

  // useEffect(() => {
  //   // console.log(activeColocalizationTab);
  //   // lazy-load ecaviar calculation
  //   if (activeColocalizationTab === 'ecaviar') {

  //   }
  // }, [activeColocalizationTab]);

  const hyprcolocColumns = [
    {
      Header: 'Iterations',
      accessor: 'iteration',
      id: 'iteration',
    },
    {
      Header: 'Traits',
      accessor: 'traits',
      id: 'traits',
    },
    {
      Header: 'Posterior Probability',
      accessor: 'posterior_prob',
      id: 'posterior_prob',
    },
    {
      Header: 'Regional Probability',
      accessor: 'regional_prob',
      id: 'regional_prob',
    },
    {
      Header: 'Candidate SNP',
      accessor: 'candidate_snp',
      id: 'candidate_snp',
    },
    {
      Header: 'Posterior Explained By SNP',
      accessor: 'posterior_explained_by_snp',
      id: 'posterior_explained_by_snp',
    },
    {
      Header: 'Dropped Trait',
      accessor: 'dropped_trait',
      id: 'dropped_trait',
    },
    {
      Header: 'Gene ID',
      accessor: 'gene_id',
      id: 'gene_id',
    },
    {
      Header: 'Gene Symbol',
      accessor: 'gene_symbol',
      id: 'gene_symbol',
    },
  ];

  const hyprcolocSNPScoreColumns = [
    {
      Header: 'RS Number',
      accessor: 'rsnum',
      id: 'rsnum',
    },
    {
      Header: 'SNP Score',
      accessor: 'snpscore',
      id: 'snpscore',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'Gene ID',
      accessor: 'gene_id',
      id: 'gene_id',
    },
    {
      Header: 'Gene Symbol',
      accessor: 'gene_symbol',
      id: 'gene_symbol',
    },
  ];

  const ecaviarColumns = [
    {
      Header: 'Gene ID',
      accessor: 'gene_id',
      id: 'gene_id',
    },
    {
      Header: 'Gene Symbol',
      accessor: 'gene_symbol',
      id: 'gene_symbol',
    },
    {
      Header: 'RS Number',
      accessor: 'rsnum',
      id: 'rsnum',
    },
    {
      Header: 'Chromosome',
      accessor: 'chr',
      id: 'chr',
    },
    {
      Header: 'Position',
      accessor: 'pos',
      id: 'pos',
    },
    {
      Header: 'Ref',
      accessor: 'ref',
      id: 'ref',
    },
    {
      Header: 'Alt',
      accessor: 'alt',
      id: 'alt',
    },
    {
      Header: 'TSS Distance',
      accessor: 'tss_distance',
      id: 'tss_distance',
    },
    {
      Header: 'Nominal P-value',
      accessor: 'pval_nominal',
      id: 'pval_nominal',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'slope',
      accessor: 'slope',
      id: 'slope',
    },
    {
      Header: 'Slope SE',
      accessor: 'slope_se',
      id: 'slope_se',
    },
    {
      Header: 'GWAS P-value',
      accessor: 'gwas_pvalue',
      id: 'gwas_pvalue',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'GWAS Z',
      accessor: 'gwas_z',
      id: 'gwas_z',
    },
    {
      Header: 'Lead SNP',
      accessor: 'Leadsnp',
      id: 'Leadsnp',
    },
    {
      Header: 'Prob_in_pCausalSet',
      accessor: 'Prob_in_pCausalSet',
      id: 'Prob_in_pCausalSet',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'CLPP',
      accessor: 'CLPP',
      id: 'CLPP',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'Prob_in_pCausalSet2',
      accessor: 'Prob_in_pCausalSet2',
      id: 'Prob_in_pCausalSet2',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'CLPP2',
      accessor: 'CLPP2',
      id: 'CLPP2',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'Lead SNP Included',
      accessor: 'leadsnp_included',
      id: 'leadsnp_included',
    },
  ];

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      <div className="mb-2 d-flex justify-content-center">
        <ButtonGroup toggle>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              type="radio"
              variant="primary"
              name="radio"
              value={radio.value}
              checked={activeColocalizationTab === radio.value}
              onChange={async (e) => {
                dispatch(
                  updateQTLsGWAS({
                    activeColocalizationTab: e.currentTarget.value,
                  })
                );
                // lazy-load ecaviar calculation
                if (
                  e.currentTarget.value === 'ecaviar' &&
                  !isError &&
                  ecaviar_table &&
                  ecaviar_table.data &&
                  ecaviar_table.data.length === 0 &&
                  !isLoadingECaviar
                ) {
                  console.log('run ecaviar');
                  dispatch(
                    qtlsGWASECaviarCalculation({
                      LDFile: inputs['ld_file'][0],
                      associationFile: inputs['association_file'][0],
                      gwasFile: inputs['gwas_file'][0],
                      request,
                      select_dist: inputs['select_dist'][0] * 1000,
                      select_gwas_sample,
                      select_qtls_samples,
                      select_ref: locus_alignment['top']['rsnum'],
                    })
                    // qtlsGWASBoxplotsCalculation({
                    //   request,
                    //   select_qtls_samples,
                    //   quantificationFile: inputs['quantification_file'][0],
                    //   genotypeFile: inputs['genotype_file'][0],
                    //   info: tooltip.data
                    // })
                  );
                }
              }}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      {activeColocalizationTab === 'hyprcoloc' && (
        <>
          <p>
            Hypothesis Prioritization in multi-trait Colocalization (
            <a
              href="https://github.com/jrs95/hyprcoloc"
              target="_blank"
              rel="noreferrer"
            >
              HyPrColoc
            </a>
            ) analyses (Foley <i>et al</i>. 2019 bioRxiv 592238). The first
            table shows the colocalization results including the following
            information:
          </p>
          <ul>
            <li>
              Traits: a cluster of putatively colocalized traits. The last
              column shows which gene QTLs are colocalized with GWAS.
            </li>
            <li>
              Posterior Probability: the posterior probability that these traits
              are colocalized
            </li>
            <li>
              Regional association probability: always {'>'} the posterior
              probability. Please see Foley <i>et al</i> for details
            </li>
            <li>
              Candidate SNP: a candidate causal variant explaining the shared
              association
            </li>
            <li>
              Posterior Explained By SNP: the proportion of the posterior
              probability explained by the Candidate SNP (which represents the
              HyPrColoc multi-trait fine-mapping probability).
            </li>
          </ul>
          <p>
            HyPrColoc analysis will be performed based on the user-defined
            cis-QTL Distance on the input file loading page. Only overlapping
            SNPs between GWAS and QTLs are used for colocalization analysis.
          </p>

          <div>
            <LoadingOverlay
              active={isLoadingHyprcoloc || hyprcolocError}
              content={hyprcolocError}
            />
            {hyprcoloc_table.data.length && (
              <div className="mb-2">
                <Plot
                  plotURL={`api/results/${request}/hyprcoloc_table.svg`}
                  className="border rounded p-3"
                />
              </div>
            )}
            <Table
              title=""
              columns={hyprcolocColumns}
              data={hyprcoloc_table.data}
              hidden={[]}
              globalFilter={hyprcoloc_table.globalFilter}
              // pagination={locus_table.pagination}
              mergeState={(state) =>
                dispatch(
                  updateQTLsGWAS({
                    hyprcoloc_table: { ...hyprcoloc_table, ...state },
                  })
                )
              }
              defaultSort={[{ id: 'posterior_prob', desc: true }]}
              exportFilename={'hyprcoloc_table.csv'}
            />
          </div>

          <p>
            The second table outputs the SNP score of all variants for each pair
            of colocalized traits. For detailed information, please check the
            manual of{' '}
            <a
              href="https://github.com/jrs95/hyprcoloc"
              target="_blank"
              rel="noreferrer"
            >
              HyPrColoc
            </a>
            .
          </p>
          <div>
            <LoadingOverlay
              active={isLoadingHyprcoloc || hyprcolocError}
              content={
                !isLoadingHyprcoloc && hyprcolocError ? hyprcolocError : null
              }
            />
            {hyprcolocSNPScore_table.data.length && (
              <div className="mb-2">
                <Plot
                  plotURL={`api/results/${request}/hyprcoloc_snpscore_table.svg`}
                  className="border rounded p-3"
                />
              </div>
            )}
            <Table
              title=""
              columns={hyprcolocSNPScoreColumns}
              data={hyprcolocSNPScore_table.data}
              hidden={[]}
              globalFilter={hyprcolocSNPScore_table.globalFilter}
              // pagination={locus_table.pagination}
              mergeState={(state) =>
                dispatch(
                  updateQTLsGWAS({
                    hyprcolocSNPScore_table: {
                      ...hyprcolocSNPScore_table,
                      ...state,
                    },
                  })
                )
              }
              defaultSort={[{ id: 'snpscore', desc: true }]}
              exportFilename={'hyprcoloc_snpscores_table.csv'}
            />
          </div>
        </>
      )}
      {activeColocalizationTab === 'ecaviar' && (
        <>
          <p>
            eCAVIAR is a novel probabilistic model for integrating GWAS and eQTL
            data that extends the CAVIAR framework to explicitly estimate the
            posterior probability of the same variant being causal in both GWAS
            and eQTL studies, while accounting for allelic heterogeneity and LD.
            This approach can quantify the strength between a causal variant and
            its associated signals in both studies, and it can be used to
            colocalize variants that pass the genome-wide significance threshold
            in GWAS. For detailed information, please check the{' '}
            <a
              href="http://zarlab.cs.ucla.edu/tag/ecaviar/"
              target="_blank"
              rel="noreferrer"
            >
              eCAVIAR paper
            </a>
            .
          </p>
          <p>
            vQTL performs the eCAVIAR analysis for each gene in QTL data
            together with GWAS data. Two results will be reported based on the
            number of SNPs tested: SNPs in up to +/- 100 kb range as specified
            in cis-QTL Distance (CLPP and Prob_in_pCausalSet) or +/- 50 SNPs
            (CLPP2 and Prob_in_pCausalSet2) around the GWAS lead SNP. If there
            are less than +/- 10 SNPs around the GWAS lead SNP (or LD reference
            SNP) within the user-specified cis-QTL Distance, the analysis will
            not be performed. vQTL combines GWAS, QTL, and eCAVIAR results into
            one table as shown below. If no QTLs are found for GWAS lead SNP
            (Lead SNP included=”N”), vQTL will use the nearest variant as a
            locational proxy of “GWAS lead SNP” for the eCAVIAR analysis. Only
            overlapping SNPs between GWAS and QTLs are used for colocalization
            analysis.
          </p>

          <div>
            <LoadingOverlay
              active={isLoadingECaviar || !ecaviar_table.data.length}
              content={
                !isLoadingECaviar && !ecaviar_table.data.length
                  ? 'No data available'
                  : null
              }
            />
            {ecaviar_table.data.length && (
              <div className="mb-2">
                <Plot
                  plotURL={`api/results/${request}/ecaviar_table_barplot.svg`}
                  className="border rounded p-3"
                />
                <Plot
                  plotURL={`api/results/${request}/ecaviar_table_boxplot.svg`}
                  className="border rounded p-3"
                />
              </div>
            )}{' '}
            <Table
              title=""
              columns={ecaviarColumns}
              data={ecaviar_table.data}
              hidden={[]}
              globalFilter={ecaviar_table.globalFilter}
              // pagination={locus_table.pagination}
              mergeState={(state) =>
                dispatch(
                  updateQTLsGWAS({
                    ecaviar_table: { ...ecaviar_table, ...state },
                  })
                )
              }
              defaultSort={[{ id: 'CLPP', desc: true }]}
              exportFilename={'ecaviar_table.csv'}
            />
          </div>
        </>
      )}
    </div>
  );
}
