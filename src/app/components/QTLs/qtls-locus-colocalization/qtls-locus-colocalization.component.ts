import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { environment } from '../../../../environments/environment' 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

declare let $: any;

export interface eCAVIARGeneVariant {
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
  gwas_pvalue: string;
  gwas_z: string;
  Leadsnp: string;
  Prob_in_pCausalSet: string;
  CLPP: string;
  Prob_in_pCausalSet2: string;
  CLPP2: string;
  leadsnp_included: string;
}

export interface HyprcolocRow {
  candidate_snp: string;
  traits: string;
  regional_prob: string;
  dropped_trait: string;
  gene_id: string;
  gene_symbol: string;
  iteration: string;
  posterior_explained_by_snp: string;
  posterior_prob: string;
}

export interface HyprcolocSnpscoreRow {
  gene_id: string;
  gene_symbol: string;
  rsnum: string;
  snpscore: string;
}

@Component({
  selector: 'app-qtls-locus-colocalization',
  templateUrl: './qtls-locus-colocalization.component.html',
  styleUrls: ['./qtls-locus-colocalization.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QtlsLocusColocalizationComponent implements OnInit {

  locusColocalizationData: Object;

  public correlationScatter = null;
  selectedCorrelation: string;
  selectedCorrelationPvalThreshold: number;

  requestID: number;
  
  ecaviarData: Object[];
  hyprcolocData: Object[];
  hyprcolocSNPScoreData: Object[];
  
  ECAVIAR_DATA: eCAVIARGeneVariant[];
  HYPRCOLOC_DATA: HyprcolocRow[];
  HYPRCOLOC_SNPSCORE_DATA: HyprcolocSnpscoreRow[];
  // displayedColumns: string[] = ['gene_id', 'gene_symbol', 'variant_id', 'rsnum', 'chr', 'pos', 'ref', 'alt', 'tss_distance', 'pval_nominal', 'slope', 'slope_se', 'gwas_pvalue', 'gwas_z', 'Leadsnp', 'Prob_in_pCausalSet', 'CLPP', 'Prob_in_pCausalSet2', 'CLPP2', 'leadsnp_included'];
  displayedColumnsECAVIAR: string[] = ['gene_id', 'gene_symbol', 'rsnum', 'chr', 'pos', 'ref', 'alt', 'tss_distance', 'pval_nominal', 'slope', 'slope_se', 'gwas_pvalue', 'gwas_z', 'Leadsnp', 'Prob_in_pCausalSet', 'CLPP', 'Prob_in_pCausalSet2', 'CLPP2', 'leadsnp_included'];
  displayedColumnsHyprcoloc: string[] = ['iteration', 'traits', 'posterior_prob', 'regional_prob', 'candidate_snp', 'posterior_explained_by_snp', 'dropped_trait', 'gene_id', 'gene_symbol'];
  displayedColumnsHyprcolocSnpscore: string[] = ['rsnum', 'snpscore', 'gene_id', 'gene_symbol'];
  dataSourceECAVIAR = new MatTableDataSource(this.ECAVIAR_DATA);
  dataSourceHyprcoloc = new MatTableDataSource(this.HYPRCOLOC_DATA);
  dataSourceHyprcolocSnpscore = new MatTableDataSource(this.HYPRCOLOC_SNPSCORE_DATA);

  showECAVIARTable: boolean;
  showHyprcolocTable: boolean;
  showHyprcolocSnpscoreTable: boolean;
  ecaviarWarningMessage: boolean;
  hyprcolocWarningMessage: boolean;
  hyprcolocSnpscoreWarningMessage: boolean;

  correlationScatterThreshold = new FormGroup({
    correlationPvalThreshold: new FormControl({value: 1.0, disabled: true}, [Validators.pattern("^(\-?[0-9]*\.?[0-9]*)$"), Validators.min(0.0), Validators.max(1.0)])
  });

  @ViewChild('ECAVIARPaginator') ECAVIARPaginator: MatPaginator;
  @ViewChild('ECAVIARSort') ECAVIARSort: MatSort;
  @ViewChild('HyprcolocPaginator') HyprcolocPaginator: MatPaginator;
  // @ViewChild('HyprcolocSort') HyprcolocSort: MatSort;
  @ViewChild('HyprcolocSnpscorePaginator') HyprcolocSnpscorePaginator: MatPaginator;
  // @ViewChild('HyprcolocSnpscoreSort') HyprcolocSnpscoreSort: MatSort;

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.data.currentMainData.subscribe(mainData => {
      if (mainData) {
        this.locusColocalizationData = mainData["locus_colocalization_correlation"]["data"][0]; // locus alignment data
        this.requestID = mainData["info"]["inputs"]["request"][0]; // request id
        if (this.locusColocalizationData && this.locusColocalizationData[0]) {
          this.selectedCorrelation = "R";
          this.selectedCorrelationPvalThreshold = 1.0;
          this.locusColocalizationCorrelationScatterPlot(this.locusColocalizationData, this.selectedCorrelation, this.selectedCorrelationPvalThreshold);
        }
      }
    });

    this.data.currentECAVIARData.subscribe(ecaviarData => {
      this.ecaviarData = null;
      this.ECAVIAR_DATA = null;
      this.dataSourceECAVIAR = null;
      this.ecaviarWarningMessage = false;
      if(ecaviarData) {
        this.ecaviarData = ecaviarData["ecaviar"]["data"][0];
        // Populate eCAVIAR table
        if (this.ecaviarData && this.ecaviarData[0]) {
          this.showECAVIARTable = true;
          this.ECAVIAR_DATA = this.populateECAVIARDataList(this.ecaviarData);
          this.dataSourceECAVIAR = new MatTableDataSource(this.ECAVIAR_DATA);
          this.dataSourceECAVIAR.paginator = this.ECAVIARPaginator;
          this.dataSourceECAVIAR.sort = this.ECAVIARSort;
          if (this.ecaviarData != null && this.ecaviarData.length == 0) {
            this.ecaviarWarningMessage = true;
            this.ecaviarData = null;
            this.ECAVIAR_DATA = null;
            this.dataSourceECAVIAR = null;
          }
        } else {
          this.showECAVIARTable = false;
          if (this.ecaviarData != null && this.ecaviarData.length == 0) {
            this.ecaviarWarningMessage = true;
            this.ecaviarData = null;
            this.ECAVIAR_DATA = null;
            this.dataSourceECAVIAR = null;
          }
        }
      } else {
        this.showECAVIARTable = false;
        if (this.ecaviarData != null && this.ecaviarData.length == 0) {
          this.ecaviarWarningMessage = true;
          this.ecaviarData = null;
          this.ECAVIAR_DATA = null;
          this.dataSourceECAVIAR = null;
        }
      }
    });

    this.data.currentHyprcolocData.subscribe(hyprcolocData => {
      this.hyprcolocData = null;
      this.HYPRCOLOC_DATA = null;
      this.dataSourceHyprcoloc = null;
      this.hyprcolocWarningMessage = false;
      this.hyprcolocSNPScoreData = null;
      this.HYPRCOLOC_SNPSCORE_DATA = null;
      this.dataSourceHyprcolocSnpscore = null;
      this.hyprcolocSnpscoreWarningMessage = false;
      if(hyprcolocData) {
        this.hyprcolocData = hyprcolocData["hyprcoloc"]["result_hyprcoloc"]["data"][0];
        this.hyprcolocSNPScoreData = hyprcolocData["hyprcoloc"]["result_snpscore"]["data"][0];
        // console.log(this.hyprcolocData);
        // console.log(this.hyprcolocSNPScoreData);
        if (this.hyprcolocData && this.hyprcolocData[0]) {
          // Populate Hyprcoloc table
          this.showHyprcolocTable = true;
          this.HYPRCOLOC_DATA = this.populateHyprcolocDataList(this.hyprcolocData);
          this.dataSourceHyprcoloc = new MatTableDataSource(this.HYPRCOLOC_DATA);
          this.dataSourceHyprcoloc.paginator = this.HyprcolocPaginator;
          // this.dataSourceHyprcoloc.sort = this.HyprcolocSort;
          if (this.hyprcolocData != null && this.hyprcolocData.length == 0) {
            this.showHyprcolocTable = false;
            this.hyprcolocWarningMessage = true;
            this.hyprcolocData = null;
            this.HYPRCOLOC_DATA = null;
            this.dataSourceHyprcoloc = null;
          }
          // Populate Hyprcoloc snpscore table
          this.showHyprcolocSnpscoreTable = true;
          this.HYPRCOLOC_SNPSCORE_DATA = this.populateHyprcolocSnpscoreDataList(this.hyprcolocSNPScoreData);
          this.dataSourceHyprcolocSnpscore = new MatTableDataSource(this.HYPRCOLOC_SNPSCORE_DATA);
          this.dataSourceHyprcolocSnpscore.paginator = this.HyprcolocSnpscorePaginator;
          // this.dataSourceHyprcolocSnpscore.sort = this.HyprcolocSnpscoreSort;
          if (this.hyprcolocSNPScoreData != null && this.hyprcolocSNPScoreData.length == 0) {
            this.showHyprcolocSnpscoreTable = false;
            this.hyprcolocSnpscoreWarningMessage = true;
            this.hyprcolocSNPScoreData = null;
            this.HYPRCOLOC_SNPSCORE_DATA = null;
            this.dataSourceHyprcolocSnpscore = null;
          }
        } else {
          this.showHyprcolocTable = false;
          this.showHyprcolocSnpscoreTable = false;
          if (this.hyprcolocData != null && this.hyprcolocData.length == 0) {
            this.hyprcolocWarningMessage = true;
            this.hyprcolocData = null;
            this.HYPRCOLOC_DATA = null;
            this.dataSourceHyprcoloc = null;
          }
          if (this.hyprcolocSNPScoreData != null && this.hyprcolocSNPScoreData.length == 0) {
            this.hyprcolocSnpscoreWarningMessage = true;
            this.hyprcolocSNPScoreData = null;
            this.HYPRCOLOC_SNPSCORE_DATA = null;
            this.dataSourceHyprcolocSnpscore = null;
          }
        }
      } else {
        this.showHyprcolocTable = false;
        this.showHyprcolocSnpscoreTable = false;
        if (this.hyprcolocData != null && this.hyprcolocData.length == 0) {
          this.hyprcolocWarningMessage = true;
          this.hyprcolocData = null;
          this.HYPRCOLOC_DATA = null;
          this.dataSourceHyprcoloc = null;
        }
        if (this.hyprcolocSNPScoreData != null && this.hyprcolocSNPScoreData.length == 0) {
          this.hyprcolocSnpscoreWarningMessage = true;
          this.hyprcolocSNPScoreData = null;
          this.HYPRCOLOC_SNPSCORE_DATA = null;
          this.dataSourceHyprcolocSnpscore = null;
        }
      }
    });
  }

  populateECAVIARDataList(ecaviarData) {
    var data = [];
    for (var i = 0; i < ecaviarData.length; i++) {
      var ecaviar = {};
      ecaviar['gene_id'] = ecaviarData[i]['gene_id'];
      ecaviar['gene_symbol'] = ecaviarData[i]['gene_symbol'];
      // ecaviar['variant_id'] = ecaviarData[i]['variant_id'];
      ecaviar['rsnum'] = ecaviarData[i]['rsnum'];
      ecaviar['chr'] = ecaviarData[i]['chr'];
      ecaviar['pos'] = ecaviarData[i]['pos'];
      ecaviar['ref'] = ecaviarData[i]['ref'];
      ecaviar['alt'] = ecaviarData[i]['alt'];
      ecaviar['tss_distance'] = ecaviarData[i]['tss_distance'];
      ecaviar['pval_nominal'] = ecaviarData[i]['pval_nominal'];
      ecaviar['slope'] = ecaviarData[i]['slope'];
      ecaviar['slope_se'] = ecaviarData[i]['slope_se'];
      ecaviar['gwas_pvalue'] = ecaviarData[i]['gwas_pvalue'];
      ecaviar['gwas_z'] = ecaviarData[i]['gwas_z'];
      ecaviar['Leadsnp'] = ecaviarData[i]['Leadsnp'];
      ecaviar['Prob_in_pCausalSet'] = ecaviarData[i]['Prob_in_pCausalSet'];
      ecaviar['CLPP'] = ecaviarData[i]['CLPP'];
      ecaviar['Prob_in_pCausalSet2'] = ecaviarData[i]['Prob_in_pCausalSet2'];
      ecaviar['CLPP2'] = ecaviarData[i]['CLPP2'];
      ecaviar['leadsnp_included'] = ecaviarData[i]['leadsnp_included'];
      data.push(ecaviar);
    }
    return data;
  }

  populateHyprcolocDataList(hyprcolocData) {
    var data = [];
    for (var i = 0; i < hyprcolocData.length; i++) {
      var hyprcoloc = {};
      hyprcoloc['candidate_snp'] = hyprcolocData[i]['candidate_snp'];
      hyprcoloc['traits'] = hyprcolocData[i]['traits'];
      hyprcoloc['regional_prob'] = hyprcolocData[i]['regional_prob'];
      hyprcoloc['dropped_trait'] = hyprcolocData[i]['dropped_trait'];
      hyprcoloc['gene_id'] = hyprcolocData[i]['gene_id'];
      hyprcoloc['gene_symbol'] = hyprcolocData[i]['gene_symbol'];
      hyprcoloc['iteration'] = hyprcolocData[i]['iteration'];
      hyprcoloc['posterior_explained_by_snp'] = hyprcolocData[i]['posterior_explained_by_snp'];
      hyprcoloc['posterior_prob'] = hyprcolocData[i]['posterior_prob'];
      data.push(hyprcoloc);
    }
    return data;
  }

  populateHyprcolocSnpscoreDataList(hyprcolocSNPScoreData) {
    var data = [];
    for (var i = 0; i < hyprcolocSNPScoreData.length; i++) {
      var hyprcolocSNPScore = {};
      hyprcolocSNPScore['gene_id'] = hyprcolocSNPScoreData[i]['gene_id'];
      hyprcolocSNPScore['gene_symbol'] = hyprcolocSNPScoreData[i]['gene_symbol'];
      hyprcolocSNPScore['rsnum'] = hyprcolocSNPScoreData[i]['rsnum'];
      hyprcolocSNPScore['snpscore'] = hyprcolocSNPScoreData[i]['snpscore'];
      data.push(hyprcolocSNPScore);
    }
    return data;
  }

  applyFilterECAVIAR(filterValue: string) {
    this.dataSourceECAVIAR.filter = filterValue.trim().toLowerCase();
  }

  applyFilterHyprcoloc(filterValue: string) {
    this.dataSourceHyprcoloc.filter = filterValue.trim().toLowerCase();
  }

  applyFilterHyprcolocSnpscore(filterValue: string) {
    this.dataSourceHyprcolocSnpscore.filter = filterValue.trim().toLowerCase();
  }

  downloadECAVIARTable() {
    var url = environment.endpoint + "output/" + this.requestID + ".eCAVIAR.txt";
    var win = window.open(url, '_blank');
    win.focus();
  } 

  downloadHyprcolocTable() {
    var url = environment.endpoint + "output/" + this.requestID + ".hyprcoloc.txt";
    var win = window.open(url, '_blank');
    win.focus();
  } 

  downloadHyprcolocSnpscoreTable() {
    var url = environment.endpoint + "output/" + this.requestID + ".hyprcoloc_snpscore.txt";
    var win = window.open(url, '_blank');
    win.focus();
  } 

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  getCorrelationScatterXR(correlationData) {
    var p_values = [];
    for (var i = 0; i < correlationData.length; i++) {
      p_values.push(correlationData[i]['pearson_r']);
    }
    return p_values;
  }

  getCorrelationScatterYR(correlationData) {
    var pval_nominals = [];
    for (var i = 0; i < correlationData.length; i++) {
      pval_nominals.push(correlationData[i]['spearman_r']);
    }
    return pval_nominals;
  }

  getCorrelationScatterHoverDataR(correlationData) {
    var hoverData = [];
    for (var i = 0; i < correlationData.length; i++) {
      hoverData.push(correlationData[i]['gene_symbol'] + '<br>' + 'Pearson: ' + correlationData[i]['pearson_r'] + '<br>' + "Spearman: " + correlationData[i]['spearman_r']);
    }
    return hoverData;
  }

  getCorrelationScatterXP(correlationData, threshold) {
    var p_values = [];
    for (var i = 0; i < correlationData.length; i++) {
      if (correlationData[i]['pearson_p'] <= threshold && correlationData[i]['spearman_p'] <= threshold) {
        p_values.push(Math.log10(correlationData[i]['pearson_p']) * -1.0);
      }
    }
    return p_values;
  }

  getCorrelationScatterYP(correlationData, threshold) {
    var pval_nominals = [];
    for (var i = 0; i < correlationData.length; i++) {
      if (correlationData[i]['pearson_p'] <= threshold && correlationData[i]['spearman_p'] <= threshold) {
        pval_nominals.push(Math.log10(correlationData[i]['spearman_p']) * -1.0);
      }
    }
    return pval_nominals;
  }

  getCorrelationScatterHoverDataP(correlationData, threshold) {
    var hoverData = [];
    for (var i = 0; i < correlationData.length; i++) {
      if (correlationData[i]['pearson_p'] <= threshold && correlationData[i]['spearman_p'] <= threshold) {
        hoverData.push(correlationData[i]['gene_symbol'] + '<br>' + 'Pearson: ' + correlationData[i]['pearson_p'] + '<br>' + "Spearman: " + correlationData[i]['spearman_p']);
      }
    }
    return hoverData;
  }

  locusColocalizationCorrelationScatterPlot(correlationData, correlation, threshold) {
    if (correlation == "R") {
      var xDataR = this.getCorrelationScatterXR(correlationData);
      // console.log("xData", xData);
      var yDataR = this.getCorrelationScatterYR(correlationData);
      // console.log("yData", yData);
      var hoverDataR = this.getCorrelationScatterHoverDataR(correlationData);
    } else {
      var xDataP = this.getCorrelationScatterXP(correlationData, threshold);
      // console.log("xData", xData);
      var yDataP = this.getCorrelationScatterYP(correlationData, threshold);
      // console.log("yData", yData);
      var hoverDataP = this.getCorrelationScatterHoverDataP(correlationData, threshold);
    }
    var trace1 = {
      x: (correlation == "R") ? xDataR : xDataP,
      y: (correlation == "R") ? yDataR : yDataP,
      text: (correlation == "R") ? hoverDataR : hoverDataP,
      hoverinfo: 'text',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 12,
        color: "#cccccc",
        // color: scatterColorData,
        // colorscale: 'Viridis',
        // reversescale: true,
        line: {
          color: 'black',
          width: 1
        },
      }
    };
    var pdata = [trace1];
    var playout = {
      title: {
        text: "Gene Correlation",
        xref: 'paper'
      },
      width: 1000,
      height: 700,
      yaxis: {
        autorange: true,
        automargin: true,
        title: (correlation == "R") ? "Spearman R" : "-log10(Spearman P-value)",
      },
      xaxis: {
        autorange: true,
        automargin: true,
        title: (correlation == "R") ? "Pearson R" : "-log10(Pearson P-value)",
      },
      margin: {
        l: 40,
        r: 40,
        b: 80,
      },
      showlegend: false,
      clickmode: 'none',
      hovermode: 'closest'
    };
    this.correlationScatter = {
      data: pdata,
      layout: playout,
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_colocalization_correlation_scatter',
          width: 1000,
          height: 700,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }
    };
  }

  triggerCorrelationReplot() {
    if (this.selectedCorrelation == "R") {
      this.correlationScatterThreshold.controls['correlationPvalThreshold'].disable();
    } else {
      this.correlationScatterThreshold.controls['correlationPvalThreshold'].enable();
    }
    this.locusColocalizationCorrelationScatterPlot(this.locusColocalizationData, this.selectedCorrelation, this.selectedCorrelationPvalThreshold);
  }

  changeCorrelationPvalThreshold(event: any) {
    var threshold = event.target.value;
    if (threshold >= 0.0 && threshold <= 1.0) {
      if (threshold.length > 0) {
        this.selectedCorrelationPvalThreshold = threshold;
        this.locusColocalizationCorrelationScatterPlot(this.locusColocalizationData, this.selectedCorrelation, this.selectedCorrelationPvalThreshold);
      } else {
        this.locusColocalizationCorrelationScatterPlot(this.locusColocalizationData, this.selectedCorrelation, 1.0);
      }
    }
  }

  clearCorrelationPvalThreshold() {
    this.selectedCorrelationPvalThreshold = 1.0;
    this.correlationScatterThreshold.value.correlationPvalThreshold = '1.0';
    this.locusColocalizationCorrelationScatterPlot(this.locusColocalizationData, this.selectedCorrelation, this.selectedCorrelationPvalThreshold);
  }

  correlationPvalThresholdErrorMsg() {
    var msg = "";
    if (this.correlationScatterThreshold.value.correlationPvalThreshold > 1.0) {
      msg = "Threshold must be <= 1.0";
    } else if (this.correlationScatterThreshold.value.correlationPvalThreshold < 0.0) {
      msg = "Threshold must be >= 0.0";
    } else {
      msg = "Invalid threshold";
    }
    return msg;
  }

}
