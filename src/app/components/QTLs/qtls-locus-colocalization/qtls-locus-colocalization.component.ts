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
  
  ecaviarData: Object;
  
  ECAVIAR_DATA: eCAVIARGeneVariant[];
  // displayedColumns: string[] = ['gene_id', 'gene_symbol', 'variant_id', 'rsnum', 'chr', 'pos', 'ref', 'alt', 'tss_distance', 'pval_nominal', 'slope', 'slope_se', 'gwas_pvalue', 'gwas_z', 'Leadsnp', 'Prob_in_pCausalSet', 'CLPP', 'Prob_in_pCausalSet2', 'CLPP2', 'leadsnp_included'];
  displayedColumns: string[] = ['gene_id', 'gene_symbol', 'rsnum', 'chr', 'pos', 'ref', 'alt', 'tss_distance', 'pval_nominal', 'slope', 'slope_se', 'gwas_pvalue', 'gwas_z', 'Leadsnp', 'Prob_in_pCausalSet', 'CLPP', 'Prob_in_pCausalSet2', 'CLPP2', 'leadsnp_included'];
  dataSource = new MatTableDataSource<eCAVIARGeneVariant>(this.ECAVIAR_DATA);

  blurLoadECAVIAR: boolean;

  correlationScatterThreshold = new FormGroup({
    correlationPvalThreshold: new FormControl({value: 1.0, disabled: true}, [Validators.pattern("^(\-?[0-9]*\.?[0-9]*)$"), Validators.min(0.0), Validators.max(1.0)])
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.data.currentBlurLoadECAVIAR.subscribe(blurLoadECAVIAR => this.blurLoadECAVIAR = blurLoadECAVIAR);
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
      this.dataSource = null;
      if(ecaviarData) {
        this.ecaviarData = ecaviarData["ecaviar"]["data"][0];
        if (this.ecaviarData && this.ecaviarData[0]) {
          console.log(this.ecaviarData);
          this.ECAVIAR_DATA = this.populateECAVIARDataList(this.ecaviarData);
          this.dataSource = new MatTableDataSource<eCAVIARGeneVariant>(this.ECAVIAR_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadECAVIARTable() {
    var url = environment.endpoint + "tmp/" + this.requestID + ".eCAVIAR.txt";
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
