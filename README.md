# Kusov Digital — web

Next.js 14. Dark cinematic, monochrome. Fullscreen hero, scroll-scrub showcase (video z framov vedľa služby), 3 služby, 4-krokový proces, multi-step dopytový formulár (Web3Forms), SK/EN prepínač.

## Lokálne spustenie

```bash
npm install
npm run dev
```

http://localhost:3000

## Formulár

Web3Forms access key je už vložený v `components/MultiStepForm.jsx` (konštanta `ACCESS_KEY`). Dopyty chodia na email priradený k tomu kľúču. Funguje hneď.

## Deploy na Vercel

Pushni na GitHub → importuj vo vercel.com, alebo:
```bash
npx vercel
```

## Kde čo upraviť

- **Texty (SK + EN):** `components/copy.js`
- **Farby / štýl:** `app/globals.css` → premenné v `:root` (--cream je akcent)
- **Frames videa:** `public/frames/frame_001.jpg` … `frame_066.jpg`. Pri výmene videa vygeneruj nové framy a uprav `FRAME_COUNT` v `app/page.jsx` a `components/MultiStepForm.jsx` netreba.
- **Rýchlosť scrubu:** v `app/page.jsx` v `ScrubShowcase` výška sekcie `height: "260vh"` — viac = pomalšie.
- **Kroky formulára:** `components/MultiStepForm.jsx`
