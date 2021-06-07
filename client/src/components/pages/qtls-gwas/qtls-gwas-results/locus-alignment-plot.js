import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlotlyWrapper as Plot } from '../../../plots/plotly/plotly-wrapper';
import { Tooltip } from '../../../controls/tooltip/tooltip';
import { Button } from 'react-bootstrap';
import {
  updateQTLsGWAS,
  qtlsGWASBoxplotsCalculation,
  qtlsGWASLocusQCCalculation,
} from '../../../../services/actions';

export function LocusAlignmentPlot(params) {
  const dispatch = useDispatch();

  const plotContainer = useRef(null);

  const {
    locus_alignment,
    locus_quantification,
    inputs,
    gwas,
    request,
    select_qtls_samples,
    select_gwas_sample,
    ldProject,
    phenotype,
    qtlPublic,
    ldPublic,
    gwasPublic,
    qtlKey,
    gwasKey,
    ldKey,
    genome,
    locusInformation,
  } = useSelector((state) => state.qtlsGWAS);

  const { select_position, select_chromosome } = locusInformation[0];

  // use local state to reset tooltip when this component unmounts
  const [tooltip, setTooltip] = useState({
    visible: false,
    data: {},
  });

  const updateTooltip = (state) =>
    setTooltip({
      ...tooltip,
      ...state,
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

  async function handleSubmit(recalcRSNum) {
    const params = {
      request,
      associationFile:
        inputs['association_file'][0] === 'false'
          ? false
          : inputs['association_file'][0],
      quantificationFile:
        inputs['quantification_file'][0] === 'false'
          ? false
          : inputs['quantification_file'][0],
      genotypeFile:
        inputs['genotype_file'][0] === 'false'
          ? false
          : inputs['genotype_file'][0],
      gwasFile:
        inputs['gwas_file'][0] === 'false' ? false : inputs['gwas_file'][0],
      LDFile: inputs['ld_file'][0] === 'false' ? false : inputs['ld_file'][0],
      select_qtls_samples,
      select_gwas_sample,
      select_pop: inputs['select_pop'][0],
      select_gene: inputs['select_gene'][0],
      select_dist: inputs['select_dist'][0],
      select_ref: recalcRSNum,
      recalculateAttempt: false,
      recalculatePop: false,
      recalculateGene: false,
      recalculateDist: false,
      recalculateRef: false,
      ldProject: ldProject.value,
      gwasPhenotype: phenotype.value,
      qtlPublic,
      gwasPublic,
      ldPublic,
      qtlKey: qtlPublic ? qtlKey : false,
      ldKey: ldPublic ? ldKey : false,
      gwasKey: gwasPublic ? gwasKey : false,
      select_chromosome: select_chromosome.value || false,
      select_position,
      genome_build: genome.value,
    };

    // clear all locus colocalization results
    dispatch(
      updateQTLsGWAS({
        activeColocalizationTab: 'hyprcoloc',
        hyprcolocError: '',
        hyprcoloc_ld: null,
        hyprcoloc_table: {
          data: [],
          globalFilter: '',
        },
        hyprcolocSNPScore_table: {
          data: [],
          globalFilter: '',
        },
        isLoadingHyprcoloc: false,
        ecaviar_table: {
          data: [],
          globalFilter: '',
        },
        isLoadingECaviar: false,
      })
    );

    dispatch(qtlsGWASLocusQCCalculation(params));
  }

  return (
    <>
      <div
        className="text-center my-3 position-relative mw-100"
        ref={plotContainer}
      >
        {locus_alignment.data && (
          <Plot
            className="override-cursor-default position-relative"
            data={locus_alignment.data}
            layout={locus_alignment.layout}
            config={config}
            onClick={async (data) => {
              const [point] = data.points;
              const { xaxis, yaxis } = point;
              const xOffset = xaxis.l2p(point.x) + xaxis._offset + 5;
              const yOffset = yaxis.l2p(point.y) + yaxis._offset - 155;

              if (
                point &&
                point.customdata &&
                (gwas && gwas.data && Object.keys(gwas.data).length > 0
                  ? point.curveNumber === 2 ||
                    point.curveNumber === 3 ||
                    point.curveNumber === 6
                  : false)
              ) {
                updateTooltip({
                  visible: true,
                  data: point.customdata,
                  x: xOffset,
                  y: yOffset,
                });
              } else {
                updateTooltip({ visible: false });
              }
            }}
            onRelayout={(relayout) => {
              updateTooltip({ visible: false });
            }}
          />
        )}

        <Tooltip
          closeButton
          visible={tooltip.visible}
          x={tooltip.x}
          y={tooltip.y}
          onClose={(e) => updateTooltip({ visible: false })}
          style={{
            width: '200px',
            border: `1px solid ${tooltip.data.color}`,
          }}
          className="text-left qq-plot-tooltip"
        >
          <div>
            {/* chr:pos */}
            {tooltip.data.chr && tooltip.data.pos && (
              <div>
                <b>
                  chr{tooltip.data.chr}:{tooltip.data.pos}
                </b>
              </div>
            )}
            {/* rsnum */}
            {tooltip.data.rsnum && (
              <div>
                <b>{tooltip.data.rsnum}</b>
              </div>
            )}
            {/* ref/alt */}
            {tooltip.data.ref && tooltip.data.alt && (
              <div>
                Ref/Alt:{' '}
                <b>
                  {tooltip.data.ref}/{tooltip.data.alt}
                </b>
              </div>
            )}
            {/* p-value */}
            {tooltip.data.pval_nominal && (
              <div>
                <i>P</i>-value: <b>{tooltip.data.pval_nominal}</b>
              </div>
            )}
            {/* slope */}
            {tooltip.data.slope && (
              <div>
                Slope: <b>{tooltip.data.slope}</b>
              </div>
            )}
            {/* r2 */}
            {tooltip.data.R2 && (
              <div>
                R<sup>2</sup>: <b>{tooltip.data.R2}</b>
              </div>
            )}
            <div className="w-100 border border-top mx-0 my-0"></div>
            {/* make ld reference action */}
            {tooltip.data && (
              <div>
                <Button
                  variant="link"
                  onClick={(_) => {
                    updateTooltip({ visible: false });
                    handleSubmit(tooltip.data.rsnum);
                  }}
                >
                  <b>Make LD Reference</b>
                </Button>
              </div>
            )}
            {/* ldpop link */}
            {tooltip.data.rsnum && locus_alignment['top']['rsnum'] && (
              <div>
                <a
                  href={
                    'https://ldlink.nci.nih.gov/?tab=ldpop&var1=' +
                    tooltip.data.rsnum +
                    '&var2=' +
                    locus_alignment['top']['rsnum'] +
                    '&pop=' +
                    inputs['select_pop'][0].split('+').join('%2B') +
                    '&r2_d=r2'
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>LDpop</b>
                </a>
              </div>
            )}
            {/* potential gwas link */}
            {tooltip.data.rsnum && (
              <div>
                <a
                  href={
                    'https://www.ebi.ac.uk/gwas/search?query=' +
                    tooltip.data.rsnum
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Potential GWAS</b>
                </a>
              </div>
            )}
            {/* potential gnomad link */}
            {tooltip.data.chr &&
              tooltip.data.pos &&
              tooltip.data.ref &&
              tooltip.data.alt && (
                <div>
                  <a
                    href={
                      'http://gnomad.broadinstitute.org/variant/' +
                      tooltip.data.chr +
                      '-' +
                      tooltip.data.pos +
                      '-' +
                      tooltip.data.ref +
                      '-' +
                      tooltip.data.alt
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <b>gnomAD browser</b>
                  </a>
                </div>
              )}
            {/* show boxplot action */}
            {tooltip.data && (
              <div>
                <Button
                  variant="link"
                  onClick={async (_) => {
                    dispatch(
                      qtlsGWASBoxplotsCalculation({
                        request,
                        select_qtls_samples,
                        quantificationFile: inputs['quantification_file'][0],
                        genotypeFile: inputs['genotype_file'][0],
                        info: tooltip.data,
                      })
                    );
                    updateTooltip({ visible: false });
                  }}
                  disabled={
                    inputs['quantification_file'][0] == 'false' ||
                    inputs['genotype_file'][0] == 'false'
                  }
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
