const fs = require('fs');
const path = require('path');

const root = 'C:/Users/dave/CLAUDE COWORK/07_PRODUCT/pitch_visuals';
const outRoot = path.join(root, 'assets', 'v2');
const deckPath = path.join(root, 'GnR_deck.html');
const sourceHashPath = path.join(outRoot, '_source_hash.txt');

const slideSpecs = [
  ['cs-frontier-iconic', 'opener', 'Science has proven the #1 predictor of a fulfilling life.', 'Real connection is the life outcome science keeps pointing to.', 'human-truth'],
  ['cs-1m8', 'title', 'Give n Receive', 'The brand name is the loop: what you give comes back through the network.', 'wordmark'],
  ['cs-a7m1', 'category', 'Social media is too small a definition of connection.', 'Feeds solved attention. Real-world belonging is still open.', 'old-new'],
  ['cs-1bm1', 'problem', 'We built the wrong tech for the wrong values.', 'Culture optimizes status while science rewards connection.', 'imbalance'],
  ['cs-2c', 'market', 'Community is where connection actually lives.', 'Sports, schools, neighborhoods, faith, fitness, and clubs all run on human value.', 'community-grid'],
  ['cs-thegap', 'problem', 'Your community has no like button.', 'The richest human signal stays trapped in people’s heads.', 'missing-signal'],
  ['cs-gnr', 'solution', 'An invitation feed for real life.', 'GnR replaces public calendars with private invitations that know who belongs together.', 'product-invite'],
  ['cs-11d', 'insight', 'Behavior tells the truth people won’t say.', 'The moat is implicit preference signal, not surveys.', 'implicit-signal'],
  ['cs-11e', 'traction', 'Same courts. Better groups. More revenue.', 'NEPC proof: fuller courts and members who feel seen.', 'wedge-proof'],
  ['cs-11', 'measurement', 'The invitation is the measurement layer.', 'Every accept, decline, and repeat play teaches the graph.', 'measurement'],
  ['cs-3', 'signal density', 'One club creates 24 social transactions a week.', 'Pickleball produces dense, repeated, in-person signal.', 'signal-density'],
  ['cs-magnetic', 'mechanism', 'Skill ratings miss the social pull.', 'A marketplace for human value routes what ratings cannot see.', 'magnetic'],
  ['cs-samecourt', 'comparison', 'Flip the incentives. Change the community.', 'Rating systems protect status; reciprocity makes generosity rational.', 'incentives'],
  ['cs-19', 'business', 'Same building. Three times the club.', 'Software coordination expands revenue without expanding footprint.', 'revenue'],
  ['cs-pbfirst', 'wedge', 'Pickleball is the wedge, not the category.', 'It is the highest-velocity substrate for real-world social signal.', 'wedge'],
  ['cs-fw1', 'flywheel', 'Drop it in. It compounds forever.', 'Every invitation makes the next one smarter.', 'flywheel'],
  ['cs-18-vd4', 'founder', 'The founder built the lab first.', 'Dave has the domain, the club, the operator scar tissue, and the contrarian map.', 'founder'],
  ['cs-fv6', 'category', 'Real connection technology has verbs.', 'Graph it, coordinate it, automate it, return it.', 'verbs'],
  ['cs-wedge1', 'expansion', 'The wedge opens into civilization.', 'Sports is the first beachhead for real-world social communities.', 'expansion'],
  ['cs-16', 'data loop', 'Every touchpoint becomes training data.', 'The club keeps operating; GnR turns exhaust into intelligence.', 'training'],
  ['cs-27', 'team', 'The CTO can build the graph.', 'Steve turns the founder’s operating truth into product infrastructure.', 'cto'],
  ['cs-mv6', 'mission', 'The next great network is real life.', 'Autonomous social coordination becomes the network layer for our lives.', 'mission'],
  ['cs-brand-V8', 'closer', 'Human value, finally seen.', 'The brand promise is that what you give can finally come back.', 'brand']
];

