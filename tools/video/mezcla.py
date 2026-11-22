# -*- coding: utf-8 -*-
"""
Música original + efectos de sonido sintetizados + voces  ->  pista de audio del video.

Uso:  BUILD=/ruta/build python3 tools/video/mezcla.py intro|final
Genera BUILD/<nombre>-audio.wav
"""
import json, os, sys
import numpy as np
import soundfile as sf

SR = 44100
BUILD = os.environ.get('BUILD', 'build')
R = np.random.default_rng(7)

NOTAS = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}


def hz(n):
    nombre, octava = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((NOTAS[nombre] + 12 * (octava + 1) - 69) / 12)


def campana(f, dur=1.2, amp=1.0):
    t = np.arange(int(dur * SR)) / SR
    parc = [(1, 1, 3.0), (2.0, .45, 4.5), (3.0, .22, 6), (4.16, .12, 8), (5.43, .07, 10)]
    x = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-d * t) for m, a, d in parc)
    ataque = np.minimum(1, t / .004)
    return amp * x * ataque / 1.9


def punteo(f, dur=.5, amp=1.0, brillo=.5):
    """Karplus-Strong (pizzicato / bajo)."""
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = R.uniform(-1, 1, p)
    out = np.zeros(n)
    k = 0.5 + brillo * 0.0
    for i in range(n):
        j = i % p
        out[i] = buf[j]
        buf[j] = 0.996 * (k * buf[j] + (1 - k) * buf[(j + 1) % p])
    env = np.exp(-np.arange(n) / SR * 4.5)
    return amp * out * env


def cascabeles(dur=.12, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ruido = R.normal(0, 1, n)
    ruido = np.diff(np.concatenate([[0], ruido]))  # pasa-altos simple
    tonos = sum(np.sin(2 * np.pi * f * t + R.uniform(0, 6)) for f in R.uniform(5500, 9500, 6)) / 6
    return amp * (0.35 * ruido + 0.8 * tonos) * np.exp(-t * 28)


def golpe(f0=120, f1=45, dur=.35, amp=1.0):
    t = np.arange(int(dur * SR)) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def pop(amp=1.0):
    t = np.arange(int(.12 * SR)) / SR
    f = 300 + 1400 * t / .12
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def clic(amp=1.0):
    t = np.arange(int(.05 * SR)) / SR
    return amp * (R.normal(0, 1, len(t)) * np.exp(-t * 300) * .6 + np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120))


def suspiro(dur=.8, amp=1.0, sube=True):
    """whoosh: ruido filtrado con envolvente"""
    n = int(dur * SR)
    x = R.normal(0, 1, n)
    ventana = int(SR / 900)
    x = np.convolve(x, np.ones(ventana) / ventana, mode='same')
    x = x - np.convolve(x, np.ones(ventana * 6) / (ventana * 6), mode='same')
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    return amp * 3 * x * env


def destello(amp=1.0, base='C6'):
    notas = ['C6', 'E6', 'G6', 'C7', 'E7', 'G7']
    out = np.zeros(int(1.6 * SR))
    for i, n in enumerate(notas):
        s = campana(hz(n), 1.0, .5)
        a = int(i * .07 * SR)
        out[a:a + len(s)] += s[:len(out) - a]
    return amp * out


def crujido(amp=1.0):
    out = np.zeros(int(.5 * SR))
    for i in range(6):
        a = int((i * .07 + R.uniform(0, .02)) * SR)
        b = R.normal(0, 1, int(.03 * SR)) * np.exp(-np.arange(int(.03 * SR)) / SR * 120)
        out[a:a + len(b)] += b
    return amp * out * .7


def pon(pista, t, s):
    a = int(t * SR)
    if a >= len(pista) or a + len(s) <= 0:
        return
    if a < 0:
        s = s[-a:]; a = 0
    b = min(len(pista), a + len(s))
    pista[a:b] += s[:b - a]


