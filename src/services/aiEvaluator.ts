import { Question, AIEvaluation } from '../types';

// Simulación de evaluación con IA - En producción esto sería una llamada a OpenAI/Claude API
export const evaluateAnswer = async (question: Question, answer: string, timeSpent: number): Promise<AIEvaluation> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 2000));

  const wordCount = answer.trim().split(/\s+/).length;
  const hasStructure = answer.includes('1.') || answer.includes('-') || answer.includes('•');
  const hasExamples = answer.toLowerCase().includes('ejemplo') || answer.toLowerCase().includes('por ejemplo');
  const usesSTAR = question.category === 'behavioral' && 
    (answer.toLowerCase().includes('situación') || answer.toLowerCase().includes('tarea') || 
     answer.toLowerCase().includes('acción') || answer.toLowerCase().includes('resultado'));

  // Scoring basado en criterios
  let baseScore = 60;
  
  // Longitud de respuesta
  if (wordCount > 150) baseScore += 15;
  else if (wordCount > 100) baseScore += 10;
  else if (wordCount > 50) baseScore += 5;
  
  // Estructura
  if (hasStructure) baseScore += 10;
  
  // Ejemplos específicos
  if (hasExamples) baseScore += 10;
  
  // Metodología STAR para preguntas comportamentales
  if (usesSTAR) baseScore += 15;
  
  // Tiempo utilizado eficientemente
  const timeEfficiency = Math.min(100, (timeSpent / (question.timeLimit * 60)) * 100);
  if (timeEfficiency > 50 && timeEfficiency < 90) baseScore += 5;

  const finalScore = Math.min(100, Math.max(0, baseScore));

  // Generar feedback específico por categoría
  const feedback = generateCategorySpecificFeedback(question, answer, finalScore);

  return {
    score: finalScore,
    strengths: feedback.strengths,
    improvements: feedback.improvements,
    detailedFeedback: feedback.detailedFeedback,
    criteriaScores: generateCriteriaScores(question, answer),
    suggestions: feedback.suggestions
  };
};

