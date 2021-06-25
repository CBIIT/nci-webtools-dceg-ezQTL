export const UPDATE_KEY = 'UPDATE_KEY';
export const UPDATE_QTLS_GWAS = 'UPDATE_QTLS_GWAS';
export const UPDATE_MULTI_LOCI = 'UPDATE_MULTI_LOCI';
export const UPDATE_ERROR = 'UPDATE_ERROR';
export const UPDATE_SUCCESS = 'UPDATE_SUCCESS';
export const UPDATE_ALERT = 'UPDATE_ALERT';
export const UPDATE_PUBLICATIONS = 'UPDATE_PUBLICATIONS';

const axios = require('axios');
const FormData = require('form-data');

export function updateKey(key, data) {
  return { type: UPDATE_KEY, key, data };
}

export function updateQTLsGWAS(data) {
  return { type: UPDATE_QTLS_GWAS, data };
}

export function updateMultiLoci(data) {
  return { type: UPDATE_MULTI_LOCI, data };
}

export function updateError(data) {
  return { type: UPDATE_ERROR, data };
}

export function updateSuccess(data) {
  return { type: UPDATE_SUCCESS, data };
}

export function updateAlert(data) {
  return { type: UPDATE_ALERT, data };
}

export function updatePublications(data) {
  return { type: UPDATE_PUBLICATIONS, data };
}

const getPopoverData = (geneData) => {
  let dataR2 = [];
  for (let i = 0; i < geneData.length; i++) {
    if ('R2' in geneData[i] && geneData[i]['R2'] !== 'NA') {
      dataR2.push(geneData[i]);
    }
  }
  return dataR2;
};

const getPopoverDataR2NA = (geneData) => {
  let dataR2NA = [];
  for (let i = 0; i < geneData.length; i++) {
    if (!('R2' in geneData[i]) || geneData[i]['R2'] === 'NA') {
      dataR2NA.push(geneData[i]);
    }
  }
  return dataR2NA;
};

const getPopoverDataGWAS = (geneData) => {
  let dataGWASR2 = [];
  for (let i = 0; i < geneData.length; i++) {
    if ('R2' in geneData[i] && geneData[i]['R2'] !== 'NA') {
      dataGWASR2.push(geneData[i]);
    }
  }
  return dataGWASR2;
};

const getPopoverDataGWASR2NA = (geneData) => {
  let dataGWASR2NA = [];
  for (let i = 0; i < geneData.length; i++) {
    if (!('R2' in geneData[i]) || geneData[i]['R2'] === 'NA') {
      dataGWASR2NA.push(geneData[i]);
    }
  }
  return dataGWASR2NA;
};

const getXData = (geneData) => {
  let xData = [];
  for (let i = 0; i < geneData.length; i++) {
    xData.push(geneData[i]['pos'] / 1000000.0);
  }
  return xData;
};

const getYData = (geneData) => {
  let yData = [];
  for (let i = 0; i < geneData.length; i++) {
    yData.push(Math.log10(geneData[i]['pval_nominal']) * -1.0);
  }
  return yData;
};

const getHoverData = (geneData) => {
  let hoverData = [];
  for (let i = 0; i < geneData.length; i++) {
    if ('rsnum' in geneData[i]) {
      hoverData.push(
        'chr' +
          geneData[i]['chr'] +
          ':' +
          geneData[i]['pos'] +
          '<br>' +
          geneData[i]['rsnum'] +
          '<br>' +
          'Ref/Alt: ' +
          geneData[i]['ref'] +
          '/' +
          geneData[i]['alt'] +
          '<br>' +
          '<i>P</i>-value: ' +
          geneData[i]['pval_nominal'] +
          '<br>' +
          'Slope: ' +
          geneData[i]['slope'] +
          '<br>' +
          'R2: ' +
          (geneData[i]['R2'] ? geneData[i]['R2'] : 'NA').toString()
      );
    } else {
      hoverData.push(
        'chr' +
          geneData[i]['chr'] +
          ':' +
          geneData[i]['pos'] +
          '<br>' +
          'Ref/Alt: ' +
          geneData[i]['ref'] +
          '/' +
          geneData[i]['alt'] +
          '<br>' +
          '<i>P</i>-value: ' +
          geneData[i]['pval_nominal'] +
          '<br>' +
          'Slope: ' +
          geneData[i]['slope'] +
          '<br>' +
          'R2: ' +
          (geneData[i]['R2'] ? geneData[i]['R2'] : 'NA').toString()
      );
    }
  }
  return hoverData;
};

const getHoverDataGWAS = (geneGWASData) => {
  let hoverData = [];
  for (let i = 0; i < geneGWASData.length; i++) {
    if ('rsnum' in geneGWASData[i]) {
      hoverData.push(
        'chr' +
          geneGWASData[i]['chr'] +
          ':' +
          geneGWASData[i]['pos'] +
          '<br>' +
          geneGWASData[i]['rsnum'] +
          '<br>' +
          'Ref/Alt: ' +
          geneGWASData[i]['ref'] +
          '/' +
          geneGWASData[i]['alt'] +
          '<br>' +
          '<i>P</i>-value: ' +
          geneGWASData[i]['pvalue'] +
          '<br>' +
          'Slope: ' +
          geneGWASData[i]['slope'] +
          '<br>' +
          'R2: ' +
          (geneGWASData[i]['R2'] ? geneGWASData[i]['R2'] : 'NA').toString()
      );
    } else {
      hoverData.push(
        'chr' +
          geneGWASData[i]['chr'] +
          ':' +
          geneGWASData[i]['pos'] +
          '<br>' +
          'Ref/Alt: ' +
          geneGWASData[i]['ref'] +
          '/' +
          geneGWASData[i]['alt'] +
          '<br>' +
          '<i>P</i>-value: ' +
          geneGWASData[i]['pvalue'] +
          '<br>' +
          'Slope: ' +
          geneGWASData[i]['slope'] +
          '<br>' +
          'R2: ' +
          (geneGWASData[i]['R2'] ? geneGWASData[i]['R2'] : 'NA').toString()
      );
    }
  }
  return hoverData;
};

const getHoverDataRC = (geneDataRC) => {
  let hoverDataRC = [];
  for (let i = 0; i < geneDataRC.length; i++) {
    hoverDataRC.push(
      'chr' +
        geneDataRC[i]['chr'] +
        ':' +
        geneDataRC[i]['pos'] +
        '<br>' +
        'Rate: ' +
        geneDataRC[i]['rate']
    );
  }
  return hoverDataRC;
};

