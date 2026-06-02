import { useState } from 'react';
import { IconSearch, IconFilter, IconPlus, IconArrowR, IconSparkle, IconBot, IconWA, IconPhone, IconCalendar, IconCheck, IconUsers } from '../icons';
import { useStore } from '../store';
import { FMT_UYU } from '../data';
import { Avatar, PageHeader } from '../shell';
import { Modal, Field, TextInput, TextArea } from '../ui';

// Vista Clientes — ficha generada por el agente IA, grupos y notas editables.

const TAG_INFO = {
  vip: { label: 'VIP', cls: 'tag tag-vip' },
  fiel: { label: 'Fiel', cls: 'tag ok' },
  nuevo: { label: 'Nuevo', cls: 'tag accent' },
  activo: { label: 'Activo', cls: 'tag' },
  riesgo: { label: 'En riesgo', cls: 'tag warn' },
};
const AV = ['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8b5cf6'];
const avColor = (id) => AV[Math.abs([...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)) % AV.length];
const fechaLarga = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); const M = ['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic']; return `${d} ${M[+m - 1]} ${y}`; };

function ClientDetail({ cli, grupos, onToggleGrupo, onSaveNotas }) {
  const ti = TAG_INFO[cli.tag];
  const [notas, setNotas] = useState(cli.notas || '');
  const dirty = notas !== (cli.notas || '');
  return (
    <div className="card" style={{ position: 'sticky', top: 16 }}>
      <div className="cli-detail-hero">
        <Avatar initials={cli.nombre.split(' ').map((s) => s[0]).slice(0, 2).join('')} color={avColor(cli.id)} size="xl" />
        <div style={{ marginTop: 12 }}>
          <div className="text-lg fw-600">{cli.nombre}</div>
          <div className="text-xs muted">{cli.tel}</div>
        </div>
        <div style={{ marginTop: 8 }}><span className={ti.cls}>{ti.label}</span></div>
      </div>

      <div className="grid-3" style={{ padding: '0 16px 14px', gap: 8 }}>
        <button className="btn sm" style={{ width: '100%' }}><IconCalendar size={12} /> Agendar</button>
        <button className="btn ghost sm" style={{ width: '100%' }}><IconWA size={12} /> WhatsApp</button>
        <button className="btn ghost sm" style={{ width: '100%' }}><IconPhone size={12} /> Llamar</button>
      </div>

      {/* Ficha — generada por la IA al recepcionar */}
      <div className="cli-ficha">
        <div className="cli-ficha-hd"><IconBot size={12} color="var(--agent)" /> Ficha del cliente</div>
        <div className="cli-ficha-row"><span>Email</span><b>{cli.email || '—'}</b></div>
        <div className="cli-ficha-row"><span>Dirección</span><b>{cli.direccion || '—'}</b></div>
        <div className="cli-ficha-row"><span>Nacimiento</span><b>{fechaLarga(cli.nacimiento)}</b></div>
      </div>

      <div className="cli-detail-stats">
        <div><div className="text-xxs muted">Visitas</div><div className="text-lg fw-600 mono">{cli.visitas}</div></div>
        <div><div className="text-xxs muted">Última</div><div className="text-lg fw-600">{cli.ult}</div></div>
        <div><div className="text-xxs muted">Gasto total</div><div className="text-lg fw-600 mono">{FMT_UYU(cli.visitas * 920)}</div></div>
      </div>

      {/* Grupos */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div className="cli-sect-lbl">Grupos para promociones</div>
        <div className="cli-grupos">
          {grupos.map((g) => {
            const on = (cli.grupos || []).includes(g.id);
            return (
              <button key={g.id} className={'cli-grupo-chip' + (on ? ' is-on' : '')}
                style={on ? { background: g.color, borderColor: g.color, color: '#fff' } : { borderColor: g.color, color: g.color }}
                onClick={() => onToggleGrupo(g.id)}>
                {on && <IconCheck size={10} sw={2.6} />} {g.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notas editables */}
      <div style={{ padding: '0 16px 16px' }}>
        <div className="cli-sect-lbl">Notas y preferencias <span className="muted" style={{ textTransform: 'none', fontWeight: 400 }}>· editable</span></div>
        <TextArea value={notas} onChange={setNotas} rows={3} placeholder="Ej: gusto del café, preferencia de barbero, alergias…" />
        <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
          <button className="btn accent sm" disabled={!dirty} onClick={() => onSaveNotas(notas)}>Guardar nota</button>
          {!dirty && cli.notas && <span className="text-xxs muted">Guardado</span>}
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="cli-sect-lbl">Preferencia detectada</div>
        <div className="cli-ainote">
          <IconSparkle size={12} color="var(--agent)" />
          <span className="text-xs">{cli.pref !== '—' ? cli.pref : 'Aún sin preferencia definida'}</span>
        </div>
      </div>
    </div>
  );
}

function AltaModal({ open, onClose }) {
  const { actions } = useStore();
  const [f, setF] = useState({ nombre: '', tel: '', email: '', direccion: '', nacimiento: '' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => { if (!f.nombre.trim()) return; actions.createCliente({ ...f, nombre: f.nombre.trim() }); onClose(); setF({ nombre: '', tel: '', email: '', direccion: '', nacimiento: '' }); };
  return (
    <Modal open={open} onClose={onClose} title="Nuevo cliente" subtitle="Ficha generada manualmente"
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!f.nombre.trim()}><IconPlus size={13} /> Crear cliente</button></>}>
      <div className="form-stack">
        <Field label="Nombre completo" required><TextInput value={f.nombre} onChange={set('nombre')} placeholder="Nombre y apellido" /></Field>
        <div className="form-grid">
          <Field label="Teléfono"><TextInput value={f.tel} onChange={set('tel')} placeholder="099 123 456" /></Field>
          <Field label="Fecha de nacimiento"><input className="inp" type="date" value={f.nacimiento} onChange={(e) => set('nacimiento')(e.target.value)} /></Field>
        </div>
        <Field label="Email"><TextInput value={f.email} onChange={set('email')} type="email" placeholder="cliente@email.com" /></Field>
        <Field label="Dirección"><TextInput value={f.direccion} onChange={set('direccion')} placeholder="Calle, barrio" /></Field>
      </div>
    </Modal>
  );
}

function GrupoModal({ open, onClose }) {
  const { actions } = useStore();
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#0EA5E9');
  const submit = () => { if (!nombre.trim()) return; actions.createGrupo({ nombre: nombre.trim(), color, desc: '' }); onClose(); setNombre(''); };
  return (
    <Modal open={open} onClose={onClose} title="Nuevo grupo" subtitle="Segmentar clientes para campañas" width={400}
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn accent" onClick={submit} disabled={!nombre.trim()}>Crear grupo</button></>}>
      <div className="form-stack">
        <Field label="Nombre del grupo" required><TextInput value={nombre} onChange={setNombre} placeholder="Ej: VIP fades" /></Field>
        <Field label="Color">
          <div className="flex gap-2">
            {['#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8b5cf6'].map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: 6, background: c, border: color === c ? '2px solid var(--fg)' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

export function ViewClientes() {
  const { state, actions } = useStore();
  const [selectedId, setSelected] = useState('c2');
  const [seg, setSeg] = useState('todos');
  const [grupoFilter, setGrupoFilter] = useState('todos');
  const [alta, setAlta] = useState(false);
  const [grupoModal, setGrupoModal] = useState(false);

  const segments = [
    { id: 'todos', label: 'Todos', count: state.clientes.length },
    { id: 'vip', label: 'VIP', count: state.clientes.filter((c) => c.tag === 'vip').length },
    { id: 'fiel', label: 'Fieles', count: state.clientes.filter((c) => c.tag === 'fiel').length },
    { id: 'riesgo', label: 'En riesgo', count: state.clientes.filter((c) => c.tag === 'riesgo').length },
    { id: 'nuevo', label: 'Nuevos', count: state.clientes.filter((c) => c.tag === 'nuevo').length },
  ];

  let list = seg === 'todos' ? state.clientes : state.clientes.filter((c) => c.tag === seg);
  if (grupoFilter !== 'todos') list = list.filter((c) => (c.grupos || []).includes(grupoFilter));
  const cli = state.clientes.find((c) => c.id === selectedId) || state.clientes[0];

  const toggleGrupo = (gid) => {
    const cur = cli.grupos || [];
    const next = cur.includes(gid) ? cur.filter((x) => x !== gid) : [...cur, gid];
    actions.updateCliente(cli.id, { grupos: next });
  };
  const saveNotas = (notas) => { actions.updateCliente(cli.id, { notas }); actions.toast('Nota guardada'); };

  return (
    <div className="page">
      <PageHeader title="Clientes" subtitle={`${state.clientes.length} clientes · fichas generadas por el agente IA`}
        actions={<><button className="btn ghost sm" onClick={() => setGrupoModal(true)}><IconUsers size={13} /> Nuevo grupo</button><button className="btn accent sm" onClick={() => setAlta(true)}><IconPlus size={13} /> Nuevo cliente</button></>} />

      <div className="cli-shell">
        <div className="card cli-list-card">
          <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
            <div className="search-box" style={{ width: '100%' }}><IconSearch size={14} /><span>Buscar cliente, teléfono…</span></div>
            <div className="filter-chips" style={{ marginTop: 10, flexWrap: 'wrap' }}>
              {segments.map((s) => (
                <button key={s.id} className={'chip' + (seg === s.id ? ' is-active' : '')} onClick={() => setSeg(s.id)}>{s.label}<span className="chip-count">{s.count}</span></button>
              ))}
            </div>
            <div className="filter-chips" style={{ marginTop: 8, flexWrap: 'wrap' }}>
              <button className={'chip' + (grupoFilter === 'todos' ? ' is-active' : '')} onClick={() => setGrupoFilter('todos')}><IconFilter size={11} /> Grupos</button>
              {state.grupos.map((g) => (
                <button key={g.id} className={'chip' + (grupoFilter === g.id ? ' is-active' : '')} onClick={() => setGrupoFilter(g.id)}>
                  <span className="chip-dot" style={{ background: g.color }} />{g.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="cli-table-hd">
            <span>Cliente</span><span>Visitas</span><span>Última</span><span>Preferencias</span><span>Estado</span>
          </div>
          <div className="cli-table scroll">
            {list.map((c) => {
              const ti = TAG_INFO[c.tag];
              return (
                <button key={c.id} className={'cli-row' + (c.id === selectedId ? ' is-active' : '')} onClick={() => setSelected(c.id)}>
                  <div className="flex items-center gap-3">
                    <Avatar initials={c.nombre.split(' ').map((s) => s[0]).slice(0, 2).join('')} color={avColor(c.id)} />
                    <div style={{ minWidth: 0 }}><div className="text-sm fw-500 truncate">{c.nombre}</div><div className="text-xxs muted">{c.tel}</div></div>
                  </div>
                  <div className="mono text-sm">{c.visitas}</div>
                  <div className="text-xs muted">{c.ult}</div>
                  <div className="text-xs truncate">{c.pref}</div>
                  <div><span className={ti.cls}>{ti.label}</span></div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cli-side">
          <ClientDetail key={cli.id} cli={cli} grupos={state.grupos} onToggleGrupo={toggleGrupo} onSaveNotas={saveNotas} />
        </div>
      </div>

      <AltaModal open={alta} onClose={() => setAlta(false)} />
      <GrupoModal open={grupoModal} onClose={() => setGrupoModal(false)} />
    </div>
  );
}
