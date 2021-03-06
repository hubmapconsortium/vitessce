// Exported because used by the cypress tests: They route API requests to the fixtures instead.
export const urlPrefix = 'https://s3.amazonaws.com/vitessce-data/0.0.31/master_release';

function makeLayerNameToConfig(datasetPrefix) {
  return name => ({
    name,
    type: name.toUpperCase(),
    fileType: `${name}.json`,
    url: `${urlPrefix}/${datasetPrefix}/${datasetPrefix}.${name}.json`,
  });
}

const linnarssonLayerNames = [
  'cells',
  'cell-sets',
  'raster',
  'molecules',
  'neighborhoods',
];
const linnarssonDescription = 'Spatial organization of the somatosensory cortex revealed by cyclic smFISH';
const linnarssonBase = {
  description: linnarssonDescription,
  layers: [
    ...linnarssonLayerNames.map(makeLayerNameToConfig('linnarsson')),
    {
      // TODO: remove this temporary override when the
      // clusters.json file has been converted to expression-matrix.zarr format.
      ...makeLayerNameToConfig('linnarsson')('clusters'),
      type: 'EXPRESSION-MATRIX',
    },
  ],
};
const linnarssonBaseNoClusters = {
  description: linnarssonDescription,
  layers: linnarssonLayerNames.filter(name => name !== 'clusters')
    .map(makeLayerNameToConfig('linnarsson')),
};

const driesDescription = 'Giotto, a pipeline for integrative analysis and visualization of single-cell spatial transcriptomic data';
const driesBase = {
  description: driesDescription,
  layers: [
    'cells',
    'cell-sets',
  ].map(makeLayerNameToConfig('dries')),
};

const wangDescription = 'Multiplexed imaging of high-density libraries of RNAs with MERFISH and expansion microscopy';
const wangBase = {
  description: wangDescription,
  layers: [
    ...['cells', 'molecules'].map(makeLayerNameToConfig('wang')),
    {
      // TODO: remove this temporary override when the
      // genes.json file has been converted to expression-matrix.zarr format.
      ...makeLayerNameToConfig('wang')('genes'),
      name: 'expression-matrix',
      type: 'EXPRESSION-MATRIX',
    },
  ],
};

const vanderbiltDescription = 'High Bit Depth (uint16) Multiplex Immunofluorescence Imaging';
const vanderbiltBase = {
  description: vanderbiltDescription,
  layers: [
    'raster',
  ].map(makeLayerNameToConfig('spraggins')),
};

