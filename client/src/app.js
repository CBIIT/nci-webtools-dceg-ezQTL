import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Route,
  useLocation,
  NavLink,
  Redirect,
} from 'react-router-dom';
import { NCIFooter } from '@cbiitss/react-components';
import { Home } from './components/pages/home/home';
import { QTLsGWAS } from './components/pages/qtls-gwas/qtls-gwas';
import { Help } from './components/pages/help/help';
import { PublicDataSource } from './components/pages/public-data-source/public-data-source';
import { Navbar, Nav } from 'react-bootstrap';
import './styles/main.scss';
import 'font-awesome/css/font-awesome.min.css';
import { ErrorModal } from './components/controls/error-modal/error-modal';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { updateAlert, updatePublications } from './services/actions';
import { SuccessModal } from './components/controls/success-modal/success-modal';

export function App() {
  const dispatch = useDispatch();

  const alert = useSelector((state) => state.alert);
  const publicationsState = useSelector((state) => state.publications);

  const links = [
    {
      route: '/home',
      title: 'Home',
    },
    {
      route: '/qtls',
      title: 'Analyses',
    },
    {
      route: '/source',
      title: 'Public Data Source',
    },
    {
      route: '/help',
      title: 'Documentation',
    },
  ];

  // Retrieve Publications on page load
  useEffect(() => {
    const getData = async () => {
      const data = await (await fetch(`api/getPublications`)).json();

      const reducer = (acc, column) => [
        ...acc,
        {
          Header: column
            .replace('_', ' ')
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()),
          accessor: column,
          id: column,
          Cell: (e) => {
            if (
              column == 'Title' &&
              e.row.values['Study_website'] &&
              e.row.values['Study_website'] != 'NA'
            ) {
              return (
                <a
                  href={e.row.values['Study_website']}
                  target="_blank"
                  rel="noreferrer"
                >
                  {e.value}
                </a>
              );
            } else {
              return e.value || '';
            }
          },
        },
      ];

      dispatch(
        updatePublications({
          columns: [...new Set(...data.map((row) => Object.keys(row)))].reduce(
            reducer,
            []
          ),
          data: data,
        })
      );
    };

    if (!publicationsState.data) getData();
  }, [publicationsState]);

  return (
    <Router>
      <header className="bg-white">
        <div>
          <a
            href={window.location.href + '#main'}
            className="sr-only sr-only-focusable d-block text-white bg-primary-dark text-center"
          >
            Skip to Main Content
          </a>
          <div className="ml-4 mr-5">
            <div className="p-2 d-none d-sm-block">
              <div className="d-flex">
                <a href="https://dceg.cancer.gov/" target="_blank">
                  <img
                    src="https://analysistools.cancer.gov/common/images/DCEG-logo.svg"
                    height="100"
                    alt="National Cancer Institute Logo"
                  />
                </a>
                <img
                  className="d-none d-md-block ml-auto my-auto"
                  src="assets/images/ezqtl-logo.png"
                  alt="ezQTL Logo"
                  height="80"
                />
              </div>
            </div>
            <div className="p-1 d-sm-none">
              <a href="https://dceg.cancer.gov/">
                <img
                  src="https://analysistools.cancer.gov/common/images/DCEG-logo.svg"
                  height="80"
                  alt="National Cancer Institute Logo"
                />
              </a>
            </div>
          </div>
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
      <main id="main" style={{ backgroundColor: '#EEEEEE' }}>
        <h1 className="sr-only">ezQTL</h1>
        <ErrorModal />
        <SuccessModal />
        <div className="bg-white container py-4 shadow">
          {alert && (
            <Alert
              className="mx-2"
              variant={alert.variant}
              show={alert.show}
              onClose={() => dispatch(updateAlert({ show: false }))}
              dismissible
            >
              {alert.message}
            </Alert>
          )}
          <Route exact path={`/`} render={() => <Redirect to="/home" />} />
          <Route path="/home" exact={true} component={Home} />
          <Route path="/qtls/:request?" component={QTLsGWAS} />
          <Route path="/help" component={Help} />
          <Route path="/source" component={PublicDataSource} />
        </div>
      </main>
      <NCIFooter
        className="py-4 bg-dark text-light"
        title={
          <div className="mb-4">
            <div className="h4 mb-0">
              Division of Cancer Epidemiology and Genetics
            </div>
            <div className="h6">at the National Cancer Institute</div>
          </div>
        }
      />
    </Router>
  );
}
