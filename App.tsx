import React, { useState } from 'react';
import { AppTab } from './types';
import { TextureSwapper } from './components/TextureSwapper';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageAnalyzer } from './components/ImageAnalyzer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TEXTURE_SWAP);

  const handleApiKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  return (
    <div className="min-h-screen text-neutral-200 selection:bg-white/20">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
              STORM AI STUDIO
            </span>
             <span className="text-lg font-bold tracking-tight text-white sm:hidden">
              STORM
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex space-x-2">
              <TabButton 
                active={activeTab === AppTab.TEXTURE_SWAP} 
                onClick={() => setActiveTab(AppTab.TEXTURE_SWAP)}
                label="Editor de Textura"
                icon="photo_library"
              />
              <TabButton 
                active={activeTab === AppTab.GENERATOR} 
                onClick={() => setActiveTab(AppTab.GENERATOR)}
                label="Gerador"
                icon="auto_awesome"
              />
              <TabButton 
                active={activeTab === AppTab.ANALYZER} 
                onClick={() => setActiveTab(AppTab.ANALYZER)}
                label="Analisador"
                icon="analytics"
              />
            </nav>

            <div className="h-5 w-px bg-white/10 hidden md:block"></div>

            <button 
              onClick={handleApiKey}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
              title="Gerenciar Chave API"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white uppercase tracking-wider hidden lg:block">Chave API</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden border-b border-white/10 bg-black p-2 flex justify-around fixed bottom-0 left-0 right-0 z-40 pb-safe">
          <TabButtonMobile active={activeTab === AppTab.TEXTURE_SWAP} onClick={() => setActiveTab(AppTab.TEXTURE_SWAP)} label="Texturas" />
          <TabButtonMobile active={activeTab === AppTab.GENERATOR} onClick={() => setActiveTab(AppTab.GENERATOR)} label="Gerar" />
          <TabButtonMobile active={activeTab === AppTab.ANALYZER} onClick={() => setActiveTab(AppTab.ANALYZER)} label="Analisar" />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-16 md:mb-0">
        {activeTab === AppTab.TEXTURE_SWAP && <TextureSwapper />}
        {activeTab === AppTab.GENERATOR && <ImageGenerator />}
        {activeTab === AppTab.ANALYZER && <ImageAnalyzer />}
      </main>
    </div>
  );
};

// UI Components for Tabs
const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
      active 
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
        : 'bg-transparent text-neutral-400 border-transparent hover:text-white hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

const TabButtonMobile: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
      active ? 'bg-white text-black' : 'text-neutral-500 hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

export default App;