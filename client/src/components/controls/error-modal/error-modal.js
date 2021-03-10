import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { actions } from '../../../services/store';

export function ErrorModal(props) {
  const dispatch = useDispatch();
  const errorModal = useSelector(({ezQTL}) => ezQTL.errorModal);
  const closeErrorModal = () => dispatch(actions.updateKey({ 
    key: 'errorModal', 
    data: { 
      visible: false 
    }
  }));

  return (
    <Modal
      data-testid="ErrorModal"
      show={errorModal.visible}
      onHide={closeErrorModal}
      >
      <Modal.Header closeButton>
        <Modal.Title>Internal Server Error</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p
          data-testid="ErrorModalMessage"
          dangerouslySetInnerHTML={{ __html: errorModal.message }}
        />
        {errorModal.details && 
          <pre>
            {errorModal.details}
          </pre>
        }
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeErrorModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
