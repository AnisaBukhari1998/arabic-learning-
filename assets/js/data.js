/* ==========================================================================
   The Free Arabic Library — curriculum data
   Every record in this file is content: phases, resources, reference tables,
   study routines and milestones. app.js renders it; nothing here touches DOM.
   ========================================================================== */

window.LIBRARY = (function () {
  'use strict';

  /* ---------------------------------------------------------------- phases */
  const phases = [
    {
      id: 'p1',
      num: '١',
      short: 'Script',
      title: 'The Alphabet & Reading the Script',
      goal: 'Read and write all 28 letters in every position, with ḥarakāt.',
      time: '2–6 weeks',
      hours: '30–60 h',
      intro:
        'Arabic is a connected cursive written right-to-left. Learn the four letter shapes (isolated, initial, medial, final), the short-vowel marks, sukūn, shadda and tanwīn. Getting the articulation points (makhārij) right from day one saves months of un-learning later — ح is not h, ق is not k, and ض has no English equivalent at all.',
      exit: 'You can sound out any fully-vowelled word — including one you have never seen — without pausing to decode letters.',
      resources: [
        { name: 'Madinah Arabic — Reading Course', where: 'madinaharabic.com/arabic-reading-course', url: 'https://www.madinaharabic.com/arabic-reading-course', tag: 'free', best: 'Start here',
          note: 'Structured alphabet course with audio for every letter–vowel combination, no login. Flows straight into the 89-lesson language course you use in Phase 2.' },
        { name: 'Arabic101 (YouTube)', where: 'youtube.com/@Arabic101', url: 'https://www.youtube.com/@Arabic101', tag: 'free',
          note: 'Letter-by-letter pronunciation taught from Qur\'anic recitation, including a "read the Qur\'an in 60 days" series. The best free training for makhārij.' },
        { name: 'Qāʿida Nūrāniyya', where: 'Free PDF + guided recitation videos', url: 'https://archive.org/search?query=noorani+qaida', tag: 'free',
          note: 'The traditional primer used worldwide to take a complete beginner from letters to fluent Qur\'anic decoding. Work through it out loud with a recording.' },
        { name: 'ARC — Arabic Reading Course', where: 'arabicreadingcourse.com', url: 'https://arabicreadingcourse.com', tag: 'free',
          note: 'Interactive click-through lessons with instant audio feedback. Gentle, and useful as a second pass over the same material.' },
        { name: 'Write It! Arabic', where: 'Android / iOS', tag: 'freemium',
          note: 'Trace every letter form with your finger until the connected shapes become muscle memory. Pair with 10 minutes of ruled-paper copying.' },
        { name: 'Lexilogos Arabic keyboard', where: 'lexilogos.com/keyboard/arabic.htm', url: 'https://www.lexilogos.com/keyboard/arabic.htm', tag: 'free',
          note: 'Type Arabic before you install a keyboard layout. Typing forces you to distinguish letters your eye still blurs together.' },
        { name: 'Al-Kitaab / Alif Baa companion media', where: 'alkitaabtextbook.com', url: 'https://alkitaabtextbook.com', tag: 'freemium',
          note: 'The video and audio that accompany the standard US university textbook are free on the companion site. Useful even without the book.' },
        { name: 'Duolingo Arabic — first units only', where: 'duolingo.com', url: 'https://www.duolingo.com/course/ar/en', tag: 'freemium',
          note: 'The opening units drill script recognition with spaced repetition. Genuinely useful here; abandon it once the alphabet is solid.' }
      ]
    },

    {
      id: 'p2',
      num: '٢',
      short: 'Foundations',
      title: 'Foundations of MSA (al-Fuṣḥā)',
      goal: 'A1–A2: basic sentences, ~1,000 words, simple listening.',
      time: '3–6 months',
      hours: '150–300 h',
      intro:
        'Modern Standard Arabic is the formal register of books, news and education across the Arab world, and it shares its grammatical skeleton with Classical Arabic. Nothing you learn here is wasted on the Qur\'anic side — the vocabulary differs at the edges, the grammar does not.',
      exit: 'You can introduce yourself, describe a picture in five sentences, and follow a slow news headline read aloud.',
      resources: [
        { name: 'Madinah Arabic — Language Course', where: 'madinaharabic.com', url: 'https://www.madinaharabic.com/arabic-language-course', tag: 'free', best: 'Core course',
          note: '89 sequential free lessons from zero to intermediate with vocabulary, grammar tables and exercises. The strongest free structured MSA website.' },
        { name: 'Language Transfer — Introduction to Arabic', where: 'languagetransfer.org', url: 'https://www.languagetransfer.org/free-courses', tag: 'free', best: 'Best audio course',
          note: 'A free audio course that teaches you to think in roots and patterns instead of memorising phrases. Donation-supported, no ads, no account. (Levantine-leaning, but the thinking transfers.)' },
        { name: 'FSI Arabic — full course', where: 'livelingua.com/fsi', url: 'https://www.livelingua.com/courses/arabic', tag: 'pd',
          note: 'The US Foreign Service Institute\'s complete Arabic courses — textbooks plus hours of drill audio — are public domain. Dry, thorough, and free forever.' },
        { name: 'DLI GLOSS', where: 'gloss.dliflc.edu', url: 'https://gloss.dliflc.edu', tag: 'free',
          note: 'Hundreds of free graded MSA reading and listening lessons from the Defense Language Institute, each with comprehension exercises and level labels.' },
        { name: 'Al Jazeera Learning Arabic', where: 'learning.aljazeera.net', url: 'https://learning.aljazeera.net', tag: 'free',
          note: 'Free levelled courses built from real media Arabic, with a placement test, graded articles and exercises. Your bridge from textbook to news.' },
        { name: 'ArabicPod101', where: 'arabicpod101.com + YouTube', url: 'https://www.arabicpod101.com', tag: 'freemium',
          note: 'Large podcast-style lesson library. A substantial amount sits on the free tier and the YouTube channel is entirely free. Good early ear training.' },
        { name: 'Learn Arabic with Maha · ArabicMike', where: 'YouTube', url: 'https://www.youtube.com/results?search_query=learn+arabic+with+maha', tag: 'free',
          note: 'Friendly beginner video lessons on pronunciation, phrases and culture. Motivation fuel between textbook sessions.' },
        { name: 'Wikibooks Arabic', where: 'en.wikibooks.org/wiki/Arabic', url: 'https://en.wikibooks.org/wiki/Arabic', tag: 'free',
          note: 'An open textbook covering script, grammar and vocabulary — a useful second explanation whenever a concept refuses to click.' },
        { name: 'Peace Corps language courses', where: 'archive.org / Peace Corps digital library', url: 'https://archive.org/search?query=peace+corps+arabic', tag: 'pd',
          note: 'Public-domain courses with audio. Mostly dialect (Moroccan, Jordanian) — use for listening and speaking, not for fuṣḥā grammar.' },
        { name: 'HelloTalk · Tandem', where: 'Apps', url: 'https://www.hellotalk.com', tag: 'freemium',
          note: 'Free language exchange with native speakers — trade your English for their Arabic. Ten minutes of daily chat cements what the textbook only explains.' },
        { name: 'Mango Languages via your library card', where: 'Most public libraries', url: 'https://mangolanguages.com', tag: 'free',
          note: 'A paid course that is free through most public library systems. Check your library\'s digital resources page before paying for anything.' },
        { name: 'Anki', where: 'apps.ankiweb.net', url: 'https://apps.ankiweb.net', tag: 'free',
          note: 'Install it now, not later. Free on desktop, web and Android. Every new word from every phase goes here or it will not stay.' }
      ]
    },

    {
      id: 'p3',
      num: '٣',
      short: 'Naḥw & Ṣarf',
      title: 'The Grammar Core — Naḥw & Ṣarf',
      goal: 'Parse any fully-vowelled sentence; know iʿrāb and the ten verb forms cold.',
      time: '6–12 months, alongside Phase 4',
      hours: '250–500 h',
      intro:
        'Arabic grammar is two sciences. Naḥw (النحو) is syntax — how case endings mark a word\'s job in the sentence. Ṣarf (الصرف) is morphology — how one three-letter root such as ك-ت-ب throws off كِتَاب "book", كَاتِب "writer", مَكْتَبَة "library" and مَكْتُوب "written". This phase is the hinge of the whole journey: it converts reading words into understanding sentences.',
      exit: 'Given an unvowelled sentence, you can supply the case endings and justify each one.',
      resources: [
        { name: 'Madinah Books 1–3 (Dr. V. Abdur Rahim)', where: 'lqtoronto.com', url: 'https://lqtoronto.com/books.html', tag: 'free', best: 'The classic path',
          note: 'The Madinah University series that taught Arabic-through-Arabic to millions. LQToronto hosts the complete books, answer keys, handouts and Br. Asif Meherali\'s full video class series — all free.' },
        { name: 'Learn Arabic Online (Shariah Program)', where: 'learnarabiconline.com', url: 'https://learnarabiconline.com', tag: 'free',
          note: 'Deep, clearly written free articles on naḥw and ṣarf in English. Among the best explanations of iʿrāb and the verb forms available anywhere.' },
        { name: 'Madinah Book full video walkthroughs', where: 'YouTube — search "Madinah Book 1 full course"', url: 'https://www.youtube.com/results?search_query=madinah+book+1+full+course', tag: 'free',
          note: 'Several complete free video series exist for each book. Pick one teacher whose pace suits you and finish the whole series with them — switching teachers mid-book costs weeks.' },
        { name: 'Al-Ājurrūmiyya (متن الآجرومية)', where: 'Free PDF + free commentaries', url: 'https://archive.org/search?query=ajurrumiyyah', tag: 'pd',
          note: 'The 700-year-old naḥw primer every classical student memorises. Short enough to learn by heart, and it reorganises everything you know into the traditional categories.' },
        { name: 'Wright — A Grammar of the Arabic Language', where: 'archive.org', url: 'https://archive.org/details/grammarofarabicl01wriguoft', tag: 'pd',
          note: 'The monumental 19th-century reference grammar of Classical Arabic, out of copyright. Not a course — a reference you will consult for years.' },
        { name: 'Howell — A Grammar of the Classical Arabic Language', where: 'archive.org', url: 'https://archive.org/search?query=howell+grammar+classical+arabic', tag: 'pd',
          note: 'A translation of the classical Arabic grammarians themselves. Advanced, exhaustive, and the closest free thing to reading the tradition in English.' },
        { name: 'Qutrub conjugator', where: 'qutrub.arabeyes.org', url: 'https://qutrub.arabeyes.org', tag: 'free',
          note: 'Conjugates any verb in every form, tense, mood and voice. Check your ṣarf tables against it rather than guessing.' },
        { name: 'ACON Arabic verb conjugator', where: 'acon.baykal.be', url: 'https://acon.baykal.be', tag: 'free',
          note: 'A second conjugator with a clearer table layout for the derived forms. Useful for spotting the pattern rather than the individual word.' },
        { name: 'Anki decks: verb forms, broken plurals, Madinah vocab', where: 'ankiweb.net — shared decks', url: 'https://ankiweb.net/shared/decks?search=arabic', tag: 'free',
          note: 'Free shared decks for the ten forms, the common broken-plural patterns, and the vocabulary of each Madinah book.' },
        { name: 'Selections from the Glorious Qur\'an (V. Abdur Rahim)', where: 'Free PDF', url: 'https://archive.org/search?query=selections+from+the+glorious+quran+abdur+rahim', tag: 'free',
          note: 'The same author\'s grammar-annotated Qur\'anic reader. The natural bridge from Madinah Book 3 into Phase 5.' },
        { name: 'Arabic with Husna (Bayyinah)', where: 'YouTube', url: 'https://www.youtube.com/results?search_query=arabic+with+husna', tag: 'free',
          note: 'Nouman Ali Khan teaching his daughter Arabic grammar on camera, free in full. Unusually good at making iʿrāb intuitive for English speakers.' }
      ]
    },

    {
      id: 'p4',
      num: '٤',
      short: 'Vocabulary',
      title: 'Vocabulary & Immersion',
      goal: '3,000–5,000 word families; comfortable graded reading and listening.',
      time: 'Ongoing from month 4',
      hours: '20–40 min daily, indefinitely',
      intro:
        'Grammar without vocabulary stalls. Learn words in root families, not as isolated pairs: once ك-ت-ب is yours, a dozen words come with it. Prioritise ruthlessly — roughly 300 root families account for the great majority of the Qur\'an\'s ~77,000 words.',
      exit: 'You read a page of graded Arabic and look up fewer than five words.',
      resources: [
        { name: 'Qur\'anic frequency vocabulary — the "80% words"', where: 'understandquran.com', url: 'https://www.understandquran.com', tag: 'free', best: 'Highest leverage',
          note: 'Understand Quran Academy\'s free short course and printable lists target exactly the highest-frequency Qur\'anic words. Nothing else in this library pays back faster.' },
        { name: 'Quranic Arabic Corpus — word-by-word', where: 'corpus.quran.com/wordbyword.jsp', url: 'https://corpus.quran.com/wordbyword.jsp', tag: 'free',
          note: 'Every word tagged with root and morphology, so you can mine vocabulary by root and see all its occurrences at once.' },
        { name: 'Anki + shared Arabic decks', where: 'apps.ankiweb.net', url: 'https://apps.ankiweb.net', tag: 'free',
          note: 'Spaced repetition is not optional at this volume. Strong free decks exist for MSA frequency lists, Madinah vocabulary and Qur\'anic word lists — or build your own from what you read.' },
        { name: 'Qaṣaṣ al-Nabiyyīn (Abul Ḥasan ʿAlī Nadwī)', where: 'archive.org', url: 'https://archive.org/search?query=qasas+an+nabiyyin', tag: 'pd',
          note: 'Stories of the Prophets in graded simple Classical Arabic, written for children in Arabic-medium schools. The traditional first real book after the Madinah series.' },
        { name: 'Al-Qirāʾa al-Rāshida', where: 'archive.org', url: 'https://archive.org/search?query=al+qiraatu+ar+rashida', tag: 'pd',
          note: 'A three-volume graded reader by the same author, fully vowelled. Read it aloud — it is written to be read aloud.' },
        { name: '3asafeer', where: '3asafeer.com', url: 'https://3asafeer.com', tag: 'freemium',
          note: 'Levelled Arabic children\'s stories with ḥarakāt and audio. The free tier gives you plenty of reading at exactly the right difficulty.' },
        { name: 'Al Jazeera & BBC Arabic', where: 'aljazeera.net · bbc.com/arabic', url: 'https://www.bbc.com/arabic', tag: 'free',
          note: 'Real MSA every day. Read one headline properly rather than one article badly, and mine both for Anki cards.' },
        { name: 'Forvo', where: 'forvo.com', url: 'https://forvo.com/languages/ar', tag: 'free',
          note: 'Native pronunciations of individual words, often from several countries. Settle pronunciation questions here, not by guessing from the spelling.' },
        { name: 'YouGlish Arabic', where: 'youglish.com/arabic', url: 'https://youglish.com/arabic', tag: 'free',
          note: 'Jumps to every YouTube moment where a word is actually spoken. The fastest way to learn how a word behaves in real sentences.' },
        { name: 'Readlang / Language Reactor', where: 'readlang.com', url: 'https://readlang.com', tag: 'freemium',
          note: 'Click-to-translate while reading Arabic web pages, with words exported to flashcards. Removes the friction that stops most people reading.' },
        { name: 'r/learn_arabic', where: 'reddit.com/r/learn_arabic', url: 'https://www.reddit.com/r/learn_arabic', tag: 'free',
          note: 'Active community for corrections, resource finds and study partners for the Madinah books. Post your own sentences and get them fixed.' },
        { name: 'Arabic frequency word lists', where: 'invokeit / Wiktionary frequency lists', url: 'https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists', tag: 'free',
          note: 'Top-5,000 MSA lists derived from subtitle and news corpora. Use them to audit your vocabulary for holes, not as a deck to grind front to back.' }
      ]
    },

    {
      id: 'p5',
      num: '٥',
      short: 'Qur\'anic',
      title: 'Qur\'anic Arabic',
      goal: 'Read any āyah and identify every word\'s root, form and grammatical role.',
      time: '6–12 months, overlapping Phases 3–4',
      hours: '200–400 h',
      intro:
        'Now grammar and vocabulary converge on the text itself. The tools below dissect the Qur\'an word by word — root, morphology, iʿrāb and full syntax trees — entirely free. Work with one short sūra at a time until you can account for every ending in it.',
      exit: 'You can take an unseen page of Juz\' ʿAmma and explain the grammar of every word without a translation open.',
      resources: [
        { name: 'The Quranic Arabic Corpus', where: 'corpus.quran.com', url: 'https://corpus.quran.com', tag: 'free', best: 'The crown jewel',
          note: 'Every word annotated with morphology, part of speech, root and dependency-grammar syntax trees, plus word-by-word translation and a morphological search engine. A complete grammar laboratory, free.' },
        { name: 'Quran.com', where: 'quran.com', url: 'https://quran.com', tag: 'free',
          note: 'Word-by-word translation and audio, multiple translations, tafsīr panels, root lookups and reciter-by-reciter playback. The best general reading interface.' },
        { name: 'QuranWBW', where: 'quranwbw.com', url: 'https://quranwbw.com', tag: 'free',
          note: 'Word-by-word display with per-word audio, transliteration and direct links into the corpus entry for each word.' },
        { name: 'Tanzil', where: 'tanzil.net', url: 'https://tanzil.net', tag: 'free',
          note: 'Clean, verified Qur\'an text in several orthographies, with free downloads for building your own decks, apps and study sheets.' },
        { name: 'Understand Quran Academy — free course', where: 'understandquran.com', url: 'https://www.understandquran.com/learn-quranic-arabic-in-few-hours', tag: 'free',
          note: 'A structured course built on the highest-frequency words plus just enough grammar to parse them. Designed for people with 30 minutes a day.' },
        { name: 'Openburhan', where: 'openburhan.net', url: 'https://www.openburhan.net', tag: 'free',
          note: 'Root-based Qur\'anic search: enter a root and see every derived word in every verse. Excellent for feeling how a root\'s meaning spreads.' },
        { name: 'Iʿrāb al-Qur\'ān works', where: 'archive.org / shamela', url: 'https://archive.org/search?query=%D8%A5%D8%B9%D8%B1%D8%A7%D8%A8+%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86', tag: 'pd',
          note: 'Classical verse-by-verse grammatical analyses (al-Darwīsh, al-Nahhās and others) in free scanned editions. Check your own parsing against theirs.' },
        { name: 'Bayyinah TV', where: 'bayyinahtv.com', url: 'https://bayyinahtv.com', tag: 'freemium',
          note: 'Paid platform with a large free sample library and a free YouTube channel. Strong on Qur\'anic style and word choice rather than tables.' },
        { name: 'Quranic (app)', where: 'Android / iOS', url: 'https://quranicapp.com', tag: 'freemium',
          note: 'Gamified drilling of the highest-frequency Qur\'anic words. The free tier covers a useful chunk; good for commuting minutes.' },
        { name: 'Sūrat al-Fātiḥa deep-dive lectures', where: 'YouTube', url: 'https://www.youtube.com/results?search_query=surah+al+fatiha+grammar+analysis', tag: 'free',
          note: 'Dozens of free hour-by-hour grammatical analyses of single sūras. One well-chosen sūra studied to exhaustion teaches more than ten skimmed.' }
      ]
    },

    {
      id: 'p6',
      num: '٦',
      short: 'Texts',
      title: 'The Classical Text Ladder',
      goal: 'Read unvowelled classical prose — hadith, tafsīr, adab — at reading speed.',
      time: '12+ months',
      hours: 'Continuous',
      intro:
        'Classical Arabic is learned by climbing a ladder of texts, each one slightly harder than the last, in the order students have used for centuries. Do not skip rungs: the jump from a graded reader straight to al-Ṭabarī is where most self-learners quit.',
      exit: 'You finish a page of Tafsīr al-Jalālayn or Riyāḍ al-Ṣāliḥīn without a dictionary and without translating in your head.',
      ladder: [
        { step: 1, ar: 'قصص النبيين', name: 'Qaṣaṣ al-Nabiyyīn', what: 'Graded stories of the prophets, fully vowelled', why: 'First real book — simple Classical style, written for learners' },
        { step: 2, ar: 'القراءة الراشدة', name: 'Al-Qirāʾa al-Rāshida', what: 'Three-volume graded reader', why: 'Widens vocabulary while the grammar stays gentle' },
        { step: 3, ar: 'الآجرومية', name: 'Al-Ājurrūmiyya', what: 'The short naḥw primer, memorised', why: 'Reorganises your grammar into the classical categories' },
        { step: 4, ar: 'رياض الصالحين', name: 'Riyāḍ al-Ṣāliḥīn', what: 'Hadith collection, short numbered texts', why: 'Real Classical Arabic in bite-sized units, free on sunnah.com' },
        { step: 5, ar: 'تفسير الجلالين', name: 'Tafsīr al-Jalālayn', what: 'The most concise classical tafsīr', why: 'Teaches you to read commentary — and it explains the Qur\'an in Arabic' },
        { step: 6, ar: 'قطر الندى', name: 'Qaṭr al-Nadā', what: 'Ibn Hishām\'s intermediate naḥw text', why: 'The step between the primer and the Alfiyya' },
        { step: 7, ar: 'كليلة ودمنة', name: 'Kalīla wa-Dimna', what: 'Classical animal fables', why: 'Elegant, famous prose that is still approachable' },
        { step: 8, ar: 'ألفية ابن مالك', name: 'Alfiyya of Ibn Mālik', what: '1,000 lines of versified grammar + Ibn ʿAqīl\'s commentary', why: 'The traditional capstone of naḥw study' },
        { step: 9, ar: 'المعلقات', name: 'Al-Muʿallaqāt', what: 'Pre-Islamic odes', why: 'The hardest and highest register — the language the Qur\'an addressed' }
      ],
      resources: [
        { name: 'Sunnah.com', where: 'sunnah.com', url: 'https://sunnah.com', tag: 'free',
          note: 'The major hadith collections in Arabic with English alongside, searchable. Riyāḍ al-Ṣāliḥīn here is the ideal daily classical-reading habit.' },
        { name: 'Al-Maktaba al-Shāmila', where: 'shamela.ws', url: 'https://shamela.ws', tag: 'free', best: 'The great library',
          note: 'Tens of thousands of classical Arabic works, free, searchable, downloadable, with a desktop application. Effectively the entire tradition on your laptop.' },
        { name: 'Waqfeya', where: 'waqfeya.net', url: 'https://waqfeya.net', tag: 'free',
          note: 'High-quality scanned PDFs of printed classical editions — useful when you want the page layout and footnotes of a real edition.' },
        { name: 'Altafsir.com', where: 'altafsir.com', url: 'https://www.altafsir.com', tag: 'free',
          note: 'Dozens of tafsīr works side by side in Arabic, verse by verse, including al-Jalālayn and al-Ṭabarī.' },
        { name: 'Tafsir.app', where: 'tafsir.app', url: 'https://tafsir.app', tag: 'free',
          note: 'A fast modern interface for reading several tafsīrs against a single verse. The most pleasant way to do daily tafsīr reading.' },
        { name: 'Archive.org Arabic collection', where: 'archive.org', url: 'https://archive.org/details/arabiccollections', tag: 'pd',
          note: 'Scanned classical and modern Arabic books in the public domain, including most of the readers and grammars named on this page.' },
        { name: 'Adab.com', where: 'adab.com', url: 'https://www.adab.com', tag: 'free',
          note: 'A large free archive of Arabic poetry from the pre-Islamic period onward, organised by poet and era.' },
        { name: 'Islamhouse & Kalamullah', where: 'islamhouse.com · kalamullah.com', url: 'https://islamhouse.com', tag: 'free',
          note: 'Free Arabic and English Islamic books, including many of the classic learning texts as clean PDFs.' },
        { name: 'Al-Maktaba (al-maktaba.org)', where: 'al-maktaba.org', url: 'https://al-maktaba.org', tag: 'free',
          note: 'A web front-end over the Shamela corpus with better typography and linking. Easier to read for long stretches.' }
      ]
    },

    {
      id: 'p7',
      num: '٧',
      short: 'Tajwīd',
      title: 'Tajwīd & Recitation',
      goal: 'Recite with correct makhārij, ṣifāt, madd and waqf — ideally checked by a teacher.',
      time: '3–9 months, can start in Phase 1',
      hours: '100–200 h',
      intro:
        'Tajwīd is the applied phonetics of Qur\'anic recitation: where each letter is articulated, how long each vowel is held, where you may stop. It is the one part of this path that genuinely cannot be finished alone — the rules are learnable from a page, but your own mistakes are not audible to you. Learn the theory free, then have someone listen.',
      exit: 'You recite Juz\' ʿAmma applying the rules without thinking about them, and a qualified listener confirms it.',
      resources: [
        { name: 'Arabic101 makhārij series', where: 'youtube.com/@Arabic101', url: 'https://www.youtube.com/@Arabic101', tag: 'free', best: 'Best free theory',
          note: 'Articulation points explained and demonstrated slowly, letter by letter. Watch each one with a mirror and your hand on your throat.' },
        { name: 'EveryAyah', where: 'everyayah.com', url: 'https://everyayah.com', tag: 'free',
          note: 'Verse-by-verse audio from dozens of reciters at several speeds, free to stream and download. The backbone of repetition practice.' },
        { name: 'QuranicAudio', where: 'quranicaudio.com', url: 'https://quranicaudio.com', tag: 'free',
          note: 'Complete free recitations, including teaching (muʿallim) recordings where the reciter pauses for you to repeat.' },
        { name: 'Ḥuṣarī muʿallim recitation', where: 'everyayah.com / archive.org', url: 'https://archive.org/search?query=husary+muallim', tag: 'free',
          note: 'The classic call-and-response teaching recitation. Repeat after him daily; it is the closest free substitute for a teacher\'s modelling.' },
        { name: 'Learn Quran Tajwid (app)', where: 'Android / iOS', tag: 'freemium',
          note: 'Rule-by-rule lessons with colour-coded text and listening exercises. The free tier covers the core nūn-sākinah and madd rules.' },
        { name: 'Tarteel', where: 'tarteel.ai', url: 'https://www.tarteel.ai', tag: 'freemium',
          note: 'Listens to your recitation and flags where you deviate from the text. Not a substitute for a teacher\'s ear on tajwīd, but excellent for ḥifẓ accuracy.' },
        { name: 'Colour-coded tajwīd muṣḥaf', where: 'quran.com (tajwīd script) · free PDFs', url: 'https://quran.com', tag: 'free',
          note: 'Reading from a colour-coded muṣḥaf makes the rules visible while you recite, which is how they become automatic.' },
        { name: 'A live teacher — free options', where: 'Local masjid · volunteer halaqāt · online charities', tag: 'free',
          note: 'Most mosques run free Qur\'an circles, and several volunteer organisations offer free one-to-one online tajwīd sessions. Budget one weekly session; the rest of this phase is self-study.' }
      ]
    },

    {
      id: 'p8',
      num: '٨',
      short: 'Mastery',
      title: 'Mastery — Tafsīr, Balāgha & Independence',
      goal: 'Read the Qur\'an with the classical commentaries, and study Arabic in Arabic.',
      time: 'Years — this stage does not end',
      hours: 'A lifetime habit',
      intro:
        'At this point English resources stop being the fastest route. You switch to Arabic explanations of Arabic, add rhetoric (balāgha) to grammar, and read tafsīr as commentary rather than translation. The goal shifts from finishing a curriculum to keeping a daily habit.',
      exit: 'You choose your own next book — and read it in Arabic because that is simply the easier option.',
      resources: [
        { name: 'Al-Balāgha al-Wāḍiḥa', where: 'Free PDF (archive.org)', url: 'https://archive.org/search?query=%D8%A7%D9%84%D8%A8%D9%84%D8%A7%D8%BA%D8%A9+%D8%A7%D9%84%D9%88%D8%A7%D8%B6%D8%AD%D8%A9', tag: 'pd', best: 'Start balāgha here',
          note: 'The standard school textbook of Arabic rhetoric — bayān, maʿānī and badīʿ — with exercises. Clear enough to work through alone once your naḥw is solid.' },
        { name: 'Jawāhir al-Balāgha', where: 'shamela.ws / archive.org', url: 'https://shamela.ws', tag: 'pd',
          note: 'The classic reference on rhetoric, denser than al-Wāḍiḥa. Read it second, as a reference for the devices you meet in the Qur\'an.' },
        { name: 'Al-Naḥw al-Wāfī (ʿAbbās Ḥasan)', where: 'archive.org', url: 'https://archive.org/search?query=%D8%A7%D9%84%D9%86%D8%AD%D9%88+%D8%A7%D9%84%D9%88%D8%A7%D9%81%D9%8A', tag: 'pd',
          note: 'A four-volume modern Arabic reference grammar. Where you go when a construction defeats every English explanation.' },
        { name: 'Sharḥ Ibn ʿAqīl ʿalā al-Alfiyya', where: 'shamela.ws', url: 'https://shamela.ws', tag: 'pd',
          note: 'The standard commentary on the Alfiyya, and the traditional endpoint of formal naḥw study.' },
        { name: 'Tafsīr Ibn Kathīr · al-Ṭabarī · al-Saʿdī', where: 'quran.com · altafsir.com · tafsir.app', url: 'https://tafsir.app', tag: 'free',
          note: 'The major tafsīrs in full Arabic, free. Start with al-Saʿdī (clear modern Arabic), then al-Jalālayn, then Ibn Kathīr, then al-Ṭabarī.' },
        { name: 'Lisān al-ʿArab & al-Qāmūs al-Muḥīṭ', where: 'baheth.info · almaany.com', url: 'https://www.baheth.info', tag: 'pd',
          note: 'The great Arabic-to-Arabic dictionaries, searchable and free. Switching to a monolingual dictionary is the single clearest sign of arrival.' },
        { name: 'Arabic-language lectures & duroos', where: 'YouTube', url: 'https://www.youtube.com/results?search_query=%D8%AF%D8%B1%D9%88%D8%B3+%D8%A7%D9%84%D9%86%D8%AD%D9%88', tag: 'free',
          note: 'Thousands of hours of free classes taught in Arabic on naḥw, ṣarf, balāgha and tafsīr. Listening to a subject you already know is the fastest listening practice there is.' },
        { name: 'Journaly / italki notebooks', where: 'journaly.com · italki.com', url: 'https://journaly.com', tag: 'freemium',
          note: 'Write in Arabic and have natives correct it, free. Production is the skill this path neglects most; ten sentences a day fixes it.' }
      ]
    }
  ];

  /* ------------------------------------------------------- tools & lookups */
  const tools = [
    { name: 'Lane\'s Arabic–English Lexicon', where: 'ejtaal.net · laneslexicon.org', url: 'https://ejtaal.net/aa', tag: 'pd', kind: 'Dictionary',
      note: 'The deepest Arabic–English dictionary ever made, built entirely from the classical Arabic lexicons. Indispensable for Qur\'anic and classical study.' },
    { name: 'Arabic Almanac (Hans Wehr + Lane + more)', where: 'ejtaal.net/aa', url: 'https://ejtaal.net/aa', tag: 'free', kind: 'Dictionary',
      note: 'Searches several scanned dictionaries at once by root, including Hans Wehr and Lane. The one dictionary tool to bookmark first.' },
    { name: 'Almaany', where: 'almaany.com', url: 'https://www.almaany.com', tag: 'free', kind: 'Dictionary',
      note: 'Arabic–Arabic and Arabic–English, drawing on the classical dictionaries. Good for modern usage and definitions in Arabic.' },
    { name: 'Baheth', where: 'baheth.info', url: 'https://www.baheth.info', tag: 'free', kind: 'Dictionary',
      note: 'Searches Lisān al-ʿArab, al-Qāmūs al-Muḥīṭ, al-Ṣiḥāḥ and others together — classical Arabic defined in classical Arabic.' },
    { name: 'Wiktionary (Arabic)', where: 'en.wiktionary.org', url: 'https://en.wiktionary.org/wiki/Category:Arabic_lemmas', tag: 'free', kind: 'Dictionary',
      note: 'Surprisingly strong on roots, verb forms and full conjugation tables, with citations. Free and editable.' },
    { name: 'Reverso Context', where: 'context.reverso.net', url: 'https://context.reverso.net/translation/arabic-english', tag: 'freemium', kind: 'Usage',
      note: 'Shows a word inside thousands of real bilingual sentences. Use it for usage and register, never as a dictionary definition.' },
    { name: 'Aratools', where: 'aratools.com', url: 'https://www.aratools.com', tag: 'free', kind: 'Analyser',
      note: 'Morphological analyser: paste a word and it returns root, pattern and possible parses. Excellent for unvowelled text.' },
    { name: 'Qutrub', where: 'qutrub.arabeyes.org', url: 'https://qutrub.arabeyes.org', tag: 'free', kind: 'Analyser',
      note: 'Full conjugation of any verb in any form, with vowelling. Open-source and free.' },
    { name: 'Mishkal / Farasa diacritizer', where: 'tahadz.com/mishkal · farasa.qcri.org', url: 'https://tahadz.com/mishkal', tag: 'free', kind: 'Analyser',
      note: 'Automatically adds ḥarakāt to unvowelled text. Imperfect — treat its output as a hypothesis to check, which is itself good practice.' },
    { name: 'Quranic Arabic Corpus', where: 'corpus.quran.com', url: 'https://corpus.quran.com', tag: 'free', kind: 'Qur\'an',
      note: 'Morphology, syntax trees and a root-based concordance for the whole Qur\'an.' },
    { name: 'Tanzil', where: 'tanzil.net', url: 'https://tanzil.net', tag: 'free', kind: 'Qur\'an',
      note: 'Verified Qur\'an text in multiple orthographies with free bulk downloads for your own tools and decks.' },
    { name: 'Al-Maktaba al-Shāmila', where: 'shamela.ws', url: 'https://shamela.ws', tag: 'free', kind: 'Library',
      note: 'The classical library itself — searchable full text of tens of thousands of works.' },
    { name: 'Anki', where: 'apps.ankiweb.net', url: 'https://apps.ankiweb.net', tag: 'free', kind: 'Method',
      note: 'Free spaced repetition on desktop, web and Android (the iOS app is paid). The memory engine behind every phase here.' },
    { name: 'Forvo · YouGlish', where: 'forvo.com · youglish.com/arabic', url: 'https://youglish.com/arabic', tag: 'free', kind: 'Audio',
      note: 'Native pronunciation of single words, and every YouTube clip containing a given word.' }
  ];

  /* ------------------------------------------------------------- alphabet */
  // forms: isolated, initial, medial, final
  const alphabet = [
    { n: 1,  name: 'أَلِف',  tr: 'alif',  iso: 'ا', ini: 'ا',  med: 'ـا',  fin: 'ـا', sound: 'ā (long a) / seat for hamza', makhraj: 'Open mouth cavity (jawf) — no contact', group: 'moon', connects: false },
    { n: 2,  name: 'بَاء',   tr: 'bāʾ',   iso: 'ب', ini: 'بـ', med: 'ـبـ', fin: 'ـب', sound: 'b as in bat', makhraj: 'Both lips together', group: 'moon', connects: true },
    { n: 3,  name: 'تَاء',   tr: 'tāʾ',   iso: 'ت', ini: 'تـ', med: 'ـتـ', fin: 'ـت', sound: 't (dental, tongue on teeth)', makhraj: 'Tongue tip on the roots of the upper front teeth', group: 'sun', connects: true },
    { n: 4,  name: 'ثَاء',   tr: 'thāʾ',  iso: 'ث', ini: 'ثـ', med: 'ـثـ', fin: 'ـث', sound: 'th as in think', makhraj: 'Tongue tip against the edge of the upper front teeth', group: 'sun', connects: true },
    { n: 5,  name: 'جِيم',   tr: 'jīm',   iso: 'ج', ini: 'جـ', med: 'ـجـ', fin: 'ـج', sound: 'j as in jam (g in Egypt)', makhraj: 'Middle of tongue against the hard palate', group: 'moon', connects: true },
    { n: 6,  name: 'حَاء',   tr: 'ḥāʾ',   iso: 'ح', ini: 'حـ', med: 'ـحـ', fin: 'ـح', sound: 'ḥ — sharp breathy h, no English equivalent', makhraj: 'Middle of the throat', group: 'moon', connects: true },
    { n: 7,  name: 'خَاء',   tr: 'khāʾ',  iso: 'خ', ini: 'خـ', med: 'ـخـ', fin: 'ـخ', sound: 'kh as in Bach', makhraj: 'Nearest part of the throat to the mouth', group: 'moon', connects: true },
    { n: 8,  name: 'دَال',   tr: 'dāl',   iso: 'د', ini: 'د',  med: 'ـد',  fin: 'ـد', sound: 'd (dental)', makhraj: 'Tongue tip on the roots of the upper front teeth', group: 'sun', connects: false },
    { n: 9,  name: 'ذَال',   tr: 'dhāl',  iso: 'ذ', ini: 'ذ',  med: 'ـذ',  fin: 'ـذ', sound: 'th as in this', makhraj: 'Tongue tip against the edge of the upper front teeth', group: 'sun', connects: false },
    { n: 10, name: 'رَاء',   tr: 'rāʾ',   iso: 'ر', ini: 'ر',  med: 'ـر',  fin: 'ـر', sound: 'rolled r', makhraj: 'Tongue tip against the gum just behind the upper teeth', group: 'sun', connects: false },
    { n: 11, name: 'زَاي',   tr: 'zāy',   iso: 'ز', ini: 'ز',  med: 'ـز',  fin: 'ـز', sound: 'z as in zoo', makhraj: 'Tongue tip near the lower front teeth', group: 'sun', connects: false },
    { n: 12, name: 'سِين',   tr: 'sīn',   iso: 'س', ini: 'سـ', med: 'ـسـ', fin: 'ـس', sound: 's as in sun', makhraj: 'Tongue tip near the lower front teeth', group: 'sun', connects: true },
    { n: 13, name: 'شِين',   tr: 'shīn',  iso: 'ش', ini: 'شـ', med: 'ـشـ', fin: 'ـش', sound: 'sh as in ship', makhraj: 'Middle of tongue against the hard palate', group: 'sun', connects: true },
    { n: 14, name: 'صَاد',   tr: 'ṣād',   iso: 'ص', ini: 'صـ', med: 'ـصـ', fin: 'ـص', sound: 'emphatic s — heavy, back of tongue raised', makhraj: 'Tongue tip near the lower front teeth, tongue raised', group: 'sun', connects: true },
    { n: 15, name: 'ضَاد',   tr: 'ḍād',   iso: 'ض', ini: 'ضـ', med: 'ـضـ', fin: 'ـض', sound: 'emphatic d — the letter Arabic is named after', makhraj: 'Side of the tongue against the upper molars', group: 'sun', connects: true },
    { n: 16, name: 'طَاء',   tr: 'ṭāʾ',   iso: 'ط', ini: 'طـ', med: 'ـطـ', fin: 'ـط', sound: 'emphatic t', makhraj: 'Tongue tip on the roots of the upper teeth, tongue raised', group: 'sun', connects: true },
    { n: 17, name: 'ظَاء',   tr: 'ẓāʾ',   iso: 'ظ', ini: 'ظـ', med: 'ـظـ', fin: 'ـظ', sound: 'emphatic dh', makhraj: 'Tongue tip against the upper teeth edge, tongue raised', group: 'sun', connects: true },
    { n: 18, name: 'عَيْن',  tr: 'ʿayn',  iso: 'ع', ini: 'عـ', med: 'ـعـ', fin: 'ـع', sound: 'ʿ — voiced pharyngeal, a constricted throat sound', makhraj: 'Middle of the throat', group: 'moon', connects: true },
    { n: 19, name: 'غَيْن',  tr: 'ghayn', iso: 'غ', ini: 'غـ', med: 'ـغـ', fin: 'ـغ', sound: 'gh — like a French r', makhraj: 'Nearest part of the throat to the mouth', group: 'moon', connects: true },
    { n: 20, name: 'فَاء',   tr: 'fāʾ',   iso: 'ف', ini: 'فـ', med: 'ـفـ', fin: 'ـف', sound: 'f as in far', makhraj: 'Inside of lower lip against upper teeth', group: 'moon', connects: true },
    { n: 21, name: 'قَاف',   tr: 'qāf',   iso: 'ق', ini: 'قـ', med: 'ـقـ', fin: 'ـق', sound: 'q — k made far back in the throat', makhraj: 'Back of the tongue against the soft palate', group: 'moon', connects: true },
    { n: 22, name: 'كَاف',   tr: 'kāf',   iso: 'ك', ini: 'كـ', med: 'ـكـ', fin: 'ـك', sound: 'k as in kite', makhraj: 'Back of the tongue, just forward of qāf', group: 'moon', connects: true },
    { n: 23, name: 'لَام',   tr: 'lām',   iso: 'ل', ini: 'لـ', med: 'ـلـ', fin: 'ـل', sound: 'l as in lamp', makhraj: 'Sides and tip of the tongue against the upper gum', group: 'sun', connects: true },
    { n: 24, name: 'مِيم',   tr: 'mīm',   iso: 'م', ini: 'مـ', med: 'ـمـ', fin: 'ـم', sound: 'm as in moon', makhraj: 'Both lips, with nasal resonance', group: 'moon', connects: true },
    { n: 25, name: 'نُون',   tr: 'nūn',   iso: 'ن', ini: 'نـ', med: 'ـنـ', fin: 'ـن', sound: 'n as in noon', makhraj: 'Tongue tip on the gum above the front teeth, with ghunna', group: 'sun', connects: true },
    { n: 26, name: 'هَاء',   tr: 'hāʾ',   iso: 'ه', ini: 'هـ', med: 'ـهـ', fin: 'ـه', sound: 'h as in hat', makhraj: 'Deepest part of the throat', group: 'moon', connects: true },
    { n: 27, name: 'وَاو',   tr: 'wāw',   iso: 'و', ini: 'و',  med: 'ـو',  fin: 'ـو', sound: 'w, or ū when long', makhraj: 'Rounded lips', group: 'moon', connects: false },
    { n: 28, name: 'يَاء',   tr: 'yāʾ',   iso: 'ي', ini: 'يـ', med: 'ـيـ', fin: 'ـي', sound: 'y, or ī when long', makhraj: 'Middle of the tongue against the hard palate', group: 'moon', connects: true }
  ];

  const extraLetters = [
    { glyph: 'ء',  name: 'hamza', note: 'The glottal stop. Written alone or seated on ا و ي (أ ؤ ئ) depending on the surrounding vowels.' },
    { glyph: 'ة',  name: 'tāʾ marbūṭa', note: 'Word-final "tied t". Pronounced h when you stop on it, t when you continue. Marks most feminine nouns.' },
    { glyph: 'ى',  name: 'alif maqṣūra', note: 'A dotless yāʾ pronounced as long ā at the end of a word — عَلَى, مُوسَى.' },
    { glyph: 'لا', name: 'lām-alif', note: 'The obligatory ligature of ل + ا. Not a separate letter, but it must be written this way.' },
    { glyph: 'ٱ',  name: 'alif waṣla', note: 'A "connecting" alif: pronounced only when starting on it, skipped when reading continuously.' }
  ];

  const diacritics = [
    { mark: 'ـَ',  name: 'فَتْحَة', tr: 'fatḥa', does: 'Short a', ex: 'بَ = ba' },
    { mark: 'ـِ',  name: 'كَسْرَة', tr: 'kasra', does: 'Short i', ex: 'بِ = bi' },
    { mark: 'ـُ',  name: 'ضَمَّة', tr: 'ḍamma', does: 'Short u', ex: 'بُ = bu' },
    { mark: 'ـْ',  name: 'سُكُون', tr: 'sukūn', does: 'No vowel — the letter closes the syllable', ex: 'مِنْ = min' },
    { mark: 'ـّ',  name: 'شَدَّة', tr: 'shadda', does: 'Doubles the consonant; hold it', ex: 'رَبّ = rabb' },
    { mark: 'ـً',  name: 'تَنْوِين فَتْح', tr: 'tanwīn fatḥ', does: 'Final -an, marks an indefinite accusative', ex: 'كِتَابًا = kitāban' },
    { mark: 'ـٍ',  name: 'تَنْوِين كَسْر', tr: 'tanwīn kasr', does: 'Final -in, marks an indefinite genitive', ex: 'كِتَابٍ = kitābin' },
    { mark: 'ـٌ',  name: 'تَنْوِين ضَمّ', tr: 'tanwīn ḍamm', does: 'Final -un, marks an indefinite nominative', ex: 'كِتَابٌ = kitābun' },
    { mark: 'آ',  name: 'مَدَّة', tr: 'madda', does: 'Hamza followed by long ā', ex: 'آمَنَ = āmana' },
    { mark: 'ـٰ',  name: 'أَلِف خَنْجَرِيَّة', tr: 'dagger alif', does: 'A long ā that is not written as a full alif', ex: 'هَٰذَا = hādhā' }
  ];

  const scriptFacts = [
    { k: 'Direction', v: 'Right to left; numerals still run left to right.' },
    { k: 'Letters', v: '28, all consonants (with ا و ي doubling as long vowels).' },
    { k: 'Non-connectors', v: 'ا د ذ ر ز و — six letters join from the right only, so a word breaks after them.' },
    { k: 'No capitals', v: 'There is no upper case and no distinct print/cursive divide — all writing is cursive.' },
    { k: 'Vowelling', v: 'Ḥarakāt appear in the Qur\'an, poetry and children\'s books; ordinary text omits them and you supply them from grammar.' },
    { k: 'Sun & moon', v: 'The ل of الـ assimilates into the 14 "sun" letters (ash-shams) but is pronounced before the 14 "moon" letters (al-qamar).' }
  ];

  /* ------------------------------------------------------------- grammar */
  const verbForms = [
    { rn: 'I',    past: 'فَعَلَ',      pres: 'يَفْعَلُ',      masdar: 'فِعْل / فَعْل',  sense: 'The base meaning of the root', ex: 'كَتَبَ — he wrote', quran: 'قَالَ — he said' },
    { rn: 'II',   past: 'فَعَّلَ',     pres: 'يُفَعِّلُ',     masdar: 'تَفْعِيل',        sense: 'Intensive, or makes the verb take an object (causative)', ex: 'عَلَّمَ — he taught', quran: 'نَزَّلَ — He sent down gradually' },
    { rn: 'III',  past: 'فَاعَلَ',     pres: 'يُفَاعِلُ',     masdar: 'مُفَاعَلَة / فِعَال', sense: 'Doing something to or with someone else', ex: 'جَاهَدَ — he strove', quran: 'يُخَادِعُونَ — they seek to deceive' },
    { rn: 'IV',   past: 'أَفْعَلَ',    pres: 'يُفْعِلُ',      masdar: 'إِفْعَال',        sense: 'Causative — to make someone do the Form I action', ex: 'أَسْلَمَ — he submitted', quran: 'أَنْزَلَ — He sent down' },
    { rn: 'V',    past: 'تَفَعَّلَ',   pres: 'يَتَفَعَّلُ',   masdar: 'تَفَعُّل',        sense: 'Reflexive of Form II — the action comes back on the doer', ex: 'تَعَلَّمَ — he learned', quran: 'تَذَكَّرَ — he took heed' },
    { rn: 'VI',   past: 'تَفَاعَلَ',   pres: 'يَتَفَاعَلُ',   masdar: 'تَفَاعُل',        sense: 'Reflexive of Form III — mutual action between parties', ex: 'تَعَاوَنَ — they cooperated', quran: 'تَعَارَفُوا — that you may know one another' },
    { rn: 'VII',  past: 'اِنْفَعَلَ',  pres: 'يَنْفَعِلُ',    masdar: 'اِنْفِعَال',      sense: 'Passive or intransitive — the subject undergoes the action', ex: 'اِنْكَسَرَ — it broke', quran: 'اِنْقَلَبَ — he turned back' },
    { rn: 'VIII', past: 'اِفْتَعَلَ',  pres: 'يَفْتَعِلُ',    masdar: 'اِفْتِعَال',      sense: 'Reflexive or middle voice; often doing it for oneself', ex: 'اِجْتَمَعَ — they gathered', quran: 'اِسْتَمَعَ — he listened attentively' },
    { rn: 'IX',   past: 'اِفْعَلَّ',   pres: 'يَفْعَلُّ',     masdar: 'اِفْعِلَال',      sense: 'Colours and bodily defects only', ex: 'اِحْمَرَّ — it turned red', quran: 'اِسْوَدَّ — it turned black' },
    { rn: 'X',    past: 'اِسْتَفْعَلَ', pres: 'يَسْتَفْعِلُ', masdar: 'اِسْتِفْعَال',    sense: 'Seeking or considering the Form I meaning', ex: 'اِسْتَخْرَجَ — he extracted', quran: 'اِسْتَغْفَرَ — he sought forgiveness' }
  ];

  const cases = [
    { name: 'رَفْع', tr: 'Rafʿ (nominative)', sing: 'ـُ / ـٌ', dual: 'ـَانِ', plural: 'ـُونَ', when: 'The subject of a nominal sentence (mubtadaʾ), its predicate (khabar), the doer of a verb (fāʿil), and the subject of kāna.' },
    { name: 'نَصْب', tr: 'Naṣb (accusative)', sing: 'ـَ / ـً', dual: 'ـَيْنِ', plural: 'ـِينَ', when: 'The object of a verb (mafʿūl bihi), the predicate of kāna, the subject of inna, adverbials of time and place, and the ḥāl.' },
    { name: 'جَرّ', tr: 'Jarr (genitive)', sing: 'ـِ / ـٍ', dual: 'ـَيْنِ', plural: 'ـِينَ', when: 'After any preposition (ḥarf jarr), and as the second term of a possessive construction (muḍāf ilayhi).' },
    { name: 'جَزْم', tr: 'Jazm (jussive — verbs only)', sing: 'ـْ', dual: '—', plural: 'drops the نون', when: 'After لَمْ, لَا (prohibition), لِـ (command) and in conditional sentences.' }
  ];

  const sentenceTypes = [
    { ar: 'جُمْلَة اِسْمِيَّة', name: 'Nominal sentence', shape: 'mubtadaʾ + khabar, both in rafʿ', ex: 'الْبَيْتُ كَبِيرٌ — the house is big', note: 'No verb "to be" in the present. Starts with a noun.' },
    { ar: 'جُمْلَة فِعْلِيَّة', name: 'Verbal sentence', shape: 'verb + fāʿil (rafʿ) + mafʿūl bihi (naṣb)', ex: 'كَتَبَ الطَّالِبُ الدَّرْسَ — the student wrote the lesson', note: 'Default word order is verb first; the verb stays singular before a plural subject.' },
    { ar: 'الإِضَافَة', name: 'Possessive construction (iḍāfa)', shape: 'muḍāf (no الـ, no tanwīn) + muḍāf ilayhi (jarr)', ex: 'بَيْتُ الرَّجُلِ — the man\'s house', note: 'The first term never takes الـ; definiteness comes from the second.' },
    { ar: 'الصِّفَة', name: 'Adjective phrase', shape: 'noun + adjective agreeing in case, number, gender, definiteness', ex: 'الْبَيْتُ الْكَبِيرُ — the big house', note: 'Four-way agreement is what distinguishes "the big house" from "the house is big".' },
    { ar: 'كَانَ وَأَخَوَاتُهَا', name: 'Kāna and its sisters', shape: 'Raises the subject, puts the predicate in naṣb', ex: 'كَانَ الْبَيْتُ كَبِيرًا — the house was big', note: 'The mirror image of inna.' },
    { ar: 'إِنَّ وَأَخَوَاتُهَا', name: 'Inna and its sisters', shape: 'Puts the subject in naṣb, leaves the predicate in rafʿ', ex: 'إِنَّ الْبَيْتَ كَبِيرٌ — indeed the house is big', note: 'إنّ، أنّ، لكنّ، كأنّ، ليت، لعلّ.' }
  ];

  const pronouns = [
    { person: '1st sing.', det: 'أَنَا', att: 'ـِي / ـنِي', gloss: 'I / my, me' },
    { person: '1st plural', det: 'نَحْنُ', att: 'ـنَا', gloss: 'we / our, us' },
    { person: '2nd masc. sing.', det: 'أَنْتَ', att: 'ـكَ', gloss: 'you / your (m.)' },
    { person: '2nd fem. sing.', det: 'أَنْتِ', att: 'ـكِ', gloss: 'you / your (f.)' },
    { person: '2nd dual', det: 'أَنْتُمَا', att: 'ـكُمَا', gloss: 'you two' },
    { person: '2nd masc. plural', det: 'أَنْتُمْ', att: 'ـكُمْ', gloss: 'you all (m.)' },
    { person: '2nd fem. plural', det: 'أَنْتُنَّ', att: 'ـكُنَّ', gloss: 'you all (f.)' },
    { person: '3rd masc. sing.', det: 'هُوَ', att: 'ـهُ', gloss: 'he / his, him' },
    { person: '3rd fem. sing.', det: 'هِيَ', att: 'ـهَا', gloss: 'she / her' },
    { person: '3rd dual', det: 'هُمَا', att: 'ـهُمَا', gloss: 'they two' },
    { person: '3rd masc. plural', det: 'هُمْ', att: 'ـهُمْ', gloss: 'they / their (m.)' },
    { person: '3rd fem. plural', det: 'هُنَّ', att: 'ـهُنَّ', gloss: 'they / their (f.)' }
  ];

  const plurals = [
    { pat: 'أَفْعَال', ex: 'قَلَم ← أَقْلَام', gloss: 'pen → pens', note: 'The most common plural for short three-letter nouns' },
    { pat: 'فُعُول', ex: 'بَيْت ← بُيُوت', gloss: 'house → houses', note: 'Very common for concrete objects' },
    { pat: 'فِعَال', ex: 'رَجُل ← رِجَال', gloss: 'man → men', note: 'Frequent for people and animals' },
    { pat: 'فُعَل', ex: 'غُرْفَة ← غُرَف', gloss: 'room → rooms', note: 'Typical plural of فُعْلَة nouns' },
    { pat: 'أَفْعِلَة', ex: 'طَعَام ← أَطْعِمَة', gloss: 'food → foods', note: 'For nouns with a long vowel in the middle' },
    { pat: 'فُعَلَاء', ex: 'عَالِم ← عُلَمَاء', gloss: 'scholar → scholars', note: 'People described by a quality' },
    { pat: 'أَفْعِلَاء', ex: 'نَبِيّ ← أَنْبِيَاء', gloss: 'prophet → prophets', note: 'Often for فَعِيل nouns of people' },
    { pat: 'مَفَاعِل', ex: 'مَسْجِد ← مَسَاجِد', gloss: 'mosque → mosques', note: 'Plural of place nouns beginning with م' },
    { pat: 'مَفَاعِيل', ex: 'مِفْتَاح ← مَفَاتِيح', gloss: 'key → keys', note: 'Place/instrument nouns with a long vowel' },
    { pat: 'فَوَاعِل', ex: 'شَارِع ← شَوَارِع', gloss: 'street → streets', note: 'Plural of many فَاعِل-shaped nouns' }
  ];

  /* --------------------------------------------------------------- tajwīd */
  const tajwid = [
    { rule: 'إِظْهَار', tr: 'Iẓhār', where: 'Nūn sākinah / tanwīn', letters: 'ء ه ع ح غ خ', how: 'Pronounce the n clearly, with no nasal hum carried over.', memo: 'The six throat letters' },
    { rule: 'إِدْغَام', tr: 'Idghām', where: 'Nūn sākinah / tanwīn', letters: 'ي ر م ل و ن', how: 'Merge the n into the next letter. With ghunna (2 counts) for ي ن م و; without ghunna for ل ر.', memo: 'يَرْمَلُون — yarmalūn' },
    { rule: 'إِقْلَاب', tr: 'Iqlāb', where: 'Nūn sākinah / tanwīn', letters: 'ب', how: 'Turn the n into a hidden m with ghunna held two counts.', memo: 'One letter only' },
    { rule: 'إِخْفَاء', tr: 'Ikhfāʾ', where: 'Nūn sākinah / tanwīn', letters: 'The remaining 15 letters', how: 'Hide the n between clear and merged, holding a ghunna for two counts.', memo: 'Everything not in the other three rules' },
    { rule: 'إِخْفَاء شَفَوِي', tr: 'Ikhfāʾ shafawī', where: 'Mīm sākinah', letters: 'ب', how: 'Lips lightly together, hide the m with ghunna.', memo: 'Mīm before bāʾ' },
    { rule: 'إِدْغَام شَفَوِي', tr: 'Idghām shafawī', where: 'Mīm sākinah', letters: 'م', how: 'Merge the two mīms into one with ghunna.', memo: 'Mīm before mīm' },
    { rule: 'إِظْهَار شَفَوِي', tr: 'Iẓhār shafawī', where: 'Mīm sākinah', letters: 'All other letters', how: 'Pronounce the m clearly, especially before و and ف.', memo: 'The default case' },
    { rule: 'قَلْقَلَة', tr: 'Qalqalah', where: 'Any sākin letter', letters: 'ق ط ب ج د', how: 'Give the letter a slight bounce or echo when it carries a sukūn.', memo: 'قُطْبُ جَدٍّ — quṭbu jad' },
    { rule: 'مَدّ طَبِيعِي', tr: 'Madd ṭabīʿī', where: 'Natural lengthening', letters: 'ا و ي', how: 'Hold the long vowel for two counts. The baseline all other madds are measured against.', memo: '2 counts' },
    { rule: 'مَدّ مُتَّصِل', tr: 'Madd muttaṣil', where: 'Madd + hamza in the same word', letters: 'ـَاء', how: 'Obligatory lengthening of 4–5 counts.', memo: 'Connected — one word' },
    { rule: 'مَدّ مُنْفَصِل', tr: 'Madd munfaṣil', where: 'Madd at word end + hamza starting the next', letters: 'ـَا ء', how: '4–5 counts in most recitations, 2 in some.', memo: 'Separated — two words' },
    { rule: 'مَدّ لَازِم', tr: 'Madd lāzim', where: 'Madd + a permanent sukūn or shadda', letters: 'ـَاّ', how: 'Six counts, always.', memo: 'The longest madd' },
    { rule: 'لَام شَمْسِيَّة', tr: 'Lām shamsiyya', where: 'الـ + a sun letter', letters: 'ت ث د ذ ر ز س ش ص ض ط ظ ل ن', how: 'The l is silent and the sun letter doubles: الشَّمْس = ash-shams.', memo: '14 sun letters' },
    { rule: 'لَام قَمَرِيَّة', tr: 'Lām qamariyya', where: 'الـ + a moon letter', letters: 'ء ب ج ح خ ع غ ف ق ك م ه و ي', how: 'The l is pronounced: الْقَمَر = al-qamar.', memo: '14 moon letters' }
  ];

  const makharij = [
    { area: 'الْجَوْف', tr: 'Jawf — the empty mouth cavity', points: 1, letters: 'ا و ي (as long vowels)', note: 'No contact anywhere; the sound simply flows.' },
    { area: 'الْحَلْق', tr: 'Ḥalq — the throat', points: 3, letters: 'ء ه · ع ح · غ خ', note: 'Deepest, middle and nearest — six letters English speakers must build from scratch.' },
    { area: 'اللِّسَان', tr: 'Lisān — the tongue', points: 10, letters: 'ق ك ج ش ي ض ل ن ر ط د ت ص ز س ظ ذ ث', note: 'Eighteen letters across ten precise points from the back of the tongue to its tip.' },
    { area: 'الشَّفَتَان', tr: 'Shafatān — the lips', points: 2, letters: 'ف · ب م و', note: 'Lower lip on the teeth for ف; the two lips for the rest.' },
    { area: 'الْخَيْشُوم', tr: 'Khayshūm — the nasal cavity', points: 1, letters: 'ghunna of ن and م', note: 'The nasal hum itself, not a letter — held for two counts.' }
  ];

  /* --------------------------------------------------- Qur'anic vocabulary */
  const functionWords = [
    { ar: 'مِنْ', tr: 'min', gloss: 'from, of, some of', role: 'Preposition — puts the next noun in jarr' },
    { ar: 'إِلَى', tr: 'ilā', gloss: 'to, towards', role: 'Preposition' },
    { ar: 'عَنْ', tr: 'ʿan', gloss: 'about, away from', role: 'Preposition' },
    { ar: 'عَلَى', tr: 'ʿalā', gloss: 'on, upon, against', role: 'Preposition' },
    { ar: 'فِي', tr: 'fī', gloss: 'in, within', role: 'Preposition' },
    { ar: 'بِـ', tr: 'bi-', gloss: 'with, by, in', role: 'Prefixed preposition' },
    { ar: 'لِـ', tr: 'li-', gloss: 'for, to, belonging to', role: 'Prefixed preposition; before a verb it means "so that"' },
    { ar: 'كَـ', tr: 'ka-', gloss: 'like, as', role: 'Prefixed preposition' },
    { ar: 'مَعَ', tr: 'maʿa', gloss: 'with, together with', role: 'Adverb of accompaniment' },
    { ar: 'عِنْدَ', tr: 'ʿinda', gloss: 'at, with, in the sight of', role: 'Adverb of place' },
    { ar: 'بَيْنَ', tr: 'bayna', gloss: 'between', role: 'Adverb of place' },
    { ar: 'قَبْلَ / بَعْدَ', tr: 'qabla / baʿda', gloss: 'before / after', role: 'Adverbs of time' },
    { ar: 'حَتَّى', tr: 'ḥattā', gloss: 'until, even', role: 'Preposition or particle' },
    { ar: 'وَ', tr: 'wa', gloss: 'and', role: 'Conjunction; also the particle of oath' },
    { ar: 'فَ', tr: 'fa', gloss: 'so, then, and so', role: 'Conjunction of sequence and consequence' },
    { ar: 'ثُمَّ', tr: 'thumma', gloss: 'then, thereafter', role: 'Conjunction — a longer gap than fa' },
    { ar: 'أَوْ', tr: 'aw', gloss: 'or', role: 'Conjunction' },
    { ar: 'بَلْ', tr: 'bal', gloss: 'rather, on the contrary', role: 'Conjunction of correction' },
    { ar: 'لَٰكِنَّ', tr: 'lākinna', gloss: 'but', role: 'Sister of inna — subject in naṣb' },
    { ar: 'إِنَّ', tr: 'inna', gloss: 'indeed, truly', role: 'Emphasis — subject in naṣb, predicate in rafʿ' },
    { ar: 'أَنَّ / أَنْ', tr: 'anna / an', gloss: 'that / to (with a verb)', role: 'Subordinator; أَنْ puts the following verb in naṣb' },
    { ar: 'كَانَ', tr: 'kāna', gloss: 'he/it was', role: 'Verb — predicate goes into naṣb' },
    { ar: 'لَيْسَ', tr: 'laysa', gloss: 'is not', role: 'Negating verb, sister of kāna' },
    { ar: 'مَا', tr: 'mā', gloss: 'not; what; that which', role: 'Negation of the past, or a relative pronoun' },
    { ar: 'لَا', tr: 'lā', gloss: 'no, not', role: 'Negation of the present, or prohibition with jazm' },
    { ar: 'لَمْ', tr: 'lam', gloss: 'did not', role: 'Negates the past using a jussive verb' },
    { ar: 'لَنْ', tr: 'lan', gloss: 'will never', role: 'Negates the future; verb in naṣb' },
    { ar: 'قَدْ', tr: 'qad', gloss: 'indeed / sometimes', role: 'Certainty with the past, possibility with the present' },
    { ar: 'إِذَا', tr: 'idhā', gloss: 'when (it happens)', role: 'Condition expected to occur' },
    { ar: 'إِنْ', tr: 'in', gloss: 'if', role: 'Hypothetical condition; both verbs take jazm' },
    { ar: 'لَوْ', tr: 'law', gloss: 'if (contrary to fact)', role: 'Unreal condition' },
    { ar: 'مَنْ', tr: 'man', gloss: 'who, whoever', role: 'Interrogative or conditional' },
    { ar: 'مَاذَا', tr: 'mādhā', gloss: 'what?', role: 'Interrogative' },
    { ar: 'كَيْفَ', tr: 'kayfa', gloss: 'how?', role: 'Interrogative' },
    { ar: 'أَيْنَ', tr: 'ayna', gloss: 'where?', role: 'Interrogative' },
    { ar: 'مَتَى', tr: 'matā', gloss: 'when?', role: 'Interrogative' },
    { ar: 'لِمَاذَا', tr: 'limādhā', gloss: 'why?', role: 'Interrogative' },
    { ar: 'هَلْ / أَ', tr: 'hal / a-', gloss: 'yes-or-no question marker', role: 'Interrogative particle' },
    { ar: 'الَّذِي / الَّتِي', tr: 'alladhī / allatī', gloss: 'who, which (m./f.)', role: 'Relative pronoun — needs a definite antecedent' },
    { ar: 'هَٰذَا / هَٰذِهِ', tr: 'hādhā / hādhihi', gloss: 'this (m./f.)', role: 'Demonstrative' },
    { ar: 'ذَٰلِكَ / تِلْكَ', tr: 'dhālika / tilka', gloss: 'that (m./f.)', role: 'Demonstrative' },
    { ar: 'كُلّ', tr: 'kull', gloss: 'each, every, all', role: 'Quantifier — takes iḍāfa' },
    { ar: 'بَعْض', tr: 'baʿḍ', gloss: 'some of', role: 'Quantifier — takes iḍāfa' },
    { ar: 'غَيْر', tr: 'ghayr', gloss: 'other than, not', role: 'Negating noun — takes iḍāfa' },
    { ar: 'إِلَّا', tr: 'illā', gloss: 'except, but', role: 'Exception particle' },
    { ar: 'أَيْضًا / كَذَٰلِكَ', tr: 'ayḍan / kadhālika', gloss: 'also / likewise', role: 'Adverbial connectors' }
  ];

  // Approximate root-family totals. Counting method varies between sources;
  // treat these as orders of magnitude, not exact figures.
  const roots = [
    { root: 'ق و ل', gloss: 'to say', count: '≈1,700', ex: 'قَالَ، قُلْ، يَقُولُونَ' },
    { root: 'ك و ن', gloss: 'to be, become', count: '≈1,390', ex: 'كَانَ، يَكُونُ، كُنْ' },
    { root: 'ر ب ب', gloss: 'lord, to nurture', count: '≈980', ex: 'رَبّ، رَبَّنَا، الْأَرْبَاب' },
    { root: 'ء م ن', gloss: 'to believe, be safe', count: '≈880', ex: 'آمَنَ، مُؤْمِن، إِيمَان، أَمَانَة' },
    { root: 'ع ل م', gloss: 'to know', count: '≈855', ex: 'عَلِمَ، عِلْم، عَالِم، عَلَّمَ، مَعْلُوم' },
    { root: 'ء ت ي', gloss: 'to come, bring', count: '≈550', ex: 'أَتَى، آتَى، يَأْتِي' },
    { root: 'ك ف ر', gloss: 'to disbelieve, cover', count: '≈525', ex: 'كَفَرَ، كَافِر، كُفْر' },
    { root: 'ش ي ء', gloss: 'thing; to will', count: '≈520', ex: 'شَيْء، شَاءَ، يَشَاءُ' },
    { root: 'ر س ل', gloss: 'to send; messenger', count: '≈510', ex: 'رَسُول، أَرْسَلَ، رِسَالَة' },
    { root: 'ي و م', gloss: 'day', count: '≈475', ex: 'يَوْم، الْيَوْم، أَيَّام' },
    { root: 'ء ر ض', gloss: 'earth, land', count: '≈460', ex: 'الْأَرْض' },
    { root: 'ء ل ه', gloss: 'god, deity', count: '≈150 (+ Allāh ≈2,700)', ex: 'إِلَٰه، آلِهَة، اللَّه' },
    { root: 'ن ا س', gloss: 'people, mankind', count: '≈240', ex: 'النَّاس، إِنْسَان، أُنَاس' },
    { root: 'س م و', gloss: 'sky, heaven; name', count: '≈380', ex: 'سَمَاء، السَّمَاوَات، اِسْم' },
    { root: 'ج ع ل', gloss: 'to make, place', count: '≈345', ex: 'جَعَلَ، نَجْعَلُ' },
    { root: 'ع م ل', gloss: 'to do, work', count: '≈360', ex: 'عَمِلَ، عَمَل، أَعْمَال' },
    { root: 'ك ت ب', gloss: 'to write; book', count: '≈320', ex: 'كِتَاب، كَتَبَ، مَكْتُوب' },
    { root: 'ه د ي', gloss: 'to guide', count: '≈315', ex: 'هَدَى، هُدًى، هِدَايَة، مُهْتَد' },
    { root: 'ن ف س', gloss: 'soul, self', count: '≈300', ex: 'نَفْس، أَنْفُس' },
    { root: 'ح ق ق', gloss: 'truth, right', count: '≈290', ex: 'الْحَقّ، حَقِيق' },
    { root: 'ن ز ل', gloss: 'to descend, send down', count: '≈290', ex: 'أَنْزَلَ، نَزَّلَ، تَنْزِيل' },
    { root: 'ء خ ذ', gloss: 'to take', count: '≈275', ex: 'أَخَذَ، يَأْخُذُ، اِتَّخَذَ' },
    { root: 'ء م ر', gloss: 'to command; affair', count: '≈250', ex: 'أَمَرَ، أَمْر، أُمُور' },
    { root: 'ء و ل', gloss: 'first, to return to', count: '≈250', ex: 'الْأَوَّل، أُولَٰئِك' },
    { root: 'ع ب د', gloss: 'to worship, serve', count: '≈275', ex: 'عَبَدَ، عَبْد، عِبَادَة' },
    { root: 'ب ي ن', gloss: 'to be clear; between', count: '≈525', ex: 'بَيَّنَ، بَيِّنَة، مُبِين، بَيْن' },
    { root: 'ذ ك ر', gloss: 'to remember, mention', count: '≈290', ex: 'ذَكَرَ، ذِكْر، تَذَكَّرَ' },
    { root: 'ء ذ ن', gloss: 'to permit; ear', count: '≈100', ex: 'أَذِنَ، إِذْن، أُذُن' },
    { root: 'خ ل ق', gloss: 'to create', count: '≈260', ex: 'خَلَقَ، خَالِق، خَلْق' },
    { root: 'ر ح م', gloss: 'mercy', count: '≈340', ex: 'رَحْمَٰن، رَحِيم، رَحْمَة' },
    { root: 'ص ل ح', gloss: 'to be righteous, put right', count: '≈180', ex: 'صَالِح، أَصْلَحَ، إِصْلَاح' },
    { root: 'ك ذ ب', gloss: 'to lie, deny', count: '≈280', ex: 'كَذَّبَ، كَاذِب، كَذِب' },
    { root: 'ء و م ن…', gloss: 'to fear (خ و ف)', count: '≈125', ex: 'خَافَ، خَوْف، يَخَافُونَ' },
    { root: 'س ب ح', gloss: 'to glorify, swim', count: '≈90', ex: 'سَبَّحَ، سُبْحَان، تَسْبِيح' },
    { root: 'ن ص ر', gloss: 'to help, give victory', count: '≈155', ex: 'نَصَرَ، نَصْر، نَاصِر' },
    { root: 'ص ب ر', gloss: 'to be patient', count: '≈100', ex: 'صَبَرَ، صَبْر، صَابِر' },
    { root: 'ظ ل م', gloss: 'to wrong; darkness', count: '≈315', ex: 'ظَلَمَ، ظَالِم، ظُلْمَات' },
    { root: 'ع ذ ب', gloss: 'punishment', count: '≈370', ex: 'عَذَاب، عَذَّبَ' },
    { root: 'ج ن ن', gloss: 'garden; to conceal; jinn', count: '≈200', ex: 'جَنَّة، جِنّ، مَجْنُون' },
    { root: 'ن ا ر', gloss: 'fire; light (ن و ر)', count: '≈340', ex: 'نَار، نُور، مُنِير' }
  ];

  /* ----------------------------------------------------------- study plan */
  const routines = [
    {
      budget: '30',
      label: '30 minutes a day',
      subtitle: 'The minimum that still compounds. Expect the far end of every time estimate.',
      blocks: [
        { min: 10, what: 'Anki reviews', how: 'Clear the due queue first, every single day. Never skip this block.' },
        { min: 15, what: 'Current lesson', how: 'One Madinah lesson section, or one corpus verse parsed word by word.' },
        { min: 5,  what: 'Read aloud', how: 'Re-read yesterday\'s text out loud. Sound, not silence — this is also your tajwīd practice.' }
      ]
    },
    {
      budget: '60',
      label: '1 hour a day',
      subtitle: 'The sweet spot. The phase timings on this page assume roughly this.',
      blocks: [
        { min: 15, what: 'Anki reviews', how: 'Due cards, plus 10–15 new cards mined from yesterday\'s reading.' },
        { min: 25, what: 'Grammar', how: 'One lesson of your main course, worked with pen and paper — write the exercises, don\'t just read them.' },
        { min: 15, what: 'Reading', how: 'Graded reader or Qur\'an with the corpus open. Parse every word of a short passage.' },
        { min: 5,  what: 'Recitation', how: 'Repeat after a muʿallim recording. Record yourself once a week and listen back.' }
      ]
    },
    {
      budget: '120',
      label: '2 hours a day',
      subtitle: 'Fast track. Realistic Qur\'anic reading comprehension inside 18 months.',
      blocks: [
        { min: 20, what: 'Anki reviews', how: 'Due cards plus 20–25 new. Keep the deck honest: delete cards you keep failing and rewrite them.' },
        { min: 40, what: 'Grammar', how: 'A full lesson plus its exercises, then explain the rule aloud to an imaginary student.' },
        { min: 30, what: 'Reading', how: 'A page of graded prose and half a page of Qur\'an, both parsed.' },
        { min: 20, what: 'Listening', how: 'Al Jazeera Learning, GLOSS, or an Arabic lecture on a topic you already know.' },
        { min: 10, what: 'Writing & recitation', how: 'Five sentences of your own in Arabic, then recite the day\'s passage aloud.' }
      ]
    }
  ];

  const weeklyRhythm = [
    { day: 'Mon–Fri', focus: 'New material', detail: 'Follow your daily block plan. New grammar and new vocabulary only on these days.' },
    { day: 'Saturday', focus: 'Consolidation', detail: 'No new lessons. Re-do the week\'s exercises, re-read every text, fix your Anki cards.' },
    { day: 'Sunday', focus: 'Free reading + a teacher', detail: 'Read something you enjoy above your level, and use your weekly tajwīd session or language exchange.' }
  ];

  const milestones = [
    { id: 'm1',  phase: 'p1', text: 'Write all 28 letters from memory in all four positions.' },
    { id: 'm2',  phase: 'p1', text: 'Read an unfamiliar fully-vowelled word aloud without decoding letter by letter.' },
    { id: 'm3',  phase: 'p1', text: 'Distinguish ح / ه, ق / ك, س / ص, د / ض by ear and produce each correctly.' },
    { id: 'm4',  phase: 'p2', text: 'Introduce yourself and describe your day in ten Arabic sentences.' },
    { id: 'm5',  phase: 'p2', text: 'Know 1,000 words well enough to recognise them instantly in context.' },
    { id: 'm6',  phase: 'p2', text: 'Finish Madinah Book 1 with all exercises written out.' },
    { id: 'm7',  phase: 'p3', text: 'Explain iḍāfa, the nominal sentence and the verbal sentence to someone else.' },
    { id: 'm8',  phase: 'p3', text: 'Recognise all ten verb forms in a text and state what each does to the root meaning.' },
    { id: 'm9',  phase: 'p3', text: 'Add correct case endings to an unvowelled paragraph and justify every one.' },
    { id: 'm10', phase: 'p3', text: 'Finish Madinah Books 2 and 3.' },
    { id: 'm11', phase: 'p4', text: 'Reach 3,000 word families in Anki with reviews kept current.' },
    { id: 'm12', phase: 'p4', text: 'Read a 3asafeer story or a graded news article with fewer than five lookups.' },
    { id: 'm13', phase: 'p5', text: 'Parse Sūrat al-Fātiḥa completely — every word\'s root, form and case.' },
    { id: 'm14', phase: 'p5', text: 'Parse all of Juz\' ʿAmma the same way.' },
    { id: 'm15', phase: 'p5', text: 'Understand a familiar sūra during ṣalāh without translating in your head.' },
    { id: 'm16', phase: 'p6', text: 'Finish Qaṣaṣ al-Nabiyyīn volume 1 unaided.' },
    { id: 'm17', phase: 'p6', text: 'Read ten hadith from Riyāḍ al-Ṣāliḥīn without a dictionary.' },
    { id: 'm18', phase: 'p6', text: 'Read a page of Tafsīr al-Jalālayn and follow the argument.' },
    { id: 'm19', phase: 'p7', text: 'Apply the nūn-sākinah and madd rules correctly without stopping to think.' },
    { id: 'm20', phase: 'p7', text: 'Have a qualified teacher listen to your recitation and confirm it.' },
    { id: 'm21', phase: 'p8', text: 'Use an Arabic-only dictionary as your first lookup, not your second.' },
    { id: 'm22', phase: 'p8', text: 'Follow an hour-long lecture delivered in Arabic on a subject you know.' },
    { id: 'm23', phase: 'p8', text: 'Choose and finish a classical book nobody assigned you.' }
  ];

  const principles = [
    { n: 'Daily beats heroic', t: 'Thirty minutes every day outruns four hours every Sunday. Arabic is a memory problem before it is an intelligence problem.' },
    { n: 'Finish one thing', t: 'One course, one reader, one deck at a time. Resource-hopping is the most common way this journey fails, and this page makes it easy to hop — resist that.' },
    { n: 'Always out loud', t: 'Read everything aloud. It builds pronunciation, listening and memory at once, and it is how the tradition has always been taught.' },
    { n: 'Roots, not words', t: 'Learn ك-ت-ب and you get a dozen words. Record every new word with its root and pattern from the very first day.' },
    { n: 'Grammar serves reading', t: 'Do not study naḥw as an end in itself. Every rule you learn should be applied to a real text the same week.' },
    { n: 'Get corrected', t: 'Self-study plateaus without feedback. A weekly exchange partner, halaqah or corrected paragraph is worth ten extra hours alone.' }
  ];

  const faqs = [
    { q: 'MSA, Classical, or a dialect — which do I learn?',
      a: 'For the Qur\'an: Classical, reached through MSA, which is what this path does. Classical and MSA share roughly 95% of their grammar; the differences are vocabulary and style. Dialects are separate spoken systems — pick one up later if you want to converse with people from a particular country, and do not let it replace fuṣḥā.' },
    { q: 'How long does this really take?',
      a: 'At an hour a day: 18–36 months to read the Qur\'an with grammatical understanding, and years beyond that to read classical prose comfortably. The Foreign Service Institute rates Arabic at roughly 2,200 class hours for professional working proficiency — one of the hardest languages for English speakers. That is a reason to start today, not a reason not to.' },
    { q: 'Do I need to memorise the Qur\'an to understand it?',
      a: 'No — they are separate skills that reinforce each other. Understanding makes memorisation dramatically easier, so if you plan to do both, front-load a little grammar first.' },
    { q: 'Can I skip the alphabet and use transliteration?',
      a: 'No. Transliteration cannot represent Arabic accurately, it hides the root structure your brain needs to see, and every serious resource assumes the script. Two to six weeks now saves years of handicap.' },
    { q: 'Is the Madinah series really the best free path?',
      a: 'It is the most complete free structured path, it teaches Arabic through Arabic, its vocabulary is Qur\'an-oriented, and free teachers, answer keys and videos exist for every lesson. If you finish only one thing on this page, finish that.' },
    { q: 'What if I stall?',
      a: 'Stalling almost always means one of three things: the material is too hard (drop one rung), reviews have piled up (halve your new-card rate for two weeks), or you are studying silently and alone (read aloud, and find one person to be accountable to).' }
  ];

  /* ------------------------------------------------------------- assemble */
  const allResources = [];
  phases.forEach(function (p) {
    p.resources.forEach(function (r, i) {
      r.id = p.id + '-r' + i;
      r.phase = p.id;
      r.phaseName = p.short;
      allResources.push(r);
    });
  });
  tools.forEach(function (t, i) {
    t.id = 'tool-r' + i;
    t.phase = 'tools';
    t.phaseName = 'Reference';
    allResources.push(t);
  });

  return {
    phases: phases,
    tools: tools,
    allResources: allResources,
    alphabet: alphabet,
    extraLetters: extraLetters,
    diacritics: diacritics,
    scriptFacts: scriptFacts,
    verbForms: verbForms,
    cases: cases,
    sentenceTypes: sentenceTypes,
    pronouns: pronouns,
    plurals: plurals,
    tajwid: tajwid,
    makharij: makharij,
    functionWords: functionWords,
    roots: roots,
    routines: routines,
    weeklyRhythm: weeklyRhythm,
    milestones: milestones,
    principles: principles,
    faqs: faqs,
    tags: {
      free: { label: 'Free', desc: 'Free to use, no payment at any point' },
      freemium: { label: 'Freemium', desc: 'Free tier is genuinely usable on its own' },
      pd: { label: 'Public domain', desc: 'Out of copyright — download and keep forever' }
    }
  };
})();
