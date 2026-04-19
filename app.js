const { useState, useEffect } = React;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SPORTS = ['Badminton','Pickleball','Volleyball','Basketball','Tennis','Table Tennis'];
const SPORT_ICONS = {
  'Badminton':'BAD','Pickleball':'PCK','Volleyball':'VBL',
  'Basketball':'BSK','Tennis':'TEN','Table Tennis':'TT'
};

const AVATAR_COLORS = [
  '#7c3aed','#0891b2','#059669','#dc2626','#d97706','#db2777','#6366f1','#0ea5e9'
];

const INITIAL_PLAYERS = [
  { id:1, name:'Marcus Webb', handle:'@marcwebb', bio:'I win. Then I eat.', initials:'MW', color:'#7c3aed', wins:18, losses:7, streak:4, favSport:'Badminton', pfp:null },
  { id:2, name:'Priya Nair', handle:'@priya_smash', bio:'Badminton queen, protein evangelist.', initials:'PN', color:'#dc2626', wins:21, losses:5, streak:6, favSport:'Volleyball', pfp:null },
  { id:3, name:'DJ Chen', handle:'@djchen99', bio:'Sleep. Pickleball. Repeat.', initials:'DC', color:'#059669', wins:14, losses:11, streak:-2, favSport:'Pickleball', pfp:null },
  { id:4, name:'Leon Okafor', handle:'@leokafor', bio:'All nets fear me.', initials:'LO', color:'#d97706', wins:16, losses:9, streak:2, favSport:'Volleyball', pfp:null },
  { id:5, name:'Sofia Reyes', handle:'@sof_rey', bio:'Quiet on court. Loud at dinner.', initials:'SR', color:'#db2777', wins:11, losses:14, streak:-1, favSport:'Tennis', pfp:null },
  { id:6, name:'Kai Tanaka', handle:'@kai_t', bio:'Net game only. Always.', initials:'KT', color:'#0891b2', wins:9, losses:16, streak:-3, favSport:'Badminton', pfp:null },
  { id:7, name:'Amara Diallo', handle:'@amarad', bio:'Consistency is the real flex.', initials:'AD', color:'#6366f1', wins:20, losses:5, streak:5, favSport:'Pickleball', pfp:null },
  { id:8, name:'Tomás Vargas', handle:'@tomasv', bio:'Post-game chicken is non-negotiable.', initials:'TV', color:'#0ea5e9', wins:13, losses:12, streak:1, favSport:'Basketball', pfp:null },
];

const INITIAL_MATCHES = [
  { id:1, date:'2025-04-14', sport:'Badminton', team1:[1,3], team2:[2,4], score1:21, score2:15, note:'Marcus and DJ absolutely cooked.' },
  { id:2, date:'2025-04-12', sport:'Volleyball', team1:[5,6,8], team2:[7,1,2], score1:18, score2:25, note:'Amara served fire all set.' },
  { id:3, date:'2025-04-10', sport:'Pickleball', team1:[7,8], team2:[3,5], score1:11, score2:7, note:'Tomás with the clutch dink.' },
  { id:4, date:'2025-04-07', sport:'Badminton', team1:[2], team2:[1], score1:21, score2:18, note:'Priya in her bag today.' },
  { id:5, date:'2025-04-05', sport:'Volleyball', team1:[3,4,6], team2:[1,5,7], score1:22, score2:24, note:'SO close. Heartbreak.' },
];

const INITIAL_BANTER = [
  { id:1, playerId:2, text:"Nobody talk to me until I've had 200g protein and reviewed my serve tape.", time:'2h ago', reactions:{ fire:12, skull:3, trophy:7 } },
  { id:2, playerId:1, text:'The court was wet. My knee was tweaking. Sun was in my eyes. I still won. But those are the facts.', time:'5h ago', reactions:{ fire:4, skull:8, trophy:2 } },
  { id:3, playerId:7, text:'Amara Diallo, 5-streak, no big deal. Just a Tuesday.', time:'1d ago', reactions:{ fire:15, skull:1, trophy:11 } },
  { id:4, playerId:6, text:"Going to start a petition to ban Marcus from playing doubles with rookies. It's not fair.", time:'1d ago', reactions:{ fire:6, skull:5, trophy:3 } },
];

const INITIAL_VENUES = [
  { id:1, name:'Riverdale Community Centre', address:'240 Riverdale Ave', sports:['Badminton','Volleyball'], notes:'Book 3 days ahead. Court 3 is best.', rating:4, cost:'$5/hr' },
  { id:2, name:'Centennial Park Courts', address:'Centennial Park', sports:['Pickleball','Tennis','Badminton'], notes:'Outdoor. Free. Gets busy Sat mornings.', rating:5, cost:'Free' },
  { id:3, name:'The Cage', address:'88 Industrial Blvd', sports:['Basketball','Volleyball'], notes:'Indoor, open gym Sundays 2–6pm.', rating:3, cost:'$3 drop-in' },
];

