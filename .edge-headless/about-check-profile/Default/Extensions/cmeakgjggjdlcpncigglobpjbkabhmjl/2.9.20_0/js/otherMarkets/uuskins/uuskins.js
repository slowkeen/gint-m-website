chrome.storage.sync.get({ external_integrations: {} }, ({ external_integrations }) => {
  if (!external_integrations.uuskins) {
    const sUuskinsInjector = document.createElement('script');
    sUuskinsInjector.src = chrome.runtime.getURL('js/siteExt/uuskins_injector.bundle.js');
    (document.head || document.documentElement).appendChild(sUuskinsInjector);
    sUuskinsInjector.onload = function () {
      sUuskinsInjector.parentNode.removeChild(sUuskinsInjector);
    };

    const actualCode = [`window.SIHID = '${chrome.runtime.id}';`];

    document.documentElement.setAttribute('onreset', actualCode.join('\r\n'));
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');

    const sJquery = document.createElement('script');
    sJquery.src = chrome.runtime.getURL('js/jquery/jquery-1.10.2.min.js');
    (document.head || document.documentElement).appendChild(sJquery);
    sJquery.onload = function () {
      const sJqueryUi = document.createElement('script');
      sJqueryUi.src = chrome.runtime.getURL('js/jquery/jquery-ui.min.js');
      (document.head || document.documentElement).appendChild(sJqueryUi);
      sJqueryUi.onload = function () {
        sJqueryUi.parentNode.removeChild(sJqueryUi);
        const cssUuskins = document.createElement('link');
        cssUuskins.href = chrome.runtime.getURL('js/siteExt/uuskins.css');
        cssUuskins.rel = 'stylesheet';
        cssUuskins.type = 'text/css';
        (document.head || document.documentElement).prepend(cssUuskins);

        const sUuskinsBundle = document.createElement('script');
        sUuskinsBundle.src = chrome.runtime.getURL('js/siteExt/uuskins.bundle.js');
        (document.head || document.documentElement).appendChild(sUuskinsBundle);
        sUuskinsBundle.onload = function () {
          sUuskinsBundle.parentNode.removeChild(sUuskinsBundle);
        };
      };

      sJquery.parentNode.removeChild(sJquery);
    };
  }
});
