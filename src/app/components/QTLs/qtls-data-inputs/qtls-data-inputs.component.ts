import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    expressionFile: new FormControl({value: '', disabled: false}), 
    genotypeFile: new FormControl({value: '', disabled: false}), 
    gwasFile: new FormControl({value: '', disabled: false}),
    LDFile: new FormControl({value: '', disabled: false})
  });

  mainData: Object;
  resultStatus: boolean;
  errorMessage: string;
  warningMessage: string;
  public resetColor = null;
  // selectLoadBoxplotData: boolean;
  // selectLoadGWASData: boolean;
  // selectLoadLDData: boolean;
  selectedTab: number;
  popoverData: Object;
  qtlsType: string;
  disableQTLsToggle: boolean;

  selectLoadQTLsSamples: boolean;
  selectLoadGWASSample: boolean;
  selectLoadLDSample: boolean;

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
    this.disableQTLsToggle = false;
    this.selectLoadQTLsSamples = false;
    this.selectLoadGWASSample = false;
    this.selectLoadLDSample = false;
  }

  toggleAssocGTEx() {
    console.log(this.qtlsType);
    this.clearAssociationFile();
  }

  clearAssociationFile() {
    this.qtlsForm.setControl('associationFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.value.associationFile = false;
    $("#association-file").val("");
  }

  clearExpressionFile() {
    this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.value.expressionFile = false;
    $("#expression-file").val("");
  }

  clearGenotypeFile() {
    this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.value.genotypeFile = false;
    $("#genotype-file").val("");
  }

  clearGWASFile() {
    this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.value.gwasFile = false;
    $("#gwas-file").val("");
  }

  clearLDFile() {
    this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.value.LDFile = false;
    $("#LD-file").val("");
  }

  loadQTLsSampleDataFiles() { // if user unloads sample QTLs data files
    if (this.selectLoadQTLsSamples == true) {
      this.selectLoadQTLsSamples = false;
      this.disableQTLsToggle = false;
      this.qtlsForm.setControl('associationFile', new FormControl({value: '', disabled: false}, Validators.required));
      this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: false}));
      this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: false}));
      $("#qtls-data-input-association-file").removeClass("disabled-overlay");
      $("#qtls-data-input-expression-file").removeClass("disabled-overlay");
      $("#qtls-data-input-genotype-file").removeClass("disabled-overlay");
      this.qtlsForm.value.associationFile = false;
      this.qtlsForm.value.expressionFile = false;
      this.qtlsForm.value.genotypeFile = false;
      $("#association-file").val("");
      $("#expression-file").val("");
      $("#genotype-file").val("");
      this.data.changeDisableLocusQuantification(true);
      if (this.selectLoadGWASSample == true) {
        this.loadGWASSampleDataFile(); // toggle load GWAS data file
      }
    } else { // if user loads sample QTLs data files
      this.selectLoadQTLsSamples = true;
      this.qtlsType = "assoc";
      this.disableQTLsToggle = true;
      this.qtlsForm.setControl('associationFile', new FormControl({value: '', disabled: false}));
      this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: false}));
      this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: false}));
      $("#qtls-data-input-association-file").addClass("disabled-overlay");
      $("#qtls-data-input-expression-file").addClass("disabled-overlay");
      $("#qtls-data-input-genotype-file").addClass("disabled-overlay");
      this.qtlsForm.value.associationFile = false;
      this.qtlsForm.value.expressionFile = false;
      this.qtlsForm.value.genotypeFile = false;
      $("#association-file").val("");
      $("#expression-file").val("");
      $("#genotype-file").val("");
      this.data.changeDisableLocusQuantification(false);
      if (this.selectLoadGWASSample == false) {
        this.loadGWASSampleDataFile(); // toggle load GWAS data file
      }
    }
  }

  loadGWASSampleDataFile() { // if user unloads sample GWAS data file
    if (this.selectLoadGWASSample == true) {
      this.selectLoadGWASSample = false;
      this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: false}));
      $("#qtls-data-input-gwas-file").removeClass("disabled-overlay");
      this.qtlsForm.value.gwasFile = false;
      $("#gwas-file").val("");
      this.data.changeDisableLocusColocalization(true);
    } else { // if user loads sample GWAS data file
      this.selectLoadGWASSample = true;
      this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: false}));
      $("#qtls-data-input-gwas-file").addClass("disabled-overlay");
      this.qtlsForm.value.gwasFile = false;
      $("#gwas-file").val("");
      this.data.changeDisableLocusColocalization(false);
    }
  }

  loadLDSampleDataFile() {
    if (this.selectLoadLDSample == true) { // if unloads sample LD data file
      this.selectLoadLDSample = false;
      this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: false}));
      $("#qtls-data-input-LD-file").removeClass("disabled-overlay");
      this.qtlsForm.value.LDFile = false;
      $("#LD-file").val("");
    } else { // if user loads sample LD data file
      this.selectLoadLDSample = true;
      this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: false}));
      $("#qtls-data-input-LD-file").addClass("disabled-overlay");
      this.qtlsForm.value.LDFile = false;
      $("#LD-file").val("");
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
    const { associationFile, expressionFile, genotypeFile, gwasFile } = this.qtlsForm.value;
    const formData = new FormData();
    // custom tooltip validation - if expression file is submitted, need genotype file and vice versa. All or none.
    if ((expressionFile == null || expressionFile == false || expressionFile.length == 0) && (genotypeFile != null && genotypeFile.length > 0)) {
      // show tooltip on expression file if user tries to calculate with genotype file but no expression file
      // prevent calculation
      // console.log("no expression - yes genotype"); 
      $("#expression-file-tooltip").tooltip("enable");
      $("#expression-file-tooltip").tooltip("show");
      $("#expression-file-tooltip").tooltip("disable");
    } else if ((expressionFile != null && expressionFile.length > 0) && (genotypeFile == null || genotypeFile == false || genotypeFile.length == 0)) {
      // show tooltip on genotype file if user tries to calculate with expression file but no genotype file
      // prevent calculation
      // console.log("yes expression - no genotype");
      $("#genotype-file-tooltip").tooltip("enable");
      $("#genotype-file-tooltip").tooltip("show");
      $("#genotype-file-tooltip").tooltip("disable");
    } else {
      // only run calculation if both or none expression and genotype type files are inputted
      // console.log("yes/no expression - yes/no genotype");
      $("#expression-file-tooltip").tooltip("enable");
      $("#expression-file-tooltip").tooltip("hide");
      $("#expression-file-tooltip").tooltip("disable");
      $("#genotype-file-tooltip").tooltip("enable");
      $("#genotype-file-tooltip").tooltip("hide");
      $("#genotype-file-tooltip").tooltip("disable");
      this.data.changeResultStatus(true);
      this.data.changeBlurLoad(true);
      $(".blur-loading").addClass("blur-overlay");
      $(".disabled-post-calc").addClass("disabled-overlay");
      $("#qtls-data-input-association-file").addClass("disabled-overlay");
      $("#qtls-data-input-expression-file").addClass("disabled-overlay");
      $("#qtls-data-input-genotype-file").addClass("disabled-overlay");
      $("#qtls-data-input-gwas-file").addClass("disabled-overlay");
      $("#qtls-data-input-LD-file").addClass("disabled-overlay");
      formData.append('request_id', Date.now().toString()); // generate calculation request ID
      formData.append('select_pop', "false"); // set default population to 'false' -> 'EUR' in R
      formData.append('select_gene', "false"); // set default gene to 'false' -> QData top gene in R
      formData.append('select_dist', "false"); // set default dist to 'false' -> default initial calculation cis-QTL distance window is 100 Kb
      formData.append('select_ref', "false"); // set default rsnum to 'false' -> QData top gene's rsnum in R
      formData.append('recalculateAttempt', "false");
      formData.append('recalculatePop', "false");
      formData.append('recalculateGene', "false");
      formData.append('recalculateDist', "false");
      formData.append('recalculateRef', "false");
      if (this.selectLoadQTLsSamples) {
        formData.append('select_qtls_samples', "true");
      } else {
        formData.append('select_qtls_samples', "false");
      }
      if (this.selectLoadGWASSample) {
        formData.append('select_gwas_sample', "true");
      } else {
        formData.append('select_gwas_sample', "false");
      }

      if (associationFile != null && associationFile.length > 0) {
        formData.append('association-file', associationFile[0]);
      }

      if ((expressionFile != null && expressionFile.length > 0) && (genotypeFile != null && genotypeFile.length > 0)) {
        formData.append('expression-file', expressionFile[0]);
        formData.append('genotype-file', genotypeFile[0]);
        this.data.changeDisableLocusQuantification(false);
      } else if (this.selectLoadQTLsSamples) {
        this.data.changeDisableLocusQuantification(false);
      } else {
        this.data.changeDisableLocusQuantification(true);
      }
      
      if (gwasFile != null && gwasFile.length > 0) {
        formData.append('gwas-file', gwasFile[0]);
        this.data.changeDisableLocusColocalization(false);
      } else if (this.selectLoadGWASSample) {
        this.data.changeDisableLocusColocalization(false);
      } else {
        this.data.changeDisableLocusColocalization(true);
      }

      this.data.calculateMain(formData)
        .subscribe(
          res => {
            this.data.changeMainData(res);
            this.data.changeBlurLoad(false);
            $(".blur-loading").removeClass("blur-overlay");
            $("#qtls-data-input-association-file").removeClass("disabled-overlay");
            $("#qtls-data-input-expression-file").removeClass("disabled-overlay");
            $("#qtls-data-input-genotype-file").removeClass("disabled-overlay");
            $("#qtls-data-input-gwas-file").removeClass("disabled-overlay");
            $("#qtls-data-input-LD-file").removeClass("disabled-overlay");
          },
          error => {
            this.handleError(error);
            this.data.changeBlurLoad(false);
            $(".blur-loading").removeClass("blur-overlay");
            $("#qtls-data-input-association-file").removeClass("disabled-overlay");
            $("#qtls-data-input-expression-file").removeClass("disabled-overlay");
            $("#qtls-data-input-genotype-file").removeClass("disabled-overlay");
            $("#qtls-data-input-gwas-file").removeClass("disabled-overlay");
            $("#qtls-data-input-LD-file").removeClass("disabled-overlay");
          }
        )
    }
  } 

  reset() {
    // hide expression file genotype file error tooltips if displayed
    $("#expression-file-tooltip").tooltip("enable");
    $("#expression-file-tooltip").tooltip("hide");
    $("#expression-file-tooltip").tooltip("disable");
    $("#genotype-file-tooltip").tooltip("enable");
    $("#genotype-file-tooltip").tooltip("hide");
    $("#genotype-file-tooltip").tooltip("disable");
    this.disableQTLsToggle = false;
    this.data.changeResultStatus(false);
    this.data.changeBlurLoad(false);
    $(".blur-loading").removeClass("blur-overlay");
    $(".disabled-post-calc").removeClass("disabled-overlay");
    // remove all calculated data
    this.data.changeMainData(null);
    // remove any error messages
    this.data.changeErrorMessage('');
    // choose default association data file toggle
    // this.qtlsType = "assoc";
    this.data.changeQtlsType("assoc");
    // change result tab back to Locus Alignment
    this.data.changeSelectedTab(0);
    // clear any file inputs
    this.qtlsForm.setControl('associationFile', new FormControl({value: '', disabled: false}, Validators.required));
    this.qtlsForm.setControl('expressionFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.setControl('genotypeFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.setControl('gwasFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.setControl('LDFile', new FormControl({value: '', disabled: false}));
    this.qtlsForm.value.associationFile = false;
    this.qtlsForm.value.expressionFile = false;
    this.qtlsForm.value.genotypeFile = false;
    this.qtlsForm.value.gwasFile = false;
    this.qtlsForm.value.LDFile = false;
    $("#association-file").val("");
    $("#expression-file").val("");
    $("#genotype-file").val("");
    $("#gwas-file").val("");
    $("#LD-file").val("");
    // disable locus colocalization and locus quantification result tabs
    this.data.changeDisableLocusColocalization(true);
    this.data.changeDisableLocusQuantification(true);
    $("#qtls-data-input-association-file").removeClass("disabled-overlay");
    $("#qtls-data-input-expression-file").removeClass("disabled-overlay");
    $("#qtls-data-input-genotype-file").removeClass("disabled-overlay");
    $("#qtls-data-input-gwas-file").removeClass("disabled-overlay");
    $("#qtls-data-input-LD-file").removeClass("disabled-overlay");
    // clear any loaded sample files
    this.selectLoadQTLsSamples = false;
    this.selectLoadGWASSample = false;
    this.selectLoadLDSample = false;
  }


}
