/**
 * Russian locale dictionary for UI strings and case study labels.
 */
export default {
  site: {
    name: "Леонид Петров — Senior Frontend Engineer",
    description:
      "Senior фронтенд‑инженер: продуктовые интерфейсы, производительность, дизайн‑системы.",
  },
  nav: "Главная",
  hero: {
    headline: "Senior Frontend Engineer для надежных продуктовых интерфейсов",
    description:
      "React, TypeScript, Next.js. Архитектура, производительность, доступность и дизайн‑системы. 5.5+ лет в финтехе.",
  },
  sections: {
    about: "О себе",
    aboutSummary:
      "Senior фронтенд‑инженер с фокусом на масштабируемую архитектуру UI, перфоманс‑бюджеты и DX. Менторинг, дизайн‑системы, real‑time интерфейсы.",
    experience: "Опыт",
    projects: "Проекты",
    engineeringQuality: "Качество инженерии",
    engineeringQualityDescription:
      "Перфоманс‑first UI, доступность и надежные пайплайны поставки для продуктовых команд.",
    engineeringQualityPoints: {
      one: "Lighthouse‑ориентированные метрики",
      two: "A11y и кроссбраузерная проверка",
      three: "Дизайн‑системы и DX‑подход",
    },
    content: "Контент и статьи",
    contentDescription: "Статьи, доклады и кейсы. Пока как плейсхолдер.",
    contentPrompt: "Заметки и ссылки скоро появятся.",
    contact: "Связь",
  },
  cta: {
    projects: "О проектах",
    experience: "Опыт",
    email: "lvpjsdev@gmail.com",
    primary: "Написать",
    telegram: "Телеграм",
    github: "GitHub",
    linkedin: "LinkedIn",
    cv: "Резюме",
    placeholderNote: "Ссылки GitHub/LinkedIn/резюме — плейсхолдеры до обновления.",
  },
  localeSwitch: {
    label: "Сменить язык",
  },
  contactForm: {
    subtitle: "Опиши роль или проект и желаемый результат — отвечу с оценкой и шагами.",
    nameLabel: "Имя",
    emailLabel: "Email",
    messageLabel: "Сообщение",
    companyLabel: "Компания",
    submit: "Отправить",
    sending: "Отправка...",
    or: "или",
    mailto: "Написать на почту",
    success: "Спасибо! Отвечу в течение 1–2 дней.",
    errorMissing: "Пожалуйста, заполните все поля.",
    errorInvalid: "Укажите корректный email.",
    errorSpam: "Отправка заблокирована.",
    errorRate: "Слишком много запросов. Попробуйте позже.",
    errorSend: "Не удалось отправить сообщение. Напишите на почту.",
    errorFallback: "Отправка через форму не настроена. Используйте почту ниже.",
  },
  caseStudy: {
    title: "Кейс",
    view: "Смотреть кейс",
    back: "Назад к проектам",
    overview: "Обзор",
    outcomes: "Результаты",
    challenges: "Сложности",
    stack: "Стек",
    links: "Ссылки",
    confidential: "Конфиденциальный клиент",
    notFound: "Кейс не найден",
  },
} as const;
