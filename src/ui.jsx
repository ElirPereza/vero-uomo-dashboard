// Primitivas UI reutilizables — Drawer (slide-over), Modal, inputs, Toast.
// Calzan con el design system (variables CSS de styles.css).

import { useEffect, useRef } from 'react';
import { IconX, IconPlus, IconCheck } from './icons';
import { useStore } from './store';
import './ui.css';

function useEsc(active, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [active, onClose]);
}

// ── Drawer (slide-over derecha) ──────────────────────────────────────────
export function Drawer({ open, onClose, title, subtitle, icon, width = 420, children, footer }) {
  useEsc(open, onClose);
  if (!open) return null;
  return (
    <div className="ov" onMouseDown={onClose}>
      <aside className="drawer" style={{ width }} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="drawer-hd">
          <div className="drawer-hd-title">
            {icon && <span className="drawer-hd-icon">{icon}</span>}
            <div style={{ minWidth: 0 }}>
              <div className="drawer-hd-t">{title}</div>
              {subtitle && <div className="drawer-hd-sub">{subtitle}</div>}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><IconX size={16} /></button>
        </header>
        <div className="drawer-bd scroll">{children}</div>
        {footer && <footer className="drawer-ft">{footer}</footer>}
      </aside>
    </div>
  );
}

// ── Modal (centrado) ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, subtitle, width = 460, children, footer }) {
  useEsc(open, onClose);
  if (!open) return null;
  return (
    <div className="ov ov-center" onMouseDown={onClose}>
      <div className="modal" style={{ width }} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-hd">
          <div style={{ minWidth: 0 }}>
            <div className="modal-hd-t">{title}</div>
            {subtitle && <div className="modal-hd-sub">{subtitle}</div>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><IconX size={16} /></button>
        </header>
        <div className="modal-bd scroll">{children}</div>
        {footer && <footer className="modal-ft">{footer}</footer>}
      </div>
    </div>
  );
}

// ── Form controls ─────────────────────────────────────────────────────────
export function Field({ label, hint, children, required }) {
  return (
    <label className="field">
      {label && <span className="field-lbl">{label}{required && <i className="field-req">*</i>}</span>}
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function TextInput({ value, onChange, type = 'text', ...rest }) {
  return <input className="inp" type={type} value={value} onChange={(e) => onChange?.(e.target.value)} {...rest} />;
}

export function TextArea({ value, onChange, rows = 3, ...rest }) {
  return <textarea className="inp txta" rows={rows} value={value} onChange={(e) => onChange?.(e.target.value)} {...rest} />;
}

export function SelectInput({ value, onChange, options, placeholder, ...rest }) {
  return (
    <select className="inp sel" value={value} onChange={(e) => onChange?.(e.target.value)} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

export function NumberStepper({ value, onChange, min = 0, max = 99 }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="stepper">
      <button type="button" onClick={() => set(value - 1)} aria-label="Menos">–</button>
      <span className="mono">{value}</span>
      <button type="button" onClick={() => set(value + 1)} aria-label="Más"><IconPlus size={11} /></button>
    </div>
  );
}

// ── Toaster (lee store.toast, auto-oculta) ─────────────────────────────────
export function Toaster() {
  const { state, actions } = useStore();
  const t = state.toast;
  const timer = useRef(null);
  useEffect(() => {
    if (!t) return undefined;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => actions.hideToast(), 3200);
    return () => clearTimeout(timer.current);
  }, [t, actions]);
  if (!t) return null;
  return (
    <div className={'toast toast-' + (t.kind || 'ok')} role="status">
      <span className="toast-icon"><IconCheck size={13} sw={2.6} /></span>
      <span className="toast-msg">{t.msg}</span>
      <button className="toast-x" onClick={actions.hideToast} aria-label="Cerrar"><IconX size={13} /></button>
    </div>
  );
}
