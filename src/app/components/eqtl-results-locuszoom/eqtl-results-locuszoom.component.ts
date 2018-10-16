import { Component, OnInit, Inject } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';
import { PlotComponent } from 'angular-plotly.js';
import { MatDialog } from '@angular/material';
import { EqtlResultsLocuszoomBoxplotsComponent } from '../eqtl-results-locuszoom-boxplots/eqtl-results-locuszoom-boxplots.component';


import * as $ from 'jquery';
// import * as Plotly from 'plotly.js';


export interface PopulationGroup {
  namecode: string;
  name: string;
  selected: boolean;
  subPopulations: SubPopulation[];
}

export interface SubPopulation {
  value: string;
  viewValue: string;
  selected: boolean;
}

export interface PopoverData {
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

  eqtlData: Object;
  eqtlDataRC: Object;
  eqtlQDataTopAnnot: Object;
  geneList: string[];
  selectGene: string;
  populationGroups: PopulationGroup[];
  selectedPop: string[];
  public graph = null;

  populationSelectedAll: boolean;

  popoverData: PopoverData;
  popoverPoint: Object;

  // fileNameDialogRef: MatDialogRef<EqtlResultsLocuszoomBoxplotsComponent>;

  constructor(private data: EqtlResultsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.data.currentEqtlData.subscribe(eqtlData => {
      if (eqtlData) {
        this.eqtlData = eqtlData[1];
        this.eqtlDataRC = eqtlData[2]
        this.eqtlQDataTopAnnot = eqtlData[3][0];
      }
      if (this.eqtlData) {
        this.data.currentGeneList.subscribe(geneList => {
          this.geneList = geneList;
          if (this.geneList) {
            this.selectGene = this.eqtlQDataTopAnnot["gene_symbol"]; //default reference gene
          }
        });
        this.graph = this.locuszoomPlot(this.eqtlData, this.eqtlDataRC, this.eqtlQDataTopAnnot);
      }
    });
    this.populationGroups = this.populatePopulationDropdown();
    this.selectedPop = ["CEU", "TSI", "FIN", "GBR", "IBS"]; // default population EUR

    this.populationSelectedAll = false;
  }

  populatePopulationDropdown() {
    var populations = [
      {
        namecode: "AFR",
        name: "African",
        selected: false,
        subPopulations: [
          { value: "YRI", viewValue: "Yoruba in Ibadan, Nigera", selected: false },
          { value: "LWK", viewValue: "Luhya in Webuye, Kenya", selected: false },
          { value: "GWD", viewValue: "Gambian in Western Gambia", selected: false },
          { value: "MSL", viewValue: "Mende in Sierra Leone", selected: false },
          { value: "ESN", viewValue: "Esan in Nigera", selected: false },
          { value: "ASW", viewValue: "Americans of African Ancestry in SW USA", selected: false },
          { value: "ACB", viewValue: "African Carribbeans in Barbados", selected: false },
        ]
      },
      {
        namecode: 'AMR',
        name: "Ad Mixed American",
        selected: false,
        subPopulations: [
          { value: "MXL", viewValue: "Mexican Ancestry from Los Angeles, USA", selected: false },
          { value: "PUR", viewValue: "Puerto Ricans from Puerto Rico", selected: false },
          { value: "CLM", viewValue: "Colombians from Medellin, Colombia", selected: false },
          { value: "PEL", viewValue: "Peruvians from Lima, Peru", selected: false },
        ]
      },
      {
        namecode: "EAS",
        name: "East Asian",
        selected: false,
        subPopulations: [
          { value: "CHB", viewValue: "Han Chinese in Bejing, China", selected: false },
          { value: "JPT", viewValue: "Japanese in Tokyo, Japan", selected: false },
          { value: "CHS", viewValue: "Southern Han Chinese", selected: false },
          { value: "CDX", viewValue: "Chinese Dai in Xishuangbanna, China", selected: false },
          { value: "KHV", viewValue: "Kinh in Ho Chi Minh City, Vietnam", selected: false },
        ]
      },
      {
        namecode: "EUR",
        name: "European",
        selected: false,
        subPopulations: [
          { value: "CEU", viewValue: "Utah Residents from North and West Europe", selected: false },
          { value: "TSI", viewValue: "Toscani in Italia", selected: false },
          { value: "FIN", viewValue: "Finnish in Finland", selected: false },
          { value: "GBR", viewValue: "British in England and Scotland", selected: false },
          { value: "IBS", viewValue: "Iberian population in Spain", selected: false },
        ]
      },
      {
        namecode: "SAS",
        name: "South Asian",
        selected: false,
        subPopulations: [
          { value: "GIH", viewValue: "Gujarati Indian from Houston, Texas", selected: false },
          { value: "PJL", viewValue: "Punjabi from Lahore, Pakistan", selected: false },
          { value: "BEB", viewValue: "Bengali from Bangladesh", selected: false },
          { value: "STU", viewValue: "Sri Lankan Tamil from the UK", selected: false },
          { value: "ITU", viewValue: "Indian Telugu from the UK", selected: false },
        ]
      }
    ];
    return populations;
  }

