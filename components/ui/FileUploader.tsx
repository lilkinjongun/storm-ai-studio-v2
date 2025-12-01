import React, { useRef } from 'react';

interface FileUploaderProps {
  label: string;
  onFileSelect: (base64: string) => void;
  previewUrl?: string;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  label, 
  onFileSelect, 
  previewUrl, 
  accept = "image/*" 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onFileSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">{label}</label>
      <div 
        onClick={handleClick}
        className={`
          relative border border-dashed rounded-xl p-4 h-72 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden
          ${previewUrl ? 'border-white/20 bg-black/40' : 'border-white/10 hover:border-white/30 hover:bg-white/5 bg-black/20'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef}
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange}
        />
        
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        ) : (
          <div className="text-center group-hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-neutral-600 mb-4 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-neutral-400 font-medium group-hover:text-neutral-200">Clique para fazer upload</p>
            <p className="text-xs text-neutral-600 mt-1">PNG, JPG até 10MB</p>
          </div>
        )}
        
        {previewUrl && (
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
             <p className="text-white font-medium border border-white/30 bg-black/50 px-4 py-2 rounded-full text-sm">Trocar Imagem</p>
          </div>
        )}
      </div>
    </div>
  );
};