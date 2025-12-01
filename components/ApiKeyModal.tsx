import React, { useState, useEffect } from 'react';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '../services/geminiService';
import { Button } from './ui/Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKey();
      if (stored) {
        setApiKey(stored);
        setIsSaved(true);
      } else {
        setApiKey('');
        setIsSaved(false);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setIsSaved(true);
      onClose();
    }
  };

  const handleRemove = () => {
    removeStoredApiKey();
    setApiKey('');
    setIsSaved(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
          <h3 className="text-xl font-light text-white mb-2">Configuração da API</h3>
          <p className="text-sm text-neutral-400 font-light">
            Para usar o Storm AI Studio, você precisa de uma chave de API do Google Gemini.
            A chave é salva apenas no seu navegador.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2">
              Sua Chave API (Gemini)
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Cole sua chave aqui..."
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-700 focus:ring-1 focus:ring-white focus:border-transparent outline-none transition-all font-mono text-sm"
              />
              {isSaved && (
                <div className="absolute right-3 top-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {isSaved ? (
              <Button onClick={handleRemove} variant="danger" className="flex-1 text-sm">
                Remover Chave
              </Button>
            ) : (
              <Button onClick={onClose} variant="ghost" className="flex-1 text-sm">
                Cancelar
              </Button>
            )}
            <Button onClick={handleSave} disabled={!apiKey.trim()} className="flex-1 text-sm">
              {isSaved ? 'Atualizar' : 'Salvar & Continuar'}
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-white underline decoration-neutral-700 hover:decoration-white transition-all"
          >
            Obter chave gratuita no Google AI Studio &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};