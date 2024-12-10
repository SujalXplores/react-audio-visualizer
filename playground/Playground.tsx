import React, { useMemo, useCallback, useEffect, useReducer } from "react";
import { CircularVisualizer, FrequencyVisualizer, WaveformVisualizer } from "../src";
import { VisualizerType } from "../src/types";
import styled from "@emotion/styled";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
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
    border-color: #4caf50;
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
  accent-color: #4caf50;
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
    background: #4caf50;
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

const ColorInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

interface State {
  visualizerType: VisualizerType;
  useMicrophone: boolean;
  audioFile: File | null;
  backgroundColor: string;
  foregroundColor: string;
  barWidth: number;
  barSpacing: number;
  barRadius: number;
  smoothingTimeConstant: number;
  animationSpeed: number;
}

const initialState: State = {
  visualizerType: "waveform" as VisualizerType,
  useMicrophone: false,
  audioFile: null,
  backgroundColor: "#1a1a2e",
  foregroundColor: "#4CAF50",
  barWidth: 3,
  barSpacing: 1,
  barRadius: 4,
  smoothingTimeConstant: 0.8,
  animationSpeed: 1,
};

function reducer(state: State, action: { type: string; payload: any }) {
  switch (action.type) {
    case "SET_VISUALIZER_TYPE":
      return { ...state, visualizerType: action.payload };
    case "SET_USE_MICROPHONE":
      return { ...state, useMicrophone: action.payload };
    case "SET_AUDIO_FILE":
      return { ...state, audioFile: action.payload };
    case "SET_BACKGROUND_COLOR":
      return { ...state, backgroundColor: action.payload };
    case "SET_FOREGROUND_COLOR":
      return { ...state, foregroundColor: action.payload };
    case "SET_BAR_WIDTH":
      return { ...state, barWidth: action.payload };
    case "SET_BAR_SPACING":
      return { ...state, barSpacing: action.payload };
    case "SET_BAR_RADIUS":
      return { ...state, barRadius: action.payload };
    case "SET_SMOOTHING_TIME_CONSTANT":
      return { ...state, smoothingTimeConstant: action.payload };
    case "SET_ANIMATION_SPEED":
      return { ...state, animationSpeed: action.payload };
    default:
      return state;
  }
}

const Playground: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("audio/")) {
        dispatch({ type: "SET_AUDIO_FILE", payload: file });
      }
    },
    []
  );

  const audioUrl = useMemo(() => {
    return state.audioFile ? URL.createObjectURL(state.audioFile) : "";
  }, [state.audioFile]);

  const commonProps = useMemo(
    () => ({
      width: 800,
      height: 400,
      useMicrophone: state.useMicrophone,
      audioUrl: state.useMicrophone ? undefined : audioUrl,
      backgroundColor: state.backgroundColor,
      foregroundColor: state.foregroundColor,
      gradientColors: ["#00bcd4", state.foregroundColor, "#8BC34A"],
      barWidth: state.barWidth,
      barSpacing: state.barSpacing,
      barRadius: state.barRadius,
      smoothingTimeConstant: state.smoothingTimeConstant,
      animationSpeed: state.animationSpeed,
      type: state.visualizerType,
    }),
    [state, audioUrl]
  );

  const visualizers = useMemo(
    () => ({
      waveform: <WaveformVisualizer {...commonProps} />,
      frequency: <FrequencyVisualizer {...commonProps} />,
      circular: <CircularVisualizer {...commonProps} />,
    }),
    [commonProps]
  );

  const visualizerType = state.visualizerType as keyof typeof visualizers;

  useEffect(() => {
    return () => {
      if (state.audioFile) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [state.audioFile, audioUrl]);

  return (
    <Container>
      <Controls>
        <ControlGroup>
          <ControlLabel>Visualization Type</ControlLabel>
          <Select
            value={state.visualizerType}
            onChange={(e) =>
              dispatch({
                type: "SET_VISUALIZER_TYPE",
                payload: e.target.value as VisualizerType,
              })
            }
            title="Choose visualization type"
          >
            <option value="waveform">Waveform</option>
            <option value="frequency">Frequency</option>
            <option value="circular">Circular</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Colors</ControlLabel>
          <ColorInputContainer>
            <ColorInput
              type="color"
              value={state.backgroundColor}
              onChange={(e) =>
                dispatch({
                  type: "SET_BACKGROUND_COLOR",
                  payload: e.target.value,
                })
              }
              title="Background Color"
            />
            <ColorInput
              type="color"
              value={state.foregroundColor}
              onChange={(e) =>
                dispatch({
                  type: "SET_FOREGROUND_COLOR",
                  payload: e.target.value,
                })
              }
              title="Foreground Color"
            />
          </ColorInputContainer>
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Bar Width: {state.barWidth}px</ControlLabel>
          <RangeInput
            type="range"
            min="1"
            max="20"
            value={state.barWidth}
            onChange={(e) =>
              dispatch({
                type: "SET_BAR_WIDTH",
                payload: Number(e.target.value),
              })
            }
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Bar Spacing: {state.barSpacing}px</ControlLabel>
          <RangeInput
            type="range"
            min="0"
            max="10"
            value={state.barSpacing}
            onChange={(e) =>
              dispatch({
                type: "SET_BAR_SPACING",
                payload: Number(e.target.value),
              })
            }
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>Bar Radius: {state.barRadius}px</ControlLabel>
          <RangeInput
            type="range"
            min="0"
            max="20"
            value={state.barRadius}
            onChange={(e) =>
              dispatch({
                type: "SET_BAR_RADIUS",
                payload: Number(e.target.value),
              })
            }
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel>
            Smoothing: {state.smoothingTimeConstant.toFixed(2)}
          </ControlLabel>
          <RangeInput
            type="range"
            min="0"
            max="0.99"
            step="0.01"
            value={state.smoothingTimeConstant}
            onChange={(e) =>
              dispatch({
                type: "SET_SMOOTHING_TIME_CONSTANT",
                payload: Number(e.target.value),
              })
            }
          />
        </ControlGroup>

        {state.visualizerType === "circular" && (
          <ControlGroup>
            <ControlLabel>
              Animation Speed: {state.animationSpeed.toFixed(1)}x
            </ControlLabel>
            <RangeInput
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={state.animationSpeed}
              onChange={(e) =>
                dispatch({
                  type: "SET_ANIMATION_SPEED",
                  payload: Number(e.target.value),
                })
              }
            />
          </ControlGroup>
        )}

        <Label title="Use microphone input instead of audio file">
          <Checkbox
            type="checkbox"
            checked={state.useMicrophone}
            onChange={(e) =>
              dispatch({
                type: "SET_USE_MICROPHONE",
                payload: e.target.checked,
              })
            }
          />
          Use Microphone
        </Label>

        {!state.useMicrophone && (
          <FileLabel>
            {state.audioFile ? state.audioFile.name : "Choose audio file"}
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