const existingImages = {
  'cs-frontier-iconic': [
    'assets/explorations/cs-frontier-iconic-v2-welcome.png',
    'assets/explorations/cs-frontier-iconic-v1-clasp.png',
    'assets/explorations/cs-frontier-iconic-v3-threshold.png'
  ],
  'cs-mv6': [
    'assets/explorations/cs-mv6-v3-human-constellation.png',
    'assets/explorations/cs-mv6-v4-open-door-river.png',
    'assets/explorations/cs-mv6-v1-porchlights-network.png'
  ],
  'cs-thegap': [
    'assets/explorations/cs-thegap-v1-unsent-thoughts.png',
    'assets/explorations/cs-thegap-v2-missing-button.png',
    'assets/explorations/cs-thegap-v4-invisible-reciprocity.png'
  ],
  'cs-pbfirst': [
    'assets/explorations/cs-pbfirst-v3-wedge-map.png',
    'assets/explorations/cs-pbfirst-v4-after-game-cluster.png',
    'assets/explorations/cs-pbfirst-v1-golden-courts.png'
  ],
  'cs-samecourt': [
    'assets/explorations/cs-samecourt-v1-split-court-values.png',
    'assets/explorations/cs-samecourt-v2-empty-spot-offered.png',
    'assets/explorations/cs-samecourt-v4-newcomer-circle.png'
  ],
  'cs-11e': [
    'assets/explorations/cs-11e-v4-every-court-alive.png',
    'assets/explorations/cs-11e-v3-faces-not-ratings.png',
    'assets/explorations/cs-11e-v1-full-courts-human-proof.png'
  ]
};

const variantModes = [
  ['v1-hero', 'Hero Editorial', 'A single image carries the claim; headline rides the quiet zone.'],
  ['v2-type', 'Monumental Type', 'The headline becomes the artifact; one supporting proof line max.'],
  ['v3-diagram', 'Investor Diagram', 'A restrained diagram makes the mechanism legible in one glance.']
];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function relFromSlide(slideId, rel) {
  return path.relative(path.join(outRoot, slideId), path.join(root, rel)).replace(/\\/g, '/');
}

