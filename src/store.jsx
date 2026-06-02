// Store central — Vero Uomo
// Estado mutable compartido (Context + useReducer). Sembrado desde data.jsx.
// Conecta cobros ↔ turnos ↔ stock ↔ ventas ↔ propinas para que la maqueta
// funcione de punta a punta sobre datos en memoria (sin backend).

import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import {
  TURNOS_HOY, CLIENTES, SERVICIOS, PRODUCTOS, GASTOS, NOTAS_EQUIPO,
  GRUPOS_CLIENTES, PROMOS, VENTAS, CUPONERAS, CUPONERAS_CLIENTES,
} from './data';

// ── helpers ────────────────────────────────────────────────────────────
let _seq = 1000;
export const uid = (p = 'id') => `${p}-${Date.now().toString(36)}-${(_seq++).toString(36)}`;

// Enriquecer turnos del día con estados variados (lo que antes hacía agenda.jsx)
function seedTurnos() {
  const overrides = { t1: 'cobrado', t2: 'cobrado', t3: 'cobrado', t4: 'en-curso', t5: 'en-curso', t11: 'no-show' };
  return TURNOS_HOY.map((t) => ({
    ...t,
    estado: overrides[t.id] || (t.estado === 'completo' ? 'cobrado' : t.estado),
    confirmado: ['t6', 't7', 't8', 't9', 't10', 't13', 't14', 't15', 't16'].includes(t.id),
    pagado: ['t1', 't2', 't3'].includes(t.id),
  }));
}

const EMPTY_COBRO = {
  open: false,
  mode: 'walkin',     // 'turno' | 'walkin'
  turnoId: null,
  clienteNombre: '',
  empleadoId: 'mati',
  items: [],          // { key, tipo:'servicio'|'producto', refId, nombre, precio, qty }
  descuento: 0,
  propina: 0,
  pagos: [],          // { metodo, monto }
};

const initialState = {
  turnos: seedTurnos(),
  clientes: CLIENTES,
  servicios: SERVICIOS,
  productos: PRODUCTOS,
  promos: PROMOS,
  ventas: VENTAS,
  gastos: GASTOS,
  notas: NOTAS_EQUIPO,
  grupos: GRUPOS_CLIENTES,
  bloqueos: [],       // { id, barbero|'all', hora, motivo }
  cuponeras: CUPONERAS,
  cuponerasClientes: CUPONERAS_CLIENTES,
  cobro: EMPTY_COBRO,
  toast: null,        // { id, msg, kind }
};

// ── totales del cobro (puro) ────────────────────────────────────────────
export function cobroTotals(cobro) {
  const subtotal = cobro.items.reduce((s, i) => s + i.precio * i.qty, 0);
  const descuento = Math.min(cobro.descuento || 0, subtotal);
  const propina = cobro.propina || 0;
  const total = subtotal - descuento + propina;
  const pagado = cobro.pagos.reduce((s, p) => s + (p.monto || 0), 0);
  return { subtotal, descuento, propina, total, pagado, falta: total - pagado };
}

