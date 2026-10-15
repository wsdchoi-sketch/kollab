(function(){
function init(){
var root=document.querySelector('.kdm');if(!root||root.getAttribute('data-ready'))return;root.setAttribute('data-ready','1');
function $(s){return root.querySelector(s)}function $$(s){return [].slice.call(root.querySelectorAll(s))}
function fmt(c){var v=Math.round(c)/100;return '$'+(v%1?v.toFixed(2):v)}
var VARS=[];try{VARS=JSON.parse(($('#kd-vars')||{}).textContent||'[]')}catch(e){}
function burst(x,y){var n=3+Math.floor(Math.random()*2);for(var i=0;i<n;i++){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 48 48');s.setAttribute('class','kdm-pop');var a=Math.random()*Math.PI*2,d=40+Math.random()*60;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d-20+'px');s.style.animationDelay=(i*40)+'ms';s.innerHTML='<path d="M24 2 28 20 46 24 28 28 24 46 20 28 2 24 20 20Z" fill="'+(i%2?'#c9c9c9':'#9d9d9d')+'" stroke="#6f6f6f" stroke-width="1"/>';document.body.appendChild(s);(function(el){setTimeout(function(){el.remove()},900)})(s)}}
$$('#kd-bundle,#kd-wbox,.tk .go,.req').forEach(function(el){var last=0;el.addEventListener('mouseenter',function(e){burst(e.clientX,e.clientY)});el.addEventListener('mousemove',function(e){var t=Date.now();if(t-last>260){last=t;burst(e.clientX,e.clientY)}});el.addEventListener('touchstart',function(e){var t=e.touches[0];burst(t.clientX,t.clientY)},{passive:true})});

/* gallery */
var imgs=$$('#kd-main img'),th=$$('#kd-thumbs button');
function show(i){imgs.forEach(function(m,j){m.classList.toggle('on',i===j)});th.forEach(function(x,j){x.classList.toggle('on',i===j)})}
if(imgs.length&&!$('#kd-main img.on'))show(0);
th.forEach(function(b,i){b.addEventListener('click',function(){show(i)})});
function showMedia(id){if(!id)return;for(var i=0;i<imgs.length;i++){if(imgs[i].getAttribute('data-mid')===String(id)){show(i);return}}}

/* variant + price */
var form=document.getElementById('kd-form'),idIn=form?form.querySelector('input[name="id"]'):null,q=$('#kd-q'),cur=null;
function find(id){for(var i=0;i<VARS.length;i++){if(String(VARS[i].id)===String(id))return VARS[i]}return null}
function qn(){return q?Math.max(1,parseInt(q.value,10)||1):1}
function paint(){if(!cur)return;var n=qn(),now=$('#kd-now'),was=$('#kd-was'),off=$('#kd-off'),lbl=$('#kd-lbl');
 if(now)now.textContent=fmt(cur.p);
 if(was&&off){if(cur.c>cur.p){was.hidden=false;was.textContent=fmt(cur.c);off.hidden=false;off.textContent='-'+Math.round((1-cur.p/cur.c)*100)+'%'}else{was.hidden=true;off.hidden=true}}
 if(lbl&&root.getAttribute('data-multi')==='1')lbl.textContent=cur.t;
 var t=fmt(cur.p*n);['#kd-atcp','#kd-stp'].forEach(function(s){var e=$(s);if(e)e.textContent=t});
 var atc=$('#kd-atc'),buy=$('#kd-buy'),st=$('#kd-sticky');
 if(atc){atc.disabled=!cur.a;var l=atc.querySelector('.l');if(l)l.textContent=cur.a?'Add to bag':'Sold out'}
 if(buy){buy.disabled=!cur.a;buy.setAttribute('data-variant',cur.id)}
 if(st){st.disabled=!cur.a;var sl=st.querySelector('span');if(sl)sl.textContent=cur.a?'Add to bag':'Sold out'}}
function strOf(v){var m=(v&&v.t||'').match(/(\d+)\s*%/);return m?m[1]:null}
function select(id,from){var v=find(id);if(!v)return;cur=v;if(idIn)idIn.value=v.id;
 $$('#kd-str button,#kd-vpick button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-id')===String(v.id))});
 showMedia(v.m);paint();var sv=strOf(v);if(sv){var pf=$('#kd-pf');if(pf)pf.textContent=sv+'%';if(from!=='wall'&&wall)wall.set(sv)}
 if(from){try{var u=new URL(window.location.href);u.searchParams.set('variant',v.id);history.replaceState(null,'',u.toString())}catch(e){}}}
$$('#kd-str button,#kd-vpick button').forEach(function(b){b.addEventListener('click',function(){select(b.getAttribute('data-id'),'ui')})});
if(q){var up=$('#kd-up'),dn=$('#kd-down');function setQ(d){q.value=Math.max(1,qn()+d);paint()}if(up)up.addEventListener('click',function(){setQ(1)});if(dn)dn.addEventListener('click',function(){setQ(-1)});q.addEventListener('change',paint)}
var buy=$('#kd-buy');
if(buy)buy.addEventListener('click',function(){buy.disabled=true;fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({id:buy.getAttribute('data-variant'),quantity:qn()})}).then(function(r){return r.json()}).then(function(r){if(r.status){buy.disabled=false;return}window.location.href='/checkout'}).catch(function(){buy.disabled=false})});
var stb=$('#kd-sticky');if(stb&&form)stb.addEventListener('click',function(){if(form.requestSubmit)form.requestSubmit();else form.submit()});
/* add to bag: the theme's product-form handler crashes here (undefined cart-drawer), so handle it and open the KOLLAB cart drawer */
function openBag(res){var dr=document.querySelector('[data-kollab-cart-drawer]'),ob=document.querySelector('[data-kollab-cart-open]');if(dr&&ob){ob.click();return}var cd=document.querySelector('cart-drawer');if(cd&&typeof cd.renderContents==='function'&&res&&res.sections){cd.renderContents(res);return}window.location.href='/cart'}
function flash(btn,txt){if(!btn)return;var l=btn.querySelector('.l')||btn.querySelector('span');if(!l)return;var o=l.textContent;l.textContent=txt;setTimeout(function(){l.textContent=o},1800)}
if(form){var pfe=form.closest('product-form')||form;pfe.addEventListener('submit',function(e){if(e.target!==form)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 var atc=$('#kd-atc'),err=root.querySelector('.product-form__error-message-wrapper');if(atc&&atc.disabled)return;if(err)err.hidden=true;if(atc)atc.setAttribute('aria-busy','true');
 fetch('/cart/add.js',{method:'POST',headers:{'Accept':'application/json','X-Requested-With':'XMLHttpRequest'},body:new FormData(form)}).then(function(r){return r.json()}).then(function(res){if(atc)atc.removeAttribute('aria-busy');
  if(res.status){if(err){err.hidden=false;var m=err.querySelector('.product-form__error-message');if(m)m.textContent=res.description||res.message||'Could not add'}return}
  flash(atc,'Added ✓');openBag(res)}).catch(function(){if(atc)atc.removeAttribute('aria-busy')})},true)}