function baseCss() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,600..900,0..100,0..1&family=Playfair+Display:wght@700;900&family=Manrope:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
:root{--cream:#fbf7ef;--paper:#f3ead8;--ink:#1a1612;--gold:#b8954a;--blue:#5B8FD4;--rust:#c8462c;--muted:#d4a853}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:var(--cream);color:var(--ink);overflow:hidden}
.slide{position:relative;width:100vw;height:100vh;min-width:960px;min-height:540px;background:radial-gradient(circle at 46% 32%,#fffaf1 0%,var(--cream) 54%,#eadcc4 100%);font-family:Manrope,sans-serif;overflow:hidden}
.slide:before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(26,22,18,.045) 1px,transparent 0);background-size:4px 4px;opacity:.55;mix-blend-mode:multiply;pointer-events:none;z-index:3}
.eyebrow{position:absolute;top:28px;left:48px;z-index:5;font-family:Manrope,sans-serif;font-size:.58rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:var(--gold)}
.gnr{position:absolute;top:28px;right:48px;z-index:5;font-family:Playfair Display,serif;font-weight:900;font-size:1rem;letter-spacing:-.04em}.gnr .g{color:var(--blue)}.gnr .n{color:var(--gold);font-style:italic;font-weight:700}.gnr .r{color:var(--rust)}
.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.shade{position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(251,247,239,.86) 0%,rgba(251,247,239,.54) 32%,rgba(251,247,239,.08) 62%,rgba(251,247,239,0) 100%)}
.copy{position:absolute;z-index:4;left:6%;top:7.5%;max-width:860px}
h1{font-family:Fraunces,Playfair Display,Georgia,serif;font-weight:850;font-size:clamp(3rem,6.2vw,6.4rem);letter-spacing:-.045em;line-height:.94;margin:0;color:var(--ink)}
.sub{margin-top:24px;max-width:620px;font-family:Manrope,sans-serif;font-weight:700;font-size:clamp(1rem,1.35vw,1.38rem);line-height:1.35;color:rgba(26,22,18,.72)}
.proof{position:absolute;left:6%;bottom:7%;z-index:4;font-family:JetBrains Mono,monospace;font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(26,22,18,.54)}
.type h1{font-size:clamp(4.6rem,10vw,10.5rem);line-height:.86;max-width:1500px}.type .copy{top:16%;max-width:1500px}.type .sub{font-family:Fraunces,serif;font-style:italic;font-size:clamp(1.6rem,2.7vw,3rem);color:var(--gold);max-width:900px}
.diagram .copy{max-width:760px}.diagram h1{font-size:clamp(3rem,5.7vw,5.9rem)}
.viz{position:absolute;right:7%;top:18%;width:40%;height:62%;z-index:4;display:flex;align-items:center;justify-content:center}
.ring{position:absolute;border:1.5px solid rgba(184,149,74,.36);border-radius:50%}.ring.a{width:82%;height:82%}.ring.b{width:58%;height:58%;border-color:rgba(91,143,212,.38)}.ring.c{width:34%;height:34%;border-color:rgba(200,70,44,.34)}
.node{position:absolute;width:18px;height:18px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 8px rgba(184,149,74,.12)}.node.n1{left:18%;top:18%;background:var(--blue)}.node.n2{right:16%;top:26%;background:var(--rust)}.node.n3{left:28%;bottom:18%}.node.n4{right:26%;bottom:16%;background:var(--blue)}.core{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#fffaf1 0%,rgba(184,149,74,.42) 58%,rgba(184,149,74,.08) 100%);box-shadow:0 0 80px rgba(184,149,74,.32)}
.bars{position:absolute;right:8%;bottom:13%;width:38%;z-index:4;display:grid;gap:18px}.bar{height:34px;background:rgba(26,22,18,.08);position:relative}.bar:after{content:'';position:absolute;inset:0 auto 0 0;width:var(--w);background:linear-gradient(90deg,var(--gold),var(--rust))}
`;
}

function visualHtml(slide, variantIdx, mode, image) {
  if (mode === 'Hero Editorial' && image) {
    return `<img class="hero-img" src="${esc(relFromSlide(slide.id, image))}" alt=""><div class="shade"></div>`;
  }
  if (mode === 'Investor Diagram') {
    return `<div class="viz"><div class="ring a"></div><div class="ring b"></div><div class="ring c"></div><div class="node n1"></div><div class="node n2"></div><div class="node n3"></div><div class="node n4"></div><div class="core"></div></div>`;
  }
  return `<div class="bars"><div class="bar" style="--w:28%"></div><div class="bar" style="--w:44%"></div><div class="bar" style="--w:76%"></div><div class="bar" style="--w:96%"></div></div>`;
}

function variantHtml(slide, variant, idx) {
  const [slug, label, designMove] = variant;
  const image = (existingImages[slide.id] || [])[idx];
  const modeClass = label === 'Monumental Type' ? 'type' : label === 'Investor Diagram' ? 'diagram' : 'hero';
  const sub = idx === 0 ? slide.body : idx === 1 ? `${slide.role.toUpperCase()} / one claim, no filler.` : slide.body;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(slide.id)} ${esc(slug)}</title><style>${baseCss()}</style></head><body><main class="slide ${modeClass}"><div class="eyebrow">${esc(slide.role)}</div><div class="gnr"><span class="g">G</span><span class="n">n</span><span class="r">R</span></div>${visualHtml(slide, idx, label, image)}<section class="copy"><h1>${esc(slide.headline)}</h1><div class="sub">${esc(sub)}</div></section><div class="proof">${esc(label)} · ${esc(slide.id)}</div></main></body></html>`;
}

function rationaleFor(slide) {
  return `# ${slide.id} Rationale

Strategic role: ${slide.role}. Claim: ${slide.claim}. Audience emotion: ${slide.emotion}. Recommended variant: v1-hero when an editorial image exists for this slide; otherwise v2-type because the headline carries more investor force than decorative diagrams.

## v1-hero

Uses a full-bleed editorial image or image-led composition so the slide feels like a hand-crafted investor artifact rather than a template. This echoes Airbnb's high-emotion early deck moves: make the viewer feel the behavior before explaining the market.

## v2-type

Turns the headline into the slide. This follows the Sequoia/YC discipline that headlines alone should carry the story and keeps body copy under the threshold where investors stop reading.

## v3-diagram

Uses a restrained mechanism visual with brand-color nodes and no chartjunk. This is the Reid Hoffman / a16z pattern: make the network effect legible without over-explaining it.
`;
}

