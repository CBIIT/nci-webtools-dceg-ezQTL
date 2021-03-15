import React, { useEffect } from 'react';
import { Route, useLocation, NavLink, Redirect } from 'react-router-dom';
import { NCIFooter } from '@cbiitss/react-components';
import { Home } from './components/pages/home/home';
import { QTLsGWAS } from './components/pages/qtls-gwas/qtls-gwas';
import { Help } from './components/pages/help/help';
import { Navbar, Nav } from 'react-bootstrap';
import './styles/main.scss';
import 'font-awesome/css/font-awesome.min.css';
import { ErrorModal } from './components/controls/error-modal/error-modal';

export function App() {
  const { pathname } = useLocation();
  useEffect((_) => window.scrollTo(0, 0), [pathname]);

  const links = [
    {
      route: '/home',
      title: 'Home',
    },
    {
      route: '/qtls',
      title: 'QTLs-GWAS',
    },
    {
      route: '/help',
      title: 'Help',
    },
  ];

  return (
    <>
      <header className="bg-primary-gradient py-3">
        <div className="container px-0">
          <a href="https://dceg.cancer.gov/" target="_blank" rel="noreferrer">
            <img
              src="assets/images/dceg-logo-inverted.svg"
              alt="NCI Logo"
              className="w-50"
            />
          </a>
        </div>
      </header>
      <Navbar bg="dark" expand="sm" className="navbar-dark py-0">
        <div className="container">
          <Navbar.Toggle aria-controls="app-navbar" />
          <Navbar.Collapse id="app-navbar">
            <Nav className="mr-auto">
              {links.map((link, index) => (
                <NavLink
                  key={`navlink-${index}`}
                  exact={link.route === '/'}
                  activeClassName="active font-weight-bold"
                  className="nav-link px-3"
                  to={link.route}
                >
                  {link.title}
                </NavLink>
              ))}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <div id="main" style={{ backgroundColor: '#EEEEEE' }}>
        <ErrorModal />
        <div className="bg-white container py-4 shadow">
          <Route exact path={`/`} render={() => <Redirect to="/home" />} />
          <Route path="/home" exact={true} component={Home} />
          <Route path="/qtls" exact component={QTLsGWAS} />
          <Route path="/help" component={Help} />
        </div>
      </div>
      <NCIFooter
        className="py-4 bg-primary-gradient text-light"
        title={
          <div className="mb-4">
            <div className="h4 mb-0">
              Division of Cancer Epidemiology and Genetics
            </div>
            <div className="h6">at the National Cancer Institute</div>
          </div>
        }
      />
    </>
  );
}
