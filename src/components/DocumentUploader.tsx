import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { pdfProcessor, ProcessedDocument } from '../services/pdfProcessor';

interface DocumentUploaderProps {
  onDocumentsChange?: (documents: ProcessedDocument[]) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentsChange }) => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>(pdfProcessor.getDocuments());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('');

    try {
      for (const file of Array.from(files)) {
        if (file.type === 'application/pdf') {
          setUploadStatus(`Procesando ${file.name}...`);
          
          // Procesar el PDF
          const processedDoc = await pdfProcessor.processPDF(file, 'interview-guide');
          
          // Actualizar la lista de documentos
          const updatedDocs = pdfProcessor.getDocuments();
          setDocuments(updatedDocs);
          
          // Guardar en localStorage
          pdfProcessor.saveToStorage();
          
          setUploadStatus(`✅ ${file.name} procesado exitosamente`);
        } else {
          setUploadStatus(`❌ ${file.name} no es un PDF válido`);
        }
      }

      // Notificar cambios
      if (onDocumentsChange) {
        onDocumentsChange(pdfProcessor.getDocuments());
      }

    } catch (error) {
      setUploadStatus(`❌ Error procesando archivos: ${error}`);
    } finally {
      setIsUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveDocument = (id: string) => {
    if (pdfProcessor.removeDocument(id)) {
      const updatedDocs = pdfProcessor.getDocuments();
      setDocuments(updatedDocs);
      pdfProcessor.saveToStorage();
      
      if (onDocumentsChange) {
        onDocumentsChange(updatedDocs);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Documentos RAG</h3>
          <p className="text-sm text-gray-600">
            Sube PDFs con información sobre entrevistas para mejorar las evaluaciones
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Procesando...' : 'Subir PDF'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {uploadStatus && (
        <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
          uploadStatus.includes('✅') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : uploadStatus.includes('❌')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {uploadStatus.includes('✅') ? (
            <CheckCircle className="w-4 h-4" />
          ) : uploadStatus.includes('❌') ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
          <span>{uploadStatus}</span>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay documentos cargados</p>
          <p className="text-sm">Sube PDFs para mejorar las evaluaciones con IA</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{doc.chunks.length} chunks</span>
                    {doc.metadata.fileSize && (
                      <span>{formatFileSize(doc.metadata.fileSize)}</span>
                    )}
                    <span>{doc.metadata.uploadDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveDocument(doc.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar documento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para mejores resultados:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Sube guías de entrevistas de universidades reconocidas</li>
          <li>• Incluye documentos sobre metodologías como STAR</li>
          <li>• Agrega material sobre competencias técnicas específicas</li>
          <li>• Los PDFs con texto seleccionable funcionan mejor</li>
        </ul>
      </div>
    </div>
  );
};