const POST_GAME_MEALS = [
  { id:1, name:'The Recovery Stack', desc:'Double chicken breast, jasmine rice, grilled broccolini with garlic. The gold standard.', protein:68, carbs:55, fat:12, emoji:'🍗' },
  { id:2, name:'High-Rep Shawarma', desc:'Grilled beef shawarma wrap, hummus, tabbouleh, extra meat no questions asked.', protein:54, carbs:48, fat:22, emoji:'🌯' },
  { id:3, name:'The Aftermath Bowl', desc:'Ground turkey, black beans, brown rice, avocado, lime crema. Assembly required.', protein:61, carbs:65, fat:18, emoji:'🥗' },
  { id:4, name:'Eggs & Havoc', desc:'6-egg scramble, turkey sausage, sourdough toast, roasted tomatoes.', protein:52, carbs:34, fat:26, emoji:'🍳' },
  { id:5, name:'Brisket Blitz', desc:'Slow-smoked brisket, mashed sweet potato, sautéed greens. For serious sessions only.', protein:74, carbs:60, fat:28, emoji:'🥩' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const load = (k, fb) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const getInitials = n => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2);
const winPct = p => p.wins + p.losses === 0 ? 0 : Math.round((p.wins / (p.wins + p.losses)) * 100);
const streakLabel = s => s > 0 ? `W${s}` : s < 0 ? `L${Math.abs(s)}` : '—';
const today = () => new Date().toISOString().split('T')[0];
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric' });

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ player, size = 44, onClick }) {
  return (
    <div onClick={onClick} title={player.name} style={{
      width: size, height: size, borderRadius: '50%',
      background: player.pfp ? 'transparent' : player.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
      fontSize: size * 0.35, color: '#fff',
      overflow: 'hidden', flexShrink: 0,
      cursor: onClick ? 'pointer' : 'default',
      border: '2px solid rgba(255,255,255,0.12)',
    }}>
      {player.pfp ? <img src={player.pfp} alt={player.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : player.initials}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ page, setPage, sport, setSport, players }) {
  const dateStr = new Date().toLocaleDateString('en-CA', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
  const sorted = [...players].sort((a,b) => b.wins - a.wins);
  const tickerText = sorted.map(p => `${p.name.toUpperCase()}  ${p.wins}W–${p.losses}L`).join('   ·   ');
  const navItems = [
    { id:'scoreboard', label:'Scoreboard' },
    { id:'roster', label:'Roster' },
    { id:'results', label:'Results' },
    { id:'venues', label:'Spots' },
    { id:'rations', label:'Fuel' },
    { id:'dispatch', label:'Chat' },
  ];
  return (
    <div className="header">
      <div style={{background:'#c8ff00',overflow:'hidden',height:28,display:'flex',alignItems:'center'}}>
        <span style={{display:'inline-flex',whiteSpace:'nowrap',animation:'ticker 28s linear infinite',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0d0d0f',gap:0}}>
          &nbsp;&nbsp;{tickerText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{tickerText}&nbsp;&nbsp;
        </span>
      </div>
      <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div className="header-top">
        <div className="logo">RALLY<span style={{color:'var(--text3)',fontSize:16,fontWeight:400,letterSpacing:'0.15em',marginLeft:4,verticalAlign:'middle'}}>.GG</span></div>
        <span className="header-date">{dateStr}</span>
      </div>
      <nav className="nav">
        {navItems.map(n => (
          <button key={n.id} className={`nav-btn${page===n.id?' active':''}`} onClick={() => setPage(n.id)}>{n.label}</button>
        ))}
      </nav>
      <div className="sport-bar">
        <span className="sport-label">Sport</span>
        {SPORTS.map(s => (
          <button key={s} className={`sport-btn${sport===s?' active':''}`} onClick={() => setSport(s)}>{s}</button>
        ))}
      </div>
    </div>
  );
}

// ─── SCOREBOARD PAGE ──────────────────────────────────────────────────────────
function ScoreboardPage({ players, matches, sport, setPage, setViewPlayer, banter }) {
  const sorted = [...players].sort((a,b) => b.wins - a.wins || winPct(b) - winPct(a));
  const top = sorted[0];
  const sportMatches = matches.filter(m => m.sport === sport);
  const recent = [...sportMatches].sort((a,b) => b.date.localeCompare(a.date)).slice(0,3);
  const topBanter = banter.slice(0,2);

  return (
    <div className="page">
      {/* Page title */}
      <div style={{marginBottom:24}}>
        <div className="kicker">{sport} · All time</div>
        <div className="hed-xl"><span className="accent">CREW</span> STANDINGS</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:16,alignItems:'start'}}>
        {/* LEFT — leaderboard + recent */}
        <div>
          <div className="section-head"><h2>Leaderboard</h2><div className="section-head-line"></div></div>
          <div className="card" style={{marginBottom:16}}>
            <table className="lb-table">
              <thead>
                <tr>
                  <th style={{width:36}}>#</th>
                  <th>Athlete</th>
                  <th>W</th><th>L</th><th>Pct</th><th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p,i) => (
                  <tr key={p.id}>
                    <td><span className={`lb-rank${i===0?' top1':i===1?' top2':i===2?' top3':''}`}>{i+1}</span></td>
                    <td>
                      <div className="lb-name-cell">
                        <div className="lb-mini-avatar" style={{background:p.color}} onClick={() => { setViewPlayer(p.id); setPage('profile'); }}>
                          {p.pfp ? <img src={p.pfp} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : p.initials}
                        </div>
                        <div>
                          <div className="lb-name" onClick={() => { setViewPlayer(p.id); setPage('profile'); }}>{p.name}</div>
                          <div className="meta" style={{fontSize:10}}>{p.handle}</div>
                        </div>
                        {i===0 && <span className="badge badge-neon" style={{marginLeft:6}}>CHAMP</span>}
                      </div>
                    </td>
                    <td><span className="lb-val">{p.wins}</span></td>
                    <td><span className="lb-val" style={{color:'var(--text3)'}}>{p.losses}</span></td>
                    <td><span className="lb-val lb-pct">{winPct(p)}%</span></td>
                    <td>
                      <span className={p.streak > 0 ? 'lb-streak-pos' : p.streak < 0 ? 'lb-streak-neg' : 'meta'}>
                        {streakLabel(p.streak)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section-head" style={{marginBottom:12}}>
            <h2>Recent Results</h2>
            <div className="section-head-line"></div>
            <button className="section-head-action" onClick={() => setPage('results')}>View all →</button>
          </div>
          {recent.length === 0
            ? <div className="empty-state">No {sport} matches yet. Time to play!</div>
            : recent.map(m => <MatchRow key={m.id} match={m} players={players} />)}
        </div>

        {/* RIGHT — champion + banter */}
        <div>
          {top && (
            <>
              <div className="section-head"><h2>Current Champion</h2><div className="section-head-line"></div></div>
              <div className="champion-card" style={{marginBottom:16}}>
                <div className="champion-label">RANKED #1</div>
                <div style={{display:'flex',gap:14,alignItems:'center'}}>
                  <Avatar player={top} size={56} onClick={() => { setViewPlayer(top.id); setPage('profile'); }} />
                  <div>
                    <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:22,textTransform:'uppercase',color:'var(--text)',lineHeight:1}}>{top.name}</div>
                    <div className="meta" style={{marginTop:3}}>{top.handle}</div>
                    {top.bio && <div style={{fontSize:13,color:'var(--text2)',marginTop:4,fontStyle:'italic'}}>{top.bio}</div>}
                  </div>
                </div>
                <div className="champion-stat-row">
                  {[['Wins',top.wins,true],['Losses',top.losses,false],['Win %',winPct(top)+'%',true],['Streak',streakLabel(top.streak),top.streak>=0]].map(([l,v,pos]) => (
                    <div key={l} className="champion-stat">
                      <span className="champion-stat-val" style={{color: pos ? 'var(--neon)' : 'var(--neon3)'}}>{v}</span>
                      <span className="champion-stat-lbl">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="section-head" style={{marginBottom:12}}>
            <h2>Hot Takes</h2>
            <div className="section-head-line"></div>
            <button className="section-head-action" onClick={() => setPage('dispatch')}>All →</button>
          </div>
          <div className="card" style={{padding:'4px 16px'}}>
            {topBanter.map(b => {
              const p = players.find(x => x.id === b.playerId);
              if (!p) return null;
              return (
                <div key={b.id} className="banter-post">
                  <div className="banter-meta">
                    <Avatar player={p} size={22} onClick={() => { setViewPlayer(p.id); setPage('profile'); }} />
                    <span className="banter-author" onClick={() => { setViewPlayer(p.id); setPage('profile'); }}>{p.name}</span>
                    <span className="banter-time">{b.time}</span>
                  </div>
                  <div className="banter-text">{b.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchRow({ match, players }) {
  const getName = ids => ids.map(id => { const p = players.find(x=>x.id===id); return p ? p.name.split(' ')[0] : '?'; }).join(' & ');
  const w1 = match.score1 > match.score2;
  return (
    <div className="card" style={{marginBottom:8,padding:'12px 16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:14,textTransform:'uppercase',color:w1?'var(--text)':'var(--text3)'}}>{getName(match.team1)}</div>
        </div>
        <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:28,display:'flex',gap:4,alignItems:'center',minWidth:80,justifyContent:'center'}}>
          <span style={{color:w1?'var(--neon)':'var(--text3)'}}>{match.score1}</span>
          <span style={{color:'var(--bg4)',fontSize:16}}>–</span>
          <span style={{color:!w1?'var(--neon)':'var(--text3)'}}>{match.score2}</span>
        </div>
        <div style={{flex:1,textAlign:'right'}}>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:14,textTransform:'uppercase',color:!w1?'var(--text)':'var(--text3)'}}>{getName(match.team2)}</div>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,gap:8}}>
        <span className="meta">{fmtDate(match.date)} · {match.sport}</span>
        {match.note && <span className="meta" style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textAlign:'right'}}>{match.note}</span>}
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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20}}>
        <div>
          <div className="kicker">Season 2025</div>
          <div className="hed-xl">THE <span className="accent">ROSTER</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Player</button>
      </div>

      <div className="grid-4">
        {sorted.map(p => (
          <PlayerCard key={p.id} player={p} onClick={() => { setViewPlayer(p.id); setPage('profile'); }} />
        ))}
      </div>

      {showAdd && <AddPlayerModal onClose={() => setShowAdd(false)} onAdd={p => { setPlayers(prev => [...prev, p]); setShowAdd(false); }} players={players} />}
    </div>
  );
}

function PlayerCard({ player, onClick }) {
  const accentColor = player.streak > 2 ? 'var(--neon)' : player.streak < -2 ? 'var(--neon3)' : 'var(--border)';
  return (
    <div className="player-card" onClick={onClick}>
      <div className="player-card-top" style={{background:accentColor}}></div>
      <div className="player-card-body">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <Avatar player={player} size={44} />
          <div>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:16,textTransform:'uppercase',color:'var(--text)',lineHeight:1}}>{player.name}</div>
            <div className="meta" style={{fontSize:10,marginTop:2}}>{player.handle}</div>
          </div>
        </div>
        {player.bio && <div style={{fontSize:12,color:'var(--text3)',fontStyle:'italic',marginBottom:8,lineHeight:1.4}}>{player.bio}</div>}
        <div className="chip chip-dim" style={{fontSize:10,display:'inline-flex'}}>{player.favSport}</div>
      </div>
      <div className="player-card-stats">
        <div className="player-stat">
          <span className="player-stat-val neon">{player.wins}</span>
          <span className="player-stat-lbl">Wins</span>
        </div>
        <div className="player-stat">
          <span className="player-stat-val">{winPct(player)}%</span>
          <span className="player-stat-lbl">Win%</span>
        </div>
        <div className="player-stat">
          <span className={`player-stat-val ${player.streak > 0 ? 'neon' : player.streak < 0 ? 'red' : ''}`}>{streakLabel(player.streak)}</span>
          <span className="player-stat-lbl">Streak</span>
        </div>
      </div>
    </div>
  );
}

function AddPlayerModal({ onClose, onAdd, players }) {
  const [form, setForm] = useState({ name:'', handle:'', bio:'', favSport:SPORTS[0] });
  const usedColors = players.map(p => p.color);
  const availColor = AVATAR_COLORS.find(c => !usedColors.includes(c)) || AVATAR_COLORS[players.length % AVATAR_COLORS.length];

  const submit = () => {
    if (!form.name.trim()) return;
    onAdd({
      id: Date.now(), name: form.name.trim(),
      handle: form.handle || '@' + form.name.split(' ')[0].toLowerCase(),
      bio: form.bio, initials: getInitials(form.name), color: availColor,
      wins: 0, losses: 0, streak: 0, favSport: form.favSport, pfp: null
    });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add to the Roster</div>
        <div className="form-field"><label>Full Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Jordan Blake" /></div>
        <div className="form-field"><label>Handle</label><input type="text" value={form.handle} onChange={e=>setForm({...form,handle:e.target.value})} placeholder="@handle" /></div>
        <div className="form-field"><label>Bio / Tagline</label><input type="text" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="One line. Make it count." /></div>
        <div className="form-field"><label>Favourite Sport</label><select value={form.favSport} onChange={e=>setForm({...form,favSport:e.target.value})}>{SPORTS.map(s=><option key={s}>{s}</option>)}</select></div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={submit}>Add Player</button>
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS PAGE ─────────────────────────────────────────────────────────────
function ResultsPage({ matches, players, sport, setMatches, setPlayers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = matches
    .filter(m => activeTab === 'all' || m.sport === activeTab)
    .sort((a,b) => b.date.localeCompare(a.date));

  const getName = ids => ids.map(id => { const p = players.find(x=>x.id===id); return p ? p.name.split(' ')[0] : '?'; }).join(' & ');

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20}}>
        <div>
          <div className="kicker">All sports</div>
          <div className="hed-xl">MATCH <span className="accent">RESULTS</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Log Match</button>
      </div>

      {/* Sport filter tabs */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
        {['all', ...SPORTS].map(s => (
          <button key={s} className={`btn btn-sm${activeTab===s?' btn-primary':' btn-ghost'}`} onClick={() => setActiveTab(s)}>
            {s === 'all' ? 'All Sports' : s}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="empty-state">No {activeTab === 'all' ? '' : activeTab + ' '}matches logged yet.</div>
        : (
          <div className="card">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Date</th><th>Sport</th><th>Team 1</th><th style={{textAlign:'center'}}>Score</th><th>Team 2</th><th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const w1 = m.score1 > m.score2;
                  return (
                    <tr key={m.id}>
                      <td className="meta">{fmtDate(m.date)}</td>
                      <td><span className="result-sport-badge">{SPORT_ICONS[m.sport]||m.sport.slice(0,3).toUpperCase()}</span></td>
                      <td style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:w1?700:400,fontSize:14,textTransform:'uppercase',color:w1?'var(--text)':'var(--text3)'}}>{getName(m.team1)}</td>
                      <td style={{textAlign:'center',fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:20,whiteSpace:'nowrap'}}>
                        <span style={{color:w1?'var(--neon)':'var(--text3)'}}>{m.score1}</span>
                        <span style={{color:'var(--bg4)',margin:'0 4px',fontSize:14}}>–</span>
                        <span style={{color:!w1?'var(--neon)':'var(--text3)'}}>{m.score2}</span>
                      </td>
                      <td style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:!w1?700:400,fontSize:14,textTransform:'uppercase',color:!w1?'var(--text)':'var(--text3)'}}>{getName(m.team2)}</td>
                      <td className="meta" style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      }

      {showAdd && (
        <LogMatchModal players={players} onClose={() => setShowAdd(false)}
          onLog={m => {
            setMatches(prev => [m, ...prev]);
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
  const [form, setForm] = useState({ sport:SPORTS[0], date:today(), team1:[], team2:[], score1:'', score2:'', note:'' });

  const togglePlayer = (team, pid) => {
    const other = team === 1 ? 'team2' : 'team1';
    if (form[other].includes(pid)) return;
    const key = team === 1 ? 'team1' : 'team2';
    setForm(f => ({ ...f, [key]: f[key].includes(pid) ? f[key].filter(x=>x!==pid) : [...f[key], pid] }));
  };

  const submit = () => {
    if (!form.team1.length || !form.team2.length) return alert('Each team needs at least one player.');
    if (form.score1 === '' || form.score2 === '') return alert('Enter the final score.');
    onLog({ ...form, id:Date.now(), score1:parseInt(form.score1), score2:parseInt(form.score2), team1:[...form.team1], team2:[...form.team2] });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Log a Match</div>
        <div className="grid-2" style={{marginBottom:12}}>
          <div className="form-field" style={{marginBottom:0}}>
            <label>Sport</label>
            <select value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})}>
              {SPORTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-field" style={{marginBottom:0}}>
            <label>Date</label>
            <input type="text" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="YYYY-MM-DD" />
          </div>
        </div>

        <div className="form-field">
          <label>Select Players</label>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {players.map(p => {
              const inT1 = form.team1.includes(p.id);
              const inT2 = form.team2.includes(p.id);
              return (
                <div key={p.id} style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:6,alignItems:'center'}}>
                  <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:600,fontSize:14,textTransform:'uppercase',color:inT1?'var(--neon2)':inT2?'var(--neon3)':'var(--text3)'}}>{p.name}</div>
                  <button onClick={() => togglePlayer(1,p.id)} className={`btn btn-sm${inT1?' btn-primary':' btn-ghost'}`} style={{padding:'4px 10px',borderColor:inT1?'var(--neon2)':'var(--border2)',color:inT1?'var(--neon2)':'var(--text3)',background:inT1?'rgba(0,229,255,0.1)':'none',fontSize:11}}>T1</button>
                  <button onClick={() => togglePlayer(2,p.id)} className="btn btn-sm btn-ghost" style={{padding:'4px 10px',borderColor:inT2?'var(--neon3)':'var(--border2)',color:inT2?'var(--neon3)':'var(--text3)',background:inT2?'rgba(255,61,113,0.1)':'none',fontSize:11}}>T2</button>
                </div>
              );
            })}
          </div>
          <div className="meta" style={{marginTop:8}}>
            Team 1: {form.team1.map(id=>players.find(p=>p.id===id)?.name.split(' ')[0]).join(', ')||'none'} &nbsp;|&nbsp;
            Team 2: {form.team2.map(id=>players.find(p=>p.id===id)?.name.split(' ')[0]).join(', ')||'none'}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:10,alignItems:'end',marginBottom:12}}>
          <div className="form-field" style={{marginBottom:0}}>
            <label style={{textAlign:'center'}}>Team 1 Score</label>
            <input type="number" value={form.score1} onChange={e=>setForm({...form,score1:e.target.value})} min="0" style={{textAlign:'center',fontSize:22,fontFamily:'Barlow Condensed,sans-serif',fontWeight:700}} />
          </div>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:18,color:'var(--text3)',textAlign:'center',paddingBottom:10}}>VS</div>
          <div className="form-field" style={{marginBottom:0}}>
            <label style={{textAlign:'center'}}>Team 2 Score</label>
            <input type="number" value={form.score2} onChange={e=>setForm({...form,score2:e.target.value})} min="0" style={{textAlign:'center',fontSize:22,fontFamily:'Barlow Condensed,sans-serif',fontWeight:700}} />
          </div>
        </div>

        <div className="form-field"><label>Post-match notes</label><input type="text" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What happened? Who choked?" /></div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={submit}>Log It</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ playerId, players, setPlayers, matches, onBack }) {
  const player = players.find(p => p.id === playerId);
  if (!player) return <div className="page"><button className="back-btn" onClick={onBack}>← Back</button></div>;

  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(player.bio);
  const [editHandle, setEditHandle] = useState(player.handle);
  const [pfpInput, setPfpInput] = useState('');

  const playerMatches = matches
    .filter(m => m.team1.includes(player.id) || m.team2.includes(player.id))
    .sort((a,b) => b.date.localeCompare(a.date));

  const getName = ids => ids.map(id => { const p = players.find(x=>x.id===id); return p ? p.name.split(' ')[0] : '?'; }).join(' & ');
  const sorted = [...players].sort((a,b) => b.wins - a.wins);
  const rank = sorted.findIndex(p => p.id === player.id) + 1;

  const saveProfile = () => {
    setPlayers(prev => prev.map(p => p.id===player.id ? {...p, bio:editBio, handle:editHandle, pfp:pfpInput||p.pfp} : p));
    setEditing(false);
  };

  return (
    <div className="page" style={{maxWidth:860}}>
      <button className="back-btn" onClick={onBack}>← Back to Roster</button>

      <div className="profile-header">
        <Avatar player={player} size={72} />
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:32,textTransform:'uppercase',color:'var(--text)',lineHeight:1}}>{player.name}</div>
            <span className="chip chip-neon">Rank #{rank}</span>
          </div>
          {editing
            ? <input type="text" value={editHandle} onChange={e=>setEditHandle(e.target.value)} style={{marginTop:6,fontSize:12,color:'var(--text3)'}} />
            : <div className="meta" style={{marginTop:4}}>{player.handle} · {player.favSport}</div>}
          {editing
            ? <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} style={{marginTop:8,fontSize:13,resize:'none',height:56}} rows={2} />
            : <div style={{fontSize:13,color:'var(--text2)',marginTop:6,fontStyle:'italic'}}>{player.bio || 'No bio yet.'}</div>}
          {editing && (
            <div className="form-field" style={{marginTop:8,marginBottom:0}}>
              <label>Photo URL</label>
              <input type="text" value={pfpInput} onChange={e=>setPfpInput(e.target.value)} placeholder="Paste image URL" />
            </div>
          )}
          <div style={{display:'flex',gap:6,marginTop:10}}>
            {editing
              ? <>
                  <button className="btn btn-primary btn-sm" onClick={saveProfile}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                </>
              : <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(true); setEditBio(player.bio); setEditHandle(player.handle); }}>Edit Profile</button>}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        {[['Wins',player.wins,'neon'],['Losses',player.losses,'red'],['Win %',winPct(player)+'%','neon'],['Streak',streakLabel(player.streak),player.streak>=0?'neon':'red']].map(([l,v,c]) => (
          <div key={l} className="stat-block">
            <span className={`stat-block-val ${c}`}>{v}</span>
            <span className="stat-block-lbl">{l}</span>
          </div>
        ))}
      </div>

      <div className="section-head" style={{marginBottom:12}}>
        <h2>Match History</h2>
        <div className="section-head-line"></div>
        <span className="meta">{playerMatches.length} matches</span>
      </div>

      {playerMatches.length === 0
        ? <div className="empty-state">No matches recorded yet. Get out there!</div>
        : (
          <div className="card">
            <table className="results-table">
              <thead>
                <tr><th>Date</th><th>Sport</th><th>Opponents</th><th style={{textAlign:'center'}}>Score</th><th>Result</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {playerMatches.map(m => {
                  const inT1 = m.team1.includes(player.id);
                  const won = (inT1 && m.score1 > m.score2) || (!inT1 && m.score2 > m.score1);
                  const myScore = inT1 ? m.score1 : m.score2;
                  const theirScore = inT1 ? m.score2 : m.score1;
                  const opponents = inT1 ? m.team2 : m.team1;
                  return (
                    <tr key={m.id}>
                      <td className="meta">{fmtDate(m.date)}</td>
                      <td><span className="result-sport-badge">{SPORT_ICONS[m.sport]||m.sport.slice(0,3)}</span></td>
                      <td style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:13,textTransform:'uppercase',color:'var(--text2)'}}>{getName(opponents)}</td>
                      <td style={{textAlign:'center',fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:18,whiteSpace:'nowrap'}}>
                        <span style={{color:won?'var(--neon)':'var(--neon3)'}}>{myScore}</span>
                        <span style={{color:'var(--bg4)',margin:'0 4px',fontSize:13}}>–</span>
                        <span style={{color:'var(--text3)'}}>{theirScore}</span>
                      </td>
                      <td><span className={`badge ${won?'badge-neon':'badge-red'}`}>{won?'WIN':'LOSS'}</span></td>
                      <td className="meta" style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}

// ─── VENUES PAGE ──────────────────────────────────────────────────────────────
function VenuesPage({ venues, setVenues }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', address:'', sports:[], notes:'', rating:4, cost:'' });

  const submitVenue = () => {
    if (!form.name.trim()) return;
    setVenues(prev => [...prev, { ...form, id:Date.now(), sports:[...form.sports] }]);
    setShowAdd(false);
    setForm({ name:'', address:'', sports:[], notes:'', rating:4, cost:'' });
  };

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20}}>
        <div>
          <div className="kicker">Where we run it</div>
          <div className="hed-xl">OUR <span className="accent">SPOTS</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Venue</button>
      </div>

      <div className="grid-3">
        {venues.map(v => (
          <div key={v.id} className="venue-card">
            <div className="venue-card-top">
              <div>
                <div className="venue-card-name">{v.name}</div>
                <div className="venue-card-addr">{v.address}</div>
              </div>
              <div className="venue-cost">{v.cost}</div>
            </div>
            <div className="venue-card-body">{v.notes}</div>
            <div className="venue-card-foot">
              <div className="venue-tags">{v.sports.map(s=><span key={s} className="venue-tag">{s}</span>)}</div>
              <span className="venue-rating">{'★'.repeat(v.rating)}{'☆'.repeat(5-v.rating)}</span>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">Add a Venue</div>
            <div className="form-field"><label>Venue Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-field"><label>Address</label><input type="text" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
            <div className="form-field">
              <label>Sports Played Here</label>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>
                {SPORTS.map(s=>(
                  <button key={s} onClick={()=>setForm(f=>({...f,sports:f.sports.includes(s)?f.sports.filter(x=>x!==s):[...f.sports,s]}))}
                    className={`btn btn-sm${form.sports.includes(s)?' btn-primary':' btn-ghost'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="form-field"><label>Notes / Tips</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} /></div>
            <div className="grid-2">
              <div className="form-field"><label>Rating (1–5)</label><input type="number" min="1" max="5" value={form.rating} onChange={e=>setForm({...form,rating:parseInt(e.target.value)})} /></div>
              <div className="form-field"><label>Cost</label><input type="text" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="e.g. Free, $5/hr" /></div>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={submitVenue}>Add Venue</button>
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
      <div style={{marginBottom:24}}>
        <div className="kicker">High-protein recovery</div>
        <div className="hed-xl">POST-GAME <span className="accent">FUEL</span></div>
      </div>

      <div className="grid-3" style={{marginBottom:28}}>
        {POST_GAME_MEALS.map(meal => (
          <div key={meal.id} className={`food-card${active===meal.id?' active':''}`} onClick={() => setActive(active===meal.id?null:meal.id)}>
            <div className="food-card-top">
              <div className="food-card-name">{meal.name}</div>
              <span style={{fontSize:22}}>{meal.emoji}</span>
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

      <div className="section-head" style={{marginBottom:14}}>
        <h2>Standing Orders</h2>
        <div className="section-head-line"></div>
      </div>
      <div className="grid-3">
        {[
          { title:'The Non-Negotiable', body:'200g protein minimum on game day. No exceptions. No excuses. Your muscles have voted.' },
          { title:'The Sacred Rule', body:'Whoever loses buys the rice. This has been the law since the first session and shall remain so.' },
          { title:'The Recovery Code', body:'No ultra-processed junk after 3 sets of anything. You played too hard to insult the effort.' },
        ].map(n => (
          <div key={n.title} className="card" style={{padding:16}}>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:14,textTransform:'uppercase',color:'var(--neon)',letterSpacing:'0.05em',marginBottom:8}}>{n.title}</div>
            <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.55}}>{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DISPATCH PAGE ─────────────────────────────────────────────────────────────
function DispatchPage({ banter, setBanter, players }) {
  const [form, setForm] = useState({ playerId: players[0]?.id || '', text:'' });
  const [reactions, setReactions] = useState(banter.reduce((acc,b) => ({...acc,[b.id]:b.reactions}),{}));

  const react = (id, emoji) => {
    setReactions(prev => ({ ...prev, [id]: { ...prev[id], [emoji]: (prev[id]?.[emoji]||0) + 1 } }));
  };

  const post = () => {
    if (!form.text.trim() || !form.playerId) return;
    const nb = { id:Date.now(), playerId:parseInt(form.playerId), text:form.text.trim(), time:'just now', reactions:{fire:0,skull:0,trophy:0} };
    setBanter(prev => [nb, ...prev]);
    setReactions(prev => ({...prev, [nb.id]:{fire:0,skull:0,trophy:0}}));
    setForm({...form, text:''});
  };

  return (
    <div className="page" style={{maxWidth:760}}>
      <div style={{marginBottom:24}}>
        <div className="kicker">Crew chat · All access</div>
        <div className="hed-xl">THE <span className="accent">DISPATCH</span></div>
      </div>

      <div className="add-form" style={{marginBottom:20}}>
        <div className="add-form-title">Drop a Take</div>
        <div className="grid-2" style={{marginBottom:10}}>
          <div className="form-field" style={{marginBottom:0}}>
            <label>Who's talking</label>
            <select value={form.playerId} onChange={e=>setForm({...form,playerId:parseInt(e.target.value)})}>
              {players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{display:'flex',alignItems:'flex-end'}}>
            <button className="btn btn-primary" style={{width:'100%'}} onClick={post}>Post →</button>
          </div>
        </div>
        <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="Say something. Threaten someone. Celebrate yourself." rows={2} style={{resize:'none'}} />
      </div>

      <div className="card" style={{padding:'4px 16px'}}>
        {banter.map(b => {
          const p = players.find(x => x.id === b.playerId);
          if (!p) return null;
          const r = reactions[b.id] || b.reactions;
          return (
            <div key={b.id} className="banter-post">
              <div className="banter-meta">
                <Avatar player={p} size={28} />
                <span className="banter-author">{p.name}</span>
                <span className="banter-time">{b.time}</span>
              </div>
              <div className="banter-text">{b.text}</div>
              <div className="banter-reactions">
                {[['fire','🔥'],['skull','💀'],['trophy','🏆']].map(([k,e]) => (
                  <button key={k} className="banter-react-btn" onClick={() => react(b.id, k)}>
                    {e} {r[k]||0}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState('scoreboard');
  const [sport, setSport] = useState('Badminton');
  const [viewPlayerId, setViewPlayerId] = useState(null);

  const [players, setPlayers] = useState(() => load('rally_players', INITIAL_PLAYERS));
  const [matches, setMatches] = useState(() => load('rally_matches', INITIAL_MATCHES));
  const [venues, setVenues] = useState(() => load('rally_venues', INITIAL_VENUES));
  const [banter, setBanter] = useState(() => load('rally_banter', INITIAL_BANTER));

  useEffect(() => save('rally_players', players), [players]);
  useEffect(() => save('rally_matches', matches), [matches]);
  useEffect(() => save('rally_venues', venues), [venues]);
  useEffect(() => save('rally_banter', banter), [banter]);

  const handleSetViewPlayer = id => { setViewPlayerId(id); setPage('profile'); };

  return (
    <>
      <Header page={page} setPage={setPage} sport={sport} setSport={setSport} players={players} />
      <div id="main">
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
