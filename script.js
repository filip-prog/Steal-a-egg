/* ============ RBLXScripts Hub — static (GitHub Pages) ============ */
/* NOTE: auth & data are stored in localStorage (demo only, not secure). */

const GAMES = ["Blox Fruits","Murder Mystery 2","Steal An Egg","Rivals","Pet Simulator X","Anime Champions"];
const TAGS = ["Keyless","Key System","Mobile Friendly","Open Source"];
const EMOJI = {"Blox Fruits":"🏴‍☠️","Murder Mystery 2":"🔪","Steal An Egg":"🥚","Rivals":"🎯","Pet Simulator X":"🐾","Anime Champions":"⚔️"};
const THUMB = {
  "Blox Fruits":"https://images.unsplash.com/photo-1656639969809-ebc544c96955?w=600&q=80",
  "Murder Mystery 2":"https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80",
  "Steal An Egg":"https://images.unsplash.com/photo-1567027757540-7b572280fa22?w=600&q=80",
  "Rivals":"https://images.unsplash.com/photo-1772371272228-f4a8247cfe6d?w=600&q=80",
  "Pet Simulator X":"https://images.unsplash.com/photo-1740252117012-bb53ad05e370?w=600&q=80",
  "Anime Champions":"https://images.unsplash.com/photo-1772371272141-0fbd644b65c4?w=600&q=80",
};
const ADMIN_EMAIL = "admin@rblxscripts.hub";
const ADMIN_PASS = "Admin@12345";

const SAMPLE = [
  ["Blox Fruits Auto-Farm & Devil Fruit Finder","Blox Fruits",["Keyless","Mobile Friendly","Open Source"],"Powerful all-in-one hub featuring auto-farm, devil fruit sniper, auto-raid, fast attack and sea event teleports.",15230],
  ["MM2 Silent Aim & ESP Pack","Murder Mystery 2",["Keyless","Mobile Friendly"],"Dominate Murder Mystery 2 with silent aim, murderer/sheriff ESP, coin auto-collect and role notifier.",9820],
  ["Rivals Keyless Aimbot & Speed Multiplier","Rivals",["Keyless","Open Source"],"Competitive Rivals script with smooth aimbot, triggerbot, wall bang and speed multiplier. No key required.",12050],
  ["Steal An Egg Infinite Coins Hub","Steal An Egg",["Key System","Mobile Friendly"],"Auto-steal eggs, infinite coin farm, auto-hatch and pet dupe utilities in a slick mobile-ready interface.",7430],
  ["Pet Simulator X Auto-Hatch Pro","Pet Simulator X",["Keyless","Open Source"],"Auto-hatch, auto-collect coins, best-area teleport and diamond farm. Lightweight and open source.",6210],
  ["Anime Champions Auto-Quest & Raid Bot","Anime Champions",["Key System","Mobile Friendly","Open Source"],"Grind faster with auto-quest, auto-raid, auto-sell and boss farm. Supports background execution.",5340],
  ["Blox Fruits PvP God-Mode Combat","Blox Fruits",["Keyless","Mobile Friendly"],"Enhance PvP with combat prediction, auto-combo, dodge assist and instant stat reset. Ban-safe design.",11200],
  ["MM2 Coin Grinder & Unbox Simulator","Murder Mystery 2",["Keyless","Open Source"],"Idle coin grinder plus unbox value predictor for Murder Mystery 2. Perfect for farming AFK overnight.",4190],
  ["Rivals Movement Macro & No Recoil","Rivals",["Key System","Mobile Friendly"],"Advanced movement macros, bunny-hop, no recoil and rapid fire for Rivals. Smooth and undetected.",8870],
  ["Steal An Egg Auto-Rob & Teleport","Steal An Egg",["Keyless","Mobile Friendly","Open Source"],"Full automation: auto-rob bases, instant teleport, auto-upgrade and anti-AFK. Great for grinding.",3920],
  ["Pet Simulator X Diamond Dupe Utility","Pet Simulator X",["Key System","Mobile Friendly"],"Diamond farm, huge pet sniper and trade helper for Pet Simulator X. Includes safety toggles.",5110],
  ["Anime Champions Boss Rush Farmer","Anime Champions",["Keyless","Open Source"],"Auto boss rush, auto-ascend, gem farm and inventory manager. Open source and community maintained.",2980],
];

