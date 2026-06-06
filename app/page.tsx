'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RefreshCw, Info, HelpCircle } from 'lucide-react';
import PhyllotaxisCanvas from '../components/PhyllotaxisCanvas';
import MathPanel from '../components/MathPanel';

interface HoveredSeed {
  index: number;
  r: number;
  theta: number;
}

const PRESETS = [
  {
    name: 'Golden Angle',
    angle: 137.508,
    description: 'Divergence ratio 1/φ ≈ 0.381966. Continued fraction is [0; 2, 1, 1, 1, ...], yielding the most uniform packing and no radial lines.',
  },
  {
    name: 'Pi Angle',
    angle: 114.592,
    description: 'Divergence ratio 1/π ≈ 0.318310. Continued fraction is [0; 3, 7, 15, ...]. High-order approximations cause large gaps and strict spiral arms.',
  },
  {
    name: 'Rational Angle',
    angle: 135.000,
    description: 'Divergence ratio 3/8 = 0.375. Short continued fraction [0; 2, 1, 2]. Seeds stack perfectly on 8 radial spokes, leaving massive empty wedges.',
  },
  {
    name: 'Near-Golden',
    angle: 138.000,
    description: 'Divergence ratio 23/60 ≈ 0.383333. Continued fraction is [0; 2, 1, 1, 1, 5]. Appears packed in the center, but splits into 60 distinct spokes at the edge.',
  }
];