const generateCategorySpecificFeedback = (question: Question, answer: string, score: number) => {
  const category = question.category;
  const wordCount = answer.trim().split(/\s+/).length;
  
  let strengths: string[] = [];
  let improvements: string[] = [];
  let suggestions: string[] = [];
  let detailedFeedback = '';

  switch (category) {
    case 'technical':
      if (answer.includes('ejemplo') || answer.includes('código')) {
        strengths.push('Incluiste ejemplos prácticos que demuestran tu conocimiento');
      }
      if (wordCount > 100) {
        strengths.push('Respuesta detallada que cubre múltiples aspectos del tema');
      }
      if (score < 70) {
        improvements.push('Agrega más detalles técnicos específicos');
        improvements.push('Incluye ejemplos de código o casos de uso');
        suggestions.push('Practica explicar conceptos técnicos paso a paso');
      }
      detailedFeedback = `Tu respuesta técnica muestra ${score > 80 ? 'un excelente' : score > 60 ? 'un buen' : 'un básico'} entendimiento del tema. ${score > 80 ? 'Demuestras profundidad técnica y capacidad de explicación clara.' : 'Considera agregar más ejemplos específicos y detalles de implementación.'}`;
      break;

    case 'behavioral':
      const hasSTAR = answer.toLowerCase().includes('situación') || answer.toLowerCase().includes('tarea');
      if (hasSTAR) {
        strengths.push('Utilizaste la metodología STAR para estructurar tu respuesta');
      }
      if (answer.includes('aprendí') || answer.includes('resultado')) {
        strengths.push('Mostraste reflexión y aprendizaje de la experiencia');
      }
      if (!hasSTAR) {
        improvements.push('Usa la metodología STAR (Situación, Tarea, Acción, Resultado)');
        suggestions.push('Estructura tus respuestas comportamentales con STAR');
      }
      if (score < 70) {
        improvements.push('Sé más específico sobre las acciones que tomaste');
        improvements.push('Incluye métricas o resultados cuantificables');
      }
      detailedFeedback = `Tu respuesta comportamental ${score > 80 ? 'demuestra excelente' : score > 60 ? 'muestra buena' : 'necesita mejorar la'} capacidad de reflexión y storytelling. ${hasSTAR ? 'La estructura STAR ayuda a comunicar tu experiencia claramente.' : 'Considera usar la metodología STAR para mayor impacto.'}`;
      break;

    case 'teamwork':
      if (answer.includes('colabor') || answer.includes('equipo')) {
        strengths.push('Demuestras comprensión de la importancia del trabajo colaborativo');
      }
      if (answer.includes('conflicto') || answer.includes('desacuerdo')) {
        strengths.push('Abordas situaciones desafiantes con madurez');
      }
      if (score < 70) {
        improvements.push('Incluye ejemplos específicos de colaboración exitosa');
        improvements.push('Menciona cómo contribuyes al éxito del equipo');
        suggestions.push('Practica describir tu rol en dinámicas de equipo');
      }
      detailedFeedback = `Tu respuesta sobre trabajo en equipo ${score > 80 ? 'refleja excelentes' : score > 60 ? 'muestra buenas' : 'necesita desarrollar más'} habilidades interpersonales. ${score > 70 ? 'Demuestras madurez emocional y capacidad de colaboración.' : 'Considera agregar más ejemplos concretos de tu contribución al equipo.'}`;
      break;

    case 'leadership':
      if (answer.includes('lider') || answer.includes('guiar')) {
        strengths.push('Demuestras comprensión del liderazgo más allá de la autoridad formal');
      }
      if (answer.includes('influencia') || answer.includes('motivar')) {
        strengths.push('Entiendes la importancia de la influencia y motivación');
      }
      if (score < 70) {
        improvements.push('Describe técnicas específicas de liderazgo que has usado');
        improvements.push('Incluye resultados tangibles de tu liderazgo');
        suggestions.push('Practica articular tu estilo de liderazgo');
      }
      detailedFeedback = `Tu respuesta de liderazgo ${score > 80 ? 'demuestra fuerte' : score > 60 ? 'muestra potencial de' : 'necesita desarrollar más'} capacidad de influencia y guía. ${score > 70 ? 'Articulas bien cómo lideras sin autoridad formal.' : 'Considera incluir más ejemplos específicos de situaciones de liderazgo.'}`;
      break;

    default:
      strengths.push('Respuesta coherente y bien estructurada');
      if (score < 70) {
        improvements.push('Agrega más detalles específicos y ejemplos');
        suggestions.push('Practica respuestas más detalladas para esta categoría');
      }
      detailedFeedback = `Tu respuesta muestra ${score > 80 ? 'excelente' : score > 60 ? 'buena' : 'básica'} comprensión del tema.`;
  }

  // Feedback general basado en score
  if (score >= 90) {
    strengths.push('Respuesta excepcional que demuestra expertise y madurez profesional');
  } else if (score >= 80) {
    strengths.push('Respuesta sólida con buenos ejemplos y estructura clara');
  } else if (score >= 70) {
    strengths.push('Respuesta adecuada que cubre los puntos principales');
  }

  if (wordCount < 50) {
    improvements.push('Desarrolla más tu respuesta con detalles adicionales');
    suggestions.push('Apunta a respuestas de al menos 100-150 palabras');
  }

  return { strengths, improvements, detailedFeedback, suggestions };
};

const generateCriteriaScores = (question: Question, answer: string): Record<string, number> => {
  const criteria = question.evaluationCriteria || [];
  const scores: Record<string, number> = {};
  
  criteria.forEach(criterion => {
    // Scoring simplificado basado en palabras clave y longitud
    let score = 60 + Math.random() * 30; // Base score con variación
    
    // Ajustar basado en contenido
    if (answer.toLowerCase().includes(criterion.toLowerCase().split(' ')[0])) {
      score += 10;
    }
    
    scores[criterion] = Math.round(Math.min(100, score));
  });
  
  return scores;
};

// Función para generar sugerencias de mejora personalizadas
export const generatePersonalizedTips = (userProgress: any): string[] => {
  const tips: string[] = [];
  
  if (userProgress.stats.averageScore < 70) {
    tips.push('💡 Practica estructurar tus respuestas con introducción, desarrollo y conclusión');
    tips.push('📝 Incluye siempre ejemplos específicos de tu experiencia');
  }
  
  if (userProgress.stats.averageTime > 600) { // más de 10 minutos promedio
    tips.push('⏱️ Practica respuestas más concisas - apunta a 5-8 minutos por pregunta');
  }
  
  tips.push('🎯 Usa la metodología STAR para preguntas comportamentales');
  tips.push('🔍 Investiga la empresa y conecta tus respuestas con sus valores');
  
  return tips;
};