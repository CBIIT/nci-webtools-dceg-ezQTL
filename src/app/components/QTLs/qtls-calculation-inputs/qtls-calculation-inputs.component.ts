import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare let $: any;

export interface PopulationGroup {
  namecode: string;
  name: string;
  subPopulations: SubPopulation[];
}

export interface SubPopulation {
  value: string;
  viewValue: string;
}

export interface ReferenceGene {
  gene_id: string;
  gene_symbol: string;
}

export interface GeneVariants {
  gene_id: string;
  gene_symbol: string;
  rsnum: string;
}

@Component({
  selector: 'app-qtls-calculation-inputs',
  templateUrl: './qtls-calculation-inputs.component.html',
  styleUrls: ['./qtls-calculation-inputs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QTLsCalculationInputsComponent implements OnInit {

  // qtlsCalculationFormCISDistance = new FormGroup({
  //   cisDistanceInput: new FormControl("100", [Validators.pattern("^(\-?(?!0)[0-9]+)?$"), Validators.min(1), Validators.max(2000), Validators.required])
  // });

  qtlsCalculationFormRSNumber = new FormGroup({
    rsnumber: new FormControl('', [Validators.pattern("^(rs[0-9]+)?$")])
  });

  mainData: Object;
  locusAlignmentDataQTopAnnot: Object;
  requestID: number;
  associationFile: string;
  expressionFile: string;
  genotypeFile: string;
  gwasFile: string;

  populationGroups: PopulationGroup[];
  selectedPop: string[];
  selectedPopFinal: string[];
  populationSelectedAll: boolean;
  newSelectedPop: string;

  geneList: ReferenceGene[];
  selectedGene: string;
  newSelectedGene: string;

  selectedDist: string;
  newSelectedDist: string;

  allGeneVariants: GeneVariants[];
  topGeneVariants: GeneVariants[];
  allGeneVariantsOrganized: Object;
  selectedRef: string;
  rsnumSearch: string;
  newSelectedRef: string;

  recalculateAttempt: string;
  recalculatePopAttempt: string;
  recalculateGeneAttempt: string;
  recalculateDistAttempt: string;
  recalculateRefAttempt: string;
  inputChanged: boolean;
  disableInputs: boolean;
  messages: string[];

  errorMessage: string;
  warningMessage: string;

  select_qtls_samples: string;
  select_gwas_sample: string;


  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.populationGroups = this.populatePopulationDropdown();
    this.selectedPopFinal = [];
    this.populationSelectedAll = false;
    this.rsnumSearch = "";
    this.errorMessage = "";
    this.warningMessage = "";
    this.selectedPop = [];
    this.selectedGene = "";
    this.selectedDist = "";
    this.selectedRef = "";

    this.data.currentErrorMessage.subscribe(errorMessage => {
      this.errorMessage = "";
      if (errorMessage) {
        this.errorMessage = errorMessage;
      }
    });
    
    this.data.currentMainData.subscribe(mainData => {
      this.warningMessage = "";
      $("#ldref-search-warning").show();
      this.mainData = mainData;
      
      if (mainData) {
        this.associationFile = mainData["info"]["inputs"]["association_file"][0]; // association filename
        this.expressionFile = mainData["info"]["inputs"]["expression_file"][0]; // expression filename
        this.genotypeFile = mainData["info"]["inputs"]["genotype_file"][0]; // genotype filename
        this.gwasFile = mainData["info"]["inputs"]["gwas_file"][0] // gwas filename
        this.requestID = mainData["info"]["inputs"]["request"][0]; // request id

        this.recalculateAttempt = mainData["info"]["recalculateAttempt"][0]; // recalculation attempt ?
        this.recalculatePopAttempt = mainData["info"]["recalculatePop"][0]; // recalculation attempt when pop changed ?
        this.recalculateGeneAttempt = mainData["info"]["recalculateGene"][0]; // recalculation attempt when gene changed ?
        this.recalculateDistAttempt = mainData["info"]["recalculateDist"][0]; // recalculation attempt when cis-QTL distance changed ? 
        this.recalculateRefAttempt = mainData["info"]["recalculateRef"][0]; // recalculation attempt when ref rsnum changed ?

        this.messages = mainData["info"]["messages"]["warnings"][0]; // messages from QTLs calculation

        this.select_qtls_samples = mainData["info"]["select_qtls_samples"][0]; // use QTLs sample data files ?
        this.select_gwas_sample = mainData["info"]["select_gwas_sample"][0]; // use GWAS sample data file ?

        this.newSelectedPop = mainData["info"]["inputs"]["select_pop"][0]; // inputted populations
        this.newSelectedGene = mainData["info"]["inputs"]["select_gene"][0]; // inputted gene
        this.newSelectedDist = mainData["info"]["inputs"]["select_dist"][0]; // inputted dist
        this.newSelectedRef = mainData["info"]["inputs"]["select_ref"][0]; // inputted ref

        this.geneList = mainData["info"]["gene_list"]["data"][0]; // get gene list & populate ref gene dropdown
        this.allGeneVariants = mainData["info"]["all_gene_variants"]["data"][0]; // get list of all rsnums for all genes
        this.topGeneVariants = mainData["info"]["top_gene_variants"]["data"][0]; // get list of top rsnum for all genes
        this.locusAlignmentDataQTopAnnot = mainData["locus_alignment"]["top"][0][0]; // locus alignment Top Gene data

        if (this.recalculateAttempt == "false" && this.newSelectedPop == "EUR") {
          this.selectedPop = ["CEU", "TSI", "FIN", "GBR", "IBS"]; // default population EUR
          this.returnPopulationGroupFinal();
        } else if (this.recalculateAttempt == "true" && this.newSelectedPop == "EUR") {
          this.selectedPop = ["CEU", "TSI", "FIN", "GBR", "IBS"]; // default population EUR
          this.returnPopulationGroupFinal();
        } else {
          var newSelectedPopList = this.newSelectedPop.split('+');
          this.selectedPop = newSelectedPopList; // recalculated new population selection
          this.recalculatePopAttempt = "false";
          this.returnPopulationGroupFinal();
        }
        if(this.newSelectedGene == "false") {
          this.selectedGene = this.locusAlignmentDataQTopAnnot["gene_id"]; // default reference gene
        } else {
          this.selectedGene = this.newSelectedGene; // recalculated new gene selection
          this.recalculateGeneAttempt = "false";
        }
        if (this.newSelectedDist == "false") {
          this.selectedDist = "100"; // default cis-QTL distance (in Kb)
        } else {
          this.selectedDist = this.newSelectedDist; // recalculated new cis-QTL distance (in Kb)
          this.recalculateDistAttempt = "false";
        }
        if (this.newSelectedRef == "false") {
          this.selectedRef = "false"; // default ref rsnum
          this.rsnumSearch = this.locusAlignmentDataQTopAnnot["rsnum"];
          this.qtlsCalculationFormRSNumber.value.rsnumber = this.locusAlignmentDataQTopAnnot["rsnum"];
        } else {
          this.selectedRef = this.newSelectedRef; // recalculated new gene selection
          this.recalculateRefAttempt = "false";
          this.rsnumSearch = this.selectedRef;
          this.qtlsCalculationFormRSNumber.value.rsnumber = this.selectedRef;
        }
        if (this.allGeneVariants && this.geneList) {
          this.populateAllGeneVariantLists(this.allGeneVariants, this.geneList); // organize all QTLs variants by gene
        }
        if (this.messages) {
          this.warningMessage = this.messages.join('\n');
        }
      } else {
        // reset calculation parameters if mainData is null
        this.selectedPop = [];
        this.selectedPopFinal = [];
        this.selectedGene = "";
        this.qtlsCalculationFormRSNumber.reset();
      }
    });
  }

  collapseDataInputPanel() {
    $("#expression-file-tooltip").tooltip("enable");
    $("#expression-file-tooltip").tooltip("hide");
    $("#expression-file-tooltip").tooltip("disable");
    $("#genotype-file-tooltip").tooltip("enable");
    $("#genotype-file-tooltip").tooltip("hide");
    $("#genotype-file-tooltip").tooltip("disable");
    $("#toggle-view-button").toggleClass('fa-caret-left fa-caret-right');
    // toggle position of locus alignment manhattan plot for popovers to fit
    $("#qtls-locus-alignment-plot").toggleClass('justify-content-start justify-content-center');
    $("#qtls-locus-alignment-scatter-plot").toggleClass('justify-content-start justify-content-center');
    var direction = $("#toggle-view-button").attr("class");
    if (direction.includes("left")) {
      // show input panel
      this.data.changeCollapseInput(false);
      // shift popovers to the left if any are open
      if ($(".popover").is(":visible")) {
        $('.popover').css({
          left: $(".popover").position().left - 220 + "px"
        });
      }
    } else {
      // hide input panel
      this.data.changeCollapseInput(true);
      // shift popovers to the right if any are open
      if ($(".popover").is(":visible")) {
        $('.popover').css({
          left: $(".popover").position().left + 220 + "px"
        });
      }
    }
  }

  populatePopulationDropdown() {
    var populations = [
      {
        namecode: "AFR",
        name: "African",
        subPopulations: [
          { value: "YRI", viewValue: "Yoruba in Ibadan, Nigera" },
          { value: "LWK", viewValue: "Luhya in Webuye, Kenya" },
          { value: "GWD", viewValue: "Gambian in Western Gambia" },
          { value: "MSL", viewValue: "Mende in Sierra Leone" },
          { value: "ESN", viewValue: "Esan in Nigera" },
          { value: "ASW", viewValue: "Americans of African Ancestry in SW USA" },
          { value: "ACB", viewValue: "African Carribbeans in Barbados" },
        ]
      },
      {
        namecode: 'AMR',
        name: "Ad Mixed American",
        subPopulations: [
          { value: "MXL", viewValue: "Mexican Ancestry from Los Angeles, USA" },
          { value: "PUR", viewValue: "Puerto Ricans from Puerto Rico" },
          { value: "CLM", viewValue: "Colombians from Medellin, Colombia" },
          { value: "PEL", viewValue: "Peruvians from Lima, Peru" },
        ]
      },
      {
        namecode: "EAS",
        name: "East Asian",
        subPopulations: [
          { value: "CHB", viewValue: "Han Chinese in Bejing, China" },
          { value: "JPT", viewValue: "Japanese in Tokyo, Japan" },
          { value: "CHS", viewValue: "Southern Han Chinese" },
          { value: "CDX", viewValue: "Chinese Dai in Xishuangbanna, China" },
          { value: "KHV", viewValue: "Kinh in Ho Chi Minh City, Vietnam" },
        ]
      },
      {
        namecode: "EUR",
        name: "European",
        subPopulations: [
          { value: "CEU", viewValue: "Utah Residents from North and West Europe" },
          { value: "TSI", viewValue: "Toscani in Italia" },
          { value: "FIN", viewValue: "Finnish in Finland" },
          { value: "GBR", viewValue: "British in England and Scotland" },
          { value: "IBS", viewValue: "Iberian population in Spain" },
        ]
      },
      {
        namecode: "SAS",
        name: "South Asian",
        subPopulations: [
          { value: "GIH", viewValue: "Gujarati Indian from Houston, Texas" },
          { value: "PJL", viewValue: "Punjabi from Lahore, Pakistan" },
          { value: "BEB", viewValue: "Bengali from Bangladesh" },
          { value: "STU", viewValue: "Sri Lankan Tamil from the UK" },
          { value: "ITU", viewValue: "Indian Telugu from the UK" },
        ]
      }
    ];
    return populations;
  }

  selectAll() {
    if (this.selectedPop.length == 26) {
      this.selectedPop = [];
      if (this.populationSelectedAll == true) {
        this.populationSelectedAll = false;
      } else {
        this.populationSelectedAll = true;
      } 
    } else if (this.selectedPop.length < 26) {
      this.selectedPop = ["ACB", "ASW", "BEB", "CDX", "CEU", "CHB", "CHS", "CLM", "ESN", "FIN", "GBR", "GIH", "GWD", "IBS", "ITU", "JPT", "KHV", "LWK", "MSL", "MXL", "PEL", "PJL", "PUR", "STU", "TSI", "YRI"];
      if (this.populationSelectedAll == true) {
        this.populationSelectedAll = false;
      } else {
        this.populationSelectedAll = true;
      } 
    } else {
      // do nothing
    }
    this.inputChanged = true;
    this.recalculatePopAttempt = "true";
    this.returnPopulationGroupFinal();
  }

  unique(value, index, self) {
    return self.indexOf(value) === index;
  }

  containsAll(subarr, arr) {
    for (var i = 0, len = subarr.length; i < len; i++) {
      if (!arr.includes(subarr[i])) {
        return false;
      }
    }
    return true;
  }

  remove(element, src) {
    var newArray = JSON.parse(JSON.stringify(src));
    // console.log(newArray);
    for (var i = 0; i < newArray.length; i++) {
      var idx = -1;
      if (newArray[i] == element) {
        idx = i;
      }
      if (idx != -1) {
        newArray.splice(idx, 1);
      }
    }
    return newArray;
  }

  removeAll(subpop, src) {
    var newArray = JSON.parse(JSON.stringify(src));
    for (var i = 0; i < subpop.length; i++) {
      newArray = this.remove(subpop[i], newArray);
    }
    return newArray;
  }

  selectPopulationGroup(groupName) {
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    if (groupName == "AFR") {
      if (this.containsAll(african, this.selectedPop)) {
        this.selectedPop = this.removeAll(african, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(african)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "AMR") {
      if (this.containsAll(mixedAmerican, this.selectedPop)) {
        this.selectedPop = this.removeAll(mixedAmerican, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(mixedAmerican)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "EAS") {
      if (this.containsAll(eastAsian, this.selectedPop)) {
        this.selectedPop = this.removeAll(eastAsian, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(eastAsian)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "EUR") {
      if (this.containsAll(european, this.selectedPop)) {
        this.selectedPop = this.removeAll(european, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(european)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "SAS") {
      if (this.containsAll(southAsian, this.selectedPop)) {
        this.selectedPop = this.removeAll(southAsian, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(southAsian)).filter(this.unique);
        this.changePop();
      }
    }
  }

  changePop() {
    if (this.selectedPop.length < 26) {
      this.populationSelectedAll = false;
    } else {
      this.populationSelectedAll = true;
    }
    this.inputChanged = true;
    this.recalculatePopAttempt = "true";
    this.returnPopulationGroupFinal();
  }

  returnPopulationGroupFinal() {
    this.selectedPopFinal = this.selectedPop;
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    if (this.containsAll(african, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(african, this.selectedPopFinal);
      this.selectedPopFinal.push("AFR");
    }
    if (this.containsAll(mixedAmerican, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(mixedAmerican, this.selectedPopFinal);
      this.selectedPopFinal.push("AMR");
    }
    if (this.containsAll(eastAsian, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(eastAsian, this.selectedPopFinal);
      this.selectedPopFinal.push("EAS");
    }
    if (this.containsAll(european, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(european, this.selectedPopFinal);
      this.selectedPopFinal.push("EUR");
    }
    if (this.containsAll(southAsian, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(southAsian, this.selectedPopFinal);
      this.selectedPopFinal.push("SAS");
    }
    return this.selectedPopFinal;
  }

  getGeneIDs(geneList) {
    var geneIDs = [];
    for (var i = 0; i < geneList.length; i++) {
      geneIDs.push(geneList[i]['gene_id']);
    }
    return geneIDs;
  }

  populateAllGeneVariantLists(geneData, geneList) {
    var geneVariants = {};
    var geneIDList = this.getGeneIDs(geneList);
    // initialize allGeneVariantsOrganized dict key value structure
    for (var x = 0; x < geneIDList.length; x++) {
      geneVariants[geneIDList[x]] = [];
    }
    for(var y = 0; y < geneData.length; y++) {
      geneVariants[geneData[y]["gene_id"]].push(geneData[y]["rsnum"]);
    }
    this.allGeneVariantsOrganized = geneVariants;
  }

  refGeneChange() {
    this.inputChanged = true;
    this.recalculateGeneAttempt = "true";
    for(var i = 0; i < this.topGeneVariants.length; i++) {
      if (this.topGeneVariants[i]['gene_id'] == this.selectedGene) {
        this.rsnumSearch = this.topGeneVariants[i]['rsnum'];
        this.qtlsCalculationFormRSNumber.value.rsnumber = this.topGeneVariants[i]['rsnum'];
      }
    }
  }

  enableSearchLDRef(event: any) {
    this.inputChanged = true;
    this.recalculateRefAttempt = "true";
    this.rsnumSearch = event.target.value;
    this.qtlsCalculationFormRSNumber.value.rsnumber = event.target.value;
  }

  // enableSearchCISDistance(event: any) {
  //   this.inputChanged = true;
  //   this.recalculateDistAttempt = "true";
  //   this.selectedDist = event.target.value;
  //   this.qtlsCalculationFormCISDistance.value.cisDistanceInput = event.target.value;
  // }

  clearLDRefField() {
    this.rsnumSearch = '';
    this.qtlsCalculationFormRSNumber.value.rsnumber = '';
  }

  // clearCISDistField() {
  //   this.selectedDist = null;
  //   this.qtlsCalculationFormCISDistance.value.cisDistanceInput = '';
  // }

  // cisDistErrorMsg() {
  //   var msg = "";
  //   if (this.qtlsCalculationFormCISDistance.value.cisDistanceInput > 2000) {
  //     msg = "Distance must be <= 2000 Kb";
  //   } else if (this.qtlsCalculationFormCISDistance.value.cisDistanceInput < 1) {
  //     msg = "Distance must be >= 1 Kb";
  //   } else {
  //     msg = "Invalid cis-QTL Distance";
  //   }
  //   if (this.qtlsCalculationFormCISDistance.value.cisDistanceInput == null || this.qtlsCalculationFormCISDistance.value.cisDistanceInput == '') {
  //     msg = "Input required";
  //   }
  //   return msg;
  // }

  handleError(error) {
    console.log(error);
    this.closePopover();
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  closeWarning() {
    this.warningMessage = "";
  }

  closePopover() {
    $('.popover').hide();
  }

  async recalculatePopGeneDistRef() {
    // get new parameters as string
    var selectedPopString = this.selectedPop.join('+');
    var selectedGeneString = this.selectedGene;
    var selectedDistNumber = this.selectedDist;
    // retrieve recalculate statuses
    var recalculateAttempt = "true";
    var recalculatePop = this.recalculatePopAttempt;
    var recalculateGene = this.recalculateGeneAttempt;
    var recalculateDist = this.recalculateDistAttempt;
    // change recalculate status to false to disable recalculate button after recalculation completes
    this.inputChanged = false;
    // check if rs number ld ref entered is listed as a variant for ref gene
    // if not, prevent calculation and throw warning
    if (this.allGeneVariantsOrganized[selectedGeneString].includes(this.rsnumSearch) || this.rsnumSearch.length == 0) {
      this.closeWarning();
      var selectedRefString = this.rsnumSearch;
      var recalculateRef = this.recalculateRefAttempt;
      if (this.rsnumSearch.length == 0) {
        selectedRefString = "false";
        recalculateRef = "false";
      }
      // reset
      this.closePopover();
      this.data.changeBlurLoadMain(true);
      this.data.changeECAVIARData(null);
      this.data.changeHyprcolocData(null);
      this.disableInputs = true;
      $(".blur-loading-main").addClass("blur-overlay");
      $(".blur-loading-ecaviar").addClass("blur-overlay");
      // calculate
      this.data.recalculateMain(this.select_qtls_samples, this.select_gwas_sample, this.associationFile, this.expressionFile, this.genotypeFile, this.gwasFile, this.requestID, selectedPopString, selectedGeneString, selectedDistNumber, selectedRefString, recalculateAttempt, recalculatePop, recalculateGene, recalculateDist, recalculateRef)
        .subscribe(
          res => {
            this.data.changeMainData(res);
            this.data.changeBlurLoadMain(false);
            this.disableInputs = false;
            $(".blur-loading-main").removeClass("blur-overlay");
            this.recalculatePopAttempt = "false";
            this.recalculateGeneAttempt = "false";
            this.recalculateDistAttempt = "false";
            this.recalculateRefAttempt = "false";
            if (this.rsnumSearch.length == 0) {
              this.rsnumSearch = this.locusAlignmentDataQTopAnnot["rsnum"];
              this.qtlsCalculationFormRSNumber.value.rsnumber = this.locusAlignmentDataQTopAnnot["rsnum"];
            }
            // Run Locus Colocalization calculations if GWAS and Association Files loaded
            var select_qtls_samples = res["info"]["select_qtls_samples"][0]; // use QTLs sample data files ?
            var select_gwas_sample = res["info"]["select_gwas_sample"][0]; // use GWAS sample data file ?
            var gwasFileName = res["info"]["inputs"]["gwas_file"][0] // gwas filename
            var associationFileName = res["info"]["inputs"]["association_file"][0]; // association filename
            if ((gwasFileName && gwasFileName != "false") || (select_gwas_sample == "true" && select_qtls_samples == "true")) {
              var locusAlignmentDataQTopAnnot = res["locus_alignment"]["top"][0][0]; // locus alignment Top Gene data
              var newSelectedDist = res["info"]["inputs"]["select_dist"][0]; // inputted cis-QTL distance
              var requestID = res["info"]["inputs"]["request"][0]; // request id
              if (newSelectedDist == "false") {
                var select_dist = "100000"; // default cis-QTL distance (in Kb)
              } else {
                var select_dist = (parseInt(newSelectedDist, 10) * 1000).toString(); // recalculated new cis-QTL distance (in Kb)
              }
              var select_ref = locusAlignmentDataQTopAnnot["rsnum"].toString();
              var select_chr = locusAlignmentDataQTopAnnot["chr"].toString();
              var select_pos = locusAlignmentDataQTopAnnot["pos"].toString();
              // Run eCAVIAR calculation
              this.data.calculateLocusColocalizationECAVIAR(select_gwas_sample, select_qtls_samples, gwasFileName, associationFileName, select_ref, select_dist, requestID)
                .subscribe(
                  res => {
                    var requestIDECAVIAR = res["ecaviar"]["request"][0];
                    if (requestID == requestIDECAVIAR && requestID == requestIDECAVIAR) {
                      // console.log("ECAVIAR REQUEST MATCHES", requestID, requestID, requestIDECAVIAR);
                      this.data.changeECAVIARData(res);
                    } else {
                      // console.log("ECAVIAR REQUEST DOES NOT MATCH", requestID, requestID, requestIDECAVIAR);
                    }
                  },
                  error => {
                    this.handleError(error);
                  }
                );
              // Run HyprColoc LD calculation then HyprColoc calculation
              this.data.calculateLocusColocalizationHyprcolocLD(select_ref, select_chr, select_pos, select_dist, requestID)
                .subscribe(
                  res => {
                    var ldFileName = res["hyprcoloc_ld"]["filename"][0];
                    var requestIDHypercolocLD = res["hyprcoloc_ld"]["request"][0];
                    // Run HyprColoc calculation after LD file is generated
                    if (requestID == requestIDHypercolocLD && requestID == requestIDHypercolocLD) {
                      // console.log("HYPRCOLOC LD REQUEST MATCHES", requestID, requestID, requestIDHypercolocLD);
                      this.data.calculateLocusColocalizationHyprcoloc(select_gwas_sample, select_qtls_samples, gwasFileName, associationFileName, ldFileName, requestID)
                        .subscribe(
                          res => {
                            var requestIDHypercoloc = res["hyprcoloc"]["request"][0];
                            if (requestID == requestIDHypercoloc && requestID == requestIDHypercoloc) {
                              // console.log("HYPRCOLOC REQUEST MATCHES", requestID, requestID, requestIDHypercoloc);
                              this.data.changeHyprcolocData(res);
                            } else {
                              // console.log("HYPRCOLOC REQUEST DOES NOT MATCH", requestID, requestID, requestIDHypercoloc);
                            }
                          },
                          error => {
                            this.handleError(error);
                          }
                        );
                    } else {
                      console.log("HYPRCOLOC LD REQUEST DOES NOT MATCH", requestID, requestID, requestIDHypercolocLD);
                    }
                  },
                  error => {
                    this.handleError(error);
                  }
                );
            }
          },
          error => {
            this.handleError(error);
            this.data.changeBlurLoadMain(false);
            this.disableInputs = false;
            $(".blur-loading-main").removeClass("blur-overlay");
          }
        );
    } else {
      // if rs number ld ref entered is not listed as a variant for ref gene, throw warning alert
      this.warningMessage = this.rsnumSearch + " not found in the association data file for the chosen reference gene. Please enter another variant."
    }
  }

}
