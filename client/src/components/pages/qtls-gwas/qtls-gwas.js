import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SidebarContainer,
  SidebarPanel,
  MainPanel,
} from '../../controls/sidebar-container/sidebar-container';
import { QTLsGWASForm } from './qtls-gwas-form';
// import { QTLsGWASResultsForm } from './qtls-gwas-results/qtls-gwas-results-form';
import { QTLsGWASResults } from './qtls-gwas-results/qtls-gwas-results';
// import { actions } from '../../../services/store';
import { updateQTLsGWAS } from '../../../services/actions';

export function QTLsGWAS({ match }) {
  const dispatch = useDispatch();
  const [_openSidebar, _setOpenSidebar] = useState(true);
  const { openSidebar } = useSelector((state) => state.qtlsGWAS);

  useEffect(() => {
    _setOpenSidebar(openSidebar);
  }, [openSidebar]);

  return (
    <div className="px-2">
      <SidebarContainer
        className=""
        collapsed={!_openSidebar}
        onCollapsed={(collapsed) =>
          dispatch(updateQTLsGWAS({ openSidebar: !collapsed }))
        }
      >
        <SidebarPanel className="col-lg-3">
          <QTLsGWASForm />
        </SidebarPanel>

        <MainPanel className="col-lg-9">
          {/* <div className="border rounded mb-3">
            <QTLsGWASResultsForm />
          </div> */}
          <div className="">
            <QTLsGWASResults queueRequest={match.params.request} />
          </div>
        </MainPanel>
      </SidebarContainer>
    </div>
  );
}
