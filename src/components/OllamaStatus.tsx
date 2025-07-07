import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { ollamaService } from '../services/ollamaService';

export const OllamaStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [models, setModels] = useState<string[]>([]);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await ollamaService.checkConnection();
      setIsConnected(connected);
      
      if (connected) {
        const availableModels = await ollamaService.getAvailableModels();
        setModels(availableModels);
      }
    } catch (error) {
      setIsConnected(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    checkConnection();
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={checkConnection}
        disabled={isChecking}
        className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
          isConnected 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
      >
        {isChecking ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span>
          {isChecking ? 'Verificando...' : isConnected ? 'Ollama Conectado' : 'Ollama Desconectado'}
        </span>
      </button>
      
      {isConnected && models.length > 0 && (
        <div className="text-xs text-gray-500">
          {models.length} modelo{models.length !== 1 ? 's' : ''} disponible{models.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};