(function(){
  function init(){
    var root=document.querySelector('.kmz'); if(!root||root.dataset.kmInit) return; root.dataset.kmInit='1';
    var $=function(s){return root.querySelector(s)}, $$=function(s){return [].slice.call(root.querySelectorAll(s))};
    var PATHS={"Short Square": "M14 126 V46 Q14 30 30 30 H70 Q86 30 86 46 V126 Q50 142 14 126 Z", "Regular Square": "M14 126 V18 Q14 4 28 4 H72 Q86 4 86 18 V126 Q50 142 14 126 Z", "Almond": "M14 126 V66 C14 28 36 4 50 4 C64 4 86 28 86 66 V126 Q50 142 14 126 Z", "Coffin": "M14 126 V60 L30 8 Q32 4 36 4 H64 Q68 4 70 8 L86 60 V126 Q50 142 14 126 Z", "Oval": "M14 126 V56 C14 24 30 6 50 6 C70 6 86 24 86 56 V126 Q50 142 14 126 Z", "Ballerina": "M14 126 V60 L30 8 Q32 4 36 4 H64 Q68 4 70 8 L86 60 V126 Q50 142 14 126 Z", "Round Stiletto": "M16 126 V74 C16 36 44 10 50 2 C56 10 84 36 84 74 V126 Q50 142 16 126 Z"}, SIMILAR=[["Almond", "Ginger Mellow"], ["Regular Square", "Rooibos Tea"], ["Coffin", "Faded Brown"], ["Almond", "Cozy Sand"]], FALLBACK={};
    var myHandle=root.dataset.handle, myShape=root.dataset.shape||'Almond', myDesign=root.dataset.design||'';

    function burst(x,y){var n=3+Math.floor(Math.random()*2);for(var i=0;i<n;i++){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 48 48');s.setAttribute('class','kmz-pop');var a=Math.random()*Math.PI*2,d=40+Math.random()*60;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d-20+'px');s.style.animationDelay=(i*40)+'ms';s.innerHTML='<path d="M24 2 28 20 46 24 28 28 24 46 20 28 2 24 20 20Z" fill="'+(i%2?'#c9c9c9':'#9d9d9d')+'" stroke="#6f6f6f" stroke-width="1"/>';document.body.appendChild(s);(function(el){setTimeout(function(){el.remove()},900)})(s)}}
    $$('#km-bundle,.tk .go').forEach(function(el){var last=0;
      el.addEventListener('mouseenter',function(e){burst(e.clientX,e.clientY)});
      el.addEventListener('mousemove',function(e){var t=Date.now();if(t-last>260){last=t;burst(e.clientX,e.clientY)}});
      el.addEventListener('touchstart',function(e){var t=e.touches[0];burst(t.clientX,t.clientY)},{passive:true});
    });

    var slides=$$('#km-main .slide'), thumbs=$$('#km-thumbs button');
    thumbs.forEach(function(b,i){b.addEventListener('click',function(){slides.forEach(function(m,j){m.classList.toggle('on',i===j)});thumbs.forEach(function(x,j){x.classList.toggle('on',i===j)})})});
    var q=$('#km-q');function setQ(d){if(!q)return;q.value=Math.max(1,(parseInt(q.value,10)||1)+d)}
    var up=$('#km-up'),dn=$('#km-down');if(up)up.addEventListener('click',function(){setQ(1)});if(dn)dn.addEventListener('click',function(){setQ(-1)});
    var buy=$('#km-buy');
    if(buy)buy.addEventListener('click',function(){buy.disabled=true;
      fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({id:buy.dataset.variant,quantity:parseInt(q.value,10)||1})})
        .then(function(r){return r.json()}).then(function(r){if(r.status){buy.disabled=false;return}window.location.href='/checkout'}).catch(function(){buy.disabled=false})});
    var st=$('#km-sticky'),form=document.getElementById('km-form');
    if(st&&form)st.addEventListener('click',function(){if(form.requestSubmit)form.requestSubmit();else form.submit()});

    /* ---- celebrity tape + carousel ---- */
    var trk=$('#km-trk');
    if(trk){var items=(trk.dataset.items||'').split('|').map(function(s){return s.trim()}).filter(Boolean);if(!items.length)items=['Loved by Korean celebrities'];var h='';for(var k=0;k<2;k++)items.forEach(function(x){h+='<span><svg aria-hidden="true"><use href="#km-star" fill="#fff"/></svg>'+x+'</span>'});trk.innerHTML=h}
    $$('[data-km-scroll]').forEach(function(b){b.addEventListener('click',function(){var el=$('#km-pcs');if(el)el.scrollBy({left:parseInt(b.dataset.kmScroll,10)*250,behavior:'smooth'})})});

    /* ---- five-step demo ---- */
    var tank=$('#km-tank'),num=$('#km-num'),cap=$('#km-cap'),play=$('#km-play'),hint=$('#km-hint'),bar2=$('#km-bar2');
    if(tank&&play){
      var stepEls=$$('#km-steps .step');
      var G={nat:$('#km-nat'),res:$('#km-res'),fit:$('#km-fit'),pad:$('#km-pad'),file:$('#km-file'),dust:$('#km-dust'),sizes:$('#km-sizes'),lbl:$('#km-lbl'),tip:$('#km-tip'),film:$('#km-film'),hand5:$('#km-hand5'),finger:$('#km-gFinger')};
      var CAPS=['Step 1 · <i>wipe</i>','Step 2 · <i>trim</i>','Step 3 · <i>size</i>','Step 4 · <i>peel and press</i>','Step 5 · <i>show off</i>'],DUR=[4000,4000,4000,5000,3000];
      var NAIL='M14 126 V66 C14 28 36 4 50 4 C64 4 86 28 86 66 V126 Q50 142 14 126 Z';
      (function(){var ws=[56,64,72,80,88],h='';for(var i=0;i<5;i++){var cx=48+i*76;h+='<g class="sz" style="transform-origin:'+cx+'px 78px"><path d="'+NAIL+'" transform="translate('+(cx-ws[i]/2)+' 40) scale('+(ws[i]/100)+' .55)" fill="url(#km-amb)" stroke="#fff" stroke-width="2.5"/></g>'}G.sizes.innerHTML=h})();
      var szEls=[].slice.call(G.sizes.querySelectorAll('.sz'));
      function setNail(top){G.nat.setAttribute('d','M150 335V'+(top+44)+'C150 '+top+' 250 '+top+' 250 '+(top+44)+'V335Q200 352 150 335Z')}
      function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
      function cl(v){return Math.max(0,Math.min(1,v))}
      function op(el,v){el.setAttribute('opacity',v)}
      function show(keys){['finger','pad','file','dust','sizes','lbl','tip','hand5'].forEach(function(k){op(G[k],keys.indexOf(k)>=0?1:0)})}
      var bursted={};
      var DRAW=[
       function(p){show(['finger','pad']);setNail(128);op(G.res,1-cl((p-.25)/.6));op(G.fit,0);var x=200+72*Math.sin(p*Math.PI*3),y=250+14*Math.sin(p*Math.PI*6),r=-10*Math.cos(p*Math.PI*3);G.pad.setAttribute('transform','translate('+x+' '+y+') rotate('+r+')')},
       function(p){show(['finger','file','dust']);op(G.res,0);var top=128+36*cl(p*1.15);setNail(top);var x=200+80*Math.sin(p*Math.PI*4);G.file.setAttribute('transform','translate('+x+' '+(top-14)+') rotate(-4)');op(G.dust,(.4+.6*Math.abs(Math.sin(p*Math.PI*8)))*(p<.9?1:0));G.dust.setAttribute('transform','translate(0 '+(top-130)+')')},
       function(p){show(['finger','sizes','lbl']);setNail(164);op(G.res,0);var scan=p<.65,idx=scan?Math.min(4,Math.floor(p/.65*5)):2;szEls.forEach(function(e,i){var on=i===idx;e.style.transform=on?'scale(1.25)':'scale(1)';e.firstChild.setAttribute('stroke',on?'#E3001B':'#fff');op(e,scan?1:(on?1:.25))});op(G.fit,scan?0:cl((p-.65)/.2));G.lbl.textContent=scan?'FINDING YOUR SIZE':'SLIGHTLY SMALLER THAN YOUR NAIL';op(G.lbl,scan?.7:1)},
       function(p){show(['finger','tip']);setNail(164);op(G.res,0);op(G.fit,0);var a=cl(p/.38),b=cl((p-.38)/.32),c=cl((p-.7)/.3);G.film.style.transform='rotate('+(-22*ease(a))+'deg) translate('+(-8*a)+'px,'+(90*ease(a))+'px)';op(G.film,1-a);var dy=-150*(1-ease(b)),sc=1-.05*Math.sin(c*Math.PI);G.tip.setAttribute('transform','translate(200 '+(310+dy)+') scale('+sc+') translate(-200 -310)');if(c>0&&c<1){num.textContent=String(3-Math.min(2,Math.floor(c*3)));num.classList.add('show')}else{num.classList.remove('show')}},
       function(p){show(['hand5']);op(G.res,0);G.hand5.style.transform='rotate('+(5*Math.sin(p*Math.PI*2))+'deg) scale('+(1+.04*Math.sin(p*Math.PI))+')';[.15,.45,.75].forEach(function(t,i){if(p>=t&&!bursted[i]){bursted[i]=1;var r=tank.getBoundingClientRect();burst(r.left+r.width*(.25+.25*i),r.top+r.height*.45)}})}
      ];
      var si=0,sp=0,holding=false,raf=0,last=0,finished=false;
      function render(){DRAW[si](sp);cap.innerHTML=finished?'Done · <i>five steps, one hand</i>':CAPS[si];bar2.style.width=((si+sp)/5*100)+'%';stepEls.forEach(function(e,i){e.classList.toggle('on',i===si);e.classList.toggle('dim',i>si);e.querySelector('.pb i').style.width=(i<si?100:i===si?sp*100:0)+'%'});if(si!==4)num.classList.remove('show')}
      function goto(i){si=i;sp=0;finished=false;bursted={};render()}
      function loop(now){if(!holding)return;var dt=Math.min(60,now-last);last=now;sp+=dt/DUR[si];if(sp>=1){if(si<4){si++;sp=0;bursted={}}else{sp=1;finished=true;holding=false;tank.classList.remove('holding');play.firstElementChild.textContent='Start over';hint.textContent='That is the whole routine. Hold again to replay from step 1.';render();return}}render();raf=requestAnimationFrame(loop)}
      function startHold(){if(finished){goto(0);play.firstElementChild.textContent='Hold to play'}if(holding)return;holding=true;tank.classList.add('holding');last=performance.now();raf=requestAnimationFrame(loop)}
      function endHold(){if(!holding)return;holding=false;tank.classList.remove('holding');cancelAnimationFrame(raf);if(!finished){cap.innerHTML=CAPS[si].replace('<i>','<i>paused · ')}}
      [tank,play].forEach(function(el){el.addEventListener('pointerdown',function(e){e.preventDefault();try{el.setPointerCapture(e.pointerId)}catch(_){}startHold()});['pointerup','pointercancel','lostpointercapture'].forEach(function(t){el.addEventListener(t,endHold)});el.addEventListener('contextmenu',function(e){e.preventDefault()})});
      play.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();startHold()}});
      play.addEventListener('keyup',function(e){if(e.key===' '||e.key==='Enter')endHold()});
      stepEls.forEach(function(e,i){e.addEventListener('click',function(){endHold();goto(i);play.firstElementChild.textContent='Hold to play'})});
      render();
    }

    /* ---- shape grid + picks (live from the MUZMAK collection) ---- */
    var ORDER=['Short Square','Regular Square','Almond','Coffin','Oval','Ballerina','Round Stiletto'];
    var SHAPES={},curShape=myShape in PATHS?myShape:'Almond',mode='shape';
    function tone(name){var h=0;for(var i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))>>>0;var hue=h%360;return 'hsl('+hue+' 45% 78%)'}
    function parse(p){var t=p.title||'';if(t.indexOf('(')<0||!/nail tips/i.test(t)&&!/\]/.test(t))return null;var shape=t.split('(').pop().split(')')[0].trim();if(shape==='Regular')shape='Regular Square';if(shape==='Short')shape='Short Square';if(!PATHS[shape])return null;var name=t.split('(')[0];if(name.indexOf(']')>=0)name=name.split(']').pop();if(name.indexOf(' in ')>=0)name=name.split(' in ').pop();name=name.trim();var v=(p.variants||[])[0]||{};var price=parseFloat(v.price||'0');var img=(p.images&&p.images[0])?p.images[0].src:'';if(img)img=img.replace(/(\.[a-z]+)(\?|$)/i,'_400x$1$2');return {n:name,h:'/products/'+p.handle,handle:p.handle,img:img,p:price,c:tone(name),shape:shape,avail:v.available!==false}}
    function load(){var coll=root.dataset.collection||'muzmak';return fetch('/collections/'+coll+'/products.json?limit=250',{headers:{'Accept':'application/json'}}).then(function(r){return r.json()}).then(function(j){var out={};(j.products||[]).forEach(function(p){var d=parse(p);if(!d)return;(out[d.shape]=out[d.shape]||[]).push(d)});if(!Object.keys(out).length)throw new Error('empty');return out}).catch(function(){return FALLBACK})}
    function fmt(p){return '$'+(p%1?p.toFixed(2):p)}
    function tile(d,shape,idx,big){var id='kmt'+shape.replace(/\W/g,'')+idx+(big?'b':'');var me=d.handle===myHandle;
      return '<a class="tile'+(me?' me':'')+'" href="'+d.h+'" style="--d:'+(idx*35)+'ms"><svg viewBox="0 0 100 150" aria-hidden="true"><defs><clipPath id="'+id+'"><path d="'+PATHS[shape]+'"/></clipPath></defs><g clip-path="url(#'+id+')"><rect width="100" height="150" fill="'+d.c+'"/>'+(d.img?'<image href="'+d.img+'" width="100" height="150" preserveAspectRatio="xMidYMid slice"/>':'')+'</g><path class="ol" d="'+PATHS[shape]+'"/></svg><b>'+d.n+'</b>'+(big?'<span class="shp">'+shape+'</span>':'')+'<small>'+fmt(d.p)+'</small></a>'}
    function fixImgs(){$$('.tile image').forEach(function(im){im.addEventListener('error',function(){im.remove()})})}
    function renderShapes(){var el=$('#km-shapes');if(!el)return;el.innerHTML=ORDER.filter(function(s){return (SHAPES[s]||[]).length}).map(function(s){return '<button type="button" class="sh'+(s===curShape?' on':'')+'" data-s="'+s+'"><svg class="kstar" aria-hidden="true"><use href="#km-star" fill="#E3001B"/></svg>'+s+'<small>'+SHAPES[s].length+'</small></button>'}).join('');
      $$('#km-shapes .sh').forEach(function(b){b.addEventListener('click',function(){curShape=b.dataset.s;renderShapes();renderGrid();renderPicks()})})}
    function renderGrid(){var l=SHAPES[curShape]||[];var c=$('#km-shcount'),g=$('#km-dgrid');if(!g)return;c.innerHTML='<em>'+curShape+'</em> · '+l.length+(l.length===1?' design':' designs');g.innerHTML=l.map(function(d,i){return tile(d,curShape,i,false)}).join('');fixImgs()}
    function renderPicks(){var g=$('#km-pgrid');if(!g)return;var out=[],why='';
      if(mode==='shape'){out=(SHAPES[curShape]||[]).filter(function(d){return d.handle!==myHandle}).slice(0,4).map(function(d){return [curShape,d]});why='Because you picked '+curShape+' above. Change the shape and this row follows.'}
      else{SIMILAR.forEach(function(s){var d=(SHAPES[s[0]]||[]).filter(function(x){return x.n===s[1]&&x.handle!==myHandle})[0];if(d)out.push([s[0],d])});if(out.length<4){var pool=[];ORDER.forEach(function(s){(SHAPES[s]||[]).forEach(function(d){if(d.handle!==myHandle&&!out.some(function(o){return o[1].handle===d.handle}))pool.push([s,d])})});while(out.length<4&&pool.length)out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])}why='Warm, soft gradients in the spirit of '+(myDesign||'this design')+', whatever the length.'}
      $('#km-why').textContent=why;g.innerHTML=out.map(function(o,i){return tile(o[1],o[0],i,true)}).join('');fixImgs()}
    $$('#km-modes button').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.m;$$('#km-modes button').forEach(function(x){x.classList.toggle('on',x===b)});renderPicks()})});
    if($('#km-shapes')){load().then(function(d){SHAPES=d;if(!SHAPES[curShape])curShape=ORDER.filter(function(s){return SHAPES[s]})[0]||'Almond';renderShapes();renderGrid();renderPicks()})}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  document.addEventListener('shopify:section:load',init);
})();