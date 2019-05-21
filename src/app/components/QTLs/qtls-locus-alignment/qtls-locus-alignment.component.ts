import { Component, OnInit, Inject } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { PlotComponent } from 'angular-plotly.js';
import { MatDialog } from '@angular/material';
import { QTLsLocusAlignmentBoxplotsComponent } from '../qtls-locus-alignment-boxplots/qtls-locus-alignment-boxplots.component';
import { environment } from '../../../../environments/environment' 

// import * as Plotly from '../../../../node_modules/plotly.js/dist/plotly.js';

declare let $: any;

export interface PopulationGroup {
  namecode: string;
  name: string;
  subPopulations: SubPopulation[];
}

export interface SubPopulation {
  value: string;
  viewValue: string;
}

export interface ReferenceGene {
  gene_id: string;
  gene_symbol: string;
}

export interface GeneVariants {
  gene_id: string;
  gene_symbol: string;
  rsnum: string;
}

@Component({
  selector: 'app-qtls-locus-alignment',
  templateUrl: './qtls-locus-alignment.component.html',
  styleUrls: ['./qtls-locus-alignment.component.css']
})
export class QTLsLocusAlignmentComponent implements OnInit {

  locusAlignmentData: Object;
  locusAlignmentDataRC: Object;
  locusAlignmentDataQTopAnnot: Object;
  locusAlignmentScatterData: Object;
  locusAlignmentScatterTitle: string;
  GWASData: Object;
  selectedGene: string;
  selectedPop: string[];
  public graph = null;
  public scatter = null;
  showPopover: boolean;
  collapseInput: boolean;
  popoverData: Object;
  disableLocusQuantification: boolean;
  requestID: number;
  associationFile: string;
  expressionFile: string;
  genotypeFile: string;
  gwasFile: string;
  recalculateAttempt: string;
  recalculatePopAttempt: string;
  recalculateGeneAttempt: string;
  recalculateRefAttempt: string;
  newSelectedPop: string;
  newSelectedGene: string;
  blurLoad: boolean;
  disableInputs: boolean;

  constructor(private data: QTLsResultsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.currentBlurLoad.subscribe(blurLoad => this.blurLoad = blurLoad);
    this.data.currentCollapseInput.subscribe(collapseInput => this.collapseInput = collapseInput);
    this.disableInputs = false;
    this.showPopover = false;

    this.data.currentLocusQuantification.subscribe(disableLocusQuantification => {
      this.disableLocusQuantification = disableLocusQuantification;
    });
    this.data.currentMainData.subscribe(mainData => {
      if (mainData) {
        this.recalculateAttempt = mainData["info"]["recalculateAttempt"][0]; // recalculation attempt ?
        this.recalculatePopAttempt = mainData["info"]["recalculatePop"][0]; // recalculation attempt when pop changed ?
        this.recalculateGeneAttempt = mainData["info"]["recalculateGene"][0]; // recalculation attempt when gene changed ?
        this.recalculateRefAttempt = mainData["info"]["recalculateRef"][0]; // recalculation attempt when ref rsnum changed ?
        this.associationFile = mainData["info"]["inputs"]["association_file"][0]; // association filename
        this.expressionFile = mainData["info"]["inputs"]["expression_file"][0]; // expression filename
        this.genotypeFile = mainData["info"]["inputs"]["genotype_file"][0]; // genotype filename
        this.gwasFile = mainData["info"]["inputs"]["gwas_file"][0] // gwas filename
        this.newSelectedPop = mainData["info"]["inputs"]["select_pop"][0]; // inputted populations
        this.newSelectedGene = mainData["info"]["inputs"]["select_gene"][0]; // inputted gene
        this.requestID = mainData["info"]["inputs"]["request"][0]; // request id
        this.locusAlignmentData = mainData["locus_alignment"]["data"][0]; // locus alignment data
        this.locusAlignmentDataRC = mainData["locus_alignment"]["rc"][0]; // locus alignment RC data
        this.locusAlignmentDataQTopAnnot = mainData["locus_alignment"]["top"][0][0]; // locus alignment Top Gene data
        this.locusAlignmentScatterData = mainData["locus_alignment_scatter"]["data"][0]; // locus alignment scatter data
        this.locusAlignmentScatterTitle = mainData["locus_alignment_scatter"]["title"][0]; // locus alignment scatter title
        this.GWASData = mainData["gwas"]["data"][0]; // gwas data

        var newSelectedPopList = this.newSelectedPop.split('+');
        this.selectedPop = newSelectedPopList; // recalculated new population selection
        this.selectedGene = this.newSelectedGene; // recalculated new gene selection
      }
      if (this.locusAlignmentData) {
        // check if there is data in GWAS object
        if (this.GWASData[0] && this.locusAlignmentScatterData[0]) {
          // if there is, graph GWAS plot and scatter plot
          this.graph = this.locusAlignmentPlotGWAS(this.locusAlignmentData, this.GWASData, this.locusAlignmentDataRC, this.locusAlignmentDataQTopAnnot);
          this.scatter = this.locusAlignmentScatterPlot(this.locusAlignmentScatterData, this.locusAlignmentScatterTitle);
        } else {
          // if not, do not graph GWAS plot or scatter plot
          this.graph = this.locusAlignmentPlot(this.locusAlignmentData, this.locusAlignmentDataRC, this.locusAlignmentDataQTopAnnot)
        }
      }
    });
  }

