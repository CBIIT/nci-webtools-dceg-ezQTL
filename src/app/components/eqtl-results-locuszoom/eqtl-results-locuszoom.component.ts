import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

export interface Gene {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-eqtl-results-locuszoom',
  templateUrl: './eqtl-results-locuszoom.component.html',
  styleUrls: ['./eqtl-results-locuszoom.component.css']
})
export class EqtlResultsLocuszoomComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Dummy Gene Expressions data for locus zoom drop down
  geneControl = new FormControl('', [Validators.required]);
  genes: Gene[] = [
    {value: 'gene-0', viewValue: 'NBPF20'},
    {value: 'gene-1', viewValue: 'NBPF21'},
    {value: 'gene-2', viewValue: 'NBPF22'},
    {value: 'gene-3', viewValue: 'NBPF23'},
    {value: 'gene-4', viewValue: 'NBPF24'},
    {value: 'gene-5', viewValue: 'NBPF25'},
  ];

}