(function(){var st=document.createElement('style');st.textContent='.kdm .cta[disabled],.kdm .cta2[disabled]{opacity:.45;cursor:not-allowed}.kdm .cta[aria-busy]{opacity:.7}.kdm .product-form__error-message-wrapper{grid-column:1/-1;font-size:13px;color:var(--red);font-weight:700}';document.head.appendChild(st)})();

/* barrier wall (panthenol only) */
var wall=null,wbox=$('#kd-wbox');
if(wbox){(function(){
 var drops=$('#kd-drops'),cracks=$$('#kd-cracks path'),bricksEl=$$('#kd-bricks rect'),steam=$('#kd-steam'),mortar=$('#kd-mortar'),benEls=$$('#kd-ben2>div'),st=$('#kd-strand');
 var level=0,need=5,wv='30',busy=false;
 var HINT={'30':'30% pours like syrup: a big, slow drop that clings to the dropper, then sits and seals. Fewer drops do the job.','10':'10% is light: small, quick drops that splash and sink in fast, with no sticky feel. It takes a few more.'};
 var TEX={'30':{t:'Rich, syrup-like',b1:85,b2:45,s2:'Takes a moment',f:'A slight tack is normal'},'10':{t:'Light, fast-absorbing',b1:35,b2:90,s2:'Sinks in fast',f:'Non-sticky'}};
 function txt(s,v){var e=$(s);if(e)e.textContent=v}
 function paintW(){var p=Math.min(1,level/need);txt('#kd-wpct',Math.round(p*100)+'%');
  cracks.forEach(function(c,i){c.style.transition='opacity .6s';c.style.opacity=(i/cracks.length)<p?0:1});
  mortar.setAttribute('fill',p>0?'url(#kd-lav)':'#3a3a3a');mortar.style.opacity=p>0?(.35+.65*p):1;
  bricksEl.forEach(function(b,i){b.style.transition='fill .6s';b.setAttribute('fill',(i%7)/7<p?'#FFFFFF':'#EDEDEB')});
  var k=Math.min(4,Math.ceil(p*4));benEls.forEach(function(e,i){e.classList.toggle('on',i<k)});
  txt('#kd-wlbl',p>=1?'SEALED · NOW LOCK IT IN WITH A CREAM':(p>0?'FEWER CRACKS, LESS WATER LOST':'WATER ESCAPING THROUGH THE CRACKS'));
  txt('#kd-wtap',p>=1?'Sealed ✓':'Tap to add a drop');wbox.classList.toggle('done',p>=1)}
 function set(v){if(v!=='10')v='30';wv=v;need=v==='30'?5:8;$('#kd-dp30').setAttribute('opacity',v==='30'?1:0);$('#kd-dp10').setAttribute('opacity',v==='10'?1:0);txt('#kd-whint',HINT[v]);
  var T=TEX[v];txt('#kd-txt',T.t);$('#kd-txb1').style.width=T.b1+'%';$('#kd-txb2').style.width=T.b2+'%';txt('#kd-txs2',T.s2);txt('#kd-txf',T.f);
  $$('#kd-wsw button[data-v]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===v)});level=Math.min(level,need);paintW()}
 function mk(tag,a){var e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(var k in a)e.setAttribute(k,a[k]);drops.appendChild(e);return e}
 function anim(ms,fn,done){var t0=performance.now();(function f(now){var t=Math.min(1,(now-t0)/ms);fn(t);if(t<1)requestAnimationFrame(f);else if(done)done()})(t0)}
 var DROP='M0 -14c6 8 9 13 9 17a9 9 0 0 1-18 0c0-4 3-9 9-17z';
 function landed(){level++;paintW();if(level>=need){var b=wbox.getBoundingClientRect();burst(b.left+b.width*.3,b.top+b.height*.45);burst(b.left+b.width*.7,b.top+b.height*.4)}busy=false}
 function addDrop(ev){if(level>=need||busy)return;busy=true;var r=wbox.getBoundingClientRect(),x=200;
  if(ev&&ev.clientX){x=Math.max(40,Math.min(360,(ev.clientX-r.left)/r.width*400))}
  var tipY=64,y1=136+Math.random()*16,rich=wv==='30';
  var bead=mk('path',{d:DROP,fill:rich?'url(#kd-lav30)':'url(#kd-lav10)',stroke:'#fff','stroke-width':rich?1.4:1,'fill-opacity':rich?1:.85});
  if(rich){
   anim(650,function(t){var sc=.35+t,dy=34*t*t;bead.setAttribute('transform','translate(200 '+(tipY+dy)+') scale('+sc+')');st.setAttribute('d','M200 '+tipY+' L200 '+(tipY+dy-10*sc));st.setAttribute('opacity',1);st.setAttribute('stroke-width',5-2*t)},function(){
    var sx=200,sy=tipY+34;
    anim(820,function(t){var e=t*t*(3-2*t),cx=sx+(x-sx)*e,cy=sy+(y1-sy)*t*t;bead.setAttribute('transform','translate('+cx+' '+cy+') scale(1.35,'+(1.35+.25*Math.sin(t*3.14))+')');var tail=Math.max(0,1-t*1.6);st.setAttribute('d','M'+sx+' '+tipY+' Q'+sx+' '+(sy+20)+' '+cx+' '+(cy-12));st.setAttribute('opacity',tail);st.setAttribute('stroke-width',3*tail+.4)},function(){
     st.setAttribute('opacity',0);bead.remove();
     var pool=mk('ellipse',{cx:x,cy:y1+8,rx:2,ry:1,fill:'url(#kd-lav30)',stroke:'#fff','stroke-width':1}),gl=mk('ellipse',{cx:x-6,cy:y1+5,rx:1,ry:1,fill:'#fff',opacity:.7});
     anim(700,function(t){var e=1-Math.pow(1-t,3);pool.setAttribute('rx',4+24*e);pool.setAttribute('ry',2+6*e);gl.setAttribute('rx',2+6*e);gl.setAttribute('ry',1+1.6*e)},function(){
      landed();setTimeout(function(){anim(900,function(t){pool.setAttribute('opacity',1-t);gl.setAttribute('opacity',.7*(1-t))},function(){pool.remove();gl.remove()})},700)})})})
  }else{
   anim(160,function(t){bead.setAttribute('transform','translate(200 '+(tipY+6*t)+') scale('+(.3+.5*t)+')')},function(){
    var sx=200,sy=tipY+6;
    anim(400,function(t){var cx=sx+(x-sx)*t,cy=sy+(y1-sy)*t*t;bead.setAttribute('transform','translate('+cx+' '+cy+') scale(.8,'+(.8+.15*t)+')')},function(){
     bead.remove();landed();
     var ring=mk('ellipse',{cx:x,cy:y1+6,rx:2,ry:1,fill:'none',stroke:'#E6DEFA','stroke-width':2});
     var dots=[0,1,2,3].map(function(){return mk('circle',{cx:x,cy:y1+4,r:2,fill:'#E6DEFA'})});
     anim(420,function(t){ring.setAttribute('rx',2+16*t);ring.setAttribute('ry',1+4*t);ring.setAttribute('opacity',1-t);dots.forEach(function(d,i){var a=[-2.4,-1.9,-1.2,-.7][i];d.setAttribute('cx',x+Math.cos(a)*22*t*(i%2?1:-1));d.setAttribute('cy',y1+4+Math.sin(a)*14*t+18*t*t);d.setAttribute('opacity',1-t)})},function(){ring.remove();dots.forEach(function(d){d.remove()})})})})
  }}
 function puff(){if(document.hidden)return;var p=Math.min(1,level/need);if(p>=1)return;var live=cracks.filter(function(c){return c.style.opacity!=='0'});if(!live.length)return;
  var c=live[Math.floor(Math.random()*live.length)],bb=c.getBBox();var s=document.createElementNS('http://www.w3.org/2000/svg','circle');
  s.setAttribute('r',3+Math.random()*3);s.setAttribute('fill','#9fd3ff');s.setAttribute('opacity','.85');steam.appendChild(s);
  var x=bb.x+bb.width/2,y=bb.y,t0=performance.now();
  (function upf(now){var t=(now-t0)/1400;if(t>=1){s.remove();return}s.setAttribute('cx',x+8*Math.sin(t*6));s.setAttribute('cy',y-60*t);s.setAttribute('opacity',.85*(1-t));requestAnimationFrame(upf)})(t0)}
 setInterval(puff,260);
 wbox.addEventListener('click',addDrop);
 wbox.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();addDrop()}});
 $$('#kd-wsw button[data-v]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-v');level=0;set(v);
  for(var i=0;i<VARS.length;i++){if(strOf(VARS[i])===v){select(VARS[i].id,'wall');break}}})});
 var re=$('#kd-wre');if(re)re.addEventListener('click',function(){level=0;busy=false;paintW()});
 wall={set:set};set(root.getAttribute('data-pan')||'30');
})()}

