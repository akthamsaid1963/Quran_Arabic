# Al-Quran — القرآن الكريم

A responsive, static Quran reader for GitHub Pages. The interface supports Arabic, English, German and French, with a searchable index of all 114 surahs, Uthmani Arabic text, provider-supplied Tajweed markup, translations, Tafsir resources, reciter selection, verse playback, repeat controls and verse-level playback highlighting.

## Run locally

This is a static site. Open `index.html` in a browser or serve the folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Data and integrity

- Quran text, Uthmani/Tajweed verse markup, translations, Tafsir catalogues and recitation audio are requested from the Quran.com public API (Quran Foundation).
- Surah and reciter catalogues are loaded dynamically.
- Translation and Tafsir resources are selected from the requested language's provider catalogue. If a language-specific Tafsir is not offered by the provider, the interface says so rather than inventing a translation or presenting a different language as if it were the requested one.
- Verse audio is played separately for each Ayah. The currently recited Ayah is highlighted while its recording plays; repeat options include once, three times, five times and indefinitely.
- Tajweed colours are rendered from the provider's Tajweed markup. The legend is a simplified visual guide, not a substitute for learning with a qualified teacher.

**Important:** This project is a software interface, not a certified Madani Mushaf, scholarly Tafsir edition or Tajweed teaching authority. Before educational/public use, have the displayed script, Tajweed mapping, translations and Tafsir editions reviewed by qualified specialists. Quran Foundation's developer terms and the relevant content licences govern reuse, caching and redistribution. Do not scrape, bundle or redistribute recordings without permission.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` publishes the repository root whenever a commit reaches `main`. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the deployment source.

Expected site URL: https://akthamsaid1963.github.io/Quran_Arabic/

The repository's existing custom domain is retained in `CNAME`.

## Sources

- https://quran.com
- https://api-docs.quran.com/
- https://github.com/quran/quran.com-frontend-next
