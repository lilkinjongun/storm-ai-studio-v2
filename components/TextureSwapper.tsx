import React, { useState } from 'react';
import { swapTexture } from '../services/geminiService';
import { Button } from './ui/Button';
import { FileUploader } from './ui/FileUploader';

export const TextureSwapper: React.FC = () => {
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [textureImage, setTextureImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Troque o material do objeto para corresponder à textura de referência.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!targetImage || !textureImage) {
      setError("Por favor, envie tanto a imagem alvo quanto a textura de referência.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Clean base64 strings (remove "data:image/jpeg;base64," prefix)
      const cleanTarget = targetImage.split(',')[1];
      const cleanTexture = textureImage.split(',')[1];

      const result = await swapTexture(cleanTarget, cleanTexture, prompt);
      setGeneratedImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha ao trocar textura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Estúdio de Texturas</h2>
        <p className="text-neutral-500 max-w-2xl mx-auto font-light">Aplique qualquer material a qualquer objeto ou ambiente usando o poder do Gemini Nano Banana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FileUploader 
          label="1. Imagem Alvo (Ambiente/Objeto)" 
          onFileSelect={setTargetImage} 
          previewUrl={targetImage || undefined} 
        />
        <FileUploader 
          label="2. Textura de Referência (Material)" 
          onFileSelect={setTextureImage} 
          previewUrl={textureImage || undefined} 
        />
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-md">
        <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">3. Descreva a alteração</label>
        <div className="flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ex: Substitua o piso de madeira por este mármore..."
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:ring-1 focus:ring-white focus:border-transparent outline-none transition-all"
          />
          <Button onClick={handleSwap} isLoading={loading} disabled={!targetImage || !textureImage} className="md:w-48 shadow-none">
            Trocar Textura
          </Button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3 bg-red-900/10 p-2 rounded border border-red-900/30 inline-block">{error}</p>}
      </div>

      {generatedImage && (
        <div className="mt-12 bg-black rounded-2xl p-2 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
          <div className="rounded-xl overflow-hidden relative">
            <img src={generatedImage} alt="Resultado" className="w-full h-auto" />
            <div className="absolute top-4 right-4">
              <a 
                href={generatedImage} 
                download="resultado-textura.png"
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/20 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};