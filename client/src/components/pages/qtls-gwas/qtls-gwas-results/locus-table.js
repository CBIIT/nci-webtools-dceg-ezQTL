import React, { useMemo } from 'react';
import Table from '../../../controls/table/table';
import { useDispatch, useSelector } from 'react-redux';
import { updateQTLsGWAS } from '../../../../services/actions';
import { QTLsGWASResultsForm } from './qtls-gwas-results-form';

export function LocusTable() {
  const dispatch = useDispatch();

  const { locus_alignment, locus_table, inputs, isQueue } = useSelector(
    (state) => state.qtlsGWAS
  );

  const columns = [
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
      Header: 'Variant ID',
      accessor: 'variant_id',
      id: 'variant_id',
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
      Header: 'Slope SE',
      accessor: 'slope_se',
      id: 'slope_se',
    },
    {
      Header: 'R2 to LD Reference',
      accessor: 'R2',
      id: 'R2',
      sortType: useMemo(() => (rowA, rowB, columnId) => {
        const a = Number(rowA.original[columnId]);
        const b = Number(rowB.original[columnId]);
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
      }),
    },
    {
      Header: 'LDpop',
      accessor: 'rsnum',
      id: 'ldpop',
      disableSortBy: true,
      Cell: (row) => (
        <a
          href={
            'https://ldlink.nci.nih.gov/?tab=ldpop&var1=' +
            row.value +
            '&var2=' +
            locus_alignment['top']['rsnum'] +
            '&pop=' +
            inputs['select_pop'][0].split('+').join('%2B') +
            '&r2_d=r2'
          }
          target="_blank"
          rel="noreferrer"
        >
          Go to
        </a>
      ),
    },
    {
      Header: 'NHGRI GWAS',
      accessor: 'rsnum',
      id: 'nhrgi_gwas',
      disableSortBy: true,
      Cell: (row) => (
        <a
          href={'https://www.ebi.ac.uk/gwas/search?query=' + row.value}
          target="_blank"
          rel="noreferrer"
        >
          Go to
        </a>
      ),
    },
    {
      Header: 'gnmomAD',
      accessor: (d) => {
        return {
          chr: d.chr,
          pos: d.pos,
          ref: d.ref,
          alt: d.alt,
        };
      },
      id: 'genomad',
      disableSortBy: true,
      Cell: (row) => (
        <a
          href={
            'http://gnomad.broadinstitute.org/variant/' +
            row.value.chr +
            '-' +
            row.value.pos +
            '-' +
            row.value.ref +
            '-' +
            row.value.alt
          }
          target="_blank"
          rel="noreferrer"
        >
          Go to
        </a>
      ),
    },
  ];
  // gene_id(pin):"ENSG00000183486.8"
  // gene_symbol(pin):"MX2"
  // variant_id(pin):"21:42643610"
  // rsnum(pin):"rs62219579"
  // chr(pin):21
  // pos(pin):42643610
  // ref(pin):"T"
  // alt(pin):"C"
  // tss_distance(pin):-90260
  // pval_nominal(pin):"0.670997"
  // slope(pin):"-0.0939986"
  // slope_se(pin):"0.220529"
  // R2(pin):"0.0008732025"

  // const columns = [
  //   {
  //     Header: '1',
  //     accessor: '1',
  //     id: '1'
  //   },
  //   {
  //     Header: '2',
  //     accessor: '2',
  //     id: '2'
  //   },
  // ];

  // const data = [
  //   {
  //     '1': 'a',
  //     '2': 'b'
  //   },
  //   {
  //     '1': 'c',
  //     '2': 'd'
  //   }
  // ];

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      {!isQueue && (
        <>
          <QTLsGWASResultsForm />
          <hr />
        </>
      )}
      <p>
        QTL results of the locus are annotated with linkage disequilibrium to
        the LD reference SNP and links to multiple external databases (LDlink,
        GWAS Catalog, gnomAD). The "R2 to LD reference" column will be updated
        according to the selected LD reference.
      </p>

      {locus_table && locus_table.data && locus_table.data.length > 0 && (
        <Table
          controlId="locus-table"
          title="lctable"
          columns={columns}
          data={locus_table.data}
          hidden={locus_table.hidden}
          globalFilter={locus_table.globalFilter}
          // pagination={locus_table.pagination}
          mergeState={(state) =>
            dispatch(
              updateQTLsGWAS({ locus_table: { ...locus_table, ...state } })
            )
          }
          defaultSort={[{ id: 'R2', desc: true }]}
          exportFilename={'locus_variant_details_table.csv'}
        />
      )}
    </div>
  );
}
