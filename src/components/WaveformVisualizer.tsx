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

export const WaveformVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  useMicrophone,
  width = 800,
  height = 200,
  backgroundColor = '#1a1a2e',
  foregroundColor = '#4CAF50',
  barWidth = 3,
  barSpacing = 1,
  barRadius = 0,
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

  const draw = () => {
    if (!canvasRef.current || !audioState.analyser || !audioState.dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = audioState.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audioState.analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = barWidth;
    ctx.strokeStyle = foregroundColor;
    ctx.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

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