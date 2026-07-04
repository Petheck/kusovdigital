# Kusov Digital — Video Tours web

Next.js 14 landing page: fullscreen scroll-scrub hero, SK/EN prepínač, kontaktný formulár (Web3Forms).

## Spustenie lokálne

```bash
npm install
npm run dev
```

Otvor http://localhost:3000

## Pred nasadením — DÔLEŽITÉ

1. **Web3Forms kľúč**: choď na https://web3forms.com, zadaj peter@kusovdigital.com, príde ti Access Key.
   V súbore `app/page.jsx` nahraď `YOUR_WEB3FORMS_ACCESS_KEY` svojím kľúčom.
   Bez toho formulár nebude odosielať.

## Deploy na Vercel

```bash
npx vercel
```

alebo pushni repo na GitHub a importuj vo vercel.com.

## Úpravy

- Texty (SK aj EN): `components/copy.js`
- Farby a štýly: `app/globals.css` (CSS premenné hore v `:root`)
- Frames videa: `public/frames/frame_001.jpg` … `frame_066.jpg`
  (ak vymeníš video, vygeneruj nové frames a uprav `FRAME_COUNT` v `app/page.jsx`)
- Rýchlosť scroll videa: `.hero-section { height: 420vh }` v globals.css — viac = pomalšie
