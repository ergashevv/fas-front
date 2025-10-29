// Translation system
export const translations = {
  uz: {
    // Header
    search: "Qidirish...",
    boys: "O'g'il bolalar",
    girls: "Qiz bolalar", 
    accessories: "Aksessuarlar",
    allProducts: "Hamma mahsulotlar",
    
    // Pages
    products: "Mahsulotlar",
    searchResults: "qidiruvi natijalari",
    productsFound: "ta mahsulot topildi",
    
    // Profile
    personalCabinet: "Shaxsiy Kabinet",
    main: "Asosiy",
    orders: "Buyurtmalar",
    addresses: "Manzillar",
    wishlist: "Yoqtirilganlar",
    personalInfo: "Shaxsiy Ma'lumot",
    name: "Ism",
    email: "Email",
    phone: "Telefon",
    moySkladIntegration: "MoySklad Integratsiyasi",
    comingSoon: "Tez orada: To'g'ri ombor qoldig'ini va stok ma'lumotlarini ko'rish",
    noOrders: "Hech qanday buyurtma yo'q",
    noWishlist: "Yoqtirilgan mahsulotlar yo'q",
    primary: "Asosiy",
    
    // Home page
    newArrivals: "Yangi Kelganlar",
    mostPopular: "Eng mashhurlar",
    trustBadge: "Ishonch belgisi",
    cotton: "100% Paxta",
    natural: "Sof va tabiiy",
    fastDelivery: "Tez yetkazish",
    days: "2-3 kun ichida",
    returnPolicy: "14 kunlik qaytarish",
    easyReturn: "Muammosiz qaytarish",
    
    // Filters
    gender: "Jinsi",
    ageRange: "Yosh oralig'i",
    colors: "Ranglar",
    price: "Narx",
    sort: "Saralash",
    filter: "Filtrlash",
    
    // Cart
    cart: "Savat",
    emptyCart: "Savat bo'sh",
    chooseProducts: "Mahsulot tanlash",
    
    // Auth
    login: {
      title: "Kirish",
      subtitle: "Hisobingizga kiring",
      password: "Parol",
      passwordPlaceholder: "Parolingizni kiriting",
      remember: "Meni eslab qol",
      forgot: "Parolni unutdingizmi?",
      button: "Kirish",
      noAccount: "Hisobingiz yo'qmi?",
      signup: "Ro'yxatdan o'ting"
    },
    signup: {
      title: "Ro'yxatdan o'tish",
      subtitle: "Yangi hisob yarating",
      name: "Ism",
      namePlaceholder: "To'liq ismingiz",
      phone: "Telefon",
      phonePlaceholder: "+998 90 123 45 67",
      password: "Parol",
      passwordPlaceholder: "Parol yarating",
      confirmPassword: "Parolni tasdiqlang",
      confirmPasswordPlaceholder: "Parolni qayta kiriting",
      agreeTerms: "Men shartlarni qabul qilaman",
      terms: "shartlar",
      button: "Ro'yxatdan o'tish",
      haveAccount: "Hisobingiz bormi?",
      login: "Kirish"
    },
    
    // Common
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    success: "Muvaffaqiyatli",
  },
  
  ru: {
    // Header
    search: "Поиск...",
    boys: "Мальчики",
    girls: "Девочки",
    accessories: "Аксессуары", 
    allProducts: "Все товары",
    
    // Pages
    products: "Товары",
    searchResults: "результаты поиска",
    productsFound: "товаров найдено",
    
    // Profile
    personalCabinet: "Личный кабинет",
    main: "Главная",
    orders: "Заказы",
    addresses: "Адреса",
    wishlist: "Избранное",
    personalInfo: "Личная информация",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    moySkladIntegration: "Интеграция МойСклад",
    comingSoon: "Скоро: Просмотр остатков склада и информации о стоках",
    noOrders: "Нет заказов",
    noWishlist: "Нет избранных товаров",
    primary: "Основной",
    
    // Home page
    newArrivals: "Новинки",
    mostPopular: "Популярные",
    trustBadge: "Знак доверия",
    cotton: "100% Хлопок",
    natural: "Чистый и натуральный",
    fastDelivery: "Быстрая доставка",
    days: "2-3 дня",
    returnPolicy: "14-дневный возврат",
    easyReturn: "Без проблем возврат",
    
    // Filters
    gender: "Пол",
    ageRange: "Возрастной диапазон",
    colors: "Цвета",
    price: "Цена",
    sort: "Сортировка",
    filter: "Фильтр",
    
    // Cart
    cart: "Корзина",
    emptyCart: "Корзина пуста",
    chooseProducts: "Выбрать товары",
    
    // Auth
    login: {
      title: "Вход",
      subtitle: "Войдите в свой аккаунт",
      password: "Пароль",
      passwordPlaceholder: "Введите пароль",
      remember: "Запомнить меня",
      forgot: "Забыли пароль?",
      button: "Войти",
      noAccount: "Нет аккаунта?",
      signup: "Зарегистрироваться"
    },
    signup: {
      title: "Регистрация",
      subtitle: "Создать новый аккаунт",
      name: "Имя",
      namePlaceholder: "Ваше полное имя",
      phone: "Телефон",
      phonePlaceholder: "+998 90 123 45 67",
      password: "Пароль",
      passwordPlaceholder: "Создайте пароль",
      confirmPassword: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторите пароль",
      agreeTerms: "Я согласен с",
      terms: "условиями",
      button: "Зарегистрироваться",
      haveAccount: "Уже есть аккаунт?",
      login: "Войти"
    },
    
    // Common
    loading: "Загрузка...",
    error: "Произошла ошибка",
    success: "Успешно",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.uz;