# ---------------------------------------------------------------- MÚSICA
def alegre(dur):
    bpm = 120; beat = 60 / bpm
    acordes = ['C', 'A', 'F', 'G', 'C', 'A', 'D', 'G']
    menor = {'A', 'D'}
    mel = [
        [(0, 'E5', .5), (.5, 'G5', .5), (1, 'C6', 1), (2, 'B5', .5), (2.5, 'A5', .5), (3, 'G5', 1)],
        [(0, 'A5', .5), (.5, 'G5', .5), (1, 'E5', 1), (2, 'C5', .5), (2.5, 'D5', .5), (3, 'E5', 1)],
        [(0, 'F5', .5), (.5, 'A5', .5), (1, 'C6', 1), (2, 'A5', .5), (2.5, 'F5', .5), (3, 'A5', 1)],
        [(0, 'G5', 1), (1, 'B5', .5), (1.5, 'D6', .5), (2, 'B5', 1), (3, 'G5', 1)],
        [(0, 'E5', .5), (.5, 'G5', .5), (1, 'C6', 1), (2, 'B5', .5), (2.5, 'A5', .5), (3, 'G5', 1)],
        [(0, 'C6', .5), (.5, 'B5', .5), (1, 'A5', 1), (2, 'E5', 1), (3, 'A5', 1)],
        [(0, 'D5', .5), (.5, 'F5', .5), (1, 'A5', 1), (2, 'F5', .5), (2.5, 'A5', .5), (3, 'D6', 1)],
        [(0, 'B5', .5), (.5, 'A5', .5), (1, 'G5', .5), (1.5, 'F5', .5), (2, 'D5', 1), (3, 'G5', 1)],
    ]
    out = np.zeros(int((dur + 3) * SR))
    compas = 4 * beat
    nb = int(np.ceil(dur / compas))
    for b in range(nb):
        t0 = b * compas
        raiz = acordes[b % 8]
        quinta = {'C': 'G', 'A': 'E', 'F': 'C', 'G': 'D', 'D': 'A'}[raiz]
        for i, n in enumerate([raiz + '2', quinta + '2', raiz + '2', quinta + '2']):
            pon(out, t0 + i * beat, punteo(hz(n), .6, .55))
        for (o, n, d) in mel[b % 8]:
            pon(out, t0 + o * beat, campana(hz(n), 1.0, .42))
        for i in range(8):
            pon(out, t0 + i * beat / 2, cascabeles(.12, .22 if i % 2 else .12))
        # acorde suave
        tercera = {'C': 'E', 'A': 'C', 'F': 'A', 'G': 'B', 'D': 'F'}[raiz]
        for n in [raiz + '4', tercera + '4', quinta + '4']:
            pon(out, t0, campana(hz(n), 2.0, .12))
    return out[:int(dur * SR)]


def misterio(dur):
    bpm = 104; beat = 60 / bpm
    bajos = [['A2', 'E3', 'A2', 'E3'], ['D3', 'A2', 'D3', 'A2'], ['E2', 'B2', 'E2', 'G#2'], ['A2', 'E3', 'A2', 'C3']]
    mel = [[(0, 'A4'), (.5, 'C5'), (1, 'E5'), (1.5, 'D#5'), (2, 'E5'), (3, 'C5')],
           [(0, 'D5'), (.5, 'F5'), (1, 'A5'), (2, 'F5'), (2.5, 'D5')],
           [(0, 'E5'), (.5, 'G#5'), (1, 'B5'), (1.5, 'A5'), (2, 'G#5'), (3, 'E5')],
           [(0, 'A5'), (.5, 'E5'), (1, 'C5'), (2, 'B4'), (2.5, 'C5'), (3, 'A4')]]
    out = np.zeros(int((dur + 3) * SR))
    compas = 4 * beat
    for b in range(int(np.ceil(dur / compas))):
        t0 = b * compas
        for i, n in enumerate(bajos[b % 4]):
            pon(out, t0 + i * beat, punteo(hz(n), .35, .6))
        for (o, n) in mel[b % 4]:
            pon(out, t0 + o * beat, punteo(hz(n), .25, .35))
        for i in (1, 3):
            pon(out, t0 + i * beat, clic(.12))
    return out[:int(dur * SR)]


def magico(dur):
    bpm = 92; beat = 60 / bpm
    acordes = [['C5', 'E5', 'G5', 'C6', 'E6', 'G6'], ['A4', 'C5', 'E5', 'A5', 'C6', 'E6'],
               ['F4', 'A4', 'C5', 'F5', 'A5', 'C6'], ['G4', 'B4', 'D5', 'G5', 'B5', 'D6']]
    bajos = ['C3', 'A2', 'F2', 'G2']
    out = np.zeros(int((dur + 3) * SR))
    compas = 4 * beat
    for b in range(int(np.ceil(dur / compas))):
        t0 = b * compas
        ac = acordes[b % 4]
        pon(out, t0, punteo(hz(bajos[b % 4]), 1.6, .5))
        seq = ac + ac[::-1][1:-1]
        for i in range(16):
            pon(out, t0 + i * beat / 4, campana(hz(seq[i % len(seq)]), 1.4, .22))
    return out[:int(dur * SR)]


