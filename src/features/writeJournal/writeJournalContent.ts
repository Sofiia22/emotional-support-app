import { JournalCategory } from "@/shared/state/AppProvider";
import { Language } from "@/shared/i18n/translations";

export type ScienceCategory =
  | "grief"
  | "sleep"
  | "memory"
  | "stress"
  | "healing"
  | "relationships";

export type ScienceArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: ScienceCategory;
  readTime: number;
  sections: { heading: string; body: string }[];
};

const articlesByLanguage: Record<Language, ScienceArticle[]> = {
  en: [
    { id: "focus", title: "Why grief can make it hard to concentrate", excerpt: "A gentle introduction to attention during difficult seasons.", category: "grief", readTime: 5, sections: [{ heading: "A gentle starting point", body: "Grief can make everyday tasks feel different. Give yourself permission to slow down, reduce demands where possible, and seek professional support when daily life feels unmanageable." }, { heading: "Small supports", body: "Short lists, quiet breaks, regular meals, and one task at a time may make the day feel more manageable. This sample educational copy is not medical advice and requires clinical review before release." }] },
    { id: "memory", title: "Why memories can suddenly feel overwhelming", excerpt: "Making room for memories without rushing yourself.", category: "memory", readTime: 5, sections: [{ heading: "Memories can arrive unexpectedly", body: "A familiar place, sound, or date may bring a strong memory. There is no single correct way to respond. Pause, notice what you need, and choose a supportive next step." }] },
    { id: "sleep", title: "What grief can do to sleep", excerpt: "Gentle ideas for nights that feel different.", category: "sleep", readTime: 4, sections: [{ heading: "Rest without pressure", body: "A steady evening routine and a quieter environment may support rest. If sleep problems persist or affect your safety, speak with a qualified healthcare professional." }] },
    { id: "healing", title: "Why healing doesn't happen in a straight line", excerpt: "A compassionate view of changing days.", category: "healing", readTime: 6, sections: [{ heading: "Different days can feel different", body: "Feeling better one day and heavier the next does not erase your progress. Healing can include rest, connection, remembrance, and professional care." }] },
    { id: "stress", title: "How stress shows up in the body", excerpt: "Notice signals with care rather than judgment.", category: "stress", readTime: 4, sections: [{ heading: "Listen gently", body: "Stress may be experienced in many ways. A brief pause can help you notice what your body needs. Seek medical guidance for new, severe, or worrying symptoms." }] },
  ],
  uk: [
    { id: "focus", title: "Чому під час горювання важко зосередитися", excerpt: "Дбайливе знайомство з увагою у складний період.", category: "grief", readTime: 5, sections: [{ heading: "М’який початок", body: "Горювання може змінити відчуття від звичних справ. Дозволь собі сповільнитися й звернися по професійну підтримку, якщо повсякденне життя стає нестерпним." }, { heading: "Невеликі опори", body: "Короткі списки, тихі паузи та одна справа за раз можуть трохи полегшити день. Це демонстраційний освітній текст, а не медична порада; перед релізом він потребує клінічної перевірки." }] },
    { id: "memory", title: "Чому спогади можуть раптово переповнювати", excerpt: "Як дати спогадам місце, не кваплячи себе.", category: "memory", readTime: 5, sections: [{ heading: "Спогади приходять несподівано", body: "Знайоме місце, звук або дата можуть викликати сильний спогад. Єдиного правильного способу реагувати немає. Зупинись і поміть, що тобі потрібно." }] },
    { id: "sleep", title: "Як горювання може впливати на сон", excerpt: "Дбайливі ідеї для ночей, що стали іншими.", category: "sleep", readTime: 4, sections: [{ heading: "Відпочинок без тиску", body: "Стабільний вечірній ритм і спокійніше середовище можуть підтримати відпочинок. Якщо проблеми зі сном тривають, звернися до кваліфікованого фахівця." }] },
    { id: "healing", title: "Чому зцілення не йде по прямій", excerpt: "Співчутливий погляд на мінливі дні.", category: "healing", readTime: 6, sections: [{ heading: "Дні можуть бути різними", body: "Легший день, за яким приходить важчий, не скасовує твого поступу. Зцілення може включати відпочинок, зв’язок, пам’ять і професійну допомогу." }] },
    { id: "stress", title: "Як стрес проявляється в тілі", excerpt: "Помічай сигнали турботливо, без осуду.", category: "stress", readTime: 4, sections: [{ heading: "Слухай дбайливо", body: "Стрес може відчуватися по-різному. Коротка пауза допомагає помітити потреби тіла. За нових або тривожних симптомів звернися по медичну допомогу." }] },
  ],
  ru: [
    { id: "focus", title: "Почему во время горевания трудно сосредоточиться", excerpt: "Бережное знакомство с вниманием в трудный период.", category: "grief", readTime: 5, sections: [{ heading: "Мягкое начало", body: "Горевание может изменить ощущение привычных дел. Позволь себе замедлиться и обратись за профессиональной поддержкой, если повседневная жизнь становится невыносимой." }, { heading: "Небольшие опоры", body: "Короткие списки, тихие паузы и одна задача за раз могут немного облегчить день. Это демонстрационный образовательный текст, а не медицинский совет; перед релизом он требует клинической проверки." }] },
    { id: "memory", title: "Почему воспоминания могут внезапно переполнять", excerpt: "Как дать воспоминаниям место, не торопя себя.", category: "memory", readTime: 5, sections: [{ heading: "Воспоминания приходят неожиданно", body: "Знакомое место, звук или дата могут вызвать сильное воспоминание. Единственно правильного способа реагировать нет. Остановись и заметь, что тебе нужно." }] },
    { id: "sleep", title: "Как горевание может влиять на сон", excerpt: "Бережные идеи для ночей, которые стали другими.", category: "sleep", readTime: 4, sections: [{ heading: "Отдых без давления", body: "Постоянный вечерний ритм и более спокойная обстановка могут поддержать отдых. Если проблемы со сном продолжаются, обратись к квалифицированному специалисту." }] },
    { id: "healing", title: "Почему исцеление не идёт по прямой", excerpt: "Сочувственный взгляд на меняющиеся дни.", category: "healing", readTime: 6, sections: [{ heading: "Дни могут быть разными", body: "Более лёгкий день, после которого приходит тяжёлый, не отменяет твоего прогресса. Исцеление может включать отдых, связь, память и профессиональную помощь." }] },
    { id: "stress", title: "Как стресс проявляется в теле", excerpt: "Замечай сигналы бережно, без осуждения.", category: "stress", readTime: 4, sections: [{ heading: "Слушай бережно", body: "Стресс может ощущаться по-разному. Короткая пауза помогает заметить потребности тела. При новых или тревожных симптомах обратись за медицинской помощью." }] },
  ],
};

export const getScienceArticles = (language: Language) => articlesByLanguage[language];

export const categoryOrder: JournalCategory[] = [
  "free-thoughts",
  "future-self",
  "past-self",
  "heavenly-conversation",
  "letter-to-god",
];

export const categoryGlyph: Record<JournalCategory, string> = {
  "free-thoughts": "✎",
  "future-self": "☼",
  "past-self": "↶",
  "heavenly-conversation": "♡",
  "letter-to-god": "✉",
};

export const categoryTint: Record<JournalCategory, string> = {
  "free-thoughts": "#F8E8DC",
  "future-self": "#F7EED4",
  "past-self": "#E8EEE6",
  "heavenly-conversation": "#EFE7F2",
  "letter-to-god": "#E7EEF3",
};
