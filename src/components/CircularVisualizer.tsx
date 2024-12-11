import React, { useRef, useEffect } from 'react';
import { AudioVisualizerProps } from '../types';
import { useAudioContext } from '../hooks/useAudioContext';
import { createGradient } from '../utils';
import { Canvas, Container } from './StyledComponents';

export const CircularVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  useMicrophone,
  width = 800,
  height = 800,
  backgroundColor = '#1a1a2e',
  gradientColors = ['#00bcd4', '#4CAF50', '#8BC34A'],
  barWidth = 3,
  smoothingTimeConstant = 0.8,
  fftSize = 2048,
  minDecibels = -90,
  maxDecibels = -10,
  animationSpeed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioState = useAudioContext(audioUrl, useMicrophone, fftSize, smoothingTimeConstant, minDecibels, maxDecibels);
  const animationFrameId = useRef<number | null>(null);
  const rotation = useRef(0);

  const draw = () => {
    if (!canvasRef.current || !audioState.analyser || !audioState.dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = audioState.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audioState.analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const bars = Math.min(bufferLength, 360);
    const angleStep = (2 * Math.PI) / bars;

    rotation.current += 0.002 * animationSpeed;
    if (rotation.current >= 2 * Math.PI) {
      rotation.current = 0;
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation.current);

    for (let i = 0; i < bars; i++) {
      const angle = i * angleStep;
      const magnitude = dataArray[i] / 255.0;
      const barHeight = magnitude * radius;

      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle) * (radius + barHeight);
      const y2 = Math.sin(angle) * (radius + barHeight);

      ctx.strokeStyle = createGradient(ctx, 'radial', gradientColors, width, height, radius + barHeight);
      ctx.lineWidth = barWidth;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();

    animationFrameId.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }

    draw();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [audioState, width, height]);

  return (
    <Container backgroundColor={backgroundColor}>
      <Canvas ref={canvasRef} />
    </Container>
  );
}; 