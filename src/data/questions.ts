import { Question, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'technical',
    name: 'Conocimientos Técnicos',
    description: 'Programación, algoritmos, arquitectura y tecnologías específicas',
    icon: 'Code',
    color: 'bg-blue-500',
    questionCount: 18
  },
  {
    id: 'behavioral',
    name: 'Preguntas Comportamentales',
    description: 'Situaciones pasadas, resolución de conflictos y toma de decisiones',
    icon: 'Users',
    color: 'bg-green-500',
    questionCount: 15
  },
  {
    id: 'teamwork',
    name: 'Trabajo en Equipo',
    description: 'Colaboración, liderazgo y dinámicas de equipo',
    icon: 'UserCheck',
    color: 'bg-purple-500',
    questionCount: 12
  },
  {
    id: 'problem-solving',
    name: 'Resolución de Problemas',
    description: 'Pensamiento crítico, creatividad y metodología de solución',
    icon: 'Lightbulb',
    color: 'bg-orange-500',
    questionCount: 10
  },
  {
    id: 'communication',
    name: 'Comunicación',
    description: 'Presentaciones, explicaciones técnicas y habilidades interpersonales',
    icon: 'MessageCircle',
    color: 'bg-teal-500',
    questionCount: 8
  },
  {
    id: 'leadership',
    name: 'Liderazgo',
    description: 'Gestión de equipos, toma de decisiones y visión estratégica',
    icon: 'Crown',
    color: 'bg-red-500',
    questionCount: 9
  },
  {
    id: 'adaptability',
    name: 'Adaptabilidad',
    description: 'Cambios, aprendizaje continuo y flexibilidad',
    icon: 'Shuffle',
    color: 'bg-indigo-500',
    questionCount: 7
  },
  {
    id: 'culture-fit',
    name: 'Cultura Empresarial',
    description: 'Valores, motivación y alineación con la empresa',
    icon: 'Building',
    color: 'bg-pink-500',
    questionCount: 6
  }
];

