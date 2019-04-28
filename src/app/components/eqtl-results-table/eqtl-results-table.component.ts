import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { EqtlResultsService } from '../../services/eqtl-results.service';

export interface Variant {
  gene_id: string;
  gene_symbol: string;
  variant_id: string;
  rsnum: string;
  chr: string;
  pos: string;
  ref: string;
  alt: string;
  tss_distance: number;
  pval_nominal: number;
  slope: string;
  slope_se: string;
  R2: string;
}

// const VARIANT_DATA: Variant[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

@Component({
  selector: 'app-eqtl-results-table',
  templateUrl: './eqtl-results-table.component.html',
  styleUrls: ['./eqtl-results-table.component.css']
})
export class EqtlResultsTableComponent implements OnInit {

  locuszoomData: Object;
  VARIANT_DATA: Variant[];
  
  displayedColumns: string[] = ['gene_id', 'gene_symbol', 'variant_id', 'rsnum', 'chr', 'pos', 'ref', 'alt', 'tss_distance', 'pval_nominal', 'slope', 'slope_se', 'R2'];
  dataSource = new MatTableDataSource<Variant>(this.VARIANT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentMainData.subscribe(mainData => {
      if (mainData) {
        this.locuszoomData = mainData["locuszoom"]["data"][0]; // locuszoom data
      }
      if (this.locuszoomData) {
        this.VARIANT_DATA = this.populateVariantDataList(this.locuszoomData);
      }
    });
    this.dataSource = new MatTableDataSource<Variant>(this.VARIANT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  populateVariantDataList(geneData) {
    var data = [];
    for (var i = 0; i < geneData.length; i++) {
      var variant = {};
      variant['gene_id'] = geneData[i]['gene_id'];
      variant['gene_symbol'] = geneData[i]['gene_symbol'];
      variant['variant_id'] = geneData[i]['variant_id'];
      variant['rsnum'] = geneData[i]['rsnum'];
      variant['chr'] = geneData[i]['chr'];
      variant['pos'] = geneData[i]['variant_id'].split(':')[1];
      variant['ref'] = geneData[i]['ref'];
      variant['alt'] = geneData[i]['alt'];
      variant['tss_distance'] = geneData[i]['tss_distance'];
      variant['pval_nominal'] = geneData[i]['pval_nominal'];
      variant['slope'] = geneData[i]['slope'];
      variant['slope_se'] = geneData[i]['slope_se'];
      variant['R2'] = geneData[i]['R2'];
      data.push(variant);
    }
    console.log(data);
    return data;
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
