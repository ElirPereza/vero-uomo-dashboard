import { useState } from 'react';
import { IconArrowL, IconArrowR, IconCalendar, IconFilter, IconPlus, IconSparkle } from '../icons';
import { BARBEROS } from '../data';
import { PageHeader } from '../shell';

// Vista Agenda — calendario semanal

const DIAS = ['Lun 12', 'Mar 13', 'Mié 14', 'Jue 15', 'Vie 16', 'Sáb 17', 'Dom 18'];
const HORAS = ['09','10','11','12','13','14','15','16','17','18','19','20'];

// Mock turnos por día — slot (hh, minuto), barbero
const SEMANA_DATA = [
  // Lun
  [
    { h: '10:00', dur: 30, barb: 'mati', cli: 'F. Méndez',   sv: 'Corte' },
    { h: '11:00', dur: 45, barb: 'seba', cli: 'J. Pereira',  sv: 'Corte+barba' },
    { h: '14:00', dur: 40, barb: 'mati', cli: 'A. Bermúdez', sv: 'Fade', ia: true },
    { h: '16:30', dur: 30, barb: 'nico', cli: 'P. Acosta',   sv: 'Corte' },
    { h: '18:00', dur: 60, barb: 'leo',  cli: 'I. Lamas',    sv: 'Pack' },
  ],
  // Mar
  [
    { h: '09:30', dur: 30, barb: 'leo',  cli: 'D. Cabrera',  sv: 'Corte', ia: true },
    { h: '11:00', dur: 25, barb: 'seba', cli: 'R. Silveira', sv: 'Barba' },
    { h: '12:00', dur: 60, barb: 'mati', cli: 'M. Olivera',  sv: 'Pack' },
    { h: '15:00', dur: 40, barb: 'leo',  cli: 'M. Píriz',    sv: 'Fade' },
    { h: '17:00', dur: 45, barb: 'mati', cli: 'N. Etcheverry',sv: 'Corte+barba' },
  ],
  // Mié
  [
    { h: '10:00', dur: 30, barb: 'nico', cli: 'L. Rodríguez',sv: 'Corte' },
    { h: '11:30', dur: 30, barb: 'mati', cli: 'F. Méndez',   sv: 'Barba', ia: true },
    { h: '14:30', dur: 45, barb: 'seba', cli: 'J. Pereira',  sv: 'Corte+barba' },
    { h: '16:00', dur: 35, barb: 'leo',  cli: 'E. Vázquez',  sv: 'Color' },
    { h: '18:30', dur: 40, barb: 'mati', cli: 'T. Restuccia',sv: 'Fade' },
  ],
  // Jue
  [
    { h: '09:00', dur: 30, barb: 'leo',  cli: 'A. Bermúdez', sv: 'Corte' },
    { h: '10:00', dur: 60, barb: 'seba', cli: 'R. Castro',   sv: 'Pack', ia: true },
    { h: '13:00', dur: 30, barb: 'nico', cli: 'P. Acosta',   sv: 'Corte' },
    { h: '15:30', dur: 40, barb: 'mati', cli: 'A. Bermúdez', sv: 'Fade' },
    { h: '19:00', dur: 45, barb: 'seba', cli: 'M. Olivera',  sv: 'Corte+barba' },
  ],
  // Vie
  [
    { h: '10:00', dur: 40, barb: 'mati', cli: 'F. Méndez',   sv: 'Fade' },
    { h: '11:00', dur: 30, barb: 'nico', cli: 'B. Tabárez',  sv: 'Corte', ia: true },
    { h: '14:00', dur: 45, barb: 'seba', cli: 'J. Pereira',  sv: 'Corte+barba' },
    { h: '15:00', dur: 60, barb: 'leo',  cli: 'I. Lamas',    sv: 'Pack' },
    { h: '17:30', dur: 25, barb: 'seba', cli: 'R. Silveira', sv: 'Barba' },
    { h: '19:30', dur: 30, barb: 'mati', cli: 'G. Suárez',   sv: 'Corte' },
  ],
  // Sáb (hoy)
  [
    { h: '09:00', dur: 40, barb: 'mati', cli: 'F. Méndez',   sv: 'Fade' },
    { h: '09:30', dur: 45, barb: 'seba', cli: 'J. Pereira',  sv: 'Corte+barba' },
    { h: '10:00', dur: 25, barb: 'seba', cli: 'R. Silveira', sv: 'Barba' },
    { h: '10:30', dur: 40, barb: 'leo',  cli: 'A. Bermúdez', sv: 'Fade' },
    { h: '10:30', dur: 30, barb: 'nico', cli: 'P. Acosta',   sv: 'Corte', ia: true },
    { h: '11:00', dur: 60, barb: 'mati', cli: 'M. Olivera',  sv: 'Pack' },
    { h: '11:30', dur: 30, barb: 'leo',  cli: 'D. Cabrera',  sv: 'Corte', ia: true },
    { h: '12:00', dur: 45, barb: 'mati', cli: 'G. Suárez',   sv: 'Corte+barba' },
    { h: '13:00', dur: 35, barb: 'leo',  cli: 'E. Vázquez',  sv: 'Color' },
    { h: '14:00', dur: 30, barb: 'nico', cli: 'B. Tabárez',  sv: 'Corte', ia: true },
    { h: '15:00', dur: 60, barb: 'seba', cli: 'R. Castro',   sv: 'Pack' },
    { h: '16:00', dur: 40, barb: 'leo',  cli: 'M. Píriz',    sv: 'Fade' },
    { h: '16:30', dur: 45, barb: 'mati', cli: 'N. Etcheverry',sv: 'Corte+barba' },
    { h: '18:00', dur: 60, barb: 'seba', cli: 'I. Lamas',    sv: 'Pack' },
    { h: '19:00', dur: 40, barb: 'mati', cli: 'T. Restuccia',sv: 'Fade' },
  ],
  // Dom
  [],
];

