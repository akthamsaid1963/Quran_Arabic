# Al-Bayan — Quran, Recitation & Tafsir

A responsive Quran reader prototype for exploring all 114 Surahs, with Arabic Uthmani text, translations, recitation controls and space for verse-by-verse Tafsir.

## Run locally

Open `index.html` in a modern browser, or serve this folder with any static web server.

## Current prototype

- Surah index and search across the 114 chapters.
- Arabic verse text loaded from Quran.com API resources.
- English, German and French translation selection (availability depends on the provider's catalog).
- Reciter catalog and Surah audio sourced from MP3Quran.
- Surah playback, repeat controls and verse-level playback controls.
- Responsive layout for desktop and mobile.

## Important content and quality notes

This is a starter implementation, not yet a fully verified publication of the Colored Madani Mushaf.

Before public or educational release:

1. Verify the Arabic Uthmani text against the official 604-page Madani Mushaf edition.
2. Integrate and validate a licensed Tajweed-coloured text source, with rule colours matching the intended Colored Mushaf edition.
3. Add trusted, cited Tafsir content for every Ayah in English, German and French. Translation text must not be presented as Tafsir.
4. Confirm the selected translation and Tafsir editions, attribution requirements and redistribution permissions.
5. Integrate per-Ayah audio files and precise timestamps for each supported reciter. Surah-level MP3 playback alone does not provide reliable verse-level downloads or synchronized highlighting.
6. Test audio availability, repeat behavior, accessibility, right-to-left rendering and mobile performance.

## Data providers

- [Quran.com](https://quran.com) — Quran text, translations and available Tafsir resources.
- [MP3Quran](https://mp3quran.net) — reciter catalogue and audio services.

Use each provider according to its current API documentation and terms. API availability and identifiers can change.

## GitHub Pages

To publish as a static site, open the repository's **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. The site will be served from the repository's `index.html` once GitHub Pages finishes building.
