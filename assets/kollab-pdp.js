(function(){
  function init(){
    var root=document.querySelector('.kpdp'); if(!root||root.dataset.kpInit) return; root.dataset.kpInit='1';
    var $=function(s){return root.querySelector(s)}, $$=function(s){return [].slice.call(root.querySelectorAll(s))};

    function burst(x,y){var n=3+Math.floor(Math.random()*2);for(var i=0;i<n;i++){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 48 48');s.setAttribute('class','kpdp-pop');var a=Math.random()*Math.PI*2,d=40+Math.random()*60;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d-20+'px');s.style.animationDelay=(i*40)+'ms';s.innerHTML='<path d="M24 2 28 20 46 24 28 28 24 46 20 28 2 24 20 20Z" fill="'+(i%2?'#c9c9c9':'#9d9d9d')+'" stroke="#6f6f6f" stroke-width="1"/>';document.body.appendChild(s);(function(el){setTimeout(function(){el.remove()},900)})(s)}}
    $$('#kp-bundle,#play,.tk .go').forEach(function(el){var last=0;
      el.addEventListener('mouseenter',function(e){burst(e.clientX,e.clientY)});
      el.addEventListener('mousemove',function(e){var t=Date.now();if(t-last>260){last=t;burst(e.clientX,e.clientY)}});
      el.addEventListener('touchstart',function(e){var t=e.touches[0];burst(t.clientX,t.clientY)},{passive:true});
    });

    var slides=$$('#kp-main .slide'), thumbs=$$('#kp-thumbs button');
    thumbs.forEach(function(b,i){b.addEventListener('click',function(){slides.forEach(function(m,j){m.classList.toggle('on',i===j)});thumbs.forEach(function(x,j){x.classList.toggle('on',i===j)})})});

    var q=$('#kp-q');
    function setQ(d){if(!q)return;q.value=Math.max(1,(parseInt(q.value,10)||1)+d)}
    var up=$('#kp-up'),dn=$('#kp-down');
    if(up)up.addEventListener('click',function(){setQ(1)});
    if(dn)dn.addEventListener('click',function(){setQ(-1)});

    var buy=$('#kp-buy');
    if(buy)buy.addEventListener('click',function(){
      buy.disabled=true;
      fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({id:buy.dataset.variant,quantity:parseInt(q.value,10)||1})})
        .then(function(r){return r.json()}).then(function(r){if(r.status){buy.disabled=false;return}window.location.href='/checkout'})
        .catch(function(){buy.disabled=false});
    });

    var st=$('#kp-sticky'),form=document.getElementById('kp-form');
    if(st&&form)st.addEventListener('click',function(){if(form.requestSubmit)form.requestSubmit();else form.submit()});

    var gift=$('#kp-bundle'),gbtn=$('#kp-bundle-add');
    if(gift&&gbtn)gbtn.addEventListener('click',function(){
      var ids=(gift.dataset.ids||'').split(',').filter(Boolean);if(!ids.length)return;
      gbtn.disabled=true;
      var cart=document.querySelector('cart-drawer');
      var body={items:ids.map(function(id){return{id:id,quantity:1}})};
      if(cart){body.sections='cart-drawer,cart-icon-bubble';body.sections_url=window.location.pathname}
      fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
        .then(function(r){return r.json()})
        .then(function(res){gbtn.disabled=false;if(res.status){alert(res.description||res.message);return}if(cart&&res.sections&&cart.renderContents)cart.renderContents(res);else window.location.href='/cart'})
        .catch(function(){gbtn.disabled=false});
    });

    var tank=$('#tank'),num=$('#num'),cap=$('#cap'),play=$('#play'),steps=$$('#steps .step'),timer=null;
    if(tank&&play){
      for(var i=0;i<34;i++){var b=document.createElement('span');b.className='bub';var s=10+Math.random()*48;b.style.width=b.style.height=s+'px';b.style.left=Math.random()*100+'%';b.style.animationDuration=(6+Math.random()*9)+'s';b.style.animationDelay=(Math.random()*14)+'s';tank.appendChild(b)}
      var setStep=function(k){steps.forEach(function(el,i){el.classList.toggle('dim',i>k)})};
      play.addEventListener('click',function(){
        if(timer){clearInterval(timer);timer=null}
        tank.classList.remove('go');void tank.offsetWidth;tank.classList.add('go');num.classList.remove('done');
        var t=20;num.textContent=t;cap.innerHTML='Foaming · <i>leave it on</i>';play.firstElementChild.textContent='Running';setStep(1);
        timer=setInterval(function(){t--;num.textContent=t;if(t===15)setStep(2);
          if(t<=0){clearInterval(timer);timer=null;num.textContent='0';num.classList.add('done');cap.innerHTML='Done · <i>rinse now</i>';setStep(3);play.firstElementChild.textContent='Run it again';tank.classList.remove('go')}},1000);
      });
    }

    var SKIN={
      oily:{lab:'Oily skin',h:'Your pores will notice first.',p:'PIXALIA™ was made for you. It helps regulate excess sebum while the foam lifts the grime that builds up through the day. Because it rinses off, nothing is left behind to clog.',fit:['Use daily','Morning or night','Pair with Blooming Ampoule'],m:96},
      combo:{lab:'Combination skin',h:'Clean T-zone, calm cheeks.',p:'Foam does the pore work where you are oily, while panthenol and polyglutamic acid keep the drier areas from feeling tight. A balanced first step.',fit:['Use daily','Focus on the T-zone','Follow with Calming Cream'],m:92},
      acne:{lab:'Acne-prone skin',h:'Houttuynia is here for you.',p:'어성초 extract and centella calm active breakouts while PIXALIA™ works on the oil that causes the next ones. No rubbing, so nothing gets irritated further.',fit:['Use 4–5x a week','Skip on open spots','Pair with Calming Cream'],m:90},
      dry:{lab:'Dry skin',h:'Yes, but cushion it.',p:'Rinse-off steps can be drying, so this one leans on polyglutamic acid and panthenol to hold moisture. Use it a few times a week and go straight to a rich cream afterwards.',fit:['Use 2–3x a week','Night only','Follow with Calming Cream'],m:72},
      sens:{lab:'Sensitive skin',h:'Gentle, but test it first.',p:'Centella and panthenol make this friendlier than most foaming products, and twenty seconds is short. Still, patch-test on your jaw and start with ten seconds.',fit:['Patch-test first','Start at 10 seconds','Avoid eye area'],m:64}
    };
    var opts=$$('#opts .opt');
    opts.forEach(function(bt){bt.addEventListener('click',function(){
      opts.forEach(function(x){x.classList.remove('on')});bt.classList.add('on');var d=SKIN[bt.dataset.k];if(!d)return;
      $('#cLab').textContent=d.lab;$('#cH').textContent=d.h;$('#cP').textContent=d.p;
      $('#cFit').innerHTML=d.fit.map(function(f){return '<span>'+f+'</span>'}).join('');
      $('#meter').style.width=d.m+'%';$('#mtv').textContent=d.m+'%';
    })});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  document.addEventListener('shopify:section:load',init);
})();