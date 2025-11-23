import React, { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState('');

  async function fetchStatus(){
    try {
      const res = await fetch('/api/status');
      const j = await res.json();
      setStatus(j);
    } catch(e) {
      setStatus({ ok: false, error: e.message });
    }
  }

  useEffect(()=>{ fetchStatus(); const i = setInterval(fetchStatus, 5000); return ()=>clearInterval(i); }, []);

  async function add(){
    if(!userId) return alert('Введите ID');
    await fetch('/api/add', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userId }) });
    setUserId(''); fetchStatus();
  }

  async function remove(id){
    await fetch('/api/remove', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userId: id }) });
    fetchStatus();
  }

  return (
    <div style={{ maxWidth:900, margin:'24px auto', fontFamily:'Inter, sans-serif' }}>
      <h1>Discord AutoRole — Панель управления</h1>

      <section style={{ margin:'16px 0' }}>
        <strong>Статус:</strong>
        <pre style={{ background:'#f6f8fa', padding:12 }}>{JSON.stringify(status, null, 2)}</pre>
      </section>

      <section style={{ margin:'16px 0' }}>
        <input placeholder="User ID" value={userId} onChange={e=>setUserId(e.target.value)} />
        <button onClick={add} style={{ marginLeft:8 }}>Добавить</button>
      </section>

      <section>
        <h3>Текущие цели</h3>
        <ul>
          {status && status.targets && status.targets.map(t=> (
            <li key={t}>{t} <button onClick={()=>remove(t)} style={{ marginLeft:8 }}>Удалить</button></li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Логи</h3>
        <div style={{ maxHeight:240, overflow:'auto', background:'#111', color:'#fff', padding:12 }}>
          {status && status.logs && status.logs.map((l,i)=>(<div key={i}>{l}</div>))}
        </div>
      </section>
    </div>
  );
}
