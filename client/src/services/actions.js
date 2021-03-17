export const UPDATE_KEY = 'UPDATE_KEY';
export const UPDATE_QTLS_GWAS = 'UPDATE_QTLS_GWAS';
export const UPDATE_ERROR = 'UPDATE_ERROR';

const axios = require('axios');
const FormData = require('form-data');

export function updateKey(key, data) {
  return { type: UPDATE_KEY, key, data };
}

export function updateQTLsGWAS(data) {
  return { type: UPDATE_QTLS_GWAS, data };
}

export function updateError(data) {
  return { type: UPDATE_ERROR, data };
}

const getPopoverData = (geneData) => {
  let dataR2 = [];
  for (let i = 0; i < geneData.length; i++) {
    if ("R2" in geneData[i] && geneData[i]["R2"] != "NA") {
      dataR2.push(geneData[i]);
    }
  }
  return dataR2;
}

const getPopoverDataR2NA = (geneData) => {
  let dataR2NA = [];
  for (let i = 0; i < geneData.length; i++) {
    if (!("R2" in geneData[i]) || geneData[i]["R2"] == "NA") {
      dataR2NA.push(geneData[i]);
    }
  }
  return dataR2NA;
}

const getPopoverDataGWAS = (geneData) => {
  let dataGWASR2 = [];
  for (let i = 0; i < geneData.length; i++) {
    if ("R2" in geneData[i] && geneData[i]["R2"] != "NA") {
      dataGWASR2.push(geneData[i]);
    }
  }
  return dataGWASR2;
}

const getPopoverDataGWASR2NA = (geneData) => {
  let dataGWASR2NA = [];
  for (let i = 0; i < geneData.length; i++) {
    if (!("R2" in geneData[i]) || geneData[i]["R2"] == "NA") {
      dataGWASR2NA.push(geneData[i]);
    }
  }
  return dataGWASR2NA;
}

const getXData = (geneData) => {
  let xData = [];
  for (let i = 0; i < geneData.length; i++) {
    xData.push(geneData[i]['pos'] / 1000000.0);
  }
  return xData;
}

const getYData = (geneData) => {
  let yData = [];
  for (let i = 0; i < geneData.length; i++) {
    yData.push(Math.log10(geneData[i]['pval_nominal']) * -1.0);
  }
  return yData;
}

const getHoverData = (geneData) => {
  let hoverData = [];
  for (let i = 0; i < geneData.length; i++) {
    if ('rsnum' in geneData[i]) {
      hoverData.push('chr' + geneData[i]['chr'] + ':' + geneData[i]['pos'] + '<br>' + geneData[i]['rsnum'] + '<br>' + 'Ref/Alt: ' + geneData[i]['ref'] + '/' + geneData[i]['alt'] + '<br>' + '<i>P</i>-value: ' + geneData[i]['pval_nominal'] + '<br>' + 'Slope: ' + geneData[i]['slope'] + '<br>' + "R2: " + (geneData[i]['R2'] ? geneData[i]['R2'] : "NA").toString());
    } else {
      hoverData.push('chr' + geneData[i]['chr'] + ':' + geneData[i]['pos'] + '<br>' + 'Ref/Alt: ' + geneData[i]['ref'] + '/' + geneData[i]['alt'] + '<br>' + '<i>P</i>-value: ' + geneData[i]['pval_nominal'] + '<br>' + 'Slope: ' + geneData[i]['slope'] + '<br>' + "R2: " + (geneData[i]['R2'] ? geneData[i]['R2'] : "NA").toString());
    }
  }
  return hoverData;
}

const getHoverDataGWAS = (geneGWASData) => {
  let hoverData = [];
  for (let i = 0; i < geneGWASData.length; i++) {
    if ('rsnum' in geneGWASData[i]) {
      hoverData.push('chr' + geneGWASData[i]['chr'] + ':' + geneGWASData[i]['pos'] + '<br>' + geneGWASData[i]['rsnum'] + '<br>' + 'Ref/Alt: ' + geneGWASData[i]['ref'] + '/' + geneGWASData[i]['alt'] + '<br>' + '<i>P</i>-value: ' + geneGWASData[i]['pvalue'] + '<br>' + 'Slope: ' + geneGWASData[i]['slope'] + '<br>' + "R2: " + (geneGWASData[i]['R2'] ? geneGWASData[i]['R2'] : "NA").toString());
    } else {
      hoverData.push('chr' + geneGWASData[i]['chr'] + ':' + geneGWASData[i]['pos'] + '<br>' + 'Ref/Alt: ' + geneGWASData[i]['ref'] + '/' + geneGWASData[i]['alt'] + '<br>' + '<i>P</i>-value: ' + geneGWASData[i]['pvalue'] + '<br>' + 'Slope: ' + geneGWASData[i]['slope'] + '<br>' + "R2: " + (geneGWASData[i]['R2'] ? geneGWASData[i]['R2'] : "NA").toString());
    }
  }
  return hoverData;
}

