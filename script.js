(function(){
  var z=10,wins=document.querySelectorAll('.win');
  function dockState(){document.querySelectorAll('.dk').forEach(function(d){var w=document.getElementById(d.dataset.open);d.classList.toggle('on',w.classList.contains('open'))})}
  function front(w){w.style.zIndex=++z}
  function open(id){var w=document.getElementById(id);w.classList.add('open');front(w);dockState()}
  document.addEventListener('click',function(e){
    var o=e.target.closest('[data-open]');if(o)open(o.dataset.open);
    var c=e.target.closest('[data-close]');if(c){c.closest('.win').classList.remove('open');dockState()}
    var zm=e.target.closest('[data-zoom]');if(zm){var w=zm.closest('.win');w.classList.toggle('big');
      if(w.classList.contains('big')){w._s=w.style.cssText;w.style.cssText+=';left:16px;top:36px;width:calc(100vw - 32px);height:calc(100% - 120px)'}else{w.style.cssText=w._s||''}}
  });
  wins.forEach(function(w){
    w.addEventListener('pointerdown',function(){front(w)});
    var t=w.querySelector('.title'),sx,sy,ox,oy,drag=false;
    t.addEventListener('pointerdown',function(e){if(e.target.closest('.dot')||window.innerWidth<=640)return;drag=true;sx=e.clientX;sy=e.clientY;ox=w.offsetLeft;oy=w.offsetTop;t.setPointerCapture(e.pointerId);t.style.cursor='grabbing'});
    t.addEventListener('pointermove',function(e){if(!drag)return;w.style.left=ox+e.clientX-sx+'px';w.style.top=Math.max(0,oy+e.clientY-sy)+'px'});
    t.addEventListener('pointerup',function(){drag=false;t.style.cursor=''});
  });
  function hm(d){return String(d.getHours()).padStart(2,'0')+'.'+String(d.getMinutes()).padStart(2,'0')}
  var MINW=300,MINH=200,TOP=28;
  wins.forEach(function(w){
    ['n','s','e','w','ne','nw','se','sw'].forEach(function(d){
      var h=document.createElement('div');h.className='rz';h.dataset.d=d;w.appendChild(h);
      var sx,sy,ol,ot,ow,oh,on=false;
      h.addEventListener('pointerdown',function(e){
        if(innerWidth<=640)return;
        e.preventDefault();e.stopPropagation();front(w);
        if(w.classList.contains('big')){w.classList.remove('big');w._s=''}
        on=true;sx=e.clientX;sy=e.clientY;ol=w.offsetLeft;ot=w.offsetTop;ow=w.offsetWidth;oh=w.offsetHeight;
        h.setPointerCapture(e.pointerId);document.body.classList.add('resizing');
      });
      h.addEventListener('pointermove',function(e){
        if(!on)return;var dx=e.clientX-sx,dy=e.clientY-sy,l=ol,t=ot,wd=ow,ht=oh;
        if(d.indexOf('e')>-1)wd=Math.min(Math.max(MINW,ow+dx),innerWidth-ol);
        if(d.indexOf('w')>-1){l=Math.min(Math.max(0,ol+dx),ol+ow-MINW);wd=ol+ow-l}
        if(d.indexOf('s')>-1)ht=Math.min(Math.max(MINH,oh+dy),innerHeight-ot);
        if(d.indexOf('n')>-1){t=Math.min(Math.max(TOP,ot+dy),ot+oh-MINH);ht=ot+oh-t}
        var st=w.style;st.left=l+'px';st.top=t+'px';st.width=wd+'px';st.height=ht+'px';
      });
      function end(){if(on){on=false;document.body.classList.remove('resizing')}}
      h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
    });
    w.querySelector('.title').addEventListener('dblclick',function(e){
      if(e.target.closest('.dot'))return;var z=w.querySelector('[data-zoom]');if(z)z.click();
    });
  });
  function tick(){var d=new Date();document.getElementById('clock').textContent=d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})+'  '+hm(d)}
  tick();setInterval(tick,1000);
  var th=document.getElementById('theme'),pop=document.getElementById('pop'),root=document.documentElement;
  function setTheme(t){if(t==='auto')delete root.dataset.theme;else root.dataset.theme=t;pop.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.t===t))});try{localStorage.setItem('theme',t)}catch(e){}}
  var saved='auto';try{saved=localStorage.getItem('theme')||'auto'}catch(e){}
  setTheme(saved);
  th.addEventListener('click',function(e){e.stopPropagation();pop.classList.toggle('show')});
  th.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pop.classList.toggle('show')}});
  pop.addEventListener('click',function(e){e.stopPropagation();var b=e.target.closest('button');if(b){setTheme(b.dataset.t);pop.classList.remove('show')}});
  document.addEventListener('click',function(){pop.classList.remove('show')});
  var cv=document.getElementById('bg'),cx=cv.getContext('2d'),W,H,blobs=[],px=-1,py=-1,gx=0,gy=0,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){W=cv.width=innerWidth;H=cv.height=innerHeight}size();addEventListener('resize',size);
  function glow(x,y,r,a,h){var g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'hsla('+h+',90%,60%,'+a+')');g.addColorStop(1,'hsla('+h+',90%,60%,0)');cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2)}
  function hueAt(x,y){return(x/W*240+y/H*120+performance.now()/40)%360}
  function add(x,y,r,a){blobs.push({x:x,y:y,r:r,a:a,h:hueAt(x,y)});if(blobs.length>70)blobs.shift()}
  addEventListener('pointermove',function(e){var x=e.clientX,y=e.clientY;if(px>=0){var d=Math.hypot(x-px,y-py);if(d>14)add(x,y,90+Math.min(d,80),.5)}else{gx=x;gy=y}px=x;py=y});
  addEventListener('pointerdown',function(e){px=gx=e.clientX;py=gy=e.clientY;for(var i=0;i<6;i++)add(px+(Math.random()-.5)*60,py+(Math.random()-.5)*60,140,.55)});
  addEventListener('pointerup',function(e){if(e.pointerType==='touch')px=-1});
  document.addEventListener('mouseleave',function(){px=-1});
  function frame(){cx.clearRect(0,0,W,H);
    if(px>=0){gx+=(px-gx)*.12;gy+=(py-gy)*.12;glow(gx,gy,220,.55,hueAt(gx,gy))}
    for(var i=blobs.length-1;i>=0;i--){var b=blobs[i];b.a-=.012;if(b.a<=0){blobs.splice(i,1);continue}glow(b.x,b.y,b.r,b.a,b.h)}
    requestAnimationFrame(frame)}
  if(!reduce)requestAnimationFrame(frame);
  var ab=document.querySelector('#about .body'),sb=document.createElement('aside');sb.className='side';
  sb.innerHTML='<small>Favourites</small><button data-open="about" aria-current="page">About</button><button data-open="projects">📁 Projects</button><button data-open="resume">📄 Skills</button><button data-open="contact">✉️ Contact</button>';
  sb.insertAdjacentHTML('beforeend','<button data-open="music">♫ Music</button>');ab.classList.add('split');ab.insertBefore(sb,ab.firstChild);
  var M={title:'Hanya Untuk-Mu',artist:'ten2five',url:'https://music.apple.com/gb/song/hanya-untuk-mu/1566651489',src:'audio/preview.mp3'};
  document.querySelectorAll('[data-song]').forEach(function(e){e.textContent=M.title});
  document.querySelectorAll('[data-artist]').forEach(function(e){e.textContent=M.artist});
  document.querySelectorAll('a[data-music]').forEach(function(a){a.href=M.url});
  var au=new Audio();au.preload='metadata';au.src=M.src;
  var ICONS={prev:'<path d="M6 6h2v12H6zM9.5 12 18 6v12z"/>',next:'<path d="M16 6h2v12h-2zM6 18V6l8.5 6z"/>',play:'<path d="M8 5v14l11-7z"/>',pause:'<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'};
  function svg(k,sz){return'<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'+ICONS[k]+'</svg>'}
  var cur=document.getElementById('mcur'),dur=document.getElementById('mdur'),bar=document.getElementById('mbar'),fill=bar.firstElementChild;
  function fmt(t){if(!isFinite(t)||t<0)t=0;t=Math.floor(t);return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')}
  function paint(){var p=!au.paused;document.querySelectorAll('[data-ctl]').forEach(function(b){var k=b.dataset.ctl;
    if(k==='play'){b.innerHTML=svg(p?'pause':'play',+b.dataset.size||16);b.setAttribute('aria-label',p?'Pause':'Play')}
    else b.innerHTML=svg(k,34)})}
  function toOpen(){window.open(M.url,'_blank','noopener')}
  document.querySelectorAll('[data-ctl]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();var k=b.dataset.ctl;
    if(k==='play'){if(au.error){toOpen();return}if(au.paused){var r=au.play();if(r&&r.catch)r.catch(toOpen)}else au.pause()}
    else if(k==='prev')au.currentTime=0;
    else if(k==='next'&&au.duration)au.currentTime=Math.min(au.currentTime+10,au.duration)})});
  au.addEventListener('play',paint);au.addEventListener('pause',paint);
  au.addEventListener('ended',function(){au.currentTime=0;paint()});
  au.addEventListener('loadedmetadata',function(){dur.textContent=fmt(au.duration)});
  au.addEventListener('timeupdate',function(){cur.textContent=fmt(au.currentTime);fill.style.width=(au.duration?au.currentTime/au.duration*100:0)+'%'});
  function seek(x){if(!au.duration)return;var r=bar.getBoundingClientRect();au.currentTime=au.duration*Math.min(Math.max((x-r.left)/r.width,0),1)}
  bar.addEventListener('click',function(e){seek(e.clientX)});
  bar.addEventListener('keydown',function(e){if(!au.duration)return;if(e.key==='ArrowRight')au.currentTime=Math.min(au.currentTime+5,au.duration);if(e.key==='ArrowLeft')au.currentTime=Math.max(au.currentTime-5,0)});
  paint();
  var nt=document.getElementById('notch');
  nt.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')nt.classList.add('open')});
  nt.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')nt.classList.remove('open')});
  nt.addEventListener('click',function(e){if(!e.target.closest('a,button')&&e.pointerType!=='mouse')nt.classList.toggle('open');var b=e.target.closest('[data-t]');if(b)setTheme(b.dataset.t)});
  nt.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target===nt)nt.classList.toggle('open');if(e.key==='Escape')nt.classList.remove('open')});
  document.addEventListener('click',function(e){if(!nt.contains(e.target))nt.classList.remove('open')});
  function nclock(){var d=new Date();document.getElementById('nt').textContent=hm(d);document.getElementById('nd').textContent=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}
  nclock();setInterval(nclock,1000);
  if(navigator.getBattery)navigator.getBattery().then(function(b){var el=document.getElementById('nb');function u(){el.hidden=false;el.textContent='Battery '+Math.round(b.level*100)+'%'+(b.charging?' · charging':'')}u();b.addEventListener('levelchange',u);b.addEventListener('chargingchange',u)}).catch(function(){});
  setTimeout(function(){open('about');if(innerWidth>640){setTimeout(function(){open('music')},250);setTimeout(function(){nt.classList.add('open')},1200);setTimeout(function(){nt.classList.remove('open')},3600)}},350);
})();