function build() {
  fs.rmSync(outRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(outRoot, '_shared'), { recursive: true });
  fs.writeFileSync(path.join(outRoot, '_shared', 'slide_base.css'), baseCss(), 'utf8');
  const crypto = require('crypto');
  const source = fs.readFileSync(deckPath);
  fs.writeFileSync(sourceHashPath, crypto.createHash('sha256').update(source).digest('hex') + '\n', 'utf8');

  const slides = slideSpecs.map(([id, role, headline, body, theme]) => ({
    id, role, headline, body, theme,
    claim: headline,
    emotion: role === 'opener' || role === 'mission' || role === 'closer' ? 'lean-forward belief' : 'clarity and momentum'
  }));

  const selected = [];
  for (const slide of slides) {
    const dir = path.join(outRoot, slide.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'RATIONALE.md'), rationaleFor(slide), 'utf8');
    variantModes.forEach((variant, idx) => {
      const file = `${variant[0]}-${slide.theme}.html`;
      fs.writeFileSync(path.join(dir, file), variantHtml(slide, variant, idx), 'utf8');
      selected.push({ ...slide, file: `assets/v2/${slide.id}/${file}` });
    });
  }

  const chosen = slides.map(slide => {
    const hasHero = !!existingImages[slide.id];
    const file = `${hasHero ? variantModes[0][0] : variantModes[1][0]}-${slide.theme}.html`;
    return { ...slide, chosenFile: `assets/v2/${slide.id}/${file}` };
  });

  const deck = `<!doctype html><html><head><meta charset="utf-8"><title>GnR Deck v2</title><style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#1a1612}#frame{width:100vw;height:100vh;border:0;background:#fbf7ef}.nav{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:20;display:flex;flex-direction:column;gap:6px}.nav button{width:8px;height:8px;border-radius:50%;border:0;background:rgba(251,247,239,.34);cursor:pointer}.nav button.on{background:#b8954a;transform:scale(1.5)}.count{position:fixed;right:18px;bottom:16px;color:#fbf7ef;font:700 11px Manrope,sans-serif;letter-spacing:.12em}
</style></head><body><iframe id="frame" src="${chosen[0].chosenFile}"></iframe><div class="nav">${chosen.map((s,i)=>`<button data-i="${i}" title="${esc(s.id)}"></button>`).join('')}</div><div class="count" id="count"></div><script>
const slides=${JSON.stringify(chosen.map(s=>s.chosenFile))};let current=0;const frame=document.getElementById('frame');const dots=[...document.querySelectorAll('.nav button')];function go(i){current=Math.max(0,Math.min(slides.length-1,i));frame.src=slides[current];dots.forEach((d,idx)=>d.classList.toggle('on',idx===current));document.getElementById('count').textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')}dots.forEach(d=>d.onclick=()=>go(+d.dataset.i));document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '||e.key==='d')go(current+1);if(e.key==='ArrowLeft'||e.key==='a')go(current-1)});go(0);
</script></body></html>`;
  fs.writeFileSync(path.join(root, 'GnR_deck_v2.html'), deck, 'utf8');

  let gallery = `<!doctype html><html><head><meta charset="utf-8"><title>GnR V2 Gallery</title><style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Manrope:wght@500;700;900&family=JetBrains+Mono:wght@500;700&display=swap');:root{--cream:#fbf7ef;--ink:#1a1612;--gold:#b8954a;--rust:#c8462c}*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font-family:Manrope,sans-serif}header{position:sticky;top:0;z-index:20;background:rgba(251,247,239,.96);border-bottom:1px solid rgba(184,149,74,.32);padding:20px 34px}h1{font-family:Fraunces,serif;font-size:2.4rem;letter-spacing:-.04em;line-height:.95;margin:0 0 12px}.nav{display:flex;gap:8px;flex-wrap:wrap}.nav a{font:800 .64rem Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);text-decoration:none;border:1px solid rgba(184,149,74,.34);padding:7px 9px;background:rgba(184,149,74,.08)}main{padding:26px 34px 60px}.slide{border-top:2px solid rgba(184,149,74,.54);padding-top:24px;margin-top:34px}.head{display:grid;grid-template-columns:220px 1fr;gap:22px;margin-bottom:18px}.id{font-family:JetBrains Mono,monospace;color:var(--rust);font-weight:800}.role{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:900}.headline{font-family:Fraunces,serif;font-size:1.8rem;line-height:1;margin-bottom:8px}.grid{display:grid;grid-template-columns:1fr repeat(3,1fr);gap:14px;align-items:start}.old,.card{background:#fffaf1;border:1px solid rgba(26,22,18,.10);padding:10px}.old .placeholder{aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:rgba(26,22,18,.06);font-weight:900;color:rgba(26,22,18,.44);text-align:center;padding:20px}.card.reco{outline:3px solid var(--rust)}iframe{width:100%;aspect-ratio:16/9;border:0;background:#fbf7ef}.label{font-family:JetBrains Mono,monospace;font-size:.72rem;font-weight:800;margin-top:8px}.why{font-size:.78rem;color:rgba(26,22,18,.66);line-height:1.35;margin-top:4px}@media(max-width:1300px){.grid{grid-template-columns:1fr 1fr}.head{grid-template-columns:1fr}}
</style></head><body><header><h1>GnR Deck v2 Exploration Gallery</h1><nav class="nav">${slides.map(s=>`<a href="#${s.id}">${s.id}</a>`).join('')}</nav></header><main>`;
  for (const slide of slides) {
    gallery += `<section class="slide" id="${slide.id}"><div class="head"><div><div class="id">${esc(slide.id)}</div><div class="role">${esc(slide.role)}</div></div><div><div class="headline">${esc(slide.headline)}</div><div>${esc(slide.body)}</div></div></div><div class="grid"><div class="old"><div class="placeholder">OLD CURRENT DECK<br>${esc(slide.id)}</div><div class="label">current reference</div><div class="why">Current deck remains untouched. Use this cell as the comparison anchor.</div></div>`;
    variantModes.forEach((variant, idx) => {
      const file = `assets/v2/${slide.id}/${variant[0]}-${slide.theme}.html`;
      gallery += `<article class="card ${idx===0?'reco':''}"><iframe src="${file}"></iframe><div class="label">${esc(variant[0])}${idx===0?' · recommended':''}</div><div class="why">${esc(variant[2])}</div></article>`;
    });
    gallery += `</div></section>`;
  }
  gallery += `</main></body></html>`;
  fs.writeFileSync(path.join(root, 'EXPLORATIONS_V2_GALLERY.html'), gallery, 'utf8');

  let changelog = `# V2 Changelog\n\nSource deck hash before build: \`${fs.readFileSync(sourceHashPath,'utf8').trim()}\`\n\n`;
  slides.forEach(slide => {
    changelog += `## ${slide.id}\n\nChanged into three V2 directions: image-led hero, monumental type, and investor diagram. Recommended: ${existingImages[slide.id] ? 'v1-hero because a real generated editorial image already exists for this strategic beat.' : 'v2-type because this slide is stronger as a headline-led investor artifact than as decorative illustration.'} Confidence: ${existingImages[slide.id] ? 'HIGH' : 'MEDIUM'}.\n\n`;
  });
  changelog += `## Proposed Additions\n\n1. A single external-club proof slide once Racketeer or another non-NEPC operator produces usable data.\n2. A concise ask slide with dollar amount, milestones, and use of funds.\n3. A moat slide isolating why implicit social preference data cannot be scraped or bought.\n`;
  fs.writeFileSync(path.join(root, 'V2_CHANGELOG.md'), changelog, 'utf8');
}

build();
