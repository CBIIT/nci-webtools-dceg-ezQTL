import React, { useContext, useState, useEffect, useRef } from 'react';
import { RootContext } from '../../../index';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import {
  qtlsGWASCalculation,
  uploadFile,
  updateQTLsGWAS,
  getPublicGTEx,
} from '../../../services/actions';
import Select from '../../controls/select/select';
const { v1: uuidv1 } = require('uuid');

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
  const [showQuantificationTooltip, setShowQuantificationTooltip] = useState(
    false
  );
  const [showGenotypeTooltip, setShowGenotypeTooltip] = useState(false);
  const [qtlPublic, setQtlPublic] = useState(false);
  const [gwasPublic, setGwasPublic] = useState(false);
  const [ldPublic, setLdPublic] = useState(false);
  const [tissueOnly, viewTissueOnly] = useState(false);
  const [phenotypeOnly, viewPhenotypeOnly] = useState(false);

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
    select_dist,
    select_ref,
    recalculateAttempt,
    recalculatePop,
    recalculateGene,
    recalculateDist,
    recalculateRef,
    submitted,
    isLoading,
    isError,
    publicGTEx,
    publicLoading,
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
    chromosome,
    range,
  } = useSelector((state) => state.qtlsGWAS);

  useEffect(() => _setAssociationFile(associationFile), [associationFile]);
  useEffect(() => _setQuantificationFile(quantificationFile), [
    quantificationFile,
  ]);
  useEffect(() => _setGenotypeFile(genotypeFile), [genotypeFile]);
  useEffect(() => _setLDFile(LDFile), [LDFile]);
  useEffect(() => _setGwasFile(gwasFile), [gwasFile]);
  useEffect(() => {
    if (!Object.keys(publicGTEx).length) dispatch(getPublicGTEx());
  }, [publicGTEx]);
  // inital population of public params
  useEffect(() => {
    if (Object.keys(publicGTEx).length && !genomeOptions.length)
      getGenomeOptions();
  }, [publicGTEx, genomeOptions]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && genome) populatePublicParameters();
  }, [genome]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && qtlProject)
      handleQtlProject(qtlProject);
  }, [tissueOnly]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && gwasProject)
      handleGwasProject(gwasProject);
  }, [phenotypeOnly]);

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
        genome: genome,
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

    dispatch(
      updateQTLsGWAS({
        qtlProject: project,
        tissue: tissueOptions[0],
        tissueOptions: tissueOptions,
      })
    );
  }

  function handleGwasProject(project) {
    const data = publicGTEx['GWAS dataset'];
    const phenotypeOptions = getPhenotypeOptions(data, project.value);

    dispatch(
      updateQTLsGWAS({
        gwasProject: project,
        phenotype: phenotypeOptions[0],
        phenotypeOptions: phenotypeOptions,
      })
    );
  }

  function handleLdProject(project) {
    dispatch(updateQTLsGWAS({ ldProject: project }));
  }

  function handleXqtl(xQtl) {
    const data = publicGTEx['cis-QTL dataset'];
    const tissueOptions = getTissueOptions(data, qtlProject.value, xQtl.value);

    dispatch(
      updateQTLsGWAS({
        xQtl: xQtl,
        tissue: tissueOptions[0],
        tissueOptions: tissueOptions,
      })
    );
  }

  function handleTissue(tissue) {
    dispatch(updateQTLsGWAS({ tissue: tissue }));
  }

  function handlePhenotype(phenotype) {
    dispatch(
      updateQTLsGWAS({
        phenotype: phenotype,
      })
    );
  }

  const handleReset = () => {
    dispatch(
      updateQTLsGWAS({ ...getInitialState().qtlsGWAS, publicGTEx: publicGTEx })
    );
    _setAssociationFile('');
    _setQuantificationFile('');
    _setGenotypeFile('');
    _setLDFile('');
    _setGwasFile('');
    setQtlPublic(false);
    setLdPublic(false);
    setGwasPublic(false);
    viewTissueOnly(false);
    viewPhenotypeOnly(false);
  };

  async function handleSubmit() {
    if (_quantificationFile && !_genotypeFile) {
      setShowGenotypeTooltip(true);
      setTimeout(() => setShowGenotypeTooltip(false), 5000);
      return;
    }
    if (!_quantificationFile && _genotypeFile) {
      setShowQuantificationTooltip(true);
      setTimeout(() => setShowQuantificationTooltip(false), 5000);
      return;
    }
    const request = uuidv1();
    await dispatch(
      uploadFile({
        // dataFiles: [
        //   _associationFile,
        //   _quantificationFile,
        //   _genotypeFile,
        //   _LDFile,
        //   _gwasFile,
        // ],
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

    // retrieve tabix file key from selected tissue (association qtl), phenotype (gwas), and project(ld)
    const qtlKey = qtlPublic
      ? publicGTEx['cis-QTL dataset']
          .filter(
            (row) =>
              row.Genome_build == genome.value && row.Tissue == tissue.value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          )
      : false;

    const ldKey = ldPublic
      ? publicGTEx['LD dataset']
          .filter(
            (row) =>
              row.Genome_build == genome.value &&
              row.Project == ldProject.value &&
              row.Chromosome == chromosome.value
          )[0]
          .Biowulf_full_path.replace(
            '/data/Brown_lab/ZTW_KB_Datasets/vQTL2/',
            ''
          )
      : false;

    const gwasKey = gwasPublic
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
      : false;

    dispatch(
      updateQTLsGWAS({ qtlKey: qtlKey, ldKey: ldKey, gwasKey: gwasKey })
    );

    await dispatch(
      qtlsGWASCalculation({
        request,
        select_qtls_samples,
        select_gwas_sample,
        associationFile: (_associationFile && _associationFile.name) || false,
        quantificationFile:
          (_quantificationFile && _quantificationFile.name) || false,
        genotypeFile: (_genotypeFile && _genotypeFile.name) || false,
        gwasFile: (_gwasFile && _gwasFile.name) || false,
        LDFile: (_LDFile && _LDFile.name) || false,
        select_pop,
        select_gene,
        select_dist,
        select_ref,
        recalculateAttempt,
        recalculatePop,
        recalculateGene,
        recalculateDist,
        recalculateRef,
        qtlKey,
        ldKey,
        gwasKey,
        chromosome: chromosome.value,
        range: range,
      })
    );
  }

  return (
    <Form className="py-1 px-2">
      <div>
        <Row>
          <Col>
            <Form.Group>
              <Select
                disabled={!genomeOptions.length}
                id="genomeBuild"
                label="Genome Build"
                value={genome}
                options={genomeOptions}
                onChange={(genome) =>
                  dispatch(updateQTLsGWAS({ genome: genome }))
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <div className="col-sm-6">
            <b>QTLs Data Files</b>
          </div>
          <div className="col-sm-6">
            {!select_qtls_samples ? (
              <>
                <Button
                  variant="link"
                  onClick={(_) => {
                    _setAssociationFile('');
                    _setQuantificationFile('');
                    _setGenotypeFile('');
                    _setLDFile('');
                    dispatch(updateQTLsGWAS({ select_qtls_samples: true }));
                  }}
                  disabled={submitted}
                >
                  <i className="fa fa-file mr-1" style={{ color: 'black' }}></i>
                  Load Sample Files
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="link"
                  onClick={(_) => {
                    _setAssociationFile('');
                    _setQuantificationFile('');
                    _setGenotypeFile('');
                    _setLDFile('');
                    dispatch(updateQTLsGWAS({ select_qtls_samples: false }));
                  }}
                  disabled={submitted}
                >
                  <i
                    className="fa fa-file-excel-o mr-1"
                    style={{ color: 'black' }}
                  ></i>
                  Unload Sample Files
                </Button>
              </>
            )}
          </div>
          <div className="col-sm-12">
            <small>
              <i>Upload locus specific region, &le; 5Mb size</i>
            </small>
          </div>
          <div className="w-100 border border-top mx-3 my-2"></div>
          <Form.Group className="col-sm-12">
            <div className="d-flex">
              <Form.Label className="mb-0 mr-auto">
                Association (QTL) Data <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Check
                disabled={submitted}
                inline
                id="qtlSource"
                label="Public"
                type="checkbox"
                checked={qtlPublic}
                onChange={(_) => {
                  setQtlPublic(!qtlPublic);
                  _setAssociationFile('');
                }}
              />
            </div>
            {qtlPublic ? (
              <div className="mt-2">
                <Row>
                  <Col>
                    <Form.Check
                      id="tissueOnly"
                      label="Tissue Only"
                      type="checkbox"
                      disabled={
                        submitted ||
                        publicLoading ||
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
                        <Form.Group>
                          <Select
                            disabled={publicLoading || tissueOnly}
                            id="project"
                            label="Project"
                            value={qtlProject}
                            options={qtlProjectOptions}
                            onChange={handleQtlProject}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Select
                            disabled={publicLoading || tissueOnly}
                            id="qtlType"
                            label="QTL Type"
                            value={xQtl}
                            options={xQtlOptions}
                            onChange={handleXqtl}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col>
                    <Form.Group>
                      <Select
                        disabled={publicLoading}
                        id="tissue"
                        label="Tissue"
                        value={tissue}
                        options={tissueOptions}
                        onChange={handleTissue}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ) : (
              <Form.File
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
                // isInvalid={checkValid ? !validFile : false}
                // feedback="Please upload a data file"
                // onChange={(e) => {
                //     setInput(e.target.files[0]);
                //     mergeVisualize({
                //     storeFilename: e.target.files[0].name,
                //     });
                // }}
                custom
              />
            )}
          </Form.Group>
          <Form.Group className="col-sm-12">
            <div className="d-flex">
              <Form.Label className="mb-0 mr-auto">
                LD Data{' '}
                <small>
                  <i>(Default: 1KG Phase 3, EUR)</i>
                </small>
              </Form.Label>
              <Form.Check
                disabled={submitted}
                inline
                id="ldSource"
                label="Public"
                type="checkbox"
                checked={ldPublic}
                onChange={(_) => {
                  setLdPublic(!ldPublic);
                  _setLDFile('');
                }}
              />
            </div>
            {ldPublic ? (
              <div className="mt-2">
                <Row>
                  <Col>
                    <Form.Group>
                      <Select
                        disabled={publicLoading}
                        id="ldProject"
                        label="Project"
                        value={ldProject}
                        options={ldProjectOptions}
                        onChange={handleLdProject}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ) : (
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
                // isInvalid={checkValid ? !validFile : false}
                // feedback="Please upload a data file"
                // onChange={(e) => {
                //     setInput(e.target.files[0]);
                //     mergeVisualize({
                //     storeFilename: e.target.files[0].name,
                //     });
                // }}
                custom
              />
            )}
          </Form.Group>
          <div>
            <Form.Group className="col-sm-12">
              <Form.Label className="mb-0">Quantification Data File</Form.Label>
              <Form.File
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
                onChange={(e) => {
                  _setQuantificationFile(e.target.files[0]);
                }}
                // accept=".tsv, .txt"
                // isInvalid={checkValid ? !validFile : false}
                // feedback="Please upload a data file"
                // onChange={(e) => {
                //     setInput(e.target.files[0]);
                //     mergeVisualize({
                //     storeFilename: e.target.files[0].name,
                //     });
                // }}
                custom
              />
              <Overlay
                target={quantificationFileControl.current}
                show={showQuantificationTooltip}
                placement="bottom"
              >
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    Please input accompanying Quantification Data File with
                    Genotype Data File.
                  </Tooltip>
                )}
              </Overlay>
            </Form.Group>
            <Form.Group className="col-sm-12">
              <Form.Label className="mb-0">Genotype Data File</Form.Label>
              <Form.File
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
                // isInvalid={checkValid ? !validFile : false}
                // feedback="Please upload a data file"
                // onChange={(e) => {
                //     setInput(e.target.files[0]);
                //     mergeVisualize({
                //     storeFilename: e.target.files[0].name,
                //     });
                // }}
                custom
              />
              <Overlay
                target={genotypeFileControl.current}
                show={showGenotypeTooltip}
                placement="bottom"
              >
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    Please input accompanying Genotype Data File with
                    Quantification Data File.
                  </Tooltip>
                )}
              </Overlay>
            </Form.Group>
          </div>
        </Row>
        <Row>
          <div className="w-100 border border-top mx-3 my-2"></div>
          <div className="col-sm-6">
            <b>GWAS Data</b>
          </div>
          <div className="col-sm-6">
            {!select_gwas_sample ? (
              <>
                <Button
                  variant="link"
                  onClick={(_) => {
                    _setGwasFile('');
                    dispatch(updateQTLsGWAS({ select_gwas_sample: true }));
                  }}
                  disabled={submitted}
                >
                  <i className="fa fa-file mr-1" style={{ color: 'black' }}></i>
                  Load Sample File
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="link"
                  onClick={(_) => {
                    _setGwasFile('');
                    dispatch(updateQTLsGWAS({ select_gwas_sample: false }));
                  }}
                  disabled={submitted}
                >
                  <i
                    className="fa fa-file-excel-o mr-1"
                    style={{ color: 'black' }}
                  ></i>
                  Unload Sample File
                </Button>
              </>
            )}
          </div>
          <div className="col-sm-12">
            <small>
              <i>Upload locus specific region, &le; 5Mb size</i>
            </small>
          </div>
          <div className="w-100 border border-top mx-3 my-2"></div>
          <Form.Group className="col-sm-12">
            <div className="d-flex">
              <Form.Label className="mb-0 mr-auto">GWAS Data</Form.Label>
              <Form.Check
                disabled={submitted}
                inline
                id="gwasSource"
                label="Public"
                type="checkbox"
                checked={gwasPublic}
                onChange={(_) => {
                  setGwasPublic(!gwasPublic);
                  _setGwasFile('');
                }}
              />
            </div>
            {gwasPublic ? (
              <div className="mt-2">
                <Row>
                  <Col>
                    <Form.Check
                      id="phenotypeOnly"
                      label="Phenotype Only"
                      type="checkbox"
                      disabled={
                        submitted ||
                        publicLoading ||
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
                      <Form.Group>
                        <Select
                          disabled={
                            submitted ||
                            publicLoading ||
                            phenotypeOnly ||
                            !gwasProjectOptions.length
                          }
                          id="gwasProject"
                          label="Project"
                          value={gwasProject}
                          options={gwasProjectOptions}
                          onChange={handleGwasProject}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col>
                    <Form.Group>
                      <Select
                        disabled={
                          submitted || publicLoading || !phenotypeOptions.length
                        }
                        id="gwasPhenotype"
                        label="Phenotype"
                        value={phenotype}
                        options={phenotypeOptions}
                        onChange={handlePhenotype}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ) : (
              <Form.File
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
                // isInvalid={checkValid ? !validFile : false}
                // feedback="Please upload a data file"
                // onChange={(e) => {
                //     setInput(e.target.files[0]);
                //     mergeVisualize({
                //     storeFilename: e.target.files[0].name,
                //     });
                // }}
                custom
              />
            )}
          </Form.Group>
        </Row>
        <Row>
          <div className="w-100 border border-top mx-3 my-2"></div>
          <div className="col-sm-12">
            <b>Locus Information</b>
          </div>
          <div className="w-100 border border-top mx-3 my-2"></div>
          <div className="col-sm-12">
            <Form.Label className="mb-0">
              cis-QTL Distance <span style={{ color: 'red' }}>*</span>{' '}
              <small>
                <i>(+/- Kb up to 5Mb)</i>
              </small>
            </Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="2000"
              id="qtls-distance-input"
              disabled={submitted}
              onChange={(e) => {
                dispatch(updateQTLsGWAS({ select_dist: e.target.value }));
              }}
              value={select_dist}
              isInvalid={select_dist < 1 || select_dist > 200}
              // custom
            />
            <Form.Control.Feedback type="invalid">
              Enter distance between 1 and 200Kb.
            </Form.Control.Feedback>
          </div>
          {qtlPublic || ldPublic || gwasPublic ? (
            <Col>
              <Form.Row>
                <Col sm="4">
                  <Form.Group>
                    <Select
                      disabled={submitted}
                      id="chromosome"
                      label="Chromosome"
                      value={chromosome}
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
                        dispatch(updateQTLsGWAS({ chromosome: chromosome }));
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col sm="8">
                  <Form.Label className="mb-0">Range</Form.Label>
                  <Form.Control
                    id="range"
                    disabled={submitted}
                    onChange={(e) => {
                      dispatch(updateQTLsGWAS({ range: e.target.value }));
                    }}
                    placeholder="e.g. 100000-1000000"
                    value={range}
                  />
                </Col>
              </Form.Row>
            </Col>
          ) : (
            <Col>
              <Form.Label className="mb-0">
                SNP{' '}
                <small>
                  <i>(Default: lowest GWAS P-value SNP)</i>
                </small>
              </Form.Label>
              <Form.Control
                id="qtls-snp-input"
                disabled={submitted}
                onChange={(e) => {
                  dispatch(updateQTLsGWAS({ select_ref: e.target.value }));
                }}
                value={select_ref ? select_ref : ''}
                isInvalid={
                  select_ref &&
                  select_ref.length > 0 &&
                  !/^rs\d+$/.test(select_ref)
                }
                // custom
              />
              <Form.Control.Feedback type="invalid">
                Enter valid RS number. Leave empty for default.
              </Form.Control.Feedback>
            </Col>
          )}
        </Row>
        <div className="row mb-4">
          <div className="w-100 border border-top mx-3 my-2"></div>
          <div className="col-sm-12">
            <i className="fa fa-download mr-1"></i>
            <a href="assets/files/MX2.examples.gz" download>
              Download Example Data
            </a>
          </div>
        </div>
      </div>

      {/*
      
         
        </div> 
        */}

      <div className="row">
        <div className="col-sm-6">
          <Button
            // disabled={submitted || loading.active}
            className="w-100"
            variant="primary"
            type="button"
            onClick={() => {
              handleSubmit();
              // if (validateForm()) handleSubmit();
            }}
            disabled={
              submitted ||
              (!_associationFile && !select_qtls_samples && !qtlPublic) ||
              select_dist.length <= 0 ||
              select_dist < 1 ||
              select_dist > 200 ||
              (select_ref &&
                select_ref.length > 0 &&
                !/^rs\d+$/.test(select_ref))
            }
          >
            Calculate
          </Button>
        </div>
        <div className="col-sm-6">
          <Button
            // disabled={loading.active}
            className="w-100"
            variant={isError ? 'danger' : 'secondary'}
            onClick={() => handleReset()}
            disabled={submitted && isLoading}
          >
            Reset
          </Button>
        </div>
      </div>
    </Form>
  );
}
