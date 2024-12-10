export enum VisualizerType {
  Waveform = 'waveform',
  Frequency = 'frequency',
  Circular = 'circular',
}

export interface AudioVisualizerProps {
  audioUrl?: string;
  useMicrophone?: boolean;
  width?: number;
  height?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  gradientColors?: string[];
  barWidth?: number;
  barSpacing?: number;
  barRadius?: number;
  smoothingTimeConstant?: number;
  animationSpeed?: number;
  fftSize?: number;
  minDecibels?: number;
  maxDecibels?: number;
  onAudioLoad?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface AudioContextState {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  source: AudioBufferSourceNode | MediaStreamAudioSourceNode | null;
}

export interface VisualizerStyle {
  container: React.CSSProperties;
  canvas: React.CSSProperties;
} 