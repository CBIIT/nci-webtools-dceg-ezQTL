import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';

export interface PopulationGroup {
  namecode: string;
  name: string;
  selected : boolean;
  subPopulations: SubPopulation[];
}

export interface SubPopulation {
  value: string;
  viewValue: string;
  selected: boolean;
}

@Component({
  selector: 'app-eqtl-results-locuszoom',
  templateUrl: './eqtl-results-locuszoom.component.html',
  styleUrls: ['./eqtl-results-locuszoom.component.css']
})
export class EqtlResultsLocuszoomComponent implements OnInit {

  eqtlData: Object;
  geneList: string[];
  selectGene: string;
  populationGroups: PopulationGroup[];
  selectedPop: string[];
  selectedPop2: Object;

  populationSelectedAll: boolean;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentEqtlData.subscribe(eqtlData => {
      if (eqtlData) {
        this.eqtlData = eqtlData[1];
      }
      if (this.eqtlData) {
        this.data.currentGeneList.subscribe(geneList => {
          this.geneList = geneList;
          if (this.geneList) {
            this.selectGene = this.geneList[0]; //default reference gen
          }
        });
      }
    });
    this.populationGroups = this.populatePopulationDropdown();
    this.selectedPop = ["CEU"]; // default population
    this.selectedPop2 = this.populatePopulationDropdown();

    this.populationSelectedAll = false;
  }

  populatePopulationDropdown() {
    var populations = [
      {
        namecode: "AFR",
        name: "African",
        selected: false,
        subPopulations: [
          { value: "YRI", viewValue: "Yoruba in Ibadan, Nigera", selected: false },
          { value: "LWK", viewValue: "Luhya in Webuye, Kenya", selected: false },
          { value: "GWD", viewValue: "Gambian in Western Gambia", selected: false },
          { value: "MSL", viewValue: "Mende in Sierra Leone", selected: false },
          { value: "ESN", viewValue: "Esan in Nigera", selected: false },
          { value: "ASW", viewValue: "Americans of African Ancestry in SW USA", selected: false },
          { value: "ACB", viewValue: "African Carribbeans in Barbados", selected: false },
        ]
      },
      {
        namecode: 'AMR',
        name: "Ad Mixed American",
        selected: false,
        subPopulations: [
          { value: "MXL", viewValue: "Mexican Ancestry from Los Angeles, USA", selected: false },
          { value: "PUR", viewValue: "Puerto Ricans from Puerto Rico", selected: false },
          { value: "CLM", viewValue: "Colombians from Medellin, Colombia", selected: false },
          { value: "PEL", viewValue: "Peruvians from Lima, Peru", selected: false },
        ]
      },
      {
        namecode: "EAS",
        name: "East Asian",
        selected: false,
        subPopulations: [
          { value: "CHB", viewValue: "Han Chinese in Bejing, China", selected: false },
          { value: "JPT", viewValue: "Japanese in Tokyo, Japan", selected: false },
          { value: "CHS", viewValue: "Southern Han Chinese", selected: false },
          { value: "CDX", viewValue: "Chinese Dai in Xishuangbanna, China", selected: false },
          { value: "KHV", viewValue: "Kinh in Ho Chi Minh City, Vietnam", selected: false },
        ]
      },
      {
        namecode: "EUR",
        name: "European",
        selected: false,
        subPopulations: [
          { value: "CEU", viewValue: "Utah Residents from North and West Europe", selected: false },
          { value: "TSI", viewValue: "Toscani in Italia", selected: false },
          { value: "FIN", viewValue: "Finnish in Finland", selected: false },
          { value: "GBR", viewValue: "British in England and Scotland", selected: false },
          { value: "IBS", viewValue: "Iberian population in Spain", selected: false },
        ]
      },
      {
        namecode: "SAS",
        name: "South Asian",
        selected: false,
        subPopulations: [
          { value: "GIH", viewValue: "Gujarati Indian from Houston, Texas", selected: false },
          { value: "PJL", viewValue: "Punjabi from Lahore, Pakistan", selected: false },
          { value: "BEB", viewValue: "Bengali from Bangladesh", selected: false },
          { value: "STU", viewValue: "Sri Lankan Tamil from the UK", selected: false },
          { value: "ITU", viewValue: "Indian Telugu from the UK", selected: false },
        ]
      }
    ];
    return populations;
  }

  selectAll() {
    console.log("DO SOMETHING");
    if (this.selectedPop.length == 26 && this.populationSelectedAll == true) {
      this.selectedPop = [];
      this.populationSelectedAll = false;
    } else if (this.selectedPop.length < 26 || this.populationSelectedAll == false) {
      this.selectedPop = ["ACB","ASW","BEB","CDX","CEU","CHB","CHS","CLM","ESN","FIN","GBR","GIH","GWD","IBS","ITU","JPT","KHV","LWK","MSL","MXL","PEL","PJL","PUR","STU","TSI","YRI"];
      this.populationSelectedAll = true;
    } else {
      // do nothing
    }
  }

  selectPopulationGroup(groupName) {
    console.log(groupName);
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    // if (groupName == "AFR"  && this.selectedPop.difference(subset, superset).length === 0) {
    //   this.selectedPop = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"]
    // }
  }

  changePop() {
    if (this.selectedPop.length < 26) {
      this.populationSelectedAll = false;
    } else {
      this.populationSelectedAll = true;
    }
  }

}

