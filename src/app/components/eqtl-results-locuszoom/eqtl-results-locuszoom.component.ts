import { Component, OnInit, Inject } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';
import { PlotComponent } from 'angular-plotly.js';
import { MatDialog } from '@angular/material';
import { EqtlResultsLocuszoomBoxplotsComponent } from '../eqtl-results-locuszoom-boxplots/eqtl-results-locuszoom-boxplots.component';
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
  selectedPopFinal: string[];
  public graph = null;
  showPopover: boolean;
  collapseInput: boolean;
  selectedRef: string;

  populationSelectedAll: boolean;

  popoverData: Object;

  disableGeneExpressions: boolean;
  inputChanged: boolean;
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
  newSelectedRef: string;

  constructor(private data: EqtlResultsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.currentCollapseInput.subscribe(collapseInput => this.collapseInput = collapseInput);
    this.populationGroups = this.populatePopulationDropdown();
    this.selectedPopFinal = [];
    this.populationSelectedAll = false;
    this.inputChanged = false;
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => {
      this.disableGeneExpressions = disableGeneExpressions;
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
        this.newSelectedRef = mainData["info"]["inputs"]["select_ref"][0]; // inputted ref
        this.requestID = mainData["info"]["inputs"]["request"][0]; // request id
        this.geneList = mainData["info"]["gene_list"]["data"][0]; // get gene list & populate ref gene dropdown
        this.locuszoomData = mainData["locuszoom"]["data"][0]; // locuszoom data
        this.locuszoomDataRC = mainData["locuszoom"]["rc"][0]; // locuszoom RC data
        this.locuszoomDataQTopAnnot = mainData["locuszoom"]["top"][0][0]; // locuszoom Top Gene data
        this.GWASData = mainData["gwas"]["data"][0]; // gwas data
      }
      if (this.locuszoomData) {
        // if (this.geneList) {
        //   if(this.recalculateGeneAttempt == "false") {
        //     this.selectedGene = this.locuszoomDataQTopAnnot["gene_id"]; // default reference gene
        //   } 
        // }
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
    if (this.recalculatePopAttempt == "false") {
      this.selectedPop = ["CEU", "TSI", "FIN", "GBR", "IBS"]; // default population EUR
      this.returnPopulationGroupFinal();
    } else {
      var newSelectedPopList = this.newSelectedPop.split('+');
      this.selectedPop = newSelectedPopList; // recalculated new population selection
      // this.selectedGene = this.newSelectedGene; // recalculated new gene selection
      this.recalculatePopAttempt = "false";
      this.returnPopulationGroupFinal();
    }
    if (this.geneList) {
      if(this.recalculateGeneAttempt == "false") {
        this.selectedGene = this.locuszoomDataQTopAnnot["gene_id"]; // default reference gene
      } else {
        this.selectedGene = this.newSelectedGene; // recalculated new gene selection
        this.recalculateGeneAttempt = "false";
      }
    }
    if (this.recalculateRefAttempt == "false") {
      this.selectedRef = "false"; // default ref rsnum
    } else {
      this.selectedRef = this.newSelectedRef; // recalculated new gene selection
      this.recalculateRefAttempt = "false";
    }
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
    this.recalculatePopAttempt = "true";
    this.returnPopulationGroupFinal();
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
    this.recalculatePopAttempt = "true";
    this.returnPopulationGroupFinal();
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
      hoverData.push(geneData[i]['variant_id'] + '<br>' + 'P Value: ' + geneData[i]['pval_nominal'] + '<br>' + 'Ref. Allele: ' + geneData[i]['ref']);
    }
    return hoverData;
  }

  getHoverDataRC(geneDataRC) {
    var hoverDataRC = [];
    for (var i = 0; i < geneDataRC.length; i++) {
      hoverDataRC.push(geneDataRC[i]['chr'] + ':' + geneDataRC[i]['pos'] + '<br>' + 'Rate: ' + geneDataRC[i]['rate']);
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
    var hoverData = this.getHoverData(geneData);
    var hoverDataRC = this.getHoverDataRC(geneDataRC);

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
      },
      yaxis: 'y2'
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

    var pdata = [topAnnotHighlight, trace1, trace2, trace3, trace4];

    // round most significant pval to next whole number
    // var maxY = Math.ceil(Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
    var chromosome = qDataTopAnnot['chr'];

    var playout = {
      // grid: {
      //   rows: 2, 
      //   columns: 1, 
      //   pattern: 'independent'
      // },
      width: 1000,
      height: 1060,
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
        title: "-log10(P-value)",
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
        title: 'Recombination Rate (cM/Mb)',
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
          sizex: 0.5,
          sizey: 0.5,
          source: "../../../assets/images/eqtl_locuszoom_r2_legend_rotated.png",
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
        t: 100
      },
      showlegend: false,
      clickmode: 'event',
      hovermode: 'closest',
      // paper_bgcolor: "#D3D3D3"
    };
    
    return {
      data: pdata,
      layout: playout, 
      // divId: "eqtl-locuszoom-plot",
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
    var hoverData = this.getHoverData(geneData);
    var hoverDataRC = this.getHoverDataRC(geneDataRC);

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
    var trace1 = {
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
    
    // graph recombination rate line
    var trace2 = {
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
    
    var pdata = [topAnnotHighlight, trace1, trace2];

    // round most significant pval to next whole number
    // var maxY = Math.ceil(Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
    var chromosome = qDataTopAnnot['chr'];
    
    var playout = {
      width: 1000,
      height: 660,
      yaxis: {
        // range: [0, maxY],
        autorange: true,
        title: "-log10(P-value)",
        zeroline: false
      },
      yaxis2: {
        // range: [0, maxY * 10],
        autorange: true,
        title: 'Recombination Rate (cM/Mb)',
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
          sizex: 0.5,
          sizey: 0.5,
          source: "../../../assets/images/eqtl_locuszoom_r2_legend_rotated.png",
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
        t: 100
      },
      showlegend: false,
      clickmode: 'event',
      hovermode: 'closest',
      // annotations: []
      // annotations: [{
      //   x: 152.210492,
      //   y: 14.477790583737521,
      //   text: '<b>1:152210492</b>' + 
      //                 '<br>P Value: <b>3.3282e-15</b>' + 
      //                 '<br>Ref. Allele: <b> ATT</b>' + 
      //                 '<br>────────────────<br>' + 
      //                 '<a href="https://www.google.com"><b>Make LD Reference</b></a>' + 
      //         '<br><a href="https://www.google.com"><b>Show Boxplots</b></a>',
      //   align: "left",
      //   showarrow: true,
      //   clicktoshow: 'onout',
      //   visible: false,
      //   bordercolor: "black",
      //   bgcolor: "white",
      //   borderpad: 10, 
      //   ax: 90,
      //   ay: 0
      // }]
    };
    return {
      data: pdata,
      layout: playout,
      // divId: "eqtl-locuszoom-plot",
      config: {
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"]
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

  // makeLDRef(boxplotData) {
  async makeLDRef() {
    // console.log("Recalculate!");
    // console.log(boxplotData.point_index);
    // var selectedRefString = this.locuszoomData[boxplotData["point_index"]]["rsnum"];
    var selectedRefString = this.popoverData["rsnum"];
    // console.log(selectedRefString);
    var selectedGeneString = this.selectedGene;
    var selectedPopString = this.selectedPop.join('+');
    var recalculateAttempt = "true";
    var recalculatePop = this.recalculatePopAttempt;
    var recalculateGene = this.recalculateGeneAttempt;
    var recalculateRef = "true";
    this.inputChanged = false;
    // reset
    this.data.changeMainData(null);
    this.data.changeSelectedTab(0);
    // calculate
    this.data.recalculateMain(this.associationFile, this.expressionFile, this.genotypeFile, this.gwasFile, this.requestID, selectedPopString, selectedGeneString, selectedRefString, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef)
      .subscribe(
        res => this.data.changeMainData(res),
        error => this.handleError(error)
      )
  } 

  async showBoxplot() {
    if (this.popoverData) {
      // console.log("LOCUSZOOM BOXPLOT DIALOG MODULE OPENED");
      this.dialog.open(EqtlResultsLocuszoomBoxplotsComponent, {
        data: this.popoverData
      });
      this.closePopover();
      this.popoverData = null;
    }
  }

  // plotlyClick(event, plot: PlotComponent) {
  //   if (event.points) {
  //     var point = event.points[0];
  //     this.popoverData = this.locuszoomData[event.points[0].pointIndex];
  //     var newAnnotation = {
  //       x: point.xaxis.d2l(point.x),
  //       y: point.yaxis.d2l(point.y),
  //       text: '<b>' + this.popoverData['variant_id'] + '</b>' + 
  //             '<br>P Value: <b>' + this.popoverData['pval_nominal'] + '</b>' + 
  //             '<br>Ref. Allele: <b>' + this.popoverData['ref'] + '</b>' + 
  //             '<br>────────────────<br>' + 
  //             '<a (click)="makeLDRef()"><b>Make LD Reference</b></a>' + 
  //             '<br><a href="https://www.google.com"><b>Show Boxplots</b></a>',
  //       align: "left",
  //       showarrow: true,
  //       clicktoshow: 'onout',
  //       visible: false,
  //       bordercolor: "black",
  //       bgcolor: "white",
  //       borderpad: 10, 
  //       ax: 90,
  //       ay: 0,
  //     };
  //     console.log(newAnnotation);

  //     // plot.relayout('div', 'annotations[' + this.annotationIndex + ']', newAnnotation);
  //     console.log(this.graph);
  //     if (this.graph.layout.annotations) {
  //       this.graph.layout.annotations.push(newAnnotation);
  //     } else {
  //       this.graph.layout.annotations = [newAnnotation];
  //     }
  //   }
  // }

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
        this.popoverData = this.locuszoomData[event.points[0].pointIndex];
        $('.popover').show();
        if (this.collapseInput) {
          // console.log("INPUT PANEL COLLAPSED");
          $('.popover').show().css({
            position: "absolute",
            top: top + 50, 
            left: left + 190
          });
        } else {
          // console.log("INPUT PANEL SHOWN");
          $('.popover').show().css({
            position: "absolute",
            top: top + 50, 
            left: left + 25
          });
        }
        this.showPopover = true;
      }
    } else {
      this.closePopover2(event);
    }
  }

  // hoverPoint(event, plot: PlotComponent) {
  //   console.log(event.points[0]);
  //   // Plotly.Fx.hover([{curveNumber:event.points[0].curveNumber - 2, pointNumber: event.points[0].pointIndex}]);
  // }

  refGeneChange() {
    this.inputChanged = true;
    this.recalculateGeneAttempt = "true";
    // console.log(this.selectedGene);
  }

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  returnPopulationGroupFinal() {
    this.selectedPopFinal = this.selectedPop;
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    if (this.containsAll(african, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(african, this.selectedPopFinal);
      this.selectedPopFinal.push("AFR");
    }
    if (this.containsAll(mixedAmerican, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(mixedAmerican, this.selectedPopFinal);
      this.selectedPopFinal.push("AMR");
    }
    if (this.containsAll(eastAsian, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(eastAsian, this.selectedPopFinal);
      this.selectedPopFinal.push("EAS");
    }
    if (this.containsAll(european, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(european, this.selectedPopFinal);
      this.selectedPopFinal.push("EUR");
    }
    if (this.containsAll(southAsian, this.selectedPop)) {
      this.selectedPopFinal = this.removeAll(southAsian, this.selectedPopFinal);
      this.selectedPopFinal.push("SAS");
    }
    return this.selectedPopFinal;
  }

  async recalculatePopGene() {
    // console.log("Recalculate!");
    // console.log("Request ID: ", this.requestID);
    // console.log("Selected gene: ", this.selectedGene);
    var selectedGeneString = this.selectedGene;
    // console.log("Selected populations: ", this.selectedPop);
    var selectedPopString = this.selectedPop.join('+');
    // console.log("Selected populations RETURNED: ", selectedPopString);
    var selectedRefString = this.selectedRef;
    var recalculateAttempt = "true";
    var recalculatePop = this.recalculatePopAttempt;
    var recalculateGene = this.recalculateGeneAttempt;
    // console.log("recalculatePop", recalculatePop);
    // console.log("recalculateGene", recalculateGene);
    var recalculateRef = "false";
    this.inputChanged = false;
    this.recalculatePopAttempt = "false";
    this.recalculateGeneAttempt = "false";
    // reset
    this.data.changeMainData(null);
    this.data.changeSelectedTab(0);
    // calculate
    this.data.recalculateMain(this.associationFile, this.expressionFile, this.genotypeFile, this.gwasFile, this.requestID, selectedPopString, selectedGeneString, selectedRefString, recalculateAttempt, recalculatePop, recalculateGene, recalculateRef)
      .subscribe(
        res => this.data.changeMainData(res),
        error => this.handleError(error)
      )
  }

}