const getHoverDataRC = (geneDataRC) => {
  let hoverDataRC = [];
  for (let i = 0; i < geneDataRC.length; i++) {
    hoverDataRC.push('chr' + geneDataRC[i]['chr'] + ':' + geneDataRC[i]['pos'] + '<br>' + 'Rate: ' + geneDataRC[i]['rate']);
  }
  return hoverDataRC;
}

const getYGWASData = (geneData) => {
  let yData = [];
  for (let i = 0; i < geneData.length; i++) {
    yData.push(Math.log10(geneData[i]['pvalue']) * -1.0);
  }
  return yData;
}

const getYLDRefGWAS = (xData, yGWASData, locusAlignmentDataQTopAnnot) => {
  let LDRefPos = locusAlignmentDataQTopAnnot['pos'] / 1000000.0;
  let pointIndex = xData.indexOf(LDRefPos);
  let yLDRef = yGWASData[pointIndex];
  return yLDRef;
}

const getColorData = (geneData) => {
  let colorData = [];
  for (let i = 0; i < geneData.length; i++) {
    colorData.push(geneData[i]['R2']);
  }
  // normalize R2 color data between 0 and 1 for color spectrum
  for (let i = 0; i < colorData.length; i++) {
    colorData[i] = (colorData[i] / (Math.max.apply(null, colorData) / 100) ) / 100.0;
  }
  return colorData;
}

const getXDataRC = (geneDataRC) => {
  let xData = [];
  for (let i = 0; i < geneDataRC.length; i++) {
    xData.push(geneDataRC[i]['pos'] / 1000000.0);
  }
  return xData;
}

const getYDataRC = (geneDataRC) => {
  let yData = [];
  for (let i = 0; i < geneDataRC.length; i++) {
    yData.push(geneDataRC[i]['rate']);
  }
  return yData;
}

const getMaxFinite = (data) => {
  let max = Number.NEGATIVE_INFINITY;
  for(let i = 0; 0 < data.length; i++) {
    if (isFinite(data[i])) {
      if (data[i] > max) {
        max = data[i];
      }
    }
  }
  return max;
}

const removeInfinities = (arr) => {
  let finites = [];
  for (let i = 0; i < arr.length; i ++) {
    if (isFinite(arr[i])) {
      finites.push(arr[i]);
    } else {

    }
  }
  return finites;
}

