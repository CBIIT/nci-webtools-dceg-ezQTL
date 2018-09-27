import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';
import { FormControl, Validators } from '@angular/forms';
// import { forEach } from '@angular/router/src/utils/collection';

export interface GeneSymbols {
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
  geneDropdown: GeneSymbols[];

  geneControl = new FormControl('', [Validators.required]);

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentEqtlData.subscribe(eqtlData => {
      this.eqtlData = eqtlData[1];
      if (this.eqtlData) {
        this.data.currentGeneList.subscribe(geneList => {
          this.geneList = geneList;
          if (this.geneList) {
            this.geneDropdown = this.populateReferenceGeneDropdown(this.geneList);
          }
        });
      }
    });
  }

  populateReferenceGeneDropdown(genes) {
    var geneListJSON = [];
    genes.forEach(function(gene) {
      var geneJSON = {};
      geneJSON['value'] = gene;
      geneJSON['viewValue'] = gene;
      geneListJSON.push(geneJSON);
    });
    return geneListJSON;
  }

}
