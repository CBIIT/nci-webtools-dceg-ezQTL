import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';

export function QTLsGWASResultsForm() {
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

    return (
        <>
        <LoadingOverlay active={isLoading} />
            <Form className="row py-1 px-2 justify-content-between">
                <div className="col-md-9">
                    <Form.Group className="row">
                        <div className="col-md-4">
                            <Form.Label className="mb-0">
                                Population
                            </Form.Label>
                            <Form.Control
                                as="select"
                                // value={inputFormat}
                                // onChange={(e) => selectFormat(e.target.value)}
                                disabled={!submitted}
                                custom>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Control>
                        </div>
                        <div className="col-md-4">
                            <Form.Label className="mb-0">
                                Reference Gene
                            </Form.Label>
                            <Form.Control 
                                id="qtls-results-gene-input"
                                disabled={!submitted}
                                value="100"
                                // custom
                            />
                        </div>
                        <div className="col-md-4">
                            <Form.Label className="mb-0">
                                LD Reference SNP
                            </Form.Label>
                            <Form.Control 
                                id="qtls-results-snp-input"
                                disabled={!submitted}
                                value="100"
                                // custom
                            />
                        </div>
                    </Form.Group>
                </div>
                <div className="col-md-auto">
                    <Form.Label className="mb-0">
                        
                    </Form.Label>
                    <Button
                        disabled={!submitted}
                        className="d-block"
                        variant="primary"
                        type="button"
                        // onClick={() => {
                        //     if (validateForm()) handleSubmit();
                        // }}
                        >
                        Recalculate
                    </Button>
                </div>
            </Form>
        </>
    )
}