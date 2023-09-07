import React, { useContext, useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { RootContext } from '../../../index';
import {
  Form,
  Button,
  Row,
  Col,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  qtlsGWASLocusQCCalculation,
  uploadFile,
  updateQTLsGWAS,
  getPublicGTEx,
  updateAlert,
  submitLong,
} from '../../../services/actions';
import Select from '../../controls/select/select';
import Accordions from '../../controls/accordions/accordions';
import { PopulationSelect } from '../../controls/population-select/population-select';

export function QTLsGWASForm() {
  const dispatch = useDispatch();
  const { getInitialState } = useContext(RootContext);

  const [useQuantification, toggleQuantification] = useState(false);
  const [valid, setValid] = useState(null);

  const {
    associationFile,
    associationFileName,
    quantificationFile,
    genotypeFile,
    gwasFile,
    gwasFileName,
    LDFile,
    LDFileName,
    select_pop: storePop,
    select_gene,
    recalculateAttempt,
    recalculatePop,
    recalculateGene,
    recalculateDist,
    recalculateRef,
    submitted,
    isLoading,
    fetchingOptions,
    isError,

    publicGTEx,
    qtlPublic: storeQtlPublic,
    gwasPublic: storeGwasPublic,
    ldPublic: storeLdPublic,
    genome: storeGenome,
    qtlProject: storeQtlProject,
    xQtl: storeXQtl,
    tissue: storeTissue,
    gwasProject: storeGwasProject,
    phenotype: storePhenotype,
    ldProject: storeLdProject,
    locusInformation: storeLocusInfo,

    useQueue: storeQueue,
    jobName: storeJobName,
    email: storeEmail,
  } = useSelector((state) => state.qtlsGWAS);

  const defaultValues = {
    qtlPublic: false,
    gwasPublic: false,
    ldPublic: false,

    _associationFile: false,
    _quantificationFile: false,
    _genotypeFile: false,
    _gwasFile: false,
    _LDFile: false,

    genome: storeGenome,
    qtlProject: storeQtlProject,
    xQtl: storeXQtl,
    tissue: storeTissue,
    gwasProject: storeGwasProject,
    phenotype: storePhenotype,
    ldProject: storeLdProject,
    select_pop: storePop,

    locusInformation: storeLocusInfo,

    useQueue: storeQueue,
    jobName: storeJobName,
    email: storeEmail,
  };

  const {
    control,
    reset: resetForm,
    resetField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const {
    fields: locusFields,
    append: appendLocus,
    remove: removeLocus,
  } = useFieldArray({
    control,
    name: 'locusInformation',
  });

  const {
    qtlPublic,
    gwasPublic,
    ldPublic,
    _associationFile,
    _quantificationFile,
    _genotypeFile,
    _gwasFile,
    _LDFile,
    genome,
    tissueOnly,
    phenotypeOnly,
    qtlProject,
    xQtl,
    tissue,
    gwasProject,
    phenotype,
    ldProject,
    useQueue,
    locusInformation,
    email,
  } = watch();

  const usePublic =
    qtlPublic ||
    gwasPublic ||
    ldPublic ||
    storeQtlPublic ||
    storeGwasPublic ||
    storeLdPublic;

  const genomeOptions =
    publicGTEx && publicGTEx['cis-QTL dataset']
      ? [
          ...new Set(
            publicGTEx['cis-QTL dataset'].map((row) => row.Genome_build)
          ),
        ].map((genome) => ({
          value: genome,
          label: genome,
        }))
      : [];

  useEffect(() => {
    if (!Object.keys(publicGTEx).length) dispatch(getPublicGTEx());
  }, [publicGTEx]);
  // populate initial params
  useEffect(() => {
    if (Object.keys(publicGTEx).length && genomeOptions.length && !genome)
      populatePublicParameters(genomeOptions[0]);
  }, [publicGTEx, genomeOptions, genome]);

  // automatically enable/disable queue if more locus info panels are added
  useEffect(() => {
    if (locusInformation.length > 1) setValue('useQueue', true);
  }, [locusInformation]);
  // rehydrate form after loading queue results
  useEffect(() => {
    if (storeEmail !== email) resetForm(defaultValues);
  }, [storeEmail]);

  // check form to make sure at least one of the three input types are provided (Association, GWAS, or LD)
  function checkValidity() {
    let count = 0;
    // association
    if (qtlPublic) {
      if (tissue.value) count++;
    } else {
      if (_associationFile) count++;
    }
    // gwas
    if (gwasPublic) {
      if (phenotype.value) count++;
    } else {
      if (_gwasFile) count++;
    }
    // ld
    if (ldPublic) {
      if (ldProject.value) count++;
    } else {
      if (_LDFile) count++;
    }
    setValid(count);
    return count > 0 ? true : false;
  }

  function getProjectOptions(data, genome) {
    return [
      ...new Set(
        data
          .filter((row) => row['Genome_build'] == genome.value)
          .map((row) => row['Project'])
      ),
    ].map((project) => ({ value: project, label: project }));
  }

  function getXqtlOptions(data, genome, project) {
    return [
      ...new Set(
        data
          .filter(
            (row) =>
              row.Genome_build == genome.value && row.Project == project.value
          )
          .map((row) => row.xQTL)
      ),
    ].map((xQtl) => ({ value: xQtl, label: xQtl }));
  }

  function getTissueOptions(data, genome, project, xQtl) {
    return !tissueOnly
      ? data
          .filter(
            (row) =>
              row['Genome_build'] == genome.value &&
              row['Project'] == project.value &&
              row['xQTL'] == xQtl.value
          )
          .map((row) => ({ value: row.Tissue, label: row.Tissue }))
      : data
          .filter((row) => row['Genome_build'] == genome.value)
          .map((row) => ({ value: row.Full_Name, label: row.Full_Name }));
  }

  function getPhenotypeOptions(data, genome, project) {
    return !phenotypeOnly
      ? data
          .filter(
            (row) =>
              row['Genome_build'] == genome.value &&
              row['Project'] == project.value
          )
          .map((row) => ({ value: row.Phenotype, label: row.Phenotype }))
      : data
          .filter((row) => row['Genome_build'] == genome.value)
          .map((row) => ({ value: row.Full_Name, label: row.Full_Name }));
  }

  function populatePublicParameters(genome) {
    const qtlData = publicGTEx['cis-QTL dataset'];
    const ldData = publicGTEx['LD dataset'];
    const gwasData = publicGTEx['GWAS dataset'];

    const qtlProjectOptions = getProjectOptions(qtlData, genome);
    const xQtlOptions = getXqtlOptions(qtlData, genome, qtlProjectOptions[0]);
    const tissueOptions = getTissueOptions(
      qtlData,
      genome,
      qtlProjectOptions[0],
      xQtlOptions[0]
    );

    const ldProjectOptions = getProjectOptions(ldData, genome);

    const gwasProjectOptions = getProjectOptions(gwasData, genome);
    const phenotypeOptions = gwasProjectOptions.length
      ? getPhenotypeOptions(gwasData, genome, gwasProjectOptions[0])
      : [];

    setValue('genome', genome);
    setValue('qtlProject', qtlProjectOptions[0]);
    setValue('xQtl', xQtlOptions[0]);
    setValue('tissue', tissueOptions[0]);
    setValue('gwasProject', gwasProjectOptions[0]);
    setValue('phenotype', phenotypeOptions[0]);
    setValue('ldProject', ldProjectOptions[0]);
  }

  function handleQtlProject(project) {
    const data = publicGTEx['cis-QTL dataset'];
    const xQtlOptions = getXqtlOptions(data, genome, project);
    const tissueOptions = getTissueOptions(
      data,
      genome,
      project,
      xQtlOptions[0]
    );

    setValue('qtlProject', project);
    setValue('xQtl', xQtlOptions[0]);
    setValue('tissue', tissueOptions[0]);
  }

  function handleGwasProject(project) {
    const data = publicGTEx['GWAS dataset'];
    const phenotypeOptions = getPhenotypeOptions(data, genome, project);

    setValue('gwasProject', project);
    setValue('phenotype', phenotypeOptions[0]);
  }

  // qtl type
  function handleXqtl(xQtl) {
    const data = publicGTEx['cis-QTL dataset'];
    const tissueOptions = getTissueOptions(data, genome, qtlProject, xQtl);

    setValue('xQtl', xQtl);
    setValue('tissue', tissueOptions[0]);
  }

  const handleReset = () => {
    window.location.hash = '#/qtls';
    resetForm();
    setValid(null);
    dispatch(
      updateQTLsGWAS({ ...getInitialState().qtlsGWAS, publicGTEx: publicGTEx })
    );
    dispatch(updateAlert(getInitialState().alert));
  };

  async function onSubmit(data) {
    if (!checkValidity()) {
      return;
    }
    dispatch(updateQTLsGWAS(data));
    const request = crypto.randomUUID();

    await dispatch(
      uploadFile({
        associationFile: data._associationFile,
        quantificationFile: data._quantificationFile,
        genotypeFile: data._genotypeFile,
        LDFile: data._LDFile,
        gwasFile: data._gwasFile,
        associationFileName: data._associationFile
          ? _associationFile.name
          : false,
        quantificationFileName: data._quantificationFile
          ? _quantificationFile.name
          : false,
        genotypeFileName: data._genotypeFile ? _genotypeFile.name : false,
        LDFileName: data._LDFile ? _LDFile.name : false,
        gwasFileName: data._gwasFile ? _gwasFile.name : false,
        request,
      })
    );

    const params = data.locusInformation.map((locusInfo, locusIndex) => {
      const { select_dist, select_ref, select_position, select_chromosome } =
        locusInfo;

      const qtlKey = qtlPublic
        ? tissueOnly
          ? publicGTEx['cis-QTL dataset']
              .filter(
                (row) =>
                  row.Genome_build == genome.value &&
                  row.Full_Name == tissue.value
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
              )
        : false;

      const gwasKey = gwasPublic
        ? phenotypeOnly
          ? publicGTEx['GWAS dataset']
              .filter(
                (row) =>
                  row.Genome_build == genome.value &&
                  row.Full_Name == phenotype.value
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
              )
        : false;

      const ldKey =
        ldPublic && Object.entries(select_chromosome).length
          ? ldProject.value == '1000genomes'
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
            : false
          : false;

      dispatch(
        updateQTLsGWAS({ qtlKey: qtlKey, gwasKey: gwasKey, ldKey: ldKey })
      );

      return {
        jobName: data.jobName
          ? `${data.jobName} - ${locusIndex}`
          : `ezQTL - ${locusIndex}`,
        request: `${request}-${locusIndex}`,
        email: data.email,
        useQueue: data.useQueue,
        submitted: true,
        associationFile: data._associationFile.name || false,
        associationFileName: data._associationFile.name || false,
        quantificationFile: data._quantificationFile.name || false,
        genotypeFile: data._genotypeFile.name || false,
        gwasFile: data._gwasFile.name || false,
        gwasFileName: data._gwasFile.name || false,
        LDFile: data._LDFile.name || false,
        LDFileName: data._LDFile.name || false,
        select_pop: data.select_pop,
        select_gene,
        select_dist,
        select_ref,
        recalculateAttempt,
        recalculatePop,
        recalculateGene,
        recalculateDist,
        recalculateRef,
        qtlPublic: data.qtlPublic,
        gwasPublic: data.gwasPublic,
        ldPublic: data.ldPublic,
        qtlKey,
        ldKey,
        gwasKey,
        select_chromosome: select_chromosome.value || false,
        select_position: select_position,
        genome_build: data.genome.value,
        genome: data.genome,
        qtlProject: data.qtlProject,
        ldProject: data.ldProject,
        xQtl: data.xQTL,
        tissue: data.tissue,
        gwasProject: data.gwasProject,
        phenotype: data.phenotype,
      };
    });

    if (data.useQueue) {
      dispatch(
        submitLong({
          params: params.length > 1 ? params : { ...params[0], request },
          multi: params.length > 1,
          request,
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
                <Controller
                  name="qtlPublic"
                  control={control}
                  render={({ field }) => (
                    <Form.Check
                      {...field}
                      type="checkbox"
                      inline
                      id="qtlPublic"
                      title="Association Public Data Checkbox"
                      disabled={submitted}
                      label="Public"
                      checked={qtlPublic || storeQtlPublic}
                      onChange={(_) => {
                        setValue('qtlPublic', !qtlPublic);
                        resetField('_qtlFile');
                      }}
                    />
                  )}
                />
              </div>
              {qtlPublic || storeQtlPublic ? (
                <div className="mt-2">
                  <Row>
                    <Col>
                      <Controller
                        name="tissueOnly"
                        control={control}
                        render={({ field }) => (
                          <Form.Check
                            {...field}
                            title="Association (QTL) Public Data Tissue Only Checkbox"
                            id="tissueOnly"
                            label="Tissue Only"
                            type="checkbox"
                            checked={tissueOnly}
                            disabled={
                              submitted ||
                              isLoading ||
                              fetchingOptions ||
                              !Object.keys(publicGTEx).length
                            }
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  {!tissueOnly && (
                    <>
                      <Row>
                        <Col>
                          <Controller
                            name="qtlProject"
                            control={control}
                            rules={{ required: qtlPublic && !tissueOnly }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                disabled={
                                  isLoading || fetchingOptions || submitted
                                }
                                id="qtlProject"
                                label="Project"
                                options={getProjectOptions(
                                  publicGTEx['cis-QTL dataset'],
                                  genome
                                )}
                                onChange={handleQtlProject}
                              />
                            )}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Controller
                            name="xQtl"
                            control={control}
                            rules={{ required: qtlPublic && !tissueOnly }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                disabled={
                                  isLoading || fetchingOptions || submitted
                                }
                                id="qtlType"
                                label="QTL Type"
                                value={xQtl}
                                options={getXqtlOptions(
                                  publicGTEx['cis-QTL dataset'],
                                  genome,
                                  qtlProject
                                )}
                                onChange={handleXqtl}
                              />
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row>
                    <Col>
                      <Controller
                        name="tissue"
                        control={control}
                        rules={{ required: qtlPublic }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            disabled={isLoading || fetchingOptions || submitted}
                            id="tissue"
                            label="Tissue"
                            options={getTissueOptions(
                              publicGTEx['cis-QTL dataset'],
                              genome,
                              qtlProject,
                              xQtl
                            )}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </div>
              ) : (
                <Controller
                  name="_associationFile"
                  control={control}
                  render={({ field }) => (
                    <Form.File
                      {...field}
                      id="qtls-association-file"
                      value=""
                      title="Association (QTL) Data User File Upload Input"
                      disabled={submitted}
                      label={
                        associationFileName ||
                        associationFile ||
                        _associationFile.name ||
                        'Choose File'
                      }
                      onChange={(e) => {
                        if (e.target.files.length) {
                          setValue('_associationFile', e.target.files[0]);
                        }
                      }}
                      isInvalid={errors._associationFile}
                      feedback="Please upload a data file"
                      custom
                    />
                  )}
                />
              )}
            </Form.Group>
            <Form.Group className="col-sm-12">
              <div className="d-flex">
                <Form.Label className="mb-0 mr-auto">GWAS Data</Form.Label>
                <Controller
                  name="gwasPublic"
                  control={control}
                  render={({ field }) => (
                    <Form.Check
                      {...field}
                      type="checkbox"
                      inline
                      id="gwasSource"
                      title="GWAS Public Data Checkbox"
                      disabled={submitted}
                      label="Public"
                      checked={gwasPublic || storeGwasPublic}
                      onChange={(_) => {
                        setValue('gwasPublic', !gwasPublic);
                        resetField('_gwasFile');
                      }}
                    />
                  )}
                />
              </div>
              {gwasPublic || storeGwasPublic ? (
                <div className="mt-2">
                  <Row>
                    <Col>
                      <Controller
                        name="phenotypeOnly"
                        control={control}
                        render={({ field }) => (
                          <Form.Check
                            {...field}
                            title="GWAS Public Data Phenotype Only Checkbox"
                            id="phenotypeOnly"
                            label="Phenotype Only"
                            type="checkbox"
                            checked={phenotypeOnly}
                            disabled={
                              submitted ||
                              isLoading ||
                              fetchingOptions ||
                              !Object.keys(publicGTEx).length
                            }
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  {!phenotypeOnly && (
                    <Row>
                      <Col>
                        <Select
                          disabled={submitted || isLoading || fetchingOptions}
                          id="gwasProject"
                          label="Project"
                          value={gwasProject}
                          options={getProjectOptions(
                            publicGTEx['GWAS dataset'],
                            genome
                          )}
                          onChange={handleGwasProject}
                        />
                      </Col>
                    </Row>
                  )}

                  <Row>
                    <Col>
                      <Controller
                        name="phenotype"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            disabled={submitted || isLoading || fetchingOptions}
                            id="gwasPhenotype"
                            label="Phenotype"
                            options={getPhenotypeOptions(
                              publicGTEx['GWAS dataset'],
                              genome,
                              gwasProject
                            )}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </div>
              ) : (
                <Controller
                  name="_gwasFile"
                  control={control}
                  render={({ field }) => (
                    <Form.File
                      {...field}
                      id="qtls-gwas-file"
                      value=""
                      title="GWAS Data User File Upload Input"
                      disabled={submitted}
                      label={
                        gwasFileName ||
                        gwasFile ||
                        _gwasFile.name ||
                        'Choose File'
                      }
                      onChange={(e) => {
                        if (e.target.files.length) {
                          setValue('_gwasFile', e.target.files[0]);
                        }
                      }}
                      isInvalid={errors._gwasFile}
                      feedback="Please upload a data file"
                      custom
                    />
                  )}
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
                onClick={() => {
                  toggleQuantification(!useQuantification);
                  resetField('_quantificationFile');
                  resetField('_genotypeFile');
                }}
                disabled={submitted}
              >
                {useQuantification ? '- Remove ' : '+ Add '} QTL Raw Data
              </Button>
            </Col>
          </Row>
          {(useQuantification ||
            (submitted &&
              (_quantificationFile ||
                _genotypeFile ||
                quantificationFile ||
                genotypeFile))) && (
            <>
              <Row>
                <Form.Group className="col-sm-12">
                  <Form.Label className="mb-0">Quantification Data</Form.Label>
                  <Controller
                    name="_quantificationFile"
                    control={control}
                    rules={{ required: useQuantification }}
                    render={({ field }) => (
                      <Form.File
                        {...field}
                        id="qtls-quantification-file"
                        value=""
                        title="Quantification Data User File Upload Input"
                        disabled={submitted}
                        label={
                          quantificationFile ||
                          _quantificationFile.name ||
                          'Choose File'
                        }
                        onChange={(e) => {
                          if (e.target.files.length) {
                            setValue('_quantificationFile', e.target.files[0]);
                          }
                        }}
                        isInvalid={errors._quantificationFile}
                        feedback="Please input accompanying Quantification Data File with
                        Genotype Data File."
                        custom
                      />
                    )}
                  />
                </Form.Group>
                <Form.Group className="col-sm-12">
                  <Form.Label className="mb-0">Genotype Data</Form.Label>
                  <Controller
                    name="_quantificationFile"
                    control={control}
                    rules={{ required: useQuantification }}
                    render={({ field }) => (
                      <Form.File
                        {...field}
                        id="qtls-genotype-file"
                        value=""
                        title="Genotype Data User File Upload Input"
                        disabled={submitted}
                        label={
                          genotypeFile || _genotypeFile.name || 'Choose File'
                        }
                        onChange={(e) => {
                          if (e.target.files.length) {
                            setValue('_genotypeFile', e.target.files[0]);
                          }
                        }}
                        isInvalid={errors._quantificationFile}
                        feedback="Please input accompanying Genotype Data File with
                        Quantification Data File."
                        custom
                      />
                    )}
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
              <Form.Label className="mb-0 mr-auto">LD Data</Form.Label>
              <Controller
                name="ldPublic"
                control={control}
                render={({ field }) => (
                  <Form.Check
                    {...field}
                    type="checkbox"
                    inline
                    id="ldPublic"
                    title="LD Public Data Checkbox"
                    disabled={submitted}
                    label="Public"
                    checked={ldPublic || storeLdPublic}
                    onChange={(_) => {
                      setValue('select_pop', false);
                      setValue('ldPublic', !ldPublic);
                      resetField('_LDFile');
                    }}
                  />
                )}
              />
            </div>
            {ldPublic || storeLdPublic ? (
              <div>
                <Form.Row>
                  <Col>
                    <Controller
                      name="ldProject"
                      control={control}
                      rules={{ required: ldPublic }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          disabled={isLoading || fetchingOptions || submitted}
                          id="ldProject"
                          label="Project"
                          options={getProjectOptions(
                            publicGTEx['LD dataset'],
                            genome
                          )}
                        />
                      )}
                    />
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col>
                    {ldProject.value != 'UKBB' ? (
                      <>
                        <Form.Label id="population-select" className="mb-0">
                          Population <span style={{ color: 'red' }}>*</span>{' '}
                        </Form.Label>
                        <PopulationSelect
                          id="qtls-results-population-input-asdf"
                          ariaLabel="population-select"
                          disabled={
                            submitted || !ldPublic || ldProject.value == 'UKBB'
                          }
                          Controller={Controller}
                          setValue={setValue}
                          control={control}
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
              <Controller
                name="_LDFile"
                control={control}
                render={({ field }) => (
                  <Form.File
                    {...field}
                    id="qtls-ld-file"
                    value=""
                    disabled={submitted}
                    label={
                      LDFileName || LDFile || _LDFile.name || 'Choose File'
                    }
                    onChange={(e) => {
                      if (e.target.files.length) {
                        setValue('_LDFile', e.target.files[0]);
                      }
                    }}
                    isInvalid={errors._LDFile}
                    feedback="Please upload a data file"
                    custom
                  />
                )}
              />
            )}
          </Form.Group>
        </Row>
      ),
    },
    {
      title: 'Locus Information',
      component: locusFields.map((item, index) => (
        <div key={item.id}>
          <div className="border rounded p-2 mb-1">
            <Form.Row>
              {index > 0 && (
                <Col className="d-flex justify-content-end">
                  <Button
                    className="text-danger p-0"
                    style={{
                      textDecoration: 'underline',
                      fontSize: '.8rem',
                    }}
                    variant="link"
                    size="sm"
                    onClick={() => removeLocus(index)}
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
                    <i>(+/- Kb up to 1Mb)</i>
                  </small>{' '}
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={
                      <Popover id="popover-basic" style={{ zIndex: 9999 }}>
                        <Popover.Title as="h3">cis-QTL Distance</Popover.Title>
                        <Popover.Content>
                          <p>
                            Please be aware that a large cis-QTL distance will
                            significantly increase the running time of the job,
                            and the job may fail due to the large extracted data
                            size.
                          </p>
                        </Popover.Content>
                      </Popover>
                    }
                    rootClose
                  >
                    <Button
                      variant="link"
                      className="p-0 font-weight-bold"
                      aria-label="collapse data info"
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ verticalAlign: 'baseline' }}
                      />
                    </Button>
                  </OverlayTrigger>
                </Form.Label>
                <Controller
                  name={`locusInformation.${index}.select_dist`}
                  control={control}
                  rules={{ required: true, min: 1, max: 1000 }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      title="cis-QTL Distance Input"
                      aria-label="cis-QTL Distance Input"
                      type="number"
                      min="1"
                      max="1000"
                      id="qtls-distance-input"
                      disabled={submitted}
                      isInvalid={
                        errors.locusInformation &&
                        errors.locusInformation[index]?.select_dist
                      }
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  Enter distance between 1 and 1000Kb.
                </Form.Control.Feedback>
              </Col>
            </Form.Row>
            {usePublic ? (
              <>
                <Form.Row>
                  <Col>
                    <Controller
                      name={`locusInformation.${index}.select_chromosome`}
                      control={control}
                      rules={{ required: usePublic }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="mb-0"
                          disabled={submitted}
                          id="chromosome"
                          label={
                            <>
                              Chromosome <span style={{ color: 'red' }}>*</span>
                            </>
                          }
                          placeholder={'Select Chromosome'}
                          // value={select_chromosome}
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
                          // onChange={(chromosome) => {
                          //   mergeLocusInfo({ select_chromosome: chromosome });
                          // }}
                        />
                      )}
                    />
                    {errors.locusInformation &&
                      errors.locusInformation[index]?.select_chromosome && (
                        <div
                          className="text-danger"
                          style={{ fontSize: '80%' }}
                        >
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
                    <Controller
                      name={`locusInformation.${index}.select_position`}
                      control={control}
                      rules={{ required: usePublic }}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          title="LD Reference Position Input"
                          aria-label="LD Refereence Position Input"
                          id="select_position"
                          disabled={submitted}
                          placeholder="e.g. 42743496"
                          isInvalid={
                            errors.locusInformation &&
                            errors.locusInformation[index]?.select_position
                          }
                        />
                      )}
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
                  <Controller
                    name={`locusInformation.${index}.select_ref`}
                    control={control}
                    rules={{
                      required: _LDFile && !_gwasFile && !_associationFile,
                      pattern: /^rs\d+$/,
                    }}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        title="LD Reference SNP Input"
                        aria-label="LD Refereence SNP Input"
                        id="qtls-snp-input"
                        disabled={submitted}
                        isInvalid={
                          errors.locusInformation &&
                          errors.locusInformation[index]?.select_ref
                        }
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter a valid RS number
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            )}
          </div>

          <Row>
            {index == locusFields.length - 1 && (
              <Col className="d-flex justify-content-end">
                <Button
                  className="p-0"
                  variant="link"
                  title="Add Locus Information"
                  aria-label="Add Locus Information"
                  onClick={() =>
                    appendLocus(getInitialState().qtlsGWAS.locusInformation[0])
                  }
                  disabled={submitted}
                >
                  + Add Locus
                </Button>
              </Col>
            )}
          </Row>
        </div>
      )),
    },
  ];

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col>
          <Controller
            name="genome"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                className="border rounded p-2"
                disabled={!genomeOptions.length || submitted}
                id="genome"
                label="Genome Build"
                options={genomeOptions}
                onChange={(e) => {
                  setValue('genome', e);
                  populatePublicParameters(e);
                }}
              />
            )}
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
                <Controller
                  name="useQueue"
                  control={control}
                  render={({ field }) => (
                    <Form.Check.Input
                      {...field}
                      className="mr-0"
                      title="Long Job Submission"
                      type="checkbox"
                      checked={useQueue}
                      disabled={submitted || locusInformation.length > 1}
                    />
                  )}
                />
              </Form.Check>
              <Form.Label className="mr-auto">Submit Long Job</Form.Label>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="jobName" className="mb-2">
              <Controller
                name="jobName"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    title="Job Name Input"
                    aria-label="Job Name Input"
                    placeholder="Job Name"
                    size="sm"
                    type="text"
                    disabled={!useQueue || submitted}
                  />
                )}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: useQueue,
                  pattern:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    title="Queued Submission Email Input"
                    aria-label="Queued Submission Email Input"
                    placeholder="Enter Email"
                    size="sm"
                    type="email"
                    disabled={!useQueue || submitted}
                    isInvalid={errors.email}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                <i>
                  Note: When computation is completed, a notification will be
                  sent to your e-mail.
                </i>
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </div>
      <Row className="mt-2">
        {valid == 0 && (
          <Col sm="12">
            <div className="text-danger">
              Please enter Association, GWAS, or LD data
            </div>
          </Col>
        )}
        <Col sm="6">
          <Button
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
            className="w-100"
            variant="primary"
            type="submit"
            disabled={submitted || isLoading || fetchingOptions}
          >
            {useQueue ? 'Submit' : 'Calculate'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
