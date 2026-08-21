import { Language } from "@/shared/i18n/translations";

type LocalizedArticle = {
  title: string;
  summary: string;
  body: string[];
};

export type LibraryArticle = {
  id: string;
  icon: string;
  color: string;
  minutes: number;
  content: Record<Language, LocalizedArticle>;
};

export const libraryArticles: LibraryArticle[] = [
  {
    id: "hard-day",
    icon: "☁",
    color: "#F2DDD4",
    minutes: 2,
    content: {
      en: {
        title: "When today feels heavy",
        summary: "A small permission to move slowly.",
        body: [
          "A difficult day does not mean you are failing. Sometimes getting through the next hour is enough.",
          "Try making the moment smaller: feel your feet on the floor, relax your shoulders, and name one thing you need right now.",
          "You do not have to solve everything today. Choose one kind next step, however small.",
        ],
      },
      uk: {
        title: "Коли сьогодні важко",
        summary: "Дозвіл сповільнитися й не вимагати від себе зайвого.",
        body: [
          "Важкий день не означає, що з тобою щось не так. Іноді достатньо просто пройти наступну годину.",
          "Спробуй звузити мить: відчуй стопи на підлозі, розслаб плечі й назви одну річ, яка потрібна тобі зараз.",
          "Не обов’язково вирішувати все сьогодні. Обери один добрий наступний крок, навіть зовсім маленький.",
        ],
      },
      ru: {
        title: "Когда сегодня тяжело",
        summary: "Разрешение замедлиться и не требовать от себя лишнего.",
        body: [
          "Тяжёлый день не означает, что с тобой что-то не так. Иногда достаточно просто прожить следующий час.",
          "Попробуй уменьшить масштаб момента: почувствуй стопы на полу, расслабь плечи и назови одну вещь, которая нужна тебе сейчас.",
          "Не обязательно решать всё сегодня. Выбери один добрый следующий шаг, даже совсем маленький.",
        ],
      },
    },
  },
  {
    id: "name-feeling",
    icon: "◇",
    color: "#E4E1F1",
    minutes: 3,
    content: {
      en: {
        title: "Naming what you feel",
        summary: "A gentle way to make emotions less overwhelming.",
        body: [
          "An emotion can feel enormous when it has no name. Try: “I notice sadness,” or “I notice tension.” This creates a little space between you and the feeling.",
          "Ask where you notice it in your body. Is it tight, warm, heavy, restless? You are observing, not judging.",
          "Finish with: “This feeling is here, and it can change.” Feelings are information, not instructions.",
        ],
      },
      uk: {
        title: "Назвати своє відчуття",
        summary: "М’який спосіб зробити емоції менш неосяжними.",
        body: [
          "Емоція може здаватися величезною, коли не має назви. Спробуй: «Я помічаю сум» або «Я помічаю напруження». Так між тобою і відчуттям з’являється трохи простору.",
          "Запитай, де це відчувається в тілі. Стиснення, тепло, важкість, неспокій? Ти просто спостерігаєш, а не оцінюєш.",
          "Заверши словами: «Це відчуття зараз зі мною, і воно може змінитися». Емоції — це інформація, а не наказ.",
        ],
      },
      ru: {
        title: "Назвать своё чувство",
        summary: "Бережный способ сделать эмоции менее подавляющими.",
        body: [
          "Эмоция может казаться огромной, когда у неё нет названия. Попробуй: «Я замечаю грусть» или «Я замечаю напряжение». Так между тобой и чувством появляется немного пространства.",
          "Спроси, где это чувствуется в теле. Сжатие, тепло, тяжесть, беспокойство? Ты просто наблюдаешь, а не оцениваешь.",
          "Заверши словами: «Это чувство сейчас со мной, и оно может измениться». Эмоции — это информация, а не приказ.",
        ],
      },
    },
  },
  {
    id: "self-kindness",
    icon: "♡",
    color: "#F3E6C9",
    minutes: 2,
    content: {
      en: {
        title: "Speak to yourself kindly",
        summary: "Use the voice you would offer a close friend.",
        body: [
          "Notice the sentence you are saying to yourself. Would you use those words with someone you love?",
          "Try replacing judgment with truth and care: “I am having a hard time, and I am still doing my best.”",
          "Kindness does not excuse mistakes. It gives you enough safety to learn from them.",
        ],
      },
      uk: {
        title: "Говори із собою дбайливо",
        summary: "Спробуй голос, яким підтримала б близьку людину.",
        body: [
          "Поміть фразу, яку говориш собі. Чи сказала б ти такі слова людині, яку любиш?",
          "Спробуй замінити осуд правдою й турботою: «Мені зараз важко, і я все одно роблю, що можу».",
          "Доброта не виправдовує помилок. Вона дає достатньо безпеки, щоб на них вчитися.",
        ],
      },
      ru: {
        title: "Говори с собой бережно",
        summary: "Попробуй голос, которым поддержала бы близкого человека.",
        body: [
          "Заметь фразу, которую говоришь себе. Сказала бы ты такие слова человеку, которого любишь?",
          "Попробуй заменить осуждение правдой и заботой: «Мне сейчас тяжело, и я всё равно делаю, что могу».",
          "Доброта не оправдывает ошибки. Она даёт достаточно безопасности, чтобы на них учиться.",
        ],
      },
    },
  },
  {
    id: "before-sleep",
    icon: "☾",
    color: "#DCE9EE",
    minutes: 3,
    content: {
      en: {
        title: "A softer end to the day",
        summary: "Three questions before rest.",
        body: [
          "What took energy from me today? Naming it helps your mind stop carrying it silently.",
          "What gave me even a little comfort? A warm drink, a message, quiet, or simply making it through all count.",
          "What can wait until tomorrow? Imagine setting it outside the room for the night. Rest is part of caring for yourself.",
        ],
      },
      uk: {
        title: "М’якше завершення дня",
        summary: "Три запитання перед відпочинком.",
        body: [
          "Що сьогодні забрало мою енергію? Назва допомагає розуму не нести це мовчки.",
          "Що дало мені хоча б трохи затишку? Теплий напій, повідомлення, тиша або просто те, що день прожито — усе важливе.",
          "Що може почекати до завтра? Уяви, що залишаєш це за дверима на ніч. Відпочинок — теж турбота про себе.",
        ],
      },
      ru: {
        title: "Более мягкое завершение дня",
        summary: "Три вопроса перед отдыхом.",
        body: [
          "Что сегодня забрало мою энергию? Название помогает разуму не нести это молча.",
          "Что дало мне хотя бы немного уюта? Тёплый напиток, сообщение, тишина или просто прожитый день — всё считается.",
          "Что может подождать до завтра? Представь, что оставляешь это за дверью на ночь. Отдых — тоже забота о себе.",
        ],
      },
    },
  },
];
