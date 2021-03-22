import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlotlyWrapper as Plot } from '../../../plots/plotly/plotly-wrapper';
import { Tooltip } from '../../../controls/tooltip/tooltip';
import { Button } from 'react-bootstrap';

export function LocusAlignmentPlot(params) {
  const plotContainer = useRef(null);

  const {
    locus_alignment,
    locus_quantification,
    inputs,
    gwas
  } = useSelector((state) => state.qtlsGWAS);

  // use local state to reset tooltip when this component unmounts
  const [tooltip, setTooltip] = useState({
    visible: false,
    data: {}
  });

  const updateTooltip = state =>
    setTooltip({
      ...tooltip,
      ...state
  });

  useEffect(() => updateTooltip({ visible: false }), []);

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
            onClick={async data => {
              const [point] = data.points;
              const { xaxis, yaxis } = point;
              const xOffset = xaxis.l2p(point.x) + xaxis._offset + 5;
              const yOffset = yaxis.l2p(point.y) + yaxis._offset - 155;
              if (point && 
                point.text && 
                (gwas && gwas.data && Object.keys(gwas.data).length > 0 ? point.curveNumber === 3 || point.curveNumber === 6 : point.curveNumber === 2)
              ) {
                const pointText = point.text.split('<br>');
                updateTooltip({
                  visible: true,
                  data: {
                      text: pointText
                  },
                  x: xOffset,
                  y: yOffset
                });
              } else {
                updateTooltip({ visible: false });
              }
            }}
            onRelayout={relayout => {
                updateTooltip({ visible: false });
            }}
          />
      )}

      <Tooltip
        closeButton
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        onClose={e => updateTooltip({ visible: false })}
        style={{
          width: '200px',
          border: `1px solid ${tooltip.data.color}`
        }}
        className="text-left qq-plot-tooltip">
        <div>
          {/* chr:pos */}
          {tooltip.data.text && tooltip.data.text[0] && tooltip.data.text[0].length > 0 && (
            <div>
              <b>{tooltip.data.text[0]}</b>
            </div>
          )}
          {/* rsnum */}
          {tooltip.data.text && tooltip.data.text[1] && tooltip.data.text[1].length > 0 && (
            <div>
              <b>{tooltip.data.text[1]}</b>
            </div>
          )}
          {/* ref/alt */}
          {tooltip.data.text && tooltip.data.text[2] && tooltip.data.text[2].length > 0 && (
            <div>
              Ref/Alt: <b>{tooltip.data.text[2].split(": ")[1]}</b>
            </div>
          )}
          {/* p-value */}
          {tooltip.data.text && tooltip.data.text[3] && tooltip.data.text[3].length > 0 && (
            <div>
              <i>P</i>-value: <b>{tooltip.data.text[3].split(": ")[1]}</b>
            </div>
          )}
          {/* slope */}
          {tooltip.data.text && tooltip.data.text[4] && tooltip.data.text[4].length > 0 && (
            <div>
              Slope: <b>{tooltip.data.text[4].split(": ")[1]}</b>
            </div>
          )}
          {/* r2 */}
          {tooltip.data.text && tooltip.data.text[5] && tooltip.data.text[5].length > 0 && (
            <div>
              R<sup>2</sup>: <b>{tooltip.data.text[5].split(": ")[1]}</b>
            </div>
          )}
          <div className="w-100 border border-top mx-0 my-0"></div>
          {/* make ld reference action */}
          {tooltip.data.text && tooltip.data.text[1] && tooltip.data.text[1].length > 0 && (
            <div>
              <Button
                variant="link"
                onClick={(_) => {
                  // _setGwasFile('');
                  // dispatch(updateQTLsGWAS({ select_gwas_sample: true }));
                }}
                // disabled={submitted}
              >
                <b>Make LD Reference</b>
              </Button>
            </div>
          )}
          {/* ldpop link */}
          {tooltip.data.text && tooltip.data.text[1] && tooltip.data.text[1].length > 0 && (
            <div>
              <a href={"https://ldlink.nci.nih.gov/?tab=ldpop&var1=" + tooltip.data.text[1] + "&var2=" + locus_alignment['top']['rsnum'] + "&pop=" + inputs['select_pop'][0].split('+').join('%2B') + "&r2_d=r2"} 
              target="_blank" 
              rel="noreferrer">
                <b>LDpop</b>
              </a>
            </div>
          )}
          {/* potential gwas link */}
          {tooltip.data.text && tooltip.data.text[1] && tooltip.data.text[1].length > 0 && (
            <div>
              <a href={'https://www.ebi.ac.uk/gwas/search?query=' + tooltip.data.text[1]} 
              target="_blank" 
              rel="noreferrer">
                <b>Potential GWAS</b>
              </a>
            </div>
          )}
          {/* potential gnomad link */}
          {tooltip.data.text && tooltip.data.text[0] && tooltip.data.text[0].length > 0 &&  tooltip.data.text[2] && tooltip.data.text[2].length > 0 && (
            <div>
              <a href={"http://gnomad.broadinstitute.org/variant/" + tooltip.data.text[0].split(":")[0].replace(/chr/g,'') + "-" + tooltip.data.text[0].split(":")[1] + "-" + tooltip.data.text[2].split(": ")[1].split("/")[0] + "-" + tooltip.data.text[2].split(": ")[1].split("/")[1]} 
                target="_blank" 
                rel="noreferrer">
                <b>gnomAD browser</b>
              </a>
            </div>
          )}
          {/* show boxplot action */}
          {tooltip.data.text && tooltip.data.text[0] && tooltip.data.text[0].length > 0 && (
            <div>
              <Button
                variant="link"
                onClick={(_) => {
                  // _setGwasFile('');
                  // dispatch(updateQTLsGWAS({ select_gwas_sample: true }));
                }}
                disabled={!(locus_quantification && locus_quantification.data && Object.keys(locus_quantification.data).length > 0)}
              >
                <b>Show Boxplots</b>
              </Button>
            </div>
          )}
        </div>
      </Tooltip>

      </div>
    </>
  );
}
