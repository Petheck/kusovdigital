# Kusov Digital — web pre virtuálne zariadenie nehnuteľností

Statická stránka, žiadny build krok. Pripravená na GitHub Pages / Vercel.

## Štruktúra
```
index.html
css/style.css
js/main.js
assets/img/     — fotky pred/po (.webp) + poster snímky videí (.jpg)
assets/video/   — video premeny pred/po (.mp4)
```

## Nasadenie na Vercel cez GitHub
1. Nahraj celý obsah tohto priečinka do nového GitHub repozitára (napr. `kusov-realestate`).
2. Na vercel.com → **Add New Project** → vyber ten repozitár.
3. Framework preset nechaj na **Other** (je to statický HTML, žiadny build).
4. Deploy — Vercel automaticky nájde `index.html` v roote.

## Čo meniť
- **Ceny balíkov**: hľadaj `€50` a `€99` v `index.html`.
- **E-mail**: `peter@kusovdigital.com` — je v `mailto:` odkazoch (3×).
- **Fotky/videá pred-po**: nahraď súbory v `assets/` rovnakým názvom, alebo zmeň cesty v `index.html`.
- **Texty**: všetko po slovensky priamo v `index.html`, žiadny CMS.

## Poznámka k obsahu
Fotky a videá v `assets/` sú príklady/demo. Pred nasadením do produkcie nahraď
skutočnými ukážkami vlastnej práce (alebo ponechaj ako ilustráciu so súhlasom
pôvodného zdroja obrázkov).
