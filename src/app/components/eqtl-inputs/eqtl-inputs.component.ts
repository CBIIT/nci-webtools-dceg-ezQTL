import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

// declare var $; // declare jquery $
// import * as $ from 'jquery';
declare let $: any;

@Component({
  selector: 'app-eqtl-inputs',
  templateUrl: './eqtl-inputs.component.html',
  styleUrls: ['./eqtl-inputs.component.css']
})

export class EqtlInputsComponent implements OnInit {

  eqtlForm = new FormGroup({
    associationFile: new FormControl('', Validators.required),
    expressionFile: new FormControl(''), 
    genotypeFile: new FormControl(''), 
    gwasFile: new FormControl('')
  });

  mainData: Object;
  resultStatus: boolean;
  errorMessage: string;
  warningMessage: string;
  public resetColor = null;
  selectLoadBoxplotData: boolean;
  selectLoadGWASData: boolean;
  selectedTab: number;
  popoverData: Object;

  constructor(private cdr: ChangeDetectorRef, private data: EqtlResultsService) { }

  ngAfterViewChecked(){
      this.data.currentWarningMessage.subscribe(warningMessage => {
        this.warningMessage = warningMessage;
      });
      this.cdr.detectChanges();
  }

  ngOnInit() {
    // this.eqtlForm.valueChanges.subscribe(formValue => {
    //   // console.log(formValue);
    // });

    this.data.currentMainData.subscribe(mainData => this.mainData = mainData);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentSelectedTab.subscribe(selectedTab => this.selectedTab = selectedTab);
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
    if (this.selectLoadBoxplotData == true) {
      this.eqtlForm.setControl('expressionFile', new FormControl(''));
      this.eqtlForm.setControl('genotypeFile', new FormControl(''));
      this.selectLoadBoxplotData = false;
      this.eqtlForm.value.expressionFile = false;
      this.eqtlForm.value.genotypeFile = false;
      $("#expression-file").val("");
      $("#genotype-file").val("");
      $("#eqtl-input-expression-file").addClass("disabled-overlay");
      $("#eqtl-input-genotype-file").addClass("disabled-overlay");
      $("#expression-file").prop("disabled", true);
      $("#genotype-file").prop("disabled", true);
      this.data.changeDisableGeneExpressions(true);
    } else {
      this.eqtlForm.setControl('expressionFile', new FormControl('', Validators.required));
      this.eqtlForm.setControl('genotypeFile', new FormControl('', Validators.required));
      this.selectLoadBoxplotData = true;
      $("#eqtl-input-expression-file").removeClass("disabled-overlay");
      $("#eqtl-input-genotype-file").removeClass("disabled-overlay");
      $("#expression-file").prop("disabled", false);
      $("#genotype-file").prop("disabled", false);
      this.data.changeDisableGeneExpressions(false);
    }
  }

  loadGWASData() {
    if (this.selectLoadGWASData == true) {
      this.eqtlForm.setControl('gwasFile', new FormControl(''));
      this.selectLoadGWASData = false;
      this.eqtlForm.value.gwasFile = false;
      $("#gwas-file").val("");
      $("#eqtl-input-gwas-file").addClass("disabled-overlay");
      $("#gwas-file").prop("disabled", true);
    } else {
      this.eqtlForm.setControl('gwasFile', new FormControl('', Validators.required));
      this.selectLoadGWASData = true;
      $("#eqtl-input-gwas-file").removeClass("disabled-overlay");
      $("#gwas-file").prop("disabled", false);
    }
  }

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  async submit() {
    this.data.changeResultStatus(true);
    
    const { associationFile, expressionFile, genotypeFile, gwasFile } = this.eqtlForm.value;
    // console.log([expressionFile[0].name, genotypeFile[0].name, associationFile[0].name]);
    // console.log(this.eqtlForm.value);
    // console.log(associationFile);
    // console.log(expressionFile);
    // console.log(genotypeFile);
    // console.log(gwasFile);

    const formData = new FormData();
    formData.append('request_id', Date.now().toString()); // generate calculation request ID
    formData.append('select_pop', "false"); // set default population to 'false' -> 'EUR' in R
    formData.append('select_gene', "false"); // set default gene to 'false' -> QData top gene in R
    formData.append('select_ref', "false"); // set default rsnum to 'false' -> QData top gene's rsnum in R
    formData.append('recalculatePopGene', "false");
    formData.append('recalculateLD', "true");
    formData.append('association-file', associationFile[0]);
    if (this.selectLoadBoxplotData) {
      formData.append('expression-file', expressionFile[0]);
      formData.append('genotype-file', genotypeFile[0]);
    }
    if (this.selectLoadGWASData) {
      formData.append('gwas-file', gwasFile[0]);
    }

    this.data.calculateMain(formData)
      .subscribe(
        res => this.data.changeMainData(res),
        error => this.handleError(error)
      )
  } 

  reset() {
    this.selectLoadBoxplotData = false;
    this.selectLoadGWASData = false;
    this.data.changeResultStatus(false);
    this.data.changeMainData(null);
    this.data.changeErrorMessage('');
    this.data.changeWarningMessage('');
    this.data.changeSelectedTab(0);
    $("#eqtl-input-expression-file").addClass("disabled-overlay");
    $("#eqtl-input-genotype-file").addClass("disabled-overlay");
    $("#eqtl-input-gwas-file").addClass("disabled-overlay");
    $("#expression-file").prop("disabled", true);
    $("#genotype-file").prop("disabled", true);
    $("#gwas-file").prop("disabled", true);
    this.eqtlForm.setControl('expressionFile', new FormControl(''));
    this.eqtlForm.setControl('genotypeFile', new FormControl(''));
    this.eqtlForm.setControl('gwasFile', new FormControl(''));
    this.data.changeDisableGeneExpressions(true);
  }


}