const getYGWASData = (geneData) => {
  let yData = [];
  for (let i = 0; i < geneData.length; i++) {
    yData.push(Math.log10(geneData[i]['pvalue']) * -1.0);
  }
  return yData;
};

const getYLDRefGWAS = (xData, yGWASData, locusAlignmentDataQTopAnnot) => {
  let LDRefPos = locusAlignmentDataQTopAnnot['pos'] / 1000000.0;
  let pointIndex = xData.indexOf(LDRefPos);
  let yLDRef = yGWASData[pointIndex];
  return yLDRef;
};

const getColorData = (geneData) => {
  let colorData = [];
  for (let i = 0; i < geneData.length; i++) {
    colorData.push(geneData[i]['R2']);
  }
  // normalize R2 color data between 0 and 1 for color spectrum
  for (let i = 0; i < colorData.length; i++) {
    colorData[i] =
      colorData[i] / (Math.max.apply(null, colorData) / 100) / 100.0;
  }
  return colorData;
};

const getXDataRC = (geneDataRC) => {
  let xData = [];
  for (let i = 0; i < geneDataRC.length; i++) {
    xData.push(geneDataRC[i]['pos'] / 1000000.0);
  }
  return xData;
};

const getYDataRC = (geneDataRC) => {
  let yData = [];
  for (let i = 0; i < geneDataRC.length; i++) {
    yData.push(geneDataRC[i]['rate']);
  }
  return yData;
};

const getMaxFinite = (data) => {
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; 0 < data.length; i++) {
    if (isFinite(data[i])) {
      if (data[i] > max) {
        max = data[i];
      }
    }
  }
  return max;
};

const removeInfinities = (arr) => {
  let finites = [];
  for (let i = 0; i < arr.length; i++) {
    if (isFinite(arr[i])) {
      finites.push(arr[i]);
    } else {
    }
  }
  return finites;
};

const drawLocusAlignment = (response) => {
  const geneDataR2 = getPopoverData(
    response.data['locus_alignment']['data'][0]
  );
  const geneDataR2NA = getPopoverDataR2NA(
    response.data['locus_alignment']['data'][0]
  );

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
  const xLDRef =
    response.data['locus_alignment']['top'][0][0]['pos'] / 1000000.0;
  const yLDRef =
    Math.log10(response.data['locus_alignment']['top'][0][0]['pval_nominal']) *
    -1.0;
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
      symbol: 'diamond',
      size: 15,
      opacity: 1.0,
      color: '#ff66cc',
      line: {
        color: '#ff66cc',
        width: 2,
      },
    },
    yaxis: 'y2',
  };
  // highlight top point
  const LDRefHighlight = {
    x: [response.data['locus_alignment']['top'][0][0]['pos'] / 1000000.0],
    y: [
      Math.log10(
        response.data['locus_alignment']['top'][0][0]['pval_nominal']
      ) * -1.0,
    ],
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      opacity: 1.0,
      size: 15,
      color: 'red',
    },
    yaxis: 'y2',
  };

  // graph scatter where R2 != NA
  const trace1 = {
    x: xData,
    y: yData,
    customdata: geneDataR2,
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
        width: 1,
      },
    },
    yaxis: 'y2',
  };
  // graph scatter where R2 == NA
  const trace1R2NA = {
    x: xDataR2NA,
    y: yDataR2NA,
    customdata: geneDataR2NA,
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
        width: 1,
      },
    },
    yaxis: 'y2',
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
      width: 1,
    },
  };
  // graph gene density where R2 != NA
  const trace3 = {
    x: xData,
    y: Array(xData.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: 'line-ns-open',
      size: 16,
      color: colorData,
      colorscale: 'Viridis',
      reversescale: true,
    },
    yaxis: 'y',
  };
  // graph gene density where R2 == NA
  const trace3R2NA = {
    x: xDataR2NA,
    y: Array(xDataR2NA.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: 'line-ns-open',
      size: 16,
      color: '#cccccc',
    },
    yaxis: 'y',
  };
  const pdata = [
    topPvalMarker,
    LDRefHighlight,
    trace1,
    trace1R2NA,
    trace2,
    trace3,
    trace3R2NA,
  ];

  const locus_alignment_plot_layout = {
    title: {
      text:
        `${
          response.data.info.inputs.association_file[0] != 'false'
            ? 'QTLs'
            : 'GWAS'
        } Chromosome ` +
        response.data['locus_alignment']['top'][0][0]['chr'] +
        ' Variants',
      xref: 'paper',
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
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    yaxis2: {
      autorange: true,
      automargin: true,
      // overlaying: 'y3',
      title: `${
        response.data.info.inputs.association_file[0] != 'false' ? 'QTLs' : ''
      } -log10(<i>P</i>-value), 
        ${response.data['locus_alignment']['top'][0][0]['gene_symbol']}`,
      domain: [0.05, 1],
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
      overlaying: 'y2',
      title: `${
        response.data.info.inputs.association_file[0] != 'false' ? 'QTLs' : ''
      } Recombination Rate (cM/Mb)`,
      titlefont: {
        color: 'blue',
      },
      tickfont: {
        color: 'blue',
      },
      side: 'right',
      showgrid: false,
      zeroline: false,
      linecolor: 'black',
      linewidth: 1,
    },
    xaxis: {
      autorange: true,
      title:
        'Chromosome ' +
        response.data['locus_alignment']['top'][0][0]['chr'] +
        ' (Mb)',
      // dtick: 0.1,
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
        y: 1.02,
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
    locus_alignment_plot_layout,
  };
};

const drawLocusAlignmentGWAS = (response) => {
  const geneDataR2 = getPopoverData(
    response.data['locus_alignment']['data'][0]
  );
  const geneDataR2NA = getPopoverDataR2NA(
    response.data['locus_alignment']['data'][0]
  );
  const geneGWASDataR2 = getPopoverDataGWAS(response.data['gwas']['data'][0]);
  const geneGWASDataR2NA = getPopoverDataGWASR2NA(
    response.data['gwas']['data'][0]
  );

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
  const xLDRef =
    response.data['locus_alignment']['top'][0][0]['pos'] / 1000000.0;
  const yLDRef =
    Math.log10(response.data['locus_alignment']['top'][0][0]['pval_nominal']) *
    -1.0;
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
      symbol: 'diamond',
      size: 15,
      opacity: 1.0,
      color: '#ff66cc',
      line: {
        color: '#ff66cc',
        width: 2,
      },
    },
    yaxis: 'y3',
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
      color: 'red',
    },
    yaxis: 'y3',
  };
  // highlight top point GWAS
  const LDRefHighlightGWAS = {
    x: [xLDRef],
    y: [
      getYLDRefGWAS(
        xData,
        yGWASData,
        response.data['locus_alignment']['top'][0][0]
      ),
    ],
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 15,
      color: 'red',
    },
    yaxis: 'y2',
  };
  // graph GWAS scatter where R2 != NA
  const trace1 = {
    x: xData,
    y: yGWASData,
    customdata: geneGWASDataR2,
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
        width: 1,
      },
    },
    yaxis: 'y2',
  };
  // graph GWAS scatter where R2 == NA
  const trace1R2NA = {
    x: xDataR2NA,
    y: yGWASDataR2NA,
    customdata: geneGWASDataR2NA,
    text: hoverDataGWASR2NA,
    hoverinfo: 'text',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 7,
      color: '#cccccc',
      line: {
        color: 'black',
        width: 1,
      },
    },
    yaxis: 'y2',
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
      width: 1,
    },
  };
  // graph scatter where R2 != NA
  const trace3 = {
    x: xData,
    y: yData,
    customdata: geneDataR2,
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
        width: 1,
      },
    },
    yaxis: 'y3',
  };
  // graph scatter where R2 == NA
  const trace3R2NA = {
    x: xDataR2NA,
    y: yDataR2NA,
    customdata: geneDataR2NA,
    text: hoverDataR2NA,
    hoverinfo: 'text',
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 7,
      color: '#cccccc',
      line: {
        color: 'black',
        width: 1,
      },
    },
    yaxis: 'y3',
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
      width: 1,
    },
  };
  // graph gene density where R2 != NA
  const trace5 = {
    x: xData,
    y: Array(xData.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: 'line-ns-open',
      size: 16,
      color: colorData,
      colorscale: 'Viridis',
      reversescale: true,
    },
    yaxis: 'y',
  };
  // graph gene density where R2 == NA
  const trace5R2NA = {
    x: xDataR2NA,
    y: Array(xDataR2NA.length).fill(0),
    hoverinfo: 'none',
    mode: 'markers',
    type: 'scatter',
    marker: {
      symbol: 'line-ns-open',
      size: 16,
      color: '#cccccc',
    },
    yaxis: 'y',
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
    trace5R2NA,
  ];

  const locus_alignment_plot_layout = {
    title: {
      text:
        'QTLs-GWAS Chromosome ' +
        response.data['locus_alignment']['top'][0][0]['chr'] +
        ' Variants',
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
      title:
        'QTLs -log10(<i>P</i>-value), ' +
        response.data['locus_alignment']['top'][0][0]['gene_symbol'],
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
      title:
        'Chromosome ' +
        response.data['locus_alignment']['top'][0][0]['chr'] +
        ' (Mb)',
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
    locus_alignment_plot_layout,
  };
};

