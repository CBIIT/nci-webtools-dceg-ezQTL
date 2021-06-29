import React, { useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { LoadingOverlay } from '../loading-overlay/loading-overlay';
import { LocusAlignmentBoxplotsPlot } from '../../pages/qtls-gwas/qtls-gwas-results/locus-alignment-boxplots-plot';

export function BoxplotsModal(props) {
  const plotContainer = useRef(null);
  // const dispatch = useDispatch();
  // const errorModal = useSelector((state) => state.errorModal);
  // const closeErrorModal = () => dispatch(updateError({ visible: false }));

  return (
    <Modal
      {...props}
      data-testid="BoxplotsModal"
      style={{
        zIndex: '999999',
      }}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      // dialogClassName="modal-90w"
    >
      {/* <Modal.Header closeButton>
        <Modal.Title>Internal Server Error</Modal.Title>
      </Modal.Header> */}

      <Modal.Body>
        <LoadingOverlay active={props.isLoading} />
        <div
          className="text-center my-3 position-relative mw-100"
          ref={plotContainer}
        >
          <div style={{ overflowX: 'auto' }}>
            <LocusAlignmentBoxplotsPlot />
          </div>
        </div>
      </Modal.Body>

      {/* <Modal.Footer>
        <Button variant="secondary" onClick={closeErrorModal}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}