// ── reducer ─────────────────────────────────────────────────────────────
function reducer(state, a) {
  switch (a.type) {
    // ---- Cobro / carrito ----
    case 'COBRO_OPEN_TURNO': {
      const t = a.turno;
      const sv = state.servicios.find((s) => s.nombre === t.servicio);
      return {
        ...state,
        cobro: {
          ...EMPTY_COBRO,
          open: true,
          mode: 'turno',
          turnoId: t.id,
          clienteNombre: t.cliente,
          empleadoId: t.barbero,
          items: [{
            key: uid('it'), tipo: 'servicio',
            refId: sv?.id || 'corte', nombre: t.servicio, precio: t.precio, qty: 1,
          }],
        },
      };
    }
    case 'COBRO_OPEN_WALKIN':
      return { ...state, cobro: { ...EMPTY_COBRO, open: true, mode: 'walkin' } };
    case 'COBRO_CLOSE':
      return { ...state, cobro: { ...state.cobro, open: false } };
    case 'COBRO_PATCH':
      return { ...state, cobro: { ...state.cobro, ...a.patch } };
    case 'COBRO_ADD_ITEM': {
      const it = a.item;
      const ex = state.cobro.items.find((i) => i.tipo === it.tipo && i.refId === it.refId);
      const items = ex
        ? state.cobro.items.map((i) => (i === ex ? { ...i, qty: i.qty + 1 } : i))
        : [...state.cobro.items, { key: uid('it'), qty: 1, ...it }];
      return { ...state, cobro: { ...state.cobro, items } };
    }
    case 'COBRO_SET_QTY': {
      const items = state.cobro.items
        .map((i) => (i.key === a.key ? { ...i, qty: a.qty } : i))
        .filter((i) => i.qty > 0);
      return { ...state, cobro: { ...state.cobro, items } };
    }
    case 'COBRO_REMOVE_ITEM':
      return { ...state, cobro: { ...state.cobro, items: state.cobro.items.filter((i) => i.key !== a.key) } };
    case 'COBRO_SET_PAGOS':
      return { ...state, cobro: { ...state.cobro, pagos: a.pagos } };
    case 'COBRO_CONFIRM': {
      const c = state.cobro;
      const tot = cobroTotals(c);
      // 1) descontar stock de productos
      const productos = state.productos.map((p) => {
        const item = c.items.find((i) => i.tipo === 'producto' && i.refId === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
      });
      // 2) marcar turno cobrado
      const turnos = c.mode === 'turno'
        ? state.turnos.map((t) => (t.id === c.turnoId ? { ...t, estado: 'cobrado', pagado: true } : t))
        : state.turnos;
      // 3) registrar venta
      const venta = {
        id: uid('v'),
        fecha: '2026-05-16',
        hora: a.hora || '—',
        clienteNombre: c.clienteNombre || 'Walk-in',
        barbero: c.empleadoId,
        items: c.items.map(({ tipo, nombre, precio, qty }) => ({ tipo, nombre, precio, qty })),
        propina: tot.propina,
        descuento: tot.descuento,
        total: tot.total,
        pagos: c.pagos.length ? c.pagos : [{ metodo: 'efectivo', monto: tot.total }],
        turnoId: c.turnoId,
      };
      return {
        ...state,
        productos,
        turnos,
        ventas: [venta, ...state.ventas],
        cobro: { ...state.cobro, open: false },
        toast: { id: uid('t'), kind: 'ok', msg: `Cobro registrado · ${venta.clienteNombre} · $${Math.round(tot.total).toLocaleString('es-UY')}` },
      };
    }

    // ---- Turnos ----
    case 'TURNO_CREATE':
      return {
        ...state,
        turnos: [...state.turnos, { id: uid('t'), estado: 'proximo', confirmado: false, pagado: false, ...a.turno }],
        toast: { id: uid('t'), kind: 'ok', msg: `Turno agendado · ${a.turno.cliente} · ${a.turno.hora}` },
      };
    case 'TURNO_UPDATE':
      return { ...state, turnos: state.turnos.map((t) => (t.id === a.id ? { ...t, ...a.patch } : t)) };

    // ---- Bloqueos ----
    case 'BLOQUEO_ADD':
      return {
        ...state,
        bloqueos: [...state.bloqueos, { id: uid('blk'), ...a.bloqueo }],
        toast: { id: uid('t'), kind: 'ok', msg: 'Horario bloqueado' },
      };
    case 'BLOQUEO_REMOVE':
      return { ...state, bloqueos: state.bloqueos.filter((b) => b.id !== a.id) };

    // ---- Notas equipo ----
    case 'NOTA_ADD':
      return { ...state, notas: [{ id: uid('n'), fecha: 'hoy', autor: a.autor || 'Equipo', color: a.color || '#7c3aed', texto: a.texto }, ...state.notas] };
    case 'NOTA_UPDATE':
      return { ...state, notas: state.notas.map((n) => (n.id === a.id ? { ...n, texto: a.texto } : n)) };
    case 'NOTA_REMOVE':
      return { ...state, notas: state.notas.filter((n) => n.id !== a.id) };

    // ---- Clientes ----
    case 'CLIENTE_CREATE':
      return {
        ...state,
        clientes: [{ id: uid('c'), visitas: 0, ult: 'hoy', tag: 'nuevo', pref: '—', notas: '', grupos: [], ...a.cliente }, ...state.clientes],
        toast: { id: uid('t'), kind: 'ok', msg: `Cliente creado · ${a.cliente.nombre}` },
      };
    case 'CLIENTE_UPDATE':
      return { ...state, clientes: state.clientes.map((c) => (c.id === a.id ? { ...c, ...a.patch } : c)) };
    case 'GRUPO_CREATE':
      return { ...state, grupos: [...state.grupos, { id: uid('grp'), ...a.grupo }] };

    // ---- Servicios / Productos / Promos ----
    case 'SERVICIO_CREATE':
      return { ...state, servicios: [...state.servicios, { id: uid('sv'), ...a.servicio }], toast: { id: uid('t'), kind: 'ok', msg: `Servicio creado · ${a.servicio.nombre}` } };
    case 'SERVICIO_UPDATE':
      return { ...state, servicios: state.servicios.map((s) => (s.id === a.id ? { ...s, ...a.patch } : s)) };
    case 'PRODUCTO_CREATE':
      return { ...state, productos: [...state.productos, { id: uid('p'), ...a.producto }], toast: { id: uid('t'), kind: 'ok', msg: `Producto creado · ${a.producto.nombre}` } };
    case 'PRODUCTO_UPDATE':
      return { ...state, productos: state.productos.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)) };
    case 'PROMO_CREATE':
      return { ...state, promos: [...state.promos, { id: uid('promo'), activa: true, ...a.promo }], toast: { id: uid('t'), kind: 'ok', msg: `Promoción creada · ${a.promo.nombre}` } };
    case 'PROMO_TOGGLE':
      return { ...state, promos: state.promos.map((p) => (p.id === a.id ? { ...p, activa: !p.activa } : p)) };

    // ---- Gastos ----
    case 'GASTO_ADD':
      return { ...state, gastos: [{ id: uid('g'), fecha: '2026-05-16', ...a.gasto }, ...state.gastos], toast: { id: uid('t'), kind: 'ok', msg: `Gasto registrado · $${Math.round(a.gasto.monto).toLocaleString('es-UY')}` } };

    // ---- Toast ----
    case 'TOAST_SHOW':
      return { ...state, toast: { id: uid('t'), kind: a.kind || 'ok', msg: a.msg } };
    case 'TOAST_HIDE':
      return { ...state, toast: null };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────
const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => ({
    // cobro
    openCobroTurno: (turno) => dispatch({ type: 'COBRO_OPEN_TURNO', turno }),
    openCobroWalkin: () => dispatch({ type: 'COBRO_OPEN_WALKIN' }),
    closeCobro: () => dispatch({ type: 'COBRO_CLOSE' }),
    patchCobro: (patch) => dispatch({ type: 'COBRO_PATCH', patch }),
    addCobroItem: (item) => dispatch({ type: 'COBRO_ADD_ITEM', item }),
    setCobroQty: (key, qty) => dispatch({ type: 'COBRO_SET_QTY', key, qty }),
    removeCobroItem: (key) => dispatch({ type: 'COBRO_REMOVE_ITEM', key }),
    setCobroPagos: (pagos) => dispatch({ type: 'COBRO_SET_PAGOS', pagos }),
    confirmCobro: (hora) => dispatch({ type: 'COBRO_CONFIRM', hora }),
    // turnos
    createTurno: (turno) => dispatch({ type: 'TURNO_CREATE', turno }),
    updateTurno: (id, patch) => dispatch({ type: 'TURNO_UPDATE', id, patch }),
    // bloqueos
    addBloqueo: (bloqueo) => dispatch({ type: 'BLOQUEO_ADD', bloqueo }),
    removeBloqueo: (id) => dispatch({ type: 'BLOQUEO_REMOVE', id }),
    // notas
    addNota: (texto, autor, color) => dispatch({ type: 'NOTA_ADD', texto, autor, color }),
    updateNota: (id, texto) => dispatch({ type: 'NOTA_UPDATE', id, texto }),
    removeNota: (id) => dispatch({ type: 'NOTA_REMOVE', id }),
    // clientes
    createCliente: (cliente) => dispatch({ type: 'CLIENTE_CREATE', cliente }),
    updateCliente: (id, patch) => dispatch({ type: 'CLIENTE_UPDATE', id, patch }),
    createGrupo: (grupo) => dispatch({ type: 'GRUPO_CREATE', grupo }),
    // catálogo
    createServicio: (servicio) => dispatch({ type: 'SERVICIO_CREATE', servicio }),
    updateServicio: (id, patch) => dispatch({ type: 'SERVICIO_UPDATE', id, patch }),
    createProducto: (producto) => dispatch({ type: 'PRODUCTO_CREATE', producto }),
    updateProducto: (id, patch) => dispatch({ type: 'PRODUCTO_UPDATE', id, patch }),
    createPromo: (promo) => dispatch({ type: 'PROMO_CREATE', promo }),
    togglePromo: (id) => dispatch({ type: 'PROMO_TOGGLE', id }),
    // gastos
    addGasto: (gasto) => dispatch({ type: 'GASTO_ADD', gasto }),
    // toast
    toast: (msg, kind) => dispatch({ type: 'TOAST_SHOW', msg, kind }),
    hideToast: () => dispatch({ type: 'TOAST_HIDE' }),
  }), []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}
