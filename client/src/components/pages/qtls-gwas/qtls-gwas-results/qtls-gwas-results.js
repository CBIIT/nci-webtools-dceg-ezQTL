import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { actions } from '../../../../services/store';
import { updateQTLsGWAS } from '../../../../services/actions';
import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import { LocusAlignment } from './locus-alignment';
import { LocusColocalization } from './locus-colocalization';
import { LocusQuantifiation } from './locus-quantification';
import { LocusTable } from './locus-table';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';

export function QTLsGWASResults() {
  const dispatch = useDispatch();

  const {
    submitted,
    isLoading,
    activeResultsTab,
    isError,
    gwas
  } = useSelector((state) => state.qtlsGWAS);

  const tabs = [
    {
      component: <LocusAlignment />,
      key: 'locus-alignment',
      title: 'Locus Alignment',
      disabled: !submitted || isError
    },
    {
      component: <LocusColocalization />,
      key: 'locus-colocalization',
      title: 'Locus Colocalization',
      disabled: !submitted || isError || !(gwas && gwas.data && Object.keys(gwas.data).length > 0)
    },
    {
      component: <LocusTable />,
      key: 'locus-table',
      title: 'Locus Table',
      disabled: !submitted || isError
    },
    {
      component: <LocusQuantifiation />,
      key: 'locus-quantification',
      title: 'Locus Quantification',
      disabled: !submitted || isError
    },
  ];

  return (
    <>
      <LoadingOverlay active={isLoading} />
      <Tabs
        id="controlled-tab-example"
        activeKey={activeResultsTab}
        onSelect={(k) => {
          dispatch(updateQTLsGWAS({ activeResultsTab: k }));
        }}
      >
        {tabs.map((item, idx) => (
          <Tab key={item.key} 
            eventKey={item.key} 
            title={item.title} 
            disabled={item.disabled}>
            {item.component}
          </Tab>
        ))}
      </Tabs>
    </>
  );
}
