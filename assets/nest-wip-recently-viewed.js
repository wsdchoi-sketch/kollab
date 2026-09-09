  (function(){
    var KEY = 'nwip_recently_viewed';
    var MAX = 8;
    var root = document.getElementById('nwipRecentlyViewed');
    if (!root) return;

    var current = {
      handle: root.dataset.currentHandle,
      vendor: root.dataset.currentVendor,
      title: root.dataset.currentTitle,
      url: root.dataset.currentUrl,
      image: root.dataset.currentImage,
      price: root.dataset.currentPrice,
      compare: root.dataset.currentCompare
    };

    var list = [];
    try { list = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { list = []; }

    list = list.filter(function(p){ return p.handle !== current.handle; });
    if (current.handle) list.unshift(current);
    list = list.slice(0, MAX);
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}

    var others = list.filter(function(p){ return p.handle !== current.handle; });
    if (others.length === 0) return;

    var grid = document.getElementById('nwipRecentlyViewedGrid');
    others.forEach(function(p){
      var a = document.createElement('a');
      a.className = 'nwip-rv-card';
      a.href = p.url;

      var priceHtml;
      if (p.compare) {
        priceHtml =
          '<div class="price price--on-sale"><dl>' +
          '<div class="price__sale"><dd><span class="price-item price-item--sale">' + p.price + '</span></dd>' +
          '<dd class="price__compare"><span class="price-item price-item--regular">' + p.compare + '</span></dd></div>' +
          '</dl></div>';
      } else {
        priceHtml =
          '<div class="price"><dl><div class="price__regular"><dd><span class="price-item price-item--regular">' + p.price + '</span></dd></div></dl></div>';
      }

      a.innerHTML =
        '<img src="' + p.image + '" alt="' + (p.title || '').replace(/"/g, '&quot;') + '" loading="lazy">' +
        '<div class="vd">' + (p.vendor || '') + '</div>' +
        '<div class="nm">' + p.title + '</div>' +
        priceHtml;
      grid.appendChild(a);
    });

    root.hidden = false;
  })();
