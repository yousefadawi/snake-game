const C='snake-v2';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  const store=res=>{if(res&&(res.ok||res.type==='opaque')){const copy=res.clone();caches.open(C).then(c=>c.put(e.request,copy))}return res};
  if(same){
    e.respondWith(fetch(e.request).then(store).catch(()=>caches.match(e.request).then(h=>h||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(store)));
  }
});
