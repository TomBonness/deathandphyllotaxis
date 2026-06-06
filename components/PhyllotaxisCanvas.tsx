import React, { useRef, useEffect, useState } from 'react';

interface Seed {
  index: number;
  x: number;
  y: number;
  r: number;
  theta: number; // in degrees
}

interface PhyllotaxisCanvasProps {
  angle: number;
  seedCount: number;
  scaleMultiplier: number;
  seedSize: number;
  highlightedSpiral: number | null;
  onHoverSeed?: (seed: { index: number; r: number; theta: number } | null) => void;
}

export default function PhyllotaxisCanvas({
  angle,
  seedCount,
  scaleMultiplier,
  seedSize,
  highlightedSpiral,
  onHoverSeed,
}: PhyllotaxisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const [hoveredSeed, setHoveredSeed] = useState<Seed | null>(null);
  const [seeds, setSeeds] = useState<Seed[]>([]);

  // Track container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Keep it square or fit container
        const size = Math.max(Math.min(width, height, 800), 300);
        setDimensions({ width: size, height: size });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute seed positions when params change
  useEffect(() => {
    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    
    // Auto-scale factor based on dimensions and seed count
    const maxRadius = Math.min(width, height) * 0.45;
    const baseScale = maxRadius / Math.sqrt(seedCount);
    const scale = baseScale * scaleMultiplier;

    const angleRad = (angle * Math.PI) / 180;
    const newSeeds: Seed[] = [];

    for (let n = 0; n < seedCount; n++) {
      const theta = n * angleRad;
      const r = scale * Math.sqrt(n);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);

      newSeeds.push({
        index: n,
        x,
        y,
        r,
        theta: (n * angle) % 360,
      });
    }

    setSeeds(newSeeds);
  }, [angle, seedCount, scaleMultiplier, dimensions]);

  // Handle canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw grid background if highlighted
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    
    // Draw concentric circles to guide the eye
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.45;
    for (let r = maxRadius / 5; r <= maxRadius; r += maxRadius / 5) {
      ctx.beginPath();
      ctx.arc(dimensions.width / 2, dimensions.height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw spiral lines first (behind seeds)
    if (highlightedSpiral !== null && highlightedSpiral > 0 && seeds.length > 0) {
      ctx.strokeStyle = '#e62217'; // Swiss Red
      ctx.lineWidth = 1.5;
      
      const q = highlightedSpiral;
      // There are q spiral families. For each family index i from 0 to q-1
      for (let i = 0; i < q; i++) {
        ctx.beginPath();
        let first = true;
        for (let n = i; n < seeds.length; n += q) {
          const seed = seeds[n];
          if (first) {
            ctx.moveTo(seed.x, seed.y);
            first = false;
          } else {
            ctx.lineTo(seed.x, seed.y);
          }
        }
        ctx.stroke();
      }
    }

    // Draw seeds
    seeds.forEach((seed) => {
      const isHighlighted = highlightedSpiral !== null && seed.index % highlightedSpiral === 0;
      const isHovered = hoveredSeed && hoveredSeed.index === seed.index;

      ctx.beginPath();
      ctx.arc(seed.x, seed.y, seedSize * (isHovered ? 1.8 : 1), 0, Math.PI * 2);
      
      if (isHovered) {
        ctx.fillStyle = '#e62217'; // Swiss Red
        ctx.fill();
        // Outer ring for hover
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (isHighlighted) {
        ctx.fillStyle = '#e62217'; // Highlighted family in red
        ctx.fill();
      } else {
        ctx.fillStyle = '#000000'; // Default seeds in black
        ctx.fill();
      }
    });

    // Draw center indicator
    ctx.beginPath();
    ctx.arc(dimensions.width / 2, dimensions.height / 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#e62217';
    ctx.fill();

  }, [dimensions, seeds, seedSize, highlightedSpiral, hoveredSeed]);

  // Handle mouse moves to detect hovered seed
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find closest seed
    let closestSeed: Seed | null = null;
    let minDistance = 15; // Hover tolerance radius in pixels

    for (const seed of seeds) {
      const dist = Math.hypot(seed.x - x, seed.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closestSeed = seed;
      }
    }

    if (closestSeed !== hoveredSeed) {
      setHoveredSeed(closestSeed);
      if (onHoverSeed) {
        onHoverSeed(closestSeed ? { 
          index: closestSeed.index, 
          r: closestSeed.r, 
          theta: closestSeed.theta 
        } : null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredSeed(null);
    if (onHoverSeed) {
      onHoverSeed(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] flex items-center justify-center bg-swiss-paper relative"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair block max-w-full"
        style={{ width: dimensions.width, height: dimensions.height }}
      />
      
      {/* Tiny overlay info in Swiss style */}
      <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-swiss-black bg-swiss-paper border border-swiss-black px-2 py-1 select-none pointer-events-none">
        Canvas: {dimensions.width}x{dimensions.height} px
      </div>
    </div>
  );
}
