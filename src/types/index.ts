export type VisualizerType = 'waveform' | 'frequency' | 'circular';

export interface AudioVisualizerProps {
  // Audio source configuration
  audioUrl?: string;
  useMicrophone?: boolean;
  
  // Visualization type and configuration
  type: VisualizerType;
  width?: number;
  height?: number;
  
  // Styling options
  backgroundColor?: string;
  foregroundColor?: string;
  gradientColors?: string[];
  
  // Bar configuration (for frequency and waveform)
  barWidth?: number;
  barSpacing?: number;
  barRadius?: number;
  
  // Animation configuration
  smoothingTimeConstant?: number;
  animationSpeed?: number;
  
  // Audio analysis configuration
  fftSize?: number;
  minDecibels?: number;
  maxDecibels?: number;
  
  // Callbacks
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