/* KOLLAB Collection — sort keeps active filters, resets page */
(function(){
  function fit(root){
    (root||document).querySelectorAll('.kc-chips').forEach(function(box){
      if(box.__kcf) return; box.__kcf = 1;
      var first = box.querySelector('.chip'); if(!first) return;
      var h = first.offsetTop + first.offsetHeight + 8;
      if(box.scrollHeight <= h + 4) return;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'kc-more';
      var n = 0; box.querySelectorAll('.chip').forEach(function(c){ if(c.offsetTop > first.offsetTop + 4) n++; });
      function set(open){
        box.classList.toggle('is-collapsed', !open);
        box.style.maxHeight = open ? '' : h + 'px';
        btn.textContent = open ? 'Less \u2212' : '+' + n + ' more';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      var open = box.querySelector('.chip.on') && box.querySelector('.chip.on').offsetTop > first.offsetTop + 4;
      set(!!open);
      btn.addEventListener('click', function(){ set(box.classList.contains('is-collapsed')); });
      box.parentNode.insertBefore(btn, box.nextSibling);
    });
  }
  function bind(root){
    fit(root);
    (root||document).querySelectorAll('[data-kc-sort]').forEach(function(sel){
      if(sel.__kc) return; sel.__kc = 1;
      sel.addEventListener('change', function(){
        var u = new URL(location.href);
        u.searchParams.set('sort_by', sel.value);
        u.searchParams.delete('page');
        u.hash = 'kc-grid';
        location.href = u.toString();
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ bind(); });
  else bind();
  document.addEventListener('shopify:section:load', function(e){ bind(e.target); });
})();
