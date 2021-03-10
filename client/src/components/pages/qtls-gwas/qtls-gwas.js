import React, { useState } from 'react';
import {
    SidebarContainer,
    SidebarPanel,
    MainPanel
} from '../../controls/sidebar-container/sidebar-container';
import { QTLsGWASForm } from './qtls-gwas-form';

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
                    <div className="border border-secondary rounded">
                        CONTENT
                    </div>
                </MainPanel>
                </SidebarContainer>
        </div>
    )
}