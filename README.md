# Al-Bayan — القرآن الكريم

A responsive multilingual Quran reader built with Next.js. The app includes the 114-surah index, Quran.com Uthmani/Tajweed text, verse audio controls, repeat playback, and language selection for Arabic, English, German and French.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npx serve out
```

## Included

- Searchable index for all 114 surahs.
- Arabic Quran text requested from the Quran.com API, including Tajweed-marked Uthmani text when supplied by the API.
- Language selection for Arabic, English, German and French.
- Translation and Tafsir resources are selected from the provider's language catalogue. Tafsir is not silently replaced with a translation; if the selected language has no matching Al-Muyassar resource, the Tafsir panel reports that it is unavailable.
- Reciter catalogue populated dynamically from Quran.com recitation resources, with a search field.
- Verse playback, repeat counts and sequential surah playback when audio URLs are available.
- Responsive desktop and mobile layout with RTL support.

## Build and deployment

Every push to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`. It installs dependencies, runs `next build` (static export), and deploys the generated `out/` directory to GitHub Pages.

**One-time repository setup:** in GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Then open the **Actions** tab and monitor the “Build and deploy Al-Bayan to GitHub Pages” workflow.

After a successful deployment, the expected project URL is:

https://akthamsaid1963.github.io/Quran_Arabic/

## Data providers and important limitations

- [Quran.com](https://quran.com) — Quran text, translations, Tafsir catalogues and recitation resources.
- [MP3Quran](https://mp3quran.net) — documented as an additional reciter source; availability varies by reciter and recording.

The application fetches content from external APIs at runtime. Provider availability, API response fields, resource identifiers, audio coverage and licensing terms can change. No external content is bundled into this repository.

This is a software implementation, **not a certified Madani Mushaf, scholarly Tafsir edition, or Tajweed teaching authority**. The displayed Tajweed colours use provider-supplied markup and a provisional CSS mapping. Before educational or public release, have the text, verse boundaries, Tajweed mapping, translations and Tafsir reviewed by qualified specialists and verify redistribution rights for every source.

The requested reciters Hicham El Harraz, Abdulrahman Al-Shahat and Abdullah Khayyat are recorded in [the reciter notes](docs/RECITERS.md). A requested name is not a claim that a recording is available from the live provider catalogue.