  getXData(geneData) {
    var xData = [];
    for (var i = 0; i < geneData.length; i++) {
      xData.push(geneData[i]['pos'] / 1000000.0);
    }
    return xData;
  }

  getYData(geneData) {
    var yData = [];
    for (var i = 0; i < geneData.length; i++) {
      yData.push(Math.log10(geneData[i]['pval_nominal']) * -1.0);
    }
    return yData;
  }

  getHoverData(geneData) {
    var hoverData = [];
    for (var i = 0; i < geneData.length; i++) {
      if ('rsnum' in geneData[i]) {
        hoverData.push('chr' + geneData[i]['variant_id'] + '<br>' + geneData[i]['rsnum'] + '<br>' + 'Ref/Alt: ' + geneData[i]['ref'] + '/' + geneData[i]['alt'] + '<br>' + 'P-value: ' + geneData[i]['pval_nominal'] + '<br>' + 'Slope: ' + geneData[i]['slope'] + '<br>' + "R2: " + (geneData[i]['R2'] ? geneData[i]['R2'] : "NA").toString());
      } else {
        hoverData.push('chr' + geneData[i]['variant_id'] + '<br>' + 'Ref/Alt: ' + geneData[i]['ref'] + '/' + geneData[i]['alt'] + '<br>' + 'P-value: ' + geneData[i]['pval_nominal'] + '<br>' + 'Slope: ' + geneData[i]['slope'] + + '<br>' + "R2: " + (geneData[i]['R2'] ? geneData[i]['R2'] : "NA").toString());
      }
    }
    return hoverData;
  }

  getHoverDataRC(geneDataRC) {
    var hoverDataRC = [];
    for (var i = 0; i < geneDataRC.length; i++) {
      hoverDataRC.push('chr' + geneDataRC[i]['chr'] + ':' + geneDataRC[i]['pos'] + '<br>' + 'Rate: ' + geneDataRC[i]['rate']);
    }
    return hoverDataRC;
  }

  getYGWASData(geneData) {
    var yData = [];
    for (var i = 0; i < geneData.length; i++) {
      yData.push(Math.log10(geneData[i]['pvalue']) * -1.0);
    }
    return yData;
  }

  getYLDRefGWAS(xData, yGWASData) {
    var LDRefPos = this.locusAlignmentDataQTopAnnot['pos'] / 1000000.0;
    var pointIndex = xData.indexOf(LDRefPos);
    var yLDRef = yGWASData[pointIndex];
    return yLDRef;
  }

  getColorData(geneData) {
    var colorData = [];
    for (var i = 0; i < geneData.length; i++) {
      if (geneData[i]['R2']) {
        colorData.push(geneData[i]['R2']);
      } else {
        colorData.push(0.0);
      }
    }
    return colorData;
  }

  getXDataRC(geneDataRC) {
    var xData = [];
    for (var i = 0; i < geneDataRC.length; i++) {
      xData.push(geneDataRC[i]['pos'] / 1000000.0);
    }
    return xData;
  }

  getYDataRC(geneDataRC) {
    var yData = [];
    for (var i = 0; i < geneDataRC.length; i++) {
      yData.push(geneDataRC[i]['rate']);
    }
    return yData;
  }

