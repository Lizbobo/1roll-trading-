import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowDownToLine, ArrowUpToLine, BarChart3, Bell, ChevronDown,
  CircleHelp, Gauge, LayoutDashboard, Menu, Search, ShieldCheck, Sparkles,
  Wallet, X, Zap
} from "lucide-react";
import "./style.css";

const initialTokens = [
  { name: "MoonRoll", symbol: "$ROLL", price: 0.000184, change: 42.8, risk: 34, liq: "High", holders: 18420 },
  { name: "Cheetah", symbol: "$CHEET", price: 0.000071, change: 18.2, risk: 51, liq: "Medium", holders: 9210 },
  { name: "Kenya Coin", symbol: "$KENC", price: 0.00192, change: -7.4, risk: 63, liq: "Medium", holders: 7310 },
  { name: "TurboRoll", symbol: "$TROLL", price: 0.00039, change: 9.7, risk: 41, liq: "High", holders: 12740 }
];

function App() {
  const [tab, setTab] = useState("Dashboard");
  const [tokens, setTokens] = useState(initialTokens);
  const [selected, setSelected] = useState(initialTokens[0]);
  const [balance, setBalance] = useState(1000);
  const [amount, setAmount] = useState("25");
  const [mode, setMode] = useState("Protected");
  const [message, setMessage] = useState("Demo mode: no real funds are used.");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", symbol: "", supply: "1000000000" });

  const filtered = useMemo(
    () => tokens.filter(t => `${t.name} ${t.symbol}`.toLowerCase().includes(search.toLowerCase())),
    [tokens, search]
  );

  const trade = (side) => {
    const value = Math.max(0, Number(amount) || 0);
    if (!value) return setMessage("Enter a demo trade amount.");
    if (side === "BUY" && value > balance) return setMessage("Demo balance is too low.");
    setBalance(b => side === "BUY" ? b - value : b + value);
    setMessage(`${side} simulated: $${value.toFixed(2)} of ${selected.symbol}. No real transaction was sent.`);
  };

  const launch = (e) => {
    e.preventDefault();
    if (!form.name || !form.symbol) return setMessage("Add a token name and symbol.");
    const token = {
      name: form.name,
      symbol: "$" + form.symbol.replace("$","").toUpperCase(),
      price: 0.0001,
      change: 0,
      risk: 48,
      liq: "Low",
      holders: 1
    };
    setTokens([token, ...tokens]);
    setSelected(token);
    setTab("Trade");
    setMessage(`${token.name} was created in DEMO mode only.`);
    setForm({ name: "", symbol: "", supply: "1000000000" });
  };

  const nav = [
    ["Dashboard", LayoutDashboard],
    ["Trade", BarChart3],
    ["Discover", Zap],
    ["Launch Token", Sparkles],
    ["Risk Center", ShieldCheck]
  ];

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-btn mobile-only" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={21}/></button>
        <div className="brand"><span className="brand-mark">1</span><span>1roll <b>TRADING</b></span></div>
        <div className="search"><Search size={17}/><input placeholder="Search tokens..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="top-actions">
          <span className="demo-pill"><span className="dot"/> DEMO / TEST</span>
          <button className="icon-btn"><Bell size={18}/></button>
          <button className="wallet"><Wallet size={17}/> Demo Wallet <ChevronDown size={15}/></button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileOpen ? "open":""}`}>
          <div className="side-title">PLATFORM</div>
          {nav.map(([label, Icon]) => (
            <button key={label} className={`nav ${tab===label?"active":""}`} onClick={()=>{setTab(label);setMobileOpen(false)}}>
              <Icon size={18}/><span>{label}</span>
            </button>
          ))}
          <div className="side-card">
            <ShieldCheck size={19}/>
            <div><strong>Protected Mode</strong><small>Risk controls enabled</small></div>
          </div>
          <div className="side-bottom">
            <button className="nav"><CircleHelp size={18}/> Help</button>
            <small>Prototype v1.0</small>
          </div>
        </aside>

        <main className="main">
          <div className="notice"><Activity size={16}/> Everything here is simulated for testing. No real assets or transactions are involved.</div>

          {tab === "Dashboard" && <Dashboard filtered={filtered} selected={selected} setSelected={setSelected} balance={balance} setTab={setTab} />}
          {tab === "Trade" && <Trade selected={selected} amount={amount} setAmount={setAmount} mode={mode} setMode={setMode} trade={trade} message={message} />}
          {tab === "Discover" && <Discover tokens={filtered} selected={selected} setSelected={setSelected} />}
          {tab === "Launch Token" && <Launch form={form} setForm={setForm} launch={launch} />}
          {tab === "Risk Center" && <Risk selected={selected} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ filtered, selected, setSelected, balance, setTab }) {
  return <section>
    <div className="page-head"><div><p className="eyebrow">MARKET OVERVIEW</p><h1>Welcome to 1roll</h1><p>Trade, discover and launch memecoins in a controlled demo environment.</p></div><button className="primary" onClick={()=>setTab("Launch Token")}><Sparkles size={17}/> Create token</button></div>
    <div className="stats">
      <Stat title="Demo balance" value={`$${balance.toFixed(2)}`} sub="Available to simulate"/>
      <Stat title="24h volume" value="$2.84M" sub="+16.4% simulated"/>
      <Stat title="Protected markets" value="84" sub="Risk checks active"/>
      <Stat title="Avg. risk score" value="46/100" sub="Lower is safer"/>
    </div>
    <div className="grid-2">
      <div className="panel chart-panel">
        <div className="panel-head"><div><h3>Market activity</h3><span>Simulated ROLL/USD</span></div><span className="gain">+42.8%</span></div>
        <svg className="chart" viewBox="0 0 700 260" preserveAspectRatio="none">
          <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopOpacity=".28"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs>
          <path d="M0 220 C50 210 70 170 110 184 S180 130 220 150 S280 105 320 128 S390 80 425 105 S500 65 535 86 S610 40 650 65 S680 45 700 28 L700 260 L0 260 Z" fill="url(#g)"/>
          <path d="M0 220 C50 210 70 170 110 184 S180 130 220 150 S280 105 320 128 S390 80 425 105 S500 65 535 86 S610 40 650 65 S680 45 700 28" fill="none" stroke="currentColor" strokeWidth="4"/>
        </svg>
        <div className="chart-labels"><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>Now</span></div>
      </div>
      <div className="panel">
        <div className="panel-head"><div><h3>Trending markets</h3><span>Demo market feed</span></div><button className="link" onClick={()=>setTab("Discover")}>View all</button></div>
        <div className="token-list">{filtered.slice(0,4).map(t=><TokenRow key={t.symbol} t={t} onClick={()=>{setSelected(t);setTab("Trade")}}/>)}</div>
      </div>
    </div>
    <div className="panel risk-strip"><div><Gauge size={23}/><div><strong>Protected trading is active</strong><span>Orders are simulated and risk data is shown before every demo trade.</span></div></div><button className="secondary" onClick={()=>setTab("Risk Center")}>Open Risk Center</button></div>
  </section>
}

function Trade({ selected, amount, setAmount, mode, setMode, trade, message }) {
  return <section>
    <div className="page-head"><div><p className="eyebrow">SIMULATED EXECUTION</p><h1>Trade {selected.symbol}</h1><p>{selected.name} · Demo price ${selected.price}</p></div><span className="demo-pill large"><span className="dot"/> NO REAL ORDERS</span></div>
    <div className="trade-grid">
      <div className="panel chart-panel big"><div className="panel-head"><div><h3>{selected.name}</h3><span>Simulated price chart</span></div><span className={selected.change>=0?"gain":"loss"}>{selected.change>=0?"+":""}{selected.change}%</span></div><svg className="chart tall" viewBox="0 0 800 320" preserveAspectRatio="none"><path d="M0 275 C70 270 80 220 140 240 S220 160 280 195 S350 115 410 145 S470 190 520 125 S590 100 630 65 S720 95 800 35" fill="none" stroke="currentColor" strokeWidth="4"/></svg></div>
      <div className="panel order">
        <div className="mode-row"><span>Protection</span><div className="toggle"><button className={mode==="Protected"?"on":""} onClick={()=>setMode("Protected")}>Protected</button><button className={mode==="Advanced"?"on":""} onClick={()=>setMode("Advanced")}>Advanced</button></div></div>
        <div className="risk-box"><ShieldCheck size={21}/><div><b>Risk score {selected.risk}/100</b><span>{selected.risk < 40 ? "Lower risk profile" : selected.risk < 60 ? "Moderate risk profile" : "High risk — review before trading"}</span></div></div>
        <label>Demo amount (USD)</label><input className="amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="1"/>
        <div className="quick"><button onClick={()=>setAmount("10")}>$10</button><button onClick={()=>setAmount("25")}>$25</button><button onClick={()=>setAmount("50")}>$50</button><button onClick={()=>setAmount("100")}>$100</button></div>
        <div className="buy-sell"><button className="buy" onClick={()=>trade("BUY")}><ArrowUpToLine size={17}/> Buy</button><button className="sell" onClick={()=>trade("SELL")}><ArrowDownToLine size={17}/> Sell</button></div>
        <div className="message">{message}</div>
      </div>
    </div>
  </section>
}

function Discover({tokens, selected, setSelected}) {
  return <section><div className="page-head"><div><p className="eyebrow">DISCOVERY</p><h1>Memecoin markets</h1><p>Compare liquidity, holders, momentum and risk before simulated trading.</p></div></div><div className="panel table"><div className="table-head"><span>Token</span><span>Price</span><span>24h</span><span>Risk</span><span>Liquidity</span><span>Holders</span></div>{tokens.map(t=><button className="table-row" key={t.symbol} onClick={()=>setSelected(t)}><b>{t.name}<small>{t.symbol}</small></b><span>${t.price}</span><span className={t.change>=0?"gain":"loss"}>{t.change>=0?"+":""}{t.change}%</span><span><i className={`risk-dot r${t.risk>60?3:t.risk>40?2:1}`}/>{t.risk}/100</span><span>{t.liq}</span><span>{t.holders.toLocaleString()}</span></button>)}</div></section>
}

function Launch({form,setForm,launch}) {
  return <section><div className="page-head"><div><p className="eyebrow">TOKEN STUDIO</p><h1>Launch a memecoin</h1><p>Create a token configuration for the simulator. Nothing is deployed to a blockchain.</p></div></div>
    <form className="launch panel" onSubmit={launch}>
      <div className="form-grid"><label>Token name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. 1roll Dog"/></label><label>Symbol<input value={form.symbol} onChange={e=>setForm({...form,symbol:e.target.value})} placeholder="e.g. ROLLX"/></label><label>Total supply<input value={form.supply} onChange={e=>setForm({...form,supply:e.target.value})} /></label><label>Network<input value="Solana — DEMO" disabled /></label></div>
      <div className="checks"><Check text="Creator allocation displayed"/><Check text="Holder concentration warning"/><Check text="Liquidity risk estimate"/><Check text="Contract-risk placeholder"/></div>
      <button className="primary wide"><Sparkles size={17}/> Create demo token</button>
    </form>
  </section>
}

function Risk({selected}) {
  const factors = [["Liquidity", selected.liq==="High"?88:selected.liq==="Medium"?62:35],["Holder distribution", selected.risk<45?78:55],["Creator concentration", selected.risk<45?81:49],["Contract safety", selected.risk<55?86:58],["Volatility", selected.change>25?31:67]];
  return <section><div className="page-head"><div><p className="eyebrow">RISK CENTER</p><h1>Risk intelligence</h1><p>Risk controls help users understand volatility; they do not guarantee against losses.</p></div></div><div className="risk-hero panel"><div className="score">{selected.risk}<small>/100</small></div><div><h2>{selected.name} risk score</h2><p>{selected.risk<40?"Lower simulated risk":"Elevated simulated risk"} based on the demo factors below.</p></div></div><div className="panel factors">{factors.map(([name,value])=><div className="factor" key={name}><div><b>{name}</b><span>{value}/100</span></div><div className="bar"><i style={{width:`${value}%`}}/></div>)}</div></section>
}

function Stat({title,value,sub}){return <div className="stat panel"><span>{title}</span><strong>{value}</strong><small>{sub}</small></div>}
function TokenRow({t,onClick}){return <button className="token-row" onClick={onClick}><span className="coin">{t.symbol.replace("$","").slice(0,2)}</span><b>{t.name}<small>{t.symbol}</small></b><span className="row-price">${t.price}</span><span className={t.change>=0?"gain":"loss"}>{t.change>=0?"+":""}{t.change}%</span></button>}
function Check({text}){return <div className="check"><ShieldCheck size={17}/>{text}</div>}

createRoot(document.getElementById("root")).render(<App />);
