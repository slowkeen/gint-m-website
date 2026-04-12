chrome.storage.sync.get({ external_integrations: {} }, ({ external_integrations }) => {
  if (!external_integrations.skinsmonkey) {
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
      sJqueryUi.onload = async function () {
        sJqueryUi.parentNode.removeChild(sJqueryUi);

        const cssSkinsmonkey = document.createElement('link');
        cssSkinsmonkey.href = chrome.runtime.getURL('js/siteExt/skinsmonkey.css');
        cssSkinsmonkey.rel = 'stylesheet';
        cssSkinsmonkey.type = 'text/css';
        (document.head || document.documentElement).prepend(cssSkinsmonkey);

        const sSkinsmonkeyBundle = document.createElement('script');
        sSkinsmonkeyBundle.src = chrome.runtime.getURL(`js/siteExt/skinsmonkey.bundle.js`);
        (document.head || document.documentElement).appendChild(sSkinsmonkeyBundle);
        sSkinsmonkeyBundle.onload = function () {
          sSkinsmonkeyBundle.parentNode.removeChild(sSkinsmonkeyBundle);
        };
      };

      sJquery.parentNode.removeChild(sJquery);
    };
  }
});
