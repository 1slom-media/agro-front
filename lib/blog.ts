export interface BlogPost {
  id: number
  slug: string
  image: string
  youtubeLink?: string
  title: {
    uz: string
    ru: string
    en: string
  }
  excerpt: {
    uz: string
    ru: string
    en: string
  }
  content: {
    uz: string
    ru: string
    en: string
  }
  date: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "how-to-choose-agrofiber",
    image: "/farmer-choosing-agrofiber-greenhouse.jpg",
    title: {
      uz: "Agrovolokno qanday tanlash kerak",
      ru: "Как выбрать агроволокно",
      en: "How to Choose Agrofiber",
    },
    excerpt: {
      uz: "To'g'ri agrovolokno tanlash bo'yicha batafsil qo'llanma",
      ru: "Подробное руководство по выбору правильного агроволокна",
      en: "A detailed guide on choosing the right agrofiber",
    },
    content: {
      uz: "Agrovolokno tanlashda bir nechta muhim omillarni hisobga olish kerak: ekin turi, iqlim sharoitlari, va maqsadli foydalanish. Ushbu maqolada biz sizga to'g'ri tanlov qilishda yordam beramiz.",
      ru: "При выборе агроволокна необходимо учитывать несколько важных факторов: тип культуры, климатические условия и целевое использование. В этой статье мы поможем вам сделать правильный выбор.",
      en: "When choosing agrofiber, you need to consider several important factors: crop type, climate conditions, and intended use. In this article, we will help you make the right choice.",
    },
    date: "2025-01-05",
  },
  {
    id: 2,
    slug: "spring-planting-tips",
    image: "/spring-planting-seedlings-agrofiber-cover.jpg",
    title: {
      uz: "Bahorgi ekish bo'yicha maslahatlar",
      ru: "Советы по весенней посадке",
      en: "Spring Planting Tips",
    },
    excerpt: {
      uz: "Agrovolokno yordamida bahorgi ekishni qanday muvaffaqiyatli o'tkazish",
      ru: "Как успешно провести весеннюю посадку с помощью агроволокна",
      en: "How to successfully conduct spring planting with agrofiber",
    },
    content: {
      uz: "Bahorgi ekish mavsumi yaqinlashmoqda va agrovolokno sizning eng yaxshi yordamchingiz bo'lishi mumkin. Keling, bahorgi ekishning asosiy qoidalarini ko'rib chiqamiz.",
      ru: "Сезон весенней посадки приближается, и агроволокно может стать вашим лучшим помощником. Давайте рассмотрим основные правила весенней посадки.",
      en: "Spring planting season is approaching, and agrofiber can be your best helper. Let's look at the basic rules of spring planting.",
    },
    date: "2025-01-02",
  },
  {
    id: 3,
    slug: "mulch-benefits",
    image: "/black-mulch-fabric-garden-weed-control.jpg",
    title: {
      uz: "Mulchlashning foydalari",
      ru: "Преимущества мульчирования",
      en: "Benefits of Mulching",
    },
    excerpt: {
      uz: "Nima uchun qora mulch sizning bog'ingiz uchun zarur",
      ru: "Почему черная мульча необходима для вашего сада",
      en: "Why black mulch is essential for your garden",
    },
    content: {
      uz: "Qora mulch begona o'tlarni nazorat qilishda va tuproq namligini saqlashda juda samarali. Bu maqolada mulchlashning barcha afzalliklarini ko'rib chiqamiz.",
      ru: "Черная мульча очень эффективна в борьбе с сорняками и сохранении влаги в почве. В этой статье мы рассмотрим все преимущества мульчирования.",
      en: "Black mulch is very effective in weed control and soil moisture retention. In this article, we will explore all the benefits of mulching.",
    },
    date: "2024-12-28",
  },
]
