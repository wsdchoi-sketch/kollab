/* KOLLAB Collection — sort keeps active filters, resets page */
(function(){
  function bind(root){
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