export const questions: Question[] = [
  // Conocimientos Técnicos
  {
    id: 'tech-1',
    category: 'technical',
    title: 'Explica qué son los React Hooks y sus beneficios',
    difficulty: 'Medium',
    description: 'Describe qué son los React Hooks, cómo funcionan, y qué ventajas proporcionan sobre los componentes de clase. Da ejemplos de hooks comúnmente utilizados.',
    timeLimit: 15,
    tags: ['React', 'Hooks', 'JavaScript'],
    hints: [
      'Piensa en useState y useEffect',
      'Considera los problemas con los componentes de clase',
      'Menciona los custom hooks'
    ],
    sampleAnswer: 'Los React Hooks son funciones que permiten usar estado y otras características de React en componentes funcionales. Beneficios: código más limpio, mejor reutilización de lógica, testing más fácil, evitar wrapper hell. Hooks comunes: useState para manejo de estado, useEffect para efectos secundarios, useContext para consumir contexto.',
    evaluationCriteria: [
      'Definición clara de hooks',
      'Menciona beneficios específicos',
      'Ejemplos de hooks comunes',
      'Comparación con componentes de clase'
    ]
  },
  {
    id: 'tech-2',
    category: 'technical',
    title: 'Diseña una API RESTful para un sistema de blog',
    difficulty: 'Medium',
    description: 'Diseña los endpoints principales para una API REST de un blog que maneje posts, comentarios y usuarios. Incluye métodos HTTP, códigos de estado y estructura de datos.',
    timeLimit: 20,
    tags: ['REST', 'API', 'Backend'],
    hints: [
      'Piensa en los recursos principales',
      'Considera las operaciones CRUD',
      'Incluye códigos de estado HTTP apropiados'
    ],
    sampleAnswer: 'Endpoints principales: GET /posts (listar), POST /posts (crear), GET /posts/:id (obtener), PUT /posts/:id (actualizar), DELETE /posts/:id (eliminar). Similar para /users y /posts/:id/comments. Códigos: 200 (OK), 201 (Created), 404 (Not Found), 400 (Bad Request).',
    evaluationCriteria: [
      'Estructura de endpoints clara',
      'Uso correcto de métodos HTTP',
      'Códigos de estado apropiados',
      'Consideración de relaciones entre recursos'
    ]
  },

  // Preguntas Comportamentales
  {
    id: 'behav-1',
    category: 'behavioral',
    title: 'Cuéntame sobre una vez que tuviste que aprender una tecnología nueva rápidamente',
    difficulty: 'Medium',
    description: 'Describe una situación específica donde necesitaste aprender una nueva tecnología o herramienta bajo presión de tiempo. ¿Cómo lo abordaste y cuál fue el resultado?',
    timeLimit: 8,
    tags: ['Aprendizaje', 'Adaptabilidad', 'Presión'],
    hints: [
      'Usa el método STAR (Situación, Tarea, Acción, Resultado)',
      'Sé específico sobre la tecnología y el contexto',
      'Menciona tu proceso de aprendizaje'
    ],
    sampleAnswer: 'En mi proyecto anterior, necesité aprender GraphQL en 2 semanas para una nueva feature. Situación: API REST existente era insuficiente. Tarea: implementar GraphQL. Acción: dediqué 2 horas diarias a tutoriales, practiqué con proyectos pequeños, consulté documentación oficial. Resultado: implementé exitosamente la solución a tiempo y mejoré la eficiencia de queries en 40%.',
    evaluationCriteria: [
      'Estructura STAR clara',
      'Contexto específico y creíble',
      'Proceso de aprendizaje detallado',
      'Resultado medible',
      'Reflexión sobre la experiencia'
    ]
  },
  {
    id: 'behav-2',
    category: 'behavioral',
    title: 'Describe un momento donde cometiste un error significativo en el trabajo',
    difficulty: 'Hard',
    description: 'Todos cometemos errores. Cuéntame sobre un error importante que hayas cometido, cómo lo manejaste, y qué aprendiste de esa experiencia.',
    timeLimit: 10,
    tags: ['Errores', 'Responsabilidad', 'Aprendizaje'],
    hints: [
      'Sé honesto pero profesional',
      'Enfócate en tu respuesta y aprendizaje',
      'Muestra crecimiento personal'
    ],
    sampleAnswer: 'Desplegué código sin testing completo que causó downtime de 2 horas. Inmediatamente notifiqué al equipo, hice rollback, y trabajé en el fix. Implementé checklist de deployment y testing automatizado. Aprendí la importancia de procesos rigurosos y comunicación proactiva.',
    evaluationCriteria: [
      'Honestidad y transparencia',
      'Responsabilidad personal',
      'Acciones correctivas inmediatas',
      'Medidas preventivas implementadas',
      'Aprendizaje y crecimiento demostrado'
    ]
  },

  // Trabajo en Equipo
  {
    id: 'team-1',
    category: 'teamwork',
    title: 'Describe cómo manejas los conflictos en el equipo',
    difficulty: 'Medium',
    description: 'Los conflictos son naturales en cualquier equipo. ¿Cuál es tu enfoque para manejar desacuerdos o tensiones entre compañeros de equipo?',
    timeLimit: 8,
    tags: ['Conflictos', 'Mediación', 'Comunicación'],
    hints: [
      'Menciona la importancia de escuchar',
      'Habla sobre encontrar soluciones ganar-ganar',
      'Incluye un ejemplo específico si es posible'
    ],
    sampleAnswer: 'Mi enfoque es escuchar activamente a todas las partes, entender las perspectivas, y buscar puntos en común. Facilito conversaciones abiertas, me enfoco en el problema no en las personas, y busco soluciones colaborativas. En un proyecto reciente, medié entre frontend y backend sobre arquitectura, organizando sesiones de diseño conjunto que resultaron en una solución mejor.',
    evaluationCriteria: [
      'Enfoque estructurado para resolver conflictos',
      'Habilidades de comunicación y mediación',
      'Ejemplo concreto y relevante',
      'Enfoque en soluciones constructivas',
      'Demostración de madurez emocional'
    ]
  },
  {
    id: 'team-2',
    category: 'teamwork',
    title: '¿Cómo contribuyes a crear un ambiente de trabajo positivo?',
    difficulty: 'Easy',
    description: 'Describe las acciones específicas que tomas para fomentar un ambiente de trabajo colaborativo y positivo en tu equipo.',
    timeLimit: 6,
    tags: ['Ambiente laboral', 'Colaboración', 'Cultura'],
    hints: [
      'Piensa en acciones concretas, no solo actitudes',
      'Menciona cómo apoyas a tus compañeros',
      'Incluye ejemplos de iniciativas que hayas tomado'
    ],
    sampleAnswer: 'Contribuyo compartiendo conocimiento en sesiones de lunch & learn, celebrando logros del equipo, ofreciendo ayuda proactivamente, y manteniendo comunicación abierta. Organizo retrospectivas constructivas y actividades de team building. Creo que un ambiente positivo aumenta la productividad y retención del talento.',
    evaluationCriteria: [
      'Acciones específicas y tangibles',
      'Iniciativa personal demostrada',
      'Comprensión del impacto en el equipo',
      'Ejemplos concretos de contribuciones',
      'Visión sobre la importancia del ambiente laboral'
    ]
  },

  // Resolución de Problemas
  {
    id: 'problem-1',
    category: 'problem-solving',
    title: 'Describe tu proceso para abordar un problema complejo',
    difficulty: 'Medium',
    description: 'Cuando te enfrentas a un problema técnico o de negocio complejo, ¿cuál es tu metodología paso a paso para abordarlo?',
    timeLimit: 10,
    tags: ['Metodología', 'Análisis', 'Proceso'],
    hints: [
      'Describe un proceso estructurado',
      'Menciona cómo recopilas información',
      'Habla sobre cómo evalúas diferentes soluciones'
    ],
    sampleAnswer: '1) Definir claramente el problema y sus síntomas 2) Recopilar información y datos relevantes 3) Identificar posibles causas raíz 4) Generar múltiples soluciones alternativas 5) Evaluar pros/contras de cada opción 6) Implementar la mejor solución 7) Monitorear resultados y ajustar si es necesario. Siempre documento el proceso para futuros casos similares.',
    evaluationCriteria: [
      'Proceso estructurado y lógico',
      'Enfoque sistemático',
      'Consideración de múltiples alternativas',
      'Importancia de documentación',
      'Seguimiento y evaluación de resultados'
    ]
  },

  // Comunicación
  {
    id: 'comm-1',
    category: 'communication',
    title: '¿Cómo explicas conceptos técnicos complejos a personas no técnicas?',
    difficulty: 'Medium',
    description: 'Describe tu estrategia para comunicar ideas técnicas complicadas a stakeholders, clientes o compañeros que no tienen background técnico.',
    timeLimit: 8,
    tags: ['Comunicación técnica', 'Stakeholders', 'Simplificación'],
    hints: [
      'Menciona el uso de analogías',
      'Habla sobre adaptar el lenguaje a la audiencia',
      'Incluye ejemplos visuales o diagramas'
    ],
    sampleAnswer: 'Adapto mi comunicación a la audiencia: uso analogías del mundo real, evito jerga técnica, empleo diagramas visuales, y me enfoco en el impacto de negocio. Por ejemplo, explico APIs como "meseros en un restaurante que llevan pedidos entre la cocina y los clientes". Siempre verifico comprensión haciendo preguntas y pidiendo feedback.',
    evaluationCriteria: [
      'Estrategias específicas de comunicación',
      'Uso efectivo de analogías',
      'Adaptación a diferentes audiencias',
      'Verificación de comprensión',
      'Enfoque en valor de negocio'
    ]
  },

  // Liderazgo
  {
    id: 'lead-1',
    category: 'leadership',
    title: 'Cuéntame sobre una vez que tuviste que liderar sin autoridad formal',
    difficulty: 'Hard',
    description: 'Describe una situación donde necesitaste influir y guiar a otros sin tener una posición de autoridad formal sobre ellos.',
    timeLimit: 10,
    tags: ['Liderazgo', 'Influencia', 'Autoridad'],
    hints: [
      'Enfócate en cómo construiste credibilidad',
      'Menciona técnicas de influencia utilizadas',
      'Describe el resultado y el impacto'
    ],
    sampleAnswer: 'Lideré una iniciativa cross-funcional para mejorar el proceso de deployment. Sin autoridad formal, construí credibilidad demostrando expertise, escuchando preocupaciones de cada equipo, y creando una visión compartida. Organicé workshops, documenté beneficios, y celebré pequeñas victorias. Resultado: reducimos tiempo de deployment de 4 horas a 30 minutos.',
    evaluationCriteria: [
      'Demostración de liderazgo sin autoridad',
      'Estrategias de construcción de credibilidad',
      'Habilidades de influencia',
      'Resultados tangibles',
      'Comprensión de dinámicas de equipo'
    ]
  },

  // Adaptabilidad
  {
    id: 'adapt-1',
    category: 'adaptability',
    title: 'Describe cómo te adaptas a cambios frecuentes en los requerimientos',
    difficulty: 'Medium',
    description: 'En el desarrollo de software, los requerimientos cambian constantemente. ¿Cómo manejas esta incertidumbre y te adaptas a los cambios?',
    timeLimit: 8,
    tags: ['Cambios', 'Flexibilidad', 'Agilidad'],
    hints: [
      'Menciona metodologías ágiles',
      'Habla sobre comunicación con stakeholders',
      'Describe cómo priorizas en situaciones cambiantes'
    ],
    sampleAnswer: 'Abrazo la mentalidad ágil: mantengo comunicación constante con stakeholders, priorizo features por valor de negocio, uso desarrollo iterativo, y documento decisiones. Veo los cambios como oportunidades de mejora, no obstáculos. Mantengo arquitectura flexible y practico over-communication para alinear expectativas.',
    evaluationCriteria: [
      'Mentalidad positiva hacia el cambio',
      'Estrategias prácticas de adaptación',
      'Comprensión de metodologías ágiles',
      'Comunicación proactiva',
      'Enfoque en valor de negocio'
    ]
  },

  // Cultura Empresarial
  {
    id: 'culture-1',
    category: 'culture-fit',
    title: '¿Qué te motiva en tu trabajo diario?',
    difficulty: 'Easy',
    description: 'Describe qué aspectos de tu trabajo te dan más energía y satisfacción. ¿Qué te hace levantarte con ganas de trabajar?',
    timeLimit: 6,
    tags: ['Motivación', 'Valores', 'Propósito'],
    hints: [
      'Sé auténtico sobre tus motivaciones',
      'Conecta con el impacto de tu trabajo',
      'Menciona tanto aspectos técnicos como humanos'
    ],
    sampleAnswer: 'Me motiva resolver problemas complejos que impactan positivamente a los usuarios. Disfruto el proceso creativo de encontrar soluciones elegantes, aprender nuevas tecnologías, y colaborar con equipos diversos. Ver cómo mi código mejora la experiencia de miles de usuarios me da un sentido de propósito. También valoro el crecimiento continuo y mentorear a otros desarrolladores.',
    evaluationCriteria: [
      'Autenticidad en las motivaciones',
      'Conexión con impacto y propósito',
      'Balance entre aspectos técnicos y humanos',
      'Alineación con valores profesionales',
      'Pasión genuina por el trabajo'
    ]
  }
];