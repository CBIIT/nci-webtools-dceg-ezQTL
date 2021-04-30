import React, { useContext, useState, useEffect, useRef } from 'react';
import { RootContext } from '../../../index';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateAlert, updateMultiLoci } from '../../../services/actions';
import Select from '../../controls/select/select';
import { PopulationSelect } from '../../controls/population-select/population-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function LocusInfo({ locusIndex, state, mergeState }) {
  const dispatch = useDispatch();
  const { getInitialState } = useContext(RootContext);
  const {
    locusInformation,
    submitted,
    qtlPublic,
    ldPublic,
    gwasPublic,
  } = state;
  const { select_dist, select_position, select_ref } = locusInformation[
    locusIndex
  ];

  // check form validity
  useEffect(() => {
    if (
      !select_dist ||
      select_dist < 1 ||
      select_dist > 200 ||
      (select_ref && select_ref.length > 0 && !/^rs\d+$/.test(select_ref))
    ) {
      dispatch(updateMultiLoci({ valid: false }));
    } else {
      dispatch(updateMultiLoci({ valid: true }));
    }
  }, [ldPublic, qtlPublic, select_dist, select_ref]);

  function mergeLocusInfo(data) {
    let newLocusInfo = locusInformation.slice();
    newLocusInfo[locusIndex] = { ...newLocusInfo[locusIndex], ...data };
    mergeState({ locusInformation: newLocusInfo });
  }

  function addLocusInfo() {
    let newLocusInfo = state.locusInformation.slice();
    newLocusInfo = [
      ...newLocusInfo,
      ...getInitialState().multiLoci.states[0].locusInformation,
    ];
    mergeState({ locusInformation: newLocusInfo });
  }

  function removeLocusInfo() {
    let newLocusInfo = state.locusInformation.slice();
    newLocusInfo.splice(locusIndex, 1);
    mergeState({ locusInformation: newLocusInfo });
  }

  return (
    <Form.Row>
      <Col md="auto">
        <Form.Group>
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
            onChange={(e) => mergeLocusInfo({ select_dist: e.target.value })}
            value={select_dist}
            isInvalid={select_dist < 1 || select_dist > 200}
            // custom
          />
          <Form.Control.Feedback type="invalid">
            Enter distance between 1 and 200Kb.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      {qtlPublic || ldPublic || gwasPublic ? (
        <>
          <Col md="2">
            <Form.Label className="mb-0">Position</Form.Label>
            <Form.Control
              id="select_position"
              disabled={submitted}
              onChange={(e) =>
                mergeLocusInfo({ select_position: e.target.value })
              }
              placeholder="e.g. 100000-1000000"
              value={select_position}
            />
          </Col>
        </>
      ) : (
        <Col md="auto">
          <Form.Group>
            <Form.Label className="mb-0">
              SNP{' '}
              <small>
                <i>(Default: lowest GWAS P-value SNP)</i>
              </small>
            </Form.Label>
            <Form.Control
              id="qtls-snp-input"
              disabled={submitted}
              onChange={(e) => mergeLocusInfo({ select_ref: e.target.value })}
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
          </Form.Group>
        </Col>
      )}
      {locusIndex == locusInformation.length - 1 && (
        <Col md="auto">
          <Button
            className="my-4"
            variant="success"
            onClick={() => addLocusInfo()}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Col>
      )}
      {locusIndex != 0 && (
        <Col md="auto">
          <Button
            size="md"
            className="my-4"
            variant="danger"
            onClick={() => removeLocusInfo()}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </Col>
      )}
    </Form.Row>
  );
}

