if(!self.define){let e,a={};const s=(s,t)=>(s=new URL(s+".js",t).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(t,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(a[n])return;let c={};const r=e=>s(e,n),d={module:{uri:n},exports:c,require:r};a[n]=Promise.all(t.map((e=>d[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"8116871653ad8725048d421b8263aaf3"},{url:"/_next/static/chunks/0465bbc0-a31fac838181020f.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/2545-a851457462343cd0.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/2707-59d8adab5d12514f.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/4165-cfd1689d9818e4e2.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/4e06a7d7-223672208426816c.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/5927-8a4182988edc1c61.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/6406-909a8421cb33a224.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/679-b60d5d488758697f.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/7171-9b55dd142e2ac88f.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/7931-1105d727e4741124.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/8477-95700f59a5252080.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/85a321ef.99853b418c62de55.js",revision:"99853b418c62de55"},{url:"/_next/static/chunks/8677.c59c7a9bfc526afa.js",revision:"c59c7a9bfc526afa"},{url:"/_next/static/chunks/9542-4e10bcfae5364e2b.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/9660-287309dd1d012e37.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/9687-ec40dc820ba6cdb5.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/9945-8fb29e2f321da1ec.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/_not-found/page-535f71f26f52f048.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/auth/check/route-30ecb1ca5af70326.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/auth/login/route-b521fc5a290201f1.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/auth/logout/route-faea4a73124537e7.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/auth/route-3742d4e8a6004413.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/matches/route-5a4f4017111a0be5.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/basic/route-2a0e0471d6dac757.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/education-career/route-22f79dd0142d0e0a.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/family/route-05edc4340ceeec47.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/physical/route-dca209f95a6aae53.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/preferences/route-667d1e5fc2ab5057.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/route-e406191ab38aef4e.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/share/%5BuserId%5D/%5Btoken%5D/renew/route-62102091f890a640.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/share/%5BuserId%5D/%5Btoken%5D/route-99113f95fa9ac303.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profile/share/route-e8a7bb9bde316ddd.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profiles/%5Bid%5D/route-c156ca80f01676ed.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/profiles/route-33b59490cd7b08e3.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/upload/route-1423a40172155800.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/api/user/me/route-2f3058755ff269d1.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/auth/page-2c6caaa56f947216.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/dashboard/page-68672c54d6ca1e35.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/layout-7ad78a50add5b479.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/login/page-43fe0f0af8a27151.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/my-profile/page-b42748e661bb1af9.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/not-found-af666c4a0ca20614.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/page-6df847cec7189831.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/profile/%5Bid%5D/page-13af6b813bdb62aa.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/profile/edit/page-320ce1149ec04411.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/app/shared-profile/%5BuserId%5D/%5Btoken%5D/page-4c3c9f9f2cc6b149.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/d5f97f01-2d835305deb67af3.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/framework-58e5ce123af85dc7.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/main-5e88f36a5fd9ed94.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/main-app-07f66508ca55f2ad.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/pages/_app-5d49ddf8c1333880.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/pages/_error-c04d1b65c482a436.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-b2c70362830dcc2f.js",revision:"d4JfEPzhFC8dahjaPtqLJ"},{url:"/_next/static/css/842b8a49ea12f3ed.css",revision:"842b8a49ea12f3ed"},{url:"/_next/static/d4JfEPzhFC8dahjaPtqLJ/_buildManifest.js",revision:"f64cc752fc7b70fc90ea9a8ab12fb921"},{url:"/_next/static/d4JfEPzhFC8dahjaPtqLJ/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android-chrome-192x192.png",revision:"c443255731e46dc613c1f699ae89582a"},{url:"/android-chrome-512x512.png",revision:"0ff299ea3e527acbf0da5f7a1bdb07ed"},{url:"/apple-touch-icon.png",revision:"bafa92c14dc4a351581a73966187ae88"},{url:"/favicon-16x16.png",revision:"f13179a957ac4197183c66eb18a23691"},{url:"/favicon-32x32.png",revision:"73b64d13b51552fb8e88ccf5e10b754b"},{url:"/favicon.ico",revision:"32e4a1a96d3701b74c47516dd3769446"},{url:"/manifest.json",revision:"ff1978789dc2944dc0328aab8c2d54fa"},{url:"/placeholder-user.jpg",revision:"7ee6562646feae6d6d77e2c72e204591"},{url:"/placeholder.svg",revision:"35707bd9960ba5281c72af927b79291f"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:t})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
