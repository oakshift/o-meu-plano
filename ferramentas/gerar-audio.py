#!/usr/bin/env python3
# Gera o áudio da app com uma voz portuguesa (Piper, voz "tugão").
#
# As vozes do browser não são de confiança: no Linux, o Brave em snap não
# tem nenhuma, e as que o sistema oferece são robóticas. Por isso cada texto,
# problema, palavra e sílaba da app tem o seu próprio ficheiro de áudio.
#
# Cada ficheiro chama-se pela impressão digital do texto (FNV-1a de 32 bits,
# sobre o texto com os espaços normalizados) — a mesma conta que js/audio.js
# faz para o encontrar. Mudar uma vírgula num texto exige voltar a correr isto.
#
# Uso (a partir da raiz do projeto):
#   ferramentas/.venv/bin/python ferramentas/gerar-audio.py
# Só gera o que falta; com --tudo, refaz tudo.

import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "audio"
INDICE = RAIZ / "data" / "falas.js"
MODELO = RAIZ / "ferramentas" / "vozes" / "pt_PT-tugão-medium.onnx"

# Mais devagar do que a fala normal: é um modelo para quem está a aprender.
RITMO = {"texto": 1.12, "problema": 1.12, "palavra": 1.2, "silaba": 1.25}


def normalizar(t):
    return re.sub(r"\s+", " ", t.strip())


def impressao(t):
    h = 0x811C9DC5
    for b in normalizar(t).encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def falas():
    ler = lambda p: (RAIZ / p).read_text(encoding="utf-8")
    lista = []
    for t in re.findall(r"texto: `([^`]*)`", ler("data/textos.js")):
        lista.append(("texto", t))
    for t in re.findall(r'texto: "([^"]*)"', ler("data/matematica.js")):
        lista.append(("problema", t))
    for p, s in re.findall(r'\{ p: "([^"]+)", s: \[([^\]]*)\] \}', ler("data/palavras.js")):
        lista.append(("palavra", p))
        for silaba in re.findall(r'"([^"]+)"', s):
            lista.append(("silaba", silaba))
    vistas, unicas = set(), []
    for tipo, t in lista:
        if impressao(t) not in vistas:
            vistas.add(impressao(t))
            unicas.append((tipo, t))
    return unicas


def main():
    tudo = "--tudo" in sys.argv
    PASTA.mkdir(exist_ok=True)
    voz = PiperVoice.load(str(MODELO))
    lista = falas()
    feitos = 0
    for tipo, t in lista:
        destino = PASTA / f"{impressao(t)}.mp3"
        if destino.exists() and not tudo:
            continue
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            with wave.open(tmp.name, "wb") as w:
                voz.synthesize_wav(normalizar(t), w, syn_config=SynthesisConfig(length_scale=RITMO[tipo]))
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name,
                            "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "48k", str(destino)], check=True)
        feitos += 1
        print(f"{tipo:9} {destino.name}  {normalizar(t)[:50]}")

    # Ficheiros que já não correspondem a nenhum texto (o texto mudou).
    validas = {impressao(t) for _, t in lista}
    for f in PASTA.glob("*.mp3"):
        if f.stem not in validas:
            f.unlink()
            print(f"apagado   {f.name}")

    INDICE.write_text(
        "// Gerado por ferramentas/gerar-audio.py — não editar à mão.\n"
        "// Impressões digitais dos textos que têm áudio em audio/<impressão>.mp3.\n"
        "export const FALAS = new Set([\n"
        + "".join(f'  "{h}",\n' for h in sorted(validas))
        + "]);\n",
        encoding="utf-8",
    )
    print(f"{feitos} gerados, {len(validas)} no total.")


main()
