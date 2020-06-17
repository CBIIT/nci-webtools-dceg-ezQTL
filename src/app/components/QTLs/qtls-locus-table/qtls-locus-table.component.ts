import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { environment } from '../../../../environments/environment' 

export interface Variant {
  gene_id: string;
  gene_symbol: string;
  variant_id: string;
  rsnum: string;
  chr: string;
  pos: string;
  ref: string;
  alt: string;
  tss_distance: string;
  pval_nominal: string;
  slope: string;
  slope_se: string;
  R2: string;
}

@Component({
  selector: 'app-qtls-locus-table',
  templateUrl: './qtls-locus-table.component.html',
  styleUrls: ['./qtls-locus-table.component.css']
})
export class QTLsLocusTableComponent implements OnInit {

  locusAlignmentData: Object;
  locusAlignmentDataQTopAnnot: Object;
  VARIANT_DATA: Variant[];
  selectedPop: string[];
  newSelectedPop: string;
  requestID: number;
  displayedColumns: string[] = ['gene_id', 'gene_symbol', 'variant_id', 'rsnum', 'chr', 'pos', 'ref', 'alt', 'tss_distance', 'pval_nominal', 'slope', 'slope_se', 'R2', 'LDpop', 'GWAS', 'gnomAD'];
  dataSource = new MatTableDataSource(this.VARIANT_DATA);

