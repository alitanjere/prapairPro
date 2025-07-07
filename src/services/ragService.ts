// RAG Service para proporcionar contexto relevante a las evaluaciones
export interface RAGContext {
  relevantInfo: string;
  sources: string[];
  confidence: number;
}

class RAGService {
  private knowledgeBase: Record<string, string[]> = {
    'technical': [
      'Los React Hooks permiten usar estado y otras características de React en componentes funcionales',
      'useState es para manejo de estado local, useEffect para efectos secundarios',
      'Los custom hooks permiten reutilizar lógica entre componentes',
      'Las APIs RESTful siguen principios de arquitectura REST con métodos HTTP estándar',
      'GET para obtener datos, POST para crear, PUT para actualizar, DELETE para eliminar',
      'Los códigos de estado HTTP indican el resultado: 200 OK, 201 Created, 404 Not Found, 500 Server Error'
    ],
    'behavioral': [
      'La metodología STAR (Situación, Tarea, Acción, Resultado) estructura respuestas comportamentales',
      'Incluir métricas y resultados cuantificables fortalece las respuestas',
      'Mostrar aprendizaje y crecimiento personal es valorado por los entrevistadores',
      'Los errores deben presentarse con honestidad, enfocándose en la solución y aprendizaje',
      'Las respuestas deben ser específicas y relevantes a la experiencia personal'
    ],
    'teamwork': [
      'La comunicación efectiva es clave para el trabajo en equipo exitoso',
      'Escuchar activamente y buscar soluciones ganar-ganar resuelve conflictos',
      'Contribuir proactivamente al ambiente positivo mejora la productividad del equipo',
      'La colaboración cross-funcional requiere adaptación y flexibilidad',
      'Celebrar logros del equipo fortalece la cohesión grupal'
    ],
    'leadership': [
      'El liderazgo sin autoridad formal requiere influencia y credibilidad',
      'Construir consenso y visión compartida es fundamental para liderar equipos',
      'Los líderes efectivos adaptan su estilo según la situación y el equipo',
      'La delegación efectiva empodera al equipo y desarrolla capacidades',
      'Los líderes deben ser ejemplo de los valores que promueven'
    ],
    'problem-solving': [
      'Un proceso estructurado mejora la calidad de las soluciones',
      'Definir claramente el problema es el primer paso crítico',
      'Generar múltiples alternativas antes de decidir amplía las opciones',
      'Evaluar pros y contras ayuda a tomar decisiones informadas',
      'Documentar el proceso facilita el aprendizaje futuro'
    ],
    'communication': [
      'Adaptar el mensaje a la audiencia mejora la comprensión',
      'Las analogías simplifican conceptos técnicos complejos',
      'Los elementos visuales complementan la comunicación verbal',
      'Verificar comprensión asegura comunicación efectiva',
      'El feedback bidireccional mejora la calidad de la comunicación'
    ],
    'adaptability': [
      'La mentalidad ágil abraza el cambio como oportunidad',
      'La comunicación constante con stakeholders reduce incertidumbre',
      'Priorizar por valor de negocio optimiza el impacto',
      'La arquitectura flexible facilita la adaptación a cambios',
      'El desarrollo iterativo permite ajustes continuos'
    ],
    'culture-fit': [
      'La autenticidad en las motivaciones genera confianza',
      'Conectar el trabajo personal con el impacto organizacional es valioso',
      'El balance entre aspectos técnicos y humanos muestra madurez',
      'La pasión genuina por el trabajo es contagiosa',
      'Los valores personales deben alinearse con los organizacionales'
    ]
  };

  private interviewTips: Record<string, string[]> = {
    'general': [
      'Prepara historias específicas que puedas adaptar a diferentes preguntas',
      'Practica el método STAR para preguntas comportamentales',
      'Investiga la empresa y conecta tus respuestas con sus valores',
      'Prepara preguntas inteligentes para hacer al entrevistador',
      'Practica explicar conceptos técnicos de manera simple'
    ],
    'technical': [
      'Explica tu proceso de pensamiento paso a paso',
      'Incluye trade-offs y consideraciones de diseño',
      'Menciona casos edge y manejo de errores',
      'Usa ejemplos concretos de tu experiencia',
      'Dibuja diagramas cuando sea apropiado'
    ],
    'behavioral': [
      'Sé específico con fechas, números y resultados',
      'Enfócate en tu contribución personal, no del equipo',
      'Incluye lo que aprendiste de cada experiencia',
      'Prepara ejemplos de éxitos y fracasos',
      'Practica contar historias de forma concisa'
    ]
  };

  getRelevantContext(category: string, questionTitle: string): RAGContext {
    const categoryKnowledge = this.knowledgeBase[category] || [];
    const generalTips = this.interviewTips['general'] || [];
    const categoryTips = this.interviewTips[category] || [];

    // Buscar información relevante basada en palabras clave del título
    const keywords = questionTitle.toLowerCase().split(' ');
    const relevantInfo = categoryKnowledge.filter(info => 
      keywords.some(keyword => info.toLowerCase().includes(keyword))
    );

    // Combinar información relevante
    const contextParts = [
      ...relevantInfo.slice(0, 3), // Top 3 más relevantes
      ...categoryKnowledge.slice(0, 2), // 2 generales de la categoría
      ...categoryTips.slice(0, 2), // 2 tips específicos
      ...generalTips.slice(0, 1) // 1 tip general
    ];

    return {
      relevantInfo: contextParts.join('\n'),
      sources: ['Knowledge Base', 'Interview Best Practices'],
      confidence: relevantInfo.length > 0 ? 0.8 : 0.6
    };
  }

  // Método para agregar nuevo conocimiento al RAG
  addKnowledge(category: string, information: string): void {
    if (!this.knowledgeBase[category]) {
      this.knowledgeBase[category] = [];
    }
    this.knowledgeBase[category].push(information);
  }

  // Método para obtener estadísticas del knowledge base
  getKnowledgeStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    Object.keys(this.knowledgeBase).forEach(category => {
      stats[category] = this.knowledgeBase[category].length;
    });
    return stats;
  }
}

export const ragService = new RAGService();