/* ---------- storage ---------- */
const DB = {
  get scripts() { return JSON.parse(localStorage.getItem("rblx_scripts") || "null"); },
  set scripts(v) { localStorage.setItem("rblx_scripts", JSON.stringify(v)); },
  get users() { return JSON.parse(localStorage.getItem("rblx_users") || "[]"); },
  set users(v) { localStorage.setItem("rblx_users", JSON.stringify(v)); },
  get user() { return JSON.parse(localStorage.getItem("rblx_user") || "null"); },
  set user(v) { v ? localStorage.setItem("rblx_user", JSON.stringify(v)) : localStorage.removeItem("rblx_user"); },
};

function seed() {
  if (DB.scripts) return;
  const now = Date.now();
  DB.scripts = SAMPLE.map((s, i) => ({
    id: "s" + (i + 1),
    title: s[0], game: s[1], tags: s[2], description: s[3],
    code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/example/${s[1].replace(/\s+/g,"").toLowerCase()}/main.lua"))()`,
    thumbnail: THUMB[s[1]], author: "Admin",
    views: s[4], likedBy: [], favBy: [], comments: [],
    created: now - i * 7 * 3600 * 1000,
  }));
  const users = DB.users;
  if (!users.find(u => u.email === ADMIN_EMAIL)) {
    users.push({ name: "Admin", email: ADMIN_EMAIL, password: ADMIN_PASS, role: "admin" });
    DB.users = users;
  }
}

/* ---------- helpers ---------- */
const $ = (s, el=document) => el.querySelector(s);
const esc = (s="") => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt = n => n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,"")+"k" : ""+n;
function ago(ts) {
  const s = Math.floor((Date.now()-ts)/1000);
  if (s < 3600) return Math.max(1,Math.floor(s/60))+"m ago";
  if (s < 86400) return Math.floor(s/3600)+"h ago";
  return Math.floor(s/86400)+"d ago";
}
function toast(msg, type="success") {
  const t = $("#toast");
  t.textContent = msg; t.className = "toast show " + type;
  setTimeout(() => t.className = "toast " + type, 2200);
}
const getScripts = () => DB.scripts || [];
const findScript = id => getScripts().find(s => s.id === id);
function saveScript(upd) {
  const arr = getScripts().map(s => s.id === upd.id ? upd : s);
  DB.scripts = arr;
}

