import React, { useState } from 'react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { FrequencyVisualizer } from './FrequencyVisualizer';
import { CircularVisualizer } from './CircularVisualizer';
import { VisualizerType } from '../types';

const Playground: React.FC = () => {
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('waveform');
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('/sample-audio.mp3');

  const commonProps = {
    width: 800,
    height: 400,
    useMicrophone,
    audioUrl: useMicrophone ? undefined : audioUrl,
    backgroundColor: '#000000',
    foregroundColor: '#00ff00',
    gradientColors: ['#ff0000', '#00ff00', '#0000ff'],
    type: visualizerType
  };

  const renderVisualizer = () => {
    switch (visualizerType) {
      case 'waveform':
        return <WaveformVisualizer {...commonProps} />;
      case 'frequency':
        return <FrequencyVisualizer {...commonProps} />;
      case 'circular':
        return <CircularVisualizer {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={visualizerType}
          onChange={(e) => setVisualizerType(e.target.value as VisualizerType)}
          style={{ marginRight: '10px' }}
        >
          <option value="waveform">Waveform</option>
          <option value="frequency">Frequency</option>
          <option value="circular">Circular</option>
        </select>

        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={useMicrophone}
            onChange={(e) => setUseMicrophone(e.target.checked)}
          />
          Use Microphone
        </label>

        {!useMicrophone && (
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="Enter audio URL"
            style={{ width: '300px' }}
          />
        )}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        {renderVisualizer()}
      </div>
    </div>
  );
};

export default Playground; 