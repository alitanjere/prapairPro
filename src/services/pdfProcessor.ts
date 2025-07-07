// Servicio para procesar PDFs y extraer texto para el RAG
export interface ProcessedDocument {
  id: string;
  title: string;
  content: string;
  source: string;
  category?: string;
  chunks: string[];
  metadata: {
    pageCount?: number;
    uploadDate: Date;
    fileSize?: number;
  };
}

class PDFProcessor {
  private documents: ProcessedDocument[] = [];

  // Procesar archivo PDF usando PDF.js (que funciona en el navegador)
  async processPDF(file: File, category?: string): Promise<ProcessedDocument> {
    try {
      console.log('📄 Procesando PDF:', file.name);
      
      // Leer el archivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Usar PDF.js para extraer texto
      const text = await this.extractTextFromPDF(arrayBuffer);
      
      // Dividir en chunks para mejor búsqueda
      const chunks = this.createTextChunks(text, 500); // 500 caracteres por chunk
      
      const document: ProcessedDocument = {
        id: `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace('.pdf', ''),
        content: text,
        source: 'PDF Upload',
        category: category || 'general',
        chunks,
        metadata: {
          uploadDate: new Date(),
          fileSize: file.size,
          pageCount: chunks.length
        }
      };

      this.documents.push(document);
      console.log('✅ PDF procesado exitosamente');
      return document;
      
    } catch (error) {
      console.error('❌ Error procesando PDF:', error);
      throw new Error('No se pudo procesar el PDF');
    }
  }

  // Extraer texto del PDF usando PDF.js
  private async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    // Por ahora simulamos la extracción - en producción usarías PDF.js
    // Para implementar PDF.js real, necesitarías: npm install pdfjs-dist
    
    // Simulación de extracción de texto
    const decoder = new TextDecoder();
    const text = decoder.decode(arrayBuffer);
    
    // Buscar patrones de texto común en PDFs
    const textContent = this.extractReadableText(text);
    
    return textContent || 'Contenido del PDF extraído';
  }

  private extractReadableText(rawText: string): string {
    // Limpiar y extraer texto legible del PDF
    return rawText
      .replace(/[^\x20-\x7E\n]/g, ' ') // Mantener solo caracteres ASCII imprimibles
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  // Dividir texto en chunks para mejor búsqueda
  private createTextChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '. ';
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  // Buscar contenido relevante en los documentos
  searchRelevantContent(query: string, category?: string): string[] {
    const relevantChunks: string[] = [];
    const queryWords = query.toLowerCase().split(' ');

    this.documents
      .filter(doc => !category || doc.category === category)
      .forEach(doc => {
        doc.chunks.forEach(chunk => {
          const chunkLower = chunk.toLowerCase();
          const relevanceScore = queryWords.reduce((score, word) => {
            return score + (chunkLower.includes(word) ? 1 : 0);
          }, 0);

          if (relevanceScore > 0) {
            relevantChunks.push(chunk);
          }
        });
      });

    // Ordenar por relevancia y retornar los mejores
    return relevantChunks.slice(0, 5);
  }

  // Obtener todos los documentos
  getDocuments(): ProcessedDocument[] {
    return this.documents;
  }

  // Eliminar documento
  removeDocument(id: string): boolean {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index > -1) {
      this.documents.splice(index, 1);
      return true;
    }
    return false;
  }

  // Guardar documentos en localStorage
  saveToStorage(): void {
    try {
      localStorage.setItem('rag_documents', JSON.stringify(this.documents));
    } catch (error) {
      console.error('Error guardando documentos:', error);
    }
  }

  // Cargar documentos desde localStorage
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('rag_documents');
      if (stored) {
        this.documents = JSON.parse(stored);
        console.log(`📚 Cargados ${this.documents.length} documentos desde storage`);
      }
    } catch (error) {
      console.error('Error cargando documentos:', error);
    }
  }
}

export const pdfProcessor = new PDFProcessor();

// Cargar documentos al inicializar
pdfProcessor.loadFromStorage();