// Mock data — Vero Uomo (barbería uruguaya)

export const FMT_UYU = (n) => '$' + Math.round(n).toLocaleString('es-UY');

export const BARBEROS = [
  { id: 'mati',  nombre: 'Matías',   apodo: 'Mati',   color: '#0EA5E9', inicial: 'MR', rol: 'Senior · Fundador' },
  { id: 'seba',  nombre: 'Sebastián',apodo: 'Seba',   color: '#F59E0B', inicial: 'SP', rol: 'Senior' },
  { id: 'nico',  nombre: 'Nicolás',  apodo: 'Nico',   color: '#10B981', inicial: 'NM', rol: 'Junior' },
  { id: 'leo',   nombre: 'Leonardo', apodo: 'Leo',    color: '#EF4444', inicial: 'LF', rol: 'Senior' },
];

export const SERVICIOS = [
  { id: 'corte',       nombre: 'Corte clásico',       dur: 30, precio: 750 },
  { id: 'corte-barba', nombre: 'Corte + barba',       dur: 45, precio: 1100 },
  { id: 'barba',       nombre: 'Diseño de barba',     dur: 25, precio: 550 },
  { id: 'fade',        nombre: 'Fade premium',        dur: 40, precio: 950 },
  { id: 'cejas',       nombre: 'Cejas',               dur: 10, precio: 250 },
  { id: 'color',       nombre: 'Color / camuflaje canas', dur: 35, precio: 1300 },
  { id: 'pack',        nombre: 'Pack completo',       dur: 60, precio: 1800 },
];

export const CLIENTES = [
  { id: 'c1', nombre: 'Federico Méndez',   tel: '099 412 853', visitas: 14, ult: '2 sem', tag: 'fiel',    pref: 'Fade premium · Mati' },
  { id: 'c2', nombre: 'Joaquín Pereira',   tel: '098 221 044', visitas: 22, ult: '1 sem', tag: 'vip',     pref: 'Corte + barba · Seba' },
  { id: 'c3', nombre: 'Diego Cabrera',     tel: '094 776 219', visitas: 3,  ult: '4 meses',tag: 'riesgo', pref: 'Corte clásico · Leo' },
  { id: 'c4', nombre: 'Martín Olivera',    tel: '099 882 011', visitas: 8,  ult: '3 sem', tag: 'fiel',    pref: 'Pack completo · Mati' },
  { id: 'c5', nombre: 'Pablo Acosta',      tel: '098 113 552', visitas: 1,  ult: 'hoy',   tag: 'nuevo',   pref: '—' },
  { id: 'c6', nombre: 'Rodrigo Silveira',  tel: '094 502 388', visitas: 31, ult: '5 días',tag: 'vip',     pref: 'Diseño de barba · Seba' },
  { id: 'c7', nombre: 'Lucas Rodríguez',   tel: '099 671 220', visitas: 5,  ult: '2 meses',tag: 'activo', pref: 'Corte clásico · Nico' },
  { id: 'c8', nombre: 'Andrés Bermúdez',   tel: '098 309 117', visitas: 12, ult: '1 mes', tag: 'fiel',    pref: 'Fade premium · Leo' },
  { id: 'c9', nombre: 'Bruno Tabárez',     tel: '094 226 904', visitas: 0,  ult: '—',     tag: 'nuevo',   pref: '—' },
  { id: 'c10',nombre: 'Gonzalo Suárez',    tel: '099 558 471', visitas: 6,  ult: '5 sem', tag: 'activo', pref: 'Corte + barba · Mati' },
];

