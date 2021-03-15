import React, { useState, useRef, useEffect } from 'react';
import { PlotlyWrapper as Plot } from '../../../plots/plotly/plotly-wrapper';

export function LocusAlignmentPlot(params) {
  const plotContainer = useRef(null);

  const chromosome = 1;
  const selectedGeneSymbol = 'TEST';

  var locus_alignment_manhattan_gwas_layout = {
    title: {
      text: 'QTLs-GWAS Chromosome ' + chromosome + ' Variants',
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
      title: 'QTLs -log10(<i>P</i>-value), ' + selectedGeneSymbol,
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
      title: 'Chromosome ' + chromosome + ' (Mb)',
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

  const locus_alignment_manhattan_gwas_config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'locus_alignment_manhattan_gwas',
      height: 1100,
      width: 1000,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    displaylogo: false,
    modeBarButtonsToRemove: [
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'lasso2d',
    ],
  };

  return (
    <>
      <div
        className="text-center my-3 position-relative mw-100"
        // style={{ width: '800px', margin: '1rem auto' }}
        ref={plotContainer}
      >
        {/* {pcaplotData && ( */}
        <Plot
          className="override-cursor-default position-relative"
          data={[]}
          layout={locus_alignment_manhattan_gwas_layout}
          config={locus_alignment_manhattan_gwas_config}
          // onClick={async data => {
          //     const [point] = data.points;
          //     if (point.customdata) {
          //         const response = await query('variants', {
          //         columns: ['chromosome', 'position', 'snp'],
          //         phenotype_id: point.customdata.phenotypeId,
          //         id: point.customdata.variantId,
          //         ancestry: point.customdata.ancestry,
          //         sex: point.customdata.sex
          //         });
          //         const record = response.data[0];
          //         const { xaxis, yaxis } = point;
          //         const xOffset = xaxis.l2p(point.x) + xaxis._offset + 5;
          //         const yOffset = yaxis.l2p(point.y) + yaxis._offset + 5;

          //         /* Use event.clientX/Y if we want to position the tooltip at the cursor (instead of point)
          //         const {clientX, clientY} = data.event;
          //         const {x, y} = viewportToLocalCoordinates(
          //         clientX,
          //         clientY,
          //         plotContainer.current
          //         ); */

          //         updateTooltip({
          //         visible: true,
          //         data: {
          //             ...point.customdata,
          //             ...record
          //         },
          //         x: xOffset,
          //         y: yOffset
          //         });
          //     }
          // }}
          // onRelayout={relayout => {
          //     updateTooltip({ visible: false });
          // }}
        />
        {/* )} */}
      </div>
    </>
  );
}
