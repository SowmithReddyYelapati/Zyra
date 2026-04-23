import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function VisualSearch({ products }) {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { setImage(e.target.result); setIsProcessing(true); setHasSearched(false); };
    reader.readAsDataURL(file);

    const keyword = file.name.toLowerCase().split('.')[0].replace(/[^a-z]+/g, ' ').trim();
    let matched = [];
    if (keyword) {
        products.forEach(p => {
           if (keyword.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(keyword)) matched.push(p);
        });
        if (matched.length === 0) {
           const generics = products.filter(p => p.category.toLowerCase().includes(keyword));
           if (generics.length > 0) matched = generics.slice(0, 2);
        }
    }
    setTimeout(() => { setResults(matched); setHasSearched(true); setIsProcessing(false); }, 1200);
  };
  
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };
  const handleChange = (e) => { if (e.target.files[0]) processFile(e.target.files[0]); };

  return (
    <div className="bg-slate-800 rounded-3xl p-6 border border-white/5 h-full flex flex-col shadow-xl">
       <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 text-xl">📸</span>
          <h4 className="text-lg font-bold text-emerald-400">Visual Search</h4>
       </div>

       <div 
         onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}
         className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-slate-900/50 hover:bg-slate-900'}`}
       >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
          {!image ? (
            <p className="text-xs text-slate-400 text-center">Drop image here <br/> or click to browse</p>
          ) : (
             <img src={image} alt="Preview" className="max-h-20 rounded-lg shadow-lg object-contain" />
          )}
       </div>

       {isProcessing && <div className="text-center text-xs text-emerald-400 mt-4 animate-pulse">Running Neural Engine...</div>}

       {(hasSearched && results.length > 0) && (
         <div className="mt-4 flex flex-col gap-2">
            {results.map(item => (
               <div key={item._id} className="flex justify-between items-center bg-slate-900 p-2 pl-3 rounded-xl border border-white/5">
                  <span className="text-sm font-semibold truncate pr-2 text-slate-200">{item.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs">Add</button>
               </div>
            ))}
         </div>
       )}
       {(hasSearched && results.length === 0) && (
          <div className="mt-4 text-xs text-rose-400 text-center">No objects identified.</div>
       )}
    </div>
  );
}