  locusAlignmentPlotGWAS(geneData, geneGWASData, geneDataRC, qDataTopAnnot) {
    var xData = this.getXData(geneData);
    var yData = this.getYData(geneData);
    var yGWASData = this.getYGWASData(geneGWASData);
    var colorData = this.getColorData(geneData);
    var xDataRC = this.getXDataRC(geneDataRC);
    var yDataRC = this.getYDataRC(geneDataRC);
    var hoverData = this.getHoverData(geneData);
    var hoverDataRC = this.getHoverDataRC(geneDataRC);
    var xLDRef = qDataTopAnnot['pos'] / 1000000.0;
    var yLDRef = Math.log10(qDataTopAnnot['pval_nominal']) * -1.0;

    // highlight top point
    var topAnnotHighlight = {
      x: [xLDRef],
      y: [yLDRef],
      hoverinfo: 'none',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 15,
        color: "red"
      },
      yaxis: 'y2'
    };

    // highlight top point GWAS
    var topAnnotHighlightGWAS = {
      x: [xLDRef],
      y: [this.getYLDRefGWAS(xData, yGWASData)],
      hoverinfo: 'none',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 15,
        color: "red"
      }
      // yaxis: 'y2'
    };

    // graph GWAS scatter
    var trace1 = {
      x: xData,
      y: yGWASData,
      text: hoverData,
      hoverinfo: 'text',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 7,
        color: colorData,
        colorscale: 'Viridis',
        reversescale: true,
        line: {
          color: 'black',
          width: 1
        },
      },
      // xaxis: 'x',
      yaxis: 'y'
    };

    // graph recombination rate line
    var trace2 = {
      x: xDataRC,
      y: yDataRC,
      text: hoverDataRC,
      hoverinfo: 'text',
      yaxis: 'y3',
      type: 'scatter',
      line: {
        color: 'blue',
        width: 1
      }
    };

    // graph scatter
    var trace3 = {
      x: xData,
      y: yData,
      text: hoverData,
      hoverinfo: 'text',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 7,
        color: colorData,
        colorscale: 'Viridis',
        reversescale: true,
        line: {
          color: 'black',
          width: 1
        },
      },
      // xaxis: 'x',
      yaxis: 'y2'
    };

    // graph recombination rate line
    var trace4 = {
      x: xDataRC,
      y: yDataRC,
      text: hoverDataRC,
      hoverinfo: 'text',
      yaxis: 'y4',
      type: 'scatter',
      line: {
        color: 'blue',
        width: 1
      }
    };

    var pdata = [topAnnotHighlight, topAnnotHighlightGWAS, trace1, trace2, trace3, trace4];

    // round most significant pval to next whole number
    // var maxY = Math.ceil(Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
    var chromosome = qDataTopAnnot['chr'];

    var playout = {
      title: {
        text: 'Locus Alignment Plot',
        xref: 'paper'
      },
      width: 1000,
      height: 1100,
      yaxis: {
        // range: [0, maxY],
        autorange: true,
        title: "GWAS -log10(P-value)",
        domain: [0, 0.48],
        zeroline: false
      },
      yaxis2: {
        // range: [0, maxY],
        autorange: true,
        title: "QTLs -log10(P-value)",
        domain: [0.52, 1],
        zeroline: false
      },
      yaxis3: {
        // range: [0, maxY * 10],
        autorange: true,
        title: 'GWAS Recombination Rate (cM/Mb)',
        titlefont: {
          color: 'blue'
        },
        tickfont: {
          color: 'blue'
        },
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        dtick: 50,
        zeroline: false
      },
      yaxis4: {
        // range: [0, maxY * 10],
        autorange: true,
        title: 'QTLs Recombination Rate (cM/Mb)',
        titlefont: {
          color: 'blue'
        },
        tickfont: {
          color: 'blue'
        },
        overlaying: 'y2',
        side: 'right',
        showgrid: false,
        dtick: 50,
        zeroline: false
      },
      xaxis: {
        autorange: true,
        title: "Chromosome " + chromosome + " (Mb)",
        zeroline: false
      },
      images: [
        {
          x: 0,
          y: 1,
          sizex: 1.0,
          sizey: 1.0,
          source: environment.endpoint + "assets/images/qtls_locus_alignment_r2_legend.png",
          xanchor: "left",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        }
      ],
      margin: {
        l: 40,
        r: 40,
        b: 80,
        t: 140
      },
      showlegend: false,
      clickmode: 'event',
      hovermode: 'closest',
      // paper_bgcolor: "#D3D3D3"
    };
    
    return {
      data: pdata,
      layout: playout, 
      // divId: "qtls-locus-alignment-plot",
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_alignment_manhattan_gwas',
          width: 1000,
          height: 1100,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }
    };
  }

  locusAlignmentPlot(geneData, geneDataRC, qDataTopAnnot) {
    var xData = this.getXData(geneData);
    var yData = this.getYData(geneData);
    var colorData = this.getColorData(geneData);
    var xDataRC = this.getXDataRC(geneDataRC);
    var yDataRC = this.getYDataRC(geneDataRC);
    var hoverData = this.getHoverData(geneData);
    var hoverDataRC = this.getHoverDataRC(geneDataRC);

    // graph recombination rate line
    var trace1 = {
      x: xDataRC,
      y: yDataRC,
      text: hoverDataRC,
      hoverinfo: 'text',
      yaxis: 'y2',
      type: 'scatter',
      line: {
        color: 'blue',
        width: 1
      }
    };

    // highlight top point
    var topAnnotHighlight = {
      x: [qDataTopAnnot['pos'] / 1000000.0],
      y: [Math.log10(qDataTopAnnot['pval_nominal']) * -1.0],
      hoverinfo: 'none',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 15,
        color: "red"
      }
    };

    // graph scatter
    var trace2 = {
      x: xData,
      y: yData,
      text: hoverData,
      hoverinfo: 'text',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 7,
        color: colorData,
        colorscale: 'Viridis',
        reversescale: true,
        line: {
          color: 'black',
          width: 1
        },
      }
    };
    
    var pdata = [trace1, topAnnotHighlight, trace2];

    // round most significant pval to next whole number
    // var maxY = Math.ceil(Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
    var chromosome = qDataTopAnnot['chr'];
    
    var playout = {
      title: {
        text: 'Locus Alignment Plot',
        xref: 'paper'
      },
      width: 1000,
      height: 700,
      yaxis: {
        // range: [0, maxY],
        autorange: true,
        title: "QTLs -log10(P-value)",
        zeroline: false
      },
      yaxis2: {
        // range: [0, maxY * 10],
        autorange: true,
        title: 'QTLs Recombination Rate (cM/Mb)',
        titlefont: {
          color: 'blue'
        },
        tickfont: {
          color: 'blue'
        },
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        dtick: 50,
        zeroline: false
      },
      xaxis: {
        autorange: true,
        title: "Chromosome " + chromosome + " (Mb)",
        zeroline: false
      },
      images: [
        {
          x: 0,
          y: 1,
          sizex: 1.0,
          sizey: 1.0,
          source: environment.endpoint + "assets/images/qtls_locus_alignment_r2_legend.png",
          xanchor: "left",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        }
      ],
      margin: {
        l: 40,
        r: 40,
        b: 80,
        t: 140
      },
      showlegend: false,
      clickmode: 'event',
      hovermode: 'closest'
    };
    return {
      data: pdata,
      layout: playout,
      // divId: "qtls-locus-alignment-plot",
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_alignment_manhattan',
          width: 1000,
          height: 700,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }
    };
  }

  closePopover() {
    $('.popover').hide();
    this.showPopover = false;
  }
  
  // close popover if click anywhere else
  closePopover2(event) {
    if (event.points == null && this.showPopover == true) {
      this.showPopover = false;
    } else {
      this.showPopover = false;
      $('.popover').hide();
    }
  }

  async makeLDRef() {
    // console.log("Recalculate!");
    // console.log(boxplotData.point_index);
    // var selectedRefString = this.locusAlignmentData[boxplotData["point_index"]]["rsnum"];
    var selectedRefString = this.popoverData["rsnum"];
    // this.rsnumSearch = selectedRefString;
    // console.log(selectedRefString);
    var selectedGeneString = this.selectedGene;
    // console.log(selectedGeneString);
    var selectedPopString = this.selectedPop.join('+');
    // console.log(selectedPopString);
    var recalculateAttempt = "true";
    // var recalculatePop = this.recalculatePopAttempt;
    // var recalculateGene = this.recalculateGeneAttempt;
    var recalculatePop = "false";
    var recalculateGene = "false";
    var recalculateRef = "true";
    // this.inputChanged = false;
    // reset
    // this.data.changeMainData(null);
    this.data.changeBlurLoad(true);
    this.disableInputs = true;
    $("#ldref-search-warning").hide();
    $(".blur-loading").addClass("blur-overlay");
    // this.data.changeSelectedTab(0);
    // calculate
    this.data.recalculateMain(this.associationFile, this.expressionFile, this.genotypeFile, this.gwasFile, this.requestID, selectedPopString, selectedGeneString, selectedRefString, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef)
      .subscribe(
        res => {
          this.data.changeMainData(res);
          this.data.changeBlurLoad(false);
          this.disableInputs = false;
          $(".blur-loading").removeClass("blur-overlay");
          this.recalculateRefAttempt = "false";
          this.recalculatePopAttempt = "false";
          this.recalculateGeneAttempt = "false";
        },
        error => {
          this.handleError(error);
          this.data.changeBlurLoad(false);
          this.disableInputs = false;
          $(".blur-loading").removeClass("blur-overlay");
        }
      )
  }

  linkLDpop() {
    var selectedRefString = this.popoverData["rsnum"];
    var QTopAnnotRef = this.locusAlignmentDataQTopAnnot["rsnum"];
    var selectedPopString = this.selectedPop.join('%2B');
    var url = "https://ldlink.nci.nih.gov/?tab=ldpop&var1=" + selectedRefString + "&var2=" + QTopAnnotRef + "&pop=" + selectedPopString + "&r2_d=r2"
    var win = window.open(url, '_blank');
    win.focus();
  } 

  linkGWAS() {
    var selectedRefString = this.popoverData["rsnum"];
    var url = "https://www.ebi.ac.uk/gwas/search?query=" + selectedRefString
    var win = window.open(url, '_blank');
    win.focus();
  }

  linkGnomADBrowser() {
    var variant_id = this.popoverData["variant_id"].split(":");
    var chromosome = variant_id[0];
    var position = variant_id[1];
    var ref = this.popoverData["ref"];
    var alt = this.popoverData["alt"];
    var url = "http://gnomad.broadinstitute.org/variant/" + chromosome + "-" + position + "-" + ref + "-" + alt
    var win = window.open(url, '_blank');
    win.focus();
  }

  async showBoxplot() {
    if (this.popoverData) {
      // console.log("LOCUS ALIGNMENT BOXPLOT DIALOG MODULE OPENED");
      this.dialog.open(QTLsLocusAlignmentBoxplotsComponent, {
        data: this.popoverData
      });
      this.closePopover();
      this.popoverData = null;
    }
  }

  clickPoint(event, plot: PlotComponent) {
    if (event.points) {
      // console.log(event);
      if (event.points[0].hasOwnProperty("marker.color")) {
        // console.log("SHOW MARKER");
        // only show popovers for scatter points not recomb line (points w/ markers)
        var top = event.event.pointerY;
        var left = event.event.pointerX;
        // console.log("event", event);
        // console.log("event.event", event.event);
        // console.log("pointerY", top);
        // console.log("pointerX", left);
        // console.log("pageY", event.event.pageY);
        // console.log("pageX", event.event.pageX);
        // console.log(event.points[0]);
        this.popoverData = this.locusAlignmentData[event.points[0].pointIndex];
        $('.popover').show();
        if (this.collapseInput) { // input panel collapsed
          $('.popover').show().css({
            position: "absolute",
            top: top - 125, 
            left: left + 190
          });
        } else { // input panel shown
          $('.popover').show().css({
            position: "absolute",
            top: top - 125, 
            left: left + 25
          });
        }
        this.showPopover = true;
      }
    } else {
      this.closePopover2(event);
    }
  }
  
  handleError(error) {
    console.log(error);
    this.closePopover();
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  getScatterX(scatterData) {
    var p_values = [];
    for (var i = 0; i < scatterData.length; i++) {
      p_values.push(Math.log10(scatterData[i]['pvalue']) * -1.0);
    }
    return p_values;
  }

  getScatterY(scatterData) {
    var pval_nominals = [];
    for (var i = 0; i < scatterData.length; i++) {
      pval_nominals.push(Math.log10(scatterData[i]['pval_nominal']) * -1.0);
    }
    return pval_nominals;
  }

  getScatterColorData(scatterData) {
    var colorData = [];
    for (var i = 0; i < scatterData.length; i++) {
      if (scatterData[i]['R2']) {
        colorData.push(scatterData[i]['R2']);
      } else {
        colorData.push(0.0);
      }
    }
    return colorData;
  }

  getSum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      if (isFinite(arr[i])) {
        sum += arr[i];
      } else {
        // console.log("NOT FINITE", arr[i]);
      }
    }
    return sum;
  }

  removeInfinities(arr) {
    var finites = [];
    for (var i = 0; i < arr.length; i ++) {
      if (isFinite(arr[i])) {
        finites.push(arr[i]);
      } else {

      }
    }
    return finites;
  }

  getLinearRegression(xData, yData) {
    // console.log("xData", xData);
    // console.log("yData", yData);
    // var sum = (accumulator, currentValue) => accumulator + currentValue;
    var n = (xData.length + yData.length) / 2;
    var xy = []
    var x2 = xData.map(x => x * x);
    for (var i = 0; i < xData.length; i++) {
      xy.push(xData[i] * yData[i]);
    }
    var sum_x = this.getSum(xData);
    // console.log("sum_x", sum_x);
    var sum_y = this.getSum(yData);
    // console.log("sum_y", sum_y);
    var sum_xy = this.getSum(xy);
    // console.log("sum_xy", sum_xy);
    var sum_x2 = this.getSum(x2);
    // console.log("sum_x2", sum_x2);
    var a_numer = (sum_y * sum_x2) - (sum_x * sum_xy);
    var a_denom = (n * sum_x2) - (sum_x * sum_x);
    var a = a_numer / a_denom;
    var b_numer = (n * sum_xy) - (sum_x * sum_y);
    var b_denom = (n * sum_x2) - (sum_x * sum_x);
    var b = b_numer / b_denom;
    return [a, b];
  }

  locusAlignmentScatterPlot(scatterData, scatterTitle) {
    var xData = this.getScatterX(scatterData);
    // console.log("xData", xData);
    var yData = this.getScatterY(scatterData);
    // console.log("yData", yData);
    // console.log(scatterData);
    var scatterColorData = this.getScatterColorData(scatterData);
    var trace1 = {
      x: xData,
      y: yData,
      // hoverinfo: 'x+y',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 7,
        color: scatterColorData,
        colorscale: 'Viridis',
        reversescale: true,
        line: {
          color: 'black',
          width: 1
        },
      }
    };
    // [a, b] -> Y = a + bX
    var linear_regression = this.getLinearRegression(xData, yData);
    var a = linear_regression[0];
    // console.log("a", a);
    var b = linear_regression[1];
    // console.log("b", b);
    var xDataFinites = this.removeInfinities(xData);
    var xMin = Math.min.apply(null, xDataFinites);
    // console.log("xMin", xMin);
    var xMax = Math.max.apply(null, xDataFinites);
    // console.log("xMax", xMax);
    var yMin = a + (b * xMin);
    // console.log("yMin", yMin);
    var yMax = a + (b * xMax);
    // console.log("yMax", yMax);
    var trace2 = {
      x: [xMin, xMax],
      y: [yMin, yMax],
      // hoverinfo: 'x+y',
      mode: 'lines',
      type: 'scatter',
      name: "lines",
      line: {
        color: "blue",
      }
    };
    var pdata = [trace1, trace2];
    // var pdata = [trace1];
    var playout = {
      title: {
        text: scatterTitle,
        xref: 'paper'
      },
      width: 1000,
      height: 700,
      yaxis: {
        autorange: true,
        title: "-log10(eQTL nominal pval)",
      },
      xaxis: {
        autorange: true,
        title: "-log10(GWAS pvalue)",
      },
      margin: {
        l: 40,
        r: 40,
        b: 80,
      },
      showlegend: false,
    };
    return {
      data: pdata,
      layout: playout,
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_alignment_gwas_scatter',
          width: 1000,
          height: 700,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }
    };
  }

}