const getScatterX = (scatterData, threshold) => {
  var p_values = [];
  for (var i = 0; i < scatterData.length; i++) {
    if ('R2' in scatterData[i] && scatterData[i]['R2'] !== 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        p_values.push(Math.log10(scatterData[i]['pvalue']) * -1.0);
      }
    }
  }
  return p_values;
};

const getScatterXR2NA = (scatterData, threshold) => {
  var p_values = [];
  for (var i = 0; i < scatterData.length; i++) {
    if (!('R2' in scatterData[i]) || scatterData[i]['R2'] === 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        p_values.push(Math.log10(scatterData[i]['pvalue']) * -1.0);
      }
    }
  }
  return p_values;
};

const getScatterY = (scatterData, threshold) => {
  var pval_nominals = [];
  for (var i = 0; i < scatterData.length; i++) {
    if ('R2' in scatterData[i] && scatterData[i]['R2'] !== 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        pval_nominals.push(Math.log10(scatterData[i]['pval_nominal']) * -1.0);
      }
    }
  }
  return pval_nominals;
};

const getScatterYR2NA = (scatterData, threshold) => {
  var pval_nominals = [];
  for (var i = 0; i < scatterData.length; i++) {
    if (!('R2' in scatterData[i]) || scatterData[i]['R2'] === 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        pval_nominals.push(Math.log10(scatterData[i]['pval_nominal']) * -1.0);
      }
    }
  }
  return pval_nominals;
};

const getScatterColorData = (scatterData, threshold) => {
  var colorData = [];
  for (var i = 0; i < scatterData.length; i++) {
    if ('R2' in scatterData[i] && scatterData[i]['R2'] !== 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        colorData.push(scatterData[i]['R2']);
      }
    }
  }
  // normalize R2 color data between 0 and 1 for color spectrum
  for (var i = 0; i < colorData.length; i++) {
    colorData[i] =
      colorData[i] / (Math.max.apply(null, colorData) / 100) / 100.0;
  }
  return colorData;
};

const getScatterHoverData = (scatterData, threshold) => {
  var hoverData = [];
  for (var i = 0; i < scatterData.length; i++) {
    if ('R2' in scatterData[i] && scatterData[i]['R2'] !== 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        if ('rs' in scatterData[i]) {
          hoverData.push(
            'chr' +
              scatterData[i]['chr'] +
              ':' +
              scatterData[i]['pos'] +
              '<br>' +
              scatterData[i]['rs'] +
              '<br>' +
              '<i>P</i>-value: ' +
              scatterData[i]['pval_nominal'] +
              '<br>' +
              'R2: ' +
              (scatterData[i]['R2'] ? scatterData[i]['R2'] : 'NA').toString()
          );
        } else {
          hoverData.push(
            'chr' +
              scatterData[i]['chr'] +
              ':' +
              scatterData[i]['pos'] +
              '<br>' +
              '<i>P</i>-value: ' +
              scatterData[i]['pval_nominal'] +
              '<br>' +
              'R2: ' +
              (scatterData[i]['R2'] ? scatterData[i]['R2'] : 'NA').toString()
          );
        }
      }
    }
  }
  return hoverData;
};

