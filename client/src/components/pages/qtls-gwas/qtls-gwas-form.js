import React from 'react';
import { Form, Button } from 'react-bootstrap';

export function QTLsGWASForm() {
    return (
        <Form className="py-1 px-2">
            <Form.Group className="row">
                <div className="col-sm-6">
                    <b>QTLs Data Files</b>
                </div>
                <div className="col-sm-6">
                    <i className="fa fa-file mr-1"></i> 
                    <a href="javascript:void(0)">Load Sample Files</a>
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
                        // disabled={submitted}
                        label={
                            // inputFile.size
                            // ? inputFile.name
                            // : storeFilename
                            // ? storeFilename
                            // : 
                            'Choose File'
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
                        // disabled={submitted}
                        label={
                            // inputFile.size
                            // ? inputFile.name
                            // : storeFilename
                            // ? storeFilename
                            // : 
                            'Choose File'
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
                        // disabled={submitted}
                        label={
                            // inputFile.size
                            // ? inputFile.name
                            // : storeFilename
                            // ? storeFilename
                            // : 
                            'Choose File'
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
                        // disabled={submitted}
                        label={
                            // inputFile.size
                            // ? inputFile.name
                            // : storeFilename
                            // ? storeFilename
                            // : 
                            'Choose File'
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
                    <i className="fa fa-file mr-1"></i> 
                    <a href="javascript:void(0)">Load Sample File</a>
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
                        // disabled={submitted}
                        label={
                            // inputFile.size
                            // ? inputFile.name
                            // : storeFilename
                            // ? storeFilename
                            // : 
                            'Choose File'
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
                        value="100"
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
                        // value=""
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
                        // onClick={() => handleReset()}
                        >
                        Reset
                    </Button>
                </div>
            </div>
        </Form>
    )
}