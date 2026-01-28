export type Locale = "uz" | "ru" | "en"

export const locales: Locale[] = ["uz", "ru", "en"]
export const defaultLocale: Locale = "ru"

export const translations = {
  uz: {
    // Header
    nav: {
      menu: "Menyu",
      greenhouse: "Issiqxona uchun",
      openField: "Ochiq maydon uchun",
      mulch: "Mulch",
      allProducts: "Barcha mahsulotlar",
      calculator: "Kalkulyator",
      consultation: "Maslahat",
      about: "Biz haqimizda",
      blog: "Blog",
      contact: "Aloqa",
    },
    // Hero
    hero: {
      title: "Professional Agrovolokno",
      subtitle: "Biz bilan hosildorlikni oshiring",
      description: "Issiqxonalar, ochiq maydonlar va mulchlash uchun yuqori sifatli qoplama materiallar",
      ctaCalculator: "Kalkulyator",
      ctaCatalog: "Katalog",
    },
    // Usage cards
    usage: {
      title: "Qo'llanish sohangizni tanlang",
      greenhouse: {
        title: "Issiqxona",
        description: "Issiqxonalar uchun oq qoplama material",
      },
      openField: {
        title: "Ochiq maydon",
        description: "Ochiq maydonlar uchun sovuqdan himoya",
      },
      mulch: {
        title: "Mulch",
        description: "Begona o'tlarni nazorat qilish uchun qora material",
      },
    },
    // Calculator
    calculator: {
      title: "Agrovolokno kalkulyatori",
      subtitle: "Kerakli miqdorni hisoblang",
      step1: "Qo'llanish turini tanlang",
      step2: "Minimal himoya haroratini kiriting",
      step3: "Maydon o'lchamlarini kiriting",
      usageType: "Qo'llanish turi",
      temperature: "Minimal harorat (°C)",
      length: "Uzunlik (m)",
      width: "Kenglik (m)",
      calculate: "Hisoblash",
      result: "Natija",
      recommendedDensity: "Tavsiya etilgan zichlik",
      rollSize: "Rulonlik o'lchami",
      rollsNeeded: "Kerakli rulonlar soni",
      totalPrice: "Jami narx",
      buyNow: "Sotib olish",
      noProduct: "Mos mahsulot topilmadi",
    },
    // Shop
    shop: {
      title: "Mahsulotlar katalogi",
      filters: "Filtrlar",
      usageType: "Qo'llanish turi",
      density: "Zichlik",
      temperature: "Himoya harorati",
      all: "Barchasi",
      calculate: "Hisoblash",
      buy: "Sotib olish",
      perRoll: "rulon uchun",
    },
    // Product
    product: {
      description: "Tavsif",
      usage: "Qo'llanish",
      specifications: "Texnik xususiyatlar",
      density: "Zichlik",
      width: "Kenglik",
      length: "Uzunlik",
      color: "Rang",
      examples: "Qo'llanish misollari",
      faq: "Ko'p so'raladigan savollar",
      orderForm: "Buyurtma berish",
      meters: "Kerakli metrlar",
      name: "Ism",
      phone: "Telefon",
      submit: "Yuborish",
      orderMessage: (productName: string, quantity: string) => 
        `Men "${productName}" mahsulotini ${quantity} metr miqdorida olish maqsadida bog'lanmoqdaman.`,
    },
    // Blog
    blog: {
      title: "Blog",
      readMore: "Ko'proq o'qish",
    },
    // Contact
    contact: {
      title: "Biz bilan bog'laning",
      subtitle: "Maslahat so'rang",
      name: "Ismingiz",
      phone: "Telefon raqamingiz",
      message: "Xabar (ixtiyoriy)",
      submit: "Yuborish",
    },
    // Footer
    footer: {
      calculator: "Kalkulyator",
      quickLinks: "Tezkor havolalar",
      popularProducts: "Mashhur mahsulotlar",
      contacts: "Kontaktlar",
      rights: "Barcha huquqlar himoyalangan",
    },
    // Common
    common: {
      white: "Oq",
      black: "Qora",
      cover: "Qoplama",
      mulch: "Mulch",
      gm2: "g/m²",
      m: "m",
      sum: "so'm",
      loading: "Yuklanmoqda...",
    },
  },
  ru: {
    // Header
    nav: {
      menu: "Меню",
      greenhouse: "Для теплицы",
      openField: "Для открытого грунта",
      mulch: "Мульча",
      allProducts: "Все товары",
      calculator: "Калькулятор",
      consultation: "Консультация",
      about: "О нас",
      blog: "Блог",
      contact: "Контакты",
    },
    // Hero
    hero: {
      title: "Профессиональное агроволокно",
      subtitle: "Повышайте урожайность вместе с нами",
      description: "Высококачественные укрывные материалы для теплиц, открытого грунта и мульчирования",
      ctaCalculator: "Калькулятор",
      ctaCatalog: "Каталог",
    },
    // Usage cards
    usage: {
      title: "Выберите область применения",
      greenhouse: {
        title: "Теплица",
        description: "Белый укрывной материал для теплиц",
      },
      openField: {
        title: "Открытый грунт",
        description: "Защита от холода для открытого грунта",
      },
      mulch: {
        title: "Мульча",
        description: "Черный материал для борьбы с сорняками",
      },
    },
    // Calculator
    calculator: {
      title: "Калькулятор агроволокна",
      subtitle: "Рассчитайте необходимое количество",
      step1: "Выберите тип применения",
      step2: "Укажите минимальную температуру защиты",
      step3: "Введите размеры участка",
      usageType: "Тип применения",
      temperature: "Минимальная температура (°C)",
      length: "Длина (м)",
      width: "Ширина (м)",
      calculate: "Рассчитать",
      result: "Результат",
      recommendedDensity: "Рекомендуемая плотность",
      rollSize: "Размер рулона",
      rollsNeeded: "Необходимое количество рулонов",
      totalPrice: "Общая стоимость",
      buyNow: "Купить",
      noProduct: "Подходящий товар не найден",
    },
    // Shop
    shop: {
      title: "Каталог товаров",
      filters: "Фильтры",
      usageType: "Тип применения",
      density: "Плотность",
      temperature: "Температура защиты",
      all: "Все",
      calculate: "Рассчитать",
      buy: "Купить",
      perRoll: "за рулон",
    },
    // Product
    product: {
      description: "Описание",
      usage: "Применение",
      specifications: "Характеристики",
      density: "Плотность",
      width: "Ширина",
      length: "Длина",
      color: "Цвет",
      examples: "Примеры использования",
      faq: "Часто задаваемые вопросы",
      orderForm: "Оформить заказ",
      meters: "Необходимые метры",
      name: "Имя",
      phone: "Телефон",
      submit: "Отправить",
      orderMessage: (productName: string, quantity: string) => 
        `Я хочу связаться для заказа "${productName}" в количестве ${quantity} метров.`,
    },
    // Blog
    blog: {
      title: "Блог",
      readMore: "Читать далее",
    },
    // Contact
    contact: {
      title: "Свяжитесь с нами",
      subtitle: "Запросить консультацию",
      name: "Ваше имя",
      phone: "Ваш телефон",
      message: "Сообщение (необязательно)",
      submit: "Отправить",
    },
    // Footer
    footer: {
      calculator: "Калькулятор",
      quickLinks: "Быстрые ссылки",
      popularProducts: "Популярные товары",
      contacts: "Контакты",
      rights: "Все права защищены",
    },
    // Common
    common: {
      white: "Белый",
      black: "Черный",
      cover: "Укрывной",
      mulch: "Мульча",
      gm2: "г/м²",
      m: "м",
      sum: "сум",
      loading: "Загрузка...",
    },
  },
  en: {
    // Header
    nav: {
      menu: "Menu",
      greenhouse: "For Greenhouse",
      openField: "For Open Field",
      mulch: "Mulch",
      allProducts: "All Products",
      calculator: "Calculator",
      consultation: "Consultation",
      about: "About",
      blog: "Blog",
      contact: "Contact",
    },
    // Hero
    hero: {
      title: "Professional Agrofiber",
      subtitle: "Increase Your Yield With Us",
      description: "High-quality cover materials for greenhouses, open fields, and mulching",
      ctaCalculator: "Calculator",
      ctaCatalog: "Catalog",
    },
    // Usage cards
    usage: {
      title: "Choose Your Application",
      greenhouse: {
        title: "Greenhouse",
        description: "White cover material for greenhouses",
      },
      openField: {
        title: "Open Field",
        description: "Cold protection for open ground",
      },
      mulch: {
        title: "Mulch",
        description: "Black material for weed control",
      },
    },
    // Calculator
    calculator: {
      title: "Agrofiber Calculator",
      subtitle: "Calculate the required quantity",
      step1: "Select usage type",
      step2: "Enter minimum protection temperature",
      step3: "Enter area dimensions",
      usageType: "Usage Type",
      temperature: "Minimum Temperature (°C)",
      length: "Length (m)",
      width: "Width (m)",
      calculate: "Calculate",
      result: "Result",
      recommendedDensity: "Recommended Density",
      rollSize: "Roll Size",
      rollsNeeded: "Rolls Needed",
      totalPrice: "Total Price",
      buyNow: "Buy Now",
      noProduct: "No suitable product found",
    },
    // Shop
    shop: {
      title: "Product Catalog",
      filters: "Filters",
      usageType: "Usage Type",
      density: "Density",
      temperature: "Protection Temperature",
      all: "All",
      calculate: "Calculate",
      buy: "Buy",
      perRoll: "per roll",
    },
    // Product
    product: {
      description: "Description",
      usage: "Usage",
      specifications: "Specifications",
      density: "Density",
      width: "Width",
      length: "Length",
      color: "Color",
      examples: "Usage Examples",
      faq: "FAQ",
      orderForm: "Order Form",
      meters: "Required meters",
      name: "Name",
      phone: "Phone",
      submit: "Submit",
      orderMessage: (productName: string, quantity: string) => 
        `I would like to contact you to order "${productName}" in the amount of ${quantity} meters.`,
    },
    // Blog
    blog: {
      title: "Blog",
      readMore: "Read More",
    },
    // Contact
    contact: {
      title: "Contact Us",
      subtitle: "Request a consultation",
      name: "Your Name",
      phone: "Your Phone",
      message: "Message (optional)",
      submit: "Submit",
    },
    // Footer
    footer: {
      calculator: "Calculator",
      quickLinks: "Quick Links",
      popularProducts: "Popular Products",
      contacts: "Contacts",
      rights: "All rights reserved",
    },
    // Common
    common: {
      white: "White",
      black: "Black",
      cover: "Cover",
      mulch: "Mulch",
      gm2: "g/m²",
      m: "m",
      sum: "UZS",
      loading: "Loading...",
    },
  },
}

export type TranslationKey = keyof typeof translations.en
