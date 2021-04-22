import React, { useContext, useState, useEffect } from 'react';
import { RootContext } from '../../../index';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadFile,
  updateQTLsGWAS,
  getPublicGTEx,
  updateAlert,
  submitQueue,
  updateMultiLoci,
} from '../../../services/actions';
import Select from '../../controls/select/select';
import MultiForm from './qtls-multi-form';

export function QTLsMulti() {
  const dispatch = useDispatch();
  const {
    states,
    valid,
    email,
    submitted,
    isLoading,
    publicGTEx,
  } = useSelector((state) => state.multiLoci);
  const { getInitialState } = useContext(RootContext);

  // get publicGTEx
  useEffect(() => {
    if (!Object.keys(publicGTEx).length) dispatch(getPublicGTEx('multi'));
  }, [publicGTEx]);

  const [_associationFile, _setAssociationFile] = useState(['']);
  const [_quantificationFile, _setQuantificationFile] = useState(['']);
  const [_genotypeFile, _setGenotypeFile] = useState(['']);
  const [_LDFile, _setLDFile] = useState(['']);
  const [_gwasFile, _setGwasFile] = useState(['']);

  function mergeState(data, index) {
    let newStates = states.slice();
    newStates[index] = { ...newStates[index], ...data };
    dispatch(updateMultiLoci({ states: newStates }));
  }

  function setFile(type, file, index) {
    if (file || file == '') {
      if (type == 'qtl') {
        let files = _associationFile.slice();
        if (files[index] || files[index] == '') files[index] = file;
        else files = [...files, file];
        _setAssociationFile(files);
      }
      if (type == 'ld') {
        let files = _LDFile.slice();
        if (files[index] || files[index] == '') files[index] = file;
        else files = [...files, file];
        _setLDFile(files);
      }
      if (type == 'gwas') {
        let files = _gwasFile.slice();
        if (files[index] || files[index] == '') files[index] = file;
        else files = [...files, file];
        _setGwasFile(files);
      }
      if (type == 'quantification') {
        let files = _quantificationFile.slice();
        if (files[index] || files[index] == '') files[index] = file;
        else files = [...files, file];
        _setQuantificationFile(files);
      }
      if (type == 'genotype') {
        let files = _genotypeFile.slice();
        if (files[index] || files[index] == '') files[index] = file;
        else files = [...files, file];
        _setGenotypeFile(files);
      }
    }
  }

  function removeFile(type, index) {
    if (type == 'qtl') {
      let files = _associationFile.slice();
      files.splice(index, 1);
      _setAssociationFile(files);
    }
    if (type == 'ld') {
      let files = _LDFile.slice();
      files.splice(index, 1);
      _setLDFile(files);
    }
    if (type == 'gwas') {
      let files = _gwasFile.slice();
      files.splice(index, 1);
      _setGwasFile(files);
    }
    if (type == 'quantification') {
      let files = _quantificationFile.slice();
      files.splice(index, 1);
      _setQuantificationFile(files);
    }
    if (type == 'genotype') {
      let files = _genotypeFile.slice();
      files.splice(index, 1);
      _setGenotypeFile(files);
    }
  }

  function addForm() {
    dispatch(
      updateMultiLoci({
        states: [...states, getInitialState().qtlsGWAS],
      })
    );
  }

  async function handleSubmit() {
    if (!valid) {
      return;
    }
    // const request = uuidv1();
  }

  return (
    <div className="px-2">
      {JSON.stringify([
        _associationFile,
        _LDFile,
        _gwasFile,
      ])}
      {states.map((_, index) => (
        <div className="mb-3">
          <MultiForm
            index={index}
            mergeState={(data) => mergeState(data, index)}
            setFile={(type, file) => setFile(type, file, index)}
            removeFile={(type) => removeFile(type, index)}
            _associationFile={_associationFile[index]}
            _quantificationFile={_quantificationFile[index]}
            _genotypeFile={_genotypeFile[index]}
            _LDFile={_LDFile[index]}
            _gwasFile={_gwasFile[index]}
          />
        </div>
      ))}
      <div>
        <Row>
          <Col>
            <Button variant="success" block onClick={() => addForm()}>
              + Add Form
            </Button>
          </Col>
        </Row>
      </div>
      <div className="mt-3 border rounded p-2">
        <Form>
          <Form.Row>
            <Col>Submit this job to a Queue</Col>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Group controlId="email">
                <Form.Control
                  placeholder="Enter Email"
                  value={email}
                  type="email"
                  onChange={(e) =>
                    dispatch(updateMultiLoci({ email: e.target.value }))
                  }
                  disabled={submitted}
                  // isInvalid={isQueue && checkValid ? !validEmail : false}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md="1">
              <Button
                disabled={isLoading || submitted}
                className="w-100"
                variant="primary"
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
                // disabled={
                // submitted ||
                // (!_associationFile && !select_qtls_samples && !qtlPublic) ||
                // select_dist.length <= 0 ||
                // select_dist < 1 ||
                // select_dist > 200 ||
                // (select_ref &&
                //   select_ref.length > 0 &&
                //   !/^rs\d+$/.test(select_ref))
                //   ||
                // (ldPublic && (!select_pop || select_pop.length <= 0))
                // }
              >
                Submit
              </Button>
            </Col>
            <Col md="1">
              <Button
                // disabled={submitted || loading.active}
                className="w-100"
                variant="secondary"
                type="button"
                onClick={() => {
                  dispatch(updateMultiLoci({ ...getInitialState().multiLoci }));
                }}
              >
                Reset All
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </div>
    </div>
  );
}
