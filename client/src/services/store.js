import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './reducers';
import ReduxThunk from 'redux-thunk';

export const getInitialState = async () => {
  let initialState = {
    qtlsGWAS: {
      openSidebar: true,
      associationFile: null,
      associationFileName: null,
      quantificationFile: null,
      genotypeFile: null,
      gwasFile: null,
      gwasFileName: null,
      LDFile: null,
      LDFileName: null,
      request: '',
      select_pop: false,
      select_gene: false,
      locusInformation: [
        {
          select_dist: 75,
          select_ref: '',
          select_position: '',
          select_chromosome: false,
        },
      ],
      recalculate: false,
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
      traitID: '',
      genotypeID: '',
      log2: false,
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
      locus_alignment_gwas_scatter_threshold: 0.0,
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
      isLoadingQuantification: false,
      summaryLoaded: false,
      summaryError: false,
      isLoadingQC: false,
      isLoadingLD: false,
      ldError: '',
      locus_qc: null,
      publicGTEx: [],
      genome: '',
      qtlProject: '',
      gwasProject: '',
      ldProject: '',
      ldThreshold: '',
      ldAssocData: '',
      xQtl: '',
      tissue: '',
      phenotype: '',
      useQueue: false,
      jobName: '',
      email: '',
      qtlPublic: false,
      gwasPublic: false,
      ldPublic: false,
      qtlKey: '',
      gwasKey: '',
      ldKey: '',
    },
    errorModal: {
      visible: false,
      details: ``,
      message: `An error occurred when requesting data. If this problem persists, please contact the administrator at <a href="mailto:NCIezQTLWebAdmin@mail.nih.gov">NCIezQTLWebAdmin@mail.nih.gov</a>.`,
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
    publications: {
      globalFilter: '',
      hidden: ['Pubmed'],
      pagination: { pageIndex: 0, pageSize: 10 },
      sort: [{ id: 'Year', desc: true }],
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
