# CS Review

Live at https://eljhon.me/cs-review

Buildless computer science practice app with 408 source-referenced questions from textbook Chapters 1–8 and chapter homework.

- Every new attempt contains 80 fixed teacher-core practice questions plus 30 randomized extras (15 MC + 15 fill), for 110 questions / 220 points.
- The fixed core marks 62 clearly mentioned topic reconstructions with ★ and 18 uncertain reconstructions with ◇. Exact exam wording and numeric values are not guaranteed.
- Extra homework from all eight chapters is guaranteed. Previously saved 50-question attempts remain resumable.
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

## Teacher briefing coverage

`teacher-core.json` lists each fixed question, confidence label, and exact textbook source. `build_teacher_core.py` generates `dist/teacher-core.js` from that reviewed list and adds four fill-in versions of explicitly mentioned questions. Run it before `python build_localization.py` after editing the core.

The source is the instructor's recorded midterm briefing supplied for this study app. The core covers computer generations and Turing; storage units, ASCII/UTF and conversions including fractions; CPU/memory buses, DVD, SSD, RAM/ROM and SRAM/DRAM; booting, memory addresses and loading; OSI packet/router/switch layers; mobile cells/base stations; DNS, domain categories and Web services; firewall, hashes, wireless security and key/signature operations.

The exact acquired service and numeric IP example cannot be recovered. Dates, dynamic-loading wording, two Web terminology blanks, the YouTube/Internet-call pairing, and checked security-table rows remain uncertain and are explained in the app. Unclear items are never labelled as confirmed exam questions. The announced real exam remains 20 MC + 30 fill; the expanded format is for study.
