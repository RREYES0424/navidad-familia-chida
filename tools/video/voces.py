# -*- coding: utf-8 -*-
"""
Genera las voces (Kokoro TTS) y la línea de tiempo de los videos.

Uso:
  KOKORO_DIR=/ruta/a/modelos BUILD=/ruta/build python3 tools/video/voces.py
Necesita: pip install kokoro-onnx soundfile ; modelos kokoro-v1.0.onnx y voices-v1.0.bin
(https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

sys.path.insert(0, os.path.dirname(__file__))
from guion import INTRO, FINAL, CLIPS

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
KDIR = os.environ.get('KOKORO_DIR', '.')
BUILD = os.environ.get('BUILD', os.path.join(RAIZ, 'build'))
SR = 24000
GAP = 0.35  # silencio entre frases de la misma escena

VOCES = {
    'N': dict(voice='ef_dora', speed=0.95, pitch=1.0),
    'S': dict(voice='em_santa', speed=0.88, pitch=0.90),
    'T': dict(voice='em_alex', speed=1.05, pitch=1.38),
}

k = Kokoro(os.path.join(KDIR, 'kokoro-v1.0.onnx'), os.path.join(KDIR, 'voices-v1.0.bin'))


def sintetiza(voz, texto, destino):
    cfg = VOCES[voz]
    audio, sr = k.create(texto, voice=cfg['voice'], speed=cfg['speed'], lang='es-419')
    crudo = destino + '.raw.wav'
    sf.write(crudo, audio, sr)
    p = cfg['pitch']
    if abs(p - 1) > 1e-3:
        tono = destino + '.tono.wav'
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', crudo, '-af',
                        f'asetrate={int(SR * p)},aresample={SR},atempo={1 / p:.4f}', '-ar', str(SR), '-ac', '1', tono],
                       check=True, stdin=subprocess.DEVNULL, timeout=60)
        os.replace(tono, crudo)
    x, _ = sf.read(crudo)
    os.remove(crudo)
    # recorta silencios de los extremos (umbral -45 dB) dejando 40 ms
    umbral = 10 ** (-45 / 20) * max(1e-9, np.abs(x).max())
    idx = np.where(np.abs(x) > umbral)[0]
    if len(idx):
        a = max(0, idx[0] - int(.04 * SR)); b = min(len(x), idx[-1] + int(.06 * SR))
        x = x[a:b]
    # normaliza volumen (RMS ≈ -18 dBFS, pico máx -1 dBFS)
    rms = np.sqrt(np.mean(x ** 2)) + 1e-9
    x = x * (10 ** (-18 / 20) / rms)
    pico = np.abs(x).max()
    if pico > 0.89: x = x * (0.89 / pico)
    sf.write(destino, x.astype(np.float32), SR, subtype='PCM_16')
    return sf.info(destino).duration


def linea_de_tiempo(nombre, escenas):
    carpeta = os.path.join(BUILD, nombre)
    os.makedirs(carpeta, exist_ok=True)
    t = 0.0
    out = {'escenas': [], 'frases': []}
    n = 0
    for (esc, antes, frases, despues, minimo) in escenas:
        inicio = t
        t += antes
        locales = []
        for i, (voz, texto) in enumerate(frases):
            archivo = os.path.join(carpeta, f'{n:02d}-{esc}-{voz}.wav')
            if not os.path.exists(archivo) or os.environ.get('REHACER'):
                dur = sintetiza(voz, texto, archivo)
            else:
                dur = sf.info(archivo).duration
            out['frases'].append({'escena': esc, 'voz': voz, 'texto': texto, 'inicio': round(t, 3),
                                  'fin': round(t + dur, 3), 'archivo': archivo})
            locales.append(round(t - inicio, 3))
            print(f'  {nombre} {esc} {voz} {dur:5.2f}s  {texto[:60]}')
            t += dur + (GAP if i < len(frases) - 1 else 0)
            n += 1
        t += despues
        if t - inicio < minimo:
            t = inicio + minimo
        out['escenas'].append({'id': esc, 'inicio': round(inicio, 3), 'fin': round(t, 3), 'frases': locales})
    out['duracion'] = round(t, 3)
    with open(os.path.join(BUILD, f'{nombre}.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'{nombre}: {t:.1f} s')


def clips():
    destino = os.path.join(RAIZ, 'docs', 'media', 'audio')
    os.makedirs(destino, exist_ok=True)
    for nombre, (voz, texto) in CLIPS.items():
        wav = os.path.join(BUILD, f'clip-{nombre}.wav')
        sintetiza(voz, texto, wav)
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', wav, '-af', 'apad=pad_dur=0.15',
                        '-codec:a', 'libmp3lame', '-b:a', '64k', os.path.join(destino, f'{nombre}.mp3')], check=True, stdin=subprocess.DEVNULL)
        print('  clip', nombre)


if __name__ == '__main__':
    os.makedirs(BUILD, exist_ok=True)
    que = sys.argv[1:] or ['intro', 'final', 'clips']
    if 'intro' in que: linea_de_tiempo('intro', INTRO)
    if 'final' in que: linea_de_tiempo('final', FINAL)
    if 'clips' in que: clips()
