# CS Review

Live at https://eljhon.me/cs-review

Buildless computer science practice app with 404 source-referenced questions from textbook Chapters 1–8 and chapter homework.

- Each fresh attempt draws 20 multiple-choice and 30 fill-in questions, with homework from all eight chapters.
- English / 繁體中文 switching preserves the current attempt, answer order, timer, and answers.
- Light / dark mode follows the system initially; language and theme choices are saved locally.
- Flexible grading accepts curated bilingual equivalents and numeric formats; review supports clearly labelled self-assessment.
- Question references show textbook printed/PDF page locations and homework question locations after submission.

## Run and check

Serve `dist` with any static web server, for example `python -m http.server 8767 --directory dist`.

Run `node verify.cjs` and `node verify-localization.cjs` to check grading, random selection, saved attempts, and translations.

The deployable question bank lives in `dist/questions.js`. `bank.json` is the matching source data for the translation catalog. After editing translations, run `python build_localization.py`.

## Hosting

Vercel serves `dist` using `vercel.json`. `/cs-review` and `/cs-review/*` work on the dedicated deployment. The existing eljhon.me project forwards those paths to this deployment. Preserve other domain routes when editing routing configuration.

No textbook or homework PDFs, credentials, or browser data are included. All progress is stored in the visitor's browser. This is a reconstructed self-study exam, not an official exam.
