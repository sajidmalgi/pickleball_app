const { useState, useEffect, useRef } = React;

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const SPORTS = ['Badminton','Pickleball','Volleyball','Basketball','Tennis','Table Tennis'];
const SPORT_ICONS = {
  'Badminton': 'BAD', 'Pickleball': 'PCK', 'Volleyball': 'VBL',
  'Basketball': 'BSK', 'Tennis': 'TEN', 'Table Tennis': 'TT'
};

const INITIAL_PLAYERS = [
  { id: 1, name: 'Marcus Webb', handle: '@marcwebb', bio: 'I win. Then I eat.', initials: 'MW', color: '#2a3d5e', wins: 18, losses: 7, streak: 4, favSport: 'Badminton', pfp: null },
  { id: 2, name: 'Priya Nair', handle: '@priya_smash', bio: 'Badminton queen, protein evangelist.', initials: 'PN', color: '#5e2a2a', wins: 21, losses: 5, streak: 6, favSport: 'Volleyball', pfp: null },
  { id: 3, name: 'DJ Chen', handle: '@djchen99', bio: 'Sleep. Pickleball. Repeat.', initials: 'DC', color: '#2a5e3a', wins: 14, losses: 11, streak: -2, favSport: 'Pickleball', pfp: null },
  { id: 4, name: 'Leon Okafor', handle: '@leokafor', bio: 'All nets fear me.', initials: 'LO', color: '#4a3a1e', wins: 16, losses: 9, streak: 2, favSport: 'Volleyball', pfp: null },
  { id: 5, name: 'Sofia Reyes', handle: '@sof_rey', bio: 'Quiet on court. Loud at dinner.', initials: 'SR', color: '#5e2a4e', wins: 11, losses: 14, streak: -1, favSport: 'Tennis', pfp: null },
  { id: 6, name: 'Kai Tanaka', handle: '@kai_t', bio: 'Net game only. Always.', initials: 'KT', color: '#1e3a4a', wins: 9, losses: 16, streak: -3, favSport: 'Badminton', pfp: null },
  { id: 7, name: 'Amara Diallo', handle: '@amarad', bio: 'Consistency is the real flex.', initials: 'AD', color: '#3a3a1a', wins: 20, losses: 5, streak: 5, favSport: 'Pickleball', pfp: null },
  { id: 8, name: 'Tomás Vargas', handle: '@tomasv', bio: 'Post-game chicken is non-negotiable.', initials: 'TV', color: '#2a1a3a', wins: 13, losses: 12, streak: 1, favSport: 'Basketball', pfp: null },
];

const INITIAL_MATCHES = [
  { id: 1, date: '2025-04-14', sport: 'Badminton', team1: [1,3], team2: [2,4], score1: 21, score2: 15, note: 'Marcus and DJ absolutely cooked.' },
  { id: 2, date: '2025-04-12', sport: 'Volleyball', team1: [5,6,8], team2: [7,1,2], score1: 18, score2: 25, note: 'Amara served fire all set.' },
  { id: 3, date: '2025-04-10', sport: 'Pickleball', team1: [7,8], team2: [3,5], score1: 11, score2: 7, note: 'Tomás with the clutch dink.' },
  { id: 4, date: '2025-04-07', sport: 'Badminton', team1: [2], team2: [1], score1: 21, score2: 18, note: 'Priya in her bag today.' },
  { id: 5, date: '2025-04-05', sport: 'Volleyball', team1: [3,4,6], team2: [1,5,7], score1: 22, score2: 24, note: 'SO close. Heartbreak.' },
];

const INITIAL_BANTER = [
  { id: 1, playerId: 2, text: 'Nobody talk to me until I\'ve had 200g protein and reviewed my serve tape.', time: '2h ago', reactions: { fire: 12, skull: 3, trophy: 7 } },
  { id: 2, playerId: 1, text: 'The court was wet. My knee was tweaking. Sun was in my eyes. I still won. But those are the facts.', time: '5h ago', reactions: { fire: 4, skull: 8, trophy: 2 } },
  { id: 3, playerId: 7, text: 'Amara Diallo, 5-streak, no big deal. Just a Tuesday.', time: '1d ago', reactions: { fire: 15, skull: 1, trophy: 11 } },
  { id: 4, playerId: 6, text: 'Going to start a petition to ban Marcus from playing doubles with rookies. It\'s not fair.', time: '1d ago', reactions: { fire: 6, skull: 5, trophy: 3 } },
];

const INITIAL_VENUES = [
  { id: 1, name: 'Riverdale Community Centre', address: '240 Riverdale Ave', sports: ['Badminton','Volleyball'], notes: 'Book 3 days ahead. Court 3 is best.', rating: 4, cost: '$5/hr' },
  { id: 2, name: 'Centennial Park Courts', address: 'Centennial Park', sports: ['Pickleball','Tennis','Badminton'], notes: 'Outdoor. Free. Gets busy Sat mornings.', rating: 5, cost: 'Free' },
  { id: 3, name: 'The Cage', address: '88 Industrial Blvd', sports: ['Basketball','Volleyball'], notes: 'Indoor, open gym Sundays 2–6pm.', rating: 3, cost: '$3 drop-in' },
];