const CAL_ROW_PX = 64;

function CalEvent({ ev, barbero }) {
  const [hH, hM] = ev.h.split(':').map(Number);
  const startMin = (hH - 9) * 60 + hM;
  const topPx = (startMin / 60) * CAL_ROW_PX;
  const heightPx = (ev.dur / 60) * CAL_ROW_PX - 2;
  const tiny = heightPx < 34;
  return (
    <div
      className="cal-ev"
      data-tiny={tiny ? '1' : '0'}
      style={{
        top: topPx,
        height: heightPx,
        background: 'color-mix(in oklab, ' + barbero.color + ' var(--ev-mix, 18%), var(--bg-elev))',
        borderLeft: '2px solid ' + barbero.color,
      }}
    >
      <div className="cal-ev-line1">
        <span className="cal-ev-time mono">{ev.h}</span>
        <span className="cal-ev-cli">{ev.cli}</span>
      </div>
      <div className="cal-ev-sv">
        {ev.sv}
        {ev.ia && (
          <span className="cal-ev-ia">
            <IconSparkle size={8} sw={2.4} />
          </span>
        )}
      </div>
    </div>
  );
}

export function ViewAgenda() {
  const [barbFilter, setBarbFilter] = useState('todos');
  const barberoById = Object.fromEntries(BARBEROS.map((b) => [b.id, b]));
  const filterDay = (evs) => barbFilter === 'todos' ? evs : evs.filter((e) => e.barb === barbFilter);

  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <PageHeader
        title="Agenda"
        subtitle="Semana del 12 al 18 de mayo · 2026"
        actions={
          <>
            <div className="seg-control">
              <button>Día</button>
              <button className="is-active">Semana</button>
              <button>Mes</button>
            </div>
            <button className="btn ghost sm icon-only"><IconArrowL size={14} /></button>
            <button className="btn ghost sm">Esta semana</button>
            <button className="btn ghost sm icon-only"><IconArrowR size={14} /></button>
            <span style={{ width: 8 }} />
            <button className="btn accent sm"><IconPlus size={13} /> Nuevo turno</button>
          </>
        }
      />

      <div className="flex items-center gap-2" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        <span className="text-xs muted" style={{ marginRight: 6 }}>Barbero:</span>
        <button
          className={'chip' + (barbFilter === 'todos' ? ' is-active' : '')}
          onClick={() => setBarbFilter('todos')}
        >Todos</button>
        {BARBEROS.map((b) => (
          <button
            key={b.id}
            className={'chip' + (barbFilter === b.id ? ' is-active' : '')}
            onClick={() => setBarbFilter(b.id)}
          >
            <span className="chip-dot" style={{ background: b.color }} />{b.apodo}
          </button>
        ))}
      </div>

      <div className="cal">
        <div className="cal-hd">
          <div className="cal-corner" />
          {DIAS.map((d, i) => (
            <div key={d} className={'cal-daycol-hd' + (i === 5 ? ' is-today' : '')}>
              <div className="text-xxs muted">{d.split(' ')[0]}</div>
              <div className="text-lg fw-600">{d.split(' ')[1]}</div>
            </div>
          ))}
        </div>
        <div className="cal-body scroll">
          <div className="cal-hours">
            {HORAS.map((h) => (
              <div className="cal-hour-row" key={h}>
                <span className="cal-hour-lbl mono">{h}:00</span>
              </div>
            ))}
          </div>
          {SEMANA_DATA.map((evs, di) => (
            <div className={'cal-daycol' + (di === 5 ? ' is-today' : '')} key={di}>
              {HORAS.map((h) => <div key={h} className="cal-slot" />)}
              {filterDay(evs).map((ev, i) => (
                <CalEvent key={i} ev={ev} barbero={barberoById[ev.barb]} />
              ))}
              {di === 5 && <div className="cal-nowline" style={{ top: (((10 - 9) * 60 + 42) / 60) * CAL_ROW_PX }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
