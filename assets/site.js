(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const toast=document.querySelector('.toast');let toastTimer;
 function notify(message){clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('visible');toastTimer=setTimeout(()=>toast.classList.remove('visible'),4500)}
 document.body.classList.toggle('scrolled',scrollY>20);
 addEventListener('scroll',()=>document.body.classList.toggle('scrolled',scrollY>20),{passive:true});
 if('IntersectionObserver'in window&&!reduced.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target)}}),{threshold:.07,rootMargin:'0px 0px 45px 0px'});
  document.body.classList.add('motion-ready');
  document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el)});
  reduced.addEventListener('change',()=>{if(reduced.matches){document.querySelectorAll('.pending').forEach(el=>el.classList.remove('pending'));observer.disconnect()}});
 }
 const menu=document.querySelector('.mobile-menu');const menuToggle=document.querySelector('.menu-toggle');
 menuToggle?.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true')});
 document.querySelector('[data-menu-close]')?.addEventListener('click',()=>menu.close());
 menu?.addEventListener('close',()=>{menuToggle.setAttribute('aria-expanded','false');menuToggle.focus()});
 menu?.addEventListener('click',event=>{if(event.target===menu){const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right)menu.close()}});
 const lightbox=document.querySelector('.media-dialog');let origin;let galleryIndex=0;
 const gallery=[...document.querySelectorAll('[data-image]')];
 const showImage=index=>{galleryIndex=(index+gallery.length)%gallery.length;const button=gallery[galleryIndex];const image=lightbox.querySelector('img');image.src=button.dataset.image;image.alt=button.dataset.caption||'';lightbox.querySelector('figcaption').textContent=button.dataset.caption||'';lightbox.querySelector('[data-gallery-count]').textContent=`${galleryIndex+1} / ${gallery.length}`};
 gallery.forEach((button,index)=>button.addEventListener('click',()=>{
  origin=button;showImage(index);lightbox.showModal();
 }));
 lightbox.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>showImage(galleryIndex-1));
 lightbox.querySelector('[data-gallery-next]')?.addEventListener('click',()=>showImage(galleryIndex+1));
 lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showImage(galleryIndex+1)}if(event.key==='ArrowLeft'){event.preventDefault();showImage(galleryIndex-1)}});
 const film=document.querySelector('.film-dialog');const video=film?.querySelector('video');
 document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{origin=button;film.showModal();video.load();video.play().catch(()=>{})}));
 document.querySelectorAll('[data-dialog-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
 [lightbox,film].filter(Boolean).forEach(dialog=>{
  dialog.addEventListener('close',()=>{if(dialog===film)video.pause();origin?.focus()});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
 });
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('page-hidden',document.hidden);if(document.hidden)video?.pause()});
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='Все'&&card.dataset.category!==button.dataset.filter;card.classList.remove('pending')});
 }));
 const seasons={winter:['Зимняя тишина.','Белая растительность, мягкий туман и снегопад. Своё настроение в знакомом мире.'],spring:['Время нового света.','Мягкая весенняя палитра, воздушные частицы и тёплый свет в знакомом мире.'],summer:['Чуть ближе к лету.','Зелёная растительность и лёгкая атмосфера. Настрой интенсивность под свой ритм.'],autumn:['Тёплое послевкусие.','Золотая листва, листопад и тёплая палитра мира. Осень, которую выбираешь ты.']};
 const compareStage=document.querySelector('[data-season-stage]');
 const compareToggle=document.querySelector('[data-compare-toggle]');
 const compareControl=document.querySelector('.compare-control');
 const compareRange=compareControl?.querySelector('input');
 compareToggle?.addEventListener('click',()=>{const active=compareStage.classList.toggle('is-comparing');compareToggle.setAttribute('aria-pressed',String(active));compareControl.hidden=!active;compareToggle.querySelector('span').textContent=active?'Полный кадр':'Сравнить с летом';});
 compareRange?.addEventListener('input',()=>{const value=Number(compareRange.value);compareStage.style.setProperty('--split',value+'%');compareControl.querySelector('output').value=value+'%';});
 let seasonRequest=0;
 document.querySelectorAll('[data-season]').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.season;const stage=document.querySelector('[data-season-stage]');const image=stage.querySelector('img');const ticket=++seasonRequest;
  const preload=new Image();preload.onload=()=>{if(ticket!==seasonRequest)return;image.src=preload.src;image.alt=seasons[name][0];const coordinate=stage.querySelector('.season-coordinate');if(coordinate)coordinate.innerText=String(Object.keys(seasons).indexOf(name)+1).padStart(2,'0')+' / 04\nSEASON STUDY';if(!reduced.matches)image.animate([{opacity:.45,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:650,easing:'cubic-bezier(.2,.75,.2,1)'});stage.querySelector('[data-season-title]').textContent=seasons[name][0];stage.querySelector('[data-season-description]').textContent=seasons[name][1];const label=stage.querySelector('[data-compare-season]');if(label)label.textContent={winter:'Зима',spring:'Весна',summer:'Лето',autumn:'Осень'}[name]};preload.onerror=()=>notify('Не удалось загрузить кадр. Попробуй ещё раз.');preload.src=`/assets/v120/${name}.webp`;
  document.querySelectorAll('[data-season]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 }));
 let paletteRequest=0;
 document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{
  const lab=document.querySelector('.palette-lab');const target=lab.querySelector('.palette-image img');const ticket=++paletteRequest;const name=button.getAttribute('aria-label');
  const preload=new Image();preload.onload=()=>{if(ticket!==paletteRequest)return;target.src=preload.src;if(!reduced.matches)target.animate([{opacity:.4},{opacity:1}],{duration:350});target.alt=`Seraph Wings в цвете ${name}`;lab.querySelector('[data-palette-name]').textContent=name};preload.onerror=()=>notify('Не удалось загрузить вариант. Попробуй ещё раз.');preload.src=`/assets/v120/seraph-${button.dataset.palette}.webp`;
  document.querySelectorAll('[data-palette]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 }));
 document.querySelector('[data-copy]')?.addEventListener('click',async event=>{
  const button=event.currentTarget;const status=button.parentElement.querySelector('.copy-feedback');
  try{await navigator.clipboard.writeText(button.dataset.copy);status.textContent='SHA-256 скопирован';setTimeout(()=>status.textContent='',3000)}
  catch{status.textContent='Выдели и скопируй хэш вручную.'}
 });
 document.querySelector('.download-main')?.addEventListener('click',()=>notify('Проверь загрузки браузера — там появится Andromeda.exe.'));
})();
