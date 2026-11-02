import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { updateSuccess } from '../../../services/actions';

export function SuccessModal(props) {
  const dispatch = useDispatch();
  const closeModal = () => dispatch(updateSuccess({ visible: false }));
  const success = useSelector((state) => state.successModal);

  return (
    <Modal
      data-testid="SuccessModal"
      show={success.visible}
      onHide={closeModal}
      style={{ zIndex: '999999' }}
    >
      <Modal.Header style={{ backgroundColor: '#04c585 ' }}>
        <Modal.Title className="d-flex justify-content-center w-100">
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="3x"
            style={{ color: '#fafafa' }}
          />
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="d-flex justify-content-center"
        style={{ backgroundColor: '#fafafa' }}
      >
        <p
          className="m-0"
          data-testid="ModalMessage"
          dangerouslySetInnerHTML={{ __html: success.message }}
        />
      </Modal.Body>

      <Modal.Footer
        className="d-flex justify-content-center border-0"
        style={{ backgroundColor: '#fafafa' }}
      >
        <Button variant="outline-secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
