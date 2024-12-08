import React, { useRef, useEffect } from 'react';
import { AudioVisualizerProps } from '../types';
import { useAudioContext } from '../hooks/useAudioContext';
import styled from '@emotion/styled';

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Container = styled.div<{ backgroundColor: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
`;

export const FrequencyVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  useMicrophone,
  width = 800,
  height = 200,
  backgroundColor = '#000000',
  foregroundColor = '#00ff00',
  gradientColors,
  barWidth = 4,
  barSpacing = 1,
  barRadius = 2,
  smoothingTimeConstant = 0.8,
  fftSize = 2048,
  minDecibels = -90,
  maxDecibels = -10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioState = useAudioContext(
    audioUrl,
    useMicrophone,
    fftSize,
    smoothingTimeConstant,
    minDecibels,
    maxDecibels
  );
  const animationFrameId = useRef<number | null>(null);

  const createGradient = (ctx: CanvasRenderingContext2D) => {
    if (!gradientColors || gradientColors.length < 2) return foregroundColor;

    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    const step = 1 / (gradientColors.length - 1);
    
    gradientColors.forEach((color, index) => {
      gradient.addColorStop(index * step, color);
    });

    return gradient;
  };

  const draw = () => {
    if (!canvasRef.current || !audioState.analyser || !audioState.dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = audioState.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audioState.analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const barCount = Math.min(bufferLength, Math.floor(width / (barWidth + barSpacing)));
    const totalWidth = barCount * (barWidth + barSpacing);
    const startX = (width - totalWidth) / 2;

    ctx.fillStyle = createGradient(ctx);

    for (let i = 0; i < barCount; i++) {
      const barHeight = (dataArray[i] / 255.0) * height;
      const x = startX + i * (barWidth + barSpacing);
      const y = height - barHeight;

      if (barRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barRadius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
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
  }, [audioState]);

  return (
    <Container backgroundColor={backgroundColor}>
      <Canvas ref={canvasRef} />
    </Container>
  );
}; 