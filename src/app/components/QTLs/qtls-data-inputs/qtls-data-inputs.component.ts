import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

// declare var $; // declare jquery $
// import * as $ from 'jquery';
declare let $: any;

export interface GTExDataset {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-qtls-data-inputs',
  templateUrl: './qtls-data-inputs.component.html',
  styleUrls: ['./qtls-data-inputs.component.css']
})

export class QTLsDataInputsComponent implements OnInit {

  qtlsForm = new FormGroup({
    associationFile: new FormControl({value: '', disabled: false}, Validators.required),
    expressionFile: new FormControl({value: '', disabled: true}), 
    genotypeFile: new FormControl({value: '', disabled: true}), 
    gwasFile: new FormControl({value: '', disabled: true}),
    LDFile: new FormControl({value: '', disabled: true})
  });

  mainData: Object;
  resultStatus: boolean;
  errorMessage: string;
  warningMessage: string;
  public resetColor = null;
  selectLoadBoxplotData: boolean;
  selectLoadGWASData: boolean;
  selectLoadLDData: boolean;
  selectedTab: number;
  popoverData: Object;
  qtlsType: string;

  GTExDatasets: GTExDataset[] = [
    {value: 'ds-0', viewValue: 'Dataset 1'},
    {value: 'ds-1', viewValue: 'Dataset 2'},
    {value: 'ds-2', viewValue: 'Dataset 3'}
  ];

  constructor(private cdr: ChangeDetectorRef, private data: QTLsResultsService) { }

  // ngAfterViewChecked(){
  //     this.data.currentWarningMessage.subscribe(warningMessage => {
  //       this.warningMessage = warningMessage;
  //     });
  //     this.cdr.detectChanges();
  // }

  ngOnInit() {
    // this.qtlsForm.valueChanges.subscribe(formValue => {
    //   // console.log(formValue);
    // });

    this.data.currentMainData.subscribe(mainData => this.mainData = mainData);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentSelectedTab.subscribe(selectedTab => this.selectedTab = selectedTab);
    this.data.currentQtlsType.subscribe(qtlsType => {
      this.qtlsType = qtlsType;
    });
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
    this.selectLoadLDData = false;
  }

