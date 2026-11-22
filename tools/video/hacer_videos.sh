#!/usr/bin/env bash
# Genera los videos completos. Requiere: Python (kokoro-onnx, soundfile, numpy), Node + Playwright, ffmpeg.
#   KOKORO_DIR=/ruta/modelos BUILD=/ruta/build bash tools/video/hacer_videos.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
: "${BUILD:=build}"; export BUILD
python3 tools/video/voces.py intro final clips
for v in intro final; do
  python3 tools/video/mezcla.py "$v"
  node tools/video/render.js "$BUILD/$v.json" "$BUILD/$v-video.mp4" 24
  ffmpeg -nostdin -y -loglevel error -i "$BUILD/$v-video.mp4" -i "$BUILD/$v-audio.wav" -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart "docs/media/$v.mp4"
  echo "listo docs/media/$v.mp4"
done
