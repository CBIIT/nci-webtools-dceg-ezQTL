import React, { useContext, useState, useEffect, useRef } from 'react';
import { RootContext } from '../../../index';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  qtlsGWASLocusQCCalculation,
  uploadFile,
  updateQTLsGWAS,
  getPublicGTEx,
  updateAlert,
  submitQueue,
} from '../../../services/actions';
import Select from '../../controls/select/select';
import Accordions from '../../controls/accordions/accordions';
import { PopulationSelect } from '../../controls/population-select/population-select';
const { v1: uuidv1 } = require('uuid');

function LocusInfo({
  locusIndex,
  attempt,
  setLocusValid,
  _LDFile,
  _associationFile,
  _gwasFile,
}) {
  const dispatch = useDispatch();
  const { getInitialState } = useContext(RootContext);
  const {
    locusInformation,
    submitted,
    qtlPublic,
    ldPublic,
    gwasPublic,
  } = useSelector((state) => state.qtlsGWAS);
  const {
    select_dist,
    select_position,
    select_ref,
    select_chromosome,
  } = locusInformation[locusIndex];

  // check form validity for locus info params
  useEffect(() => {
    if (
      !select_dist ||
      select_dist < 1 ||
      select_dist > 200 ||
      (select_ref && !/^rs\d+$/.test(select_ref)) ||
      (ldPublic && !select_position) ||
      (_LDFile && !_gwasFile && !_associationFile && !select_ref) ||
      ((ldPublic || qtlPublic || gwasPublic) &&
        Object.entries(select_chromosome).length < 2)
    ) {
      setLocusValid(false);
    } else {
      setLocusValid(true);
    }
  }, [
    ldPublic,
    qtlPublic,
    gwasPublic,
    select_dist,
    select_ref,
    select_position,
    select_chromosome,
    _LDFile,
    _associationFile,
    _gwasFile,
  ]);

  function mergeLocusInfo(data) {
    let newLocusInfo = locusInformation.slice();
    newLocusInfo[locusIndex] = { ...newLocusInfo[locusIndex], ...data };
    dispatch(updateQTLsGWAS({ locusInformation: newLocusInfo }));
  }

  function addLocusInfo() {
    let newLocusInfo = locusInformation.slice();
    newLocusInfo = [
      ...newLocusInfo,
      ...getInitialState().qtlsGWAS.locusInformation,
    ];
    dispatch(updateQTLsGWAS({ locusInformation: newLocusInfo }));
  }

  function removeLocusInfo() {
    let newLocusInfo = locusInformation.slice();
    newLocusInfo.splice(locusIndex, 1);
    dispatch(updateQTLsGWAS({ locusInformation: newLocusInfo }));
  }

  return (
    <>
      <div className="border rounded p-2 mb-1">
        <Form.Row>
          {locusIndex != 0 && (
            <Col className="d-flex justify-content-end">
              <Button
                className="text-danger p-0"
                style={{ 'text-decoration': 'underline', fontSize: '.8rem' }}
                variant="link"
                size="sm"
                onClick={() => removeLocusInfo()}
              >
                Remove
              </Button>
            </Col>
          )}
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Label className="mb-0">
              cis-QTL Distance <span style={{ color: 'red' }}>*</span>
              <small>
                <i>(+/- Kb up to 5Mb)</i>
              </small>
            </Form.Label>
            <Form.Control
              title="cis-QTL Distance Input"
              aria-label="cis-QTL Distance Input"
              type="number"
              min="1"
              max="2000"
              id="qtls-distance-input"
              disabled={submitted}
              onChange={(e) => mergeLocusInfo({ select_dist: e.target.value })}
              value={select_dist}
              isInvalid={(attempt && select_dist < 1) || select_dist > 200}
            />
            <Form.Control.Feedback type="invalid">
              Enter distance between 1 and 200Kb.
            </Form.Control.Feedback>
          </Col>
        </Form.Row>
        {qtlPublic || gwasPublic || ldPublic ? (
          <>
            <Form.Row>
              <Col>
                <Select
                  className="mb-0"
                  disabled={submitted}
                  id="chromosome"
                  label={
                    <>
                      Chromosome <span style={{ color: 'red' }}>*</span>
                    </>
                  }
                  placeholder={'Select Chromosome'}
                  value={select_chromosome}
                  options={[
                    ...Array.from({ length: 22 }, (_, i) => ({
                      value: i + 1,
                      label: i + 1,
                    })),
                    {
                      value: 'X',
                      label: 'X',
                    },
                    {
                      value: 'Y',
                      label: 'Y',
                    },
                  ]}
                  onChange={(chromosome) => {
                    mergeLocusInfo({ select_chromosome: chromosome });
                  }}
                />
                {attempt && Object.entries(select_chromosome).length == 0 && (
                  <div className="text-danger" style={{ fontSize: '80%' }}>
                    Please select a chromosome
                  </div>
                )}
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Label className="mb-0">
                  Position <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  title="LD Reference Position Input"
                  aria-label="LD Refereence Position Input"
                  id="select_position"
                  disabled={submitted}
                  onChange={(e) =>
                    mergeLocusInfo({ select_position: e.target.value })
                  }
                  placeholder="e.g. 42743496"
                  value={select_position}
                  isInvalid={attempt ? !select_position : false}
                />
                <Form.Control.Feedback type="invalid">
                  Enter a valid position
                </Form.Control.Feedback>
              </Col>
            </Form.Row>
          </>
        ) : (
          <Form.Row>
            <Col>
              <Form.Label className="mb-0">
                SNP{' '}
                {_LDFile && !_gwasFile && !_associationFile && (
                  <span style={{ color: 'red' }}>* </span>
                )}
                <small>
                  <i>(Default: lowest GWAS P-value SNP)</i>
                </small>
              </Form.Label>
              <Form.Control
                title="LD Reference SNP Input"
                aria-label="LD Refereence SNP Input"
                id="qtls-snp-input"
                disabled={submitted}
                onChange={(e) => mergeLocusInfo({ select_ref: e.target.value })}
                value={select_ref ? select_ref : ''}
                isInvalid={
                  attempt &&
                  ((select_ref &&
                    !_gwasFile &&
                    !_associationFile &&
                    !/^rs\d+$/.test(select_ref)) ||
                    (_LDFile && !select_ref))
                }
              />
              <Form.Control.Feedback type="invalid">
                Enter a valid RS number
              </Form.Control.Feedback>
            </Col>
          </Form.Row>
        )}
      </div>

      <Row>
        {locusIndex == locusInformation.length - 1 && (
          <Col className="d-flex justify-content-end">
            <Button
              className="p-0"
              variant="link"
              title="Add Locus Information"
              aria-label="Add Locus Information"
              onClick={() => addLocusInfo()}
              disabled={submitted}
            >
              + Add Locus
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
}

export function QTLsGWASForm() {
  const dispatch = useDispatch();
  const { getInitialState } = useContext(RootContext);

  const quantificationFileControl = useRef(null);
  const genotypeFileControl = useRef(null);

  const [_associationFile, _setAssociationFile] = useState('');
  const [_quantificationFile, _setQuantificationFile] = useState('');
  const [_genotypeFile, _setGenotypeFile] = useState('');
  const [_LDFile, _setLDFile] = useState('');
  const [_gwasFile, _setGwasFile] = useState('');

  const [tissueOnly, viewTissueOnly] = useState(false);
  const [phenotypeOnly, viewPhenotypeOnly] = useState(false);
  const [useQuantification, toggleQuantification] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [attempt, setAttempt] = useState(false);
  const [valid, setValid] = useState(false);
  const [locusValid, setLocusValid] = useState(false);

  const {
    select_qtls_samples,
    select_gwas_sample,
    associationFile,
    quantificationFile,
    genotypeFile,
    gwasFile,
    LDFile,
    request,
    select_pop,
    select_gene,
    locusInformation,
    recalculateAttempt,
    recalculatePop,
    recalculateGene,
    recalculateDist,
    recalculateRef,
    submitted,
    isLoading,
    isError,
    publicGTEx,
    genome,
    genomeOptions,
    qtlProject,
    qtlProjectOptions,
    gwasProject,
    gwasProjectOptions,
    ldProject,
    ldProjectOptions,
    xQtl,
    xQtlOptions,
    tissue,
    tissueOptions,
    phenotype,
    phenotypeOptions,
    isQueue,
    jobName,
    email,
    qtlPublic,
    gwasPublic,
    ldPublic,
    qtlKey,
    ldKey,
    gwasKey,
  } = useSelector((state) => state.qtlsGWAS);

  useEffect(() => _setAssociationFile(associationFile), [associationFile]);
  useEffect(() => _setQuantificationFile(quantificationFile), [
    quantificationFile,
  ]);
  useEffect(() => _setGenotypeFile(genotypeFile), [genotypeFile]);
  useEffect(() => _setLDFile(LDFile), [LDFile]);
  useEffect(() => _setGwasFile(gwasFile), [gwasFile]);
  useEffect(() => {
    if (select_qtls_samples || select_gwas_sample) toggleQuantification(true);
    else toggleQuantification(false);
  }, [select_qtls_samples, select_gwas_sample]);
  useEffect(() => {
    if (!Object.keys(publicGTEx).length) dispatch(getPublicGTEx());
  }, [publicGTEx]);
  // inital population of public params
  useEffect(() => {
    if (Object.keys(publicGTEx).length && !genomeOptions.length)
      getGenomeOptions();
  }, [publicGTEx, genomeOptions]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && genome.value)
      populatePublicParameters();
  }, [genome.value]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && qtlProject && qtlPublic)
      handleQtlProject(qtlProject);
  }, [qtlPublic, tissueOnly]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && gwasProject && gwasPublic)
      handleGwasProject(gwasProject);
  }, [gwasPublic, phenotypeOnly]);

  // check form validity for file uploads
  useEffect(() => {
    if (
      (!select_qtls_samples &&
        !_associationFile &&
        !_gwasFile &&
        !_LDFile &&
        !qtlPublic &&
        !gwasPublic &&
        !ldPublic) ||
      (_quantificationFile && !_genotypeFile) ||
      (!_quantificationFile && _genotypeFile)
    ) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [
    select_qtls_samples,
    _associationFile,
    _gwasFile,
    _LDFile,
    _quantificationFile,
    _genotypeFile,
    qtlPublic,
    gwasPublic,
    ldPublic,
    select_pop,
  ]);

  // automatically enable/disable queue if more locus info panels are added
  useEffect(() => {
    if (locusInformation.length > 1)
      dispatch(updateQTLsGWAS({ isQueue: true }));
  }, [locusInformation]);

  function getGenomeOptions() {
    const data = publicGTEx['cis-QTL dataset'];
    const genomeOptions = [
      ...new Set(data.map((row) => row.Genome_build)),
    ].map((genome) => ({ value: genome, label: genome }));

    dispatch(
      updateQTLsGWAS({
        genome: genomeOptions[0],
        genomeOptions: genomeOptions,
      })
    );
  }

  function getProjectOptions(data) {
    return [
      ...new Set(
        data
          .filter((row) => row['Genome_build'] == genome.value)
          .map((row) => row['Project'])
      ),
    ].map((project) => ({ value: project, label: project }));
  }

  function getXqtlOptions(data, project) {
    return [
      ...new Set(
        data
          .filter(
            (row) => row.Genome_build == genome.value && row.Project == project
          )
          .map((row) => row.xQTL)
      ),
    ].map((xQtl) => ({ value: xQtl, label: xQtl }));
  }

  function getTissueOptions(data, project, xQtl) {
    return !tissueOnly
      ? data
          .filter(
            (row) =>
              row['Genome_build'] == genome.value &&
              row['Project'] == project &&
              row['xQTL'] == xQtl
          )
          .map((row) => ({ value: row.Tissue, label: row.Tissue }))
      : data
          .filter((row) => row['Genome_build'] == genome.value)
          .map((row) => ({ value: row.Tissue, label: row.Full_Name }));
  }

  function getPhenotypeOptions(data, project) {
    return !phenotypeOnly
      ? data
          .filter(
            (row) =>
              row['Genome_build'] == genome.value && row['Project'] == project
          )
          .map((row) => ({ value: row.Phenotype, label: row.Phenotype }))
      : data
          .filter((row) => row['Genome_build'] == genome.value)
          .map((row) => ({ value: row.Phenotype, label: row.Full_Name }));
  }

  function populatePublicParameters() {
    const qtlData = publicGTEx['cis-QTL dataset'];
    const ldData = publicGTEx['LD dataset'];
    const gwasData = publicGTEx['GWAS dataset'];

    const qtlProjectOptions = getProjectOptions(qtlData);
    const xQtlOptions = getXqtlOptions(qtlData, qtlProjectOptions[0].value);
    const tissueOptions = getTissueOptions(
      qtlData,
      qtlProjectOptions[0].value,
      xQtlOptions[0].value
    );

    const ldProjectOptions = getProjectOptions(ldData);

    const gwasProjectOptions = getProjectOptions(gwasData);
    const phenotypeOptions = gwasProjectOptions.length
      ? getPhenotypeOptions(gwasData, gwasProjectOptions[0].value)
      : [];

    dispatch(
      updateQTLsGWAS({
        qtlProject: qtlProjectOptions[0],
        ldProject: ldProjectOptions[0],
        xQtl: xQtlOptions[0],
        tissue: tissueOptions[0],
        gwasProject: gwasProjectOptions[0],
        phenotype: phenotypeOptions[0] || '',

        qtlProjectOptions: qtlProjectOptions,
        ldProjectOptions: ldProjectOptions,
        xQtlOptions: xQtlOptions,
        tissueOptions: tissueOptions,
        gwasProjectOptions: gwasProjectOptions,
        phenotypeOptions: phenotypeOptions || [],
      })
    );
  }

  function handleQtlProject(project) {
    const data = publicGTEx['cis-QTL dataset'];
    const xQtlOptions = getXqtlOptions(data, project.value);
    const tissueOptions = getTissueOptions(
      data,
      project.value,
      xQtlOptions[0].value
    );
    const qtlKey = tissueOnly
      ? data
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Tissue == tissueOptions[0].value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          )
      : data
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Project == project.value &&
              row.xQTL == xQtlOptions[0].value &&
              row.Tissue == tissueOptions[0].value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          );

    dispatch(
      updateQTLsGWAS({
        qtlProject: project,
        xQtl: xQtlOptions[0],
        xQtlOptions: xQtlOptions,
        tissue: tissueOptions[0],
        tissueOptions: tissueOptions,
        qtlKey: qtlKey,
      })
    );
  }

  function handleGwasProject(project) {
    const data = publicGTEx['GWAS dataset'];
    const phenotypeOptions = getPhenotypeOptions(data, project.value);
    const gwasKey = phenotypeOnly
      ? data
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Phenotype == phenotypeOptions[0].value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          )
      : data
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Project == project.value &&
              row.Phenotype == phenotypeOptions[0].value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          );

    dispatch(
      updateQTLsGWAS({
        gwasProject: project,
        phenotype: phenotypeOptions[0],
        phenotypeOptions: phenotypeOptions,
        gwasKey: gwasKey,
      })
    );
  }

  function handleLdProject(project) {
    dispatch(updateQTLsGWAS({ ldProject: project }));
  }

  // qtl type
  function handleXqtl(xQtl) {
    const data = publicGTEx['cis-QTL dataset'];
    const tissueOptions = getTissueOptions(data, qtlProject.value, xQtl.value);
    const qtlKey = data
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == qtlProject.value &&
          row.xQTL == xQtl.value &&
          row.Tissue == tissueOptions[0].value
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');

    dispatch(
      updateQTLsGWAS({
        xQtl: xQtl,
        tissue: tissueOptions[0],
        tissueOptions: tissueOptions,
        qtlKey: qtlKey,
      })
    );
  }

  function handleTissue(tissue) {
    const qtlKey = tissueOnly
      ? publicGTEx['cis-QTL dataset']
          .filter(
            (row) =>
              row.Genome_build == genome.value && row.Tissue == tissue.value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          )
      : publicGTEx['cis-QTL dataset']
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Project == qtlProject.value &&
              row.xQTL == xQtl.value &&
              row.Tissue == tissue.value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          );

    dispatch(updateQTLsGWAS({ tissue: tissue, qtlKey: qtlKey }));
  }

  function handlePhenotype(phenotype) {
    const gwasKey = phenotypeOnly
      ? publicGTEx['GWAS dataset']
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Phenotype == phenotype.value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          )
      : publicGTEx['GWAS dataset']
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Project == gwasProject.value &&
              row.Phenotype == phenotype.value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          );

    dispatch(updateQTLsGWAS({ phenotype: phenotype, gwasKey: gwasKey }));
  }

  const handleReset = () => {
    window.location.hash = '#/qtls';

    dispatch(
      updateQTLsGWAS({ ...getInitialState().qtlsGWAS, publicGTEx: publicGTEx })
    );
    dispatch(updateAlert(getInitialState().alert));
    _setAssociationFile('');
    _setQuantificationFile('');
    _setGenotypeFile('');
    _setLDFile('');
    _setGwasFile('');
    viewTissueOnly(false);
    viewPhenotypeOnly(false);
    setAttempt(false);
  };

  function validateEmail() {
    const re = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    const check = re.test(email);
    setValidEmail(check);
    setAttempt(true);

    return isQueue ? check : true;
  }

  async function handleSubmit() {
    if (!valid || !locusValid) {
      return;
    }
    setAttempt(false);
    const request = uuidv1();

    await dispatch(
      uploadFile({
        associationFile: _associationFile,
        quantificationFile: _quantificationFile,
        genotypeFile: _genotypeFile,
        LDFile: _LDFile,
        gwasFile: _gwasFile,
        associationFileName: _associationFile ? _associationFile.name : false,
        quantificationFileName: _quantificationFile
          ? _quantificationFile.name
          : false,
        genotypeFileName: _genotypeFile ? _genotypeFile.name : false,
        LDFileName: _LDFile ? _LDFile.name : false,
        gwasFileName: _gwasFile ? _gwasFile.name : false,
        request,
      })
    );

    const params = locusInformation.map((locusInfo, locusIndex) => {
      const {
        select_dist,
        select_ref,
        select_position,
        select_chromosome,
      } = locusInfo;

      const ldKey =
        ldPublic && Object.entries(select_chromosome).length
          ? ldProject.value == '1000genome'
            ? publicGTEx['LD dataset']
                .filter(
                  (row) =>
                    row.Genome_build == genome.value &&
                    row.Project == ldProject.value &&
                    row.Chromosome == select_chromosome.value
                )[0]
                .Biowulf_full_path.replace(
                  '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
                  ''
                )
            : true
          : false;

      dispatch(updateQTLsGWAS({ ldKey: ldKey }));

      return {
        jobName: jobName
          ? `${jobName} - ${locusIndex}`
          : `ezQTL - ${locusIndex}`,
        request: `${request}-${locusIndex}`,
        email: email,
        isQueue: true,
        submitted: true,
        associationFile: (_associationFile && _associationFile.name) || false,
        quantificationFile:
          (_quantificationFile && _quantificationFile.name) || false,
        genotypeFile: (_genotypeFile && _genotypeFile.name) || false,
        gwasFile: (_gwasFile && _gwasFile.name) || false,
        LDFile: (_LDFile && _LDFile.name) || false,
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
        gwasPhenotype: phenotype.value,
        qtlPublic,
        gwasPublic,
        ldPublic,
        qtlKey: qtlKey || false,
        ldKey: ldKey,
        gwasKey: gwasKey || false,
        select_chromosome: select_chromosome.value || false,
        select_position: select_position,
        genome_build: genome.value,
      };
    });

    if (isQueue) {
      dispatch(
        submitQueue({
          params:
            params.length > 1 ? params : { ...params[0], request: request },
          request: request,
          multi: params.length > 1 ? true : false,
        })
      );
    } else {
      dispatch(qtlsGWASLocusQCCalculation({ ...params[0], request: request }));
    }
  }

  const accordionComponents = [
    {
      title: 'Association Data',
      component: (
        <>
          <Row>
            <Form.Group className="col-sm-12">
              <div className="d-flex">
                <Form.Label className="mb-0 mr-auto">
                  Association (QTL) Data
                </Form.Label>
                <Form.Check
                  title="Association (QTL) Public Data Checkbox"
                  disabled={submitted || select_qtls_samples}
                  inline
                  id="qtlSource"
                  label="Public"
                  type="checkbox"
                  checked={qtlPublic}
                  onChange={(_) => {
                    dispatch(
                      updateQTLsGWAS({
                        qtlPublic: !qtlPublic,
                        ...(!qtlPublic && { select_ref: false }),
                      })
                    );
                    _setAssociationFile('');
                  }}
                />
              </div>
              {qtlPublic ? (
                <div className="mt-2">
                  <Row>
                    <Col>
                      <Form.Check
                        title="Association (QTL) Public Data Tissue Only Checkbox"
                        id="tissueOnly"
                        label="Tissue Only"
                        type="checkbox"
                        disabled={
                          submitted ||
                          isLoading ||
                          !Object.keys(publicGTEx).length
                        }
                        checked={tissueOnly}
                        onChange={(_) => {
                          viewTissueOnly(!tissueOnly);
                        }}
                      />
                    </Col>
                  </Row>
                  {!tissueOnly && (
                    <>
                      <Row>
                        <Col>
                          <Select
                            disabled={isLoading || tissueOnly || submitted}
                            id="project"
                            label="Project"
                            value={qtlProject}
                            options={qtlProjectOptions}
                            onChange={handleQtlProject}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Select
                            disabled={isLoading || tissueOnly || submitted}
                            id="qtlType"
                            label="QTL Type"
                            value={xQtl}
                            options={xQtlOptions}
                            onChange={handleXqtl}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row>
                    <Col>
                      <Select
                        disabled={isLoading || submitted}
                        id="tissue"
                        label="Tissue"
                        value={tissue}
                        options={tissueOptions}
                        onChange={handleTissue}
                      />
                    </Col>
                  </Row>
                </div>
              ) : (
                <Form.File
                  title="Association (QTL) Data User File Upload Input"
                  id="qtls-association-file"
                  disabled={submitted || select_qtls_samples}
                  key={_associationFile}
                  label={
                    _associationFile
                      ? _associationFile.name ||
                        _associationFile.filename ||
                        _associationFile
                      : select_qtls_samples
                      ? 'MX2.eQTL.txt'
                      : 'Choose File'
                  }
                  onChange={(e) => {
                    _setAssociationFile(e.target.files[0]);
                  }}
                  // accept=".tsv, .txt"
                  // isInvalid={
                  //   attempt ? !_associationFile && !select_qtls_samples : false
                  // }
                  // feedback="Please upload a data file"
                  custom
                />
              )}
            </Form.Group>
            <Form.Group className="col-sm-12">
              <div className="d-flex">
                <Form.Label className="mb-0 mr-auto">GWAS Data</Form.Label>
                <Form.Check
                  title="GWAS Public Data Checkbox"
                  disabled={submitted || select_qtls_samples}
                  inline
                  id="gwasSource"
                  label="Public"
                  type="checkbox"
                  checked={gwasPublic}
                  onChange={(_) => {
                    dispatch(
                      updateQTLsGWAS({
                        gwasPublic: !gwasPublic,
                        ...(!ldPublic && { select_ref: false }),
                      })
                    );
                    _setGwasFile('');
                  }}
                />
              </div>
              {gwasPublic ? (
                <div className="mt-2">
                  <Row>
                    <Col>
                      <Form.Check
                        title="GWAS Public Data Phenotype Only Checkbox"
                        id="phenotypeOnly"
                        label="Phenotype Only"
                        type="checkbox"
                        disabled={
                          submitted ||
                          isLoading ||
                          !Object.keys(publicGTEx).length
                        }
                        checked={phenotypeOnly}
                        onChange={(_) => {
                          viewPhenotypeOnly(!phenotypeOnly);
                        }}
                      />
                    </Col>
                  </Row>
                  {!phenotypeOnly && (
                    <Row>
                      <Col>
                        <Select
                          disabled={
                            submitted ||
                            isLoading ||
                            phenotypeOnly ||
                            !gwasProjectOptions.length
                          }
                          id="gwasProject"
                          label="Project"
                          value={gwasProject}
                          options={gwasProjectOptions}
                          onChange={handleGwasProject}
                        />
                      </Col>
                    </Row>
                  )}

                  <Row>
                    <Col>
                      <Select
                        disabled={
                          submitted || isLoading || !phenotypeOptions.length
                        }
                        id="gwasPhenotype"
                        label="Phenotype"
                        value={phenotype}
                        options={phenotypeOptions}
                        onChange={handlePhenotype}
                      />
                    </Col>
                  </Row>
                </div>
              ) : (
                <Form.File
                  title="GWAS Data User File Upload Input"
                  id="qtls-gwas-file"
                  disabled={submitted || select_gwas_sample}
                  key={_gwasFile}
                  label={
                    _gwasFile
                      ? _gwasFile.name || _gwasFile.filename || _gwasFile
                      : select_gwas_sample
                      ? 'MX2.GWAS.rs.txt'
                      : 'Choose File'
                  }
                  onChange={(e) => {
                    _setGwasFile(e.target.files[0]);
                  }}
                  // accept=".tsv, .txt"
                  // isInvalid={
                  //   attempt ? !_gwasFile && !select_qtls_samples : false
                  // }
                  // feedback="Please upload a data file"
                  custom
                />
              )}
              <Form.Text className="text-muted">
                <i>Upload locus specific region, &le; 5Mb size</i>
              </Form.Text>
            </Form.Group>
          </Row>
          <Row>
            <Col>
              <Button
                variant="link"
                onClick={() => toggleQuantification(!useQuantification)}
              >
                {useQuantification ? '- Remove ' : '+ Add '} QTL Raw Data
              </Button>
            </Col>
          </Row>
          {useQuantification && (
            <>
              <Row>
                <Form.Group className="col-sm-12">
                  <Form.Label className="mb-0">Quantification Data</Form.Label>
                  <Form.File
                    title="Quantification Data User File Upload Input"
                    ref={quantificationFileControl}
                    id="qtls-quantification-file"
                    disabled={submitted || select_qtls_samples}
                    key={_quantificationFile}
                    label={
                      _quantificationFile
                        ? _quantificationFile.name ||
                          _quantificationFile.filename ||
                          _quantificationFile
                        : select_qtls_samples
                        ? 'MX2.quantification.txt'
                        : 'Choose File'
                    }
                    custom
                    onChange={(e) => {
                      _setQuantificationFile(e.target.files[0]);
                    }}
                    // accept=".tsv, .txt"
                    isInvalid={
                      attempt &&
                      useQuantification &&
                      !_quantificationFile &&
                      _genotypeFile
                        ? true
                        : false
                    }
                    feedback="Please input accompanying Quantification Data File with
          Genotype Data File."
                  />
                </Form.Group>
                <Form.Group className="col-sm-12">
                  <Form.Label className="mb-0">Genotype Data</Form.Label>
                  <Form.File
                    title="Genotype Data User File Upload Input"
                    ref={genotypeFileControl}
                    id="qtls-genotype-file"
                    disabled={submitted || select_qtls_samples}
                    key={_genotypeFile}
                    label={
                      _genotypeFile
                        ? _genotypeFile.name ||
                          _genotypeFile.filename ||
                          _genotypeFile
                        : select_qtls_samples
                        ? 'MX2.genotyping.txt'
                        : 'Choose File'
                    }
                    onChange={(e) => {
                      _setGenotypeFile(e.target.files[0]);
                    }}
                    // accept=".tsv, .txt"
                    custom
                    isInvalid={
                      attempt &&
                      useQuantification &&
                      _quantificationFile &&
                      !_genotypeFile
                        ? true
                        : false
                    }
                    feedback="Please input accompanying Genotype Data File with
          Quantification Data File."
                  />
                </Form.Group>
              </Row>
            </>
          )}
        </>
      ),
    },
    {
      title: 'LD Information',
      component: (
        <Row>
          <Form.Group className="col-sm-12 mb-0">
            <div className="d-flex">
              <Form.Label className="mb-0 mr-auto">
                LD Data
                {/* <span style={{ color: 'red' }}>*</span> */}
              </Form.Label>
              <Form.Check
                disabled={submitted || select_qtls_samples}
                inline
                id="ldSource"
                label="Public"
                type="checkbox"
                checked={ldPublic}
                onChange={(_) => {
                  dispatch(
                    updateQTLsGWAS({
                      ldPublic: !ldPublic,
                      select_pop: false,
                      ...(!ldPublic && { select_ref: false }),
                      ...(ldPublic && { ldKey: '' }),
                    })
                  );
                  _setLDFile('');
                }}
              />
            </div>
            {ldPublic ? (
              <div>
                <Form.Row>
                  <Col>
                    <Select
                      disabled={isLoading || submitted}
                      id="ldProject"
                      label="Project"
                      value={ldProject}
                      options={ldProjectOptions}
                      onChange={handleLdProject}
                    />
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col>
                    {ldProject.value != 'UKBB' ? (
                      <>
                        <Form.Label className="mb-0">
                          Population <span style={{ color: 'red' }}>*</span>{' '}
                        </Form.Label>
                        <PopulationSelect
                          id="qtls-results-population-input-asdf"
                          mergeState={(data) => dispatch(updateQTLsGWAS(data))}
                          disabled={
                            submitted || !ldPublic || ldProject.value == 'UKBB'
                          }
                        />
                      </>
                    ) : (
                      <Select
                        disabled={true}
                        id="population"
                        label="Population"
                        value={{ label: '(EUR) European', value: '' }}
                        options={[]}
                      />
                    )}
                  </Col>
                </Form.Row>
              </div>
            ) : (
              <>
                <Form.File
                  id="qtls-ld-file"
                  disabled={submitted || select_qtls_samples}
                  key={_LDFile}
                  label={
                    _LDFile
                      ? _LDFile.name || _LDFile.filename || _LDFile
                      : select_qtls_samples
                      ? 'MX2.LD.gz'
                      : 'Choose File'
                  }
                  onChange={(e) => {
                    _setLDFile(e.target.files[0]);
                  }}
                  // accept=".tsv, .txt"
                  // isInvalid={attempt ? !_LDFile && !select_qtls_samples : false}
                  // feedback="Please upload a data file"
                  custom
                />
              </>
            )}
          </Form.Group>
        </Row>
      ),
    },
    {
      title: 'Locus Information',
      component: locusInformation.map((_, i) => (
        <LocusInfo
          key={`locusInfo-${i}`}
          locusIndex={i}
          attempt={attempt}
          setLocusValid={setLocusValid}
          _LDFile={_LDFile}
          _associationFile={_associationFile}
          _gwasFile={_gwasFile}
        />
      )),
    },
  ];

  return (
    <Form>
      <Row>
        <Col>
          <Select
            className="border rounded p-2"
            disabled={!genomeOptions.length || select_qtls_samples || submitted}
            id="genomeBuild"
            label="Genome Build"
            value={genome}
            options={genomeOptions}
            onChange={(genome) => dispatch(updateQTLsGWAS({ genome: genome }))}
          />
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <Link
            to={`/qtls/sample`}
            className="font-14"
            style={
              submitted
                ? {
                    pointerEvents: 'none',
                    color: 'gray',
                  }
                : {}
            }
          >
            <span className="sr-only">Load Sample Data</span>
            Load Sample Data
          </Link>
          {/* <Button
            className="p-0 font-14"
            variant="link"
            onClick={() => {
              _setGwasFile('');
              if (!select_qtls_samples) {
                dispatch(
                  updateQTLsGWAS({
                    select_qtls_samples: true,
                    select_gwas_sample: true,
                    qtlPublic: false,
                    gwasPublic: false,
                    ldPublic: false,
                    select_pop: false,
                    genome: { value: 'GRCh37', label: 'GRCh37' },
                  })
                );
              } else {
                dispatch(
                  updateQTLsGWAS({
                    select_qtls_samples: false,
                    select_gwas_sample: false,
                  })
                );
              }
            }}
            disabled={submitted}
          >
            {!select_gwas_sample ? 'Load' : 'Unload'} Sample Data
          </Button> */}
        </Col>

        <Col sm="6" className="d-flex">
          <a
            className="font-14 ml-auto"
            href="assets/files/MX2.examples.gz"
            download
          >
            Download Sample Data
          </a>
        </Col>
      </Row>
      <Accordions components={accordionComponents} bodyClass="p-2" />
      <div className="border rounded p-2 mt-2">
        <Row>
          <Col>
            <Form.Group controlId="toggleQueue" className="mb-0">
              <Form.Check inline>
                <Form.Check.Input
                  className="mr-0"
                  title="Choose Queued Submission Checkbox"
                  type="checkbox"
                  disabled={submitted || locusInformation.length > 1}
                  checked={isQueue}
                  onChange={(_) => {
                    dispatch(updateQTLsGWAS({ isQueue: !isQueue }));
                  }}
                />
              </Form.Check>
              <Form.Label className="mr-auto">
                Submit this job to a Queue
              </Form.Label>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="jobName" className="mb-2">
              <Form.Control
                title="Job Name Input"
                aria-label="Job Name Input"
                placeholder="Job Name"
                size="sm"
                value={jobName}
                type="text"
                onChange={(e) =>
                  dispatch(updateQTLsGWAS({ jobName: e.target.value }))
                }
                disabled={!isQueue || submitted}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Control
                title="Queued Submission Email Input"
                aria-label="Queued Submission Email Input"
                placeholder="Enter Email"
                size="sm"
                value={email}
                type="email"
                onChange={(e) =>
                  dispatch(updateQTLsGWAS({ email: e.target.value }))
                }
                disabled={!isQueue || submitted}
                isInvalid={isQueue && attempt ? !validEmail : false}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                <i>
                  Note: if sending to queue, when computation is completed, a
                  notification will be sent to the e-mail entered above.
                </i>
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </div>
      <Row className="mt-2">
        <Col sm="6">
          <Button
            // disabled={loading.active}
            className="w-100"
            variant={isError ? 'danger' : 'secondary'}
            onClick={() => handleReset()}
            disabled={submitted && isLoading}
          >
            Reset
          </Button>
        </Col>
        <Col sm="6">
          <Button
            // disabled={submitted || loading.active}
            className="w-100"
            variant="primary"
            type="button"
            onClick={() => {
              if (validateEmail()) handleSubmit();
            }}
            disabled={submitted || isLoading}
          >
            {isQueue ? 'Submit' : 'Calculate'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
