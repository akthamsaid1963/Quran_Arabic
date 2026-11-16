# Al-Bayan — Quran, Recitation & Tafsir

A responsive Quran reader prototype for all 114 Surahs.

## Run locally

Open `index.html` in a modern browser, or serve this folder with a static web server.

## Implemented in this prototype

- Surah index and search across all 114 chapters.
- Arabic Uthmani text requested from Quran.com, including its Tajweed-marked text field.
- Arabic, English, German and French content-language choices. Translation and Tafsir catalogs are provider-dependent; the page displays what the selected catalog supplies for each Ayah.
- Surah reciter catalogue and full-Surah audio from MP3Quran.
- Separate Quran.com recitation selection for individual Ayah audio, with per-Ayah repeat and audio-file download controls when the API supplies an audio URL.
- Tajweed rule colour styling and a legend for common rule classes.
- Responsive desktop and mobile layout.

## Important verification still required

This is a working prototype, **not yet a certified Colored Madani Mushaf or a complete scholarly Tafsir publication**.

Before public or educational release:

1. Verify every Arabic character, waqf mark and verse boundary against an authorized Uthmani Madani Mushaf source.
2. Validate Tajweed class-to-colour mappings against the exact Colored Mushaf edition. The current CSS is a provisional visual mapping, not an authoritative certification.
3. Audit that every verse has an appropriate, complete Tafsir in Arabic, English, German and French. A translation is not a Tafsir; missing language resources must be sourced and reviewed rather than silently substituted.
4. Confirm attribution, licensing and redistribution rights for text, translations, Tafsir and recitations.
5. Verify reciter identity, audio URLs, verse boundaries and synchronization on every supported recitation. Availability and response fields can vary by provider.
6. Test accessibility, right-to-left rendering, repeat behavior, browser compatibility and mobile performance.

## Data providers

- [Quran.com](https://quran.com) — Quran text, Tajweed-marked text, translation/Tafsir catalogs and recitation resources.
- [MP3Quran](https://mp3quran.net) — reciter catalogue and Surah audio.

Use each provider according to its current API documentation and terms. API availability and identifiers can change.

## GitHub Pages

To publish as a static site, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. GitHub Pages will publish the repository's `index.html` after its build completes.


## Reciter catalogue

The static reader loads the complete reciter list returned by MP3Quran and includes a **Find reciter** search field. Requested priority names, including Hicham El Harraz, Abdulrahman Al-Shahat and Abdullah Khayyat, are documented in [`docs/RECITERS.md`](docs/RECITERS.md). A name in that priority list does not imply that recordings are currently available; the UI only lists recordings returned by the provider. Verify coverage, recitation narration, attribution and reuse rights before public release.