// Turnos de "Hoy" — sábado 16 de mayo
export const HOY_FECHA = 'Sábado 16 de mayo';
export const TURNOS_HOY = [
  { id: 't1',  hora: '09:00', cliente: 'Federico Méndez',    servicio: 'Fade premium',   barbero: 'mati', dur: 40, estado: 'completo',  precio: 950,  notaIA: 'Confirmado anoche por el agente' },
  { id: 't2',  hora: '09:30', cliente: 'Joaquín Pereira',    servicio: 'Corte + barba',  barbero: 'seba', dur: 45, estado: 'completo',  precio: 1100 },
  { id: 't3',  hora: '10:00', cliente: 'Rodrigo Silveira',   servicio: 'Diseño de barba',barbero: 'seba', dur: 25, estado: 'completo',  precio: 550 },
  { id: 't4',  hora: '10:30', cliente: 'Andrés Bermúdez',    servicio: 'Fade premium',   barbero: 'leo',  dur: 40, estado: 'en-curso',  precio: 950,  notaIA: 'Recordatorio enviado 09:00' },
  { id: 't5',  hora: '10:30', cliente: 'Pablo Acosta',       servicio: 'Corte clásico',  barbero: 'nico', dur: 30, estado: 'en-curso',  precio: 750,  nuevo: true, notaIA: 'Primer turno · agendado por el agente' },
  { id: 't6',  hora: '11:00', cliente: 'Martín Olivera',     servicio: 'Pack completo',  barbero: 'mati', dur: 60, estado: 'proximo',   precio: 1800 },
  { id: 't7',  hora: '11:15', cliente: 'Lucas Rodríguez',    servicio: 'Corte clásico',  barbero: 'nico', dur: 30, estado: 'proximo',   precio: 750 },
  { id: 't8',  hora: '11:30', cliente: 'Diego Cabrera',      servicio: 'Corte clásico',  barbero: 'leo',  dur: 30, estado: 'proximo',   precio: 750,  notaIA: 'Reactivado — venía después de 4 meses' },
  { id: 't9',  hora: '12:00', cliente: 'Gonzalo Suárez',     servicio: 'Corte + barba',  barbero: 'mati', dur: 45, estado: 'proximo',   precio: 1100 },
  { id: 't10', hora: '12:30', cliente: 'Joaquín Pereira',    servicio: 'Cejas',          barbero: 'seba', dur: 10, estado: 'proximo',   precio: 250,  addon: true },
  { id: 't11', hora: '13:00', cliente: 'Esteban Vázquez',    servicio: 'Color / camuflaje canas', barbero: 'leo',  dur: 35, estado: 'proximo', precio: 1300 },
  { id: 't12', hora: '14:00', cliente: 'Bruno Tabárez',      servicio: 'Corte clásico',  barbero: 'nico', dur: 30, estado: 'proximo',   precio: 750,  nuevo: true, notaIA: 'Agendado por Instagram a las 02:17' },
  { id: 't13', hora: '14:30', cliente: 'Federico Méndez',    servicio: 'Diseño de barba',barbero: 'mati', dur: 25, estado: 'proximo',   precio: 550 },
  { id: 't14', hora: '15:00', cliente: 'Ramiro Castro',      servicio: 'Pack completo',  barbero: 'seba', dur: 60, estado: 'proximo',   precio: 1800 },
  { id: 't15', hora: '16:00', cliente: 'Maximiliano Píriz',  servicio: 'Fade premium',   barbero: 'leo',  dur: 40, estado: 'proximo',   precio: 950 },
  { id: 't16', hora: '16:30', cliente: 'Nicolás Etcheverry', servicio: 'Corte + barba',  barbero: 'mati', dur: 45, estado: 'proximo',   precio: 1100 },
  { id: 't17', hora: '17:30', cliente: 'Santiago Falcón',    servicio: 'Corte clásico',  barbero: 'nico', dur: 30, estado: 'proximo',   precio: 750 },
  { id: 't18', hora: '18:00', cliente: 'Iván Lamas',         servicio: 'Pack completo',  barbero: 'seba', dur: 60, estado: 'proximo',   precio: 1800 },
  { id: 't19', hora: '19:00', cliente: 'Tomás Restuccia',    servicio: 'Fade premium',   barbero: 'mati', dur: 40, estado: 'proximo',   precio: 950 },
];

