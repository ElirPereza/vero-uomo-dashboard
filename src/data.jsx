// Mock data — Vero Uomo (barbería uruguaya)

export const FMT_UYU = (n) => '$' + Math.round(n).toLocaleString('es-UY');

// Modelo: cada barbero alquila el espacio. La barbería retiene 60% de la facturación
// como arrendamiento; el barbero se queda con el 40% restante.
// Mati es dueño (no paga arrendamiento, fija su propio %).
export const BARBEROS = [
  { id: 'mati',  nombre: 'Matías',   apodo: 'Mati',   color: '#0EA5E9', inicial: 'MR', rol: 'Senior · Fundador', arrend: 0   },
  { id: 'seba',  nombre: 'Sebastián',apodo: 'Seba',   color: '#F59E0B', inicial: 'SP', rol: 'Senior',           arrend: 60 },
  { id: 'nico',  nombre: 'Nicolás',  apodo: 'Nico',   color: '#10B981', inicial: 'NM', rol: 'Junior',           arrend: 60 },
  { id: 'leo',   nombre: 'Leonardo', apodo: 'Leo',    color: '#EF4444', inicial: 'LF', rol: 'Senior',           arrend: 60 },
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

// Ficha de cliente — la IA la completa al recepcionar: nombre, tel, email, dirección, fecha nac.
export const CLIENTES = [
  { id: 'c1', nombre: 'Federico Méndez',   tel: '099 412 853', email: 'fede.mendez@gmail.com',    direccion: 'Av. Brasil 2541, Pocitos',    nacimiento: '1991-03-12', visitas: 14, ult: '2 sem', tag: 'fiel',   pref: 'Fade premium · Mati',        notas: 'Toma el café cortado, sin azúcar. Le gusta charlar de fútbol.', grupos: ['vip-fades'] },
  { id: 'c2', nombre: 'Joaquín Pereira',   tel: '098 221 044', email: 'joaco.pereira@gmail.com',  direccion: 'Br. España 2814, Pocitos',    nacimiento: '1988-07-29', visitas: 22, ult: '1 sem', tag: 'vip',    pref: 'Corte + barba · Seba',       notas: 'Prefiere turnos temprano (9-10h). Alérgico a ciertas lociones — usar línea sensitive.', grupos: ['vip-fades','cumple-mayo'] },
  { id: 'c3', nombre: 'Diego Cabrera',     tel: '094 776 219', email: 'dcabrera@outlook.com',     direccion: 'Juan B. Blanco 1130, Buceo',  nacimiento: '1995-11-04', visitas: 3,  ult: '4 meses',tag: 'riesgo', pref: 'Corte clásico · Leo',        notas: 'Reactivado por el agente tras 4 meses. Sensible al precio.', grupos: ['reactivar'] },
  { id: 'c4', nombre: 'Martín Olivera',    tel: '099 882 011', email: 'martin.olivera@gmail.com', direccion: 'Av. Sarmiento 2350, Pocitos', nacimiento: '1983-01-22', visitas: 8,  ult: '3 sem', tag: 'fiel',   pref: 'Pack completo · Mati',       notas: 'Siempre pide pack completo. Café americano.', grupos: [] },
  { id: 'c5', nombre: 'Pablo Acosta',      tel: '098 113 552', email: 'pablo.acosta@gmail.com',   direccion: 'Rambla R. de Sáa 5520, Pocitos', nacimiento: '1999-09-17', visitas: 1, ult: 'hoy', tag: 'nuevo',   pref: '—',                          notas: 'Llegó por campaña de reactivación de Meta.', grupos: [] },
  { id: 'c6', nombre: 'Rodrigo Silveira',  tel: '094 502 388', email: 'rodri.silveira@gmail.com', direccion: 'Chucarro 1185, Pocitos',      nacimiento: '1990-05-30', visitas: 31, ult: '5 días',tag: 'vip',    pref: 'Diseño de barba · Seba',     notas: 'Cliente desde la apertura. Barba semanal religiosa.', grupos: ['vip-fades'] },
  { id: 'c7', nombre: 'Lucas Rodríguez',   tel: '099 671 220', email: 'lucas.rod@gmail.com',      direccion: 'Av. Rivera 3380, Pocitos',    nacimiento: '1997-12-08', visitas: 5,  ult: '2 meses',tag: 'activo', pref: 'Corte clásico · Nico',       notas: '', grupos: [] },
  { id: 'c8', nombre: 'Andrés Bermúdez',   tel: '098 309 117', email: 'andres.b@hotmail.com',     direccion: 'Libertad 2745, Pocitos',      nacimiento: '1986-04-19', visitas: 12, ult: '1 mes', tag: 'fiel',   pref: 'Fade premium · Leo',         notas: 'Sugirió subir la temperatura del local (reseña). Café con leche.', grupos: ['cumple-mayo'] },
  { id: 'c9', nombre: 'Bruno Tabárez',     tel: '094 226 904', email: 'bruno.tabarez@gmail.com',  direccion: 'Av. Brasil 3010, Pocitos',    nacimiento: '2001-08-25', visitas: 0,  ult: '—',     tag: 'nuevo',   pref: '—',                          notas: 'Agendado por Instagram a las 02:17. Vio el reel del fade.', grupos: [] },
  { id: 'c10',nombre: 'Gonzalo Suárez',    tel: '099 558 471', email: 'gonza.suarez@gmail.com',   direccion: '26 de Marzo 1290, Pocitos',   nacimiento: '1993-02-14', visitas: 6,  ult: '5 sem', tag: 'activo', pref: 'Corte + barba · Mati',       notas: '', grupos: [] },
];

// Grupos de clientes — para campañas/promociones segmentadas
export const GRUPOS_CLIENTES = [
  { id: 'vip-fades',   nombre: 'VIP · Fades premium', color: '#0EA5E9', desc: 'Clientes recurrentes de fade premium' },
  { id: 'cumple-mayo', nombre: 'Cumpleaños de mayo',  color: '#F59E0B', desc: 'Promo de cumpleaños del mes' },
  { id: 'reactivar',   nombre: 'Para reactivar',      color: '#EF4444', desc: 'Sin visitar hace +3 meses' },
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

// ── Cuponeras (paquetes prepagos: ej. 12 cortes al precio de 10) ───────
export const CUPONERAS = [
  {
    id: 'cup-corte-12-10',
    nombre: 'Pack 12 cortes',
    servicio: 'Corte clásico',
    incluye: 12, paga: 10,
    precioPack: 7500, precioUnit: 750, ahorro: 1500,
    activo: true,
    vendidas: 34, usados: 187, restantes: 221,
  },
  {
    id: 'cup-fade-8-6',
    nombre: 'Pack 8 fades',
    servicio: 'Fade premium',
    incluye: 8, paga: 6,
    precioPack: 5700, precioUnit: 950, ahorro: 1900,
    activo: true,
    vendidas: 22, usados: 96, restantes: 80,
  },
  {
    id: 'cup-pareja',
    nombre: 'Combo amigos',
    servicio: 'Corte + barba (x2 personas)',
    incluye: 2, paga: 2,
    precioPack: 1900, precioUnit: 1100, ahorro: 300,
    activo: true,
    vendidas: 18, usados: 36, restantes: 0,
  },
  {
    id: 'cup-barba-10-8',
    nombre: 'Pack 10 barbas',
    servicio: 'Diseño de barba',
    incluye: 10, paga: 8,
    precioPack: 4400, precioUnit: 550, ahorro: 1100,
    activo: false,
    vendidas: 7, usados: 38, restantes: 32,
  },
];

// Clientes con cuponera activa (sample)
export const CUPONERAS_CLIENTES = [
  { cliente: 'Joaquín Pereira',   pack: 'Pack 12 cortes',  usados: 7, total: 12, vence: '15 oct 2026' },
  { cliente: 'Rodrigo Silveira',  pack: 'Pack 8 fades',    usados: 4, total: 8,  vence: '02 ago 2026' },
  { cliente: 'Federico Méndez',   pack: 'Pack 12 cortes',  usados: 9, total: 12, vence: '20 jul 2026' },
  { cliente: 'Martín Olivera',    pack: 'Pack 12 cortes',  usados: 3, total: 12, vence: '11 nov 2026' },
  { cliente: 'Andrés Bermúdez',   pack: 'Pack 8 fades',    usados: 7, total: 8,  vence: '28 jun 2026' },
];

// ── Marketing — campañas, leads, reseñas ───────────────────────────────
export const CAMPANIAS = [
  {
    id: 'cmp1', nombre: 'Fade premium · audiencia local',
    plataforma: 'meta',
    estado: 'activa',
    inversion: 8400, gasto: 5230,
    impresiones: 48200, clicks: 1840, leads: 42, turnos: 18,
    cpa: 290,
    desde: '02 may', hasta: '31 may',
  },
  {
    id: 'cmp2', nombre: 'Promo sábados · Pocitos',
    plataforma: 'google',
    estado: 'activa',
    inversion: 6000, gasto: 4720,
    impresiones: 22100, clicks: 980, leads: 31, turnos: 14,
    cpa: 337,
    desde: '01 may', hasta: '31 may',
  },
  {
    id: 'cmp3', nombre: 'Reactivación · clientes inactivos',
    plataforma: 'meta',
    estado: 'activa',
    inversion: 2500, gasto: 1380,
    impresiones: 9200, clicks: 410, leads: 28, turnos: 21,
    cpa: 66,
    desde: '08 may', hasta: '22 may',
  },
  {
    id: 'cmp4', nombre: 'Lanzamiento cuponeras',
    plataforma: 'meta',
    estado: 'pausada',
    inversion: 4000, gasto: 3120,
    impresiones: 19800, clicks: 720, leads: 16, turnos: 8,
    cpa: 390,
    desde: '15 abr', hasta: '30 abr',
  },
];

// Leads recientes desde campañas
export const LEADS_MARKETING = [
  { nombre: 'Bruno Tabárez',    fuente: 'meta',   campaign: 'Fade premium', estado: 'agendó',    hora: 'hoy 02:17' },
  { nombre: 'Ezequiel Curbelo', fuente: 'google', campaign: 'Promo sábados', estado: 'agendó',    hora: 'hoy 09:14' },
  { nombre: 'Pablo Acosta',     fuente: 'meta',   campaign: 'Reactivación',  estado: 'agendó',    hora: 'hoy 08:02' },
  { nombre: 'Felipe Martínez',  fuente: 'google', campaign: 'Promo sábados', estado: 'respondió', hora: 'hoy 10:31' },
  { nombre: 'Ignacio Ramos',    fuente: 'meta',   campaign: 'Fade premium', estado: 'sin contestar', hora: 'ayer 21:08' },
  { nombre: 'Carlos Frugoni',   fuente: 'meta',   campaign: 'Reactivación',  estado: 'agendó',    hora: 'ayer 18:44' },
  { nombre: 'Sergio Ledesma',   fuente: 'google', campaign: 'Promo sábados', estado: 'sin contestar', hora: 'ayer 16:20' },
];

// Reseñas de Google Maps (cada una puede tener respuesta auto o pendiente)
export const RESENIAS = [
  { id: 'r1', autor: 'Federico M.',  estrellas: 5, fecha: 'hoy',     texto: 'Excelente atención, Mati corta brutal. Recomendado 100%.', respuesta: 'auto', respIA: '¡Gracias Federico! Nos hacés el día. Te esperamos siempre 🙌', sentimiento: 'positivo' },
  { id: 'r2', autor: 'Joaquín P.',   estrellas: 5, fecha: 'ayer',    texto: 'El mejor fade de Pocitos. Siempre puntuales.', respuesta: 'auto', respIA: '¡Gracias Joaquín! Nos pone re contentos leer esto.', sentimiento: 'positivo' },
  { id: 'r3', autor: 'Diego C.',     estrellas: 3, fecha: '2 días',  texto: 'Buen corte pero esperé 20 min más de lo agendado.', respuesta: 'pendiente', respIA: 'Hola Diego, lamentamos la espera del sábado. Si querés escribinos por WA y te invitamos una barba la próxima.', sentimiento: 'mixto' },
  { id: 'r4', autor: 'Lucas R.',     estrellas: 5, fecha: '3 días',  texto: 'Top. Seba sabe lo que hace.', respuesta: 'auto', respIA: '¡Gracias Lucas! Le pasamos el mensaje a Seba 🙏', sentimiento: 'positivo' },
  { id: 'r5', autor: 'Andrés B.',    estrellas: 4, fecha: '5 días',  texto: 'Buen lugar, lindo ambiente. Subiría un poco la temperatura del local.', respuesta: 'auto', respIA: '¡Gracias por la sugerencia Andrés! Lo tenemos anotado.', sentimiento: 'mixto' },
  { id: 'r6', autor: 'Maxi P.',      estrellas: 5, fecha: '1 sem',   texto: 'Recomendado.', respuesta: 'auto', respIA: '¡Gracias Maxi!', sentimiento: 'positivo' },
];

// ── Productos (retail) — stock se descuenta automáticamente al cobrar ──
export const PRODUCTOS = [
  { id: 'p-pomada',   nombre: 'Pomada efecto mate',      cat: 'Styling',  precio: 690,  costo: 320, stock: 18, stockMin: 6, sku: 'VU-POM-01' },
  { id: 'p-cera',     nombre: 'Cera modeladora',         cat: 'Styling',  precio: 620,  costo: 290, stock: 4,  stockMin: 6, sku: 'VU-CER-02' },
  { id: 'p-shampoo',  nombre: 'Shampoo anticaspa 250ml', cat: 'Cuidado',  precio: 540,  costo: 240, stock: 11, stockMin: 5, sku: 'VU-SHA-03' },
  { id: 'p-aceite',   nombre: 'Aceite para barba 30ml',  cat: 'Barba',    precio: 750,  costo: 350, stock: 9,  stockMin: 4, sku: 'VU-ACE-04' },
  { id: 'p-balsamo',  nombre: 'Bálsamo para barba',      cat: 'Barba',    precio: 680,  costo: 300, stock: 2,  stockMin: 4, sku: 'VU-BAL-05' },
  { id: 'p-peine',    nombre: 'Peine de madera',         cat: 'Accesorio',precio: 380,  costo: 150, stock: 23, stockMin: 8, sku: 'VU-PEI-06' },
  { id: 'p-locion',   nombre: 'Loción after shave',      cat: 'Cuidado',  precio: 590,  costo: 260, stock: 7,  stockMin: 5, sku: 'VU-LOC-07' },
  { id: 'p-gift',     nombre: 'Gift card $1.500',        cat: 'Gift',     precio: 1500, costo: 0,   stock: 99, stockMin: 0, sku: 'VU-GIF-08' },
];

// Métodos de pago disponibles en el cobro
export const METODOS_PAGO = [
  { id: 'efectivo',  nombre: 'Efectivo',          icon: 'cash' },
  { id: 'debito',    nombre: 'Débito',            icon: 'card' },
  { id: 'credito',   nombre: 'Crédito',           icon: 'card' },
  { id: 'mercadopago',nombre: 'Mercado Pago',     icon: 'qr' },
  { id: 'transferencia', nombre: 'Transferencia', icon: 'bank' },
  { id: 'cuponera',  nombre: 'Cuponera',          icon: 'ticket' },
];

// Gastos del salón (egresos) — para Finanzas
export const GASTOS = [
  { id: 'g1', fecha: '2026-05-02', categoria: 'Insumos',     concepto: 'Reposición de toallas y capas',   monto: 4200,  metodo: 'transferencia' },
  { id: 'g2', fecha: '2026-05-04', categoria: 'Productos',   concepto: 'Compra pomadas + ceras (x24)',     monto: 8800,  metodo: 'transferencia' },
  { id: 'g3', fecha: '2026-05-06', categoria: 'Servicios',   concepto: 'UTE — luz',                        monto: 6300,  metodo: 'debito' },
  { id: 'g4', fecha: '2026-05-08', categoria: 'Alquiler',    concepto: 'Alquiler local mayo',              monto: 52000, metodo: 'transferencia' },
  { id: 'g5', fecha: '2026-05-10', categoria: 'Marketing',   concepto: 'Inversión Meta Ads',               monto: 8400,  metodo: 'credito' },
  { id: 'g6', fecha: '2026-05-12', categoria: 'Insumos',     concepto: 'Hojas, espuma, alcohol',           monto: 2950,  metodo: 'efectivo' },
  { id: 'g7', fecha: '2026-05-14', categoria: 'Mantenimiento',concepto: 'Service máquinas de corte',       monto: 3400,  metodo: 'efectivo' },
];

// Notas del equipo — block al costado de la agenda
export const NOTAS_EQUIPO = [
  { id: 'n1', texto: 'Llega mercadería de pomadas el martes — recibir antes de las 11h.', autor: 'Mati', color: '#F59E0B', fecha: 'hoy' },
  { id: 'n2', texto: 'Seba se va 17h (turno médico). Reagendar 18h de Iván.', autor: 'Seba', color: '#0EA5E9', fecha: 'hoy' },
  { id: 'n3', texto: 'Recordar ofrecer cuponera a clientes con 9+ visitas.', autor: 'Nico', color: '#10B981', fecha: 'ayer' },
];

// Promociones (descuentos sobre servicios/productos)
export const PROMOS = [
  { id: 'promo1', nombre: '2x1 en cejas (martes)', tipo: 'servicio', objetivo: 'cejas', desc: 50, unidad: '%', activa: true,  vence: '30 jun 2026' },
  { id: 'promo2', nombre: 'Combo corte + pomada',  tipo: 'combo',    objetivo: 'corte+p-pomada', desc: 250, unidad: '$', activa: true, vence: '15 jul 2026' },
  { id: 'promo3', nombre: '-15% productos barba',  tipo: 'producto', objetivo: 'Barba', desc: 15, unidad: '%', activa: false, vence: '01 may 2026' },
];

// Ventas históricas del mes (cerradas) — alimentan Finanzas + stats por barbero.
// Cada cobro nuevo agrega una venta más a este registro vía el store.
export const VENTAS = [
  { id: 'v1', fecha: '2026-05-16', hora: '09:14', clienteNombre: 'Federico Méndez', barbero: 'mati', items: [{ tipo: 'servicio', nombre: 'Fade premium', precio: 950, qty: 1 }], propina: 150, descuento: 0, total: 950, pagos: [{ metodo: 'debito', monto: 950 }], turnoId: 't1' },
  { id: 'v2', fecha: '2026-05-16', hora: '09:42', clienteNombre: 'Joaquín Pereira', barbero: 'seba', items: [{ tipo: 'servicio', nombre: 'Corte + barba', precio: 1100, qty: 1 }, { tipo: 'producto', nombre: 'Aceite para barba 30ml', precio: 750, qty: 1 }], propina: 200, descuento: 0, total: 1850, pagos: [{ metodo: 'efectivo', monto: 1850 }], turnoId: 't2' },
  { id: 'v3', fecha: '2026-05-16', hora: '10:20', clienteNombre: 'Rodrigo Silveira', barbero: 'seba', items: [{ tipo: 'servicio', nombre: 'Diseño de barba', precio: 550, qty: 1 }], propina: 100, descuento: 0, total: 550, pagos: [{ metodo: 'mercadopago', monto: 550 }], turnoId: 't3' },
];
