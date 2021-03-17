import React from 'react';
import Table from '../../../controls/table/table';

export function LocusTable() {

  // const columns = useMemo(() => [
  //   {
  //     Header: 'Column 1',
  //     accessor: 'col1', // accessor is the "key" in the data
  //   },
  //   {
  //     Header: 'Column 2',
  //     accessor: 'col2',
  //   },
  // ], []);

  // const data = useMemo(() => [
  //   {
  //     col1: 'Hello',
  //     col2: 'World',
  //   },
  //   {
  //     col1: 'react-table',
  //     col2: 'rocks',
  //   },
  //   {
  //     col1: 'whatever',
  //     col2: 'you want',
  //   },
  // ], []);

  // const tableInstance = useTable({ columns, data });

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = tableInstance;

  return  (
      <div className="px-3 py-2" style={{ minHeight: '500px' }}>
        <p>
          QTL results of the locus are annotated with linkage disequilibrium to the LD reference SNP and links to multiple external databases (LDlink, GWAS Catalog, gnomAD). 
          The "R2 to LD reference" column will be updated according to the selected LD reference.
        </p>

        {
          // oraMemo.data && (
          //   <Table
          //     title="Original Research Papers Including Specific Mutational Signatures in mSigPortal"
          //     columns={oraMemo.columns}
          //     data={oraMemo.data}
          //     hidden={oraHidden}
          //     globalFilter={oraSearch}
          //     pagination={oraPagination}
          //     mergeState={(state) => dispatch(actions.mergeState({ orA: state }))}
          //   />
          // )
        }
      </div>
  );
}
