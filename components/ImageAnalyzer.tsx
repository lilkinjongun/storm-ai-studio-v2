import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Button } from './ui/Button';
import { FileUploader } from './ui/FileUploader';
import ReactMarkdown from 'react-markdown';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Analise esta imagem em detalhes.');
  const [useThinking, setUseThinking] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!image) {
      setError("Por favor, faça upload de uma imagem primeiro.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const cleanImage = image.split(',')[1];
      const result = await analyzeImage(cleanImage, prompt, useThinking);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError("A análise falhou. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-light text-white mb-2 tracking-tight">Análise Profunda</h2>
        <p className="text-neutral-500 font-light">Desbloqueie insights com Gemini 3 Pro Preview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <FileUploader 
            label="Upload de Imagem" 
            onFileSelect={setImage} 
            previewUrl={image || undefined} 
          />
          
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-4">
               <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Prompt</label>
               <label className="flex items-center space-x-2 cursor-pointer group">
                 <input 
                    type="checkbox" 
                    checked={useThinking} 
                    onChange={(e) => setUseThinking(e.target.checked)}
                    className="w-4 h-4 text-white rounded focus:ring-offset-black focus:ring-white bg-black border-white/30 checked:bg-white checked:border-white transition-all"
                 />
                 <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">Modo Pensamento</span>
               </label>
             </div>
             
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-24 bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-white outline-none resize-none text-sm transition-all"
             />
             
             <div className="mt-4">
               <Button onClick={handleAnalyze} isLoading={loading} disabled={!image} className="w-full">
                 Analisar Imagem
               </Button>
             </div>
             {error && <p className="text-red-400 text-sm mt-3 bg-red-900/10 p-2 rounded border border-red-900/30">{error}</p>}
          </div>
        </div>

        <div className="bg-black/30 rounded-xl border border-white/10 p-6 h-[600px] overflow-y-auto backdrop-blur-sm custom-scrollbar">
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
               <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               <p className="font-light tracking-wide animate-pulse">{useThinking ? "Pensando profundamente..." : "Analisando..."}</p>
             </div>
          ) : analysis ? (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-light prose-p:text-neutral-300 prose-strong:text-white">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-600 font-light">
              <p>Os resultados da análise aparecerão aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};