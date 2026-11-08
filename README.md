# Vellaré — Haute Joaillerie

Site conceitual de joalheria em React + Vite + TypeScript + Tailwind CSS v4 + Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Estrutura

- `src/sections/` — uma seção da página por arquivo (Hero, Intro, GemStories, Collections, Shop, Campaign, NewArrivals, About, Footer)
- `src/components/` — header, sacola, busca, toast e peças reutilizáveis (`JewelImage`, `Reveal`, `Glints`)
- `src/context/StoreContext.tsx` — sacola (salva no `localStorage`), filtro da vitrine, overlays
- `src/data/catalog.ts` — produtos, categorias e as histórias “01 · 02 · 03” com a paleta de cada pedra
- `src/data/images.ts` — mapa das imagens

## Imagens

As fotos originais (`anel-esmeralda.png`, `Pingente.png`, `Pulseira.png`) ficam na raiz. O script
`scripts/cutout.py` remove o fundo branco e gera versões WebP transparentes (1400px e 640px).

As fotos de produto e as editoriais (`src/assets/photos/`) foram geradas no Paper com o Nano Banana 2.1, usando as
fotos originais como referência para manter o desenho exato de cada joia. A prancheta fica no arquivo "Scratchpad",
página "Vellaré — Fotos"; o mapa das fotos está em `src/data/photos.ts`.

```bash
python scripts/cutout.py . src/assets/jewels
```

O colar do hero (`Colar-dourado.png`, fotografado sobre cetim) é recortado por `scripts/necklace.py`
(`python scripts/necklace.py Colar-dourado.png saida.png preview.jpg`); o contorno do pingente está desenhado à mão
no script, então uma foto nova exige ajustar esses pontos. A fita (`Fita-Luxuosa.png`) já vem transparente e só tem
as bordas limpas na exportação.

Para trocar uma joia, substitua o PNG de origem e rode o script de novo, ou coloque um novo WebP em
`src/assets/jewels/` e registre-o em `src/data/images.ts`.

## Integrações futuras

Não há backend: produtos ficam em `catalog.ts`; sacola, favoritos e newsletter ficam no navegador. O botão
“Finalizar compra” mostra um aviso de loja demonstrativa — é o ponto de ligação para um checkout real.
