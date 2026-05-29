/*
 * Regression-lock replay for: falcon-ui-core Wave 20 shadow row notch fix
 *
 * Usage:
 *   1. Log into http://localhost:4200/#/admin-console/org-hierarchy-page as FalconAdmin
 *   2. Select the BMW org node (or any node with shadow-row-bearing CommChannels)
 *   3. Click the "CommChannels & Services" tab
 *   4. Open DevTools console, paste this file, hit enter
 *   5. Expect "REGRESSION-LOCK: PASS"
 */
(async () => {
  const t2 = document.querySelector('[aria-label="Toggle row detail for row 2"]');
  const t4 = document.querySelector('[aria-label="Toggle row detail for row 4"]');
  if (!t2 || !t4) {
    console.warn('REGRESSION-LOCK: SKIPPED — toggles not found, navigate to BMW CommChannels & Services tab');
    return;
  }
  if (t2.getAttribute('aria-expanded') !== 'true') t2.click();
  await new Promise(r => setTimeout(r, 300));
  if (t4.getAttribute('aria-expanded') !== 'true') t4.click();
  await new Promise(r => setTimeout(r, 500));

  const shadows = document.querySelectorAll('tr[data-shadow-row-id]');
  const headers = {};
  document.querySelectorAll('thead th').forEach(h => {
    const r = h.getBoundingClientRect();
    headers[h.innerText.replace(/\s+/g,' ').trim()] = (r.left + r.right) / 2;
  });

  let allPass = true;
  for (const tr of shadows) {
    const td = tr.querySelector('td[data-shadow-mount]');
    const arrow = tr.querySelector('.falcon-table-shadow-arrow');
    if (!arrow) { allPass = false; console.error(`shadow ${tr.dataset.shadowRowId}: NO ARROW`); continue; }
    const target = td.getAttribute('data-shadow-target-column');
    const expectCenter = target === 'priceValue' ? headers['Price Value']
                       : target === 'priceType'  ? headers['Price Type']
                       : null;
    if (expectCenter == null) { console.warn(`shadow ${tr.dataset.shadowRowId}: target column "${target}" not measurable, skipping`); continue; }
    const ar = arrow.getBoundingClientRect();
    const actualCenter = (ar.left + ar.right) / 2;
    const delta = Math.abs(actualCenter - expectCenter);
    const ready = arrow.hasAttribute('data-shadow-arrow-ready');
    const visible = arrow.offsetParent !== null;
    const cs = getComputedStyle(arrow);
    const correctTop = cs.top === `${-parseFloat(cs.height)}px`; // top should equal -height (calc(-1 * var(--falcon-data-table-shadow-arrow-size)))
    const correctZ = cs.zIndex === '2';

    const pass = delta < 1.5 && ready && visible && correctTop && correctZ;
    if (!pass) allPass = false;
    console.log(`shadow ${tr.dataset.shadowRowId} target=${target}`,
      `arrowCenter=${actualCenter.toFixed(2)} headerCenter=${expectCenter.toFixed(2)} delta=${delta.toFixed(2)}px`,
      `ready=${ready} visible=${visible} top=${cs.top} z=${cs.zIndex} → ${pass ? 'PASS' : 'FAIL'}`);
  }
  console.log(allPass ? 'REGRESSION-LOCK: PASS' : 'REGRESSION-LOCK: FAIL');
})();
