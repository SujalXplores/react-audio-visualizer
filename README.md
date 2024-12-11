  <h1>🎧 React Audio Visualizer</h1>
  
  <p>
    <strong>A customizable React package for real-time audio visualization, supporting multiple visualization types and audio sources</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
  
  <!-- Add badges here -->
  <p>
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/SujalXplores/react-audio-visualizer-pro?style=social"/>
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/SujalXplores/react-audio-visualizer-pro?style=social"/>
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/SujalXplores/react-audio-visualizer-pro"/>
    <img alt="GitHub license" src="https://img.shields.io/github/license/SujalXplores/react-audio-visualizer-pro"/>
  </p>

## ✨ Features

- 🎨 Multiple visualization types (waveform, frequency bars, circular)
- 🎤 Support for both audio file playback and microphone input
- ⚡️ Smooth animations with efficient canvas rendering
- 📱 Fully responsive design
- 📝 TypeScript support with complete type definitions
- 🎨 Customizable styles, colors, and animations
- 🔊 Built with Web Audio API for high-performance audio processing

## 🛠️ Installation

```bash
npm install react-audio-visualizer-pro
# or
yarn add react-audio-visualizer-pro
```

## Usage Examples

### Basic Audio File Visualization

```tsx
import { WaveformVisualizer } from 'react-audio-visualizer-pro';

function App() {
  return (
    <WaveformVisualizer
      audioUrl="/path/to/audio.mp3"
      width={800}
      height={200}
      backgroundColor="#000000"
    />
  );
}
```

### Microphone Input with Frequency Bars

```tsx
import { FrequencyVisualizer } from 'react-audio-visualizer-pro';

function App() {
  return (
    <FrequencyVisualizer
      useMicrophone={true}
      width={800}
      height={200}
      backgroundColor="#000"
      gradientColors={['#ff0000', '#00ff00', '#0000ff']}
      barWidth={4}
      barSpacing={1}
      barRadius={2}
    />
  );
}
```

### Circular Visualization with Custom Animation

```tsx
import { CircularVisualizer } from 'react-audio-visualizer-pro';

function App() {
  return (
    <CircularVisualizer
      audioUrl="/path/to/audio.mp3"
      width={800}
      height={800}
      backgroundColor="#000"
      animationSpeed={1.5}
      barWidth={2}
    />
  );
}
```

## API Reference

### Common Props

All visualizer components accept these common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| audioUrl | string | undefined | URL to the audio file to visualize |
| useMicrophone | boolean | false | Use microphone input instead of audio file |
| width | number | 800 | Canvas width in pixels |
| height | number | 200 | Canvas height in pixels |
| backgroundColor | string | '#1a1a2e' | Background color of the visualizer |
| gradientColors | string[] | ['#00bcd4', '#4CAF50', '#8BC34A'] | Array of colors for gradient effect |
| barWidth | number | 3 | Width of visualization bars |
| barSpacing | number | 2 | Spacing between bars (frequency only) |
| barRadius | number | 0 | Border radius of bars (frequency only) |
| smoothingTimeConstant | number | 0.8 | Audio analysis smoothing (0-1) |
| fftSize | number | 2048 | FFT size for frequency analysis |
| minDecibels | number | -90 | Minimum decibel value |
| maxDecibels | number | -10 | Maximum decibel value |
| animationSpeed | number | 1 | Animation speed multiplier (circular only) |

### Component-Specific Features

#### WaveformVisualizer
- Displays audio waveform in real-time
- Best for viewing audio amplitude over time
- Smooth line rendering with customizable thickness

#### FrequencyVisualizer
- Shows frequency spectrum as vertical bars
- Support for gradient colors
- Customizable bar width, spacing, and radius

#### CircularVisualizer
- Circular frequency visualization
- Rotating animation with adjustable speed
- Radial gradient support

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the package: `npm run build`
4. Run tests: `npm test`

## License

MIT