  selectAll() {
    if (this.selectedPop.length == 26 && this.populationSelectedAll == true) {
      this.selectedPop = [];
      this.populationSelectedAll = false;
    } else if (this.selectedPop.length < 26 || this.populationSelectedAll == false) {
      this.selectedPop = ["ACB", "ASW", "BEB", "CDX", "CEU", "CHB", "CHS", "CLM", "ESN", "FIN", "GBR", "GIH", "GWD", "IBS", "ITU", "JPT", "KHV", "LWK", "MSL", "MXL", "PEL", "PJL", "PUR", "STU", "TSI", "YRI"];
      this.populationSelectedAll = true;
    } else {
      // do nothing
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

  // remove(element, newArray) {
  //   // var newArray = this.selectedPop.slice(0);
  //   // for( var i = 0; i < newarr.length; i++ ) { 
  //   var x = newArray.indexOf(element);
  //   console.log(newArray);
  //   console.log(x);
  //   if (x != -1) {
  //     return newArray.splice(x, 1); 
  //   }
  //   console.log(newArray);
  //   // }
  //   // console.log(newarr);
  //   return newArray;
  //   // this.selectedPop = newarr;
  // }


  selectPopulationGroup(groupName) {
    // console.log(groupName);
    var african = ["YRI", "LWK", "GWD", "MSL", "ESN", "ASW", "ACB"];
    var mixedAmerican = ["MXL", "PUR", "CLM", "PEL"];
    var eastAsian = ["CHB", "JPT", "CHS", "CDX", "KHV"];
    var european = ["CEU", "TSI", "FIN", "GBR", "IBS"];
    var southAsian = ["GIH", "PJL", "BEB", "STU", "ITU"];
    if (groupName == "AFR") {
      if (this.containsAll(african, this.selectedPop)) {
        this.selectedPop = [];
        // this.selectedPop = z;
        // this.selectedPop = ["MSL", "GWD"];
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(african)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "AMR") {
      if (this.containsAll(mixedAmerican, this.selectedPop)) {
        this.selectedPop = [];
        // this.selectedPop = z;
        // this.selectedPop = ["MSL", "GWD"];
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(mixedAmerican)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "EAS") {
      if (this.containsAll(eastAsian, this.selectedPop)) {
        this.selectedPop = [];
        // this.selectedPop = z;
        // this.selectedPop = ["MSL", "GWD"];
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(eastAsian)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "EUR") {
      if (this.containsAll(european, this.selectedPop)) {
        this.selectedPop = [];
        // this.selectedPop = z;
        // this.selectedPop = ["MSL", "GWD"];
        this.changePop();
      } else {
        this.selectedPop = (this.selectedPop.concat(european)).filter(this.unique);
        this.changePop();
      }
    }
    if (groupName == "SAS") {
      if (this.containsAll(southAsian, this.selectedPop)) {
        this.selectedPop = [];
        // this.selectedPop = z;
        // this.selectedPop = ["MSL", "GWD"];
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

  locuszoomPlot(geneData, geneDataRC, qDataTopAnnot) {
    var xData = this.getXData(geneData);
    // console.log(xData);
    var yData = this.getYData(geneData);
    // console.log(yData);
    var colorData = this.getColorData(geneData);
    // console.log(colorData);
    var xDataRC = this.getXDataRC(geneDataRC);
    // console.log(xDataRC);
    var yDataRC = this.getYDataRC(geneDataRC);
    // console.log(yDataRC);
    var pdata = [];
    // graph scatter
    var trace1 = {
      x: xData,
      y: yData,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 8,
        color: colorData,
        colorscale: 'Viridis',
        reversescale: true,
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

  populatePopover(pointData) {
    this.popoverPoint = pointData;
    var data = {
      variant_id: pointData.variant_id, 
      pval_nominal: pointData.pval_nominal, 
      ref: pointData.ref, 
    };
    return data;
  }

  closePopover() {
    $('.popover').hide();
  }

  makeLDRef() {
    alert("make ld ref!");
  } 

  showBoxplot(boxplotData) {
    console.log(boxplotData);
    this.dialog.open(EqtlResultsLocuszoomBoxplotsComponent, {
      data: {
        variant_id: boxplotData.variant_id,
        pval_nominal: boxplotData.pval_nominal,
        ref: boxplotData.ref
      }
    });
  }

  clickPoint(event, plot: PlotComponent) {
    if (event.points) {
      var left = event.event.offsetX;
      var top = event.event.offsetY;
      console.log(event.points[0]);
      this.popoverData = this.populatePopover(this.eqtlData[event.points[0].pointIndex]);
      $('.popover').show();
      $('.popover').css('left', (left + 65));
      $('.popover').css('top', (top + 50));

    }
  }


}
