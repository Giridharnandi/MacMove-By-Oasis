const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const {version,compare,packageFor}=require('../docs/assets/version.js');
assert.equal(compare('v0.1.10','0.1.9'),1);assert.equal(compare('0.1.4','0.1.4'),0);assert.equal(compare('0.1.4','0.2.0'),-1);assert.equal(compare('evil','0.1.4'),null);assert.equal(version('1.2.3-beta'),null);
const asset={name:'MacMove-0.1.4-macOS.pkg',state:'uploaded',browser_download_url:'https://github.com/Giridharnandi/MacMove-By-Oasis/releases/download/v0.1.4/MacMove-0.1.4-macOS.pkg'};
const release={tag_name:'v0.1.4',draft:false,prerelease:false,assets:[asset]};assert.equal(packageFor(release),asset);assert.equal(packageFor({...release,draft:true}),null);assert.equal(packageFor({...release,assets:[{...asset,browser_download_url:'https://example.com/evil.pkg'}]}),null);
const docs=path.resolve(__dirname,'../docs');
for(const file of ['index.html','privacy.html','terms.html']){const html=fs.readFileSync(path.join(docs,file),'utf8');assert.match(html,/<html lang="en">/);for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(/^(https?:|mailto:|#)/.test(url))continue;const target=url.split(/[?#]/)[0]||'./';assert.ok(fs.existsSync(path.resolve(docs,target)),`${file}: missing ${url}`);}}
console.log('PASS version comparison, download URL validation, prerelease/draft rejection and internal page links');

for(const file of ['index.html','privacy.html','terms.html']){const html=fs.readFileSync(path.join(docs,file),'utf8');assert.match(html,/<link rel="canonical" href="https:\/\/oasis.upfaast.com\//);assert.match(html,/name="robots"/);assert.match(html,/property="og:image"/);}
const home=fs.readFileSync(path.join(docs,'index.html'),'utf8');for(const [,json] of home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const schema=JSON.parse(json);assert.ok(schema['@context']);}
assert.ok(fs.readFileSync(path.join(docs,'sitemap.xml'),'utf8').includes('https://oasis.upfaast.com/'));
console.log('PASS canonical URLs, crawler metadata, social metadata and structured data JSON');
