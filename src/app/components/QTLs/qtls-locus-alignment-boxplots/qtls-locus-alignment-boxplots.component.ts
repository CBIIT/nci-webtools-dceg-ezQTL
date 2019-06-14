import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { QTLsResultsService } from '../../../services/qtls-results.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  imports: [CommonModule, PlotlyModule],
})

@Component({
  selector: 'app-qtls-locus-alignment-boxplots',
  templateUrl: './qtls-locus-alignment-boxplots.component.html',
  styleUrls: ['./qtls-locus-alignment-boxplots.component.css']
})
export class QTLsLocusAlignmentBoxplotsComponent implements OnInit {

  disableLocusQuantification: boolean;

  boxplotData: Object;
  locusAlignmentData: Object;
  locusAlignmentBoxplotsData: Object;
  expressionFile: string;
  genotypeFile: string;
  mainData: Object;
  select_qtls_samples: string;

  public graph = null;

  constructor(private data: QTLsResultsService, @Inject(MAT_DIALOG_DATA) public popoverData: Object) {
    this.boxplotData = popoverData;
  }

  ngOnInit() {
    this.data.currentLocusQuantification.subscribe(disableLocusQuantification => {
      this.disableLocusQuantification = disableLocusQuantification;
    });
    this.data.currentMainData.subscribe(mainData => {
      this.mainData = mainData;
    });
    if (this.mainData && this.boxplotData && !this.disableLocusQuantification) {
      this.expressionFile = this.mainData["info"]["inputs"]["expression_file"][0]; // expression filename
      this.genotypeFile = this.mainData["info"]["inputs"]["genotype_file"][0]; // genotype filename
      this.select_qtls_samples = this.mainData["info"]["select_qtls_samples"][0]; // use QTLs sample data files ?
      this.locusAlignmentData = this.mainData["locus_alignment"]["data"][0]; // locus alignment data
      if ((this.expressionFile != 'false' && this.genotypeFile != 'false') || this.select_qtls_samples == 'true') {
        this.data.calculateLocusAlignmentBoxplots(this.select_qtls_samples, this.expressionFile, this.genotypeFile, this.boxplotData)
          .subscribe(
            res => { 
              this.locusAlignmentBoxplotsData = res["locus_alignment_boxplots"]["data"][0];
              if (this.locusAlignmentBoxplotsData) {
                this.graph = this.locusAlignmentBoxplots(this.boxplotData, this.locusAlignmentBoxplotsData);
              }
            },
            error => this.handleError(error)
          );
      }
    }
  }

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  getYData(boxplotData) {
    var a0a0 = [];
    var a0a1 = [];
    var a1a1 = [];
    for (var i = 0; i < boxplotData.length; i++) {
      if (boxplotData[i]['Genotype'] == "0/0") {
        a0a0.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
      } 
      if (boxplotData[i]['Genotype'] == "0/1") {
        a0a1.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
      } 
      if (boxplotData[i]['Genotype'] == "1/1") {
        a1a1.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
      } 
  }
    var yData = [a0a0, a0a1, a1a1];
    return yData;
  }

  // x: genotype, y: -log2(exp) + 0.1
  locusAlignmentBoxplots(info, boxplotData) {
    var xData = ["0/0", "0/1", "1/1"];
    var yData = this.getYData(boxplotData);

    var pdata = [];

    for ( var i = 0; i < xData.length; i++ ) {
      var result = {
        type: 'box',
        y: yData[i],
        name: xData[i],
        boxpoints: 'all',
        jitter: 0.5,
        pointpos: 0,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        marker: {
          size: 4
        },
        line: {
          width: 1
        }
      };
      pdata.push(result);
    }

    var playout = {
        width: 1000,
        height: 600,
        xaxis: {
          title: info['rsnum'] + " genotype: " + info['ref'] + "->" + info['alt']
        },
        yaxis: {
          title: info['gene_symbol'] + " mRNA expression (log2)",
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 4,
          gridwidth: 1
        },
        margin: {
          l: 40,
          r: 10,
          b: 80,
          t: 40
        },
        showlegend: true,
        legend: { "orientation": "h" }
    };

    return { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_alignment_boxplots',
          width: 1000,
          height: 600,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      } 
    };

  }

}