// Conversaciones — Inbox
export const CONVERSACIONES = [
  {
    id: 'k1',
    cliente: 'Federico Méndez',
    canal: 'wa',
    estado: 'agente',
    ult: '2 min',
    tag: 'agendando',
    avatar: 'FM',
    preview: 'Listo, te agendé para el sábado 23 a las 15:00 con Mati. ¿Confirmás?',
    mensajes: [
      { de: 'cliente', txt: 'Hola, quería sacar turno para el sábado que viene', t: '14:18' },
      { de: 'agente',  txt: '¡Hola Fede! Claro, ¿con quién te gusta? Veo que las últimas 3 veces viniste con Mati.', t: '14:18', agente: true },
      { de: 'cliente', txt: 'Sí, con Mati. ¿A qué hora hay?', t: '14:19' },
      { de: 'agente',  txt: 'Tengo: 11:00, 14:30 o 15:00. Para el fade premium son 40 min ($950).', t: '14:19', agente: true },
      { de: 'cliente', txt: 'Dale, 15:00', t: '14:21' },
      { de: 'agente',  txt: 'Listo, te agendé para el sábado 23 a las 15:00 con Mati. ¿Confirmás?', t: '14:21', agente: true, accion: 'reserva-creada' },
    ],
  },
  {
    id: 'k2',
    cliente: 'Bruno Tabárez',
    canal: 'ig',
    estado: 'agente',
    ult: '12 min',
    tag: 'nuevo',
    avatar: 'BT',
    preview: 'Perfecto, te dejé reservado el sábado a las 14:00 con Nico 👌',
    mensajes: [
      { de: 'cliente', txt: 'hola, vi el reel del fade. cuanto sale?', t: '02:14' },
      { de: 'agente',  txt: '¡Hola! El fade premium sale $950, demora unos 40 min. ¿Querés agendar?', t: '02:14', agente: true },
      { de: 'cliente', txt: 'es mi primera vez ahi. tengo lugar este sabado?', t: '02:16' },
      { de: 'agente',  txt: 'Bienvenido a Vero Uomo 🙌 Sábado tengo 14:00 con Nico o 18:00 con Seba.', t: '02:16', agente: true },
      { de: 'cliente', txt: '14 esta perfecto', t: '02:17' },
      { de: 'agente',  txt: 'Perfecto, te dejé reservado el sábado a las 14:00 con Nico 👌', t: '02:17', agente: true, accion: 'reserva-creada' },
    ],
  },
  {
    id: 'k3',
    cliente: 'Diego Cabrera',
    canal: 'wa',
    estado: 'agente',
    ult: '23 min',
    tag: 'reactivado',
    avatar: 'DC',
    preview: '¡Bienvenido de vuelta! Te dejo el sábado 11:30 con Leo, como las anteriores.',
    mensajes: [
      { de: 'agente',  txt: 'Hola Diego, soy de Vero Uomo. Notamos que hace 4 meses no pasás — ¿coordinamos algo? Tenemos lugar el sábado.', t: '11:00', agente: true, auto: true },
      { de: 'cliente', txt: 'uy si, me había olvidado. dale', t: '13:42' },
      { de: 'agente',  txt: '¡Bienvenido de vuelta! Te dejo el sábado 11:30 con Leo, como las anteriores.', t: '13:43', agente: true, accion: 'reserva-creada' },
    ],
  },
  {
    id: 'k4',
    cliente: 'Esteban Vázquez',
    canal: 'wa',
    estado: 'escalado',
    ult: '38 min',
    tag: 'humano',
    avatar: 'EV',
    preview: 'Tengo que cancelar el de hoy 13:00, ¿me lo pueden pasar para mañana?',
    mensajes: [
      { de: 'cliente', txt: 'Hola, tengo que cancelar el de hoy 13:00, ¿me lo pueden pasar para mañana?', t: '13:25' },
      { de: 'agente',  txt: 'Hola Esteban, te paso con alguien del equipo — el de hoy es color y prefiero que lo coordinen ellos.', t: '13:25', agente: true, accion: 'escalado' },
    ],
  },
  {
    id: 'k5',
    cliente: 'Joaquín Pereira',
    canal: 'wa',
    estado: 'cerrado',
    ult: '1 h',
    tag: 'consulta',
    avatar: 'JP',
    preview: 'Listo, gracias!',
    mensajes: [
      { de: 'cliente', txt: '¿Atienden el lunes feriado?', t: '13:01' },
      { de: 'agente',  txt: 'Sí, abrimos de 10 a 18. ¿Te agendo algo?', t: '13:01', agente: true },
      { de: 'cliente', txt: 'No por ahora, gracias!', t: '13:02' },
      { de: 'agente',  txt: '¡A las órdenes!', t: '13:02', agente: true },
    ],
  },
  {
    id: 'k6',
    cliente: 'Maximiliano Píriz',
    canal: 'ig',
    estado: 'agente',
    ult: '2 h',
    tag: 'recordatorio',
    avatar: 'MP',
    preview: 'Te confirmo el turno de hoy 16:00 con Leo. Si no podés, contestame "cancelar".',
    mensajes: [
      { de: 'agente',  txt: 'Te confirmo el turno de hoy 16:00 con Leo. Si no podés, contestame "cancelar".', t: '11:00', agente: true, auto: true },
      { de: 'cliente', txt: '👍', t: '11:04' },
    ],
  },
  {
    id: 'k7',
    cliente: 'Ramiro Castro',
    canal: 'wa',
    estado: 'cerrado',
    ult: '3 h',
    tag: 'consulta',
    avatar: 'RC',
    preview: 'Dale, pago en el local. Hasta el sábado.',
    mensajes: [],
  },
];

