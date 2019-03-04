import { Component, OnInit, Inject } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';
import { PlotComponent } from 'angular-plotly.js';
import { MatDialog } from '@angular/material';
import { EqtlResultsLocuszoomBoxplotsComponent } from '../eqtl-results-locuszoom-boxplots/eqtl-results-locuszoom-boxplots.component';

// declare var $; // declare jquery $
// import * as $ from 'jquery';
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

export interface PopoverData {
  point_index: Number;
  variant_id: string;
  pval_nominal: Number;
  ref: string;
}

@Component({
  selector: 'app-eqtl-results-locuszoom',
  templateUrl: './eqtl-results-locuszoom.component.html',
  styleUrls: ['./eqtl-results-locuszoom.component.css']
})
export class EqtlResultsLocuszoomComponent implements OnInit {

  locuszoomData: string;
  locuszoomDataRC: Object;
  locuszoomDataQTopAnnot: Object;
  GWASData: Object;

  geneList: ReferenceGene[];
  selectedGene: string;
  populationGroups: PopulationGroup[];
  selectedPop: string[];
  public graph = null;
  // public graphGWAS = null;
  showPopover: boolean;
  collapseInput: boolean;

  populationSelectedAll: boolean;

  popoverData: PopoverData;
  popoverPoint: Object;

  disableGeneExpressions: boolean;
  inputChanged: boolean;
  requestID: number;
  associationFile: string;
  expressionFile: string;
  genotypeFile: string;
  gwasFile: string;
  recalculateAttempt: string;
  newSelectedPop: string;
  newSelectedGene: string;

  // fileNameDialogRef: MatDialogRef<EqtlResultsLocuszoomBoxplotsComponent>;

  constructor(private data: EqtlResultsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => {
      this.disableGeneExpressions = disableGeneExpressions;
    });
    this.data.currentMainData.subscribe(mainData => {
      if (mainData) {
        this.recalculateAttempt = mainData["info"]["recalculate"][0]; // recalculation attempt ?
        this.associationFile = mainData["info"]["inputs"]["association_file"][0]; // association filename
        this.expressionFile = mainData["info"]["inputs"]["expression_file"][0]; // expression filename
        this.genotypeFile = mainData["info"]["inputs"]["genotype_file"][0]; // genotype filename
        this.gwasFile = mainData["info"]["inputs"]["gwas_file"][0] // gwas filename
        this.newSelectedPop = mainData["info"]["inputs"]["select_pop"][0]; // inputted populations
        this.newSelectedGene = mainData["info"]["inputs"]["select_gene"][0]; // inputted gene
        this.requestID = mainData["info"]["inputs"]["request"][0]; // request id
        this.geneList = mainData["info"]["gene_list"]["data"][0]; // get gene list & populate ref gene dropdown
        this.locuszoomData = mainData["locuszoom"]["data"][0]; // locuszoom data
        this.locuszoomDataRC = mainData["locuszoom"]["rc"][0]; // locuszoom RC data
        this.locuszoomDataQTopAnnot = mainData["locuszoom"]["top"][0][0]; // locuszoom Top Gene data
        this.GWASData = mainData["gwas"]["data"][0]; // gwas data
      }
      if (this.locuszoomData) {
        if (this.geneList) {
          if(this.recalculateAttempt == "false") {
            this.selectedGene = this.locuszoomDataQTopAnnot["gene_id"]; //default reference gene
          } 
          // else {
          //   this.selectedGene = this.newSelectedGene;
          // }
        }
        // check if there is data in GWAS object
        if (this.GWASData[0]) {
          // if there is, graph GWAS plot
          this.graph = this.locuszoomPlotGWAS(this.locuszoomData, this.GWASData, this.locuszoomDataRC, this.locuszoomDataQTopAnnot);
        } else {
          // if not, do not graph GWAS plot
          this.graph = this.locuszoomPlot(this.locuszoomData, this.locuszoomDataRC, this.locuszoomDataQTopAnnot)
        }
      }
    });
    this.data.currentCollapseInput.subscribe(collapseInput => this.collapseInput = collapseInput);
    this.populationGroups = this.populatePopulationDropdown();
    if(this.recalculateAttempt == "false") {
      this.selectedPop = ["CEU", "TSI", "FIN", "GBR", "IBS"]; // default population EUR
    } else {
      var newSelectedPopList = this.newSelectedPop.split('+');
      this.selectedPop = newSelectedPopList; // recalculated new population selection
      this.selectedGene = this.newSelectedGene; // recalculated new gene selection
    }

