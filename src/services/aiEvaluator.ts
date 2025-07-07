import { Question, AIEvaluation } from '../types';
import { ollamaService } from './ollamaService';
import { ragService } from './ragService';

export const evaluateAnswer = async (question: Question, answer: string, timeSpent: number): Promise<AIEvaluation> => {
  console.log('🔄 Iniciando evaluación...');
  
  // Verificar conexión con Ollama
  const isOllamaAvailable = await ollamaService.checkConnection();
  
  if (!isOllamaAvailable) {
    console.log('⚠️ Ollama no disponible, usando evaluación simulada');
    return simulatedEvaluation(question, answer, timeSpent);
  }

  try {
    console.log('🤖 Usando Ollama para evaluación real');
    
    // Obtener contexto relevante del RAG
    const context = ragService.getRelevantContext(question, answer);
    
    // Crear prompt específico para evaluación
    const evaluationPrompt = createEvaluationPrompt(question, answer, timeSpent, context);
    
    // Llamar a Ollama
    const ollamaResponse = await ollamaService.generateResponse(evaluationPrompt);
    
    // Parsear respuesta de Ollama
    const evaluation = parseOllamaResponse(ollamaResponse, question, answer);
    
    console.log('✅ Evaluación completada con Ollama');
    return evaluation;
    
  } catch (error) {
    console.error('❌ Error en evaluación con Ollama:', error);
    console.log('🔄 Fallback a evaluación simulada');
    return simulatedEvaluation(question, answer, timeSpent);
  }
};

const createEvaluationPrompt = (question: Question, answer: string, timeSpent: number, context: string): string => {
  return `
Eres un experto evaluador de entrevistas técnicas. Evalúa la siguiente respuesta de manera objetiva y constructiva.

CONTEXTO RELEVANTE:
${context}

PREGUNTA DE ENTREVISTA:
Categoría: ${question.category}
Dificultad: ${question.difficulty}
Pregunta: "${question.title}"
Descripción: ${question.description}
Tiempo límite sugerido: ${question.timeLimit} minutos

RESPUESTA DEL CANDIDATO:
"${answer}"

INFORMACIÓN ADICIONAL:
- Tiempo utilizado: ${Math.floor(timeSpent / 60)} minutos y ${timeSpent % 60} segundos
- Longitud de respuesta: ${answer.length} caracteres

INSTRUCCIONES DE EVALUACIÓN:
1. Evalúa la respuesta en una escala de 0-100
2. Identifica 2-4 fortalezas específicas
3. Identifica 2-4 áreas de mejora
4. Proporciona feedback detallado y constructivo
5. Da 2-3 sugerencias específicas para mejorar

FORMATO DE RESPUESTA (JSON):
{
  "score": [número entre 0-100],
  "strengths": ["fortaleza 1", "fortaleza 2", ...],
  "improvements": ["mejora 1", "mejora 2", ...],
  "detailedFeedback": "análisis detallado de la respuesta...",
  "suggestions": ["sugerencia 1", "sugerencia 2", ...]
}

Responde SOLO con el JSON, sin texto adicional.
`;
};

const parseOllamaResponse = (response: string, question: Question, answer: string): AIEvaluation => {
  try {
    // Intentar parsear JSON directamente
    const cleanResponse = response.trim();
    let jsonMatch = cleanResponse;
    
    // Si la respuesta no empieza con {, buscar JSON en el texto
    if (!cleanResponse.startsWith('{')) {
      const jsonRegex = /\{[\s\S]*\}/;
      const match = cleanResponse.match(jsonRegex);
      if (match) {
        jsonMatch = match[0];
      }
    }
    
    const parsed = JSON.parse(jsonMatch);
    
    // Validar y limpiar la respuesta
    return {
      score: Math.max(0, Math.min(100, parsed.score || 60)),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Respuesta proporcionada'],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Desarrollar más la respuesta'],
      detailedFeedback: parsed.detailedFeedback || 'Evaluación completada con IA.',
      criteriaScores: generateCriteriaScores(question, answer),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Practicar más este tipo de preguntas']
    };
    
  } catch (error) {
    console.error('❌ Error parseando respuesta de Ollama:', error);
    console.log('📝 Respuesta original:', response);
    
    // Fallback a evaluación basada en análisis simple
    return createFallbackEvaluation(question, answer, response);
  }
};

