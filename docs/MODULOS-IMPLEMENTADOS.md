# Vero Uomo — Módulos implementados en la maqueta

> **Qué es esto:** un prototipo funcional (clickable) construido para que el cliente valide cómo se vería y operaría el sistema antes de desarrollar la versión productiva.
>
> **Stack de la maqueta:** React 19 + Vite (JSX) · sistema de temas claro/oscuro + densidad.
> **Datos:** mock en memoria mediante un **store central** (Context + `useReducer`). **No hay backend**: los datos viven en el navegador y se reinician al recargar. Todo lo "funcional" opera sobre el front para demostrar el flujo real (cobros, altas, edición, stock, etc.).

**Leyenda de estado**
- ✅ Implementado y funcional en la maqueta
- 🟡 Implementado a nivel de demo (sobre datos mock, sin lógica de negocio real)
- ⏳ Pendiente para producción (requiere backend / IA real)

---

## Arquitectura base (transversal)

| Pieza | Archivo | Qué hace |
|---|---|---|
| Store central | `src/store.jsx` | Estado mutable compartido (turnos, clientes, productos, ventas, gastos, notas, grupos, bloqueos, cuponeras) + acciones. Conecta en vivo cobro ↔ turno ↔ stock ↔ finanzas. |
| Primitivas UI | `src/ui.jsx` + `ui.css` | Drawer (panel lateral), Modal, campos de formulario, stepper de cantidad, Toaster de notificaciones. |
| Carrito de cobro | `src/cobro.jsx` + `cobro.css` | El panel "Nuevo Cobro" global, abrible desde cualquier vista. |
| Datos mock | `src/data.jsx` | Barberos, servicios, productos, clientes (ficha completa), cuponeras, campañas, ventas, gastos, etc. |

---

## 1. Agenda

Vista diaria con dos layouts: **Cronograma** (timeline por barbero) y **Kanban** (columna por hora).

| # | Requisito del cliente | Estado | Cómo quedó |
|---|---|---|---|
| 1 | Agendar manualmente las reservas | ✅ | Botón **"Nuevo turno"** → modal (cliente, servicio con precio/duración auto, barbero, hora). El turno aparece al instante en la grilla. |
| 2 | Botón de cobrar en las citas + cambia de color si ya fue cobrada + solapa con productos/servicios extra + métodos de pago + **propinas** | ✅ | Botón **"Cobrar"** en cada turno → abre el carrito **"Nuevo Cobro"**. Al cobrar, la tarjeta pasa a estado **verde "Cobrado"** y sube el contador. El carrito permite agregar servicios/productos, cantidades, descuento, **propina** (con accesos 10/15/20 %) y múltiples **métodos de pago** (divisibles). |
| 3 | Tachar turnos por horario del salón o para horarios de descanso | ✅ | Botón **"Bloquear"** → modal (aplica a todo el salón o a un barbero, hora y motivo: descanso, almuerzo, salón cerrado, etc.). Se renderiza como bloque rayado en cronograma y kanban; se puede quitar. |
| 4 | Botón de cobro aparte (venta sin agenda, ej. quien viene solo a comprar) | ✅ | Botón **"Cobrar"** arriba a la derecha, junto a "Nuevo turno" → abre el carrito en modo **walk-in** (sin turno asociado), registra la venta igual. |
| 5 | Block de notas al costado de la agenda | ✅ | Panel lateral **"Notas del equipo"**: agregar / eliminar recordatorios (persisten durante la sesión). |
| 6 | Notificar si el cliente está por terminar la cuponera | ✅ | Banner de alerta cuando un cliente con turno hoy está a 1 cupón de terminar (ej. *Andrés 7/8*), con CTA "Ofrecer renovación". |
| 7 | Agregar algún dato del cliente (gusto del café, preferencia) | ✅ | La ficha del cliente (notas/preferencia) **se surfacea dentro del carrito de cobro** al gestionar el turno (ej. *"Pack completo · café americano"*). Se edita desde Clientes. |
| Obs. | Quitar información de facturación de la agenda | ✅ | El resumen ya **no muestra montos** de facturación; solo Turnos / Cobrados / Próximos / No-show. |

---

## 2. Finanzas

Vista nueva. Se alimenta **en vivo** de las ventas que genera cada cobro de la Agenda.

