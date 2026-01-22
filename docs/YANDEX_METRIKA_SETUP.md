# Yandex Metrika O'rnatish Qo'llanmasi

## 📋 BOSQICH 1: Yandex Metrika Hisobini Yaratish

### 1.1. Yandex ID yaratish
1. https://metrika.yandex.ru saytiga kiring
2. "Войти" tugmasini bosing
3. Agar Yandex ID bo'lmasa, "Зарегистрироваться" orqali yangi hisob yarating
4. Email yoki telefon raqam orqali ro'yxatdan o'ting

### 1.2. Yangi sayt qo'shish
1. Metrika bosh sahifasida "Добавить счётчик" tugmasini bosing
2. Quyidagi ma'lumotlarni kiriting:
   - **Название счётчика**: SunAgro (yoki istalgan nom)
   - **Адрес сайта**: https://sunagro.uz (yoki sizning domeningiz)
   - **Часовой пояс**: (GMT+5) Toshkent
   - **Соглашение**: ✅ "Я принимаю условия использования"

3. "Создать счётчик" tugmasini bosing

### 1.3. Metrika ID olish
1. Sizga **Metrika ID** (raqam) beriladi, masalan: `12345678`
2. Bu ID ni yozib qoldiring - u kerak bo'ladi

---

## 📋 BOSQICH 2: Metrika Kodini Olish

### 2.1. Kod ko'rinishini tanlash
1. Metrika boshqaruv panelida sizning saytingizni tanlang
2. "Настройки" > "Код счётчика" ga kiring
3. Quyidagi sozlamalarni tanlang:
   - ✅ **Включить вебвизор** (Webvisor) - foydalanuvchilar harakatini ko'rish
   - ✅ **Включить карту кликов** (Click map)
   - ✅ **Включить карту скроллинга** (Scroll map)
   - ✅ **Отслеживать хеши в адресе** (Track hash in URL)
   - ✅ **Отслеживать внешние ссылки** (Track external links)

### 2.2. Kodni ko'rish
1. "Код счётчика" bo'limida JavaScript kodini ko'rasiz
2. Kod quyidagicha ko'rinadi:
```javascript
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(12345678, "init", {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});
```

3. **Metrika ID** ni yozib qoldiring (masalan: `12345678`)

---

## 📋 BOSQICH 3: Next.js Loyihasiga Qo'shish

### 3.1. Komponent yaratish
`components/yandex-metrica.tsx` faylini yarating:

```typescript
'use client'

import Script from 'next/script'

interface YandexMetricaProps {
  ymId: string | number
}

export function YandexMetrica({ ymId }: YandexMetricaProps) {
  return (
    <>
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${ymId}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${ymId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
```

### 3.2. SiteConfig ga qo'shish
`lib/seo.ts` faylida `siteConfig` obyektiga qo'shing:

```typescript
export const siteConfig = {
  // ... mavjud kodlar
  yandexMetrica: {
    id: "12345678", // Bu yerga o'zingizning Metrika ID ni qo'ying
  },
}
```

### 3.3. Layout.tsx ga qo'shish
`app/layout.tsx` faylida:

```typescript
import { YandexMetrica } from "@/components/yandex-metrica"
import { siteConfig } from "@/lib/seo"

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <StructuredData data={[organizationSchema, websiteSchema]} />
      </head>
      <body>
        <I18nProvider>
          {children}
          <GeminiChat />
        </I18nProvider>
        <Analytics />
        <YandexMetrica ymId={siteConfig.yandexMetrica.id} />
      </body>
    </html>
  )
}
```

---

## 📋 BOSQICH 4: Tekshirish

### 4.1. Lokal tekshirish
1. Development serverni ishga tushiring: `npm run dev`
2. Browser Developer Tools oching (F12)
3. Network tabga o'ting
4. Sahifani yangilang
5. `mc.yandex.ru` ga so'rov bor-yo'qligini tekshiring

### 4.2. Metrika panelida tekshirish
1. https://metrika.yandex.ru ga kiring
2. Sizning saytingizni tanlang
3. "Отчёты" > "Посещаемость" ga o'ting
4. Agar ma'lumotlar ko'rinayotgan bo'lsa, hammasi to'g'ri ishlayapti!

### 4.3. Real-time monitoring
1. Metrika panelida "Онлайн" bo'limiga o'ting
2. Boshqa brauzerda saytingizni oching
3. Real-time da foydalanuvchi ko'rinishi kerak

---

## ✅ TAYYOR!

Endi Yandex Metrika ishlayapti va quyidagi ma'lumotlarni to'playdi:
- ✅ Sahifalar ko'rinishlari
- ✅ Foydalanuvchilar harakatlari (Webvisor)
- ✅ Bosilgan tugmalar (Click map)
- ✅ Scroll qilish (Scroll map)
- ✅ Tashqi linklar bosilishi
- ✅ Bounce rate
- ✅ Demografik ma'lumotlar

---

## 🔧 QO'SHIMCHA SOZLAMALAR

### Webvisor o'chirish (Agar kerak bo'lsa)
Agar foydalanuvchilar harakatini yozib olishni xohlamasangiz:

```typescript
ym(${ymId}, "init", {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:false  // ← false qiling
});
```

### E-commerce tracking (Agar kerak bo'lsa)
Mahsulot sotilganda:

```typescript
// components/yandex-metrica.tsx ga qo'shing
export function trackPurchase(orderId: string, price: number, products: any[]) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(siteConfig.yandexMetrica.id, 'reachGoal', 'purchase', {
      order_id: orderId,
      order_price: price,
      currency: 'UZS',
      products: products
    })
  }
}
```

---

## 📞 YORDAM

Agar muammo bo'lsa:
1. Browser Console da xatolarni tekshiring
2. Metrika panelida "Настройки" > "Код счётчика" ni qayta ko'rib chiqing
3. Metrika ID to'g'ri ekanligini tekshiring