def tierno(dur):
    bpm = 78; beat = 60 / bpm
    mel = [[(0, 'A5', 1), (1, 'G5', 1), (2, 'F5', 2)], [(0, 'C6', 1), (1, 'A5', 1), (2, 'F5', 2)],
           [(0, 'Bb5', 1), (1, 'A5', 1), (2, 'G5', 2)], [(0, 'E5', 1), (1, 'G5', 1), (2, 'C6', 2)]]
    acordes = [['F3', 'C4', 'A4'], ['F3', 'C4', 'A4'], ['Bb2', 'F3', 'D4'], ['C3', 'G3', 'E4']]
    out = np.zeros(int((dur + 4) * SR))
    compas = 4 * beat
    for b in range(int(np.ceil(dur / compas))):
        t0 = b * compas
        for i, n in enumerate(acordes[b % 4]):
            pon(out, t0 + i * beat * .5, punteo(hz(n), 1.5, .35))
        for (o, n, d) in mel[b % 4]:
            pon(out, t0 + o * beat, campana(hz(n), 2.2, .38))
    return out[:int(dur * SR)]


ESTILOS = {'alegre': alegre, 'misterio': misterio, 'magico': magico, 'tierno': tierno}
ANIMO = {
    'titulo': 'alegre', 'polo': 'alegre', 'tilin': 'alegre', 'bromas': 'alegre', 'santa': 'misterio',
    'vuelo': 'magico', 'robo': 'misterio', 'cofre': 'misterio', 'pistas': 'alegre', 'reto': 'misterio',
    'agente': 'magico', 'gaby': 'magico', 'mision': 'alegre',
    'abierto': 'magico', 'triste': 'tierno', 'cena': 'tierno', 'fin': 'alegre',
}


def musica(escenas, total):
    out = np.zeros(int((total + 1) * SR))
    bloques = []
    for e in escenas:
        a = ANIMO[e['id']]
        if bloques and bloques[-1][0] == a:
            bloques[-1][2] = e['fin']
        else:
            bloques.append([a, e['inicio'], e['fin']])
    X = .6
    for (a, ini, fin) in bloques:
        dur = fin - ini + X
        seg_ = ESTILOS[a](dur)
        n = len(seg_)
        env = np.ones(n)
        k = int(X * SR)
        env[:k] = np.linspace(0, 1, k) if ini > 0 else 1
        env[-k:] = np.linspace(1, 0, k)
        pon(out, max(0, ini - X / 2), seg_ * env)
    return out


