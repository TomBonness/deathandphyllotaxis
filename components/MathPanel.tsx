import React from 'react';
import { 
  getContinuedFraction, 
  getConvergents, 
  getDivergenceRatio,
  FIBONACCI_NUMBERS 
} from '../utils/math';

interface MathPanelProps {
  angle: number;
  highlightedSpiral: number | null;
  setHighlightedSpiral: (q: number | null) => void;
}

export default function MathPanel({
  angle,
  highlightedSpiral,
  setHighlightedSpiral,
}: MathPanelProps) {
  const ratio = getDivergenceRatio(angle);
  const terms = getContinuedFraction(ratio, 8);
  const convergents = getConvergents(terms);

  // Check if a number is Fibonacci
  const isFibonacci = (n: number) => FIBONACCI_NUMBERS.includes(n);

  return (
    <div className="flex flex-col h-full bg-swiss-paper text-swiss-black font-sans">
      {/* Title */}
      <div className="p-6 swiss-border-b bg-swiss-black text-swiss-paper">
        <div className="text-xs uppercase tracking-widest font-mono mb-1 text-swiss-lightgrey/60">Section 02</div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Mathematical Panel</h2>
      </div>

      {/* Angle Stats */}
      <div className="p-6 swiss-border-b flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey block mb-1">Divergence Angle</span>
          <div className="text-5xl font-black tracking-tighter text-swiss-black">
            {angle.toFixed(3)}°
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-swiss-black/10 flex justify-between items-end">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey block">Divergence Ratio (α/360°)</span>
            <div className="font-mono text-lg font-bold">{ratio.toFixed(6)}</div>
          </div>
          {Math.abs(angle - 137.508) < 0.01 && (
            <span className="bg-swiss-red text-white text-[10px] uppercase font-mono px-2 py-0.5 font-bold tracking-wider">
              Golden Ratio
            </span>
          )}
        </div>
      </div>

      {/* Continued Fraction */}
      <div className="p-6 swiss-border-b flex-1 overflow-y-auto">
        <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey block mb-3">Continued Fraction</span>
        <div className="flex items-center flex-wrap gap-1 mb-4 font-mono">
          <span className="text-swiss-grey text-sm">[0;</span>
          {terms.map((term, index) => {
            const isOne = term === 1;
            return (
              <React.Fragment key={index}>
                <span 
                  className={`px-2 py-1 text-sm font-bold border transition-colors ${
                    isOne 
                      ? 'bg-swiss-red/10 border-swiss-red text-swiss-red' 
                      : 'bg-swiss-black text-swiss-paper border-swiss-black'
                  }`}
                  title={isOne ? "1 represents the slowest convergence (hardest to approximate)" : `Term: ${term}`}
                >
                  {term}
                </span>
                {index < terms.length - 1 && <span className="text-swiss-grey text-sm">,</span>}
              </React.Fragment>
            );
          })}
          <span className="text-swiss-grey text-sm">... ]</span>
        </div>

        {/* Math explanation */}
        <div className="text-xs text-swiss-grey leading-relaxed space-y-2 border-l border-swiss-black/20 pl-3">
          <p>
            The continued fraction shows how we approximate a decimal using integers. The smaller the integers, the harder it is to approximate.
          </p>
          <p>
            At the <strong className="text-swiss-black font-bold">Golden Angle (137.508°)</strong>, the expansion becomes a sequence of all <strong className="text-swiss-red font-bold">1s</strong>. Because 1 is the smallest natural number, the Golden Ratio is the <strong className="text-swiss-black font-bold">most irrational number</strong>—the hardest to approximate by any fraction.
          </p>
          <p>
            This prevents seeds from aligning along simple radial lines (e.g. 135° = 3/8, which has a short fraction <span className="font-mono">[2, 1, 2]</span> and leaves 8 empty wedges).
          </p>
        </div>
      </div>

      {/* Convergents & Spiral highlight */}
      <div className="p-6 bg-swiss-lightgrey/30">
        <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey block mb-3">
          Parastichy Families (Spirals)
        </span>
        <p className="text-xs text-swiss-grey mb-4 leading-relaxed">
          The denominators <span className="font-mono text-swiss-black font-bold">q</span> of the rational approximations represent the number of visible spiral families. Click a family below to highlight its arms on the canvas:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {convergents.slice(0, 6).map((c, idx) => {
            const active = highlightedSpiral === c.q;
            const isFib = isFibonacci(c.q);
            return (
              <button
                key={idx}
                onClick={() => setHighlightedSpiral(active ? null : c.q)}
                className={`p-3 text-left border flex flex-col justify-between transition-all ${
                  active
                    ? 'bg-swiss-red border-swiss-red text-white'
                    : 'bg-swiss-paper border-swiss-black hover:bg-swiss-lightgrey/60 text-swiss-black'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] uppercase opacity-75">
                    Family {idx + 1}
                  </span>
                  {isFib && (
                    <span className={`text-[8px] font-bold tracking-widest px-1 font-mono uppercase ${
                      active ? 'bg-white text-swiss-red' : 'bg-swiss-red text-white'
                    }`}>
                      FIB
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-baseline justify-between w-full">
                  <span className="text-2xl font-black font-mono leading-none">
                    {c.q}
                  </span>
                  <span className="font-mono text-xs opacity-75">
                    {c.p}/{c.q}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {highlightedSpiral && (
          <div className="mt-4 flex justify-between items-center bg-swiss-black text-swiss-paper p-3 text-xs">
            <span className="font-mono">Highlighting family: {highlightedSpiral}</span>
            <button 
              onClick={() => setHighlightedSpiral(null)}
              className="text-[10px] uppercase font-mono underline hover:text-swiss-red"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
