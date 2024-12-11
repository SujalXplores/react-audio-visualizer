import React, { useRef, useEffect } from 'react';
import { AudioVisualizerProps } from '../types';
import { useAudioContext } from '../hooks/useAudioContext';
import { Canvas, Container } from './StyledComponents';
import { createGradient } from '@/utils';

export const FrequencyVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  useMicrophone,
  width = 800,
  height = 200,
  backgroundColor = '#1a1a2e',
  gradientColors = ['#00bcd4', '#4CAF50', '#8BC34A'],
  barWidth = 6,
  barSpacing = 2,
  smoothingTimeConstant = 0.8,
  fftSize = 2048,
  minDecibels = -90,
  maxDecibels = -10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioState = useAudioContext(audioUrl, useMicrophone, fftSize, smoothingTimeConstant, minDecibels, maxDecibels);
  const animationFrameId = useRef<number | null>(null);

  const draw = () => {
    if (!canvasRef.current || !audioState.analyser || !audioState.dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = audioState.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audioState.analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    const barCount = Math.min(bufferLength, Math.floor(width / (barWidth + barSpacing)));
    const totalWidth = barCount * (barWidth + barSpacing);
    const startX = (width - totalWidth) / 2;

    ctx.fillStyle = createGradient(ctx, 'linear', gradientColors, width, height);

    for (let i = 0; i < barCount; i++) {
      const barHeight = (dataArray[i] / 255.0) * height;
      const x = startX + i * (barWidth + barSpacing);
      const y = height - barHeight;

      ctx.fillRect(x, y, barWidth, barHeight);
    }

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