const getScatterHoverDataR2NA = (scatterData, threshold) => {
  var hoverData = [];
  for (var i = 0; i < scatterData.length; i++) {
    if (!('R2' in scatterData[i]) || scatterData[i]['R2'] === 'NA') {
      if (
        scatterData[i]['pvalue'] <= parseFloat(threshold) &&
        scatterData[i]['pval_nominal'] <= parseFloat(threshold)
      ) {
        if ('rs' in scatterData[i]) {
          hoverData.push(
            'chr' +
              scatterData[i]['chr'] +
              ':' +
              scatterData[i]['pos'] +
              '<br>' +
              scatterData[i]['rs'] +
              '<br>' +
              '<i>P</i>-value: ' +
              scatterData[i]['pval_nominal'] +
              '<br>' +
              'R2: ' +
              (scatterData[i]['R2'] ? scatterData[i]['R2'] : 'NA').toString()
          );
        } else {
          hoverData.push(
            'chr' +
              scatterData[i]['chr'] +
              ':' +
              scatterData[i]['pos'] +
              '<br>' +
              '<i>P</i>-value: ' +
              scatterData[i]['pval_nominal'] +
              '<br>' +
              'R2: ' +
              (scatterData[i]['R2'] ? scatterData[i]['R2'] : 'NA').toString()
          );
        }
      }
    }
  }
  return hoverData;
};

const getLeastSquaresLine = (valuesXRaw, valuesYRaw) => {
  if (
    valuesXRaw.length === 0 ||
    valuesYRaw.length === 0 ||
    valuesXRaw.length !== valuesYRaw.length
  ) {
    return [[], []];
  }
  var valuesXY = valuesXRaw.map(function (e, i) {
    return [e, valuesYRaw[i]];
  });
  var valuesXYRemoveInfinities = [];
  valuesXY.map(function (e) {
    if (isFinite(e[0]) && isFinite(e[1])) {
      valuesXYRemoveInfinities.push(e);
    }
  });
  var valuesX = valuesXYRemoveInfinities.map(function (e) {
    return e[0];
  });
  var valuesY = valuesXYRemoveInfinities.map(function (e) {
    return e[1];
  });
  var sumX = 0;
  var sumY = 0;
  var sumXY = 0;
  var sumXX = 0;
  var count = 0;
  var x = 0;
  var y = 0;
  for (var i = 0; i < valuesX.length; i++) {
    x = valuesX[i];
    y = valuesY[i];
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
    count++;
  }
  var m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
  var b = sumY / count - (m * sumX) / count;
  var resultX = [];
  var resultY = [];
  for (var j = 0; j < valuesX.length; j++) {
    x = valuesX[j];
    y = x * m + b;
    resultX.push(x);
    resultY.push(y);
  }
  return [resultX, resultY];
};

const getSum = (arr) => {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    if (isFinite(arr[i])) {
      sum += arr[i];
    } else {
      // console.log("NOT FINITE", arr[i]);
    }
  }
  return sum;
};

const getSumDiffAbsSquared = (arr1, arr2) => {
  var d = [];
  for (var i = 0; i < arr1.length; i++) {
    d.push(Math.pow(Math.abs(arr1[i] - arr2[i]), 2));
  }
  var sum = getSum(d);
  return sum;
};

const multiplyArrays = (x, y) => {
  var xy = [];
  for (var i = 0; i < x.length; i++) {
    xy.push(x[i] * y[i]);
  }
  return xy;
};

const recalculateSpearmanCorrelationTitle = (xData, yData) => {
  if (xData.length > 0 && yData.length > 0) {
    var sortedX = xData.slice().sort(function (a, b) {
      return b - a;
    });
    var xRank = xData.slice().map(function (p) {
      return sortedX.indexOf(p) + 1;
    });
    var sortedY = yData.slice().sort(function (a, b) {
      return b - a;
    });
    var yRank = yData.slice().map(function (p) {
      return sortedY.indexOf(p) + 1;
    });
    var sumSquaredDiffRanks = getSumDiffAbsSquared(xRank, yRank);
    var numer = 6.0 * sumSquaredDiffRanks;
    var denom = xData.length * (Math.pow(xData.length, 2) - 1);
    var rho = 1 - numer / denom;
    return 'Spearman rho=' + rho.toFixed(3);
  } else {
    return 'Spearman rho=NA';
  }
};

const recalculatePearsonCorrelationTitle = (xData, yData) => {
  if (xData.length > 0 && yData.length > 0) {
    var xDataFinites = removeInfinities(xData);
    var yDataFinites = removeInfinities(yData);
    var xMean =
      xDataFinites.reduce(function (a, b) {
        return a + b;
      }) / xDataFinites.length;
    var yMean =
      yDataFinites.reduce(function (a, b) {
        return a + b;
      }) / yDataFinites.length;
    var xDataMinusMean = xData.map(function (i) {
      return i - xMean;
    });
    var yDataMinusMean = yData.map(function (i) {
      return i - yMean;
    });
    var xy = multiplyArrays(xDataMinusMean, yDataMinusMean);
    var xDataMinusMeanSquared = xDataMinusMean.map(function (i) {
      return Math.pow(i, 2);
    });
    var yDataMinusMeanSquared = yDataMinusMean.map(function (i) {
      return Math.pow(i, 2);
    });
    var numer = getSum(xy);
    var xSumDataMinusMeanSquared = getSum(xDataMinusMeanSquared);
    var ySumDataMinusMeanSquared = getSum(yDataMinusMeanSquared);
    var denom = Math.sqrt(xSumDataMinusMeanSquared * ySumDataMinusMeanSquared);
    var r = numer / denom;
    return "Pearson's r=" + r.toFixed(3);
  } else {
    return "Pearson's r=NA";
  }
};