/* eslint-disable object-property-newline */
/* eslint-disable object-curly-newline */
// Note that the ordering of the components in the staticLayout
// can affect the z-index of plot tooltips due to the
// resulting ordering of elements in the DOM.
export const configs = {
  'just-scatter': {
    version: '0.1.0',
    public: false,
    layers: [
      {
        name: 'cells',
        type: 'CELLS',
        fileType: 'cells.json',
        url: `${urlPrefix}/linnarsson/linnarsson.cells.json`,
        requestInit: {
          // Where the client checks that the value is from an enumeration,
          // I've chosen one of the allowed values,
          // but nothing on our S3 actually needs any of these.
          method: 'GET',
          headers: { 'x-foo': 'FAKE' },
          mode: 'cors',
          credentials: 'omit',
          cache: 'no-store',
          redirect: 'error',
          referrer: 'FAKE',
          integrity: 'FAKE',
        },
      },
    ],
    name: 'Linnarsson, just scatterplot',
    staticLayout: [
      {
        component: 'scatterplot',
        props: {
          mapping: 't-SNE',
          view: {
            zoom: 0.75,
            target: [0, 0, 0],
          },
        },
        x: 0, y: 0, w: 12, h: 2,
      },
    ],
  },
  'just-scatter-expression': {
    version: '0.1.0',
    public: false,
    layers: [
      {
        name: 'cells',
        type: 'CELLS',
        url: 'https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.cells.json',
      },
      {
        name: 'genes',
        type: 'GENES',
        url: 'https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.genes.json',
      },
    ],
    name: 'Linnarsson, just scatterplot and expression',
    staticLayout: [
      {
        component: 'scatterplot',
        props: {
          mapping: 't-SNE',
          view: {
            zoom: 0.75,
            target: [0, 0, 0],
          },
        },
        x: 0, y: 0, w: 8, h: 2,
      },
      {
        component: 'genes',
        x: 8, y: 2, w: 4, h: 2,
      },
    ],
  },
  'linnarsson-2018': {
    name: 'Linnarsson',
    version: '1.0.0',
    description: linnarssonDescription,
    public: true,
    datasets: [
      {
        uid: 'linnarsson-2018',
        name: 'Linnarsson 2018',
        description: `Linnarsson: ${linnarssonDescription}`,
        files: linnarssonBase.layers.map(file => ({
          type: file.type.toLowerCase(),
          fileType: file.fileType,
          url: file.url,
        })),
      },
    ],
    initStrategy: 'auto',
    coordinationSpace: {
      embeddingZoom: {
        PCA: 0,
        TSNE: 0.75,
      },
      embeddingType: {
        PCA: 'PCA',
        TSNE: 't-SNE',
      },
      spatialZoom: {
        A: -5.5,
      },
      spatialTargetX: {
        A: 16000,
      },
      spatialTargetY: {
        A: 20000,
      },
    },
    layout: [
      { component: 'description',
        x: 0, y: 0, w: 2, h: 1 },
      { component: 'layerController',
        x: 0, y: 1, w: 2, h: 4,
      },
      { component: 'status',
        x: 0, y: 5, w: 2, h: 1 },
      { component: 'spatial',
        coordinationScopes: {
          spatialZoom: 'A',
          spatialTargetX: 'A',
          spatialTargetY: 'A',
        },
        x: 2, y: 0, w: 4, h: 4 },
      { component: 'genes',
        x: 9, y: 0, w: 3, h: 2 },
      { component: 'cellSets',
        x: 9, y: 3, w: 3, h: 2 },
      { component: 'heatmap',
        props: {
          transpose: true,
        },
        x: 2, y: 4, w: 5, h: 2 },
      { component: 'cellSetExpression',
        x: 7, y: 4, w: 3, h: 2 },
      { component: 'expressionHistogram',
        x: 10, y: 4, w: 2, h: 2 },
      { component: 'scatterplot',
        coordinationScopes: {
          embeddingType: 'PCA',
          embeddingZoom: 'PCA',
        },
        x: 6, y: 0, w: 3, h: 2 },
      { component: 'scatterplot',
        coordinationScopes: {
          embeddingType: 'TSNE',
          embeddingZoom: 'TSNE',
        },
        x: 6, y: 2, w: 3, h: 2 },
    ],
  },
  'linnarsson-2018-two-spatial': {
    ...linnarssonBase,
    version: '0.1.0',
    name: 'Linnarsson (two spatial)',
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -8,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 0, w: 5, h: 2 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 2, w: 5, h: 2 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6,
            target: [18000, 18000, 0],
          },
        },
        x: 5, y: 0, w: 5, h: 2 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 5, y: 2, w: 5, h: 2 },
      { component: 'genes',
        x: 10, y: 2, w: 2, h: 2 },
      { component: 'heatmap',
        x: 0, y: 4, w: 12 },
    ],
  },
  'linnarsson-2018-just-spatial': {
    ...linnarssonBaseNoClusters,
    version: '0.1.0',
    name: 'Linnarsson (just spatial)',
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 0, w: 10, h: 2 },
      { component: 'genes',
        x: 10, y: 1, w: 2, h: 1 },
    ],
  },
  'linnarsson-2018-static': {
    ...linnarssonBase,
    version: '0.1.0',
    name: 'Linnarsson (static layout)',
    staticLayout: [
      { component: 'description',
        props: {
          description: `Linnarsson (static layout): ${linnarssonDescription}`,
        },
        x: 0, y: 0, w: 3, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 2, w: 3, h: 2 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 3, y: 0, w: 6, h: 4 },
      { component: 'genes',
        x: 9, y: 2, w: 3, h: 2 },
      { component: 'heatmap',
        x: 0, y: 4, w: 12, h: 1 },
    ],
  },
  'linnarsson-2018-dozen': {
    ...linnarssonBase,
    version: '0.1.0',
    name: 'Linnarsson (static layout, redundant components for performance testing)',
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 0, w: 4, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 0, y: 1, w: 4, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 4, y: 0, w: 4, h: 1 },
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [18000, 18000, 0],
          },
        },
        x: 4, y: 1, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 2, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 3, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 4, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 't-SNE' },
        x: 0, y: 5, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 2, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 3, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 4, w: 4, h: 1 },
      { component: 'scatterplot',
        props: { mapping: 'PCA' },
        x: 4, y: 5, w: 4, h: 1 },
      { component: 'genes',
        x: 8, y: 2, w: 4, h: 2 },
      { component: 'heatmap',
        x: 8, y: 4, w: 4, h: 2 },
    ],
  },
  'dries-2019': {
    name: 'Dries',
    version: '1.0.0',
    description: driesDescription,
    public: true,
    datasets: [
      {
        uid: 'dries-2019',
        name: 'Dries 2019',
        files: driesBase.layers.map(file => ({
          type: file.type.toLowerCase(),
          fileType: file.fileType,
          url: file.url,
        })),
      },
    ],
    initStrategy: 'auto',
    coordinationSpace: {
      embeddingType: {
        TSNE: 't-SNE',
        UMAP: 'UMAP',
      },
      embeddingCellSetPolygonsVisible: {
        A: false,
      },
      embeddingCellSetLabelsVisible: {
        A: true,
      },
      embeddingCellSetLabelSize: {
        A: 16,
      },
      embeddingCellRadius: {
        A: 1,
      },
      embeddingZoom: {
        TSNE: 3,
        UMAP: 3,
      },
      spatialZoom: {
        A: -4.4,
      },
      spatialTargetX: {
        A: 3800,
      },
      spatialTargetY: {
        A: -900,
      },
    },
    layout: [
      { component: 'description',
        x: 9, y: 0, w: 3, h: 2 },
      { component: 'status',
        x: 9, y: 2, w: 3, h: 2 },
      { component: 'cellSets',
        x: 9, y: 4, w: 3, h: 4 },
      { component: 'cellSetSizes',
        x: 5, y: 4, w: 4, h: 4 },
      { component: 'scatterplot',
        coordinationScopes: {
          embeddingType: 'TSNE',
          embeddingZoom: 'TSNE',
          embeddingCellSetLabelsVisible: 'A',
          embeddingCellSetLabelSize: 'A',
          embeddingCellSetPolygonsVisible: 'A',
          embeddingCellRadius: 'A',
        },
        x: 0, y: 2, w: 5, h: 4 },
      { component: 'spatial',
        props: {
          cellRadius: 50,
        },
        coordinationScopes: {
          spatialZoom: 'A',
          spatialTargetX: 'A',
          spatialTargetY: 'A',
        },
        x: 5, y: 0, w: 4, h: 4 },
      { component: 'scatterplot',
        coordinationScopes: {
          embeddingType: 'UMAP',
          embeddingZoom: 'UMAP',
          embeddingCellSetLabelsVisible: 'A',
          embeddingCellSetLabelSize: 'A',
          embeddingCellSetPolygonsVisible: 'A',
          embeddingCellRadius: 'A',
        },
        x: 0, y: 0, w: 5, h: 4 },
    ],
  },
  'wang-2019': {
    name: 'Wang',
    version: '1.0.0',
    description: wangDescription,
    public: true,
    datasets: [
      {
        uid: 'wang-2019',
        name: 'Wang 2019',
        files: wangBase.layers.map(file => ({
          type: file.type.toLowerCase(),
          fileType: file.fileType,
          url: file.url,
        })),
      },
    ],
    initStrategy: 'auto',
    coordinationSpace: {
      spatialZoom: {
        A: -1,
      },
      spatialLayers: {
        A: [
          {
            type: 'molecules', radius: 2, opacity: 1, visible: true,
          },
          {
            type: 'cells', opacity: 1, radius: 50, visible: true, stroked: false,
          },
        ],
      },
    },
    layout: [
      { component: 'spatial',
        coordinationScopes: {
          spatialZoom: 'A',
          spatialLayers: 'A',
        },
        x: 0, y: 0, w: 10, h: 2 },
      { component: 'genes',
        x: 10, y: 0, w: 2, h: 4 },
      { component: 'expressionHistogram',
        x: 0, y: 2, w: 10, h: 2 },
    ],
  },

  vanderbilt: {
    ...vanderbiltBase,
    version: '0.1.0',
    name: 'Spraggins',
    public: true,
    staticLayout: [
      { component: 'spatial',
        props: {
          view: {
            zoom: -6.5,
            target: [20000, 20000, 0],
          },
        },
        x: 0, y: 0, w: 9, h: 2 },
      { component: 'layerController',
        x: 9, y: 0, w: 3, h: 2 },
    ],
  },
  'just-higlass': {
    public: false,
    initStrategy: 'auto',
    version: '1.0.0',
    datasets: [
      {
        uid: 'higlass-dataset',
        name: 'HiGlass Dataset',
        files: [],
      },
    ],
    name: 'HiGlass demo',
    coordinationSpace: {
      genomicZoomX: {
        A: 0,
      },
      genomicZoomY: {
        A: 0,
      },
      genomicTargetX: {
        A: 1549999999.5,
      },
      genomicTargetY: {
        A: 1549999999.5,
      },
    },
    layout: [
      {
        component: 'higlass',
        coordinationScopes: {
          genomicZoomX: 'A',
          genomicZoomY: 'A',
          genomicTargetX: 'A',
          genomicTargetY: 'A',
        },
        props: {
          hgViewConfig: {
            uid: 'aa',
            autocompleteSource: '/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&',
            genomePositionSearchBox: {
              autocompleteServer: '//higlass.io/api/v1',
              autocompleteId: 'OHJakQICQD6gTD7skx4EWA',
              chromInfoServer: '//higlass.io/api/v1',
              chromInfoId: 'hg19',
              visible: true,
            },
            chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
            tracks: {
              top: [
                {
                  type: 'horizontal-gene-annotations',
                  height: 60,
                  tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
                  server: '//higlass.io/api/v1',
                  uid: 'OHJakQICQD6gTD7skx4EWA',
                  options: {
                    name: 'Gene Annotations (hg19)',
                    fontSize: 10,
                    labelPosition: 'hidden',
                    labelLeftMargin: 0,
                    labelRightMargin: 0,
                    labelTopMargin: 0,
                    labelBottomMargin: 0,
                    minHeight: 24,
                    geneAnnotationHeight: 16,
                    geneLabelPosition: 'outside',
                    geneStrandSpacing: 4,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                    plusStrandColor: '#fdff54',
                    minusStrandColor: '#68bf30',
                    labelColor: 'black',
                    trackBorderWidth: 0,
                    trackBorderColor: 'black',
                  },
                },
                {
                  chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                  type: 'horizontal-chromosome-labels',
                  height: 30,
                  uid: 'X4e_1DKiQHmyghDa6lLMVA',
                  options: {
                    color: '#808080',
                    stroke: 'black',
                    fontSize: 12,
                    fontIsLeftAligned: false,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                  },
                },
              ],
              left: [
                {
                  type: 'vertical-gene-annotations',
                  width: 60,
                  tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
                  server: '//higlass.io/api/v1',
                  options: {
                    labelPosition: 'bottomRight',
                    name: 'Gene Annotations (hg19)',
                    fontSize: 10,
                    labelLeftMargin: 0,
                    labelRightMargin: 0,
                    labelTopMargin: 0,
                    labelBottomMargin: 0,
                    minWidth: 24,
                    geneAnnotationHeight: 16,
                    geneLabelPosition: 'outside',
                    geneStrandSpacing: 4,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                    plusStrandColor: '#fdff54',
                    minusStrandColor: '#68bf30',
                    labelColor: 'black',
                    trackBorderWidth: 0,
                    trackBorderColor: 'black',
                  },
                  uid: 'dqBTMH78Rn6DeSyDBoAEXw',
                },
                {
                  chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                  type: 'vertical-chromosome-labels',
                  width: 30,
                  uid: 'RHdQK4IRQ7yJeDmKWb7Pcg',
                  options: {
                    color: '#777777',
                    stroke: 'black',
                    fontSize: 12,
                    fontIsLeftAligned: false,
                    minWidth: 35,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                  },
                },
              ],
              center: [
                {
                  uid: 'c1',
                  type: 'combined',
                  height: 600,
                  contents: [
                    {
                      server: '//higlass.io/api/v1',
                      tilesetUid: 'CQMd6V_cRw6iCI_-Unl3PQ',
                      type: 'heatmap',
                      options: {
                        maxZoom: null,
                        labelPosition: 'bottomRight',
                        name: 'Rao et al. (2014) GM12878 MboI (allreps) 1kb',
                        backgroundColor: 'black',
                        labelLeftMargin: 0,
                        labelRightMargin: 0,
                        labelTopMargin: 0,
                        labelBottomMargin: 0,
                        labelShowResolution: true,
                        labelShowAssembly: true,
                        labelColor: '#ffffff',
                        labelTextOpacity: 0.5,
                        labelBackgroundColor: 'black',
                        labelBackgroundOpacity: 0.01,
                        colorRange: [
                          '#000000',
                          '#222e54',
                          '#448db2',
                          '#68bf30',
                          '#fdff54',
                          '#FFFFFF',
                        ],
                        colorbarBackgroundColor: 'black',
                        colorbarBackgroundOpacity: 0.01,
                        colorbarPosition: 'topRight',
                        trackBorderWidth: 0,
                        trackBorderColor: 'black',
                        heatmapValueScaling: 'log',
                        showMousePosition: true,
                        mousePositionColor: '#ff00ff',
                        showTooltip: false,
                        extent: 'full',
                        zeroValueColor: null,
                        scaleStartPercent: '0.00000',
                        scaleEndPercent: '1.00000',
                      },
                      height: 500,
                      uid: 'GjuZed1ySGW1IzZZqFB9BA',
                      transforms: [
                        {
                          name: 'ICE',
                          value: 'weight',
                        },
                      ],
                    },
                  ],
                  options: {},
                },
              ],
              right: [],
              bottom: [],
              whole: [],
              gallery: [],
            },
            layout: {
              w: 12,
              h: 12,
              x: 0,
              y: 0,
              moved: false,
              static: false,
            },
          },
        },
        x: 0, y: 0, w: 8, h: 2,
      },
      {
        component: 'higlass',
        coordinationScopes: {
          genomicZoomX: 'A',
          genomicZoomY: 'A',
          genomicTargetX: 'A',
          genomicTargetY: 'A',
        },
        props: {
          hgViewConfig: {
            uid: 'aa',
            autocompleteSource: '/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&',
            genomePositionSearchBox: {
              autocompleteServer: '//higlass.io/api/v1',
              autocompleteId: 'OHJakQICQD6gTD7skx4EWA',
              chromInfoServer: '//higlass.io/api/v1',
              chromInfoId: 'hg19',
              visible: true,
            },
            chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
            tracks: {
              top: [
                {
                  type: 'horizontal-gene-annotations',
                  height: 60,
                  tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
                  server: '//higlass.io/api/v1',
                  uid: 'OHJakQICQD6gTD7skx4EWA',
                  options: {
                    name: 'Gene Annotations (hg19)',
                    fontSize: 10,
                    labelPosition: 'hidden',
                    labelLeftMargin: 0,
                    labelRightMargin: 0,
                    labelTopMargin: 0,
                    labelBottomMargin: 0,
                    minHeight: 24,
                    geneAnnotationHeight: 16,
                    geneLabelPosition: 'outside',
                    geneStrandSpacing: 4,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                    plusStrandColor: '#fdff54',
                    minusStrandColor: '#68bf30',
                    labelColor: 'black',
                    trackBorderWidth: 0,
                    trackBorderColor: 'black',
                  },
                },
                {
                  chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                  type: 'horizontal-chromosome-labels',
                  height: 30,
                  uid: 'X4e_1DKiQHmyghDa6lLMVA',
                  options: {
                    color: '#808080',
                    stroke: 'black',
                    fontSize: 12,
                    fontIsLeftAligned: false,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                  },
                },
              ],
              left: [
                {
                  type: 'vertical-gene-annotations',
                  width: 60,
                  tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
                  server: '//higlass.io/api/v1',
                  options: {
                    labelPosition: 'bottomRight',
                    name: 'Gene Annotations (hg19)',
                    fontSize: 10,
                    labelLeftMargin: 0,
                    labelRightMargin: 0,
                    labelTopMargin: 0,
                    labelBottomMargin: 0,
                    minWidth: 24,
                    geneAnnotationHeight: 16,
                    geneLabelPosition: 'outside',
                    geneStrandSpacing: 4,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                    plusStrandColor: '#fdff54',
                    minusStrandColor: '#68bf30',
                    labelColor: 'black',
                    trackBorderWidth: 0,
                    trackBorderColor: 'black',
                  },
                  uid: 'dqBTMH78Rn6DeSyDBoAEXw',
                },
                {
                  chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv',
                  type: 'vertical-chromosome-labels',
                  width: 30,
                  uid: 'RHdQK4IRQ7yJeDmKWb7Pcg',
                  options: {
                    color: '#777777',
                    stroke: 'black',
                    fontSize: 12,
                    fontIsLeftAligned: false,
                    minWidth: 35,
                    showMousePosition: true,
                    mousePositionColor: '#ff00ff',
                  },
                },
              ],
              center: [
                {
                  uid: 'c1',
                  type: 'combined',
                  height: 600,
                  contents: [
                    {
                      server: '//higlass.io/api/v1',
                      tilesetUid: 'CQMd6V_cRw6iCI_-Unl3PQ',
                      type: 'heatmap',
                      options: {
                        maxZoom: null,
                        labelPosition: 'bottomRight',
                        name: 'Rao et al. (2014) GM12878 MboI (allreps) 1kb',
                        backgroundColor: 'black',
                        labelLeftMargin: 0,
                        labelRightMargin: 0,
                        labelTopMargin: 0,
                        labelBottomMargin: 0,
                        labelShowResolution: true,
                        labelShowAssembly: true,
                        labelColor: '#ffffff',
                        labelTextOpacity: 0.5,
                        labelBackgroundColor: 'black',
                        labelBackgroundOpacity: 0.01,
                        colorRange: [
                          '#000000',
                          '#222e54',
                          '#448db2',
                          '#68bf30',
                          '#fdff54',
                          '#FFFFFF',
                        ],
                        colorbarBackgroundColor: 'black',
                        colorbarBackgroundOpacity: 0.01,
                        colorbarPosition: 'topRight',
                        trackBorderWidth: 0,
                        trackBorderColor: 'black',
                        heatmapValueScaling: 'log',
                        showMousePosition: true,
                        mousePositionColor: '#ff00ff',
                        showTooltip: false,
                        extent: 'full',
                        zeroValueColor: null,
                        scaleStartPercent: '0.00000',
                        scaleEndPercent: '1.00000',
                      },
                      height: 500,
                      uid: 'GjuZed1ySGW1IzZZqFB9BA',
                      transforms: [
                        {
                          name: 'ICE',
                          value: 'weight',
                        },
                      ],
                    },
                  ],
                  options: {},
                },
              ],
              right: [],
              bottom: [],
              whole: [],
              gallery: [],
            },
            layout: {
              w: 12,
              h: 12,
              x: 0,
              y: 0,
              moved: false,
              static: false,
            },
          },
        },
        x: 8, y: 0, w: 4, h: 2,
      },
    ],
  },
  'sc-atac-seq-10x-genomics-pbmc': {
    version: '1.0.0',
    name: 'HiGlass serverless demo with 10x Genomics scATAC-seq 5k PBMC dataset',
    datasets: [
      {
        uid: '10x-genomics-pbmc',
        name: '10x Genomics PBMC',
        files: [
          {
            type: 'genomic-profiles',
            fileType: 'genomic-profiles.zarr',
            url: 'http://higlass-serverless.s3.amazonaws.com/multivec/pbmc_10x_peaks_by_cluster.zarr',
          },
        ],
      },
    ],
    layout: [
      { component: 'genomicProfiles',
        props: {
          profileTrackUidKey: 'file',
        },
        x: 0, y: 0, w: 8, h: 2,
      },
      { component: 'description',
        props: {
          description: '10x Genomics scATAC-seq of 5k PBMCs. Note: the Zarr HiGlass Plugin Datafetcher is not yet optimized. Please be patient while the HiGlass tracks load.',
        },
        x: 8, y: 0, w: 4, h: 2 },
    ],
    initStrategy: 'auto',
  },
};
/* eslint-enable */

export function listConfigs(showAll) {
  return Object.entries(configs).filter(
    entry => showAll || entry[1].public,
  ).map(
    ([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
    }),
  );
}

export function getConfig(id) {
  return configs[id];
}
