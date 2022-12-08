import 'bootstrap/dist/js/bootstrap.min';
import '@fortawesome/fontawesome-free/js/solid.min';
import '@fortawesome/fontawesome-free/js/brands.min';
import '@fortawesome/fontawesome-free/js/fontawesome.min';

import RapidReviewUIOptions from './dto/rapidreview-ui-options.dto';
import RapidReviewUIBundle from './bundle/rapidreview-ui.bundle';

document.addEventListener('DOMContentLoaded', (event) => {

  window['RapidReviewUIBundle'] = async (options: RapidReviewUIOptions) => {
    const bundle = new RapidReviewUIBundle(options);
    bundle.execute();
  };
  document.dispatchEvent(new Event('RapidReviewUIBundleReady'));

  if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker.register(
      new URL('../service-worker.js', import.meta.url),
      {
        scope: '/rapidreview-ui/',
        type: 'module'
      }
    );
  }

});