const drawLocusAlignment = (response) => {
  const geneDataR2 = getPopoverData(response.data['locus_alignment']['data'][0]);
  const geneDataR2NA = getPopoverDataR2NA(response.data['locus_alignment']['data'][0]);

  const xData = getXData(geneDataR2);
  const yData = getYData(geneDataR2);
  const xDataR2NA = getXData(geneDataR2NA);
  const yDataR2NA = getYData(geneDataR2NA);
  const colorData = getColorData(geneDataR2);
  const xDataRC = getXDataRC(response.data['locus_alignment']['rc'][0]);
  const yDataRC = getYDataRC(response.data['locus_alignment']['rc'][0]);
  const hoverData = getHoverData(geneDataR2);
  const hoverDataR2NA = getHoverData(geneDataR2NA);
  const hoverDataRC = getHoverDataRC(response.data['locus_alignment']['rc'][0]);
  const xLDRef = response.data['locus_alignment']['top'][0][0]['pos'] / 1000000.0;
  const yLDRef = Math.log10(response.data['locus_alignment']['top'][0][0]['pval_nominal']) * -1.0;
  const yDataFinites = removeInfinities(yData);
  const topPvalY = Math.max.apply(null, yDataFinites);
  const topPvalIdx = yData.indexOf(topPvalY);

  // mark point with most significant P-value
  const topPvalMarker = {
    x: [xData[topPvalIdx]],
    y: [topPvalY],
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: "diamond",
      size: 15,
      opacity: 1.0,
      color: "#ff66cc",
      line: {
        color: '#ff66cc',
        width: 2
      },
    },
    yaxis: 'y2'
  };
  // highlight top point
  const LDRefHighlight = {
    x: [response.data['locus_alignment']['top'][0][0]['pos'] / 1000000.0],
    y: [Math.log10(response.data['locus_alignment']['top'][0][0]['pval_nominal']) * -1.0],
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      opacity: 1.0, 
      size: 15,
      color: "red"
    },
    yaxis: 'y2'
  };

  // console.log("qDataTopAnnot", qDataTopAnnot);
  // console.log("xLDRef", qDataTopAnnot['pos'] / 1000000.0);
  // console.log("yLDRef", Math.log10(qDataTopAnnot['pval_nominal']) * -1.0);
  // console.log("LDRefHighlight", LDRefHighlight);

  // graph scatter where R2 != NA
  const trace1 = {
    x: xData,
    y: yData,
    text: hoverData,
    hoverinfo: 'text',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 7,
      opacity: 1.0,
      color: colorData,
      colorscale: 'Viridis',
      reversescale: true,
      line: {
        color: 'black',
        width: 1
      },
    },
    yaxis: 'y2'
  };
  // graph scatter where R2 == NA
  const trace1R2NA = {
    x: xDataR2NA,
    y: yDataR2NA,
    text: hoverDataR2NA,
    hoverinfo: 'text',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 7,
      opacity: 1.0,
      color: '#cccccc',
      line: {
        color: 'black',
        width: 1
      },
    },
    yaxis: 'y2'
  };
  // graph recombination rate line
  const trace2 = {
    x: xDataRC,
    y: yDataRC,
    text: hoverDataRC,
    hoverinfo: 'text',
    yaxis: 'y3',
    type: 'scatter',
    opacity: 0.35,
    line: {
      color: 'blue',
      width: 1
    }
  };
  // graph gene density where R2 != NA
  const trace3 = {
    x: xData,
    y: Array(xData.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: "line-ns-open",
      size: 16,
      color: colorData,
      colorscale: 'Viridis',
      reversescale: true
    },
    yaxis: 'y'

  };
  // graph gene density where R2 == NA
  const trace3R2NA = {
    x: xDataR2NA,
    y: Array(xDataR2NA.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: "line-ns-open",
      size: 16,
      color: '#cccccc',
    },
    yaxis: 'y'

  };
  const pdata = [
    topPvalMarker, 
    LDRefHighlight, 
    trace1, 
    trace1R2NA, 
    trace2, 
    trace3, 
    trace3R2NA
  ];

  const locus_alignment_plot_layout = {
    title: {
      text: 'QTLs Chromosome ' + response.data['locus_alignment']['top'][0][0]['chr'] + ' Variants',
      xref: 'paper'
    },
    width: 1000,
    height: 780,
    yaxis: {
      autorange: true,
      fixedrange: true,
      // overlaying: false,
      // title: "Gene Density",
      domain: [0, 0.04],
      zeroline: false,
      showgrid: false,
      showticklabels: false,
      linecolor: 'black',
      linewidth: 1,
      mirror: true,
      font: {
        color: 'black'
      },
      tickfont: {
        color: 'black'
      }
    },
    yaxis2: {
      autorange: true,
      automargin: true,
      // overlaying: 'y3',
      title: "QTLs -log10(<i>P</i>-value), " + response.data['locus_alignment']['top'][0][0]['gene_symbol'],
      domain: [0.05, 1],
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
      font: {
        color: 'black'
      },
      tickfont: {
        color: 'black'
      }
    },
    yaxis3: {
      autorange: true,
      automargin: true,
      overlaying: 'y2',
      title: 'QTLs Recombination Rate (cM/Mb)',
      titlefont: {
        color: 'blue'
      },
      tickfont: {
        color: 'blue'
      },
      side: 'right',
      showgrid: false,
      zeroline: false,
      linecolor: 'black',
      linewidth: 1
    },
    xaxis: {
      autorange: true,
      title: "Chromosome " + response.data['locus_alignment']['top'][0][0]['chr'] + " (Mb)",
      // dtick: 0.1,
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
      mirror: "allticks",
      font: {
        color: 'black'
      },
      tickfont: {
        color: 'black'
      }
    },
    images: [
      {
        x: 0,
        y: 1.02,
        sizex: 1.0,
        sizey: 1.0,
        source: 'assets/images/qtls_locus_alignment_r2_legend_transparent.png',
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
      t: 120
    },
    showlegend: false,
    clickmode: 'event',
    hovermode: 'closest'
  };
  
  return {
    pdata,
    locus_alignment_plot_layout
  }
}