export const drawLocusAlignmentScatter = (
  pdata_scatter_raw,
  pdata_scatter_title,
  gene_symbol,
  threshold
) => {
  return async function (dispatch, getState) {
    const xData = getScatterX(pdata_scatter_raw, threshold);
    const yData = getScatterY(pdata_scatter_raw, threshold);
    const xDataR2NA = getScatterXR2NA(pdata_scatter_raw, threshold);
    const yDataR2NA = getScatterYR2NA(pdata_scatter_raw, threshold);
    const scatterColorData = getScatterColorData(pdata_scatter_raw, threshold);
    const hoverData = getScatterHoverData(pdata_scatter_raw, threshold);
    const hoverDataR2NA = getScatterHoverDataR2NA(pdata_scatter_raw, threshold);

    const trace1 = {
      x: xData,
      y: yData,
      text: hoverData,
      hoverinfo: 'text',
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 7,
        color: scatterColorData,
        colorscale: 'Viridis',
        reversescale: true,
        line: {
          color: 'black',
          width: 1,
        },
      },
    };

    const trace1R2NA = {
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
          width: 1,
        },
      },
    };

    const least_sqaures = getLeastSquaresLine(xData, yData);

    const trace2 = {
      x: least_sqaures[0],
      y: least_sqaures[1],
      // hoverinfo: 'x+y',
      mode: 'lines',
      type: 'scatter',
      name: 'lines',
      line: {
        color: 'blue',
      },
    };

    const pdata_scatter = [trace1, trace1R2NA, trace2];

    // var pdata = [trace1];
    const locus_alignment_scatter_plot_layout = {
      title: {
        // text: "QTL-GWAS <i>P</i>-value Correlation: " + ((scatterTitle == "RECALCULATE") ? this.recalculateSpearmanCorrelationTitle(xData, yData) + ", " + this.recalculatePearsonCorrelationTitle(xData, yData) : "Spearman " + scatterTitle.split(', ')[0] + ", Pearson's " + scatterTitle.split(', ')[1]),
        text:
          'QTL-GWAS <i>P</i>-value Correlation: ' +
          (pdata_scatter_title
            ? 'Spearman ' + pdata_scatter_title.split(', ')[0]
            : recalculateSpearmanCorrelationTitle(xData, yData)) +
          ', ' +
          (pdata_scatter_title
            ? "Pearson's " + pdata_scatter_title.split(', ')[1]
            : recalculatePearsonCorrelationTitle(xData, yData)),
        xref: 'paper',
      },
      font: {
        color: 'black',
      },
      width: 700,
      height: 700,
      yaxis: {
        autorange: true,
        automargin: true,
        title: '-log10(QTL <i>P</i>-value), ' + gene_symbol,
        font: {
          color: 'black',
        },
        tickfont: {
          color: 'black',
        },
      },
      xaxis: {
        autorange: true,
        automargin: true,
        title: '-log10(GWAS <i>P</i>-value)',
        font: {
          color: 'black',
        },
        tickfont: {
          color: 'black',
        },
      },
      // margin: {
      //   l: 40,
      //   r: 40,
      //   b: 40,
      //   t: 40
      // },
      showlegend: false,
      clickmode: 'none',
      hovermode: 'closest',
    };

    dispatch(
      updateQTLsGWAS({
        locus_alignment_gwas_scatter: {
          raw: pdata_scatter_raw,
          data: pdata_scatter,
          layout: locus_alignment_scatter_plot_layout,
        },
      })
    );
  };
};

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
        'Content-Type': 'multipart/form-data',
      },
    };
    dispatch(updateQTLsGWAS({ isLoading: true }));

    try {
      const res = await axios.post('api/file-upload', form, config);
      if (res.data.files && res.data.files.length > 0) {
        dispatch(
          updateQTLsGWAS({
            associationFile:
              res.data.body.associationFileName !== 'false'
                ? res.data.files.filter(
                    (item) =>
                      item.filename === res.data.body.associationFileName
                  )[0].filename
                : false,
            quantificationFile:
              res.data.body.quantificationFileName !== 'false'
                ? res.data.files.filter(
                    (item) =>
                      item.filename === res.data.body.quantificationFileName
                  )[0].filename
                : false,
            genotypeFile:
              res.data.body.genotypeFileName !== 'false'
                ? res.data.files.filter(
                    (item) => item.filename === res.data.body.genotypeFileName
                  )[0].filename
                : false,
            gwasFile:
              res.data.body.gwasFileName !== 'false'
                ? res.data.files.filter(
                    (item) => item.filename === res.data.body.gwasFileName
                  )[0].filename
                : false,
            LDFile:
              res.data.body.LDFileName !== 'false'
                ? res.data.files.filter(
                    (item) => item.filename === res.data.body.LDFileName
                  )[0].filename
                : false,
          })
        );
      }
      dispatch(updateQTLsGWAS({ isLoading: false }));
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(updateError({ visible: true }));
        dispatch(
          updateQTLsGWAS({
            isError: true,
            isLoading: false,
            activeResultsTab: 'locus-qc',
          })
        );
      }
    }
  };
}

function qtlsGWASHyprcolocCalculation(params) {
  return async function (dispatch, getState) {
    dispatch(
      updateQTLsGWAS({
        isLoadingHyprcoloc: true,
      })
    );

    axios
      .post('api/qtls-locus-colocalization-hyprcoloc', params)
      .then(function (response) {
        // console.log(
        //   'api/qtls-locus-colocalization-hyprcoloc response.data',
        //   response.data
        // );

        if (response.data.error) {
          dispatch(
            updateAlert({
              show: true,
              message: response.data.error,
            })
          );

          dispatch(updateQTLsGWAS({ hyprcolocError: response.data.error }));
        } else {
          dispatch(
            updateQTLsGWAS({
              hyprcoloc_table: {
                data: response.data['hyprcoloc']['result_hyprcoloc']['data'][0],
                globalFilter: '',
              },
              hyprcolocSNPScore_table: {
                data: response.data['hyprcoloc']['result_snpscore']['data'][0],
                globalFilter: '',
              },
            })
          );
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true }));
          dispatch(
            updateQTLsGWAS({
              // isError: true,
              // activeResultsTab: 'locus-qc',
              isLoadingHyprcoloc: false,
            })
          );
        }
      })
      .then(function () {
        dispatch(updateQTLsGWAS({ isLoadingHyprcoloc: false }));
      });
  };
}

export function qtlsGWASECaviarCalculation(params) {
  return async function (dispatch, getState) {
    // console.log('ecaviar', params);
    dispatch(
      updateQTLsGWAS({
        isLoadingECaviar: true,
      })
    );

    axios
      .post('api/qtls-locus-colocalization-ecaviar', params)
      .then(function (response) {
        // console.log(
        //   'api/qtls-locus-colocalization-ecaviar response.data',
        //   response.data
        // );

        dispatch(
          updateQTLsGWAS({
            ecaviar_table: {
              data: response.data['ecaviar']['data'][0],
              globalFilter: '',
            },
          })
        );
      })
      .catch(function (error) {
        console.log(error);

        if (error.response.status === 504) {
          dispatch(
            updateError({
              visible: true,
              message:
                'eCAVIAR calculation has timed out. Try submitting this job to the queue instead.',
            })
          );
          dispatch(updateQTLsGWAS({ isLoadingECaviar: false }));
        } else {
          dispatch(updateError({ visible: true, message: error }));
          dispatch(updateQTLsGWAS({ isLoadingECaviar: false }));
        }
      })
      .then(function () {
        dispatch(updateQTLsGWAS({ isLoadingECaviar: false }));
      });
  };
}

