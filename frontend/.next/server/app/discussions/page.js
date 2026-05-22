(()=>{var e={};e.id=693,e.ids=[693],e.modules={49262:e=>{"use strict";e.exports=require("@prisma/client/runtime/client")},47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},35900:e=>{"use strict";e.exports=require("pg")},21656:e=>{"use strict";e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs")},30245:e=>{"use strict";e.exports=import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs")},39491:e=>{"use strict";e.exports=require("assert")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},95687:e=>{"use strict";e.exports=require("https")},72254:e=>{"use strict";e.exports=require("node:buffer")},49411:e=>{"use strict";e.exports=require("node:path")},41041:e=>{"use strict";e.exports=require("node:url")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},20073:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>d.a,__next_app__:()=>u,originalPathname:()=>E,pages:()=>c,routeModule:()=>m,tree:()=>l}),t(41308),t(60897),t(28111),t(35866);var r=t(23191),i=t(88716),a=t(37922),d=t.n(a),n=t(95231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);t.d(s,o);let l=["",{children:["discussions",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,41308)),"C:\\Users\\donth\\OneDrive\\Desktop\\skillswap-hub\\frontend\\app\\discussions\\page.tsx"]}]},{loading:[()=>Promise.resolve().then(t.bind(t,60897)),"C:\\Users\\donth\\OneDrive\\Desktop\\skillswap-hub\\frontend\\app\\discussions\\loading.tsx"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,28111)),"C:\\Users\\donth\\OneDrive\\Desktop\\skillswap-hub\\frontend\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\donth\\OneDrive\\Desktop\\skillswap-hub\\frontend\\app\\discussions\\page.tsx"],E="/discussions/page",u={require:t,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/discussions/page",pathname:"/discussions",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},68719:(e,s,t)=>{let r={"5ba87ccb8effad8050ca8b31e201e4a70a8018af":()=>Promise.resolve().then(t.bind(t,70627)).then(e=>e.sendPrivateMessage)};async function i(e,...s){return(await r[e]()).apply(null,s)}e.exports={"5ba87ccb8effad8050ca8b31e201e4a70a8018af":i.bind(null,"5ba87ccb8effad8050ca8b31e201e4a70a8018af")}},62817:(e,s,t)=>{Promise.resolve().then(t.bind(t,26445)),Promise.resolve().then(t.bind(t,16361))},35303:()=>{},26445:(e,s,t)=>{"use strict";t.d(s,{default:()=>o});var r=t(10326),i=t(90434),a=t(39730),d=t(69436);t(15424);var n=(0,t(46242).$)("5ba87ccb8effad8050ca8b31e201e4a70a8018af");function o({currentUserId:e,partners:s,activePartner:t,messages:o}){return(0,r.jsxs)("section",{className:"grid min-h-[620px] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-xl shadow-slate-950/20 lg:grid-cols-[320px_1fr]",children:[(0,r.jsxs)("aside",{className:"border-b border-white/10 bg-white/60 lg:border-b-0 lg:border-r",children:[(0,r.jsxs)("div",{className:"border-b border-white/10 p-4",children:[r.jsx("p",{className:"text-xs font-bold uppercase tracking-[0.18em] text-muted",children:"Connected Partners"}),r.jsx("h2",{className:"mt-1 text-xl font-bold text-slate-950",children:"Private Chats"})]}),r.jsx("div",{className:"max-h-[560px] overflow-y-auto p-3",children:s.length?s.map(e=>{let s=t?.id===e.id;return(0,r.jsxs)(i.default,{href:`/discussions?partner=${e.id}`,className:`flex gap-3 rounded-xl p-3 transition ${s?"bg-primary/15 text-slate-950":"hover:bg-white/80"}`,children:[r.jsx("div",{className:"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary",children:e.initials}),(0,r.jsxs)("div",{className:"min-w-0",children:[r.jsx("p",{className:"truncate font-bold text-slate-950",children:e.name}),r.jsx("p",{className:"truncate text-xs text-muted",children:e.role||"Skill partner"}),r.jsx("p",{className:"mt-1 truncate text-xs font-semibold text-primary",children:e.skill||"Skill swap"})]})]},e.id)}):r.jsx("div",{className:"rounded-xl border border-dashed border-white/10 bg-white/70 p-5 text-center text-sm text-muted",children:"Accept a swap request to unlock private discussions."})})]}),r.jsx("div",{className:"flex min-h-[620px] flex-col",children:t?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("header",{className:"flex items-center gap-3 border-b border-white/10 bg-white/70 p-4",children:[r.jsx("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary",children:t.initials}),(0,r.jsxs)("div",{children:[r.jsx("h2",{className:"text-lg font-bold text-slate-950",children:t.name}),r.jsx("p",{className:"text-sm text-muted",children:t.skill||"Accepted swap partner"})]})]}),r.jsx("div",{className:"flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4",children:o.length?o.map(s=>{let t=s.senderId===e;return r.jsx("div",{className:`flex ${t?"justify-end":"justify-start"}`,children:(0,r.jsxs)("div",{className:`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${t?"rounded-br-md bg-primary text-white":"rounded-bl-md border border-slate-200 bg-white text-slate-900"}`,children:[r.jsx("p",{className:"leading-6",children:s.content}),r.jsx("p",{className:`mt-1 text-right text-[0.68rem] font-semibold ${t?"text-white/75":"text-slate-400"}`,children:new Date(s.timestamp).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})})]})},s.id)}):r.jsx("div",{className:"flex h-full items-center justify-center text-center text-muted",children:(0,r.jsxs)("div",{children:[r.jsx(a.Z,{className:"mx-auto mb-3 h-10 w-10 text-primary"}),r.jsx("p",{className:"font-semibold",children:"No messages yet."})]})})}),(0,r.jsxs)("form",{action:n,className:"flex gap-3 border-t border-white/10 bg-white/80 p-4",children:[r.jsx("input",{type:"hidden",name:"receiverId",value:t.id}),r.jsx("input",{name:"content",required:!0,placeholder:`Message ${t.name}`,className:"min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary"}),(0,r.jsxs)("button",{className:"inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-light",children:[r.jsx(d.Z,{className:"h-4 w-4"}),"Send"]})]})]}):r.jsx("div",{className:"flex flex-1 items-center justify-center p-8 text-center text-muted",children:(0,r.jsxs)("div",{children:[r.jsx(a.Z,{className:"mx-auto mb-3 h-10 w-10 text-primary"}),r.jsx("p",{className:"font-semibold",children:"Choose an accepted partner to start chatting."})]})})})]})}},39730:(e,s,t)=>{"use strict";t.d(s,{Z:()=>r});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,t(62881).Z)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},70627:(e,s,t)=>{"use strict";t.r(s),t.d(s,{sendPrivateMessage:()=>o});var r=t(27745);t(26461);var i=t(30207),a=t(44809),d=t(88296),n=t(72048);async function o(e){let s=await (0,a.requireCurrentUser)(),t=Number(e.get("receiverId")),r=String(e.get("content")||"").trim();Number.isInteger(t)&&t!==s.id&&r&&await d.prisma.swapRequest.findFirst({where:{status:"accepted",OR:[{senderId:s.id,receiverId:t},{senderId:t,receiverId:s.id}]},select:{id:!0}})&&(await (0,n.ensurePlatformTables)(),await d.prisma.message.create({data:{senderId:s.id,receiverId:t,content:r}}),(0,i.revalidatePath)("/discussions"))}(0,t(85723).ensureServerEntryExports)([o]),(0,r.registerServerReference)("5ba87ccb8effad8050ca8b31e201e4a70a8018af",o)},60897:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>i});var r=t(19510);function i(){return r.jsx("main",{className:"workspace-light min-h-screen px-4 pt-28",children:(0,r.jsxs)("div",{className:"mx-auto max-w-6xl rounded-2xl border border-white/10 bg-surface p-8 text-center text-muted",children:[r.jsx("div",{className:"mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-light border-t-transparent"}),"Loading discussions..."]})})}},41308:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>N,dynamic:()=>p});var r=t(19510);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,t(27162).Z)("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);var a=t(16065),d=t(90455),n=t(78556),o=t(97493),l=t(68570);let c=(0,l.createProxy)(String.raw`C:\Users\donth\OneDrive\Desktop\skillswap-hub\frontend\app\discussions\DiscussionsClient.tsx`),{__esModule:E,$$typeof:u}=c;c.default;let m=(0,l.createProxy)(String.raw`C:\Users\donth\OneDrive\Desktop\skillswap-hub\frontend\app\discussions\DiscussionsClient.tsx#default`),p="force-dynamic";async function N({searchParams:e}){let s=await (0,d.AP)();await (0,o.Y)();let t=await n._.swapRequest.findMany({where:{status:"accepted",OR:[{senderId:s.id},{receiverId:s.id}]},include:{sender:{select:{id:!0,name:!0,role:!0}},receiver:{select:{id:!0,name:!0,role:!0}}},orderBy:{updatedAt:"desc"}}),l=new Map;for(let e of t){if(!e.receiver)continue;let t=e.senderId===s.id?e.receiver:e.sender;l.has(t.id)||l.set(t.id,{id:t.id,name:t.name,role:t.role,initials:t.name.split(/\s+/).map(e=>e[0]).join("").slice(0,2).toUpperCase(),skill:e.skill||e.title})}let c=Array.from(l.values()),E=Number(e?.partner),u=c.find(e=>e.id===E)||c[0]||null,p=(u?await n._.message.findMany({where:{OR:[{senderId:s.id,receiverId:u.id},{senderId:u.id,receiverId:s.id}]},orderBy:{timestamp:"asc"}}):[]).map(e=>({id:e.id,senderId:e.senderId,receiverId:e.receiverId,content:e.content,timestamp:e.timestamp.toISOString()}));return(0,r.jsxs)("main",{className:"workspace-light min-h-screen",children:[r.jsx(a.ZP,{}),(0,r.jsxs)("section",{className:"mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8",children:[(0,r.jsxs)("div",{className:"mb-8",children:[(0,r.jsxs)("p",{className:"mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-primary",children:[r.jsx(i,{className:"h-4 w-4"}),"Private Messaging"]}),r.jsx("h1",{className:"font-display text-4xl font-bold sm:text-5xl",children:"Discussions"}),r.jsx("p",{className:"mt-3 max-w-2xl text-muted",children:"Chat privately with accepted swap partners. Conversations are limited to confirmed skill connections."})]}),r.jsx(m,{currentUserId:s.id,partners:c,activePartner:u,messages:p})]})]})}},72048:(e,s,t)=>{"use strict";t.d(s,{ensurePlatformTables:()=>i});var r=t(88296);async function i(){await r.prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS discussion_posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(180) NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      skill VARCHAR(120) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
      host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill VARCHAR(120) NOT NULL DEFAULT '',
      date DATE,
      time VARCHAR(16),
      scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status VARCHAR(24) NOT NULL DEFAULT 'scheduled',
      meeting_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS date DATE;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS time VARCHAR(16);

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_discussion_posts_author_id ON discussion_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_host_id ON sessions(host_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_guest_id ON sessions(guest_id);
    CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver_timestamp ON messages(sender_id, receiver_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_messages_receiver_sender_timestamp ON messages(receiver_id, sender_id, timestamp);
  `)}},97493:(e,s,t)=>{"use strict";t.d(s,{Y:()=>i});var r=t(78556);async function i(){await r._.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS discussion_posts (
      id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(180) NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      skill VARCHAR(120) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL,
      host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill VARCHAR(120) NOT NULL DEFAULT '',
      date DATE,
      time VARCHAR(16),
      scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status VARCHAR(24) NOT NULL DEFAULT 'scheduled',
      meeting_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS date DATE;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS time VARCHAR(16);

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_discussion_posts_author_id ON discussion_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_host_id ON sessions(host_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_guest_id ON sessions(guest_id);
    CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver_timestamp ON messages(sender_id, receiver_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_messages_receiver_sender_timestamp ON messages(receiver_id, sender_id, timestamp);
  `)}},27162:(e,s,t)=>{"use strict";t.d(s,{Z:()=>o});var r=t(71159);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),a=(...e)=>e.filter((e,s,t)=>!!e&&t.indexOf(e)===s).join(" ");/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r.forwardRef)(({color:e="currentColor",size:s=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:n="",children:o,iconNode:l,...c},E)=>(0,r.createElement)("svg",{ref:E,...d,width:s,height:s,stroke:e,strokeWidth:i?24*Number(t)/Number(s):t,className:a("lucide",n),...c},[...l.map(([e,s])=>(0,r.createElement)(e,s)),...Array.isArray(o)?o:[o]])),o=(e,s)=>{let t=(0,r.forwardRef)(({className:t,...d},o)=>(0,r.createElement)(n,{ref:o,iconNode:s,className:a(`lucide-${i(e)}`,t),...d}));return t.displayName=`${e}`,t}}};var s=require("../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[948,13,453,427,732,247,455,50,832],()=>t(20073));module.exports=r})();