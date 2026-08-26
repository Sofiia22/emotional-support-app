import { Language } from "@/shared/i18n/translations";

const en = {
  myJournal: "My Journal", science: "Science Insights", journalIntro: "Choose a category to begin", scienceIntro: "Understand what grief can do to your mind and body.",
  writeHeading: "Write to heal, reflect and understand.", choose: "What would you like to write today?", reflections: "Your reflections", viewLibrary: "View journal library", privacy: "Your journal stays private on this device.",
  categories: {
    "free-thoughts": { title: "Free Thoughts", description: "Write freely and without limits", support: "This is your private space. Write whatever is on your mind.", prompt: "", placeholder: "Start writing…" },
    "future-self": { title: "To My Future Self", description: "Share hopes and dreams", support: "Write a note for the person you are becoming.", prompt: "What do you hope your future self remembers about this season?", placeholder: "Write to your future self…" },
    "past-self": { title: "To My Past Self", description: "Speak kindly to who you were", support: "Offer compassion to an earlier version of you.", prompt: "What would you want your past self to hear from you today?", placeholder: "Write what you wish you could say…" },
    "heavenly-conversation": { title: "Heavenly Conversation", description: "Write to someone you've lost", support: "Write the words you wish you could say to someone you've lost.", prompt: "", placeholder: "Write from your heart…" },
    "letter-to-god": { title: "Letter to God", description: "Pour out your heart", support: "Write what is on your heart.", prompt: "What would you like to bring to God today?", placeholder: "Begin your letter…" },
  },
  who: "Who are you writing to?", recipientPlaceholder: "Mom, Dad, Grandma, my friend…", startingPoint: "Need a starting point?", startWriting: "Start writing", change: "Change", writingTo: "Writing to", heavenlyPrompts: ["What do you miss most today?", "Is there something you wish you had said?", "What would you want them to know about your life now?", "What memory came back to you today?"],
  save: "Save reflection", delete: "Delete", characters: "characters", blank: "Write a few words before saving your reflection.", savedTitle: "Saved to your journal", savedText: "Your reflection has been saved.", heavenlySaved: "Your reflection has been saved in Heavenly Conversations.", viewInLibrary: "View in library", writeAnother: "Write another",
  all: "All", filters: ["All", "Free Thoughts", "Future", "Past", "Heavenly", "Letters"], emptyTitle: "Your journal is waiting for you.", emptyText: "Your saved reflections will appear here.", writeReflection: "Write a reflection", edited: "Edited", edit: "Edit",
  deleteTitle: "Delete this reflection?", deleteText: "This reflection will be permanently removed from your journal.", cancel: "Cancel", leaveTitle: "Leave without saving?", leaveText: "Your reflection hasn't been saved yet.", keepWriting: "Keep writing", discard: "Discard", back: "Back",
  scienceFilters: ["All", "Grief", "Sleep", "Memory", "Stress", "Healing", "Relationships"], minRead: "min read", sources: "Sources", sourcesPending: "References will be added after clinical review. Sample educational content — not medical advice.", articleBack: "Back to insights",
};

const uk = {
  myJournal: "Мій щоденник", science: "Наукові пояснення", journalIntro: "Обери категорію, щоб почати", scienceIntro: "Дізнайся, як горювання може впливати на розум і тіло.",
  writeHeading: "Пиши, щоб зцілюватися, осмислювати й розуміти.", choose: "Про що ти хочеш написати сьогодні?", reflections: "Твої роздуми", viewLibrary: "Переглянути щоденник", privacy: "Твій щоденник залишається приватним на цьому пристрої.",
  categories: {
    "free-thoughts": { title: "Вільні думки", description: "Пиши вільно й без обмежень", support: "Це твій приватний простір. Напиши все, що зараз у думках.", prompt: "", placeholder: "Почни писати…" },
    "future-self": { title: "Майбутній собі", description: "Поділися надіями й мріями", support: "Напиши людині, якою ти стаєш.", prompt: "Що ти сподіваєшся пам’ятати про цей період у майбутньому?", placeholder: "Напиши майбутньому собі…" },
    "past-self": { title: "Минулому собі", description: "Звернися з добротою до себе в минулому", support: "Подаруй співчуття своїй минулій версії.", prompt: "Що б ти хотіла або хотів сказати собі в минулому сьогодні?", placeholder: "Напиши те, що хотілося б сказати…" },
    "heavenly-conversation": { title: "Небесна розмова", description: "Напиши тому, кого втратила або втратив", support: "Напиши слова, які хотілося б сказати людині, якої вже немає поруч.", prompt: "", placeholder: "Пиши від серця…" },
    "letter-to-god": { title: "Лист до Бога", description: "Відкрий своє серце", support: "Напиши про те, що зараз у твоєму серці.", prompt: "Що ти хочеш принести Богові сьогодні?", placeholder: "Почни свій лист…" },
  },
  who: "Кому ти пишеш?", recipientPlaceholder: "Мамі, татові, бабусі, другові…", startingPoint: "Потрібна точка опори?", startWriting: "Почати писати", change: "Змінити", writingTo: "Пишу для", heavenlyPrompts: ["За чим ти найбільше сумуєш сьогодні?", "Чи є щось, що хотілося б сказати?", "Що ти хочеш розповісти про своє життя зараз?", "Який спогад повернувся сьогодні?"],
  save: "Зберегти роздум", delete: "Видалити", characters: "символів", blank: "Напиши кілька слів, перш ніж зберегти роздум.", savedTitle: "Збережено у щоденнику", savedText: "Твій роздум збережено.", heavenlySaved: "Твій роздум збережено в Небесних розмовах.", viewInLibrary: "Переглянути в щоденнику", writeAnother: "Написати ще",
  all: "Усі", filters: ["Усі", "Вільні думки", "Майбутнє", "Минуле", "Небесні", "Листи"], emptyTitle: "Твій щоденник чекає на тебе.", emptyText: "Тут з’являться збережені роздуми.", writeReflection: "Написати роздум", edited: "Змінено", edit: "Редагувати",
  deleteTitle: "Видалити цей роздум?", deleteText: "Цей роздум буде назавжди видалено зі щоденника.", cancel: "Скасувати", leaveTitle: "Вийти без збереження?", leaveText: "Твій роздум ще не збережено.", keepWriting: "Продовжити писати", discard: "Відкинути", back: "Назад",
  scienceFilters: ["Усі", "Горювання", "Сон", "Пам’ять", "Стрес", "Зцілення", "Стосунки"], minRead: "хв читання", sources: "Джерела", sourcesPending: "Посилання будуть додані після клінічної перевірки. Демонстраційний освітній текст — не медична порада.", articleBack: "Назад до пояснень",
};

