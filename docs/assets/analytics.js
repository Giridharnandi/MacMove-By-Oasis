'use strict';
(() => {
  if (location.hostname !== 'oasis.upfaast.com') return;
  const storageKey = 'macmove-analytics';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const privacySignal = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  let preference = null;
  try { preference = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  if (!preference || !Number.isFinite(preference.expires) || preference.expires <= Date.now() || !['allow', 'deny'].includes(preference.choice)) preference = null;
  // Remove identifiers left by the retired integration; keep only the choice.
  if (preference) {
    preference = {choice: preference.choice, expires: preference.expires};
    try { localStorage.setItem(storageKey, JSON.stringify(preference)); } catch {}
  }
  try { sessionStorage.removeItem(storageKey); } catch {}
  function save(choice) {
    preference = {choice, expires: Date.now() + lifetime};
    try { localStorage.setItem(storageKey, JSON.stringify(preference)); } catch {}
  }
  function capture(event, extra = {}) {
    if (privacySignal || preference?.choice !== 'allow' || navigator.webdriver || document.visibilityState === 'prerender') return;
    let referrer = '';
    try { referrer = new URL(document.referrer).hostname; } catch {}
    const query = new URLSearchParams(location.search);
    const campaign = query.get('utm_source');
    if (campaign && /^[a-zA-Z0-9_-]{1,80}$/.test(campaign)) referrer = 'campaign:' + campaign;
    const pageview = event === '$pageview';
    const parameters = new URLSearchParams({
      p: pageview ? location.pathname : event + (extra.release ? '/' + extra.release : ''),
      t: pageview ? 'MacMove by Oasis' : event,
      r: referrer, e: pageview ? 'false' : 'true',
      rnd: Math.random().toString(36).slice(2)
    });
    // GoatCounter's count endpoint, with an explicit allowlist of fields.
    // No SDK, query strings, visitor IDs, cookies, replay or file information.
    fetch('https://goatcounter-production-7a2a.up.railway.app/count?' + parameters, {
      method: 'POST', mode: 'no-cors', credentials: 'omit',
      keepalive: true, referrerPolicy: 'no-referrer'
    }).catch(() => {});
  }
  const banner = document.createElement('section');
  banner.className = 'analytics-choice';
  banner.setAttribute('aria-label', 'Optional website analytics');
  banner.innerHTML = '<p><b>Help improve MacMove by Oasis?</b> Allow optional visit and download-click analytics, including referral source and approximate location. No files or recordings. <a href="https://oasis.upfaast.com/#privacy">Privacy</a></p><div><button type="button" data-choice="allow">Allow analytics</button><button type="button" data-choice="deny">No thanks</button></div>';
  banner.hidden = privacySignal || preference !== null;
  banner.addEventListener('click', event => {
    const choice = event.target.closest('[data-choice]')?.dataset.choice;
    if (!choice) return;
    const wasAllowed = preference?.choice === 'allow';
    save(choice);
    banner.hidden = true;
    if (choice === 'allow' && !wasAllowed) capture('$pageview');
  });
  document.body.append(banner);
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = 'Analytics preferences';
  settings.addEventListener('click', () => {
    if (privacySignal) {
      settings.textContent = 'Analytics disabled by your browser privacy signal';
      return;
    }
    banner.hidden = false;
    banner.querySelector('button').focus();
  });
  document.querySelector('footer nav')?.append(settings);
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== 'https://github.com' || !/^\/Giridharnandi\/MacMove-By-Oasis(?:\/|$)/.test(url.pathname)) return;
    if (/^\/Giridharnandi\/MacMove-By-Oasis\/releases\/download\/[^/]+\/[^/]+\.pkg$/.test(url.pathname)) {
      capture('macmove_download_click', {release: url.pathname.split('/')[5]});
    } else if (url.pathname.includes('/releases')) capture('macmove_releases_click');
    else capture('macmove_repository_click');
  });
  capture('$pageview');
})();