/* ---------- card template ---------- */
function cardHTML(s, i, rank) {
  return `<a class="card animate-up" href="#/script/${s.id}" style="animation-delay:${i*40}ms">
    <div class="card-thumb">
      ${rank ? `<span class="rank">#${rank}</span>` : ""}
      <span class="game-tag">${esc(s.game)}</span>
      <img src="${s.thumbnail}" alt="${esc(s.title)}" loading="lazy" />
    </div>
    <div class="card-body">
      <div class="card-title">${esc(s.title)}</div>
      <div class="tags">${s.tags.slice(0,2).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="card-meta">
        <span><i class="fa-solid fa-eye"></i> ${fmt(s.views)}</span>
        <span><i class="fa-solid fa-heart"></i> ${fmt(s.likedBy.length)}</span>
        <span class="time"><i class="fa-regular fa-clock"></i> ${ago(s.created)}</span>
      </div>
    </div>
  </a>`;
}

/* ---------- pages ---------- */
function pageHome() {
  const all = getScripts();
  const newest = [...all].sort((a,b)=>b.created-a.created).slice(0,10);
  const trending = [...all].sort((a,b)=>b.views-a.views).slice(0,4);
  const cats = GAMES.map(g => ({ name:g, emoji:EMOJI[g], thumb:THUMB[g], count: all.filter(s=>s.game===g).length }));
  return `
  <div class="hero">
    <div class="hero-content">
      <span class="badge-pill"><i class="fa-solid fa-sparkles"></i> Fresh scripts added daily</span>
      <h1>The Ultimate <span class="gradient-text">Roblox Script Hub</span></h1>
      <p>Discover keyless, mobile-friendly and open-source scripts for Blox Fruits, MM2, Rivals and more. Copy, download and dominate.</p>
      <form class="hero-search" onsubmit="goSearch(event)">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input id="heroSearch" placeholder="Search for a game or script..." />
        <button type="submit" class="btn-primary">Search</button>
      </form>
    </div>
  </div>
  <div class="container">
    <div class="section-head"><div><div class="section-eyebrow"><i class="fa-solid fa-shield-halved"></i> Browse by game</div><h2>Game Categories</h2></div><a class="view-all" href="#/categories">View all <i class="fa-solid fa-arrow-right"></i></a></div>
    <div class="grid grid-cat">${cats.map(c=>`<a class="cat-tile" href="#/scripts?game=${encodeURIComponent(c.name)}"><img src="${c.thumb}"/><div class="cat-info"><div class="emoji">${c.emoji}</div><h3>${esc(c.name)}</h3><div class="cat-count">${c.count} scripts</div></div></a>`).join("")}</div>
  </div>
  <div class="container">
    <div class="section-head"><div><div class="section-eyebrow"><i class="fa-solid fa-fire"></i> Most viewed</div><h2>Trending Now</h2></div><a class="view-all" href="#/scripts?sort=views">View all <i class="fa-solid fa-arrow-right"></i></a></div>
    <div class="grid grid-4">${trending.map((s,i)=>cardHTML(s,i,i+1)).join("")}</div>
  </div>
  <div class="container">
    <div class="section-head"><div><div class="section-eyebrow"><i class="fa-regular fa-clock"></i> Just added</div><h2>Newest Scripts</h2></div><a class="view-all" href="#/scripts?sort=newest">View all <i class="fa-solid fa-arrow-right"></i></a></div>
    <div class="grid grid-4">${newest.map((s,i)=>cardHTML(s,i)).join("")}</div>
  </div>`;
}

function pageScripts(params) {
  const search = params.get("search") || "";
  const game = params.get("game") || "all";
  const tag = params.get("tag") || "all";
  const sort = params.get("sort") || "newest";
  let list = getScripts();
  if (search) { const q = search.toLowerCase(); list = list.filter(s => s.title.toLowerCase().includes(q) || s.game.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)); }
  if (game !== "all") list = list.filter(s => s.game === game);
  if (tag !== "all") list = list.filter(s => s.tags.includes(tag));
  if (sort === "views") list.sort((a,b)=>b.views-a.views);
  else if (sort === "likes") list.sort((a,b)=>b.likedBy.length-a.likedBy.length);
  else list.sort((a,b)=>b.created-a.created);
  const opt = (v,l,cur)=>`<option value="${v}" ${v===cur?"selected":""}>${l}</option>`;
  return `<div class="container">
    <h1 style="font-size:36px">Browse Scripts</h1>
    <p class="muted">${list.length} scripts found</p>
    <div class="filters">
      <form class="search" onsubmit="applySearch(event)"><i class="fa-solid fa-magnifying-glass"></i><input id="fSearch" value="${esc(search)}" placeholder="Search by name or game..."/></form>
      <select onchange="setParam('game',this.value)">${opt("all","All Games",game)}${GAMES.map(g=>opt(g,g,game)).join("")}</select>
      <select onchange="setParam('tag',this.value)">${opt("all","All Tags",tag)}${TAGS.map(t=>opt(t,t,tag)).join("")}</select>
      <select onchange="setParam('sort',this.value)">${opt("newest","Newest",sort)}${opt("views","Most Viewed",sort)}${opt("likes","Most Liked",sort)}</select>
    </div>
    ${list.length ? `<div class="grid grid-4">${list.map((s,i)=>cardHTML(s,i)).join("")}</div>` : `<div class="empty">No scripts found. Try a different search or filter.</div>`}
  </div>`;
}

function pageCategories() {
  const all = getScripts();
  return `<div class="container">
    <h1 style="font-size:36px">Game Categories</h1>
    <p class="muted">Pick a game and find the best scripts for it.</p>
    <div class="grid grid-3" style="margin-top:32px">
      ${GAMES.map((g,i)=>`<a class="cat-tile big animate-up" href="#/scripts?game=${encodeURIComponent(g)}" style="animation-delay:${i*50}ms"><img src="${THUMB[g]}"/><div class="cat-info"><div class="emoji" style="font-size:28px">${EMOJI[g]}</div><h3>${esc(g)}</h3><div class="cat-count">${all.filter(s=>s.game===g).length} scripts available</div></div></a>`).join("")}
    </div></div>`;
}

function pageDetail(id) {
  const s = findScript(id);
  if (!s) return `<div class="container"><div class="empty">Script not found.</div></div>`;
  s.views++; saveScript(s);
  const u = DB.user;
  const liked = u && s.likedBy.includes(u.email);
  const fav = u && s.favBy.includes(u.email);
  const related = getScripts().filter(x => x.game === s.game && x.id !== s.id).slice(0,3);
  return `<div class="container"><div class="detail">
    <div>
      <div class="detail-hero"><img src="${s.thumbnail}"/></div>
      <div style="margin-top:20px">
        <span style="color:#67e8f9;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px">${esc(s.game)}</span>
        <h1>${esc(s.title)}</h1>
        <div class="detail-meta">
          <span><i class="fa-solid fa-eye"></i> ${s.views} views</span>
          <span><i class="fa-solid fa-heart"></i> ${s.likedBy.length} likes</span>
          <span><i class="fa-solid fa-star"></i> ${s.favBy.length} favorites</span>
          <span><i class="fa-solid fa-user"></i> ${esc(s.author)}</span>
        </div>
        <div class="tags" style="margin-top:14px">${s.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
      <p class="desc">${esc(s.description)}</p>
      <div class="code-box">
        <div class="code-toolbar"><span class="fname">script.lua</span><div class="actions">
          <button class="btn-copy" onclick="copyCode('${s.id}')"><i class="fa-solid fa-copy"></i> Copy Script</button>
          <button class="btn-dl" onclick="downloadCode('${s.id}')"><i class="fa-solid fa-download"></i> Download</button>
        </div></div>
        <pre><code id="code-${s.id}">${esc(s.code)}</code></pre>
      </div>
      <div class="action-row">
        <button class="${liked?"active-like":""}" onclick="toggleLike('${s.id}')"><i class="fa-solid fa-heart"></i> ${liked?"Liked":"Like"} (${s.likedBy.length})</button>
        <button class="${fav?"active-fav":""}" onclick="toggleFav('${s.id}')"><i class="fa-solid fa-star"></i> ${fav?"Favorited":"Favorite"} (${s.favBy.length})</button>
      </div>
      <div class="comments">
        <h3><i class="fa-solid fa-comment"></i> Comments (${s.comments.length})</h3>
        <form class="comment-form" onsubmit="postComment(event,'${s.id}')">
          <input id="commentInput" placeholder="${u?"Add a comment...":"Sign in to comment"}" ${u?"":"disabled"}/>
          <button type="submit" class="btn-primary" ${u?"":"disabled"}><i class="fa-solid fa-paper-plane"></i></button>
        </form>
        ${s.comments.length ? s.comments.map(c=>`<div class="comment"><div class="avatar">${esc(c.name[0].toUpperCase())}</div><div><div class="comment-head"><span class="name">${esc(c.name)}</span><span class="time">${ago(c.ts)}</span></div><p style="margin-top:4px;font-size:14px;color:#cbd5e1">${esc(c.text)}</p></div></div>`).join("") : `<p class="muted">No comments yet. Be the first!</p>`}
      </div>
    </div>
    <div class="sidebar">
      <h3>Related Scripts</h3>
      ${related.length ? related.map((r,i)=>cardHTML(r,i)).join("") : `<p class="muted">No related scripts.</p>`}
      <a class="view-all" style="display:block;text-align:center;margin-top:16px" href="#/scripts">Browse all scripts →</a>
    </div>
  </div></div>`;
}

function pageUpload() {
  if (!DB.user) return `<div class="container"><div class="empty">Please sign in to upload a script.</div></div>`;
  return `<div class="container">
    <div class="section-eyebrow"><i class="fa-solid fa-cloud-arrow-up"></i> Share with the community</div>
    <h1 style="font-size:36px;margin:4px 0 24px">Upload a Script</h1>
    <form class="form-card" onsubmit="submitUpload(event)">
      <label>Title</label><input id="uTitle" required placeholder="e.g. Blox Fruits Auto-Farm Pro"/>
      <label>Game</label><select id="uGame" required><option value="">Select a game</option>${GAMES.map(g=>`<option>${g}</option>`).join("")}</select>
      <label>Description</label><textarea id="uDesc" required placeholder="What does this script do?"></textarea>
      <label>Lua Code</label><textarea id="uCode" class="code-input" required placeholder='loadstring(game:HttpGet("..."))()'></textarea>
      <label>Thumbnail URL <span style="color:#64748b">(optional)</span></label><input id="uThumb" placeholder="https://..."/>
      <label>Tags</label><div class="tag-select" id="uTags">${TAGS.map(t=>`<button type="button" data-tag="${t}" onclick="this.classList.toggle('active')">${t}</button>`).join("")}</div>
      <button type="submit" class="btn-primary" style="width:100%;justify-content:center;margin-top:24px">Publish Script</button>
    </form></div>`;
}

function pageAccount() {
  const u = DB.user;
  if (!u) return `<div class="container"><div class="empty">Please sign in to view your account.</div></div>`;
  const tab = location.hash.includes("tab=mine") ? "mine" : "favorites";
  const favs = getScripts().filter(s => s.favBy.includes(u.email));
  const mine = getScripts().filter(s => s.author === u.name);
  const list = tab === "mine" ? mine : favs;
  const empty = tab === "mine" ? "You haven't uploaded any scripts yet." : "No favorites yet. Tap the star on a script!";
  return `<div class="container">
    <div class="profile"><div class="avatar">${esc(u.name[0].toUpperCase())}</div><div><h1 style="font-size:28px">${esc(u.name)}</h1><p class="muted" style="margin-top:2px">${esc(u.email)}</p>${u.role==="admin"?`<span style="color:#67e8f9;font-size:12px;font-weight:600">Administrator</span>`:""}</div></div>
    <div class="page-tabs">
      <button class="${tab==="favorites"?"active":""}" onclick="location.hash='#/account?tab=favorites'"><i class="fa-solid fa-star"></i> Favorites</button>
      <button class="${tab==="mine"?"active":""}" onclick="location.hash='#/account?tab=mine'"><i class="fa-solid fa-file-code"></i> My Scripts</button>
    </div>
    ${list.length ? `<div class="grid grid-3">${list.map((s,i)=>cardHTML(s,i)).join("")}</div>` : `<div class="empty">${empty}</div>`}
  </div>`;
}

function pageAdmin() {
  const u = DB.user;
  if (!u || u.role !== "admin") return `<div class="container"><div class="empty">Admin access required.</div></div>`;
  const all = getScripts();
  const comments = all.reduce((a,s)=>a+s.comments.length,0);
  return `<div class="container">
    <div class="section-eyebrow" style="color:#67e8f9"><i class="fa-solid fa-shield-halved"></i> Moderation</div>
    <h1 style="font-size:36px;margin:4px 0">Admin Panel</h1>
    <div class="stats-grid">
      <div class="stat"><i class="fa-solid fa-file-code"></i><div class="num">${all.length}</div><div class="lbl">Total Scripts</div></div>
      <div class="stat"><i class="fa-solid fa-users"></i><div class="num">${DB.users.length}</div><div class="lbl">Registered Users</div></div>
      <div class="stat"><i class="fa-solid fa-comment"></i><div class="num">${comments}</div><div class="lbl">Comments</div></div>
    </div>
    <h2 style="font-size:20px;margin:32px 0 16px">Manage Scripts</h2>
    ${all.map(s=>`<div class="admin-row"><img src="${s.thumbnail}"/><div class="info"><a href="#/script/${s.id}" style="font-weight:600">${esc(s.title)}</a><div class="muted" style="font-size:12px;margin-top:2px">${esc(s.game)} · ${s.views} views · ${s.likedBy.length} likes · by ${esc(s.author)}</div></div><button class="del" onclick="adminDelete('${s.id}')"><i class="fa-solid fa-trash"></i></button></div>`).join("")}
  </div>`;
}

/* ---------- actions ---------- */
window.goSearch = e => { e.preventDefault(); location.hash = "#/scripts?search=" + encodeURIComponent($("#heroSearch").value); };
window.applySearch = e => { e.preventDefault(); setParam("search", $("#fSearch").value); };
window.setParam = (k,v) => {
  const [path, qs] = (location.hash.slice(1)).split("?");
  const p = new URLSearchParams(qs || "");
  if (v && v !== "all") p.set(k,v); else p.delete(k);
  location.hash = "#" + path + (p.toString() ? "?" + p.toString() : "");
};
window.copyCode = id => { navigator.clipboard.writeText(findScript(id).code); toast("Script copied to clipboard!"); };
window.downloadCode = id => {
  const s = findScript(id);
  const blob = new Blob([s.code], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = s.title.replace(/\s+/g,"_")+".lua"; a.click();
  URL.revokeObjectURL(a.href); toast("Downloading .lua file");
};
function requireAuth() { if (!DB.user) { toast("Please sign in first","error"); return false; } return true; }
window.toggleLike = id => {
  if (!requireAuth()) return;
  const s = findScript(id), e = DB.user.email;
  s.likedBy.includes(e) ? s.likedBy = s.likedBy.filter(x=>x!==e) : s.likedBy.push(e);
  saveScript(s); render();
};
window.toggleFav = id => {
  if (!requireAuth()) return;
  const s = findScript(id), e = DB.user.email;
  const on = !s.favBy.includes(e);
  on ? s.favBy.push(e) : s.favBy = s.favBy.filter(x=>x!==e);
  saveScript(s); toast(on?"Added to favorites":"Removed from favorites"); render();
};
window.postComment = (e,id) => {
  e.preventDefault();
  if (!requireAuth()) return;
  const val = $("#commentInput").value.trim(); if (!val) return;
  const s = findScript(id);
  s.comments.unshift({ name: DB.user.name, text: val, ts: Date.now() });
  saveScript(s); render();
};
window.submitUpload = e => {
  e.preventDefault();
  const game = $("#uGame").value; if (!game) { toast("Please select a game","error"); return; }
  const tags = [...document.querySelectorAll("#uTags button.active")].map(b=>b.dataset.tag);
  const id = "u" + Date.now();
  const arr = getScripts();
  arr.unshift({ id, title: $("#uTitle").value, game, description: $("#uDesc").value, code: $("#uCode").value,
    thumbnail: $("#uThumb").value || THUMB[game], author: DB.user.name, tags, views: 0, likedBy: [], favBy: [], comments: [], created: Date.now() });
  DB.scripts = arr; toast("Script published!"); location.hash = "#/script/" + id;
};
window.adminDelete = id => {
  if (!confirm("Delete this script permanently?")) return;
  DB.scripts = getScripts().filter(s => s.id !== id);
  toast("Script deleted"); render();
};

/* ---------- auth ---------- */
function openAuth() { $("#authModal").classList.add("open"); }
function closeAuth() { $("#authModal").classList.remove("open"); $("#authError").textContent = ""; }
window.logout = () => { DB.user = null; toast("Logged out"); renderAuthArea(); render(); };

function renderAuthArea() {
  const u = DB.user;
  $("#navAdmin").style.display = (u && u.role === "admin") ? "inline" : "none";
  const area = $("#authArea");
  if (u) {
    area.innerHTML = `<span style="display:inline-flex;gap:14px;align-items:center;margin-left:8px">
      <a href="#/upload" class="btn-primary" style="padding:8px 14px"><i class="fa-solid fa-upload"></i> Upload</a>
      <a href="#/account" title="Account"><i class="fa-solid fa-user"></i></a>
      <button class="icon-btn" onclick="logout()" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button></span>`;
  } else {
    area.innerHTML = `<button class="btn-primary" onclick="openAuth()" style="margin-left:8px">Sign In</button>`;
  }
  renderMobileNav();
}

function renderMobileNav() {
  const u = DB.user;
  $("#mobileNav").innerHTML = `
    <a href="#/">Home</a><a href="#/scripts">Scripts</a><a href="#/categories">Categories</a>
    ${u && u.role==="admin" ? `<a href="#/admin" style="color:#67e8f9">Admin</a>` : ""}
    ${u ? `<a href="#/upload">Upload Script</a><a href="#/account">My Account</a><button onclick="logout()" style="color:#f87171">Logout</button>`
        : `<button onclick="openAuth()" style="color:#c4b5fd">Sign In</button>`}`;
}

/* ---------- router ---------- */
function render() {
  const raw = location.hash.slice(1) || "/";
  const [path, qs] = raw.split("?");
  const params = new URLSearchParams(qs || "");
  let html;
  if (path === "/" || path === "") html = pageHome();
  else if (path === "/scripts") html = pageScripts(params);
  else if (path === "/categories") html = pageCategories();
  else if (path.startsWith("/script/")) html = pageDetail(path.split("/")[2]);
  else if (path === "/upload") html = pageUpload();
  else if (path === "/account") html = pageAccount();
  else if (path === "/admin") html = pageAdmin();
  else html = pageHome();
  $("#app").innerHTML = html;
  $("#mobileNav").classList.remove("open");
  window.scrollTo(0, 0);
}

/* ---------- init ---------- */
seed();
$("#year").textContent = new Date().getFullYear();
renderAuthArea();
render();
window.addEventListener("hashchange", () => { render(); renderAuthArea(); });

$("#searchForm").addEventListener("submit", e => { e.preventDefault(); location.hash = "#/scripts?search=" + encodeURIComponent($("#searchInput").value); });
$("#menuBtn").addEventListener("click", () => $("#mobileNav").classList.toggle("open"));
$("#authClose").addEventListener("click", closeAuth);
$("#authModal").addEventListener("click", e => { if (e.target.id === "authModal") closeAuth(); });

document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  const login = t.dataset.tab === "login";
  $("#loginForm").style.display = login ? "flex" : "none";
  $("#registerForm").style.display = login ? "none" : "flex";
  $("#authError").textContent = "";
}));

$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#loginEmail").value.toLowerCase(), pass = $("#loginPassword").value;
  const u = DB.users.find(x => x.email === email && x.password === pass);
  if (!u) { $("#authError").textContent = "Invalid email or password"; return; }
  DB.user = { name: u.name, email: u.email, role: u.role }; closeAuth(); toast("Welcome back!"); renderAuthArea(); render();
});
$("#registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#regName").value, email = $("#regEmail").value.toLowerCase(), pass = $("#regPassword").value;
  const users = DB.users;
  if (users.find(x => x.email === email)) { $("#authError").textContent = "Email already registered"; return; }
  users.push({ name, email, password: pass, role: "user" }); DB.users = users;
  DB.user = { name, email, role: "user" }; closeAuth(); toast("Account created!"); renderAuthArea(); render();
});