cur=find(idIn&&idIn.value)||VARS[0]||null;if(cur){select(cur.id)}

/* serum layer counter */
var ld=$('#kd-ldots');
if(ld){var ln=0,lmax=10;for(var i=0;i<lmax;i++){ld.appendChild(document.createElement('i'))}
 var lt=$('#kd-ltxt');function lPaint(){[].slice.call(ld.children).forEach(function(e,i){e.classList.toggle('f',i<ln)});
  lt.textContent=ln===0?'Tap + to layer':ln<5?ln+(ln===1?' layer':' layers')+' · keep going':ln<=6?ln+' layers · just right for most skin':ln<9?ln+' layers · getting there for dry skin':ln+' layers · dry skin sweet spot'}
 $('#kd-lplus').addEventListener('click',function(){ln=Math.min(lmax,ln+1);lPaint()});$('#kd-lminus').addEventListener('click',function(){ln=Math.max(0,ln-1);lPaint()});lPaint()}

/* bundle: add all three */
var gift=$('#kd-bundle'),gbtn=$('#kd-bundle-add');
if(gift&&gbtn)gbtn.addEventListener('click',function(){var ids=(gift.getAttribute('data-ids')||'').split(',').filter(Boolean);if(!ids.length)return;gbtn.disabled=true;
 var body={items:ids.map(function(id){return{id:id,quantity:1}})};
 fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()}).then(function(res){gbtn.disabled=false;
  if(res.status){var l=gbtn.querySelector('span');if(l){var o=l.textContent;l.textContent=res.description||'Could not add';setTimeout(function(){l.textContent=o},2600)}return}
  flash(gbtn,'Added ✓');openBag(res)}).catch(function(){gbtn.disabled=false})});

/* more rail */
var rail=$('#kd-rail');$$('.mnav button').forEach(function(b){b.addEventListener('click',function(){if(rail)rail.scrollBy({left:(b.getAttribute('data-d')==='-1'?-1:1)*260,behavior:'smooth'})})});

/* recap + creator videos: tap to play */
$$('.rv,.vd').forEach(function(box){var v=box.querySelector('video');if(!v)return;
 box.addEventListener('click',function(e){if(box.classList.contains('playing'))return;e.preventDefault();box.classList.add('playing');v.setAttribute('controls','');v.play()})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
document.addEventListener('shopify:section:load',function(){var r=document.querySelector('.kdm');if(r)r.removeAttribute('data-ready');init()});
})();
