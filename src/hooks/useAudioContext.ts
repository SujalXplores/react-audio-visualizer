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

  const initializeAudioContext = useCallback(async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      if (useMicrophone) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        setAudioState({
          audioContext,
          analyser,
          dataArray,
          source,
        });
      } else if (audioUrl) {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          source.start(0);
  
          setAudioState({
            audioContext,
            analyser,
            dataArray,
            source,
          });
        } catch (decodeError) {
          console.error('Error decoding audio data:', decodeError);
        }
      }
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, [audioUrl, useMicrophone, fftSize, smoothingTimeConstant, minDecibels, maxDecibels]);

  const cleanup = useCallback(() => {
    if (audioState.source) {
      if (audioState.source instanceof AudioBufferSourceNode) {
        audioState.source.stop();
      }
      audioState.source.disconnect();
    }
    if (audioState.analyser) {
      audioState.analyser.disconnect();
    }
    if (audioState.audioContext) {
      audioState.audioContext.close();
    }
  }, [audioState]);

  useEffect(() => {
    initializeAudioContext();
    return () => {
      cleanup();
    };
  }, [initializeAudioContext]);

  return audioState;
}; 