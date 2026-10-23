(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  const motionButton = document.querySelector('.motion-toggle');
  function syncMotion() {
    document.documentElement.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.innerHTML = paused ? 'Play motion <span>▷</span>' : 'Pause motion <span>Ⅱ</span>';
  }
  syncMotion();
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); requestFrame(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); requestFrame(); });
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() { document.querySelector('main').inert=false; document.querySelector('footer').inert=false; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); navigation.classList.remove('open'); document.body.classList.remove('menu-open'); }
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('open',expanded); document.body.classList.toggle('menu-open',expanded); document.querySelector('main').inert=expanded; document.querySelector('footer').inert=expanded;
  });
  navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  matchMedia('(min-width: 761px)').addEventListener('change', e => { if(e.matches) closeMenu(); });
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }),{threshold:0.08});
    reveals.forEach(el=>observer.observe(el));
  } else reveals.forEach(el=>el.classList.add('visible'));

  // A toroidal signal, drawn locally. No video, image sequence or animation library.
  const canvas = document.querySelector('#waveCanvas');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let width=0,height=0,dpr=1,frame=0,time=0,last=0,inView=true;
  const pointer = {x:0,y:0,targetX:0,targetY:0};
  function resize() {
    const box=canvas.getBoundingClientRect(); width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);requestFrame();
  }
  function requestFrame(){if(ctx&&!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
  function draw(now){
    frame=0;if(!ctx)return;
    const delta=last?Math.min(now-last,50):16;last=now;
    if(!paused)time+=delta*.00016;
    pointer.x+=(pointer.targetX-pointer.x)*.04;pointer.y+=(pointer.targetY-pointer.y)*.04;
    ctx.clearRect(0,0,width,height);
    const small=width<700,scale=Math.min(width*.365,height*.36),cx=width*.52,cy=height*.51;
    const rotX=.93+pointer.y*.17,rotY=-.24+pointer.x*.3,rotZ=-.38+Math.sin(time*.3)*.08;
    const lines=small?43:65,points=small?110:160;
    const curves=[];
    for(let n=0;n<lines;n++){
      const v=n/lines*Math.PI*2;
      const path=[];let depth=0;
      for(let j=0;j<=points;j++){
        const u=j/points*Math.PI*2;
        const swell=.055*Math.sin(3*u+time*1.9+v*2);
        const radius=.91+(.30+swell)*Math.cos(v);
        let x=radius*Math.cos(u),y=radius*Math.sin(u),z=.30*Math.sin(v)+.09*Math.sin(2*u+time);
        const y1=y*Math.cos(rotX)-z*Math.sin(rotX),z1=y*Math.sin(rotX)+z*Math.cos(rotX);y=y1;z=z1;
        const x1=x*Math.cos(rotY)+z*Math.sin(rotY),z2=-x*Math.sin(rotY)+z*Math.cos(rotY);x=x1;z=z2;
        const x2=x*Math.cos(rotZ)-y*Math.sin(rotZ),y2=x*Math.sin(rotZ)+y*Math.cos(rotZ);x=x2;y=y2;
        const perspective=2.8/(2.8+z*.45);
        path.push([cx+x*scale*perspective,cy+y*scale*perspective]);depth+=z;
      }
      curves.push({path,z:depth/(points+1),v});
    }
    curves.sort((a,b)=>b.z-a.z);
    curves.forEach(({path,z,v})=>{
      const brightness=.33+(1-z)*.27;ctx.beginPath();
      path.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));
      const warm=Math.sin(v+time*.4)>.89;
      ctx.strokeStyle=warm?`rgba(250,133,77,${brightness*.85})`:`rgba(195,224,149,${brightness})`;
      ctx.lineWidth=small?.65:.72;ctx.stroke();
    });
    if(!paused&&inView&&!document.hidden)requestFrame();
  }
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();pointer.targetX=(e.clientX-r.left)/r.width*2-1;pointer.targetY=(e.clientY-r.top)/r.height*2-1;});
  hero.addEventListener('pointerleave',()=>{pointer.targetX=0;pointer.targetY=0;});
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
  if('IntersectionObserver'in window)new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView){last=0;requestFrame();}},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){last=0;requestFrame();}});
  resize();

  const tabs=[...document.querySelectorAll('[role="tab"]')];
  function activateTab(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});}
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activateTab(tab));
    tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();activateTab(tabs[next]);tabs[next].focus();});
  });
  const run=document.querySelector('#runFlow');
  const nodes=[...document.querySelectorAll('.pipeline-node')];
  const output=document.querySelector('#flowOutput');
  let timers=[];
  function resetFlow(){timers.forEach(clearTimeout);timers=[];nodes.forEach(n=>n.classList.remove('active'));document.querySelector('.pipeline').classList.remove('running');run.disabled=false;run.innerHTML='Run again <span>↗</span>';}
  run.addEventListener('click',()=>{
    resetFlow();run.disabled=true;run.textContent='Processing sample…';document.querySelector('.pipeline').classList.add('running');
    const messages=['Sample invoice received. No upload or real document required.','Supplier, date and amount extracted. Validation checks complete.','Sample record is ready for human review. Nothing was sent to an external system.'];
    const delay=paused?120:850;
    nodes.forEach((node,i)=>timers.push(setTimeout(()=>{nodes.forEach(n=>n.classList.remove('active'));node.classList.add('active');output.textContent=messages[i];},i*delay)));
    timers.push(setTimeout(()=>{resetFlow();nodes[2].classList.add('active');},3*delay));
  });
  const ranges={week:{complete:'128',review:'12',bars:[35,55,45,80,60,92,72]},month:{complete:'542',review:'27',bars:[66,42,75,60,88,70,97]}};
  document.querySelector('#dashboardRange').addEventListener('change',e=>{const data=ranges[e.target.value];document.querySelector('#metricComplete').textContent=data.complete;document.querySelector('#metricReview').textContent=data.review;document.querySelectorAll('.demo-chart i').forEach((bar,i)=>bar.style.setProperty('--bar',data.bars[i]+'%'));});
  const answers={handover:{text:'Handover includes testing against the agreed requirements, launch, documentation and training. Ongoing support is defined separately so responsibilities remain clear.',source:'SOURCE / OUR APPROACH → RELEASE'},scope:{text:'The scope, acceptance criteria and budget are agreed before development. Changes are discussed and priced explicitly, with schedule implications agreed before additional work begins.',source:'SOURCE / OUR APPROACH → ALIGN & MAKE'}};
  document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{const answer=answers[button.dataset.question];document.querySelectorAll('[data-question]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#knowledgeAnswer').textContent=answer.text;document.querySelector('#knowledgeSource').textContent=answer.source;}));
  document.querySelector('#year').textContent=new Date().getFullYear();
  const form=document.querySelector('#contactForm');
  form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('[type="submit"]'),status=document.querySelector('#formStatus');button.disabled=true;status.textContent='Sending your brief…';try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Submission failed');status.textContent='Thank you. Your project brief has been sent.';form.reset();}catch{status.textContent='Your brief could not be sent. Please email info@fw1ai.com directly.';}finally{button.disabled=false;}});
})();