export function qtlsGWASCalculateQuantification(params) {
  return async function (dispatch, getState) {
    // console.log('quantification', params);
    dispatch(updateQTLsGWAS({ isLoadingQuantification: true }));

    axios
      .post('api/qtls-recalculate-quantification', params)
      .then(async function (response) {
        dispatch(updateQTLsGWAS({ isLoadingQuantification: false }));
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true, message: error }));
          dispatch(
            updateQTLsGWAS({
              isLoadingQuantification: false,
            })
          );
        }
      })
      .then(function () {
        dispatch(updateQTLsGWAS({ isLoadingQuantification: false }));
      });
  };
}

export function qtlsGWASLocusQCCalculation(params) {
  return async function (dispatch, getState) {
    // console.log('locus qc', params);
    dispatch(
      updateQTLsGWAS({
        submitted: true,
        isLoading: true,
        isLoadingQC: true,
      })
    );

    axios
      .post('api/qtls-locus-qc', params)
      .then(async function (response) {
        // console.log('api/qtls-locus-qc response.data', response);

        if (response.data.error) {
          dispatch(
            updateQTLsGWAS({
              qcError:
                response.data.error || 'Error occurred in QC calculation',
              isLoading: false,
              isLoadingQC: false,
              isError: true,
              // activeResultsTab: 'locus-qc',
            })
          );
        } else {
          await dispatch(
            updateQTLsGWAS({ locus_qc: response.data, isLoadingQC: false })
          );

          const qtlsGWAS = getState().qtlsGWAS;

          if (
            qtlsGWAS.associationFile ||
            qtlsGWAS.qtlKey ||
            qtlsGWAS.select_qtls_samples
          ) {
            params.associationFile = 'ezQTL_input_qtl.txt';
          }

          if (
            qtlsGWAS.LDFile ||
            qtlsGWAS.ldPublic ||
            qtlsGWAS.select_qtls_samples
          ) {
            params.LDFile = 'ezQTL_input_ld.gz';
          }

          if (
            qtlsGWAS.gwasFile ||
            qtlsGWAS.gwasKey ||
            qtlsGWAS.select_gwas_sample
          ) {
            params.gwasFile = 'ezQTL_input_gwas.txt';
          }

          params.recalculate = false;

          if (params.associationFile || params.gwasFile) {
            await dispatch(qtlsGWASCalculation(params));
          } else if (params.LDFile) {
            await dispatch(
              updateQTLsGWAS({ isLoading: false, request: params.request })
            );
            await dispatch(
              qtlsGWASLocusLDCalculation({
                request: params.request,
                select_gwas_sample: qtlsGWAS.select_gwas_sample,
                select_qtls_samples: qtlsGWAS.select_qtls_samples,
                gwasFile: params.gwasFile,
                associationFile: params.associationFile,
                LDFile: params.LDFile,
                leadsnp: params.select_ref,
                position: params.select_position,
                genome_build: qtlsGWAS.genome.value,
                select_gene: qtlsGWAS.select_gene,
                ldThreshold: qtlsGWAS.ldThreshold,
                ldAssocData: qtlsGWAS.ldAssocData,
              })
            );
          }
        }
      })
      .catch(function ({ response }) {
        console.error(response);

        dispatch(updateError({ visible: true }));
        dispatch(
          updateQTLsGWAS({
            qcError: 'Error occurred in QC calculation',
            isLoading: false,
            isLoadingQC: false,
            isError: true,
            // activeResultsTab: 'locus-qc',
          })
        );
      });
  };
}

export function qtlsGWASLocusLDCalculation(params) {
  return async function (dispatch, getState) {
    // console.log('locus ld', params);
    dispatch(
      updateQTLsGWAS({
        isLoadingLD: true,
      })
    );
    axios
      .post('api/qtls-locus-ld', params)
      .then(function (response) {
        // console.log('api/qtls-locus-ld response.data', response);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true }));
          dispatch(
            updateQTLsGWAS({
              ldError: 'Error occurred in LD calculation',
              activeResultsTab: 'locus-qc',
            })
          );
        }
      })
      .then(function () {
        dispatch(updateQTLsGWAS({ isLoadingLD: false }));
      });
  };
}

export function qtlsGWASColocVisualize(params) {
  return async function (dispatch, getState) {
    // console.log('coloc visualize', params);
    dispatch(
      updateQTLsGWAS({
        isLoadingSummary: true,
      })
    );

    var ecaviarData;

    if (params.calcEcaviar) {
      // console.log('ecaviar', params);
      dispatch(
        updateQTLsGWAS({
          isLoadingECaviar: true,
        })
      );

      axios
        .post('api/qtls-locus-colocalization-ecaviar', params)
        .then(function (response) {
          // console.log(
          //   'api/qtls-locus-colocalization-ecaviar response.data',
          //   response.data
          // );

          ecaviarData = response.data['ecaviar']['data'][0];

          dispatch(
            updateQTLsGWAS({
              ecaviar_table: {
                data: response.data['ecaviar']['data'][0],
                globalFilter: '',
              },
            })
          );
        })
        .catch(function (error) {
          console.log(error);
          if (error) {
            dispatch(updateError({ visible: true }));
            dispatch(
              updateQTLsGWAS({
                // isError: true,
                // activeResultsTab: 'locus-qc',
                isLoadingECaviar: false,
              })
            );
          }
        })
        .then(function () {
          dispatch(updateQTLsGWAS({ isLoadingECaviar: false }));

          const newParams = { ...params, ecdata: ecaviarData };
          // console.log(newParams);

          axios
            .post('api/qtls-coloc-visualize', newParams)
            .then(function (response) {
              // console.log(
              //   'api/qtls-locus-visualize response.data',
              //   response.data
              // );
            })
            .catch(function (error) {
              console.log(error);
              if (error) {
                dispatch(updateError({ visible: true }));
                dispatch(
                  updateQTLsGWAS({
                    summaryError: true,
                    activeResultsTab: 'locus-qc',
                  })
                );
              }
            })
            .then(function () {
              dispatch(
                updateQTLsGWAS({ isLoadingSummary: false, summaryLoaded: true })
              );
            });
        });
    } else {
      axios
        .post('api/qtls-coloc-visualize', params)
        .then(function (response) {
          // console.log('api/qtls-coloc-visualize response.data', response.data);
        })
        .catch(function (error) {
          console.log(error);
          if (error) {
            dispatch(updateError({ visible: true }));
            dispatch(
              updateQTLsGWAS({
                // summaryError: true,
                // activeResultsTab: 'locus-qc',
                isLoadingSummary: false,
              })
            );
          }
        })
        .then(function () {
          dispatch(
            updateQTLsGWAS({ isLoadingSummary: false, summaryLoaded: true })
          );
        });
    }
  };
}

