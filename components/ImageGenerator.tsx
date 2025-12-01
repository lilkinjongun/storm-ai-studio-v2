import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Button } from './ui/Button';
import { AspectRatio, ImageSize } from '../types';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generated = await generateImage(prompt, aspectRatio, size);
      setResult(generated);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("API key")) {
        setError("Por favor, selecione uma chave de API válida para usar o modelo Pro.");
      } else {
        setError("A geração falhou. Tente um prompt diferente ou verifique suas configurações.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-light text-white mb-2 tracking-tight">Gerador Pro</h2>
          <p className="text-neutral-500 font-light">Geração de alta fidelidade com Gemini 3 Pro Image Preview.</p>
        </div>
        <Button variant="secondary" onClick={handleSelectKey} className="text-xs uppercase tracking-wider">
           Gerenciar Chave API
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">Proporção</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(AspectRatio).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    aspectRatio === ratio 
                      ? 'bg-white border-white text-black' 
                      : 'bg-black/20 border-white/5 text-neutral-500 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">Resolução</label>
            <div className="flex gap-2">
              {Object.values(ImageSize).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    size === s 
                      ? 'bg-white border-white text-black' 
                      : 'bg-black/20 border-white/5 text-neutral-500 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt & Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva a imagem que você deseja gerar em detalhes..."
                className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder-neutral-600 focus:ring-1 focus:ring-white focus:border-transparent outline-none resize-none transition-all"
             />
             <div className="mt-4 flex justify-end">
               <Button onClick={handleGenerate} isLoading={loading} disabled={!prompt.trim()}>
                 Gerar Imagem
               </Button>
             </div>
             {error && <p className="text-red-400 text-sm mt-3 bg-red-900/10 p-2 rounded border border-red-900/30 inline-block">{error}</p>}
          </div>

          <div className={`
             min-h-[500px] rounded-xl border border-dashed flex items-center justify-center overflow-hidden bg-black/30 relative transition-all duration-500
             ${result ? 'border-white/10 bg-black' : 'border-white/10'}
          `}>
             {loading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                 <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-white animate-pulse font-light tracking-wide">Criando obra-prima...</p>
               </div>
             )}
             
             {result ? (
               <img src={result} alt="Gerada" className="w-full h-full object-contain" />
             ) : (
               <div className="text-center p-8">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
                 <p className="text-neutral-600 font-light">A imagem gerada aparecerá aqui</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};