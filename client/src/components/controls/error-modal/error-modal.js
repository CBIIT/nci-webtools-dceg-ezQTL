import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { updateError } from '../../../services/actions';

export function ErrorModal(props) {
  const dispatch = useDispatch();
  const errorModal = useSelector((state) => state.errorModal);
  const closeErrorModal = () => dispatch(updateError({ visible: false }));

  return (
    <Modal
      data-testid="ErrorModal"
      show={errorModal.visible}
      onHide={closeErrorModal}
      style={{zIndex: '999999'}}
    >
      <Modal.Header closeButton>
        <Modal.Title>Internal Server Error</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p
          data-testid="ErrorModalMessage"
          dangerouslySetInnerHTML={{ __html: errorModal.message }}
        />
        {errorModal.details && <pre>{errorModal.details}</pre>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeErrorModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
