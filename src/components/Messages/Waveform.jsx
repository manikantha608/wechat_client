import React, { useEffect, useRef, useState } from 'react';
import AudioFile from "../../assets/audio/file_example.mp3";
import { Play, Pause } from "@phosphor-icons/react";
import Wavesurfer from "wavesurfer.js";

export default function Waveform(props) {
  const { incoming } = props;
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (waveformRef.current) {
      const ws = Wavesurfer.create({
        container: waveformRef.current,
        waveColor: "#3C50E0",
        progressColor: "80CAEE",
        url: AudioFile,
        renderFunction: (channels, ctx) => {
          const { width, height } = ctx.canvas;
          const scale = channels[0].length / width;
          const step = 6;

          ctx.translate(0, height / 2);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();

          for (let i = 0; i < width; i += step * 2) {
            const index = Math.floor(i * scale);
            const value = Math.abs(channels[0][index]);
            let x = i;
            let y = value * height;

            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
            ctx.lineTo(x + step, 0);

            x = x + step;
            y = -y;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
            ctx.lineTo(x + step, 0);
          }

          ctx.stroke();
          ctx.closePath();
        }
      });

      ws.on("ready", () => {
        const totalDuration = ws.getDuration();
        setDuration(formatTime(totalDuration));
      });

      ws.on("audioprocess", () => {
        const current = ws.getCurrentTime(); // Fix for current time
        setCurrentTime(formatTime(current));
      });

      ws.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(formatTime(0));
      });

      setWavesurfer(ws);

      return () => {
        ws.destroy();
      };
    }
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
      setIsPlaying(!isPlaying); // Toggle the isPlaying state
    }
  };

  return (
    <div className={`flex flex-row items-center space-x-6 p-2 rounded-md ${!incoming ? "bg-transparent" : "bg-gray dark:bg-boxdark"}`}>
      <button onClick={handlePlayPause} className="bg-gray dark:bg-boxdark-2 rounded-full h-18 w-18 flex items-center justify-center shadow-2">
        {isPlaying ? <Pause size={24} weight="bold" /> : <Play size={24} weight="bold" />}
      </button>
      <div className="grow flex flex-col space-y-1">
        <div className="w-full !z-0" ref={waveformRef} style={{ overflow: "hidden" }}></div>
        <div className="text-sm">{currentTime}/{duration}</div>
      </div>
    </div>
  );
}
