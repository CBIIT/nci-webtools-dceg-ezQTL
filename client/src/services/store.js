import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './reducers';
import ReduxThunk from 'redux-thunk';

export const getInitialState = async () => {
  let initialState = {
    qtlsGWAS: {
      openSidebar: true,
      select_qtls_samples: false,
      select_gwas_sample: false,
      associationFile: null,
      quantificationFile: null,
      genotypeFile: null,
      gwasFile: null,
      LDFile: null,
      request: '',
      select_pop: false,
      select_gene: false,
      select_dist: 100,
      select_ref: false,
      recalculateAttempt: false,
      recalculatePop: false,
      recalculateGene: false,
      recalculateDist: false,
      recalculateRef: false,
      submitted: false,
      isLoading: false,
      isError: false,
      activeResultsTab: 'locus-qc',
      activeColocalizationTab: 'hyprcoloc',
      top_gene_variants: null,
      all_gene_variants: null,
      gene_list: null,
      inputs: null,
      messages: null,
      locus_quantification: null,
      locus_quantification_heatmap: null,
      locus_alignment: {
        data: null,
        layout: null,
        top: {
          chr: null,
          gene_symbol: null,
        },
      },
      locus_alignment_boxplots: {
        isLoading: false,
        visible: false,
        data: null,
        layout: null,
      },
      locus_alignment_gwas_scatter: {
        raw: null,
        data: null,
        layout: null,
      },
      locus_alignment_gwas_scatter_threshold: 1.0,
      locus_colocalization_correlation: null,
      gwas: null,
      locus_table: {
        data: [],
        globalFilter: '',
        hidden: ['gene_id', 'tss_distance', 'slope_se'],
      },
      hyprcolocError: '',
      qcError: '',
      hyprcoloc_ld: null,
      hyprcoloc_table: {
        data: [],
        globalFilter: '',
        hidden: [],
      },
      hyprcolocSNPScore_table: {
        data: [],
        globalFilter: '',
        hidden: [],
      },
      isLoadingHyprcoloc: false,
      ecaviar_table: {
        data: [],
        globalFilter: '',
        hidden: [
          'Prob_in_pCausalSet',
          'Prob_in_pCausalSet2',
          'tss_distance',
          'gene_id',
          'slope',
          'slope_se',
          'gwas_z',
        ],
      },
      isLoadingECaviar: false,
      isLoadingSummary: false,
      summaryLoaded: false,
      summaryError: false,
      isLoadingQC: false,
      locus_qc: null,
      // locus_table: {
      //   globalFilter: '',
      //   data: [],
      //   pagination: {
      //     pageIndex: 0,
      //     pageSize: 0
      //   }
      // }
      publicGTEx: [],
      loadingPublic: false,
      genome: '',
      genomeOptions: [],
      qtlProject: '',
      qtlProjectOptions: [],
      gwasProject: '',
      gwasProjectOptions: [],
      ldProject: '',
      ldProjectOptions: [],
      xQtl: '',
      xQtlOptions: [],
      tissue: '',
      tissueOptions: [],
      phenotype: '',
      phenotypeOptions: [],
      select_chromosome: { value: 21, label: 21 },
      select_position: '42743496',
      isQueue: false,
      email: '',
      qtlPublic: false,
      gwasPublic: false,
      ldPublic: false,
    },
    errorModal: {
      visible: false,
      details: ``,
      message: `An error occured when requesting data. If this problem persists, please contact the administrator at <a href="mailto:FORGE2-TFWebAdmin@cancer.gov">ezQTLWebAdmin@cancer.gov</a>.`,
    },
    successModal: {
      visible: false,
      details: ``,
      message: '',
    },
    alert: {
      show: false,
      message: ``,
      variant: 'warning',
    },
  };

  return initialState;
};

export const getStore = async (_) =>
  createStore(
    rootReducer,
    await getInitialState(),
    compose(
      applyMiddleware(ReduxThunk),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true })
        : (e) => e
    )
  );
