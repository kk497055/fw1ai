(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
  function close(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');nav.classList.remove('open');document.body.classList.remove('menu-open');document.querySelector('main').inert=false;document.querySelector('footer').inert=false;}
  menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Close navigation':'Open navigation');nav.classList.toggle('open',expanded);document.body.classList.toggle('menu-open',expanded);document.querySelector('main').inert=expanded;document.querySelector('footer').inert=expanded;});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)close();});
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),button=document.querySelector('.motion-toggle');
  function motion(paused){document.documentElement.classList.toggle('motion-paused',paused);if(button){button.setAttribute('aria-pressed',String(paused));button.innerHTML=paused?'Play motion <span>▷</span>':'Pause motion <span>Ⅱ</span>';}}
  motion(reduced.matches);reduced.addEventListener('change',e=>motion(e.matches));
  button?.addEventListener('click',()=>motion(button.getAttribute('aria-pressed')!=='true'));
  const elements=document.querySelectorAll('.reveal');
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);} }),{threshold:.08});elements.forEach(el=>observer.observe(el));}else elements.forEach(el=>el.classList.add('visible'));
  document.querySelector('#year').textContent=new Date().getFullYear();
})();
