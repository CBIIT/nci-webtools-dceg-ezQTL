import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePublications } from '../../../services/actions';
import Table from '../../../components/controls/table/table';

import './publications.scss';

export function Publications() {
  // data is retrieved in components/app.js
  const dispatch = useDispatch();
  const { globalFilter, hidden, pagination, sort, ...table } = useSelector(
    (state) => state.publications
  );

  const pubMemo = useMemo(() => table, [table]) || {};

  return (
    <div className="mx-3">
      <div className="bg-white border p-3 mx-3">
        <div className="mb-4">
          <p>
            An overview of published papers, tools, websites and databases
            related to QTL analysis.
          </p>
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

        <div className="mb-4">
          <h3>Citations</h3>
        </div>

        <p>Last update: 01 JUN 2021.</p>
      </div>
    </div>
  );
}
