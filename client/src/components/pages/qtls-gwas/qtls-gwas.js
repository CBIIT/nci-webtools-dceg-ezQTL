import React, { useState } from 'react';
import {
    SidebarContainer,
    SidebarPanel,
    MainPanel
} from '../../controls/sidebar-container/sidebar-container';
import { QTLsGWASForm } from './qtls-gwas-form';
import { QTLsGWASResultsForm } from './qtls-gwas-results/qtls-gwas-results-form';
import { QTLsGWASResults } from './qtls-gwas-results/qtls-gwas-results';

export function QTLsGWAS() {
    const [openSidebar, setOpenSidebar] = useState(true);

    return (
        <div className="px-3">
            <SidebarContainer
                className=""
                collapsed={!openSidebar}
                onCollapsed={collapsed => setOpenSidebar(!collapsed)}>
                <SidebarPanel className="col-lg-3">
                    <div className="border border-secondary rounded">
                        <QTLsGWASForm />
                    </div>
                </SidebarPanel>

                <MainPanel className="col-lg-9">
                    <div className="border border-secondary rounded mb-3">
                        <QTLsGWASResultsForm />
                    </div>
                    <div className="border border-secondary rounded">
                        <QTLsGWASResults />
                    </div>
                </MainPanel>
                </SidebarContainer>
        </div>
    )
}