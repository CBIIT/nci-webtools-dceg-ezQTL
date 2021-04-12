import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { LoadingOverlay } from '../loading-overlay/loading-overlay';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faHome } from '@fortawesome/free-solid-svg-icons';
import './plot.scss';

export default function Plot({
  title,
  downloadName,
  plotURL,
  txtPath,
  alt,
  maxHeight,
  className,
  ...rest
}) {
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    // check if image exists
    async function checkExists() {
      const check = await fetch(plotURL, {
        method: 'HEAD',
        cache: 'no-cache',
      });
      setExists(check.status === 200);
    }

    if (plotURL) checkExists();
  }, [plotURL]);

  //   download text results files
  async function downloadData(txtPath) {
    setLoading(true);
    try {
      const response = await fetch(`api/results/${txtPath}`);

      if (!response.ok) {
        const { msg } = await response.json();
        console.log(msg);
      } else {
        const file = await response.blob();
        const objectURL = URL.createObjectURL(file);
        const tempLink = document.createElement('a');

        tempLink.href = objectURL;
        tempLink.download = txtPath.split('/').slice(-1)[0];
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(objectURL);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }
  const zoomProps = {
    wheel: { wheelEnabled: false, step: 3 },
    zoomIn: { step: 3 },
    zoomOut: { step: 3 },
  };

  return (
    <div>
      <LoadingOverlay active={loading} />
      {exists ? (
        <div className={className} title="Ctrl + Mouse Wheel to zoom">
          <TransformWrapper className="w-100" {...zoomProps}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <React.Fragment>
                <Row className="tools">
                  <Col />
                  <Col className="d-flex text-nowrap">
                    {title && <strong className="mx-auto">{title}</strong>}
                  </Col>
                  <Col className="d-flex text-nowrap">
                    <div className="d-flex align-items-end ml-auto mb-auto">
                      <a
                        className="ml-auto"
                        href={plotURL}
                        download={downloadName}
                      >
                        Download Plot
                      </a>
                      {txtPath && (
                        <Button
                          className="p-0 border-0 ml-3"
                          variant="link"
                          onClick={() => downloadData(txtPath)}
                        >
                          Download Data
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="ml-3"
                      variant="secondary"
                      onClick={zoomIn}
                      aria-label="zoom in"
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ color: '#fafafa' }}
                      />
                    </Button>
                    <Button
                      size="sm"
                      className="ml-1"
                      variant="secondary"
                      onClick={zoomOut}
                      aria-label="zoom out"
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        style={{ color: '#fafafa' }}
                      />
                    </Button>
                    <Button
                      size="sm"
                      className="ml-1"
                      variant="secondary"
                      onClick={resetTransform}
                      aria-label="reset zoom"
                    >
                      <FontAwesomeIcon
                        icon={faHome}
                        style={{ color: '#fafafa' }}
                      />
                    </Button>
                  </Col>
                </Row>

                <TransformComponent>
                  <img
                    className="w-100"
                    src={plotURL}
                    style={{ maxHeight: maxHeight || '500px' }}
                    alt={alt || 'Plot Unavailable'}
                  />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
      ) : (
        <div className="border rounded p-3">Plot is Unavailable</div>
      )}
    </div>
  );
}
