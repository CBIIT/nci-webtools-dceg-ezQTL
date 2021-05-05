import React, { useContext, useState, useEffect } from 'react';
import { RootContext } from '../../../index';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadFile,
  getPublicGTEx,
  updateAlert,
  submitQueueMulti,
  updateMultiLoci,
} from '../../../services/actions';
import MultiForm from './qtls-multi-form';
const { v1: uuidv1 } = require('uuid');

export function QTLsMulti() {
  const dispatch = useDispatch();
  const {
    states,
    valid,
    email,
    submitted,
    isLoading,
    publicGTEx,
    attempt,
  } = useSelector((state) => state.multiLoci);
  const { getInitialState } = useContext(RootContext);

  // get publicGTEx
  useEffect(() => {
    if (!Object.keys(publicGTEx).length) dispatch(getPublicGTEx('multi'));
  }, [publicGTEx]);

  // handle files
  const [_associationFile, _setAssociationFile] = useState(['']);
  const [_quantificationFile, _setQuantificationFile] = useState(['']);
  const [_genotypeFile, _setGenotypeFile] = useState(['']);
  const [_LDFile, _setLDFile] = useState(['']);
  const [_gwasFile, _setGwasFile] = useState(['']);

  const [validEmail, setValidEmail] = useState(false);

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
    // add file placeholders
    setFile('qtl', '', states.length);
    setFile('ld', '', states.length);
    setFile('gwas', '', states.length);
    setFile('quantification', '', states.length);
    setFile('genotype', '', states.length);

    // add state
    dispatch(
      updateMultiLoci({
        states: [...states, getInitialState().multiLoci.states[0]],
      })
    );
  }

  function validateForm() {
    const re = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );

    setValidEmail(re.test(email));
    dispatch(updateMultiLoci({ attempt: true }));

    return re.test(email);
  }

  async function handleSubmit() {
    if (!valid) {
      return;
    }
    // generate request ids
    const requests = states.map((_, i) => uuidv1());

    // upload files
    await Promise.all(
      states.map((_, i) =>
        dispatch(
          uploadFile({
            associationFile: _associationFile[i],
            quantificationFile: _quantificationFile[i],
            genotypeFile: _genotypeFile[i],
            LDFile: _LDFile[i],
            gwasFile: _gwasFile[i],
            associationFileName: _associationFile[i]
              ? _associationFile[i].name
              : false,
            quantificationFileName: _quantificationFile[i]
              ? _quantificationFile[i].name
              : false,
            genotypeFileName: _genotypeFile[i] ? _genotypeFile[i].name : false,
            LDFileName: _LDFile[i] ? _LDFile[i].name : false,
            gwasFileName: _gwasFile[i] ? _gwasFile[i].name : false,
            request: requests[i],
          })
        )
      )
    );

    let paramsArr = states.map((state, i) => {
      const {
        select_qtls_samples,
        select_gwas_sample,
        select_pop,
        select_gene,
        recalculateAttempt,
        recalculatePop,
        recalculateGene,
        recalculateDist,
        recalculateRef,
        ldProject,
        qtlKey,
        ldKey,
        gwasKey,
        select_chromosome,
        qtlPublic,
        gwasPublic,
        ldPublic,
        jobName,
        locusInformation,
      } = state;

      return locusInformation.map((locusInfoRow, locusIndex) => {
        const { select_dist, select_ref, select_position } = locusInfoRow;
        return {
          jobName: jobName || `ezQTL ${i + 1} - ${locusIndex}`,
          request: `${requests[i]}-${locusIndex}`,
          email: email,
          isQueue: true,
          submitted: true,
          associationFile:
            (_associationFile[i] && _associationFile[i].name) || false,
          quantificationFile:
            (_quantificationFile[i] && _quantificationFile[i].name) || false,
          genotypeFile: (_genotypeFile[i] && _genotypeFile[i].name) || false,
          gwasFile: (_gwasFile[i] && _gwasFile[i].name) || false,
          LDFile: (_LDFile[i] && _LDFile[i].name) || false,

          select_qtls_samples,
          select_gwas_sample,
          select_pop,
          select_gene,
          select_dist,
          select_ref,
          recalculateAttempt,
          recalculatePop,
          recalculateGene,
          recalculateDist,
          recalculateRef,
          ldProject: ldProject.value,
          qtlPublic,
          gwasPublic,
          ldPublic,
          qtlKey: qtlKey || false,
          ldKey: ldKey || false,
          gwasKey: gwasKey || false,
          select_chromosome: select_chromosome.value,
          select_position: select_position,
        };
      });
    });

    dispatch(
      submitQueueMulti({
        paramsArr: paramsArr.flat(),
        requests: requests,
        email: email,
      })
    );
  }

  return (
    <div className="px-2">
      {states.map((_, index) => (
        <div className="mb-3" key={`multi-form-${index}`}>
          <MultiForm
            stateIndex={index}
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
            <Button
              title="Add Locus"
              aria-label="Add Locus"
              variant="success"
              block
              disabled={submitted}
              onClick={() => addForm()}
            >
              + Add Locus
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
                  isInvalid={attempt ? !validEmail : false}
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
                  if (validateForm()) handleSubmit();
                }}
                disabled={submitted}
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
                  dispatch(
                    updateMultiLoci({
                      ...getInitialState().multiLoci,
                      publicGTEx: publicGTEx,
                    })
                  );
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
