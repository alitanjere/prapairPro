interface OllamaResponse {
  response: string;
  done: boolean;
}

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

class OllamaService {
  private baseUrl = 'http://localhost:11434';
  private defaultModel = 'llama2:7b-chat';
  private isConnected = false;

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        this.isConnected = true;
        console.log('✅ Ollama conectado correctamente');
        return true;
      }
    } catch (error) {
      console.log('❌ Ollama no está disponible:', error);
      this.isConnected = false;
    }
    return false;
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        return data.models?.map((model: any) => model.name) || [];
      }
    } catch (error) {
      console.error('Error obteniendo modelos:', error);
    }
    return [];
  }

  async generateResponse(prompt: string, model?: string): Promise<string> {
    const modelToUse = model || this.defaultModel;
    
    try {
      console.log('🤖 Enviando prompt a Ollama:', prompt.substring(0, 100) + '...');
      
      const request: OllamaRequest = {
        model: modelToUse,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      console.log('✅ Respuesta recibida de Ollama');
      return data.response;
    } catch (error) {
      console.error('❌ Error llamando a Ollama:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  setModel(model: string): void {
    this.defaultModel = model;
  }
}

export const ollamaService = new OllamaService();