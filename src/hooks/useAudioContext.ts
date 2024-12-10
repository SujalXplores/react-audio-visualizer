import { useState, useEffect, useCallback } from 'react';
import { AudioContextState } from '../types';

export const useAudioContext = (
  audioUrl?: string,
  useMicrophone?: boolean,
  fftSize: number = 2048,
  smoothingTimeConstant: number = 0.8,
  minDecibels: number = -90,
  maxDecibels: number = -10,
) => {
  const [audioState, setAudioState] = useState<AudioContextState>({
    audioContext: null,
    analyser: null,
    dataArray: null,
    source: null,
  });

  const createAnalyser = (audioContext: AudioContext) => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothingTimeConstant;
    analyser.minDecibels = minDecibels;
    analyser.maxDecibels = maxDecibels;
    return analyser;
  };

  const handleMicrophoneInput = async (audioContext: AudioContext, analyser: AnalyserNode) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    setAudioState({ audioContext, analyser, dataArray: new Uint8Array(analyser.frequencyBinCount), source });
  };

  const handleAudioUrlInput = async (audioContext: AudioContext, analyser: AnalyserNode) => {
    const response = await fetch(audioUrl!);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start(0);
    setAudioState({ audioContext, analyser, dataArray: new Uint8Array(analyser.frequencyBinCount), source });
  };

  const inputHandlers = {
    microphone: handleMicrophoneInput,
    audioUrl: handleAudioUrlInput,
  };

  const initializeAudioContext = useCallback(async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = createAnalyser(audioContext);

      const inputType = useMicrophone ? 'microphone' : 'audioUrl';
      const handler = inputHandlers[inputType];

      if (handler) {
        await handler(audioContext, analyser);
      }
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, [audioUrl, useMicrophone, fftSize, smoothingTimeConstant, minDecibels, maxDecibels]);

  const cleanup = useCallback(() => {
    const stopSource = (source: AudioNode | null) => {
      if (source instanceof AudioBufferSourceNode) {
        source.stop();
      }
    };

    const disconnectNode = (node: AudioNode | null) => {
      node?.disconnect();
    };

    const closeContext = (context: AudioContext | null) => {
      context?.close();
    };

    stopSource(audioState.source);
    disconnectNode(audioState.source);
    disconnectNode(audioState.analyser);
    closeContext(audioState.audioContext);
  }, [audioState]);

  useEffect(() => {
    initializeAudioContext();
    return () => cleanup();
  }, [initializeAudioContext]);

  return audioState;
}; 