export function qtlsGWASCalculation(params) {
  return async function (dispatch, getState) {
    // const qtlsGWASState = getState();
    // console.log('qtlsGWASState', qtlsGWASState);

    dispatch(
      updateQTLsGWAS({
        submitted: true,
        isLoading: true,
      })
    );

    axios
      .post('api/qtls-calculate-main', params)
      .then(function (response) {
        // console.log('api/qtls-calculate-main response.data', response.data);

        const { pdata, locus_alignment_plot_layout } =
          Object.keys(response.data['gwas']['data'][0]).length > 0 &&
          response.data.info.inputs.association_file[0] != 'false'
            ? drawLocusAlignmentGWAS(response)
            : drawLocusAlignment(response);

        if (
          Object.keys(response.data['gwas']['data'][0]).length > 0 &&
          response.data.info.inputs.association_file[0] != 'false'
        ) {
          dispatch(
            drawLocusAlignmentScatter(
              response.data['locus_alignment_gwas_scatter']['data'][0],
              response.data['locus_alignment_gwas_scatter']['title'][0],
              response.data['locus_alignment']['top'][0][0]['gene_symbol'],
              Math.pow(10, 0.0 * -1.0)
            )
          );
        }

        dispatch(
          updateQTLsGWAS({
            request: response.data['info']['inputs']['request'][0],
            select_qtls_samples:
              response.data['info']['select_qtls_samples'][0] === 'true'
                ? true
                : false,
            select_gwas_sample:
              response.data['info']['select_gwas_sample'][0] === 'true'
                ? true
                : false,
            select_ref: response.data['locus_alignment']['top'][0][0]['rsnum'],
            recalculateAttempt:
              response.data['info']['recalculateAttempt'][0] === 'true'
                ? true
                : false,
            // recalculatePop:
            //   response.data['info']['recalculatePop'][0] === 'true'
            //     ? true
            //     : false,
            // recalculateGene:
            //   response.data['info']['recalculateGene'][0] === 'true'
            //     ? true
            //     : false,
            // recalculateDist:
            //   response.data['info']['recalculateDist'][0] === 'true'
            //     ? true
            //     : false,
            // recalculateRef:
            //   response.data['info']['recalculateRef'][0] === 'true'
            //     ? true
            //     : false,
            top_gene_variants: {
              data: response.data['info']['top_gene_variants']['data'][0],
            },
            all_gene_variants: {
              data: response.data['info']['all_gene_variants']['data'][0],
            },
            gene_list: {
              data: response.data['info']['gene_list']['data'][0],
            },
            inputs: response.data['info']['inputs'],
            messages: response.data['info']['messages'],
            locus_alignment: {
              data: pdata,
              layout: locus_alignment_plot_layout,
              top: response.data['locus_alignment']['top'][0][0],
            },
            locus_alignment_gwas_scatter_threshold: 0.0,
            locus_colocalization_correlation: {
              data:
                response.data['locus_colocalization_correlation']['data'][0],
            },
            gwas: {
              data: response.data['gwas']['data'][0],
            },
            locus_table: {
              data: response.data['locus_alignment']['data'][0],
              globalFilter: '',
              // pagination: {
              //   pageIndex: 0,
              //   pageSize: 0
              // }
            },
            recalculate: params.recalculate,
            isLoading: false,
          })
        );
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true }));
          dispatch(
            updateQTLsGWAS({
              isError: true,
              activeResultsTab: 'locus-qc',
              isLoading: false,
            })
          );
        }
      })
      .then(function () {
        // execute if no error and gwas data exists
        const qtlsGWAS = getState().qtlsGWAS;
        if (!qtlsGWAS.isError) {
          if (
            qtlsGWAS.gwas &&
            qtlsGWAS.gwas.data &&
            Object.keys(qtlsGWAS.gwas.data).length > 0 &&
            (qtlsGWAS.associationFile || qtlsGWAS.qtlKey) &&
            (qtlsGWAS.gwasFile || qtlsGWAS.gwasKey) &&
            (qtlsGWAS.LDFile || qtlsGWAS.ldKey)
          ) {
            dispatch(
              qtlsGWASHyprcolocCalculation({
                request: qtlsGWAS.request,
                select_gwas_sample: qtlsGWAS.select_gwas_sample,
                select_qtls_samples: qtlsGWAS.select_qtls_samples,
                select_dist: qtlsGWAS.inputs.select_dist[0] * 1000,
                select_ref: qtlsGWAS.locus_alignment.top.rsnum,
                gwasfile: qtlsGWAS.inputs.gwas_file[0],
                qtlfile: qtlsGWAS.inputs.association_file[0],
                ldfile: qtlsGWAS.inputs.ld_file[0],
              })
            );

            dispatch(
              qtlsGWASECaviarCalculation({
                LDFile: qtlsGWAS.inputs.ld_file[0],
                associationFile: qtlsGWAS.inputs.association_file[0],
                gwasFile: qtlsGWAS.inputs.gwas_file[0],
                request: qtlsGWAS.request,
                select_dist: qtlsGWAS.inputs.select_dist[0] * 1000,
                select_gwas_sample: qtlsGWAS.select_gwas_sample,
                select_qtls_samples: qtlsGWAS.select_qtls_samples,
                select_ref: qtlsGWAS.locus_alignment.top.rsnum,
              })
            );
          }

          if (
            (qtlsGWAS.LDFile ||
              qtlsGWAS.ldKey ||
              qtlsGWAS.select_qtls_samples) &&
            !qtlsGWAS.recalculate
          ) {
            dispatch(
              qtlsGWASLocusLDCalculation({
                request: qtlsGWAS.request,
                select_gwas_sample: qtlsGWAS.select_gwas_sample,
                select_qtls_samples: qtlsGWAS.select_qtls_samples,
                gwasFile: qtlsGWAS.inputs.gwas_file[0],
                associationFile: qtlsGWAS.inputs.association_file[0],
                LDFile: qtlsGWAS.inputs.ld_file[0],
                leadsnp: qtlsGWAS.locus_alignment.top.rsnum,
                position: qtlsGWAS.select_position,
                genome_build: qtlsGWAS.genome.value,
                select_gene: qtlsGWAS.select_gene,
                ldThreshold: qtlsGWAS.ldThreshold,
                ldAssocData: qtlsGWAS.ldAssocData,
              })
            );
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true }));
          dispatch(
            updateQTLsGWAS({ isError: true, activeResultsTab: 'locus-qc' })
          );
        }
      });
  };
}

