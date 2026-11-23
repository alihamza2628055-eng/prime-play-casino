'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
const GAMES = [
  {
    "name": "Orion Star",
    "url": "http://start.orionstars.vip:8580/"
  },
  {
    "name": "Milkyway",
    "url": "https://milkywayapp.xyz/"
  },
  {
    "name": "Juwa",
    "url": "https://dl.juwa777.com/"
  },
  {
    "name": "Vblink",
    "url": "https://www.vblink777.club/"
  },
  {
    "name": "Juwa 2.0",
    "url": "https://m.juwa2.com/"
  },
  {
    "name": "Firekirin",
    "url": "https://firekirin.com/download-fire-kirin-app.ht"
  },
  {
    "name": "Vegas X",
    "url": "https://www.vegas-x.org"
  },
  {
    "name": "Game Vault",
    "url": "http://download.gamevault999.com/"
  },
  {
    "name": "Egame",
    "url": "https://www.egame99.club"
  },
  {
    "name": "Moolah",
    "url": "https://moolah.vip:8888"
  },
  {
    "name": "RiverSweep",
    "url": "https://bet777.eu/play/"
  },
  {
    "name": "Noble777",
    "url": "http://www.noble777.com"
  },
  {
    "name": "Highstake",
    "url": "https://dl.highstakesweeps.com/"
  },
  {
    "name": "Casino Royal",
    "url": "http://m.casinoroyale07.com"
  },
  {
    "name": "Vegas Sweep",
    "url": "http://m.lasvegassweeps.com"
  },
  {
    "name": "Ultrapanda",
    "url": "http://www.ultrapanda.mobi"
  },
  {
    "name": "Orion Power",
    "url": "http://download.orionpower.games:8008/"
  },
  {
    "name": "Winstar",
    "url": "https://www.winstar99999.com"
  },
  {
    "name": "Mafia 777",
    "url": "https://www.mafia77777.com"
  },
  {
    "name": "Paracasino",
    "url": "https://download.paracasino.net"
  },
  {
    "name": "Vegas Roll",
    "url": "http://www.vegas-roll.com/m"
  },
  {
    "name": "Mr. All in One",
    "url": "http://www.mrallinone777.com"
  },
  {
    "name": "Yolo 777",
    "url": "https://yolo777.game"
  },
  {
    "name": "Cash Machine",
    "url": "https://www.cashmachine777.com"
  },
  {
    "name": "Game Room",
    "url": "https://www.gameroom777.com/"
  },
  {
    "name": "Vegas Luck",
    "url": "https://start.vegasluck777.com/"
  },
  {
    "name": "Cash Frenzy",
    "url": "https://www.cashfrenzy777.com/"
  },
  {
    "name": "Panda Master",
    "url": "https://pandamaster.vip:8888/"
  },
  {
    "name": "River Pay",
    "url": "https://river777.net/build.30/index.html"
  },
  {
    "name": "Casino Ignite",
    "url": "https://h5.casinoignitee.vip/"
  },
  {
    "name": "Loot Game",
    "url": "https://m.lootgame777.com"
  },
  {
    "name": "Allinone",
    "url": "http://agentserver.mrallinone777.com"
  },
  {
    "name": "Winwin",
    "url": "https://winwinvegas777.com"
  },
  {
    "name": "Hukum",
    "url": "https://hukum777.online/"
  },
  {
    "name": "Mob.com",
    "url": "https://fpc-mob.com/"
  },
  {
    "name": "Highroller",
    "url": "https://www.highroller.com/casino"
  },
  {
    "name": "Dragon Crown",
    "url": "https://atlus.com/dragonscrown/"
  },
  {
    "name": "Lucky Master",
    "url": "https://lucky-master.net/"
  },
  {
    "name": "King of Pop",
    "url": "https://kingofpop777.com/"
  },
  {
    "name": "Firefonix",
    "url": "https://fpc-mob.com/AD/index.html"
  },
  {
    "name": "Bigwin",
    "url": "https://bigwplay.com"
  },
  {
    "name": "Thunderseven",
    "url": "https://thunderseven.com/"
  },
  {
    "name": "Gem Slots",
    "url": "https://www.gem77777.com/m"
  },
  {
    "name": "Winner Club",
    "url": "https://www.winnersclub777.com"
  },
  {
    "name": "Joker 777",
    "url": "https://www.joker777.win"
  },
  {
    "name": "Orion Strike",
    "url": "https://start.orionstrike777.com"
  },
  {
    "name": "Big Bang",
    "url": "https://www.bigbangcasino.vegas"
  },
  {
    "name": "Lucky Star",
    "url": "https://www.luckystars.games"
  },
  {
    "name": "Stars Galaxy",
    "url": "https://www.starsgalaxy777.com"
  },
  {
    "name": "Gem777",
    "url": "https://www.gem77777.com"
  },
  {
    "name": "Lucky Paradise",
    "url": "https://www.luckyparadise777.com"
  },
  {
    "name": "River Monster",
    "url": "https://rm777.net/"
  },
  {
    "name": "Mega Spin",
    "url": "https://megaspinpay.com/default.aspx"
  },
  {
    "name": "Sharks Secret 77",
    "url": "https://www.sharksecret777.com/"
  }
];
const METHODS = ['Cash App','Chime','PayPal','Venmo','Zelle','BTC','Skrill Account','Debit Card'];
type Inquiry = {id:string;selected_game:string;message:string;status:string;admin_reply:string|null;created_at:string};
export default function Home() {
 const [session,setSession]=useState<any>(null),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [game,setGame]=useState(''),[message,setMessage]=useState(''),[notice,setNotice]=useState(''),[inquiries,setInquiries]=useState<Inquiry[]>([]);
 const [busy,setBusy]=useState(false);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
 async function auth(mode:'signup'|'login') {
   setBusy(true);setNotice('');
   const result=mode==='signup'
    ? await supabase.auth.signUp({email,password,options:{data:{display_name:name||'Player'}}})
    : await supabase.auth.signInWithPassword({email,password});
   setBusy(false);setNotice(result.error?.message || (mode==='signup'?'Account created. Check your email if confirmation is enabled.':'Welcome back.'));
 }
 async function logout(){await supabase.auth.signOut();setInquiries([])}
 async function sendInquiry(e:React.FormEvent) {
   e.preventDefault(); if(!session){setNotice('Please sign in before sending a request.');return}
   if(!game){setNotice('Please choose a game.');return}
   setBusy(true);setNotice('');
   const result=await supabase.from('inquiries').insert({player_id:session.user.id,player_name:name||session.user.user_metadata?.display_name||'Player',player_email:session.user.email,selected_game:game,message:message.trim()||'I would like more information.'});
   setBusy(false);
   if(result.error)setNotice(result.error.message);else{setNotice('Your inquiry has been sent to the support team.');setMessage('');loadInbox()}
 }
 async function loadInbox(){if(!session)return;const r=await supabase.from('inquiries').select('*').eq('player_id',session.user.id).order('created_at',{ascending:false});if(!r.error)setInquiries(r.data||[])}
 useEffect(()=>{if(session)loadInbox()},[session]);
 const filtered=useMemo(()=>GAMES,[]);
 return <main className="shell"><div className="wrap">
  <header className="top"><div className="brand">PRIME PLAY <span>CASINO</span></div><div className="pill">PLAYER PORTAL</div></header>
  <section className="hero"><div className="status">WELCOME TO PRIME PLAY</div><h1>Choose your next<br/><span className="gold">game experience.</span></h1><p className="muted">Explore the game directory, create your player profile and contact our support team.</p><div className="notice">Promotional and payment services are not available through this website. Game links lead to external websites.</div></section>
  <h2>Player Account</h2>
  <section className="card">
   {session?<><p>Signed in as <b>{session.user.email}</b></p><button className="btn secondary" onClick={logout}>Sign Out</button><button className="btn secondary" style={{marginLeft:10}} onClick={loadInbox}>Refresh Inbox</button></>:<div className="form"><div className="row"><div><label>Your Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div><div><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div></div><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/><button className="btn" disabled={busy} onClick={()=>auth('signup')}>Create Account</button> <button className="btn secondary" disabled={busy} onClick={()=>auth('login')}>Sign In</button></div>}
   {notice&&<p className="notice">{notice}</p>}
  </section>
  <h2>Available Games</h2><p className="muted">Select a title to visit its external destination. External sites are not operated by Prime Play.</p>
  <div className="grid">{filtered.map((g:any)=><article className="card" key={g.name}><div className="status">GAME DIRECTORY</div><h3>{g.name}</h3><a className="btn secondary" href={g.url} target="_blank" rel="noopener noreferrer">Visit Game Site ↗</a></article>)}</div>
  <h2>Contact & Request Information</h2>
  <section className="card form">
   <form onSubmit={sendInquiry}>
    <label>Which Game Would You Like to Play?</label>
    <select value={game} onChange={e=>setGame(e.target.value)} required><option value="">Select a game</option>{GAMES.map((g:any)=><option key={g.name}>{g.name}</option>)}</select>
    <label>Available Payment Methods</label>
    <div className="grid">{METHODS.map(m=><div className="item" key={m}><b>{m}</b><div className="status">Currently Unavailable</div></div>)}</div>
    <div className="notice">Payment methods are shown for information only. Deposits and payment transactions are disabled.</div>
    <label>What Would You Like Help With?</label><textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your question or request..."/>
    <button className="btn" disabled={busy||!session}>Send Request</button>
    {!session&&<p className="small">Sign in to send an inquiry.</p>}
   </form>
  </section>
  <h2>Your Support Inbox</h2>
  <div className="list">{inquiries.map(i=><div className="item" key={i.id}><b>{i.selected_game}</b><p className="muted">{i.message}</p><span className="status">{i.status.toUpperCase()}</span>{i.admin_reply&&<div className="notice"><b>Admin reply:</b> {i.admin_reply}</div>}<div className="small">{new Date(i.created_at).toLocaleString()}</div></div>)}{inquiries.length===0&&<p className="muted">Your support requests and replies will appear here.</p>}</div>
  <footer className="small" style={{marginTop:50}}>© {new Date().getFullYear()} Prime Play. External links are provided for reference.</footer>
 </div></main>;
}
