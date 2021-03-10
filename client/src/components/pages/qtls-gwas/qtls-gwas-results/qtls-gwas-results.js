import React, { useState } from 'react';
import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import { LocusAlignment } from './locus-alignment';
import { LocusColocalization } from './locus-colocalization';
import { LocusQuantifiation } from './locus-quantification';
import { LocusTable } from './locus-table';

export function QTLsGWASResults() {
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
        }
    ]
    const [key, setKey] = useState('locus-alignment');

    return (
        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}>
            {
                tabs.map((item) => 
                    <Tab 
                        eventKey={item.key} 
                        title={item.title}
                        // disabled={}
                    >
                        {item.component}
                    </Tab>
                )
            }

        </Tabs>
    )
}