# ---------------------------------------------------------------- EFECTOS POR ESCENA
def efectos(tl):
    sfx = []
    E = {e['id']: e for e in tl['escenas']}

    def en(esc, t, s):
        if esc in E:
            sfx.append((E[esc]['inicio'] + t, s))

    def cas(n=4, amp=.6):
        out = np.zeros(int(.6 * SR))
        for i in range(n):
            pon(out, i * .07, cascabeles(.15, amp))
        return out

    # INTRO
    en('titulo', .3, cas(6, .5)); en('titulo', 1.0, campana(hz('C6'), 1.5, .5)); en('titulo', 1.6, campana(hz('G6'), 1.5, .5))
    en('titulo', 3.0, cas(5, .7))
    if 'tilin' in E:
        for i in range(10):
            en('tilin', .3 + i * .3, cascabeles(.15, .45))
        en('tilin', 4.0, destello(.5))
    if 'bromas' in E:
        d = E['bromas']['fin'] - E['bromas']['inicio']; a = (d - 1.2) / 3
        for i in range(3):
            en('bromas', i * a + .1, pop(.5))
        en('bromas', a + .7, suspiro(.6, .5)); en('bromas', 2 * a + 1.0, cascabeles(.4, .3))
    if 'santa' in E:
        en('santa', E['santa']['frases'][2] - .1, golpe(160, 50, .4, .6))
    en('vuelo', .2, suspiro(1.6, .6)); en('vuelo', 2.0, destello(.35))
    if 'vuelo' in E:
        en('vuelo', E['vuelo']['frases'][1] - .2, suspiro(1.2, .5))
    if 'robo' in E:
        e = E['robo']; f1 = e['frases'][1]; dur2 = (e['fin'] - e['inicio'] - 1) - f1
        for i in range(8):
            en('robo', 2.3 + i * .35, clic(.18))
        for i in range(6):
            en('robo', f1 + .3 + i * (dur2 * .5 / 6) + .5, pop(.35))
        en('robo', f1 + dur2 * .62 + .6, crujido(.5))
    if 'cofre' in E:
        for i in range(4):
            en('cofre', .5 + i * .4, golpe(220, 120, .2, .35))
        en('cofre', 2.75, golpe(130, 45, .5, .8))
        for i in range(5):
            en('cofre', 3.2 + i * .7, clic(.7))
    if 'pistas' in E:
        en('pistas', .9, suspiro(1.2, .7))
        d = E['pistas']['fin'] - E['pistas']['inicio'] - 1
        for i in range(4):
            en('pistas', d * .55 + i * .45, pop(.5))
    if 'agente' in E:
        en('agente', .3, destello(.6)); en('agente', E['agente']['frases'][1], destello(.5))
    if 'gaby' in E:
        en('gaby', .3, destello(.5))
        for i in range(4):
            en('gaby', 1.0 + i * .45, clic(.6))
        en('gaby', 2.9, campana(hz('E6'), 1.5, .5))
    if 'mision' in E:
        for i in range(3):
            en('mision', .5 + i * .35, pop(.5))
        en('mision', 3.3, clic(.4))
        f1 = E['mision']['frases'][1]
        for n in ['C5', 'E5', 'G5', 'C6']:
            en('mision', f1 - .1, campana(hz(n), 2.5, .35))
        en('mision', f1, cas(8, .6))
    # FINAL
    if 'abierto' in E:
        for i in range(4):
            en('abierto', .4 + i * .55, clic(.6)); en('abierto', .8 + i * .55, golpe(300, 180, .15, .3))
        en('abierto', 3.0, suspiro(.6, .4)); en('abierto', 3.8, clic(.7)); en('abierto', 4.4, clic(.7))
        en('abierto', 5.0, destello(.7)); en('abierto', 5.3, destello(.5))
    if 'cena' in E:
        en('cena', E['cena']['frases'][1], cas(6, .5))
    if 'fin' in E:
        f1 = E['fin']['frases'][1]
        for n in ['C5', 'E5', 'G5', 'C6']:
            en('fin', f1 - .1, campana(hz(n), 3, .35))
        en('fin', f1, cas(8, .6))
    return sfx


def remuestrea(x, sr_in):
    n = int(len(x) * SR / sr_in)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)


def main(nombre):
    tl = json.load(open(os.path.join(BUILD, f'{nombre}.json'), encoding='utf-8'))
    total = tl['duracion']
    N = int((total + .5) * SR)
    voz = np.zeros(N); fx = np.zeros(N)
    for fr in tl['frases']:
        x, sr = sf.read(fr['archivo'])
        pon(voz, fr['inicio'], remuestrea(x, sr))
    for (t, s) in efectos(tl):
        pon(fx, t, s)
    mus = musica(tl['escenas'], total)[:N]
    mus = np.pad(mus, (0, N - len(mus)))
    # baja la música cuando hay voz
    env = np.zeros(N)
    for fr in tl['frases']:
        a = int((fr['inicio'] - .25) * SR); b = int((fr['fin'] + .3) * SR)
        env[max(0, a):b] = 1
    k = int(.25 * SR)
    env = np.convolve(env, np.ones(k) / k, mode='same')
    mus = mus / (np.abs(mus).max() + 1e-9)
    gan = 0.30 - 0.19 * env
    mezcla = voz * .95 + mus * gan + fx * .55
    # fundido final
    f = int(2.0 * SR)
    mezcla[-f:] *= np.linspace(1, 0, f)
    mezcla[:int(.3 * SR)] *= np.linspace(0, 1, int(.3 * SR))
    # volumen general ≈ -18 dBFS RMS y limitador suave para los picos
    rms = np.sqrt(np.mean(mezcla ** 2)) + 1e-9
    mezcla = mezcla * (10 ** (-18 / 20) / rms)
    mezcla = .93 * np.tanh(mezcla / .93)
    est = np.stack([mezcla, mezcla], axis=1)
    sal = os.path.join(BUILD, f'{nombre}-audio.wav')
    sf.write(sal, est.astype(np.float32), SR, subtype='PCM_16')
    print('audio', sal, f'{total:.1f}s')


if __name__ == '__main__':
    main(sys.argv[1])
