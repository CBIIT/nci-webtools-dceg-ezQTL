import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../services/store';
import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import { LocusAlignment } from './locus-alignment';
import { LocusColocalization } from './locus-colocalization';
import { LocusQuantifiation } from './locus-quantification';
import { LocusTable } from './locus-table';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';

export function QTLsGWASResults() {
  const dispatch = useDispatch();

  const {
    select_qtls_samples,
    select_gwas_sample,
    associationFile,
    quantificationFile,
    genotypeFile,
    gwasFile,
    LDFile,
    request,
    select_pop,
    select_gene,
    select_dist,
    select_ref,
    recalculateAttempt,
    recalculatePop,
    recalculateGene,
    recalculateDist,
    recalculateRef,
    submitted,
    isLoading,
    activeResultsTab,
  } = useSelector(({ ezQTL }) => ezQTL.qtlsGWAS);

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
          dispatch(
            actions.updateKey({
              key: 'qtlsGWAS',
              data: { activeResultsTab: k },
            })
          );
        }}
      >
        {tabs.map((item) => (
          <Tab eventKey={item.key} title={item.title} disabled={!submitted}>
            {item.component}
          </Tab>
        ))}
      </Tabs>
    </>
  );
}
