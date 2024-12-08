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

export const CircularVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  useMicrophone,
  width = 800,
  height = 800,
  backgroundColor = '#000000',
  foregroundColor = '#00ff00',
  gradientColors,
  barWidth = 2,
  barSpacing = 1,
  smoothingTimeConstant = 0.8,
  fftSize = 2048,
  minDecibels = -90,
  maxDecibels = -10,
  animationSpeed = 1,
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
  const rotation = useRef(0);

  const createGradient = (ctx: CanvasRenderingContext2D, radius: number) => {
    if (!gradientColors || gradientColors.length < 2) return foregroundColor;

    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      radius
    );

    gradientColors.forEach((color, index) => {
      gradient.addColorStop(index / (gradientColors.length - 1), color);
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

      ctx.strokeStyle = createGradient(ctx, radius + barHeight);
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
  }, [audioState]);

  return (
    <Container backgroundColor={backgroundColor}>
      <Canvas ref={canvasRef} />
    </Container>
  );
}; 