// Métricas
export const METRICAS = {
  ingresosMes: 487200,
  ingresosMesPrev: 421000,
  turnosMes: 612,
  turnosMesPrev: 558,
  ocupacion: 78,
  ocupacionPrev: 71,
  ticketMedio: 920,
  ticketMedioPrev: 880,
  nuevosMes: 41,
  recuperadosMes: 18,
  noShow: 4.2,
  noShowPrev: 6.1,
  // 30 días de ingresos
  serie: [12, 18, 14, 20, 22, 28, 35, 14, 16, 22, 19, 24, 30, 38, 16, 18, 21, 25, 23, 26, 33, 41, 18, 20, 24, 27, 31, 28, 35, 44],
  // horarios — ocupación por franja
  horarios: [
    { h: '09', v: 45 }, { h: '10', v: 68 }, { h: '11', v: 82 }, { h: '12', v: 71 },
    { h: '13', v: 38 }, { h: '14', v: 64 }, { h: '15', v: 88 }, { h: '16', v: 94 },
    { h: '17', v: 91 }, { h: '18', v: 86 }, { h: '19', v: 72 }, { h: '20', v: 41 },
  ],
  porBarbero: [
    { id: 'mati', ingresos: 168000, turnos: 184, ocupacion: 86 },
    { id: 'seba', ingresos: 142000, turnos: 161, ocupacion: 79 },
    { id: 'leo',  ingresos: 108000, turnos: 142, ocupacion: 74 },
    { id: 'nico', ingresos: 69200,  turnos: 125, ocupacion: 68 },
  ],
  porServicio: [
    { id: 'corte-barba', pct: 32 },
    { id: 'fade',        pct: 24 },
    { id: 'corte',       pct: 21 },
    { id: 'pack',        pct: 12 },
    { id: 'barba',       pct: 8 },
    { id: 'color',       pct: 3 },
  ],
};

// Actividad reciente del agente — feed para Hoy
export const ACTIVIDAD_AGENTE = [
  { t: 'hace 2 min',  txt: 'Agendó turno · Federico Méndez · sáb 23, 15:00 con Mati', tipo: 'reserva' },
  { t: 'hace 12 min', txt: 'Agendó turno · Bruno Tabárez (nuevo) · hoy 14:00 con Nico', tipo: 'reserva' },
  { t: 'hace 23 min', txt: 'Reactivó cliente · Diego Cabrera (4 meses inactivo)', tipo: 'reactivado' },
  { t: 'hace 38 min', txt: 'Escaló conversación · Esteban Vázquez · cancelación de color', tipo: 'escalado' },
  { t: 'hoy 11:00',   txt: 'Envió 7 recordatorios de turnos de hoy', tipo: 'recordatorio' },
  { t: 'hoy 09:00',   txt: 'Respondió 3 consultas de precios fuera de horario', tipo: 'consulta' },
];

// Hueco / sugerencia
export const ALERTAS_HOY = [
  { tipo: 'hueco',   texto: 'Hueco de 30 min a las 13:00 con Seba', accion: 'Ofrecer a lista de espera (2)' },
  { tipo: 'noshow',  texto: '2 turnos sin confirmar para hoy', accion: 'Reenviar recordatorios' },
];