export default function MultiForm({
  stateIndex,
  mergeState,
  setFile,
  removeFile,
  _associationFile,
  _quantificationFile,
  _genotypeFile,
  _LDFile,
  _gwasFile,
}) {
  const dispatch = useDispatch();
  const { getInitialState } = useContext(RootContext);

  const quantificationFileControl = useRef(null);
  const genotypeFileControl = useRef(null);

  // toggle visible input
  const [tissueOnly, viewTissueOnly] = useState(false);
  const [phenotypeOnly, viewPhenotypeOnly] = useState(false);
  const [showAdditionalInput, setAdditionalInput] = useState(false);

  const { states, valid, publicGTEx, submitted, attempt } = useSelector(
    (state) => state.multiLoci
  );
  const state = states[stateIndex];
  const {
    jobName,
    select_qtls_samples,
    select_gwas_sample,
    associationFile,
    quantificationFile,
    genotypeFile,
    gwasFile,
    LDFile,
    select_pop,
    locusInformation,
    isLoading,
    isError,
    loadingPublic,
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
    select_chromosome,
    qtlPublic,
    gwasPublic,
    ldPublic,
  } = state;

  // handle files
  useEffect(() => setFile('qtl', associationFile || ''), [associationFile]);
  useEffect(() => setFile('quantification', quantificationFile || ''), [
    quantificationFile,
  ]);
  useEffect(() => setFile('genotype', genotypeFile || ''), [genotypeFile]);
  useEffect(() => setFile('ld', LDFile || ''), [LDFile]);
  useEffect(() => setFile('gwas', gwasFile || ''), [gwasFile]);
  useEffect(() => {
    if (select_qtls_samples || select_gwas_sample) setAdditionalInput(true);
    else setAdditionalInput(false);
  }, [select_qtls_samples, select_gwas_sample]);

  // inital population of public params
  useEffect(() => {
    if (Object.keys(publicGTEx).length && !genomeOptions.length)
      getGenomeOptions();
  }, [publicGTEx, genomeOptions]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && genome) populatePublicParameters();
  }, [genome]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && qtlProject && qtlPublic)
      handleQtlProject(qtlProject);
  }, [qtlPublic, tissueOnly]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && gwasProject && gwasPublic)
      handleGwasProject(gwasProject);
  }, [gwasPublic, phenotypeOnly]);
  useEffect(() => {
    if (Object.keys(publicGTEx).length && ldProject && ldPublic)
      handleLdProject(ldProject);
  }, [ldPublic]);

  // check form validity
  useEffect(() => {
    if (
      (!_associationFile && !select_qtls_samples && !qtlPublic) ||
      // (ldPublic && (!select_pop || select_pop.length <= 0)) ||
      (_quantificationFile && !_genotypeFile) ||
      (!_quantificationFile && _genotypeFile)
    ) {
      dispatch(updateMultiLoci({ valid: false }));
    } else {
      dispatch(updateMultiLoci({ valid: true }));
    }
  }, [
    _associationFile,
    _quantificationFile,
    _genotypeFile,
    ldPublic,
    qtlPublic,
    select_pop,
    select_qtls_samples,
  ]);

  function getGenomeOptions() {
    const data = publicGTEx['cis-QTL dataset'];
    const genomeOptions = [
      ...new Set(data.map((row) => row.Genome_build)),
    ].map((genome) => ({ value: genome, label: genome }));

    mergeState({
      genome: genomeOptions[0],
      genomeOptions: genomeOptions,
    });
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

    mergeState({
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
    });
  }

  function handleQtlProject(project) {
    const data = publicGTEx['cis-QTL dataset'];
    const xQtlOptions = getXqtlOptions(data, project.value);
    const tissueOptions = getTissueOptions(
      data,
      project.value,
      xQtlOptions[0].value
    );
    const qtlKey = data
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == project.value &&
          row.xQTL == xQtlOptions[0].value &&
          row.Tissue == tissueOptions[0].value
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');

    mergeState({
      qtlProject: project,
      xQtl: xQtlOptions[0],
      xQtlOptions: xQtlOptions,
      tissue: tissueOptions[0],
      tissueOptions: tissueOptions,
      qtlKey: qtlKey,
    });
  }

  function handleGwasProject(project) {
    const data = publicGTEx['GWAS dataset'];
    const phenotypeOptions = getPhenotypeOptions(data, project.value);
    const gwasKey = data
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == project.value &&
          row.Phenotype == phenotypeOptions[0].value
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');

    mergeState({
      gwasProject: project,
      phenotype: phenotypeOptions[0],
      phenotypeOptions: phenotypeOptions,
      gwasKey: gwasKey,
    });
  }

  function handleLdProject(project) {
    const ldKey = publicGTEx['LD dataset']
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == project.value &&
          row.Chromosome == select_chromosome.value
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');

    mergeState({ ldProject: project, ldKey: ldKey });
  }

  function handleChromosome(chromosome) {
    const ldKey = publicGTEx['LD dataset']
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == ldProject.value &&
          row.Chromosome == chromosome
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');

    mergeState({ chromosome: chromosome, ldKey: ldKey });
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

    mergeState({
      xQtl: xQtl,
      tissue: tissueOptions[0],
      tissueOptions: tissueOptions,
      qtlKey: qtlKey,
    });
  }

  function handleTissue(tissue) {
    const qtlKey = publicGTEx['cis-QTL dataset']
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == qtlProject.value &&
          row.xQTL == xQtl.value &&
          row.Tissue == tissue.value
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');
    mergeState({ tissue: tissue, qtlKey: qtlKey });
  }

  function handlePhenotype(phenotype) {
    const gwasKey = publicGTEx['GWAS dataset']
      .filter(
        (row) =>
          row.Genome_build == genome.value &&
          row.Project == gwasProject.value &&
          row.Phenotype == phenotype.value
      )[0]
      .Biowulf_full_path.replace('/data/Brown_lab/ZTW_KB_Datasets/vQTL2/', '');

    mergeState({
      phenotype: phenotype,
      gwasKey: gwasKey,
    });
  }

  function handleReset() {
    let newStates = states.slice();
    newStates[stateIndex] = getInitialState().multiLoci.states[0];

    dispatch(updateMultiLoci({ states: newStates }));
    // dispatch(updateAlert(getInitialState().alert));
    setFile('qtl', '');
    setFile('quantification', '');
    setFile('genotype', '');
    setFile('ld', '');
    setFile('gwas', '');
    viewTissueOnly(false);
    viewPhenotypeOnly(false);
    setAdditionalInput(false);
  }

  function removeForm() {
    let newStates = states.slice();
    newStates.splice(stateIndex, 1);

    dispatch(updateMultiLoci({ states: newStates }));
    removeFile('qtl');
    removeFile('ld');
    removeFile('gwas');
    removeFile('quantification');
    removeFile('genotype');
  }

  return (
    <Form className="border rounded py-1 px-2 bg-light">
      <Form.Row>
        <Col md="2">
          <Form.Group>
            <Select
              disabled={!genomeOptions.length || submitted}
              id="genomeBuild"
              label="Genome Build"
              value={genome}
              options={genomeOptions}
              onChange={(genome) => mergeState({ genome: genome })}
            />
          </Form.Group>
        </Col>
        <Col md="auto">
          <Form.Group>
            <Form.Label className="mb-0">Job Name</Form.Label>
            <Form.Control
              placeholder={`ezQTL ${stateIndex + 1}`}
              value={jobName}
              type="text"
              onChange={(e) => mergeState({ jobName: e.target.value })}
              disabled={submitted}
            />
          </Form.Group>
        </Col>
        <Col md="1" />
        <Col md="auto">
          <div>
            <p style={{ fontWeight: '500' }}>Sample Data</p>
            <div>
              <span className="mr-3">
                {!select_gwas_sample ? (
                  <>
                    <Button
                      variant="link"
                      onClick={(_) => {
                        setFile('gwas', '');
                        mergeState({
                          select_qtls_samples: true,
                          select_gwas_sample: true,
                          qtlPublic: false,
                          gwasPublic: false,
                          ldPublic: false,
                          select_pop: false,
                        });
                      }}
                      disabled={submitted}
                    >
                      <i
                        className="fa fa-file mr-1"
                        style={{ color: 'black' }}
                      ></i>
                      Load Sample Data
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="link"
                      onClick={(_) => {
                        setFile('gwas', '');

                        mergeState({
                          select_qtls_samples: false,
                          select_gwas_sample: false,
                        });
                      }}
                      disabled={submitted}
                    >
                      <i
                        className="fa fa-file-excel-o mr-1"
                        style={{ color: 'black' }}
                      ></i>
                      Unload Sample Data
                    </Button>
                  </>
                )}
              </span>
              <span>
                <i className="fa fa-download mr-1"></i>
                <a href="assets/files/MX2.examples.gz" download>
                  Download Sample Data
                </a>
              </span>
            </div>
          </div>
        </Col>
      </Form.Row>
      <hr className="mt-0" />
      <Form.Row>
        <Col md="6">
          <b>QTLs Data Files</b>
        </Col>
        <Col md="6">
          <Button
            variant="link"
            onClick={() => setAdditionalInput(!showAdditionalInput)}
          >
            {showAdditionalInput ? 'Hide' : 'Show'} Additional Input
          </Button>
        </Col>
        <Col md="12">
          <small>
            <i>Upload locus specific region, &le; 5Mb size</i>
          </small>
        </Col>
      </Form.Row>
      <Form.Row>
        <Form.Group className="col-md-3" controlId={`qtlPublic-${stateIndex}`}>
          <div className="d-flex">
            <Form.Label className="mb-0 mr-auto">
              Association (QTL) Data <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Check
              className="mr-0"
              disabled={submitted || select_qtls_samples}
              inline
              label="Public"
              type="checkbox"
              checked={qtlPublic}
              onChange={(_) => {
                mergeState({
                  qtlPublic: !qtlPublic,
                  ...(!qtlPublic && { select_ref: false }),
                });
                setFile('qtl', '');
              }}
            />
          </div>
          {qtlPublic ? (
            <div className="mt-2">
              <Form.Row>
                <Col />
                <Col md="auto">
                  <Form.Check
                    id="tissueOnly"
                    label="Tissue Only"
                    type="checkbox"
                    disabled={
                      submitted ||
                      loadingPublic ||
                      !Object.keys(publicGTEx).length
                    }
                    checked={tissueOnly}
                    onChange={(_) => {
                      viewTissueOnly(!tissueOnly);
                    }}
                  />
                </Col>
              </Form.Row>
              {!tissueOnly && (
                <>
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Select
                          disabled={loadingPublic || tissueOnly || submitted}
                          id="project"
                          label="Project"
                          value={qtlProject}
                          options={qtlProjectOptions}
                          onChange={handleQtlProject}
                        />
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Select
                          disabled={loadingPublic || tissueOnly || submitted}
                          id="qtlType"
                          label="QTL Type"
                          value={xQtl}
                          options={xQtlOptions}
                          onChange={handleXqtl}
                        />
                      </Form.Group>
                    </Col>
                  </Form.Row>
                </>
              )}
              <Form.Row>
                <Col>
                  <Form.Group>
                    <Select
                      disabled={loadingPublic || submitted}
                      id="tissue"
                      label="Tissue"
                      value={tissue}
                      options={tissueOptions}
                      onChange={handleTissue}
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
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
                setFile('qtl', e.target.files[0]);
              }}
              // accept=".tsv, .txt"
              isInvalid={
                attempt ? !_associationFile && !select_qtls_samples : false
              }
              feedback="Please upload a data file"
              custom
            />
          )}
        </Form.Group>
        <Form.Group className="col-md-3" controlId={`gwasPublic-${stateIndex}`}>
          <div className="d-flex">
            <Form.Label className="mb-0 mr-auto">GWAS Data</Form.Label>
            <Form.Check
              className="mr-0"
              disabled={submitted || select_qtls_samples}
              inline
              label="Public"
              type="checkbox"
              checked={gwasPublic}
              onChange={(_) => {
                mergeState({
                  gwasPublic: !gwasPublic,
                  ...(!ldPublic && { select_ref: false }),
                });

                setFile('gwas', '');
              }}
            />
          </div>
          {gwasPublic ? (
            <div className="mt-2">
              <Row>
                <Col />
                <Col md="auto">
                  <Form.Check
                    id="phenotypeOnly"
                    label="Phenotype Only"
                    type="checkbox"
                    disabled={
                      submitted ||
                      loadingPublic ||
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
                          loadingPublic ||
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
                        submitted || loadingPublic || !phenotypeOptions.length
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
              onChange={(e) => setFile('gwas', e.target.files[0])}
              // accept=".tsv, .txt"
              // isInvalid={checkValid ? !validFile : false}
              // feedback="Please upload a data file"
              custom
            />
          )}
        </Form.Group>
        {showAdditionalInput && (
          <>
            <Form.Group className="col-md-3">
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
                  setFile('quantification', e.target.files[0]);
                }}
                // accept=".tsv, .txt"
                custom
                isInvalid={
                  attempt && !_quantificationFile && _genotypeFile
                    ? true
                    : false
                }
                feedback="Please input accompanying Quantification Data File with
                Genotype Data File."
              />
            </Form.Group>
            <Form.Group className="col-md-3">
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
                  setFile('genotype', e.target.files[0]);
                }}
                // accept=".tsv, .txt"
                custom
                isInvalid={
                  attempt && _quantificationFile && !_genotypeFile
                    ? true
                    : false
                }
                feedback="Please input accompanying Genotype Data File with
                Quantification Data File."
              />
            </Form.Group>
          </>
        )}
      </Form.Row>
      <hr />
      <Form.Row>
        <Col md="6">
          <Form.Group controlId={`ldPublic-${stateIndex}`} className="mb-0">
            <Form.Label className="mr-5">
              <b>LD Information</b>
            </Form.Label>
            <Form.Check
              disabled={submitted || select_qtls_samples}
              inline
              label="Public"
              type="checkbox"
              checked={ldPublic}
              onChange={(_) => {
                mergeState({
                  ldPublic: !ldPublic,
                  select_pop: false,
                  ...(!ldPublic && { select_ref: false }),
                });
                setFile('ld', '');
              }}
            />
          </Form.Group>
          <Form.Row>
            <Form.Group className="col-md-12">
              <Form.Label className="mb-0 mr-auto">
                LD Data{' '}
                <small>
                  <i>(Default: 1KG Phase 3, EUR)</i>
                </small>
              </Form.Label>
              {ldPublic ? (
                <div>
                  <Form.Row>
                    <Col md="4">
                      <Form.Group>
                        <Select
                          disabled={loadingPublic || submitted}
                          id="ldProject"
                          label="Project"
                          value={ldProject}
                          options={ldProjectOptions}
                          onChange={handleLdProject}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="auto">
                      <Form.Group>
                        <Select
                          disabled={submitted}
                          id="chromosome"
                          label="Chromosome"
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
                          onChange={(chromosome) =>
                            handleChromosome(chromosome)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Label className="mb-0">
                        Population <span style={{ color: 'red' }}>*</span>{' '}
                      </Form.Label>
                      <PopulationSelect
                        id="qtls-results-population-input"
                        disabled={submitted || !ldPublic}
                        stateIndex={stateIndex}
                      />
                    </Col>
                  </Form.Row>
                </div>
              ) : (
                <Col md="6" className="px-0">
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
                      setFile('ld', e.target.files[0]);
                    }}
                    // accept=".tsv, .txt"
                    // isInvalid={checkValid ? !validFile : false}
                    // feedback="Please upload a data file"
                    custom
                  />
                </Col>
              )}
            </Form.Group>
          </Form.Row>
        </Col>
        <Col md="6">
          <b>Locus Information</b>
          {locusInformation.map((_, i) => (
            <LocusInfo
              locusIndex={i}
              state={state}
              mergeState={mergeState}
              key={`locusInfo-${i}`}
            />
          ))}
        </Col>
      </Form.Row>
      <Form.Row className="mt-4">
        <Col />
        <Col md="auto">
          <Button
            // disabled={loading.active}
            className="w-100"
            variant={isError ? 'danger' : 'secondary'}
            onClick={() => handleReset()}
            disabled={submitted && isLoading}
          >
            Reset Form
          </Button>
        </Col>
        {stateIndex != 0 && (
          <Col md="auto">
            <Button
              // disabled={loading.active}
              className="w-100"
              variant="danger"
              onClick={() => removeForm()}
              disabled={submitted && isLoading}
            >
              Remove Locus
            </Button>
          </Col>
        )}
      </Form.Row>
    </Form>
  );
}
