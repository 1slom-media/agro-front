# Gemini AI Chat Widget Sozlash Qo'llanmasi

## 1. Gemini API Key Olish

1. [Google AI Studio](https://makersuite.google.com/app/apikey) ga kiring
2. Google akkauntingiz bilan tizimga kiring
3. "Create API Key" tugmasini bosing
4. API key ni nusxalang

## 2. Environment Variable Sozlash

Frontend `.env.local` yoki `.env` fayliga quyidagi o'zgaruvchini qo'shing:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Eslatma**: Production muhitida environment variable orqali berish tavsiya etiladi.

## 3. Backend API Endpoint

API endpoint avtomatik yaratilgan: `/api/gemini`

Bu endpoint:
- POST request qabul qiladi
- `message`, `locale`, `conversationHistory` parametrlarini oladi
- Gemini API ga so'rov yuboradi
- Javob qaytaradi

## 4. Chat Widget Funksionalliklari

### Asosiy Xususiyatlar
- Pastki o'ng burchakda chat button
- Click qilganda chat oynasi ochiladi
- Real-time xabar almashish
- Conversation history (oxirgi 5 xabar)
- Multilingual support (UZ, RU, EN)

### Context va System Prompt
Chat widget quyidagi kontekstda ishlaydi:
- SunAgro kompaniyasi yordamchisi
- Agrovolokno, dehqonchilik, bog'dorchilik haqida ma'lumot
- Professional va foydali javoblar

## 5. Test Qilish

1. Gemini API key ni sozlang
2. Frontend serverini ishga tushiring
3. Saytning pastki o'ng burchagidagi chat button ni bosing
4. Savol yuboring va javobni kuting

## 6. Xatoliklarni Tuzatish

### Chat ochilmayapti
- Browser console ni tekshiring
- API endpoint ishlayotganligini tekshiring
- Network requests ni ko'rib chiqing

### Javob kelmayapti
- Gemini API key to'g'ri ekanligini tekshiring
- API quota limit ni tekshiring
- Backend loglarini ko'rib chiqing

### Xatolik xabarlari
- Browser console da xatoliklar
- Network tab da failed requests
- Backend loglarida error messages

## 7. Quota va Limitlar

Gemini API quyidagi limitlarga ega:
- Free tier: 60 requests per minute
- Rate limiting: Automatic
- Token limit: 30,000 tokens per request

Agar limitga yetib borsangiz:
- Bir necha soniya kutib, qayta urinib ko'ring
- Premium plan ga o'ting
- Caching qo'shing

## 8. Xavfsizlik

- API key ni hech qachon client-side code ga qo'ymang
- Environment variables ishlating
- Rate limiting qo'shing (keyinchalik)
- Input validation qo'shing (keyinchalik)
