document.addEventListener('RapidReviewUIBundleReady', (event) => {
  RapidReviewUIBundle({
    dom_id: 'rapidreview-ui',
    queryConfigEnabled: true,
    url: 'rapidreview.yaml',
    layout: 'StandaloneLayout'
  });
});
