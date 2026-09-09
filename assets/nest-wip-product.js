  function nwipSwap(btn){
    var main = document.getElementById('nwipMainImg');
    if (main && btn.dataset.full) {
      main.removeAttribute('srcset');
      main.removeAttribute('sizes');
      main.src = btn.dataset.full;
    }
    document.querySelectorAll('.nwip-thumbs button').forEach(function(b){ b.classList.remove('on'); });
    btn.classList.add('on');
  }

  function nwipRenderPrice(price, compare){
    var box = document.getElementById('nwipPriceBox');
    if (!box) return;
    if (compare) {
      box.innerHTML =
        '<div class="price price--on-sale"><dl>' +
        '<div class="price__sale"><dd><span class="price-item price-item--sale">' + price + '</span></dd>' +
        '<dd class="price__compare"><span class="price-item price-item--regular">' + compare + '</span></dd></div>' +
        '</dl></div>';
    } else {
      box.innerHTML =
        '<div class="price"><dl><div class="price__regular"><dd><span class="price-item price-item--regular">' + price + '</span></dd></div></dl></div>';
    }
  }

  function nwipSelect(btn){
    if (btn.disabled) return;
    document.querySelectorAll('.nwip-size').forEach(function(b){ b.setAttribute('aria-pressed','false'); });
    btn.setAttribute('aria-pressed','true');
    document.getElementById('nwipVariantId').value = btn.dataset.variantId;
    window.nwipCurrentVariantId = btn.dataset.variantId;
    if (btn.dataset.price) {
      nwipRenderPrice(btn.dataset.price, btn.dataset.compare);
      var atcPriceEl = document.getElementById('nwipAtcPrice');
      var stickyPriceEl = document.getElementById('nwipStickyPrice');
      var stickyAtcPriceEl = document.getElementById('nwipStickyAtcPrice');
      if (atcPriceEl) atcPriceEl.textContent = btn.dataset.price;
      if (stickyPriceEl) stickyPriceEl.textContent = btn.dataset.price;
      if (stickyAtcPriceEl) stickyAtcPriceEl.textContent = btn.dataset.price;
    }
    var atc = document.getElementById('nwipAtc');
    var stickyBtn = document.getElementById('nwipStickyBtn');
    var available = btn.dataset.available === 'true';
    if (atc) atc.disabled = !available;
    if (stickyBtn) stickyBtn.disabled = !available;
  }

  function nwipQty(delta){
    var input = document.getElementById('nwipQtyInput');
    if (!input) return;
    var val = parseInt(input.value, 10) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
  }

  function nwipStickyAdd(){
    var btn = document.getElementById('nwipStickyBtn');
    var qtyInput = document.getElementById('nwipQtyInput');
    var qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    var originalText = btn.innerHTML;
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: window.nwipCurrentVariantId, quantity: qty })
    })
      .then(function(r){ return r.json(); })
      .then(function(){
        btn.innerHTML = 'Added &#10003;';
        nwipRefreshShipGauge();
        setTimeout(function(){ btn.innerHTML = originalText; btn.disabled = false; }, 1600);
      })
      .catch(function(){
        btn.innerHTML = originalText;
        btn.disabled = false;
      });
  }

  function nwipRefreshShipGauge(){
    fetch('/cart.js')
      .then(function(r){ return r.json(); })
      .then(function(cart){
        var fill = document.getElementById('nwipShipFill');
        var label = document.getElementById('nwipShipLabel');
        if (!fill || !label) return;
        var threshold = window.nwipShipThreshold || 5000;
        var pct = Math.min(100, (cart.total_price / threshold) * 100);
        fill.style.width = pct + '%';
        if (cart.total_price >= threshold) {
          label.textContent = "You've unlocked free shipping!";
        } else {
          var remaining = ((threshold - cart.total_price) / 100).toFixed(2);
          label.textContent = '$' + remaining + ' away from free shipping';
        }
      })
      .catch(function(){});
  }

  function nwipInitStickyBar(){
    var stickyBar = document.getElementById('nwipStickyAtc');
    var mainAtc = document.getElementById('nwipAtc');
    if (!stickyBar || !mainAtc) return;

    // Reparent to <body> so position:fixed is always relative to the
    // viewport, not a transformed ancestor (a common cause of "fixed"
    // elements getting trapped inside a section wrapper).
    if (stickyBar.parentElement !== document.body) {
      document.body.appendChild(stickyBar);
    }

    function checkVisibility(){
      var rect = mainAtc.getBoundingClientRect();
      var isVisible = rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight);
      if (isVisible) {
        stickyBar.classList.remove('show');
      } else {
        stickyBar.classList.add('show');
      }
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            stickyBar.classList.remove('show');
          } else {
            stickyBar.classList.add('show');
          }
        });
      }, { threshold: 0 });
      obs.observe(mainAtc);
    } else {
      window.addEventListener('scroll', checkVisibility, { passive: true });
      window.addEventListener('resize', checkVisibility);
    }
    checkVisibility();
  }

  (function(){
    nwipRefreshShipGauge();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', nwipInitStickyBar);
    } else {
      nwipInitStickyBar();
    }
  })();
