import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions, getInitialState } from '../../../services/store';

export function QTLsGWASForm() {
    const dispatch = useDispatch();

    const {
        loadSampleQTLs,
        loadSampleGWAS,
        associationFile,
        quantificationFile,
        genotypeFile,
        ldFile,
        gwasFile,
        distance,
        refSNP,
        population,
        refGene,
        refSNPPost,
        submitted,
        isLoading
    } = useSelector(({ezQTL}) => ezQTL.qtlsGWAS);

    const handleReset = () => {
        console.log("reset!");
        const initialState = getInitialState();
        console.log(initialState['qtlsGWAS']);
        dispatch(actions.updateKey({ 
            key: 'qtlsGWAS', 
            data: initialState['qtlsGWAS']
        }));
    };

    return (
        <Form className="py-1 px-2">
            <Form.Group className="row">
                <div className="col-sm-6">
                    <b>QTLs Data Files</b>
                </div>
                <div className="col-sm-6">
                    {
                        !loadSampleQTLs ? 
                        <>
                            <Button variant="link"
                                onClick={(_) => {
                                    dispatch(actions.updateKey({ 
                                        key: 'qtlsGWAS', 
                                        data: {loadSampleQTLs: true}
                                    }));
                                }}>
                                <i className="fa fa-file mr-1" style={{color: 'black'}}></i> 
                                Load Sample Files
                            </Button>
                        </> :
                        <>
                            <Button variant="link"
                                onClick={(_) => {
                                    dispatch(actions.updateKey({ 
                                        key: 'qtlsGWAS', 
                                        data: {loadSampleQTLs: false}
                                    }));
                                }}>
                                <i className="fa fa-file mr-1" style={{color: 'black'}}></i> 
                                Unload Sample Files
                            </Button>
                        </>
                    }
                </div>
                <div className="col-sm-12">
                    <small>
                        <i>
                            Upload locus specific region, &le; 5Mb size
                        </i>
                    </small>
                </div>
                <div className="w-100 border border-top mx-3 my-2"></div>
                <div className="col-sm-12">
                    <Form.Label className="mb-0">
                        Association (QTL) Data File <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.File 
                        id="qtls-association-file"
                        disabled={submitted || loadSampleQTLs}
                        label={
                            associationFile ? associationFile.name : 
                            loadSampleQTLs ? 'MX2.eQTL.txt' : 'Choose File'
                        }
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
                    <Form.Label className="mb-0">
                        Quantification Data File
                    </Form.Label>
                    <Form.File 
                        id="qtls-quantification-file"
                        disabled={submitted || loadSampleQTLs}
                        label={
                            quantificationFile ? quantificationFile.name : 
                            loadSampleQTLs ? 'MX2.quantification.txt' : 'Choose File'
                        }
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
                    <Form.Label className="mb-0">
                        Genotype Data File
                    </Form.Label>
                    <Form.File 
                        id="qtls-genotype-file"
                        disabled={submitted || loadSampleQTLs}
                        label={
                            genotypeFile ? genotypeFile.name : 
                            loadSampleQTLs ? 'MX2.genotyping.txt' : 'Choose File'
                        }
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
                    <Form.Label className="mb-0">
                        LD Data File <small><i>(Default: 1KG Phase 3, EUR)</i></small>
                    </Form.Label>
                    <Form.File 
                        id="qtls-ld-file"
                        disabled={submitted || loadSampleQTLs}
                        label={
                            ldFile ? ldFile.name : 
                            loadSampleQTLs ? 'MX2.LD.gz' : 'Choose File'
                        }
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
                    {
                        !loadSampleGWAS ? 
                        <>
                            <Button variant="link"
                                onClick={(_) => {
                                    dispatch(actions.updateKey({ 
                                        key: 'qtlsGWAS', 
                                        data: {loadSampleGWAS: true}
                                    }));
                                }}>
                                <i className="fa fa-file mr-1" style={{color: 'black'}}></i> 
                                Load Sample File
                            </Button>
                        </> :
                        <>
                            <Button variant="link"
                                onClick={(_) => {
                                    dispatch(actions.updateKey({ 
                                        key: 'qtlsGWAS', 
                                        data: {loadSampleGWAS: false}
                                    }));
                                }}>
                                <i className="fa fa-file mr-1" style={{color: 'black'}}></i> 
                                Unload Sample File
                            </Button>
                        </>
                    }
                </div>
                <div className="col-sm-12">
                    <small>
                        <i>
                            Upload locus specific region, &le; 5Mb size
                        </i>
                    </small>
                </div>
                <div className="w-100 border border-top mx-3 my-2"></div>
                <div className="col-sm-12">
                    <Form.Label className="mb-0">
                        GWAS Data File 
                    </Form.Label>
                    <Form.File 
                        id="qtls-gwas-file"
                        disabled={submitted || loadSampleGWAS}
                        label={
                            gwasFile ? gwasFile.name : 
                            loadSampleGWAS ? 'MX2.GWAS.rs.txt' : 'Choose File'
                        }
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
                        cis-QTL Distance <span style={{ color: 'red' }}>*</span> <small><i>(+/- Kb up to 5Mb)</i></small>
                    </Form.Label>
                    <Form.Control 
                        id="qtls-distance-input"
                        // disabled={submitted}
                        onChange={(e) => {
                            dispatch(actions.updateKey({ 
                                key: 'qtlsGWAS', 
                                data: {distance: e.target.value}
                            }));
                        }}
                        value={distance}
                        // custom
                    />
                </div>
                <div className="col-sm-12">
                    <Form.Label className="mb-0">
                        SNP <small><i>(Default: lowest GWAS P-value SNP)</i></small>
                    </Form.Label>
                    <Form.Control 
                        id="qtls-snp-input"
                        // disabled={submitted}
                        onChange={(e) => {
                            dispatch(actions.updateKey({ 
                                key: 'qtlsGWAS', 
                                data: {refSNP: e.target.value}
                            }));
                        }}
                        value={refSNP}
                        // custom
                    />
                </div>
            </Form.Group>
            <div className="row mb-4">
                <div className="w-100 border border-top mx-3 my-2"></div>
                <div className="col-sm-12">
                    <i className="fa fa-download mr-1"></i> 
                    <a href="javascript:void(0)">Download Example Data</a>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <Button
                        // disabled={submitted || loading.active}
                        className="w-100"
                        variant="primary"
                        type="button"
                        // onClick={() => {
                        //     if (validateForm()) handleSubmit();
                        // }}
                        >
                        Submit
                    </Button>
                </div>
                <div className="col-sm-6">
                    <Button
                        // disabled={loading.active}
                        className="w-100"
                        variant="secondary"
                        onClick={() => handleReset()}
                        >
                        Reset
                    </Button>
                </div>
            </div>
        </Form>
    )
}