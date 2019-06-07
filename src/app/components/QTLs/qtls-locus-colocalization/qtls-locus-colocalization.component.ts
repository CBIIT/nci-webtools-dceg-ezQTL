import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { MatDialog } from '@angular/material';
import { QTLsLocusAlignmentBoxplotsComponent } from '../qtls-locus-alignment-boxplots/qtls-locus-alignment-boxplots.component';
import { environment } from '../../../../environments/environment' 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

declare let $: any;

@Component({
  selector: 'app-qtls-locus-colocalization',
  templateUrl: './qtls-locus-colocalization.component.html',
  styleUrls: ['./qtls-locus-colocalization.component.css']
})
export class QtlsLocusColocalizationComponent implements OnInit {

  // GWASData: Object;
  locusColocalizationData: Object;
  public correlationScatter = null;
  selectedCorrelation: string;
  selectedCorrelationPvalThreshold: number;

  correlationScatterThreshold = new FormGroup({
    correlationPvalThreshold: new FormControl({value: 1.0, disabled: true}, [Validators.pattern("^(\-?[0-9]*\.?[0-9]*)$"), Validators.min(0.0), Validators.max(1.0)])
  });

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.data.currentMainData.subscribe(mainData => {
      if (mainData) {
        // this.GWASData = mainData["gwas"]["data"][0]; // gwas data
        this.locusColocalizationData = mainData["locus_colocalization"]["data"][0]; // locus alignment data
        if (this.locusColocalizationData && this.locusColocalizationData[0]) {
          // console.log(this.locusColocalizationData);
          this.selectedCorrelation = "R";
          this.selectedCorrelationPvalThreshold = 1.0;
          this.locusColocalizationCorrelationScatterPlot(this.locusColocalizationData, this.selectedCorrelation, this.selectedCorrelationPvalThreshold);
        }
      }
    });
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