  clearAssociationFile() {
    this.qtlsForm.setControl('associationFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.value.associationFile = false;
    $("#association-file").val("");
  }

  clearExpressionFile() {
    this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.value.expressionFile = false;
    $("#expression-file").val("");
  }

  clearGenotypeFile() {
    this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.value.genotypeFile = false;
    $("#genotype-file").val("");
  }

  clearGWASFile() {
    this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.value.gwasFile = false;
    $("#gwas-file").val("");
  }

  clearLDFile() {
    this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.value.LDFile = false;
    $("#LD-file").val("");
  }

  loadBoxplotData() {
    if (this.selectLoadBoxplotData == true) {
      this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: true}));
      this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: true}));
      this.selectLoadBoxplotData = false;
      this.qtlsForm.value.expressionFile = false;
      this.qtlsForm.value.genotypeFile = false;
      $("#expression-file").val("");
      $("#genotype-file").val("");
      $("#qtls-data-input-expression-file").addClass("disabled-overlay");
      $("#qtls-data-input-genotype-file").addClass("disabled-overlay");
      // $("#expression-file").prop("disabled", true);
      // $("#genotype-file").prop("disabled", true);
      this.data.changeDisableLocusQuantification(true);
    } else {
      this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: false}, Validators.required));
      this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: false}, Validators.required));
      this.selectLoadBoxplotData = true;
      $("#qtls-data-input-expression-file").removeClass("disabled-overlay");
      $("#qtls-data-input-genotype-file").removeClass("disabled-overlay");
      // $("#expression-file").prop("disabled", false);
      // $("#genotype-file").prop("disabled", false);
      this.data.changeDisableLocusQuantification(false);
    }
  }

  loadGWASData() {
    if (this.selectLoadGWASData == true) {
      this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: true}));
      this.selectLoadGWASData = false;
      this.qtlsForm.value.gwasFile = false;
      $("#gwas-file").val("");
      $("#qtls-data-input-gwas-file").addClass("disabled-overlay");
      // $("#gwas-file").prop("disabled", true);
      this.data.changeDisableLocusColocalization(true);
    } else {
      this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: false}, Validators.required));
      this.selectLoadGWASData = true;
      $("#qtls-data-input-gwas-file").removeClass("disabled-overlay");
      // $("#gwas-file").prop("disabled", false);
      this.data.changeDisableLocusColocalization(false);
    }
  }

  loadLDData() {
    if (this.selectLoadLDData == true) {
      this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: true}));
      this.selectLoadLDData = false;
      this.qtlsForm.value.LDFile = false;
      $("#LD-file").val("");
      $("#qtls-data-input-LD-file").addClass("disabled-overlay");
      // $("#gwas-file").prop("disabled", true);
    } else {
      this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: false}, Validators.required));
      this.selectLoadLDData = true;
      $("#qtls-data-input-LD-file").removeClass("disabled-overlay");
      // $("#gwas-file").prop("disabled", false);
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
    this.data.changeBlurLoad(true);
    $(".blur-loading").addClass("blur-overlay");
    const { associationFile, expressionFile, genotypeFile, gwasFile } = this.qtlsForm.value;
    // console.log([expressionFile[0].name, genotypeFile[0].name, associationFile[0].name]);
    // console.log(this.qtlsForm.value);
    // console.log(associationFile);
    // console.log(expressionFile);
    // console.log(genotypeFile);
    // console.log(gwasFile);

    const formData = new FormData();
    formData.append('request_id', Date.now().toString()); // generate calculation request ID
    formData.append('select_pop', "false"); // set default population to 'false' -> 'EUR' in R
    formData.append('select_gene', "false"); // set default gene to 'false' -> QData top gene in R
    formData.append('select_ref', "false"); // set default rsnum to 'false' -> QData top gene's rsnum in R
    formData.append('recalculateAttempt', "false");
    formData.append('recalculatePop', "false");
    formData.append('recalculateGene', "false");
    formData.append('recalculateRef', "false");
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
        res => {
          this.data.changeMainData(res);
          this.data.changeBlurLoad(false);
          $(".blur-loading").removeClass("blur-overlay");
        },
        error => {
          this.handleError(error);
          this.data.changeBlurLoad(false);
          $(".blur-loading").removeClass("blur-overlay");
        }
      )
  } 

  reset() {
    // this.qtlsType = "assoc";
    this.selectLoadBoxplotData = false;
    this.selectLoadGWASData = false;
    this.selectLoadLDData = false;
    this.data.changeResultStatus(false);
    this.data.changeBlurLoad(false);
    $(".blur-loading").removeClass("blur-overlay");
    this.data.changeMainData(null);
    this.data.changeErrorMessage('');
    this.data.changeQtlsType("assoc");
    // this.data.changeWarningMessage('');
    this.data.changeSelectedTab(0);
    $("#qtls-data-input-expression-file").addClass("disabled-overlay");
    $("#qtls-data-input-genotype-file").addClass("disabled-overlay");
    $("#qtls-data-input-gwas-file").addClass("disabled-overlay");
    $("#qtls-data-input-ld-file").addClass("disabled-overlay");
    $("#qtls-data-input-gtex-select").addClass("disabled-overlay");
    // $("#expression-file").prop("disabled", true);
    // $("#genotype-file").prop("disabled", true);
    // $("#gwas-file").prop("disabled", true);
    this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: true}));
    this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: true}));
    this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: true}));
    this.qtlsForm.setControl('ldFile', new FormControl({valie: '', disabled: true}));
    this.data.changeDisableLocusColocalization(true);
    this.data.changeDisableLocusQuantification(true);
  }


}
