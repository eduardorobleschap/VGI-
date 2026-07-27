# VGI — Valoración Geriátrica Integral

Formato de especialidad geriátrica incluida al flujo de consulta.
Módulo de Valoración Geriátrica Integral para la plataforma **DocTree EHR**. Implementa la captura, validación y análisis de escalas geriátricas como paso opcional dentro del flujo de consulta médica.

---

## 📁 Estructura del Módulo

```
VGI/
├── sql/
│   └── 001_create_geriatric_assessments.sql   # Migración PostgreSQL
├── src/
│   ├── types/
│   │   └── vgi.ts                             # Esquemas Zod + tipos TypeScript
│   ├── lib/
│   │   └── geriatric-profile.ts               # calculateGeriatricProfile()
│   ├── hooks/
│   │   └── useVGIForm.ts                      # Hook de estado del formulario
│   └── components/
│       └── vgi/
│           ├── index.ts                       # Barrel exports
│           ├── VGIPanel.tsx                    # Ventana flotante principal
│           ├── VGITrigger.tsx                  # Botón condicional de activación
│           ├── AlertBadges.tsx                 # Badges de alerta clínica
│           ├── ScoreInput.tsx                  # Input reutilizable para escalas
│           └── tabs/
│               ├── FuncionalTab.tsx           # Katz, Barthel, Lawton, SARC-F, FRAIL
│               ├── MentalTab.tsx              # Pfeiffer, MMSE, MoCA, GDS, Hamilton, CAM
│               ├── SindromesTab.tsx            # Caídas, Marcha/TUG, Sueño, Déficits
│               ├── NutricionSocialTab.tsx      # MNA, Peso, Dentición, Social
│               └── PrevencionFarmacosTab.tsx   # Vacunas, Densitometría, Medicamentos
└── README.md
```

---

## 🗄️ Base de Datos

Ejecutar la migración SQL para crear la tabla:

```bash
psql -U tu_usuario -d tu_base -f sql/001_create_geriatric_assessments.sql
```

La tabla `geriatric_assessments` almacena el objeto VGI completo en una columna `vgi_data` tipo **JSONB**, con índice GIN para queries eficientes.

> **Nota:** Los foreign keys están comentados en el SQL. Descoméntalos y ajústalos a los nombres reales de tus tablas (`consultations`, `patients`, `doctors`).

---

## 🔗 Integración en el Flujo de Consulta

### 1. Importar componentes

```tsx
import { VGITrigger, VGIPanel } from '@/components/vgi';
// o la ruta relativa correspondiente
```

### 2. Agregar el trigger condicional

```tsx
const [showVGI, setShowVGI] = useState(false);

// En la vista de consulta:
<VGITrigger
  patient={{ id: '...', name: 'Juan Pérez', age: 72 }}
  doctor={{ id: '...', name: 'Dra. García', specialty: 'Geriatría' }}
  onActivate={() => setShowVGI(true)}
  isActive={showVGI}
/>
```

El botón aparece automáticamente si `patient.age >= 65` o `doctor.specialty === 'Geriatría'`.

### 3. Renderizar la ventana flotante

```tsx
<VGIPanel
  isOpen={showVGI}
  onClose={() => setShowVGI(false)}
  onSave={(vgiData) => {
    // Guardar en BD via API
    console.log(vgiData);
    setShowVGI(false);
  }}
  initialData={existingVGIData} // opcional, para edición
/>
```

---

## 🧮 Alertas Clínicas Automáticas

La función `calculateGeriatricProfile(vgiData)` evalúa 13 reglas y genera alertas en tiempo real:

| Condición | Alerta | Severidad |
|-----------|--------|-----------|
| Barthel < 60 | Dependencia Severa | 🔴 Crítico |
| Barthel 60-90 | Dependencia Moderada | 🟠 Alto |
| Katz ≤ 2 | Dependencia Funcional Severa | 🔴 Crítico |
| FRAIL ≥ 3 | Fragilidad | 🟠 Alto |
| SARC-F ≥ 4 | Riesgo de Sarcopenia | 🟠 Alto |
| Pfeiffer ≥ 5 | Deterioro Cognitivo | 🟠 Alto |
| Mini-Mental < 24 | Déficit Cognitivo | 🟠/🔴 |
| GDS ≥ 10 | Depresión | 🟠 Alto |
| CAM positivo | Delirium | 🔴 Crítico |
| TUG > 12s | Riesgo de Caídas | 🟠 Alto |
| TUG > 20s | Alto Riesgo de Caídas | 🔴 Crítico |
| Caídas ≥ 2/12m | Caídas Recurrentes | 🟠 Alto |
| MNA < 17 | Desnutrición | 🔴 Crítico |
| MNA 17-23.5 | Riesgo de Desnutrición | 🟡 Medio |

Los badges se renderizan dinámicamente en la cabecera del panel conforme el médico captura datos.

---

## 🛠️ Dependencias

Este módulo requiere que tu proyecto ya tenga configurado:

- **React** 18+
- **Zod** (validación de esquemas)
- **Tailwind CSS** (estilos)

---

## 📋 5 Dominios de la VGI

1. **Funcional** — Independencia para actividades de la vida diaria (Katz, Barthel, Lawton), sarcopenia (SARC-F), fragilidad (FRAIL), fuerza de prensión.

2. **Mental / Psicoafectivo** — Cognición (Pfeiffer, MMSE, MoCA), depresión (GDS-15, Hamilton), delirium (CAM).

3. **Síndromes Geriátricos** — Caídas, marcha y equilibrio (TUG), trastornos del sueño, estreñimiento, déficits sensoriales.

4. **Nutrición y Social** — Estado nutricional (MNA), peso, dentición, deglución, contexto de vivienda y cuidador.

5. **Prevención y Fármacos** — Esquema de vacunación, densitometría ósea, revisión farmacológica (polifarmacia, STOPP/START, Beers).

---

## 🔮 Futuro

- [ ] Calculadoras interactivas integradas para cada escala (Barthel, Katz, MNA)
- [ ] Generación automática de resumen/reporte de la VGI
- [ ] Historial de valoraciones previas con comparación temporal
- [ ] Exportación a PDF del resultado de la VGI
