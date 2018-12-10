import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

declare var $; // declare jquery $

@Component({
  selector: 'app-eqtl-inputs',
  templateUrl: './eqtl-inputs.component.html',
  styleUrls: ['./eqtl-inputs.component.css']
})

export class EqtlInputsComponent implements OnInit {

  eqtlForm = new FormGroup({
    expressionFile: new FormControl('', Validators.required), 
    genotypeFile: new FormControl('', Validators.required), 
    associationFile: new FormControl('', Validators.required),
    gwasFile: new FormControl('', Validators.required)
  });

  eqtlData: Object;
  resultStatus: boolean;
  errorMessage: string;
  warningMessage: string;
  public resetColor = null;
  selectLoadBoxplotData: boolean;
  selectLoadGWASData: boolean;


  constructor(private cdr: ChangeDetectorRef, private data: EqtlResultsService) { }

  ngAfterViewChecked(){
      this.data.currentWarningMessage.subscribe(warningMessage => {
        this.warningMessage = warningMessage;
      });
      this.cdr.detectChanges();
  }

  ngOnInit() {
    this.eqtlForm.valueChanges.subscribe(formValue => {
      // console.log(formValue);
    });

    this.data.currentEqtlData.subscribe(eqtlData => this.eqtlData = eqtlData);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentErrorMessage.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
      if (this.errorMessage) {
        this.resetColor = 'warn';
      } else {
        this.resetColor = null;
      }
    });

    this.selectLoadBoxplotData = false;
    this.selectLoadGWASData = false;
  }

  loadBoxplotData() {
    if (this.selectLoadBoxplotData == true && (!this.eqtlForm.value.expressionFile && !this.eqtlForm.value.genotypeFile)) {
      this.selectLoadBoxplotData = false;
      this.eqtlForm.value.expressionFile = false;
      this.eqtlForm.value.genotypeFile = false;
    } else if (this.selectLoadBoxplotData == false || (this.eqtlForm.value.expressionFile && this.eqtlForm.value.genotypeFile)) {
      this.selectLoadBoxplotData = true;
    } else {
      // do nothing
    }
  }

  loadGWASData() {
    if (this.selectLoadGWASData == true && !this.eqtlForm.value.gwasFile) {
      this.selectLoadGWASData = false;
      this.eqtlForm.value.gwasFile = false;
    } else if (this.selectLoadGWASData == false || this.eqtlForm.value.gwasFile) {
      this.selectLoadGWASData = true;
    } else {
      // do nothing
    }
  }

  async submit() {
    this.data.changeResultStatus(true);

    const { expressionFile, genotypeFile, associationFile, gwasFile } = this.eqtlForm.value;
    // console.log([expressionFile[0].name, genotypeFile[0].name, associationFile[0].name]);

    const formData = new FormData();
    formData.append('expression-file', expressionFile[0]);
    formData.append('genotype-file', genotypeFile[0]);
    formData.append('association-file', associationFile[0]);
    formData.append('gwas-file', gwasFile[0]);

    this.data.getResults(formData)
      .subscribe(
        res => this.data.changeEqtlData(res),
        error => this.handleError(error)
      )
    
  } 

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  reset() {
    this.selectLoadBoxplotData = false;
    this.selectLoadGWASData = false;
    this.data.changeResultStatus(false);
    this.data.changeEqtlData(null);
    this.data.changeErrorMessage('');
    this.data.changeWarningMessage('');
  }


}
