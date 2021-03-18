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
  const [source, setSource] = useState('user');
  const [noFilter, setFilter] = useState(false);

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
    dataset,
    datasetOptions,
    genome,
    genomeOptions,
    project,
    projectOptions,
    tissue,
    tissueOptions,
    chromosome,
    chromosomeOptions,
  } = useSelector((state) => state.qtlsGWAS);

  useEffect(() => _setAssociationFile(associationFile), [associationFile]);
  useEffect(() => _setQuantificationFile(quantificationFile), [
    quantificationFile,
  ]);
  useEffect(() => _setGenotypeFile(genotypeFile), [genotypeFile]);
  useEffect(() => _setLDFile(LDFile), [LDFile]);
  useEffect(() => _setGwasFile(gwasFile), [gwasFile]);
  useEffect(() => {
    if (!publicGTEx.length) dispatch(getPublicGTEx());
  }, []);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && !genomeOptions.length)
      handleDataset(dataset || 'cis-QTL dataset');
  }, [publicGTEx]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length) handleDataset(dataset);
  }, [noFilter]);

  function getProjectOptions(data, genome) {
    return [
      ...new Set(
        data
          .filter((row) => row['Genome_build'] == genome)
          .map((row) => row['Project'])
      ),
    ];
  }

  function getTissueOptions(data, genome, project) {
    return !noFilter
      ? [
          ...new Set(
            data
              .filter(
                (row) =>
                  row['Genome_build'] == genome && row['Project'] == project
              )
              .map((row) => row['Tissue'])
          ),
        ]
      : [...new Set(data.map((row) => row['Tissue']))];
  }
  function getChromosomeOptions(data, genome, project) {
    const sortNum = (a, b) => parseInt(a, 10) - parseInt(b, 10);
    return !noFilter
      ? [
          ...new Set(
            data
              .filter(
                (row) =>
                  row['Genome_build'] == genome && row['Project'] == project
              )
              .map((row) => row['Chromosome'])
          ),
        ].sort(sortNum)
      : [...new Set(data.map((row) => row['Chromosome']))].sort(sortNum);
  }

  function handleDataset(dataset) {
    const data = publicGTEx[dataset];
    const genomeOptions = [...new Set(data.map((row) => row['Genome_build']))];
    const projectOptions = getProjectOptions(data, genomeOptions[0]);
    const tissueOptions = getTissueOptions(
      data,
      genomeOptions[0],
      projectOptions[0]
    );
    const chromosomeOptions = getChromosomeOptions(
      data,
      genomeOptions[0],
      projectOptions[0]
    );

    dispatch(
      updateQTLsGWAS({
        dataset: dataset,
        genome: genomeOptions[0],
        project: projectOptions[0],
        tissue: tissueOptions[0],
        chromosome: chromosomeOptions[0],
        genomeOptions: genomeOptions,
        projectOptions: projectOptions,
        tissueOptions: tissueOptions,
        chromosomeOptions: chromosomeOptions,
      })
    );
  }

  function handleGenome(genome) {
    const data = publicGTEx[dataset];
    const projectOptions = getProjectOptions(data, genome);
    const tissueOptions = getTissueOptions(data, genome, projectOptions[0]);
    const chromosomeOptions = getChromosomeOptions(
      data,
      genome,
      projectOptions[0]
    );

    dispatch(
      updateQTLsGWAS({
        genome: genome,
        project: projectOptions[0],
        tissue: tissueOptions[0],
        chromosome: chromosomeOptions[0],
        projectOptions: projectOptions,
        tissueOptions: tissueOptions,
        chromosomeOptions: chromosomeOptions,
      })
    );
  }

  function handleProject(project) {
    const data = publicGTEx[dataset];
    const tissueOptions = getTissueOptions(data, genome, project);
    const chromosomeOptions = getChromosomeOptions(data, genome, project);

    dispatch(
      updateQTLsGWAS({
        project: project,
        tissue: tissueOptions[0],
        chromosome: chromosomeOptions[0],
        tissueOptions: tissueOptions,
        chromosomeOptions: chromosomeOptions,
      })
    );
  }

  function handleTissue(tissue) {
    dispatch(updateQTLsGWAS({ tissue: tissue }));
  }

  function handleChromosome(chromosome) {
    const data = publicGTEx[dataset];
    const options = [
      ...new Set(
        data
          .filter(
            (row) => row['Genome_build'] == genome && row['Project'] == project
          )
          .map((row) => row['Chromosome'])
      ),
    ];

    dispatch(
      updateQTLsGWAS({ chromosome: chromosome, chromosomeOptions: options })
    );
  }

  const handleReset = () => {
    dispatch(updateQTLsGWAS(getInitialState().qtlsGWAS));
    _setAssociationFile('');
    _setQuantificationFile('');
    _setGenotypeFile('');
    _setLDFile('');
    _setGwasFile('');
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
        dataFiles: [
          _associationFile,
          _quantificationFile,
          _genotypeFile,
          _LDFile,
          _gwasFile,
        ],
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
      })
    );
  }

  return (
    <Form className="py-1 px-2">
      <Form.Group className="row">
        <div className="col-sm-6">
          <b>Data Source:</b>
        </div>
        <div className="col-sm-6">
          <Form.Check
            inline
            id="userSource"
            label="User"
            type="radio"
            checked={source == 'user'}
            onChange={(_) => setSource('user')}
          />
          <Form.Check
            inline
            id="publicSource"
            label="Public"
            type="radio"
            checked={source == 'public'}
            onChange={(_) => setSource('public')}
          />
        </div>
      </Form.Group>
      {source == 'user' ? (
        <div>
          <Form.Group className="row">
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
                    <i
                      className="fa fa-file mr-1"
                      style={{ color: 'black' }}
                    ></i>
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
            <div className="col-sm-12">
              <Form.Label className="mb-0">
                Association (QTL) Data File{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
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
            </div>
            <div className="col-sm-12">
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
            </div>
            <div className="col-sm-12">
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
            </div>
            <div className="col-sm-12">
              <Form.Label className="mb-0">
                LD Data File{' '}
                <small>
                  <i>(Default: 1KG Phase 3, EUR)</i>
                </small>
              </Form.Label>
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
            </div>
          </Form.Group>
          <Form.Group className="row">
            <div className="w-100 border border-top mx-3 my-2"></div>
            <div className="col-sm-6">
              <b>GWAS Data File</b>
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
                    <i
                      className="fa fa-file mr-1"
                      style={{ color: 'black' }}
                    ></i>
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
            <div className="col-sm-12">
              <Form.Label className="mb-0">GWAS Data File</Form.Label>
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
            </div>
          </Form.Group>
          <Form.Group className="row">
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
            <div className="col-sm-12">
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
            </div>
          </Form.Group>
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
      ) : (
        <div>
          <Row>
            <Col>
              <Form.Group>
                <Select
                  disabled={publicLoading}
                  id="dataset"
                  label="Dataset"
                  value={dataset}
                  options={Object.keys(publicGTEx)}
                  onChange={handleDataset}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Select
                  disabled={publicLoading || noFilter}
                  id="genomeBuild"
                  label="Genome Build"
                  value={genome}
                  options={genomeOptions}
                  onChange={handleGenome}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Select
                  disabled={publicLoading || noFilter}
                  id="project"
                  label="Project"
                  value={project}
                  options={projectOptions}
                  onChange={handleProject}
                />
              </Form.Group>
            </Col>
          </Row>
          {dataset == 'cis-QTL dataset' ? (
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
          ) : (
            <Row>
              <Col>
                <Form.Group>
                  <Select
                    disabled={publicLoading}
                    id="chromosome"
                    label="Chromosome"
                    value={chromosome}
                    options={chromosomeOptions}
                    onChange={handleChromosome}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <Form.Check
                id="noFilter"
                className="mb-3"
                label={`All ${
                  dataset == 'cis-QTL dataset' ? 'Tissues' : 'Chromosomes'
                }`}
                type="checkbox"
                disabled={publicLoading || !Object.keys(publicGTEx).length}
                checked={noFilter == true}
                onChange={(_) => {
                  setFilter(!noFilter);
                }}
              />
            </Col>
          </Row>
        </div>
      )}
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
              (!_associationFile && !select_qtls_samples) ||
              select_dist.length <= 0 ||
              select_dist < 1 ||
              select_dist > 200 ||
              (select_ref &&
                select_ref.length > 0 &&
                !/^rs\d+$/.test(select_ref)) ||
              source == 'public'
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
