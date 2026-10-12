import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "../../store/settingsStore";

export type AmbientScene = "Coffee Shop" | "Rain" | "Night";

interface AmbientNodes {
  context: AudioContext;
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
}

function createNoiseBuffer(context: AudioContext, scene: AmbientScene): AudioBuffer {
  const length = context.sampleRate * 2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let brown = 0;

  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1;
    if (scene === "Rain") {
      data[index] = white * 0.35;
    } else if (scene === "Night") {
      brown = (brown + 0.01 * white) / 1.01;
      data[index] = brown * 2.4;
    } else {
      brown = (brown + 0.02 * white) / 1.02;
      data[index] = brown * 3.2;
    }
  }

  return buffer;
}

function sceneFrequency(scene: AmbientScene): number {
  if (scene === "Rain") return 1400;
  if (scene === "Night") return 280;
  return 620;
}

export function useAmbient() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const [scene, setScene] = useState<AmbientScene>("Coffee Shop");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const nodes = useRef<AmbientNodes | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const stop = () => {
    const current = nodes.current;
    if (!current) return;
    try {
      current.source.stop();
    } catch {
      // The source may already have stopped.
    }
    void current.context.close();
    nodes.current = null;
  };

  useEffect(() => {
    if (!playing || !soundEnabled) {
      stop();
      return;
    }

    try {
      const context = new AudioContext();
      const source = context.createBufferSource();
      source.buffer = createNoiseBuffer(context, scene);
      source.loop = true;

      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = sceneFrequency(scene);

      const gain = context.createGain();
      gain.gain.value = volumeRef.current * 0.12;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
      nodes.current = { context, source, filter, gain };
    } catch {
      setPlaying(false);
    }

    return () => {
      stop();
    };
  }, [playing, scene, soundEnabled]);

  useEffect(() => {
    if (nodes.current) {
      nodes.current.gain.gain.value = volume * 0.12;
    }
  }, [volume]);

  useEffect(() => () => stop(), []);

  return {
    scene,
    setScene,
    playing: playing && soundEnabled,
    setPlaying,
    volume,
    setVolume,
    soundEnabled,
  };
}
