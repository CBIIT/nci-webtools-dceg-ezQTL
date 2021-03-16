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
    isError
  } = useSelector((state) => state.qtlsGWAS);

  const tabs = [
    {
      component: <LocusAlignment />,
      key: 'locus-alignment',
      title: 'Locus Alignment',
    },
    {
      component: <LocusColocalization />,
      key: 'locus-colocalization',
      title: 'Locus Colocalization',
    },
    {
      component: <LocusTable />,
      key: 'locus-table',
      title: 'Locus Table',
    },
    {
      component: <LocusQuantifiation />,
      key: 'locus-quantification',
      title: 'Locus Quantification',
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
        {tabs.map((item) => (
          <Tab eventKey={item.key} title={item.title} disabled={!submitted || isError}>
            {item.component}
          </Tab>
        ))}
      </Tabs>
    </>
  );
}