const ru = {
  myJournal: "Мой дневник", science: "Научные объяснения", journalIntro: "Выбери категорию, чтобы начать", scienceIntro: "Узнай, как горевание может влиять на разум и тело.",
  writeHeading: "Пиши, чтобы исцеляться, осмысливать и понимать.", choose: "О чём ты хочешь написать сегодня?", reflections: "Твои размышления", viewLibrary: "Открыть дневник", privacy: "Твой дневник остаётся приватным на этом устройстве.",
  categories: {
    "free-thoughts": { title: "Свободные мысли", description: "Пиши свободно и без ограничений", support: "Это твоё личное пространство. Напиши всё, что сейчас в мыслях.", prompt: "", placeholder: "Начни писать…" },
    "future-self": { title: "Будущему себе", description: "Поделись надеждами и мечтами", support: "Напиши человеку, которым ты становишься.", prompt: "Что ты надеешься помнить об этом периоде в будущем?", placeholder: "Напиши будущему себе…" },
    "past-self": { title: "Прошлому себе", description: "Обратись с добротой к себе в прошлом", support: "Подари сочувствие своей прошлой версии.", prompt: "Что бы ты хотела или хотел сказать себе в прошлом сегодня?", placeholder: "Напиши то, что хотелось бы сказать…" },
    "heavenly-conversation": { title: "Небесный разговор", description: "Напиши тому, кого потеряла или потерял", support: "Напиши слова, которые хотелось бы сказать человеку, которого больше нет рядом.", prompt: "", placeholder: "Пиши от сердца…" },
    "letter-to-god": { title: "Письмо Богу", description: "Открой своё сердце", support: "Напиши о том, что сейчас в твоём сердце.", prompt: "Что ты хочешь принести Богу сегодня?", placeholder: "Начни своё письмо…" },
  },
  who: "Кому ты пишешь?", recipientPlaceholder: "Маме, папе, бабушке, другу…", startingPoint: "Нужна точка опоры?", startWriting: "Начать писать", change: "Изменить", writingTo: "Пишу для", heavenlyPrompts: ["По чему ты больше всего скучаешь сегодня?", "Есть ли что-то, что хотелось бы сказать?", "Что ты хочешь рассказать о своей жизни сейчас?", "Какое воспоминание вернулось сегодня?"],
  save: "Сохранить размышление", delete: "Удалить", characters: "символов", blank: "Напиши несколько слов, прежде чем сохранить размышление.", savedTitle: "Сохранено в дневнике", savedText: "Твоё размышление сохранено.", heavenlySaved: "Твоё размышление сохранено в Небесных разговорах.", viewInLibrary: "Посмотреть в дневнике", writeAnother: "Написать ещё",
  all: "Все", filters: ["Все", "Свободные мысли", "Будущее", "Прошлое", "Небесные", "Письма"], emptyTitle: "Твой дневник ждёт тебя.", emptyText: "Здесь появятся сохранённые размышления.", writeReflection: "Написать размышление", edited: "Изменено", edit: "Редактировать",
  deleteTitle: "Удалить это размышление?", deleteText: "Это размышление будет навсегда удалено из дневника.", cancel: "Отмена", leaveTitle: "Выйти без сохранения?", leaveText: "Твоё размышление ещё не сохранено.", keepWriting: "Продолжить писать", discard: "Отбросить", back: "Назад",
  scienceFilters: ["Все", "Горевание", "Сон", "Память", "Стресс", "Исцеление", "Отношения"], minRead: "мин чтения", sources: "Источники", sourcesPending: "Ссылки будут добавлены после клинической проверки. Демонстрационный образовательный текст — не медицинский совет.", articleBack: "Назад к объяснениям",
};

export const writeJournalCopy: Record<Language, typeof en> = {
  en,
  uk: uk as typeof en,
  ru: ru as typeof en,
};