const POST_GAME_MEALS = [
  { id: 1, name: 'The Recovery Stack', desc: 'Double chicken breast, jasmine rice, grilled broccolini with garlic. The gold standard.', protein: 68, carbs: 55, fat: 12, serves: 1, emoji: '🍗' },
  { id: 2, name: 'High-Rep Shawarma', desc: 'Grilled beef shawarma wrap, hummus, tabbouleh, extra meat no questions asked.', protein: 54, carbs: 48, fat: 22, serves: 1, emoji: '🌯' },
  { id: 3, name: 'The Aftermath Bowl', desc: 'Ground turkey, black beans, brown rice, avocado, lime crema. Assembly required.', protein: 61, carbs: 65, fat: 18, serves: 1, emoji: '🥗' },
  { id: 4, name: 'Eggs & Havoc', desc: '6-egg scramble, turkey sausage, sourdough toast, roasted tomatoes.', protein: 52, carbs: 34, fat: 26, serves: 1, emoji: '🍳' },
  { id: 5, name: 'Brisket Blitz', desc: 'Slow-smoked brisket, mashed sweet potato, sautéed greens. For serious sessions only.', protein: 74, carbs: 60, fat: 28, serves: 1, emoji: '🥩' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const getInitials = name => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2);
const winPct = p => p.wins + p.losses === 0 ? 0 : Math.round((p.wins / (p.wins + p.losses)) * 100);
const streakLabel = s => s > 0 ? `W${s}` : s < 0 ? `L${Math.abs(s)}` : '-';
const streakColor = s => s > 0 ? '#2a6e2a' : s < 0 ? '#8b1a1a' : '#6b5840';
const today = () => new Date().toISOString().split('T')[0];
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric' });

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Avatar({ player, size = 44, onClick }) {
  const style = {
    width: size, height: size, borderRadius: '50%',
    background: player.pfp ? 'transparent' : player.color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Playfair Display', serif", fontWeight: 700,
    fontSize: size * 0.33, color: '#f5f0e8',
    overflow: 'hidden', flexShrink: 0, cursor: onClick ? 'pointer' : 'default',
    border: '2px solid rgba(245,240,232,0.2)',
  };
  return (
    <div style={style} onClick={onClick} title={player.name}>
      {player.pfp ? <img src={player.pfp} alt={player.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : player.initials}
    </div>
  );
}

function Masthead({ page, setPage, sport, setSport }) {
  const dateStr = new Date().toLocaleDateString('en-CA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  return (
    <header className="masthead">
      <div className="masthead-rules">
        <span />
        <span className="masthead-dateline">Est. 2025 — {dateStr}</span>
        <span />
      </div>
      <div className="masthead-title">The Pickup Gazette</div>
      <div className="masthead-subtitle">Unofficial Record of the Crew · All Sports · All Results · No Mercy</div>
      <nav className="masthead-nav">
        {['scoreboard','roster','results','venues','rations','dispatch'].map(p => (
          <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>
            {{ scoreboard:'Front Page', roster:'The Roster', results:'Match Results', venues:'Our Spots', rations:'Post-Game Fuel', dispatch:'Dispatch' }[p]}
          </button>
        ))}
      </nav>
      <div className="sport-ticker" style={{marginTop: 6}}>
        <span className="sport-ticker-label">Edition</span>
        <div className="sport-ticker-items">
          {SPORTS.map(s => (
            <button key={s} className={sport === s ? 'active' : ''} onClick={() => setSport(s)}>{s}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── SCOREBOARD PAGE ──────────────────────────────────────────────────────────
function ScoreboardPage({ players, matches, sport, setPage, setViewPlayer, setActiveMatch, banter }) {
  const sportMatches = matches.filter(m => m.sport === sport);
  const sorted = [...players].sort((a,b) => b.wins - a.wins || b.wins/(b.wins+b.losses||1) - a.wins/(a.wins+a.losses||1));
  const top = sorted[0];
  const recent = [...sportMatches].sort((a,b) => b.date.localeCompare(a.date)).slice(0,3);
  const topBanter = banter.slice(0,2);

  const tickerItems = sorted.map(p => `${p.name.toUpperCase()} ${p.wins}W-${p.losses}L`).join('  ·  ');

  return (
    <div className="page">
      <div className="ticker-strip">
        <span className="ticker-inner">{tickerItems}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{tickerItems}</span>
      </div>

      {/* MAIN HEADLINE */}
      <div style={{borderTop:'4px double var(--ink)', borderBottom:'4px double var(--ink)', padding:'14px 0', textAlign:'center', marginBottom: 16}}>
        <div className="hed-xl">{sport} Standings</div>
        <div style={{fontFamily:"'Libre Baskerville', serif", fontStyle:'italic', fontSize:12, color:'var(--ink-muted)', marginTop:4}}>
          All-time records · Updated after every session
        </div>
      </div>

      <div className="col-grid-3" style={{alignItems:'start'}}>
        {/* LEFT — Leaderboard */}
        <div className="col-span-2">
          <div className="section-head"><h2>Championship Standings</h2><span className="section-head-sub">{sport}</span></div>
          <table className="lb-table">
            <thead>
              <tr>
                <th style={{width:28}}>#</th>
                <th>Athlete</th>
                <th>W</th><th>L</th><th>Pct</th><th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p,i) => (
                <tr key={p.id}>
                  <td><span className={`lb-rank${i < 3 ? ' top' : ''}`}>{i+1}</span></td>
                  <td>
                    <div className="lb-name-cell">
                      <div className="lb-mini-avatar" style={{background: p.color, color:'#f5f0e8'}} onClick={() => { setViewPlayer(p.id); setPage('profile'); }}>
                        {p.pfp ? <img src={p.pfp} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : p.initials}
                      </div>
                      <div>
                        <div className="lb-name" onClick={() => { setViewPlayer(p.id); setPage('profile'); }}>{p.name}</div>
                        <div style={{fontSize:9,color:'var(--ink-muted)',letterSpacing:'0.1em'}}>{p.handle}</div>
                      </div>
                      {i===0 && <span className="badge-crown">♔</span>}
                    </div>
                  </td>
                  <td><span className="lb-val">{p.wins}</span></td>
                  <td><span className="lb-val">{p.losses}</span></td>
                  <td><span className="lb-val lb-win-pct">{winPct(p)}%</span></td>
                  <td><span style={{fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:13, color: streakColor(p.streak)}}>{streakLabel(p.streak)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent matches */}
          <div className="section-head mt-lg"><h2>Recent Results</h2><span className="section-head-sub">Latest dispatches</span></div>
          {recent.length === 0 ? <div className="empty-state">No {sport} matches logged yet.</div> : recent.map(m => (
            <RecentMatchRow key={m.id} match={m} players={players} onClick={() => setActiveMatch(m.id)} />
          ))}
          <div style={{marginTop:8}}>
            <button className="btn btn-sm" onClick={() => setPage('results')}>View All Results →</button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Leader card */}
          {top && (
            <>
              <div className="section-head"><h2>Current Champion</h2></div>
              <div style={{border:'2px solid var(--ink)', background:'var(--paper)', marginBottom:14}}>
                <div style={{background:'var(--ink)', padding:'10px 12px', display:'flex', gap:10, alignItems:'center'}}>
                  <div style={{width:52,height:52,borderRadius:'50%',background:top.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:'#f5f0e8',border:'2px solid rgba(245,240,232,0.2)',overflow:'hidden',flexShrink:0,cursor:'pointer'}} onClick={() => { setViewPlayer(top.id); setPage('profile'); }}>
                    {top.pfp ? <img src={top.pfp} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : top.initials}
                  </div>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:'#f5f0e8'}}>{top.name}</div>
                    <div style={{fontSize:10,color:'rgba(245,240,232,0.6)',letterSpacing:'0.1em'}}>{top.handle}</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
                  {[['Wins',top.wins],['Losses',top.losses],['Win %',winPct(top)+'%'],['Streak',streakLabel(top.streak)]].map(([l,v]) => (
                    <div key={l} style={{textAlign:'center',padding:'10px 4px',borderRight:'var(--rule)',borderBottom:'var(--rule)'}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20}}>{v}</div>
                      <div style={{fontSize:8,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--ink-muted)'}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:'8px 12px',fontStyle:'italic',fontSize:12,color:'var(--ink-muted)',borderTop:'var(--rule)'}}>{top.bio}</div>
              </div>
            </>
          )}

          {/* Recent dispatch */}
          <div className="section-head"><h2>From the Dispatch</h2></div>
          {topBanter.map(b => {
            const p = players.find(x => x.id === b.playerId);
            if (!p) return null;
            return (
              <div key={b.id} style={{paddingBottom:10, marginBottom:10, borderBottom:'var(--rule)'}}>
                <div style={{fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--ink-muted)',marginBottom:3}}>
                  <span style={{fontWeight:700, color:'var(--ink-faded)', cursor:'pointer'}} onClick={() => { setViewPlayer(p.id); setPage('profile'); }}>{p.name}</span>
                  <span> · {b.time}</span>
                </div>
                <div style={{fontFamily:"'Libre Baskerville',serif",fontStyle:'italic',fontSize:12,color:'var(--ink-faded)',lineHeight:1.5}}>"{b.text}"</div>
              </div>
            );
          })}
          <button className="btn btn-sm" onClick={() => setPage('dispatch')}>Full Dispatch →</button>
        </div>
      </div>
    </div>
  );
}

function RecentMatchRow({ match, players, onClick }) {
  const getName = ids => ids.map(id => { const p = players.find(x=>x.id===id); return p ? p.name.split(' ')[0] : '?'; }).join(' & ');
  const w1 = match.score1 > match.score2;
  return (
    <div style={{borderBottom:'var(--rule)', padding:'10px 0', cursor:'pointer'}} onClick={onClick}
         onMouseEnter={e=>e.currentTarget.style.background='var(--paper-aged)'}
         onMouseLeave={e=>e.currentTarget.style.background=''}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color: w1?'var(--ink)':'var(--ink-muted)'}}>{getName(match.team1)}</div>
        </div>
        <div style={{textAlign:'center',fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:18,minWidth:60}}>
          <span style={{color: w1?'var(--ink)':'var(--ink-muted)'}}>{match.score1}</span>
          <span style={{color:'var(--paper-rule)',fontSize:12,margin:'0 4px'}}>–</span>
          <span style={{color: !w1?'var(--ink)':'var(--ink-muted)'}}>{match.score2}</span>
        </div>
        <div style={{flex:1,textAlign:'right'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color: !w1?'var(--ink)':'var(--ink-muted)'}}>{getName(match.team2)}</div>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
        <span style={{fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--ink-muted)'}}>{fmtDate(match.date)} · {match.sport}</span>
        {match.note && <span style={{fontSize:10,fontStyle:'italic',color:'var(--ink-muted)',maxWidth:180,textAlign:'right',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{match.note}</span>}
      </div>
    </div>
  );
}

// ─── ROSTER PAGE ──────────────────────────────────────────────────────────────
function RosterPage({ players, setPlayers, setViewPlayer, setPage }) {
  const [showAdd, setShowAdd] = useState(false);
  const sorted = [...players].sort((a,b) => b.wins - a.wins);

  return (
    <div className="page">
      <div style={{borderTop:'4px double var(--ink)',borderBottom:'4px double var(--ink)',padding:'12px 0',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div className="hed-lg">The Roster</div>
        <button className="btn btn-sm btn-solid" onClick={() => setShowAdd(true)}>+ Add Player</button>
      </div>

      <div className="col-grid-4">
        {sorted.map(p => (
          <PlayerCard key={p.id} player={p} onClick={() => { setViewPlayer(p.id); setPage('profile'); }} />
        ))}
      </div>

      {showAdd && <AddPlayerModal onClose={() => setShowAdd(false)} onAdd={p => { setPlayers(prev => [...prev, p]); setShowAdd(false); }} players={players} />}
    </div>
  );
}

function PlayerCard({ player, onClick }) {
  return (
    <div className="player-card" onClick={onClick}>
      <div className="player-card-header">
        <div style={{width:44,height:44,borderRadius:'50%',background:player.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:'#f5f0e8',border:'2px solid rgba(245,240,232,0.25)',overflow:'hidden',flexShrink:0}}>
          {player.pfp ? <img src={player.pfp} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : player.initials}
        </div>
        <div>
          <div className="player-card-name">{player.name}</div>
          <div className="player-card-handle">{player.handle}</div>
        </div>
      </div>
      {player.bio && <div style={{padding:'6px 10px',fontSize:11,fontStyle:'italic',color:'var(--ink-muted)',borderBottom:'var(--rule)',fontFamily:"'Libre Baskerville',serif",lineHeight:1.4}}>{player.bio}</div>}
      <div className="player-card-stats">
        <div className="player-stat">
          <span className="player-stat-val">{player.wins}</span>
          <span className="player-stat-lbl">Wins</span>
        </div>
        <div className="player-stat">
          <span className="player-stat-val">{winPct(player)}%</span>
          <span className="player-stat-lbl">Win%</span>
        </div>
        <div className="player-stat">
          <span className="player-stat-val" style={{color: streakColor(player.streak)}}>{streakLabel(player.streak)}</span>
          <span className="player-stat-lbl">Streak</span>
        </div>
      </div>
      <div style={{padding:'4px 10px',borderTop:'var(--rule)',fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--ink-muted)'}}>
        ♦ {player.favSport}
      </div>
    </div>
  );
}

function AddPlayerModal({ onClose, onAdd, players }) {
  const [form, setForm] = useState({ name:'', handle:'', bio:'', favSport: SPORTS[0] });
  const colors = ['#2a3d5e','#5e2a2a','#2a5e3a','#4a3a1e','#5e2a4e','#1e3a4a','#3a3a1a','#2a1a3a'];
  const usedColors = players.map(p => p.color);
  const availColor = colors.find(c => !usedColors.includes(c)) || colors[players.length % colors.length];

  const submit = () => {
    if (!form.name.trim()) return;
    onAdd({
      id: Date.now(), name: form.name.trim(), handle: form.handle || '@' + form.name.split(' ')[0].toLowerCase(),
      bio: form.bio, initials: getInitials(form.name), color: availColor,
      wins: 0, losses: 0, streak: 0, favSport: form.favSport, pfp: null
    });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add to the Roster</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-field"><label>Full Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Jordan Blake" /></div>
          <div className="form-field"><label>Handle</label><input type="text" value={form.handle} onChange={e=>setForm({...form,handle:e.target.value})} placeholder="@handle" /></div>
          <div className="form-field"><label>Bio / Tagline</label><input type="text" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="One line. Make it count." /></div>
          <div className="form-field"><label>Favourite Sport</label>
            <div style={{position:'relative'}}>
              <select value={form.favSport} onChange={e=>setForm({...form,favSport:e.target.value})}>
                {SPORTS.map(s=><option key={s}>{s}</option>)}
              </select>
              <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--ink-muted)',fontSize:10}}>▼</span>
            </div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
            <button className="btn btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-sm btn-solid" onClick={submit}>Add Player</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS PAGE ─────────────────────────────────────────────────────────────
function ResultsPage({ matches, players, sport, setMatches, setPlayers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [activeMatchId, setActiveMatchId] = useState(null);

  const filtered = matches
    .filter(m => activeTab === 'all' || m.sport === activeTab)
    .sort((a,b) => b.date.localeCompare(a.date));

  const getName = ids => ids.map(id => { const p = players.find(x=>x.id===id); return p ? p.name.split(' ')[0] : '?'; }).join(' & ');

  return (
    <div className="page">
      <div style={{borderTop:'4px double var(--ink)',borderBottom:'4px double var(--ink)',padding:'12px 0',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div className="hed-lg">Match Results</div>
        <button className="btn btn-sm btn-solid" onClick={() => setShowAdd(true)}>+ Log Match</button>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn${activeTab==='all'?' active':''}`} onClick={()=>setActiveTab('all')}>All Sports</button>
        {SPORTS.map(s => (
          <button key={s} className={`tab-btn${activeTab===s?' active':''}`} onClick={()=>setActiveTab(s)}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No matches logged for {activeTab === 'all' ? 'any sport' : activeTab} yet. Time to play!</div>
      ) : (
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th className="lb-table" style={{fontSize:8,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ink-muted)',padding:'4px 8px',borderBottom:'2px solid var(--ink)',textAlign:'left',fontWeight:400}}>Date</th>
              <th style={{fontSize:8,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ink-muted)',padding:'4px 8px',borderBottom:'2px solid var(--ink)',textAlign:'left',fontWeight:400}}>Sport</th>
              <th style={{fontSize:8,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ink-muted)',padding:'4px 8px',borderBottom:'2px solid var(--ink)',textAlign:'left',fontWeight:400}}>Team 1</th>
              <th style={{fontSize:8,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ink-muted)',padding:'4px 8px',borderBottom:'2px solid var(--ink)',textAlign:'center',fontWeight:400}}>Score</th>
              <th style={{fontSize:8,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ink-muted)',padding:'4px 8px',borderBottom:'2px solid var(--ink)',textAlign:'right',fontWeight:400}}>Team 2</th>
              <th style={{fontSize:8,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ink-muted)',padding:'4px 8px',borderBottom:'2px solid var(--ink)',textAlign:'left',fontWeight:400}}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const w1 = m.score1 > m.score2;
              return (
                <tr key={m.id} style={{cursor:'pointer'}}
                    onClick={() => setActiveMatchId(activeMatchId === m.id ? null : m.id)}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--paper-aged)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td style={{padding:'8px',borderBottom:'var(--rule)',fontSize:12}}>{fmtDate(m.date)}</td>
                  <td style={{padding:'8px',borderBottom:'var(--rule)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--ink-muted)'}}>{m.sport}</td>
                  <td style={{padding:'8px',borderBottom:'var(--rule)'}}><span style={{fontFamily:"'Playfair Display',serif",fontWeight: w1?700:400,fontSize:13}}>{getName(m.team1)}</span></td>
                  <td style={{padding:'8px',borderBottom:'var(--rule)',textAlign:'center',fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,whiteSpace:'nowrap'}}>
                    <span style={{color: w1?'var(--ink)':'var(--ink-muted)'}}>{m.score1}</span>
                    <span style={{color:'var(--paper-rule)',margin:'0 6px',fontSize:11}}>–</span>
                    <span style={{color: !w1?'var(--ink)':'var(--ink-muted)'}}>{m.score2}</span>
                  </td>
                  <td style={{padding:'8px',borderBottom:'var(--rule)',textAlign:'right'}}><span style={{fontFamily:"'Playfair Display',serif",fontWeight: !w1?700:400,fontSize:13}}>{getName(m.team2)}</span></td>
                  <td style={{padding:'8px',borderBottom:'var(--rule)',fontSize:11,fontStyle:'italic',color:'var(--ink-muted)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showAdd && (
        <LogMatchModal players={players} onClose={() => setShowAdd(false)}
          onLog={(m) => {
            setMatches(prev => [m, ...prev]);
            // update player records
            setPlayers(prev => prev.map(p => {
              const inT1 = m.team1.includes(p.id);
              const inT2 = m.team2.includes(p.id);
              if (!inT1 && !inT2) return p;
              const won = (inT1 && m.score1 > m.score2) || (inT2 && m.score2 > m.score1);
              return {
                ...p,
                wins: p.wins + (won ? 1 : 0),
                losses: p.losses + (!won ? 1 : 0),
                streak: won ? (p.streak >= 0 ? p.streak + 1 : 1) : (p.streak <= 0 ? p.streak - 1 : -1)
              };
            }));
            setShowAdd(false);
          }} />
      )}
    </div>
  );
}

function LogMatchModal({ players, onClose, onLog }) {
  const [form, setForm] = useState({ sport: SPORTS[0], date: today(), team1: [], team2: [], score1: '', score2: '', note: '' });

  const togglePlayer = (team, pid) => {
    const other = team === 1 ? 'team2' : 'team1';
    if (form[other].includes(pid)) return; // can't be on both
    const key = team === 1 ? 'team1' : 'team2';
    setForm(f => ({
      ...f,
      [key]: f[key].includes(pid) ? f[key].filter(x=>x!==pid) : [...f[key], pid]
    }));
  };

  const submit = () => {
    if (!form.team1.length || !form.team2.length) return alert('Each team needs at least one player.');
    if (form.score1 === '' || form.score2 === '') return alert('Enter the final score.');
    onLog({ ...form, id: Date.now(), score1: parseInt(form.score1), score2: parseInt(form.score2), team1: [...form.team1], team2: [...form.team2] });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Log a Match</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="col-grid-2" style={{gap:10,marginBottom:12}}>
            <div className="form-field" style={{marginBottom:0}}>
              <label>Sport</label>
              <div style={{position:'relative'}}>
                <select value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})}>
                  {SPORTS.map(s=><option key={s}>{s}</option>)}
                </select>
                <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',fontSize:10}}>▼</span>
              </div>
            </div>
            <div className="form-field" style={{marginBottom:0}}>
              <label>Date</label>
              <input type="text" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="YYYY-MM-DD" />
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={{marginBottom:6}}>Select Players</label>
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:4}}>
              {players.map(p => {
                const inT1 = form.team1.includes(p.id);
                const inT2 = form.team2.includes(p.id);
                return (
                  <div key={p.id} style={{display:'flex',gap:2,alignItems:'center'}}>
                    <button onClick={() => togglePlayer(1, p.id)}
                      style={{fontSize:9,padding:'3px 7px',border:'1px solid',borderColor: inT1?'var(--accent-red)':'var(--paper-rule)',background: inT1?'var(--accent-red)':'none',color: inT1?'var(--paper)':'var(--ink-muted)',cursor:'pointer',fontFamily:"'Source Serif 4',serif",letterSpacing:'0.08em',textTransform:'uppercase'}}>
                      T1
                    </button>
                    <span style={{fontSize:12,fontFamily:"'Playfair Display',serif",fontWeight: (inT1||inT2)?700:400,color: inT1?'var(--accent-red)': inT2?'var(--accent-navy)':'var(--ink-muted)'}}>{p.name.split(' ')[0]}</span>
                    <button onClick={() => togglePlayer(2, p.id)}
                      style={{fontSize:9,padding:'3px 7px',border:'1px solid',borderColor: inT2?'var(--accent-navy)':'var(--paper-rule)',background: inT2?'var(--accent-navy)':'none',color: inT2?'var(--paper)':'var(--ink-muted)',cursor:'pointer',fontFamily:"'Source Serif 4',serif",letterSpacing:'0.08em',textTransform:'uppercase'}}>
                      T2
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:10,color:'var(--ink-muted)',fontStyle:'italic'}}>
              Team 1: {form.team1.map(id => players.find(p=>p.id===id)?.name.split(' ')[0]).join(', ') || 'none'} &nbsp;|&nbsp;
              Team 2: {form.team2.map(id => players.find(p=>p.id===id)?.name.split(' ')[0]).join(', ') || 'none'}
            </div>
          </div>

          <div className="score-input-row" style={{marginBottom:12}}>
            <div><label style={{textAlign:'center'}}>Team 1 Score</label><input type="number" value={form.score1} onChange={e=>setForm({...form,score1:e.target.value})} min="0" /></div>
            <div className="score-vs">vs</div>
            <div><label style={{textAlign:'center'}}>Team 2 Score</label><input type="number" value={form.score2} onChange={e=>setForm({...form,score2:e.target.value})} min="0" /></div>
          </div>

          <div className="form-field"><label>Post-match notes</label><input type="text" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What happened? Who choked? Who showed up?" /></div>

          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
            <button className="btn btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-sm btn-solid" onClick={submit}>Log It</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ playerId, players, setPlayers, matches, onBack }) {
  const player = players.find(p => p.id === playerId);
  if (!player) return <div className="page"><button className="btn btn-sm" onClick={onBack}>← Back</button></div>;

  const playerMatches = matches.filter(m => m.team1.includes(player.id) || m.team2.includes(player.id))
    .sort((a,b) => b.date.localeCompare(a.date));

  const getName = ids => ids.map(id => { const p = players.find(x=>x.id===id); return p ? p.name.split(' ')[0] : '?'; }).join(' & ');

  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(player.bio);
  const [editHandle, setEditHandle] = useState(player.handle);
  const [pfpInput, setPfpInput] = useState('');

  const sorted = [...players].sort((a,b) => b.wins - a.wins);
  const rank = sorted.findIndex(p => p.id === player.id) + 1;

  return (
    <div className="page" style={{maxWidth:860}}>
      <div style={{marginBottom:12}}>
        <button className="btn btn-sm" onClick={onBack}>← Back to Roster</button>
      </div>

      <div className="profile-banner">
        <div style={{width:80,height:80,borderRadius:'50%',background:player.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:28,color:'#f5f0e8',border:'3px solid rgba(245,240,232,0.25)',overflow:'hidden',flexShrink:0}}>
          {player.pfp ? <img src={player.pfp} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : player.initials}
        </div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'baseline',gap:10}}>
            <div className="profile-name">{player.name}</div>
            <div style={{fontSize:11,opacity:0.6,letterSpacing:'0.1em'}}>{editing ? <input type="text" value={editHandle} onChange={e=>setEditHandle(e.target.value)} style={{background:'none',border:'none',color:'#f5f0e8',fontSize:11,padding:0,width:120,borderBottom:'1px solid rgba(255,255,255,0.3)',outline:'none'}} /> : player.handle}</div>
          </div>
          {editing
            ? <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} style={{marginTop:6,background:'none',border:'none',borderBottom:'1px solid rgba(255,255,255,0.3)',color:'rgba(245,240,232,0.85)',fontSize:13,width:'100%',resize:'none',outline:'none',fontStyle:'italic',fontFamily:"'Source Serif 4',serif"}} rows={2} />
            : <div className="profile-bio">{player.bio || 'No bio yet.'}</div>
          }
          <div style={{marginTop:8,display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
            <span style={{fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',border:'1px solid rgba(245,240,232,0.3)',padding:'2px 7px',color:'rgba(245,240,232,0.75)'}}>♦ {player.favSport}</span>
            <span style={{fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',border:'1px solid rgba(245,240,232,0.3)',padding:'2px 7px',color:'rgba(245,240,232,0.75)'}}>Rank #{rank}</span>
            {editing
              ? <>
                  <input type="text" value={pfpInput} onChange={e=>setPfpInput(e.target.value)} placeholder="Paste image URL" style={{fontSize:10,padding:'2px 7px',background:'none',border:'1px solid rgba(255,255,255,0.3)',color:'#f5f0e8',outline:'none',width:180}} />
                  <button onClick={()=>{
                    setPlayers(prev=>prev.map(p=>p.id===player.id?{...p,bio:editBio,handle:editHandle,pfp:pfpInput||p.pfp}:p));
                    setEditing(false);
                  }} style={{fontSize:9,padding:'3px 10px',background:'rgba(245,240,232,0.15)',border:'1px solid rgba(245,240,232,0.4)',color:'#f5f0e8',cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase'}}>Save</button>
                  <button onClick={()=>setEditing(false)} style={{fontSize:9,padding:'3px 10px',background:'none',border:'1px solid rgba(245,240,232,0.25)',color:'rgba(245,240,232,0.6)',cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase'}}>Cancel</button>
                </>
              : <button onClick={()=>{setEditing(true);setEditBio(player.bio);setEditHandle(player.handle);}} style={{fontSize:9,padding:'3px 10px',background:'rgba(245,240,232,0.1)',border:'1px solid rgba(245,240,232,0.3)',color:'rgba(245,240,232,0.7)',cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase'}}>Edit Profile</button>
            }
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-row">
        {[['Wins',player.wins],['Losses',player.losses],['Win %',winPct(player)+'%'],['Streak',streakLabel(player.streak)]].map(([l,v]) => (
          <div key={l} className="stat-box">
            <div className="stat-box-val" style={{color: l==='Streak'?streakColor(player.streak):undefined}}>{v}</div>
            <div className="stat-box-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* Match history */}
      <div className="section-head mt-lg"><h2>Match History</h2><span className="section-head-sub">{playerMatches.length} recorded matches</span></div>

      {playerMatches.length === 0 ? (
        <div className="empty-state">No matches recorded yet. Get out there!</div>
      ) : (
        <table className="match-log">
          <thead>
            <tr>
              <th>Date</th><th>Sport</th><th>Team 1</th><th style={{textAlign:'center'}}>Score</th><th>Team 2</th><th>Result</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {playerMatches.map(m => {
              const inT1 = m.team1.includes(player.id);
              const won = (inT1 && m.score1 > m.score2) || (!inT1 && m.score2 > m.score1);
              return (
                <tr key={m.id}>
                  <td style={{fontSize:11}}>{fmtDate(m.date)}</td>
                  <td style={{fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--ink-muted)'}}>{m.sport}</td>
                  <td style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:inT1?700:400}}>{getName(m.team1)}</td>
                  <td style={{textAlign:'center',fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14}}>
                    {m.score1}<span style={{color:'var(--paper-rule)',margin:'0 4px',fontSize:10}}>–</span>{m.score2}
                  </td>
                  <td style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:!inT1?700:400}}>{getName(m.team2)}</td>
                  <td><span className={won ? 'result-w' : 'result-l'}>{won ? 'W' : 'L'}</span></td>
                  <td style={{fontSize:11,fontStyle:'italic',color:'var(--ink-muted)',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── VENUES PAGE ──────────────────────────────────────────────────────────────
function VenuesPage({ venues, setVenues }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', address:'', sports:[], notes:'', rating:4, cost:'' });

  const submitVenue = () => {
    if (!form.name.trim()) return;
    setVenues(prev => [...prev, { ...form, id: Date.now(), sports: [...form.sports] }]);
    setShowAdd(false);
    setForm({ name:'', address:'', sports:[], notes:'', rating:4, cost:'' });
  };

  return (
    <div className="page">
      <div style={{borderTop:'4px double var(--ink)',borderBottom:'4px double var(--ink)',padding:'12px 0',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div className="hed-lg">Our Regular Spots</div>
        <button className="btn btn-sm btn-solid" onClick={() => setShowAdd(true)}>+ Add Venue</button>
      </div>

      <div className="col-grid-3">
        {venues.map(v => (
          <div key={v.id} className="venue-card">
            <div className="venue-card-banner">
              <span className="venue-card-name">{v.name}</span>
              <div className="venue-sport-tags">{v.sports.map(s=><span key={s} className="venue-sport-tag">{SPORT_ICONS[s]||s.slice(0,3).toUpperCase()}</span>)}</div>
            </div>
            <div className="venue-card-body">
              <div className="venue-card-addr">{v.address}</div>
              <div className="venue-card-notes">{v.notes}</div>
              <div style={{marginTop:6,display:'flex',flexWrap:'wrap',gap:4}}>
                {v.sports.map(s=><span key={s} className="chip">{s}</span>)}
              </div>
            </div>
            <div className="venue-card-footer">
              <span style={{color:'var(--accent-gold)'}}>{'★'.repeat(v.rating)}{'☆'.repeat(5-v.rating)}</span>
              <span>{v.cost}</span>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal">
            <div className="modal-header"><h3>Add a Venue</h3><button className="modal-close" onClick={()=>setShowAdd(false)}>×</button></div>
            <div className="modal-body">
              <div className="form-field"><label>Venue Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-field"><label>Address</label><input type="text" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
              <div className="form-field"><label>Sports Played Here</label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>
                  {SPORTS.map(s=>(
                    <button key={s} onClick={()=>setForm(f=>({...f,sports:f.sports.includes(s)?f.sports.filter(x=>x!==s):[...f.sports,s]}))}
                      className={`chip${form.sports.includes(s)?' active':''}`} style={{cursor:'pointer',border:'1px solid',borderColor:form.sports.includes(s)?'var(--ink)':'var(--paper-rule)'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-field"><label>Notes / Tips</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} /></div>
              <div className="col-grid-2" style={{gap:10}}>
                <div className="form-field"><label>Rating (1–5)</label><input type="number" min="1" max="5" value={form.rating} onChange={e=>setForm({...form,rating:parseInt(e.target.value)})} /></div>
                <div className="form-field"><label>Cost</label><input type="text" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="e.g. Free, $5/hr" /></div>
              </div>
              <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
                <button className="btn btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
                <button className="btn btn-sm btn-solid" onClick={submitVenue}>Add Venue</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RATIONS PAGE ─────────────────────────────────────────────────────────────
function RationsPage() {
  const [active, setActive] = useState(null);
  return (
    <div className="page">
      <div style={{borderTop:'4px double var(--ink)',borderBottom:'4px double var(--ink)',padding:'12px 0',textAlign:'center',marginBottom:16}}>
        <div className="hed-xl">Post-Game Fuel</div>
        <div style={{fontFamily:"'Libre Baskerville',serif",fontStyle:'italic',fontSize:13,color:'var(--ink-muted)',marginTop:4}}>High-protein recovery meals for the serious athlete and their appetite</div>
      </div>

      <div className="col-grid-3">
        {POST_GAME_MEALS.map(meal => (
          <div key={meal.id} className="food-card" style={{cursor:'pointer',outline: active===meal.id?'2px solid var(--ink)':'none'}} onClick={()=>setActive(active===meal.id?null:meal.id)}>
            <div className="food-card-hed">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>{meal.name}</span>
                <span style={{fontSize:18}}>{meal.emoji}</span>
              </div>
            </div>
            <div className="food-card-body">{meal.desc}</div>
            <div className="food-macros">
              <div className="food-macro"><span className="food-macro-val">{meal.protein}g</span><span className="food-macro-lbl">Protein</span></div>
              <div className="food-macro"><span className="food-macro-val">{meal.carbs}g</span><span className="food-macro-lbl">Carbs</span></div>
              <div className="food-macro"><span className="food-macro-val">{meal.fat}g</span><span className="food-macro-lbl">Fat</span></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:28,borderTop:'3px solid var(--ink)',paddingTop:14}}>
        <div className="hed-md" style={{marginBottom:8}}>The Crew's Standing Orders</div>
        <div className="col-grid-3">
          {[
            { title: 'The Non-Negotiable', body: '200g protein minimum on game day. No exceptions. No excuses. Your muscles have voted.' },
            { title: 'The Sacred Rule', body: 'Whoever loses buys the rice. This has been the law since the first session and shall remain so.' },
            { title: 'The Recovery Code', body: 'No ultra-processed junk after 3 sets of anything. You played too hard to insult the effort.' },
          ].map(n => (
            <div key={n.title} style={{borderTop:'2px solid var(--ink)',paddingTop:8}}>
              <div className="byline"><b>{n.title}</b></div>
              <p className="dropcase" style={{fontFamily:"'Libre Baskerville',serif",fontSize:13,lineHeight:1.6,color:'var(--ink-faded)'}}>{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DISPATCH PAGE ─────────────────────────────────────────────────────────────
function DispatchPage({ banter, setBanter, players }) {
  const [form, setForm] = useState({ playerId: players[0]?.id || '', text: '' });
  const [reactions, setReactions] = useState(banter.reduce((acc,b) => ({...acc,[b.id]:b.reactions}),{}));

  const react = (banterIdObj, emoji) => {
    setReactions(prev => ({
      ...prev,
      [banterIdObj]: { ...prev[banterIdObj], [emoji]: (prev[banterIdObj]?.[emoji] || 0) + 1 }
    }));
  };

  const post = () => {
    if (!form.text.trim() || !form.playerId) return;
    const nb = { id: Date.now(), playerId: parseInt(form.playerId), text: form.text.trim(), time: 'just now', reactions: { fire:0, skull:0, trophy:0 } };
    setBanter(prev => [nb, ...prev]);
    setReactions(prev => ({...prev, [nb.id]: { fire:0, skull:0, trophy:0 }}));
    setForm({ ...form, text: '' });
  };

  const allBanter = banter;

  return (
    <div className="page" style={{maxWidth:760}}>
      <div style={{borderTop:'4px double var(--ink)',borderBottom:'4px double var(--ink)',padding:'12px 0',marginBottom:16}}>
        <div className="hed-xl">The Dispatch</div>
        <div style={{fontFamily:"'Libre Baskerville',serif",fontStyle:'italic',fontSize:13,color:'var(--ink-muted)',marginTop:4}}>
          Official communiqués, grievances, boasts, and general grievances of the crew.
        </div>
      </div>

      {/* Post form */}
      <div style={{border:'2px solid var(--ink)',marginBottom:20,padding:14,background:'var(--paper)'}}>
        <div style={{fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:10,borderBottom:'var(--rule)',paddingBottom:6}}>File a Dispatch</div>
        <div className="col-grid-2" style={{gap:10,marginBottom:10}}>
          <div>
            <label>Correspondent</label>
            <div style={{position:'relative'}}>
              <select value={form.playerId} onChange={e=>setForm({...form,playerId:parseInt(e.target.value)})}>
                {players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',fontSize:10}}>▼</span>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'flex-end'}}>
            <button className="btn btn-sm btn-solid" style={{width:'100%'}} onClick={post}>Publish →</button>
          </div>
        </div>
        <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="Say something. Threaten someone. Celebrate yourself." rows={2} style={{resize:'none'}} />
      </div>

      {/* Banter feed */}
      {allBanter.map(b => {
        const p = players.find(x => x.id === b.playerId);
        if (!p) return null;
        const r = reactions[b.id] || b.reactions;
        return (
          <div key={b.id} className="banter-post">
            <div className="banter-meta">
              <div style={{width:22,height:22,borderRadius:'50%',background:p.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#f5f0e8',fontWeight:700,overflow:'hidden',flexShrink:0,cursor:'pointer'}}>
                {p.pfp ? <img src={p.pfp} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : p.initials}
              </div>
              <span className="banter-author">{p.name}</span>
              <span>·</span>
              <span>{b.time}</span>
            </div>
            <div className="banter-text">"{b.text}"</div>
            <div className="banter-reactions">
              {[['fire','🔥'],['skull','💀'],['trophy','🏆']].map(([k,e]) => (
                <button key={k} className="banter-react-btn" onClick={() => react(b.id, k)}>
                  {e} {r[k] || 0}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState('scoreboard');
  const [sport, setSport] = useState('Badminton');
  const [viewPlayerId, setViewPlayerId] = useState(null);

  const [players, setPlayers] = useState(() => load('pg_players', INITIAL_PLAYERS));
  const [matches, setMatches] = useState(() => load('pg_matches', INITIAL_MATCHES));
  const [venues, setVenues] = useState(() => load('pg_venues', INITIAL_VENUES));
  const [banter, setBanter] = useState(() => load('pg_banter', INITIAL_BANTER));

  useEffect(() => save('pg_players', players), [players]);
  useEffect(() => save('pg_matches', matches), [matches]);
  useEffect(() => save('pg_venues', venues), [venues]);
  useEffect(() => save('pg_banter', banter), [banter]);

  const handleSetViewPlayer = (id) => { setViewPlayerId(id); setPage('profile'); };

  return (
    <>
      <Masthead page={page} setPage={setPage} sport={sport} setSport={setSport} />
      <div id="app">
        {page === 'scoreboard' && <ScoreboardPage players={players} matches={matches} sport={sport} setPage={setPage} setViewPlayer={handleSetViewPlayer} banter={banter} />}
        {page === 'roster' && <RosterPage players={players} setPlayers={setPlayers} setViewPlayer={handleSetViewPlayer} setPage={setPage} />}
        {page === 'results' && <ResultsPage matches={matches} players={players} sport={sport} setMatches={setMatches} setPlayers={setPlayers} />}
        {page === 'venues' && <VenuesPage venues={venues} setVenues={setVenues} />}
        {page === 'rations' && <RationsPage />}
        {page === 'dispatch' && <DispatchPage banter={banter} setBanter={setBanter} players={players} />}
        {page === 'profile' && viewPlayerId && <ProfilePage playerId={viewPlayerId} players={players} setPlayers={setPlayers} matches={matches} onBack={() => setPage('roster')} />}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
