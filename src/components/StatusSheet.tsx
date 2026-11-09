import React from 'react';

interface StatusSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatusSheet: React.FC<StatusSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-csSurface border-t sm:border border-csBorder rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* iOS Handle */}
        <div className="w-full flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1 bg-slate-700/60 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-csBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">hub</span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                AI & Scraper Node Mesh
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Status: ALL SYSTEMS NOMINAL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white transition"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-csCard border border-csBorder space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Tailscale Mesh Tunnel
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                100.82.14.92
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Encrypted egress gateway routing headless requests directly through residential nodes to prevent Cloudflare/perimeter challenges.
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-csBorder">
              <span>Latency: 28ms</span>
              <span>Uptime: 99.98%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-csCard border border-csBorder space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Ollama Local Reasoning Core
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                llama3.2:3b
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Local on-device inference for prompt crafting, host response analysis, and anti-spam personalization.
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-csBorder">
              <span>Inference: 42 tokens/s</span>
              <span>VRAM: 2.1 GB</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-csCard border border-csBorder space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                LLaVA Multimodal Vision
              </span>
              <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                llava:13b-q4
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Extracts context from host profile images, home photos (sleeping space, amenities, clean living room indicators).
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-csBorder">
              <span>Avg Process Time: 1.1s / img</span>
              <span>Queue: 0 pending</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold active:scale-95 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
