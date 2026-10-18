#!/usr/bin/env python3
"""Junta e minimiza os CSS da página principal em css/site.min.css.

Não é um build de deploy: o site continua estático e o resultado fica no repositório.
Os ficheiros em css/ continuam a ser a fonte; depois de editar algum, corra:
    python3 tools/build-css.py
A ordem abaixo é a mesma que o index.html tinha (a cascata depende dela).
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
ORDER = ["tokens", "base", "chat", "vignettes", "sections", "virada", "como", "diferencial", "fecho",
         "oferta", "prova", "publico", "processo", "especialista", "tema", "alinhamento", "fundos", "motion"]

def minify(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};])\s*", r"\1", css)
    css = css.replace(";}", "}")
    return css.strip()

out = "/* gerado por tools/build-css.py: não editar à mão */\n" + "\n".join(
    minify((ROOT / "css" / f"{n}.css").read_text(encoding="utf-8")) for n in ORDER) + "\n"
(ROOT / "css" / "site.min.css").write_text(out, encoding="utf-8")
print("css/site.min.css", len(out.encode()), "bytes")
