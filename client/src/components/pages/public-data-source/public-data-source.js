import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePublications } from '../../../services/actions';
import Table from '../../controls/table/table';

import './public-data-source.scss';

export function PublicDataSource() {
  // data is retrieved in components/app.js
  const dispatch = useDispatch();
  const { globalFilter, hidden, pagination, sort, ...table } = useSelector(
    (state) => state.publications
  );

  const pubMemo = useMemo(() => table, [table]) || {};

  return (
    <div className="mx-2 bg-white">
      <div className="mb-4">
        <p>An overview of public data sources related to QTL analysis.</p>
      </div>

      {pubMemo.data && (
        <Table
          title=""
          columns={pubMemo.columns}
          data={pubMemo.data}
          hidden={hidden}
          globalFilter={globalFilter}
          pagination={pagination}
          defaultSort={sort}
          mergeState={(state) => dispatch(updatePublications({ state }))}
        />
      )}

      <p>Last update: 01 JUN 2021.</p>
    </div>
  );
}