const getBoxplotsYData = (boxplotData) => {
  let a0a0 = [];
  let a0a1 = [];
  let a1a1 = [];
  for (var i = 0; i < boxplotData.length; i++) {
    if (boxplotData[i]['Genotype'] === '0/0') {
      a0a0.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
    }
    if (boxplotData[i]['Genotype'] === '0/1') {
      a0a1.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
    }
    if (boxplotData[i]['Genotype'] === '1/1') {
      a1a1.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
    }
  }
  var yData = [a0a0, a0a1, a1a1];
  return yData;
};

const drawLocusAlignmentBoxplots = (params, response) => {
  const locus_alignment_boxplots_plot_layout = {
    font: {
      color: 'black',
    },
    width: 660,
    height: 600,
    xaxis: {
      title:
        params.info['rsnum'] +
        ' genotype: ' +
        params.info['ref'] +
        '->' +
        params.info['alt'],
      font: {
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    yaxis: {
      title: params.info['gene_symbol'] + ' Quantification (log2)',
      autorange: true,
      showgrid: true,
      zeroline: true,
      dtick: 4,
      gridwidth: 1,
      font: {
        color: 'black',
      },
      tickfont: {
        color: 'black',
      },
    },
    margin: {
      l: 40,
      r: 10,
      b: 80,
      t: 40,
    },
    showlegend: true,
    legend: { orientation: 'h' },
  };

  let pdata = [];

  const xData = ['0/0', '0/1', '1/1'];
  const yData = getBoxplotsYData(
    response.data['locus_alignment_boxplots']['data'][0]
  );

  for (var i = 0; i < xData.length; i++) {
    const result = {
      type: 'box',
      y: yData[i],
      name: xData[i],
      boxpoints: 'all',
      jitter: 0.5,
      pointpos: 0,
      whiskerwidth: 0.2,
      fillcolor: 'cls',
      marker: {
        size: 4,
      },
      line: {
        width: 1,
      },
    };
    pdata.push(result);
  }

  return {
    pdata,
    locus_alignment_boxplots_plot_layout,
  };
};

export function qtlsGWASBoxplotsCalculation(params) {
  return async function (dispatch, getState) {
    dispatch(
      updateQTLsGWAS({
        locus_alignment_boxplots: {
          isLoading: true,
          visible: true,
          data: null,
          layout: null,
        },
      })
    );

    axios
      .post('api/qtls-locus-alignment-boxplots', params)
      .then(function (response) {
        // console.log(
        //   'api/qtls-locus-alignment-boxplots response.data',
        //   response.data
        // );

        const {
          pdata,
          locus_alignment_boxplots_plot_layout,
        } = drawLocusAlignmentBoxplots(params, response);

        dispatch(
          updateQTLsGWAS({
            locus_alignment_boxplots: {
              ...getState().qtlsGWAS.locus_alignment_boxplots,
              data: pdata,
              layout: locus_alignment_boxplots_plot_layout,
            },
          })
        );
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          dispatch(updateError({ visible: true }));
          dispatch(
            updateQTLsGWAS({
              isError: true,
              activeResultsTab: 'locus-qc',
              isLoading: false,
            })
          );
        }
      })
      .then(function () {
        dispatch(
          updateQTLsGWAS({
            locus_alignment_boxplots: {
              ...getState().qtlsGWAS.locus_alignment_boxplots,
              isLoading: false,
            },
          })
        );
      });
  };
}

export function getPublicGTEx() {
  return async function (dispatch, getState) {
    try {
      dispatch(updateQTLsGWAS({ isLoading: true }));

      const { data } = await axios.post('api/getPublicGTEx');

      dispatch(updateQTLsGWAS({ publicGTEx: data, isLoading: false }));
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(updateQTLsGWAS({ isLoading: false }));
        dispatch(updateError({ visible: true }));
      }
    }
  };
}

export function submitQueue(params) {
  return async function (dispatch, getState) {
    dispatch(
      updateQTLsGWAS({
        submitted: true,
        isLoading: true,
      })
    );

    try {
      const response = await axios.post('api/queue', params);
      // console.log('api/queue', response);
      dispatch(
        updateSuccess({
          visible: true,
          message: `Your job was successfully submitted to the queue. You will recieve an email at ${params.params.email} with your results.`,
        })
      );
      dispatch(updateQTLsGWAS({ isLoading: false }));
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(
          updateError({ visible: true, message: 'Queue submission failed' })
        );
        dispatch(
          updateQTLsGWAS({
            isError: true,
            isLoading: false,
            activeResultsTab: 'locus-qc',
          })
        );
      }
    }
  };
}

export function fetchResults(request) {
  return async function (dispatch, getState) {
    dispatch(
      updateQTLsGWAS({
        isLoading: true,
        submitted: true,
      })
    );

    try {
      const { data } =
        request.request == 'sample'
          ? await axios.get('api/fetch-sample')
          : await axios.post('api/fetch-results', request);

      const { state, main } = data;
      // console.log('api/fetch-results', state);

      if (main.locus_alignment && Object.keys(main.locus_alignment).length) {
        const { pdata, locus_alignment_plot_layout } =
          state.associationFile && Object.keys(main.gwas.data[0]).length
            ? drawLocusAlignmentGWAS({ data: main })
            : drawLocusAlignment({ data: main });

        if (
          state.associationFile &&
          Object.keys(main).length &&
          Object.keys(main.gwas.data[0]).length
        ) {
          dispatch(
            drawLocusAlignmentScatter(
              main['locus_alignment_gwas_scatter']['data'][0],
              main['locus_alignment_gwas_scatter']['title'][0],
              main['locus_alignment']['top'][0][0]['gene_symbol'],
              Math.pow(10, 0.0 * -1.0)
            )
          );
        }
        await dispatch(
          updateQTLsGWAS({
            ...state,
            submitted: true,
            isLoading: false,
            locus_alignment: {
              ...state.locus_alignment,
              data: pdata,
              layout: locus_alignment_plot_layout,
            },
          })
        );
      } else {
        await dispatch(
          updateQTLsGWAS({
            ...state,
            submitted: true,
            isLoading: false,
          })
        );
      }
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(
          updateError({
            visible: true,
            message: 'Failed to retrieve queued submission. Invalid or expired results link.',
          })
        );
        dispatch(
          updateQTLsGWAS({
            isError: true,
            isLoading: false,
            activeResultsTab: 'locus-qc',
          })
        );
      }
    }
  };
}
