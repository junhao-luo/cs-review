# CS Review

Live at https://eljhon.me/cs-review

Buildless computer science practice app with 434 source-referenced questions from textbook Chapters 1–8 and chapter homework.

- Each new attempt includes exactly the supplied 30 questions plus 30 randomized extras. Only supplied questions have ★ teacher labels.
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

## Authoritative teacher-provided list

Only `teacher-provided.txt` defines the fixed core. Its 30 questions replace the earlier inferred 80-question list. `teacher-core.json` records the exact original Mandarin prompts and Q01–Q30 numbers. `build_teacher_core.py` creates English practice wording, grading equivalents, and the generated `dist/teacher-core.js`; `teacher-prompts-zh.json` preserves the supplied prompts for 繁體中文 mode. Run `python build_teacher_core.py` then `python build_localization.py` after editing the list.

All 30 questions are always included, plus 30 randomized extras (15 MC + 15 fill) with extra homework from all eight chapters. The bank contains 404 textbook/homework entries plus 30 supplied entries. All teacher-provided questions use short-answer practice because the supplied file does not specify answer choices.

The supplied answers and explanations are preserved in post-submission review. Q5 has a routing/checksum ambiguity, Q9 cannot infer an institution from the first IP octet, and Q15 conflates commercial Internet access with WWW history. These three are retained unscored, giving 57 scored questions / 114 possible points. Other qualifications in the file remain in the explanations. The teacher-provided label identifies list membership, not independent verification of every answer.

Earlier saved 50- and 110-question attempts remain resumable without changing their questions or answers. Start a new attempt to use the corrected 30-question core.
