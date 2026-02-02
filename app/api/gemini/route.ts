import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { message, locale, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get Gemini API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Build context for the conversation
    const contactInfo = locale === 'uz'
      ? `Biz bilan bog'lanish: Telefon: +998909665800, Email: info@sunagro.uz, Telegram: @agrotola, Instagram: @agrovolokno.uz, TikTok: @sunagro.uz`
      : locale === 'ru'
      ? `Свяжитесь с нами: Телефон: +998909665800, Email: info@sunagro.uz, Telegram: @agrotola, Instagram: @agrovolokno.uz, TikTok: @sunagro.uz`
      : `Contact us: Phone: +998909665800, Email: info@sunagro.uz, Telegram: @agrotola, Instagram: @agrovolokno.uz, TikTok: @sunagro.uz`;

    const aboutInfo = locale === 'uz'
      ? `SunAgro O'zbekistondagi agrovolokno va qishloq xo'jaligi yechimlari ishlab chiqaruvchisi. Mahsulotlar: agrovolokno rulonlari va paketlari, harorat va zichlik bo'yicha turli variantlar, dehqonchilik va bog'dorchilik uchun qo'llanmalar.`
      : locale === 'ru'
      ? `SunAgro — производитель агроволокна и решений для сельского хозяйства в Узбекистане. Продукция: агроволокно в рулонах и пакетах, варианты по температуре и плотности, рекомендации для фермерства и садоводства.`
      : `SunAgro is an Uzbekistan-based producer of agrofiber and agriculture solutions. Products: agrofiber rolls and packages, options by temperature and density, guidance for farming and gardening.`;

    // Universal system prompt that works for all languages
    const systemPrompt = `Siz SunAgro kompaniyasining yordamchisisiz. Agrovolokno, dehqonchilik, bog'dorchilik va qishloq xo'jaligi mahsulotlari haqida batafsil ma'lumot berasiz. Javoblar aniq, foydali va professional bo'lishi kerak.

MUHIM: Foydalanuvchi qaysi tilda yozsa (o'zbek, rus yoki ingliz), siz ham shu tilda javob bering. Foydalanuvchi tilini avtomatik aniqlang va shu tilda javob qaytaring.

Kompaniya haqida ma'lumot:
- O'zbekcha: SunAgro O'zbekistondagi agrovolokno va qishloq xo'jaligi yechimlari ishlab chiqaruvchisi. Mahsulotlar: agrovolokno rulonlari va paketlari, harorat va zichlik bo'yicha turli variantlar, dehqonchilik va bog'dorchilik uchun qo'llanmalar.
- Ruscha: SunAgro — производитель агроволокна и решений для сельского хозяйства в Узбекистане. Продукция: агроволокно в рулонах и пакетах, варианты по температуре и плотности, рекомендации для фермерства и садоводства.
- Inglizcha: SunAgro is an Uzbekistan-based producer of agrofiber and agriculture solutions. Products: agrofiber rolls and packages, options by temperature and density, guidance for farming and gardening.

Bog'lanish ma'lumotlari:
- O'zbekcha: Biz bilan bog'lanish: Telefon: +998909665800, Email: info@sunagro.uz, Telegram: @agrotola, Instagram: @agrovolokno.uz, TikTok: @sunagro.uz
- Ruscha: Свяжитесь с нами: Телефон: +998909665800, Email: info@sunagro.uz, Telegram: @agrotola, Instagram: @agrovolokno.uz, TikTok: @sunagro.uz
- Inglizcha: Contact us: Phone: +998909665800, Email: info@sunagro.uz, Telegram: @agrotola, Instagram: @agrovolokno.uz, TikTok: @sunagro.uz

Agar foydalanuvchi biz haqimizda so'rasa yoki umumiy ma'lumot so'rasa, yuqoridagi ma'lumotlardan foydalaning.

Agar mijoz bizning mahsulotlarimizga qiziqsa yoki biz bilan bog'lanishni so'rasa, yuqoridagi bog'lanish ma'lumotlarini berasiz.

Lekin tanishuv xabari yoki birinchi salomlashishda bu ma'lumotlarni bermasligingiz kerak. Faqat mijoz so'rasa yoki mahsulotlar haqida savol bersa, shunda biz bilan bog'lanish usullarini aytasiz.`;

    // Prepare chat history for SDK
    // Filter out welcome/assistant messages at the start and ensure history starts with 'user'
    const rawHistory = conversationHistory || [];
    let filteredHistory = rawHistory;
    
    // Remove any leading assistant/model messages
    while (filteredHistory.length > 0 && filteredHistory[0].role !== 'user') {
      filteredHistory = filteredHistory.slice(1);
    }

    // Convert to Gemini format
    const history = filteredHistory.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Call Gemini API via official SDK
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });
    
    // Start chat with system instruction and history if available
    const chatConfig: any = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };
    
    if (history.length > 0) {
      chatConfig.history = history;
    }
    
    const chat = model.startChat(chatConfig);

    const result = await chat.sendMessage(message);
    const responseText =
      result?.response?.text?.() ||
      (locale === 'uz'
        ? 'Kechirasiz, javob olishda xatolik yuz berdi.'
        : locale === 'ru'
        ? 'Извините, произошла ошибка при получении ответа.'
        : 'Sorry, an error occurred while getting the response.');

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('Error in Gemini API route:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    });

    // Check if it's a geographic restriction error
    const isLocationError = error?.message?.includes('location is not supported') || 
                           error?.message?.includes('User location is not supported');

    if (isLocationError) {
      // Return a helpful fallback response based on locale
      const fallbackResponse = locale === 'uz'
        ? `Kechirasiz, AI yordamchi hozirgi vaqtda mavjud emas. Savollaringiz bo'lsa, biz bilan bog'laning:\n\n📞 Telefon: +998909665800\n📧 Email: info@sunagro.uz\n💬 Telegram: @agrotola\n📷 Instagram: @agrovolokno.uz\n🎵 TikTok: @sunagro.uz\n\nYoki bizning mahsulotlarimiz haqida batafsil ma'lumot olish uchun saytda ko'rib chiqing.`
        : locale === 'ru'
        ? `Извините, AI помощник в настоящее время недоступен. Если у вас есть вопросы, свяжитесь с нами:\n\n📞 Телефон: +998909665800\n📧 Email: info@sunagro.uz\n💬 Telegram: @agrotola\n📷 Instagram: @agrovolokno.uz\n🎵 TikTok: @sunagro.uz\n\nИли просмотрите наш сайт для получения подробной информации о наших продуктах.`
        : `Sorry, the AI assistant is currently unavailable. If you have questions, please contact us:\n\n📞 Phone: +998909665800\n📧 Email: info@sunagro.uz\n💬 Telegram: @agrotola\n📷 Instagram: @agrovolokno.uz\n🎵 TikTok: @sunagro.uz\n\nOr browse our website for detailed information about our products.`;

      return NextResponse.json({ response: fallbackResponse });
    }

    // For other errors, return generic error message
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}