export default function Home() {
  const [angle, setAngle] = useState(137.508);
  const [seedCount, setSeedCount] = useState(800);
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);
  const [seedSize, setSeedSize] = useState(4);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(0.002); // degrees per frame
  const [hoveredSeed, setHoveredSeed] = useState<HoveredSeed | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Animation Loop
  useEffect(() => {
    if (!isAnimating) return;

    let frameId: number;
    const tick = () => {
      setAngle((prev) => {
        let next = prev + animationSpeed;
        // Keep within 90 and 180
        if (next > 180) next = 90;
        if (next < 90) next = 180;
        // Format to 3 decimal places to keep it clean
        return parseFloat(next.toFixed(3));
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isAnimating, animationSpeed]);

  // Adjust angle with safety limits
  const updateAngle = (val: number) => {
    const cleaned = Math.max(90, Math.min(180, val));
    setAngle(parseFloat(cleaned.toFixed(3)));
  };

  const handleStepAngle = (step: number) => {
    updateAngle(angle + step);
  };

  return (
    <main className="min-h-screen swiss-grid select-none pb-12">
      {/* HEADER SECTION - Column 1 to 12 */}
      <header className="col-span-12 p-6 swiss-border-b bg-swiss-black text-swiss-paper grid grid-cols-1 md:grid-cols-12 items-center gap-4">
        <div className="md:col-span-8">
          <div className="text-xs uppercase tracking-widest font-mono text-swiss-lightgrey/60 mb-2">
            Experiment No. 04
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none m-0">
            Phyllotaxis
          </h1>
          <div className="text-xs uppercase font-mono tracking-wider text-swiss-red font-bold mt-1">
            The Golden Angle & Seed Packing Efficiency
          </div>
        </div>
        <div className="md:col-span-4 md:text-right">
          <button
            onClick={() => setShowInfoModal(true)}
            className="border border-swiss-lightgrey/30 hover:border-swiss-red hover:text-swiss-red text-swiss-paper px-4 py-2 font-mono text-xs uppercase transition-colors inline-flex items-center gap-2"
          >
            <Info size={14} /> About Phyllotaxis
          </button>
        </div>
      </header>

      {/* INTRODUCTION TEXT - Column 1 to 12 */}
      <section className="col-span-12 p-6 swiss-border-b grid grid-cols-1 md:grid-cols-12 gap-6 bg-swiss-paper text-swiss-black">
        <div className="md:col-span-6 font-sans text-sm border-r border-swiss-black/10 pr-6 leading-relaxed">
          <p className="font-bold text-base mb-2">
            Why do plant seeds organize in spirals?
          </p>
          <p className="text-swiss-grey">
            Phyllotaxis is the arrangement of leaves or seeds on a plant stem. To maximize sunlight and minimize overlapping, seeds are packed at a constant angle. The Golden Angle (~137.508°) provides the mathematically optimal packing density because the Golden Ratio is the &quot;most irrational&quot; number.
          </p>
        </div>
        <div className="md:col-span-6 font-mono text-xs text-swiss-grey leading-relaxed flex flex-col justify-between">
          <p>
            Equation: θ = n × angle, r = c × √n.
            <br />
            As the divergence angle deviates from the Golden Angle even by 0.1°, the uniform packing collapses, creating empty gaps and dominant lines.
          </p>
          <div className="mt-2 text-swiss-black font-bold">
            Interact with the sliders or presets below to see the mathematical structure of plants collapse and reorganize.
          </div>
        </div>
      </section>

      {/* THREE PANEL GRID */}
      {/* 1. Left Control Panel - Column 1 to 4 */}
      <div className="col-span-12 lg:col-span-4 swiss-border-r swiss-border-b lg:border-b-0 flex flex-col bg-swiss-paper">
        {/* Presets Subsection */}
        <div className="p-6 swiss-border-b">
          <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey block mb-3">
            01 / Compare Presets
          </span>
          <div className="space-y-3">
            {PRESETS.map((preset, idx) => {
              const active = Math.abs(angle - preset.angle) < 0.005;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(false);
                    updateAngle(preset.angle);
                  }}
                  className={`w-full text-left p-3 border transition-all ${
                    active
                      ? 'bg-swiss-black border-swiss-black text-swiss-paper'
                      : 'bg-swiss-paper border-swiss-black/20 hover:border-swiss-black text-swiss-black hover:bg-swiss-lightgrey/20'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm uppercase tracking-tight">{preset.name}</span>
                    <span className="font-mono text-xs font-bold">{preset.angle.toFixed(3)}°</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Subsection */}
        <div className="p-6 space-y-6 flex-1">
          <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey block">
            02 / Interactive Controls
          </span>

          {/* Divergence Angle Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="uppercase tracking-wider">Divergence Angle</span>
              <span className="font-bold text-swiss-red text-sm">{angle.toFixed(3)}°</span>
            </div>
            <input
              type="range"
              min="110"
              max="145"
              step="0.001"
              value={angle}
              onChange={(e) => {
                setIsAnimating(false);
                updateAngle(parseFloat(e.target.value));
              }}
              className="w-full accent-swiss-red cursor-ew-resize bg-swiss-lightgrey h-1"
            />
            {/* Fine tuning panel */}
            <div className="grid grid-cols-4 gap-1 pt-1 font-mono text-[10px]">
              <button
                onClick={() => handleStepAngle(-0.1)}
                className="border border-swiss-black/20 hover:border-swiss-black py-1 text-center"
              >
                -0.1°
              </button>
              <button
                onClick={() => handleStepAngle(-0.001)}
                className="border border-swiss-black/20 hover:border-swiss-black py-1 text-center"
              >
                -0.001°
              </button>
              <button
                onClick={() => handleStepAngle(0.001)}
                className="border border-swiss-black/20 hover:border-swiss-black py-1 text-center"
              >
                +0.001°
              </button>
              <button
                onClick={() => handleStepAngle(0.1)}
                className="border border-swiss-black/20 hover:border-swiss-black py-1 text-center"
              >
                +0.1°
              </button>
            </div>
            {/* Quick Snap */}
            <button
              onClick={() => {
                setIsAnimating(false);
                updateAngle(137.508);
              }}
              className="w-full mt-2 py-1.5 border border-swiss-red text-swiss-red hover:bg-swiss-red hover:text-white font-mono text-xs uppercase transition-colors font-bold tracking-wider"
            >
              Snap to Golden Angle
            </button>
          </div>

          {/* Seed Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="uppercase tracking-wider">Seed Count</span>
              <span className="font-bold">{seedCount}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="10"
              value={seedCount}
              onChange={(e) => setSeedCount(parseInt(e.target.value))}
              className="w-full accent-swiss-black cursor-ew-resize bg-swiss-lightgrey h-1"
            />
            <div className="flex justify-between text-[9px] font-mono text-swiss-grey">
              <span>100 seeds</span>
              <span>1500 seeds</span>
            </div>
          </div>

          {/* Scale Multiplier Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="uppercase tracking-wider">Spacing / Scale</span>
              <span className="font-bold">{scaleMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={scaleMultiplier}
              onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
              className="w-full accent-swiss-black cursor-ew-resize bg-swiss-lightgrey h-1"
            />
          </div>

          {/* Seed Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="uppercase tracking-wider">Seed Size</span>
              <span className="font-bold">{seedSize} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={seedSize}
              onChange={(e) => setSeedSize(parseFloat(e.target.value))}
              className="w-full accent-swiss-black cursor-ew-resize bg-swiss-lightgrey h-1"
            />
          </div>

          {/* Animation Controls */}
          <div className="pt-4 border-t border-swiss-black/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-swiss-grey">
                Animate Sweep
              </span>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-2 flex items-center gap-2 border font-mono text-xs uppercase font-bold transition-all ${
                  isAnimating
                    ? 'bg-swiss-red border-swiss-red text-white'
                    : 'bg-swiss-black border-swiss-black text-swiss-paper hover:bg-swiss-red hover:border-swiss-red'
                }`}
              >
                {isAnimating ? <Pause size={14} /> : <Play size={14} />}
                {isAnimating ? 'Stop Sweep' : 'Start Sweep'}
              </button>
            </div>
            
            {isAnimating && (
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-swiss-grey">
                  <span>Sweep Speed</span>
                  <span>{animationSpeed.toFixed(4)}°/f</span>
                </div>
                <input
                  type="range"
                  min="0.0005"
                  max="0.01"
                  step="0.0005"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-swiss-red cursor-ew-resize bg-swiss-lightgrey h-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Middle Canvas Panel - Column 5 to 9 */}
      <div className="col-span-12 lg:col-span-5 swiss-border-r swiss-border-b lg:border-b-0 flex flex-col justify-between bg-swiss-paper">
        {/* Canvas Section */}
        <div className="p-6 swiss-border-b bg-swiss-paper flex-1 flex items-center justify-center">
          <PhyllotaxisCanvas
            angle={angle}
            seedCount={seedCount}
            scaleMultiplier={scaleMultiplier}
            seedSize={seedSize}
            onHoverSeed={setHoveredSeed}
          />
        </div>

        {/* Hover / Status Section */}
        <div className="p-6 bg-swiss-black text-swiss-paper font-mono text-xs grid grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] text-swiss-lightgrey/60 block uppercase">
              Hovered Seed
            </span>
            <span className="font-bold text-sm">
              {hoveredSeed ? `#${hoveredSeed.index}` : 'None'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-swiss-lightgrey/60 block uppercase">
              Radius (r)
            </span>
            <span className="font-bold text-sm">
              {hoveredSeed ? hoveredSeed.r.toFixed(1) : '-'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-swiss-lightgrey/60 block uppercase">
              Normalized Theta (θ)
            </span>
            <span className="font-bold text-sm text-swiss-red">
              {hoveredSeed ? `${hoveredSeed.theta.toFixed(1)}°` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Right Math Panel - Column 10 to 12 */}
      <div className="col-span-12 lg:col-span-3 flex flex-col bg-swiss-paper">
        <MathPanel
          angle={angle}
        />
      </div>

      {/* INFO DIALOG / MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-swiss-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-swiss-paper border border-swiss-black text-swiss-black max-w-lg w-full p-8 space-y-6 relative">
            <button 
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 font-mono text-lg hover:text-swiss-red"
            >
              ✕
            </button>
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-wider text-swiss-red font-bold">
                Educational Primer
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tight">
                Phyllotaxis & The Golden Angle
              </h3>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-swiss-grey font-sans">
              <p>
                In botany, <strong>phyllotaxis</strong> describes the arrangement of leaves, seeds, or flowers on a plant stem. Sunflowers, pinecones, and pineapples display gorgeous spiral patterns that follow strict mathematical coordinates.
              </p>
              <p>
                A simple model developed by H. Vogel describes this layout:
                <br />
                <code className="font-mono text-xs block p-2 bg-swiss-lightgrey/55 text-swiss-black mt-1">
                  θ = n * divergence_angle
                  <br />
                  r = c * √n
                </code>
              </p>
              <p>
                If the angle is a simple fraction like 135° (which is 3/8 of 360°), then after exactly 8 seeds, the pattern aligns radially, leaving huge gaps of unused space.
              </p>
              <p>
                To avoid gaps, the plant must use an angle whose ratio is as far from any rational number as possible. In number theory, the <strong>Golden Ratio (φ ≈ 1.618)</strong> is the &quot;most irrational&quot; number because its continued fraction is composed entirely of 1s—which represents the slowest possible convergence. 
              </p>
              <p>
                The Golden Angle is calculated by dividing 360° by the golden ratio square: 
                <br />
                <span className="font-mono font-bold text-swiss-black">360° / φ² ≈ 137.508°</span>.
              </p>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-3 bg-swiss-black text-white hover:bg-swiss-red transition-colors font-mono text-xs uppercase font-bold"
            >
              Close and Explore
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
