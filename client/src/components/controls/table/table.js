import React, { useMemo, useState } from 'react';
import BTable from 'react-bootstrap/Table';
import { Dropdown, Form, Row, Col, Button } from 'react-bootstrap';
import {
  useTable,
  useGlobalFilter,
  // useFilters,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { CSVLink, CSVDownload } from 'react-csv';

function GlobalFilter({ globalFilter, setGlobalFilter, handleSearch, title }) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || '');
    handleSearch(value || '');
  }, 200);

  return (
    <Form.Group className="m-0">
      <Form.Control
        type="text"
        size="sm"
        placeholder="Search"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        aria-label={`${title.replace(/\s/g, '')}-search`}
      />
    </Form.Group>
  );
}

function DefaultColumnFilter({ column: { filterValue, setFilter, Header } }) {
  return (
    <Form.Group className="m-0">
      <Form.Control
        value={filterValue || ''}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={Header}
        type="text"
        size="sm"
        aria-label={`${Header}-search`}
      />
    </Form.Group>
  );
}

function PaginationText({
  from,
  to,
  size,
  singular = 'entry',
  plural = 'entries',
}) {
  return size > 0 ? (
    <span className="react-bootstrap-table-pagination-total ml-2 small text-muted">
      Showing&nbsp;
      {1 + to - from < size && `${from} to ${to} of `}
      {size.toLocaleString()}
      {size === 1 ? ` ${singular}` : ` ${plural || singular + 's'}`}
    </span>
  ) : null;
}

export default function Table({
  controlId,
  title,
  columns,
  data,
  hidden,
  globalFilter: globalSearch,
  pagination,
  mergeState,
  defaultSort,
  exportFilename,
}) {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    setGlobalFilter,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        hiddenColumns: hidden || [],
        globalFilter: globalSearch,
        // sortBy: [{ id: 'R2', desc: true }],
        sortBy: defaultSort,
        ...pagination,
      },
    },
    useGlobalFilter,
    // useFilters,
    useSortBy,
    usePagination
  );

  const exportCSV = (inData) => {
    const exportColumns = Object.keys(inData[0]);
    let exportData = [];
    inData.forEach((item) => {
      let row = [];
      exportColumns.forEach((key) => {
        row.push(item[key]);
      });
      exportData.push(row);
    });
    exportData.unshift(exportColumns);
    return exportData;
  };

  const csvData = data && data.length > 0 ? exportCSV(data) : [];

  return (
    <div className="mb-5">
      <Row className="mb-2">
        <Col md="8">
          {(globalSearch || globalSearch == '') && (
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              handleSearch={(query) => mergeState({ globalFilter: query })}
              title={title}
            />
          )}
        </Col>
        <Col />
        <Col md="auto">
          <CSVLink data={csvData} filename={exportFilename}>
            Export
          </CSVLink>
        </Col>
        <Col md="auto">
          <span>
            <Dropdown>
              <Dropdown.Toggle
                variant="secondary"
                size="sm"
                id={`${title.replace(/\s/g, '')}-controls-${controlId}`}
              >
                Columns
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Form>
                  {columns.map(({ id, Header }) => {
                    return (
                      <Form.Group
                        key={`${title.replace(/\s/g, '')}-${id}`}
                        controlId={`${title.replace(
                          /\s/g,
                          ''
                        )}-${id}-visibility`}
                        className="my-1 px-2"
                      >
                        <Form.Check
                          type="checkbox"
                          label={Header}
                          checked={hiddenColumns.indexOf(id) == -1}
                          onChange={() =>
                            setHiddenColumns((hiddenColumns) => {
                              const index = hiddenColumns.indexOf(id);
                              const newHidden =
                                index > -1
                                  ? hiddenColumns.filter((c) => c != id)
                                  : [...hiddenColumns, id];
                              mergeState({ hidden: newHidden });
                              return newHidden;
                            })
                          }
                        />
                      </Form.Group>
                    );
                  })}
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <BTable
            responsive
            striped
            bordered
            hover
            size="sm"
            {...getTableProps()}
            className="mb-2"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      id={column.id.replace(/\s|\W/g, '') + `-${controlId}`}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="text-nowrap"
                    >
                      {column.render('Header')}
                      {column.canSort && (
                        <span>
                          {' '}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon
                                className="text-primary"
                                icon={faSortDown}
                              />
                            ) : (
                              <FontAwesomeIcon
                                className="text-primary"
                                icon={faSortUp}
                              />
                            )
                          ) : (
                            <FontAwesomeIcon
                              className="text-muted"
                              icon={faSort}
                            />
                          )}
                        </span>
                      )}
                      <div>
                        {/* Use column search if global search isn't used */}
                        {globalSearch == undefined
                          ? column.render('Filter')
                          : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps}>
              {!data ||
                (data.length === 0 && (
                  <tr>
                    {columns.map((_, i) => {
                      return (
                        <td
                          style={{ height: '200px' }}
                          key={`${title}-td-${i}`}
                        ></td>
                      );
                    })}
                  </tr>
                ))}
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td {...cell.getCellProps()} key={`${title}-td-${i}`}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </BTable>
        </Col>
      </Row>
      <Row className="pagination mt-3">
        <Col>
          <select
            className="form-control-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              mergeState({ pagination: { pageSize: Number(e.target.value) } });
            }}
            aria-label="Select a pagination size"
          >
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <PaginationText
            from={pageIndex * pageSize + 1}
            to={pageIndex * pageSize + page.length}
            size={rows.length}
          />
        </Col>

        <Col className="d-flex">
          <div className="ml-auto">
            <Button
              disabled={!canPreviousPage}
              className={`p-2 ${!canPreviousPage ? 'text-muted' : ''}`}
              variant="link"
              onClick={() => {
                gotoPage(0);
                mergeState({ pagination: { pageIndex: 0 } });
              }}
            >
              {'<<'}
            </Button>
            <Button
              disabled={!canPreviousPage}
              className={`p-2 ${!canPreviousPage ? 'text-muted' : ''}`}
              variant="link"
              onClick={() => {
                previousPage();
                mergeState({ pagination: { pageIndex: pageIndex - 1 } });
              }}
            >
              {'<'}
            </Button>
            <Button
              disabled={!canNextPage}
              className={`p-2 ${!canNextPage ? 'text-muted' : ''}`}
              variant="link"
              onClick={() => {
                nextPage();
                mergeState({ pagination: { pageIndex: pageIndex + 1 } });
              }}
            >
              {'>'}
            </Button>
            <Button
              disabled={!canNextPage}
              className={`p-2 ${!canNextPage ? 'text-muted' : ''}`}
              variant="link"
              onClick={() => {
                gotoPage(pageCount - 1);
                mergeState({ pagination: { pageIndex: pageCount - 1 } });
              }}
            >
              {'>>'}
            </Button>{' '}
            <span className="text-muted small align-center">
              Page: {pageIndex + 1}
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
}
