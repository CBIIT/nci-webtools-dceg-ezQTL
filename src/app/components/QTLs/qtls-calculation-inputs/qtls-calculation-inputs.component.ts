import { Component, OnInit } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { FormControl, Validators } from '@angular/forms';

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
  styleUrls: ['./qtls-calculation-inputs.component.css']
})
export class QTLsCalculationInputsComponent implements OnInit {

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

  allGeneVariants: GeneVariants[];
  topGeneVariants: GeneVariants[];
  allGeneVariantsOrganized: Object;
  selectedRef: string;
  rsnumSearch: string;
  newSelectedRef: string;

  recalculateAttempt: string;
  recalculatePopAttempt: string;
  recalculateGeneAttempt: string;
  recalculateRefAttempt: string;
  inputChanged: boolean;
  disableInputs: boolean;
  warningMessage: string;
  rsnumber = new FormControl('', [Validators.pattern("^(rs[0-9]+)?$")]);


  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.populationGroups = this.populatePopulationDropdown();
    this.selectedPopFinal = [];
    this.populationSelectedAll = false;
    this.rsnumSearch = "";
    this.warningMessage = "";
    this.selectedPop = [];
    this.selectedGene = "";
    this.selectedRef = "";
    
    this.data.currentMainData.subscribe(mainData => {
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
        this.recalculateRefAttempt = mainData["info"]["recalculateRef"][0]; // recalculation attempt when ref rsnum changed ?

        this.newSelectedPop = mainData["info"]["inputs"]["select_pop"][0]; // inputted populations
        this.newSelectedGene = mainData["info"]["inputs"]["select_gene"][0]; // inputted gene
        this.newSelectedRef = mainData["info"]["inputs"]["select_ref"][0]; // inputted ref

        this.geneList = mainData["info"]["gene_list"]["data"][0]; // get gene list & populate ref gene dropdown
        this.allGeneVariants = mainData["info"]["all_gene_variants"]["data"][0]; // get list of all rsnums for all genes
        this.topGeneVariants = mainData["info"]["top_gene_variants"]["data"][0]; // get list of top rsnum for all genes
        this.locusAlignmentDataQTopAnnot = mainData["locus_alignment"]["top"][0][0]; // locus alignment Top Gene data


        if (this.recalculateAttempt == "false" && this.newSelectedPop == "EUR") {
          console.log("REACHED 1");
          console.log("Population recalculation: No");
          this.selectedPop = ["CEU", "TSI", "FIN", "GBR", "IBS"]; // default population EUR
          this.returnPopulationGroupFinal();
        } else {
          console.log("REACHED 2");
          console.log("Population recalculation: Yes");
          var newSelectedPopList = this.newSelectedPop.split('+');
          this.selectedPop = newSelectedPopList; // recalculated new population selection
          this.recalculatePopAttempt = "false";
          this.returnPopulationGroupFinal();
        }
        if(this.newSelectedGene == "false") {
          console.log("Gene recalculation: No");
          this.selectedGene = this.locusAlignmentDataQTopAnnot["gene_id"]; // default reference gene
        } else {
          console.log("Gene recalculation: Yes");
          this.selectedGene = this.newSelectedGene; // recalculated new gene selection
          this.recalculateGeneAttempt = "false";
        }
        if (this.newSelectedRef == "false") {
          console.log("LD Ref recalculation: No");
          this.selectedRef = "false"; // default ref rsnum
          // console.log(this.locusAlignmentDataQTopAnnot["rsnum"]);
          this.rsnumSearch = this.locusAlignmentDataQTopAnnot["rsnum"];
          // console.log("reached 1", this.rsnumSearch);
        } else {
          console.log("LD Ref recalculation: Yes");
          this.selectedRef = this.newSelectedRef; // recalculated new gene selection
          this.recalculateRefAttempt = "false";
          this.rsnumSearch = this.selectedRef;
          // console.log("reached 2", this.rsnumSearch);
        }
        if (this.allGeneVariants && this.geneList) {
          this.populateAllGeneVariantLists(this.allGeneVariants, this.geneList); // organize all QTLs variants by gene
        }
      }
    });
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
      }
    }
  }

  enableSearch(rsnumSearchInputValue) {
    this.inputChanged = true;
    this.recalculateRefAttempt = "true";
    this.rsnumSearch = rsnumSearchInputValue;
  }

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

  async recalculatePopGeneRef() {
    var selectedGeneString = this.selectedGene;
    var selectedPopString = this.selectedPop.join('+');
    var recalculateAttempt = "true";
    var recalculatePop = this.recalculatePopAttempt;
    var recalculateGene = this.recalculateGeneAttempt;
    this.inputChanged = false;
    if (this.allGeneVariantsOrganized[selectedGeneString].includes(this.rsnumSearch) || this.rsnumSearch.length == 0) {
      this.warningMessage = "";
      var selectedRefString = this.rsnumSearch;
      var recalculateRef = this.recalculateRefAttempt;
      if (this.rsnumSearch.length == 0) {
        selectedRefString = "false";
        recalculateRef = "false";
      }
      // reset
      // this.data.changeMainData(null);
      this.data.changeBlurLoad(true);
      this.disableInputs = true;
      $(".blur-loading").addClass("blur-overlay");
      // this.data.changeSelectedTab(0);
      // calculate
      this.data.recalculateMain(this.associationFile, this.expressionFile, this.genotypeFile, this.gwasFile, this.requestID, selectedPopString, selectedGeneString, selectedRefString, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef)
        .subscribe(
          res => {
            this.data.changeMainData(res);
            this.data.changeBlurLoad(false);
            this.disableInputs = false;
            this.closePopover();
            $(".blur-loading").removeClass("blur-overlay");
            this.recalculateRefAttempt = "false";
            this.recalculatePopAttempt = "false";
            this.recalculateGeneAttempt = "false";
            if (this.rsnumSearch.length == 0) {
              this.rsnumSearch = this.locusAlignmentDataQTopAnnot["rsnum"];
            }
          },
          error => {
            this.handleError(error);
            this.data.changeBlurLoad(false);
            this.disableInputs = false;
            $(".blur-loading").removeClass("blur-overlay");
          }
        );
      // this.recalculateRefAttempt = "false";
      // this.recalculatePopAttempt = "false";
      // this.recalculateGeneAttempt = "false";
    } else {
      this.warningMessage = this.rsnumSearch + " not found in the association data file for the chosen reference gene. Please enter another variant."
    }
  }

}