    this.populationSelectedAll = false;
    this.inputChanged = false;
  }

  populatePopulationDropdown() {
    var populations = [
      {
        namecode: "AFR",
        name: "African",
        subPopulations: [
          { value: "YRI", viewValue: "Yoruba in Ibadan, Nigera" },
          { value: "LWK", viewValue: "Luhya in Webuye, Kenya" },
          { value: "GWD", viewValue: "Gambian in Western Gambia" },
          { value: "MSL", viewValue: "Mende in Sierra Leone" },
          { value: "ESN", viewValue: "Esan in Nigera" },
          { value: "ASW", viewValue: "Americans of African Ancestry in SW USA" },
          { value: "ACB", viewValue: "African Carribbeans in Barbados" },
        ]
      },
      {
        namecode: 'AMR',
        name: "Ad Mixed American",
        subPopulations: [
          { value: "MXL", viewValue: "Mexican Ancestry from Los Angeles, USA" },
          { value: "PUR", viewValue: "Puerto Ricans from Puerto Rico" },
          { value: "CLM", viewValue: "Colombians from Medellin, Colombia" },
          { value: "PEL", viewValue: "Peruvians from Lima, Peru" },
        ]
      },
      {
        namecode: "EAS",
        name: "East Asian",
        subPopulations: [
          { value: "CHB", viewValue: "Han Chinese in Bejing, China" },
          { value: "JPT", viewValue: "Japanese in Tokyo, Japan" },
          { value: "CHS", viewValue: "Southern Han Chinese" },
          { value: "CDX", viewValue: "Chinese Dai in Xishuangbanna, China" },
          { value: "KHV", viewValue: "Kinh in Ho Chi Minh City, Vietnam" },
        ]
      },
      {
        namecode: "EUR",
        name: "European",
        subPopulations: [
          { value: "CEU", viewValue: "Utah Residents from North and West Europe" },
          { value: "TSI", viewValue: "Toscani in Italia" },
          { value: "FIN", viewValue: "Finnish in Finland" },
          { value: "GBR", viewValue: "British in England and Scotland" },
          { value: "IBS", viewValue: "Iberian population in Spain" },
        ]
      },
      {
        namecode: "SAS",
        name: "South Asian",
        subPopulations: [
          { value: "GIH", viewValue: "Gujarati Indian from Houston, Texas" },
          { value: "PJL", viewValue: "Punjabi from Lahore, Pakistan" },
          { value: "BEB", viewValue: "Bengali from Bangladesh" },
          { value: "STU", viewValue: "Sri Lankan Tamil from the UK" },
          { value: "ITU", viewValue: "Indian Telugu from the UK" },
        ]
      }
    ];
    return populations;
  }

  selectAll() {
    if (this.selectedPop.length == 26) {
      this.selectedPop = [];
      if (this.populationSelectedAll == true) {
        this.populationSelectedAll = false;
      } else {
        this.populationSelectedAll = true;
      } 
    } else if (this.selectedPop.length < 26) {
      this.selectedPop = ["ACB", "ASW", "BEB", "CDX", "CEU", "CHB", "CHS", "CLM", "ESN", "FIN", "GBR", "GIH", "GWD", "IBS", "ITU", "JPT", "KHV", "LWK", "MSL", "MXL", "PEL", "PJL", "PUR", "STU", "TSI", "YRI"];
      if (this.populationSelectedAll == true) {
        this.populationSelectedAll = false;
      } else {
        this.populationSelectedAll = true;
      } 
    } else {
      // do nothing
    }
    this.inputChanged = true;
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

  removeAll(subpop, src) {
    var newArray = JSON.parse(JSON.stringify(src));
    for (var i = 0; i < subpop.length; i++) {
      newArray = this.remove(subpop[i], newArray);
    }
    return newArray;
  }


  selectPopulationGroup(groupName) {
    // this.inputChanged = true;
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    if (groupName == "AFR") {
      if (this.containsAll(african, this.selectedPop)) {
        this.selectedPop = this.removeAll(african, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(african)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "AMR") {
      if (this.containsAll(mixedAmerican, this.selectedPop)) {
        this.selectedPop = this.removeAll(mixedAmerican, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(mixedAmerican)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "EAS") {
      if (this.containsAll(eastAsian, this.selectedPop)) {
        this.selectedPop = this.removeAll(eastAsian, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(eastAsian)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "EUR") {
      if (this.containsAll(european, this.selectedPop)) {
        this.selectedPop = this.removeAll(european, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(european)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "SAS") {
      if (this.containsAll(southAsian, this.selectedPop)) {
        this.selectedPop = this.removeAll(southAsian, this.selectedPop);
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(southAsian)).filter(this.unique);
        this.changePop();
      }
    }
  }

  changePop() {
    if (this.selectedPop.length < 26) {
      this.populationSelectedAll = false;
    } else {
      this.populationSelectedAll = true;
    }
    this.inputChanged = true;
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

  getYGWASData(geneData) {
    var yData = [];
    for (var i = 0; i < geneData.length; i++) {
      yData.push(Math.log10(geneData[i]['pvalue']) * -1.0);
    }
    return yData;
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

  locuszoomPlotGWAS(geneData, geneGWASData, geneDataRC, qDataTopAnnot) {
    var xData = this.getXData(geneData);
    var yData = this.getYData(geneData);
    var yGWASData = this.getYGWASData(geneGWASData);

    var colorData = this.getColorData(geneData);

    var xDataRC = this.getXDataRC(geneDataRC);
    var yDataRC = this.getYDataRC(geneDataRC);

    var pdata = [];

    // graph scatter
    var trace1 = {
      x: xData,
      y: yGWASData,
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
        showscale: true,
        colorbar: {
          title: 'R2',
          dtick: 0.25,
          xpad: 45,
          thicknessmode: 'pixels',
          thickness: 15
        }
      },
      // xaxis: 'x',
      yaxis: 'y'
    };
    pdata.push(trace1);

    // graph recombination rate line
    var trace2 = {
      x: xDataRC,
      y: yDataRC,
      yaxis: 'y3',
      type: 'scatter',
      line: {
        color: 'blue',
        width: 1
      }
    };
    pdata.push(trace2);

    // graph GWAS scatter
    var trace3 = {
      x: xData,
      y: yData,
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
        // showscale: true,
        // colorbar: {
        //   title: 'R2',
        //   dtick: 0.25,
        //   xpad: 100,
        //   thicknessmode: 'pixels',
        //   thickness: 15
        // }
      },
      // xaxis: 'x',
      yaxis: 'y2'
    };
    pdata.push(trace3);

    // graph GWAS recombination rate line
    var trace4 = {
      x: xDataRC,
      y: yDataRC,
      yaxis: 'y4',
      type: 'scatter',
      line: {
        color: 'blue',
        width: 1
      }
    };
    pdata.push(trace4);

    // round most significant pval to next whole number
    var maxY = Math.ceil(Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
    var chromosome = qDataTopAnnot['chr'];

    var playout = {
      // grid: {
      //   rows: 2, 
      //   columns: 1, 
      //   subplots:['xy', 'xy2']
      // },
      width: 1000,
      height: 1000,
      yaxis: {
        title: "(GWAS) -log10(P-value)",
        range: [0, maxY],
        domain: [0, 0.5]
      },
      yaxis2: {
        title: "-log10(P-value)",
        range: [0, maxY],
        domain: [0.5, 1]
      },
      yaxis3: {
        title: 'Recombination Rate (cM/Mb)',
        titlefont: {
          color: 'blue'
        },
        tickfont: {
          color: 'blue'
        },
        overlaying: 'y',
        side: 'right',
        range: [0, maxY * 10],
        showgrid: false,
        dtick: 50
      },
      yaxis4: {
        title: 'Recombination Rate (cM/Mb)',
        titlefont: {
          color: 'blue'
        },
        tickfont: {
          color: 'blue'
        },
        overlaying: 'y2',
        side: 'right',
        range: [0, maxY * 10],
        showgrid: false,
        dtick: 50
      },
      xaxis: {
        title: "Chromosome " + chromosome + " (Mb)"
      },
      margin: {
        l: 40,
        r: 40,
        b: 80,
        t: 40
      },
      showlegend: false,
      clickmode: 'event+select',
      hovermode: 'closest'
    };
    
    return {
      data: pdata,
      layout: playout,
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"]
      }
    };
  }

  locuszoomPlot(geneData, geneDataRC, qDataTopAnnot) {
    var xData = this.getXData(geneData);
    var yData = this.getYData(geneData);
    var colorData = this.getColorData(geneData);
    var xDataRC = this.getXDataRC(geneDataRC);
    var yDataRC = this.getYDataRC(geneDataRC);

    var pdata = [];
    // graph scatter
    var trace1 = {
      x: xData,
      y: yData,
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
        showscale: true,
        colorbar: {
          title: 'R2',
          dtick: 0.25,
          xpad: 45,
          thicknessmode: 'pixels',
          thickness: 15
        }
      }
    };
    pdata.push(trace1);
    // graph recombination rate line
    var trace2 = {
      x: xDataRC,
      y: yDataRC,
      yaxis: 'y2',
      type: 'scatter',
      line: {
        color: 'blue',
        width: 1
      }
    };
    pdata.push(trace2);
    // round most significant pval to next whole number
    var maxY = Math.ceil(Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
    var chromosome = qDataTopAnnot['chr'];
    var playout = {
      width: 1000,
      height: 600,
      yaxis: {
        title: "-log10(P-value)",
        range: [0, maxY]
      },
      yaxis2: {
        title: 'Recombination Rate (cM/Mb)',
        titlefont: {
          color: 'blue'
        },
        tickfont: {
          color: 'blue'
        },
        overlaying: 'y',
        side: 'right',
        range: [0, maxY * 10],
        showgrid: false,
        dtick: 50
      },
      xaxis: {
        title: "Chromosome " + chromosome + " (Mb)"
      },
      margin: {
        l: 40,
        r: 40,
        b: 80,
        t: 40
      },
      showlegend: false,
      clickmode: 'event+select',
      hovermode: 'closest'
    };
    return {
      data: pdata,
      layout: playout,
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"]
      }
    };
  }

  populatePopover(pointData, pointIndex) {
    this.popoverPoint = pointData;
    var data = {
      point_index: pointIndex,
      variant_id: pointData.variant_id, 
      pval_nominal: pointData.pval_nominal, 
      ref: pointData.ref, 
    };
    return data;
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

  makeLDRef() {
    alert("make ld ref!");
  } 

  showBoxplot(boxplotData) {
    // console.log(boxplotData);
    this.dialog.open(EqtlResultsLocuszoomBoxplotsComponent, {
      data: {
        point_index: boxplotData.point_index,
        variant_id: boxplotData.variant_id,
        pval_nominal: boxplotData.pval_nominal,
        ref: boxplotData.ref
      }
    });
  }

  clickPoint(event, plot: PlotComponent) {
    // console.log(event.event);
    if (event.points) {
      var top = event.event.offsetY;
      var left = event.event.offsetX;
      // var mouseX = event.event.pageX;
      // var mouseY = event.event.pageY;
      // console.log(event.points[0]);
      this.popoverData = this.populatePopover(this.locuszoomData[event.points[0].pointIndex], event.points[0].pointIndex);
      $('.popover').show();
      if (this.collapseInput) {
        // console.log("INPUT PANEL COLLAPSED");
        $('.popover').css({
          'top': top + 50, 
          'left': left + 190
        });
      } else {
        // console.log("INPUT PANEL SHOWN");
        $('.popover').css({
          'top': top + 50, 
          'left': left + 25
        });
      }
      this.showPopover = true;
    } else {
      this.closePopover2(event);
    }

  }

  refGeneChange() {
    this.inputChanged = true;
    console.log(this.selectedGene);
  }

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  async recalculate() {
    console.log("Recalculate!");
    // console.log("Request ID: ", this.requestID);
    // console.log("Selected gene: ", this.selectedGene);
    var selectedGeneString = this.selectedGene;
    // console.log("Selected populations: ", this.selectedPop);
    var selectedPopString = this.selectedPop.join('+');
    var recalculate = "true";
    this.inputChanged = false;
    // reset
    // this.data.changeResultStatus(false);
    this.data.changeMainData(null);
    this.data.changeSelectedTab(0);
    // calculate
    this.data.recalculateMain(this.associationFile, this.expressionFile, this.genotypeFile, this.gwasFile, this.requestID, selectedPopString, selectedGeneString, recalculate)
      .subscribe(
        res => this.data.changeMainData(res),
        error => this.handleError(error)
      )
  }

}