  @ViewChild('LocusTablePaginator') LocusTablePaginator: MatPaginator;
  @ViewChild('LocusTableSort') LocusTableSort: MatSort;

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.data.currentMainData.subscribe(mainData => {
      if (mainData) {
        this.locusAlignmentData = mainData["locus_alignment"]["data"][0]; // locus alignment data
        this.newSelectedPop = mainData["info"]["inputs"]["select_pop"][0]; // inputted populations
        this.locusAlignmentDataQTopAnnot = mainData["locus_alignment"]["top"][0][0]; // locus alignment Top Gene data
        this.requestID = mainData["info"]["inputs"]["request"][0]; // request id
      }
      this.selectedPop = this.newSelectedPop.split('+');; // recalculated new population selection
      this.expandPopulationGroup();
      if (this.locusAlignmentData) {
        this.VARIANT_DATA = this.populateLocusTableDataList(this.locusAlignmentData);
      }
      this.dataSource = new MatTableDataSource(this.VARIANT_DATA);
      this.dataSource.paginator = this.LocusTablePaginator;
      this.dataSource.sort = this.LocusTableSort;
    });
  }

  populateLocusTableDataList(geneData) {
    var data = [];
    for (var i = 0; i < geneData.length; i++) {
      var variant = {};
      variant['gene_id'] = geneData[i]['gene_id'];
      variant['gene_symbol'] = geneData[i]['gene_symbol'];
      variant['variant_id'] = geneData[i]['variant_id'];
      variant['rsnum'] = geneData[i]['rsnum'];
      variant['chr'] = geneData[i]['chr'];
      variant['pos'] = geneData[i]['pos'];
      variant['ref'] = geneData[i]['ref'];
      variant['alt'] = geneData[i]['alt'];
      variant['tss_distance'] = geneData[i]['tss_distance'];
      variant['pval_nominal'] = geneData[i]['pval_nominal'];
      variant['slope'] = geneData[i]['slope'];
      variant['slope_se'] = geneData[i]['slope_se'];
      // variant['R2'] = geneData[i]['R2'] ? geneData[i]['R2'] : "NA";
      variant['R2'] = geneData[i]['R2'];
      variant['LDpop'] = "Go to";
      variant['GWAS'] = "Go to";
      variant['gnomAD'] = "Go to";
      data.push(variant);
    }
    // console.log(data);
    return data;
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filterPredicate = (data, filterValue) => (data.rsnum.trim().toLowerCase().indexOf(filterValue.trim().toLowerCase()) !== -1);  
  // }

  // linkGTExGeneID(gene_id) {
  //   var url = "https://gtexportal.org/home/gene/" + gene_id
  //   var win = window.open(url, '_blank');
  //   win.focus();
  // } 

  // linkGTExGeneSymbol(gene_symbol) {
  //   var url = "https://gtexportal.org/home/gene/" + gene_symbol
  //   var win = window.open(url, '_blank');
  //   win.focus();
  // } 

  // linkGTExVariantID(chr, pos, ref, alt) {
  //   var url = "https://gtexportal.org/home/snp/" + chr + "_" + pos + "_" + ref + "_" + alt + "_b37"
  //   var win = window.open(url, '_blank');
  //   win.focus();
  // } 

  // linkGTExRSNum(rsnum) {
  //   var url = "https://gtexportal.org/home/snp/" + rsnum
  //   var win = window.open(url, '_blank');
  //   win.focus();
  // } 

  linkLDpop(rsnum) {
    var QTopAnnotRef = this.locusAlignmentDataQTopAnnot["rsnum"];
    var selectedPopString = this.selectedPop.join('%2B');
    var url = "https://ldlink.nci.nih.gov/?tab=ldpop&var1=" + rsnum + "&var2=" + QTopAnnotRef + "&pop=" + selectedPopString + "&r2_d=r2"
    var win = window.open(url, '_blank');
    win.focus();
  } 

  linkGWAS(rsnum) {
    var url = "https://www.ebi.ac.uk/gwas/search?query=" + rsnum
    var win = window.open(url, '_blank');
    win.focus();
  }

  linkGnomADBrowser(chr, pos, ref, alt) {
    var url = "http://gnomad.broadinstitute.org/variant/" + chr + "-" + pos + "-" + ref + "-" + alt
    var win = window.open(url, '_blank');
    win.focus();
  }

  exportLocusTable() {
    var exportLines = [];
    var headers = [
      "gene_id", 
      "gene_symbol", 
      "variant_id", 
      "rsnum", 
      "chr", 
      "pos", 
      "ref", 
      "alt", 
      "tss_distance", 
      "pval_nominal",
      "slope",
      "slope_se",
      "R2"
    ];
    var headersString = headers.join(",");
    if (window.navigator.msSaveOrOpenBlob) {
      exportLines.push(headersString);
    } else {
      exportLines.push("data:text/csv;charset=utf-8," + headersString);
    }
    this.VARIANT_DATA.forEach(function (dataRow, index) {
      let line = [];
      line.push(dataRow['gene_id']);
      line.push(dataRow['gene_symbol']);
      line.push(dataRow['variant_id']);
      line.push(dataRow['rsnum']);
      line.push(dataRow['chr']);
      line.push(dataRow['pos']);
      line.push(dataRow['ref']);
      line.push(dataRow['alt']);
      line.push(dataRow['tss_distance']);
      line.push(dataRow['pval_nominal']);
      line.push(dataRow['slope']);
      line.push(dataRow['slope_se']);
      line.push(dataRow['R2']);
      let lineString = line.join(",");
      exportLines.push(lineString);
    });
    var csvContent = exportLines.join("\n");
    // var encodedUri = encodeURI(csvContent);
    if (window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
      window.navigator.msSaveBlob(blob, "locus_variant_details_table.csv");
    } else {
      var encodedUri = encodeURI(csvContent);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = encodedUri;
      a.download = "locus_variant_details_table.csv";
      a.click();
      window.URL.revokeObjectURL(encodedUri);
      a.remove();
    }
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

  expandPopulationGroup() {
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    // AFR
    if (this.selectedPop.includes("AFR")) {
      this.selectedPop = this.remove("AFR", this.selectedPop);
      this.selectedPop = (this.selectedPop.concat(african)).filter(this.unique);
    }
    // AMR
    if (this.selectedPop.includes("AMR")) {
      this.selectedPop = this.remove("AMR", this.selectedPop);
      this.selectedPop = (this.selectedPop.concat(mixedAmerican)).filter(this.unique);
    }
    // EAS
    if (this.selectedPop.includes("EAS")) {
      this.selectedPop = this.remove("EAS", this.selectedPop);
      this.selectedPop = (this.selectedPop.concat(eastAsian)).filter(this.unique);
    }
    // EUR
    if (this.selectedPop.includes("EUR")) {
      this.selectedPop = this.remove("EUR", this.selectedPop);
      this.selectedPop = (this.selectedPop.concat(european)).filter(this.unique);
    }
    // SAS
    if (this.selectedPop.includes("SAS")) {
      this.selectedPop = this.remove("SAS", this.selectedPop);
      this.selectedPop = (this.selectedPop.concat(southAsian)).filter(this.unique);
    }
  }

}
