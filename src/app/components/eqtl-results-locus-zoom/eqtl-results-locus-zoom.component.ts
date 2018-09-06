import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

export interface Gene {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-eqtl-results-locus-zoom',
  templateUrl: './eqtl-results-locus-zoom.component.html',
  styleUrls: ['./eqtl-results-locus-zoom.component.css']
})

export class EqtlResultsLocusZoomComponent {
  geneControl = new FormControl('', [Validators.required]);
  genes: Gene[] = [
    {value: 'gene-0', viewValue: 'NBPF20'},
    {value: 'gene-1', viewValue: 'NBPF21'},
    {value: 'gebe-2', viewValue: 'NBPF22'},
    {value: 'gene-3', viewValue: 'NBPF23'},
    {value: 'gene-4', viewValue: 'NBPF24'},
    {value: 'gebe-5', viewValue: 'NBPF25'},
  ];
}