| # | Requisito | Estado | Cómo quedó |
|---|---|---|---|
| 1 | Registro completo de facturación | ✅ | Tabla de ventas (hora, cliente, barbero, detalle, método de pago, total). |
| 2 | Clasificación de facturación por barbero | ✅ | Pestaña "Por barbero" con barras de ingresos + propinas + arrendamiento. |
| 3 | Registro de gastos | ✅ | Tabla de gastos + botón **"Registrar gasto"** (categoría, concepto, monto, método) que impacta al instante. |
| 4 | Registro de propinas | ✅ | KPI de propinas + desglose por barbero. |
| 5 | Estadísticas | ✅ | KPIs (facturación, propinas, gastos, neto) + gráfico de ingresos de 30 días. |
| 6 | Registro de cuponeras | ✅ | Pestaña con vendidas / usados / restantes / ingreso por cuponera. |

---

## 3. Marketing

| # | Requisito | Estado | Cómo quedó |
|---|---|---|---|
| 1 | Solapa para manejar Google Ads y Meta | 🟡 | Tabla de campañas con badge **Meta / Google**, filtro por plataforma y **pausar/activar** por campaña (sobre datos mock). |
| 2 | Enviar mensaje vía WhatsApp a los clientes | 🟡 | Modal **"Enviar WhatsApp"**: elegir destinatarios (todos o por **grupo**), redactar mensaje, plantillas rápidas → confirma con notificación (simulado). |
| 3 | Crear promociones y campañas para el chatbot | 🟡 | Modal **"Nueva campaña"** (plataforma, inversión, mensaje del chatbot) + promociones desde Servicios. |
| 4 | Estadísticas | ✅ | KPIs (inversión, leads, conversión, ROI) + reseñas de Google con respuesta IA. |

---

## 4. Clientes

| # | Requisito | Estado | Cómo quedó |
|---|---|---|---|
| 1 | Ficha generada por la IA: nombre, **teléfono, email, dirección, fecha de nacimiento** | ✅ (datos) / ⏳ (IA real) | La **ficha completa** con todos esos campos está implementada y visible. La recepción/agendado por IA está representada en la vista Inbox (mock); la generación automática real es de producción. |
| 2 | Generar grupos de clientes para promociones | ✅ | Crear grupos, asignar/quitar clientes a grupos (chips con check), y filtrar la lista por grupo. |
| 3 | Notas de preferencias del cliente que aparezcan en futuras reservas | ✅ | Notas **editables** por cliente (botón Guardar). Esa preferencia **aparece luego en el cobro del turno** (ver Agenda #7). |

---

## 5. Servicios y productos

Vista nueva.

| # | Requisito | Estado | Cómo quedó |
|---|---|---|---|
| 1 | Crear servicios, productos y promociones | ✅ | Tres pestañas con altas (modales): **Nuevo servicio**, **Nuevo producto**, **Nueva promoción** (con toggle activa/pausada). |
| 2 | Control de stock que se actualice automáticamente según ventas | ✅ | El stock **baja solo** con cada producto cobrado en la Agenda. Alertas **"Stock bajo" / "Sin stock"**. |
| 3 | Estadísticas | ✅ | KPIs (servicios, productos, valor de stock, stock bajo) + ranking de servicios más vendidos. |

---

## Lo que la maqueta NO incluye (alcance de producción)

Esto es deliberado: la maqueta valida UX/flujos, no es el sistema final. Para producción faltaría:

- ⏳ **Persistencia real** (base de datos) y autenticación / roles (dueño, barbero, recepción).
- ⏳ **Agente de IA real** que recepcione por WhatsApp/Instagram, entienda y agende (hoy es demo en Inbox).
- ⏳ **Integraciones reales**: WhatsApp Business API, Meta Ads API, Google Ads API, Google Maps/reseñas, calendario.
- ⏳ **Pagos reales** / facturación electrónica (hoy se registran los cobros, no se procesan).
- ⏳ **Multi-sucursal**, reportes exportables, notificaciones push/email, backups.
- 🟡 **Botones secundarios** de chrome aún decorativos en algunas pantallas (Inbox, Métricas, Cuponeras, Configuración, y acciones como "Exportar", "Ver todos") — fuera del listado de requisitos del cliente.

---

*Documento generado para el cliente / agencia. Maqueta correspondiente al repositorio `vero-uomo-dashboard`.*
