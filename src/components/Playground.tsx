import React, { useState, useMemo, useCallback } from 'react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { FrequencyVisualizer } from './FrequencyVisualizer';
import { CircularVisualizer } from './CircularVisualizer';
import { VisualizerType } from '../types';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: #e6e6e6;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: #e6e6e6;
  font-size: 0.95rem;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    border-color: #4CAF50;
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  option {
    background-color: #1a1a2e;
    color: #e6e6e6;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  color: #e6e6e6;
  font-size: 0.95rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #4CAF50;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  min-width: 250px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #888;
  }

  &:focus {
    border-color: #0066cc;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }

  &::placeholder {
    color: #888;
  }
`;

const VisualizerContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: #e6e6e6;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ColorInput = styled.input`
  width: 50px;
  height: 35px;
  padding: 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: transparent;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
`;

const RangeInput = styled.input`
  -webkit-appearance: none;
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ControlLabel = styled.label`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Playground: React.FC = () => {
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('waveform');
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  // New state for customization
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [foregroundColor, setForegroundColor] = useState('#4CAF50');
  const [barWidth, setBarWidth] = useState(3);
  const [barSpacing, setBarSpacing] = useState(1);
  const [barRadius, setBarRadius] = useState(4);
  const [smoothingTimeConstant, setSmoothingTimeConstant] = useState(0.8);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  }, []);

  const audioUrl = useMemo(() => {
    if (audioFile) {
      return URL.createObjectURL(audioFile);
    }
    return '/sample-audio.mp3';
  }, [audioFile]);

  const commonProps = useMemo(() => ({
    width: 800,
    height: 400,
    useMicrophone,
    audioUrl: useMicrophone ? undefined : audioUrl,
    backgroundColor,
    foregroundColor,
    gradientColors: ['#00bcd4', foregroundColor, '#8BC34A'],
    barWidth,
    barSpacing,
    barRadius,
    smoothingTimeConstant,
    animationSpeed,
    type: visualizerType
  }), [
    visualizerType,
    useMicrophone,
    audioUrl,
    backgroundColor,
    foregroundColor,
    barWidth,
    barSpacing,
    barRadius,
    smoothingTimeConstant,
    animationSpeed
  ]);

  const visualizers = useMemo(() => ({
    waveform: <WaveformVisualizer {...commonProps} />,
    frequency: <FrequencyVisualizer {...commonProps} />,
    circular: <CircularVisualizer {...commonProps} />
  }), [commonProps]);

  // Cleanup URL on unmount or when file changes
  React.useEffect(() => {
    return () => {
      if (audioFile) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioFile, audioUrl]);

  return (
    <Container>
      <Controls>
        <ControlGroup>
          <ControlLabel>Visualization Type</ControlLabel>
          <Select
            value={visualizerType}
            onChange={(e) => setVisualizerType(e.target.value as VisualizerType)}
            title="Choose visualization type"
          >
            <option value="waveform">Waveform</option>
            <option value="frequency">Frequency</option>
            <option value="circular">Circular</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Colors</ControlLabel>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <ColorInput
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              title="Background Color"
            />
            <ColorInput
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              title="Foreground Color"
            />
          </div>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Bar Width: {barWidth}px</ControlLabel>
          <RangeInput
            type="range"
            min="1"
            max="20"
            value={barWidth}
            onChange={(e) => setBarWidth(Number(e.target.value))}
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Bar Spacing: {barSpacing}px</ControlLabel>
          <RangeInput
            type="range"
            min="0"
            max="10"
            value={barSpacing}
            onChange={(e) => setBarSpacing(Number(e.target.value))}
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Bar Radius: {barRadius}px</ControlLabel>
          <RangeInput
            type="range"
            min="0"
            max="20"
            value={barRadius}
            onChange={(e) => setBarRadius(Number(e.target.value))}
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Smoothing: {smoothingTimeConstant.toFixed(2)}</ControlLabel>
          <RangeInput
            type="range"
            min="0"
            max="0.99"
            step="0.01"
            value={smoothingTimeConstant}
            onChange={(e) => setSmoothingTimeConstant(Number(e.target.value))}
          />
        </ControlGroup>

        {visualizerType === 'circular' && (
          <ControlGroup>
            <ControlLabel>Animation Speed: {animationSpeed.toFixed(1)}x</ControlLabel>
            <RangeInput
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            />
          </ControlGroup>
        )}

        <Label title="Use microphone input instead of audio file">
          <Checkbox
            type="checkbox"
            checked={useMicrophone}
            onChange={(e) => setUseMicrophone(e.target.checked)}
          />
          Use Microphone
        </Label>

        {!useMicrophone && (
          <FileLabel>
            {audioFile ? audioFile.name : 'Choose audio file'}
            <FileInput
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              title="Select an audio file to visualize"
            />
          </FileLabel>
        )}
      </Controls>

      <VisualizerContainer>
        {visualizers[visualizerType]}
      </VisualizerContainer>
    </Container>
  );
};

export default Playground; 