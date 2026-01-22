# Telegram Bot Sozlash Qo'llanmasi

## 1. Backend Sozlamalari

### Environment Variables

Backend `.env` fayliga quyidagi o'zgaruvchilarni qo'shing:

```env
TELEGRAM_BOT_TOKEN=7977660464:AAH6PswsH37TrYwzzGTP9Vj5PwyzwIMPgII
TELEGRAM_ADMIN_CHAT_ID=-1001216798477
FRONTEND_URL=https://sunagro.uz
```

**Eslatma**: Production muhitida token va chat ID ni environment variables orqali berish tavsiya etiladi.

## 2. Bot Funksionalliklari

### /start Buyrug'i
- Botni ishga tushirish
- Web-app tugmasi orqali saytni ochish
- Foydalanuvchilarga salomlashish

### /stats Buyrug'i
- Statistika ko'rsatish (keyinchalik to'ldiriladi)

### /help Buyrug'i
- Yordam ma'lumotlari

### Avtomatik Xabarlar
- Yangi ariza yaratilganda Telegram kanalga xabar yuboriladi
- Xabar formatida:
  - Mijoz ma'lumotlari (ism, telefon, email)
  - Ariza turi va holati
  - Xabar matni
  - Metadata (mahsulot, miqdor, etc.)
  - Sana va vaqt

## 3. Web-App Sozlash

Telegram bot orqali saytni ochish uchun:

1. BotFather ga kiring: [@BotFather](https://t.me/BotFather)
2. Botni tanlang
3. `/setmenubutton` buyrug'ini yuboring
4. Botni tanlang
5. Web App URL ni kiriting: `https://sunagro.uz`
6. Button text: "🌐 Saytni ochish"

Yoki kodda avtomatik sozlangan (inline keyboard).

## 4. Kanalga Xabar Yuborish

Bot avtomatik ravishda quyidagi kanalga xabar yuboradi:
- Channel ID: `-1001216798477`
- Kanal: [@agrotola](https://t.me/agrotola)

## 5. Test Qilish

1. Backend serverini ishga tushiring
2. Telegram botga `/start` buyrug'ini yuboring
3. Saytdan yangi ariza yarating
4. Telegram kanalda xabarni tekshiring

## 6. Xatoliklarni Tuzatish

### Bot ishlamayapti
- Token to'g'ri ekanligini tekshiring
- Backend loglarini ko'rib chiqing
- Bot token ni [@BotFather](https://t.me/BotFather) dan qayta oling

### Xabarlar yuborilmayapti
- Chat ID to'g'ri ekanligini tekshiring
- Bot kanalga admin sifatida qo'shilganligini tekshiring
- Backend loglarini ko'rib chiqing

### Web-app ishlamayapti
- FRONTEND_URL to'g'ri ekanligini tekshiring
- HTTPS ishlatilayotganligini tekshiring (Telegram web-app HTTPS talab qiladi)
