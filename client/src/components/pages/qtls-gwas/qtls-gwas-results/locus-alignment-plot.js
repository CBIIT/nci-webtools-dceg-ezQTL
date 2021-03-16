import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlotlyWrapper as Plot } from '../../../plots/plotly/plotly-wrapper';

export function LocusAlignmentPlot(params) {
  const plotContainer = useRef(null);

  const {
    locus_alignment
  } = useSelector((state) => state.qtlsGWAS);

  const config = {
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

  const playout = {

  }

  return (
    <>
      <div
        className="text-center my-3 position-relative mw-100"
        // style={{ width: '800px', margin: '1rem auto' }}
        ref={plotContainer}
      >
        {locus_alignment.data && (
          <Plot
            className="override-cursor-default position-relative"
            data={locus_alignment.data}
            layout={locus_alignment.layout}
            config={config}
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
      )}
      </div>
    </>
  );
}
