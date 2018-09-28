import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';

export interface PopulationGroup {
  namecode: string;
  name: string;
  subPopulations: SubPopulation[];
}

export interface SubPopulation {
  value: string;
  viewValue: string;
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

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentEqtlData.subscribe(eqtlData => {
      this.eqtlData = eqtlData[1];
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
    console.log("DO SOMETHING");
    if (this.selectedPop.length == 27) {
      this.selectedPop = [];
    }
    else if (this.selectedPop.length < 26) {
      this.selectedPop = ["All","ACB","ASW","BEB","CDX","CEU","CHB","CHS","CLM","ESN","FIN","GBR","GIH","GWD","IBS","ITU","JPT","KHV","LWK","MSL","MXL","PEL","PJL","PUR","STU","TSI","YRI"];
    }
    else {
      
    }
  }

  changePop() {
    // do something here when the user changes the population
  }

}