const createFallbackEvaluation = (question: Question, answer: string, ollamaResponse: string): AIEvaluation => {
  const wordCount = answer.trim().split(/\s+/).length;
  let score = 40;
  
  // Scoring básico
  if (wordCount > 50) score += 20;
  if (wordCount > 100) score += 15;
  if (answer.toLowerCase().includes('ejemplo')) score += 10;
  if (answer.length > 200) score += 15;
  
  return {
    score: Math.min(100, score),
    strengths: ['Respuesta proporcionada', 'Participación en el ejercicio'],
    improvements: ['Desarrollar más la respuesta con ejemplos específicos', 'Agregar más detalles técnicos'],
    detailedFeedback: `Evaluación basada en IA: ${ollamaResponse.substring(0, 200)}...`,
    criteriaScores: generateCriteriaScores(question, answer),
    suggestions: ['Practicar respuestas más detalladas', 'Incluir ejemplos específicos de tu experiencia']
  };
};

// Función de evaluación simulada (fallback)
const simulatedEvaluation = async (question: Question, answer: string, timeSpent: number): Promise<AIEvaluation> => {
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const wordCount = answer.trim().split(/\s+/).length;
  
  // Si la respuesta es muy corta, dar score bajo
  if (wordCount < 5) {
    return {
      score: 25,
      strengths: ['Participación en el ejercicio'],
      improvements: [
        'La respuesta es demasiado corta para una evaluación adecuada',
        'Desarrolla tu respuesta con ejemplos específicos',
        'Explica tu razonamiento paso a paso'
      ],
      detailedFeedback: 'La respuesta proporcionada es muy breve. En una entrevista real, se espera una explicación más detallada que demuestre tu conocimiento y experiencia.',
      criteriaScores: generateCriteriaScores(question, answer),
      suggestions: [
        'Apunta a respuestas de al menos 100-150 palabras',
        'Incluye ejemplos específicos de tu experiencia',
        'Estructura tu respuesta con introducción, desarrollo y conclusión'
      ]
    };
  }
  
  // Evaluación normal para respuestas más largas
  return generateCategorySpecificFeedback(question, answer, Math.min(85, 60 + wordCount));
};

const generateCriteriaScores = (question: Question, answer: string): Record<string, number> => {
  const criteria = question.evaluationCriteria || [];
  const scores: Record<string, number> = {};
  
  criteria.forEach(criterion => {
    let score = 50 + Math.random() * 30;
    if (answer.toLowerCase().includes(criterion.toLowerCase().split(' ')[0])) {
      score += 15;
    }
    scores[criterion] = Math.round(Math.min(100, score));
  });
  
  return scores;
};

const generateCategorySpecificFeedback = (question: Question, answer: string, baseScore: number) => {
  // ... (mantener la función existente)
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
      if (baseScore < 70) {
        improvements.push('Agrega más detalles técnicos específicos');
        improvements.push('Incluye ejemplos de código o casos de uso');
        suggestions.push('Practica explicar conceptos técnicos paso a paso');
      }
      detailedFeedback = `Tu respuesta técnica muestra ${baseScore > 80 ? 'un excelente' : baseScore > 60 ? 'un buen' : 'un básico'} entendimiento del tema. ${baseScore > 80 ? 'Demuestras profundidad técnica y capacidad de explicación clara.' : 'Considera agregar más ejemplos específicos y detalles de implementación.'}`;
      break;

    default:
      strengths.push('Respuesta coherente y bien estructurada');
      if (baseScore < 70) {
        improvements.push('Agrega más detalles específicos y ejemplos');
        suggestions.push('Practica respuestas más detalladas para esta categoría');
      }
      detailedFeedback = `Tu respuesta muestra ${baseScore > 80 ? 'excelente' : baseScore > 60 ? 'buena' : 'básica'} comprensión del tema.`;
  }

  return {
    score: baseScore,
    strengths,
    improvements,
    detailedFeedback,
    criteriaScores: generateCriteriaScores(question, answer),
    suggestions
  };
};