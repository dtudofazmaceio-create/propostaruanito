const CACHE='ruanito-v1.2.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET' || new URL(r.url).origin!==location.origin) return;
  // página: rede primeiro (pega atualizações), cai para o cache sem internet
  if(r.mode==='navigate'){ e.respondWith(fetch(r).then(res=>{ const c=res.clone(); caches.open(CACHE).then(ca=>ca.put('./index.html',c)); return res; }).catch(()=>caches.match('./index.html'))); return; }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ const c=res.clone(); caches.open(CACHE).then(ca=>ca.put(r,c)); return res; })));
});