const drawLocusAlignmentGWAS = (response) => {
  const geneDataR2 = getPopoverData(response.data['locus_alignment']['data'][0]);
  const geneDataR2NA = getPopoverDataR2NA(response.data['locus_alignment']['data'][0]);
  const geneGWASDataR2 = getPopoverDataGWAS(response.data['gwas']['data'][0]);
  const geneGWASDataR2NA = getPopoverDataGWASR2NA(response.data['gwas']['data'][0]);

  const xData = getXData(geneDataR2);
  const yData = getYData(geneDataR2);
  const xDataR2NA = getXData(geneDataR2NA);
  const yDataR2NA = getYData(geneDataR2NA);
  const yGWASData = getYGWASData(geneGWASDataR2);
  const yGWASDataR2NA = getYGWASData(geneGWASDataR2NA);
  const colorData = getColorData(geneDataR2);
  const xDataRC = getXDataRC(response.data['locus_alignment']['rc'][0]);
  const yDataRC = getYDataRC(response.data['locus_alignment']['rc'][0]);
  const hoverData = getHoverData(geneDataR2);
  const hoverDataR2NA = getHoverData(geneDataR2NA);
  const hoverDataGWAS = getHoverDataGWAS(geneGWASDataR2);
  const hoverDataGWASR2NA = getHoverDataGWAS(geneGWASDataR2NA);
  const hoverDataRC = getHoverDataRC(response.data['locus_alignment']['rc'][0]);
  const xLDRef = response.data['locus_alignment']['top'][0][0]['pos'] / 1000000.0;
  const yLDRef = Math.log10(response.data['locus_alignment']['top'][0][0]['pval_nominal']) * -1.0;
  const yDataFinites = removeInfinities(yData);
  const topPvalY = Math.max.apply(null, yDataFinites);
  const topPvalIdx = yData.indexOf(topPvalY);

  // mark point with most significant P-value
  const topPvalMarker = {
    x: [xData[topPvalIdx]], 
    y: [topPvalY], 
    hoverinfo: 'none', 
    mode: 'markers', 
    type: 'scatter', 
    marker: {
      symbol: "diamond",
      size: 15,
      opacity: 1.0,
      color: "#ff66cc",
      line: {
        color: '#ff66cc',
        width: 2
      },
    },
    yaxis: 'y3'
  };
  // highlight top point
  const LDRefHighlight = {
    x: [xLDRef],
    y: [yLDRef],
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 15,
      color: "red"
    },
    yaxis: 'y3'
  };
  // highlight top point GWAS
  const LDRefHighlightGWAS = {
    x: [xLDRef],
    y: [getYLDRefGWAS(xData, yGWASData, response.data['locus_alignment']['top'][0][0])],
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 15,
      color: "red"
    },
    yaxis: 'y2'
  };
  // graph GWAS scatter where R2 != NA
  const trace1 = {
    x: xData,
    y: yGWASData,
    text: hoverDataGWAS,
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
    yaxis: 'y2'
  };
  // graph GWAS scatter where R2 == NA
  const trace1R2NA = {
    x: xDataR2NA,
    y: yGWASDataR2NA,
    text: hoverDataGWASR2NA,
    hoverinfo: 'text',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 7,
      color: '#cccccc',
      line: {
        color: 'black',
        width: 1
      },
    },
    yaxis: 'y2'
  };
  // graph recombination rate line GWAS
  const trace2 = {
    x: xDataRC,
    y: yDataRC,
    text: hoverDataRC,
    hoverinfo: 'text',
    yaxis: 'y4',
    type: 'scatter',
    opacity: 0.35,
    line: {
      color: 'blue',
      width: 1
    }
  };
  // graph scatter where R2 != NA
  const trace3 = {
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
    yaxis: 'y3'
  };
  // graph scatter where R2 == NA
  const trace3R2NA = {
    x: xDataR2NA,
    y: yDataR2NA,
    text: hoverDataR2NA,
    hoverinfo: 'text',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 7,
      color: '#cccccc',
      line: {
        color: 'black',
        width: 1
      },
    },
    yaxis: 'y3'
  };
  // graph recombination rate line
  const trace4 = {
    x: xDataRC,
    y: yDataRC,
    text: hoverDataRC,
    hoverinfo: 'text',
    yaxis: 'y5',
    type: 'scatter',
    opacity: 0.35,
    line: {
      color: 'blue',
      width: 1
    }
  };
  // graph gene density where R2 != NA
  const trace5 = {
    x: xData,
    y: Array(xData.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: "line-ns-open",
      size: 16,
      color: colorData,
      colorscale: 'Viridis',
      reversescale: true
    },
    yaxis: 'y'
  };
  // graph gene density where R2 == NA
  const trace5R2NA = {
    x: xDataR2NA,
    y: Array(xDataR2NA.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: "line-ns-open",
      size: 16,
      color: '#cccccc',
    },
    yaxis: 'y'
  };
  
  const pdata = [
    topPvalMarker,
    LDRefHighlight, 
    LDRefHighlightGWAS, 
    trace1, 
    trace1R2NA,
    trace2, 
    trace3, 
    trace3R2NA, 
    trace4, 
    trace5, 
    trace5R2NA
  ];

  const locus_alignment_plot_layout = {
    title: {
      text: 'QTLs-GWAS Chromosome ' + response.data['locus_alignment']['top'][0][0]['chr'] + ' Variants',
      xref: 'paper',
    },
    font: {
      color: 'black',
    },
    width: 1000,
    height: 1180,
    yaxis: {
      autorange: true,
      fixedrange: true,
      // overlaying: false,
      // title: "Gene Density",
      domain: [0, 0.025],
      zeroline: false,
      showgrid: false,
      showticklabels: false,
      linecolor: 'black',
      linewidth: 1,
      mirror: true,
      font: {
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    yaxis2: {
      autorange: true,
      automargin: true,
      title: 'GWAS -log10(<i>P</i>-value)',
      domain: [0.03, 0.54],
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
      font: {
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    yaxis3: {
      autorange: true,
      automargin: true,
      title: 'QTLs -log10(<i>P</i>-value), ' + response.data['locus_alignment']['top'][0][0]['gene_symbol'],
      domain: [0.56, 1],
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
      font: {
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    yaxis4: {
      autorange: true,
      automargin: true,
      title: 'Recombination Rate (cM/Mb)',
      titlefont: {
        color: 'blue',
      },
      tickfont: {
        color: 'blue',
      },
      overlaying: 'y2',
      side: 'right',
      showgrid: false,
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
    },
    yaxis5: {
      autorange: true,
      automargin: true,
      title: 'Recombination Rate (cM/Mb)',
      titlefont: {
        color: 'blue',
      },
      tickfont: {
        color: 'blue',
      },
      overlaying: 'y3',
      side: 'right',
      showgrid: false,
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
    },
    xaxis: {
      autorange: true,
      title: 'Chromosome ' + response.data['locus_alignment']['top'][0][0]['chr'] + ' (Mb)',
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
      mirror: 'allticks',
      font: {
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    images: [
      {
        x: 0,
        y: 1.01,
        sizex: 1.0,
        sizey: 1.0,
        source: 'assets/images/qtls_locus_alignment_r2_legend_transparent.png',
        xanchor: 'left',
        xref: 'paper',
        yanchor: 'bottom',
        yref: 'paper',
      },
    ],
    margin: {
      l: 40,
      r: 40,
      b: 80,
      t: 120,
    },
    showlegend: false,
    clickmode: 'event',
    hovermode: 'closest',
  };

  return {
    pdata,
    locus_alignment_plot_layout
  }
}

export function uploadFile(params) {
  return async function (dispatch, getState) {
    const form = new FormData();
    form.append('request_id', params.request.toString());
    form.append('associationFile', params.associationFile);
    form.append('quantificationFile', params.quantificationFile);
    form.append('genotypeFile', params.genotypeFile);
    form.append('gwasFile', params.gwasFile);
    form.append('LDFile', params.LDFile);
    form.append('associationFileName', params.associationFileName);
    form.append('quantificationFileName', params.quantificationFileName);
    form.append('genotypeFileName', params.genotypeFileName);
    form.append('gwasFileName', params.gwasFileName);
    form.append('LDFileName', params.LDFileName);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    try {
      const res = await axios.post('api/file-upload', form, config);
      if (res.data.files && res.data.files.length > 0) {
        dispatch(updateQTLsGWAS({
            associationFile: res.data.body.associationFileName !== 'false' ? res.data.files.filter((item) => item.filename === res.data.body.associationFileName)[0].filename : '',
            quantificationFile: res.data.body.quantificationFileName !== 'false' ? res.data.files.filter((item) => item.filename === res.data.body.quantificationFileName)[0].filename : '',
            genotypeFile: res.data.body.genotypeFileName !== 'false' ? res.data.files.filter((item) => item.filename === res.data.body.genotypeFileName)[0].filename : '',
            gwasFile: res.data.body.gwasFileName !== 'false' ? res.data.files.filter((item) => item.filename === res.data.body.gwasFileName)[0].filename : '',
            LDFile: res.data.body.LDFileName !== 'false' ? res.data.files.filter((item) => item.filename === res.data.body.LDFileName)[0].filename : '',
          })
        );
      }
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(updateError({ visible: true }));
        dispatch(updateQTLsGWAS({ isError: true, activeResultsTab: 'locus-alignment' }));
      }
    }
  }
}

export function qtlsGWASCalculation(params) {
  return async function (dispatch, getState) {
    // const qtlsGWASState = getState();
    // console.log('qtlsGWASState', qtlsGWASState);

    dispatch(updateQTLsGWAS({
          submitted: true,
          isLoading: true,
        })
    );

    axios
      .post('api/qtls-calculate-main', params)
      .then(function (response) {
        
        console.log('api/qtls-calculate-main response.data', response.data);

        const {
          pdata,
          locus_alignment_plot_layout
        } = Object.keys(response.data['gwas']['data'][0]).length > 0 ? drawLocusAlignmentGWAS(response) : drawLocusAlignment(response);

        dispatch(updateQTLsGWAS({
              openSidebar: false,
              select_qtls_samples: response.data['info']['select_qtls_samples'][0],
              select_gwas_sample: response.data['info']['select_gwas_sample'][0],
              select_ref: response.data['locus_alignment']['top'][0][0]['rsnum'],
              recalculateAttempt: response.data['info']['recalculateAttempt'][0],
              recalculatePop: response.data['info']['recalculatePop'][0],
              recalculateGene: response.data['info']['recalculateGene'][0],
              recalculateDist: response.data['info']['recalculateDist'][0],
              recalculateRef: response.data['info']['recalculateRef'][0],
              top_gene_variants: {
                data: response.data['info']['top_gene_variants']['data'][0]
              },
              all_gene_variants: {
                data: response.data['info']['all_gene_variants']['data'][0]
              },
              gene_list: { 
                data: response.data['info']['gene_list']['data'][0]
              },
              inputs: response.data['info']['inputs'],
              messages: response.data['info']['messages'],
              locus_quantification: {
                data: response.data['locus_quantification']['data'][0],
              },
              locus_quantification_heatmap: {
                data: response.data['locus_quantification_heatmap']['data'][0]
              },
              locus_alignment: {
                data: pdata,
                layout: locus_alignment_plot_layout,
                top: response.data['locus_alignment']['top'][0][0],
              },
              locus_alignment_gwas_scatter: {
                data: response.data['locus_alignment_gwas_scatter']['data'][0],
                title: response.data['locus_alignment_gwas_scatter']['title'][0]
              },
              locus_colocalization_correlation: {
                data: response.data['locus_colocalization_correlation']['data'][0]
              },
              gwas: {
                data: response.data['gwas']['data'][0]
              }
            })
        );
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true }));
          dispatch(updateQTLsGWAS({ isError: true, activeResultsTab: 'locus-alignment' }));
        }
      })
      .then(function () {
        dispatch(updateQTLsGWAS({ isLoading: false }));
      });
  };
}
