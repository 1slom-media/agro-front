# SEO Deployment Checklist - Serverga Chiqargandan Keyin

## ✅ Hozirda Qilingan SEO Ishlar

### 1. Technical SEO
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Language alternates (uz, ru, en)
- ✅ robots.txt
- ✅ sitemap.xml (avtomatik)
- ✅ Structured Data (Schema.org)
- ✅ Responsive design
- ✅ Image optimization

### 2. Structured Data (Schema.org)
- ✅ Organization
- ✅ WebSite
- ✅ Product (har bir mahsulot)
- ✅ BlogPosting (har bir maqola)
- ✅ Breadcrumb

### 3. Analytics
- ✅ Vercel Analytics

---

## 🚀 SERVERGA CHIQARGANDAN KEYIN (Majburiy)

### 1. Domain va URL Sozlash (1-kun)

#### A. `lib/seo.ts` faylini yangilang:
```typescript
export const siteConfig = {
  name: "Agrovolokno",
  url: "https://agrovolokno.uz", // ✅ To'g'ri domain
  // ... qolgan sozlamalar
}
```

#### B. Environment Variables (.env.production):
```env
NEXT_PUBLIC_SITE_URL=https://agrovolokno.uz
NEXT_PUBLIC_API_URL=https://api.agrovolokno.uz
```

### 2. Google Search Console (1-kun) - MAJBURIY

#### A. Ro'yxatdan o'tish:
1. https://search.google.com/search-console ga kiring
2. "Add property" tugmasini bosing
3. Domain: `agrovolokno.uz` kiriting
4. DNS verification qiling

#### B. Sitemap yuborish:
1. Search Console > Sitemaps
2. URL kiriting: `https://agrovolokno.uz/sitemap.xml`
3. "Submit" bosing

#### C. URL Inspection:
1. Asosiy sahifani tekshiring
2. "Request Indexing" bosing
3. Muhim sahifalar uchun takrorlang

### 3. Yandex Webmaster (1-kun) - MAJBURIY (Rossiya bozori uchun)

#### A. Ro'yxatdan o'tish:
1. https://webmaster.yandex.ru ga kiring
2. Sayt qo'shing: `https://agrovolokno.uz`
3. Meta tag orqali tasdiqlang

#### B. Sitemap yuborish:
1. Webmaster > Indexing > Sitemap
2. URL: `https://agrovolokno.uz/sitemap.xml`

#### C. Sozlamalar:
1. Region: O'zbekiston
2. Asosiy til: Русский
3. Qo'shimcha tillar: Uzbek, English

### 4. Google Analytics 4 (1-kun) - MAJBURIY

#### A. Account yaratish:
1. https://analytics.google.com
2. "Create Account" > "Create Property"
3. Property name: Agrovolokno
4. Timezone: (GMT+5) Tashkent

#### B. Measurement ID olish:
```
G-XXXXXXXXXX
```

#### C. Next.js ga qo'shish:
```bash
npm install @next/third-parties
```

`app/layout.tsx` ga qo'shing:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### 5. Verification Codes (1-kun)

#### A. `lib/seo.ts` da verification qo'shing:
```typescript
verification: {
  google: "your-google-verification-code",
  yandex: "your-yandex-verification-code",
}
```

#### B. Verification kodlarni olish:
- Google: Search Console > Settings > Verification
- Yandex: Webmaster > Site Settings > Verification

### 6. OG Image Yaratish (1-kun)

#### A. OG Image dizayni:
- O'lcham: 1200x630px
- Format: JPG yoki PNG
- Fayl nomi: `og-image.jpg`
- Joylash: `public/og-image.jpg`

#### B. Har bir mahsulot uchun OG image:
- Backend orqali avtomatik generatsiya
- Yoki qo'lda dizayn qilish

### 7. SSL Sertifikat (Avtomatik - Vercel)

Agar Vercel ishlatmasangiz:
```bash
# Let's Encrypt (bepul)
sudo certbot --nginx -d agrovolokno.uz -d www.agrovolokno.uz
```

---

## 📊 QOSHIMCHA OPTIMIZATSIYALAR (1-2 hafta)

### 8. Yandex Metrica (Tavsiya etiladi)

```html
<!-- app/layout.tsx -->
<Script id="yandex-metrica">
{`
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(XXXXXX, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
  });
`}
</Script>
```

### 9. Facebook Pixel (Agar reklama qilsangiz)

```typescript
// lib/facebook-pixel.ts
export const FB_PIXEL_ID = 'YOUR_PIXEL_ID'

export const pageview = () => {
  window.fbq('track', 'PageView')
}

export const event = (name: string, options = {}) => {
  window.fbq('track', name, options)
}
```

### 10. Local Business Schema (Google Maps uchun)

```typescript
// lib/structured-data.ts ga qo'shing
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Agrovolokno",
    "image": "https://agrovolokno.uz/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chilonzor tumani",
      "addressLocality": "Toshkent",
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.2995,
      "longitude": 69.2401
    },
    "telephone": "+998901234567",
    "openingHours": "Mo-Su 09:00-18:00"
  }
}
```

---

## 🎯 MONITORING (Doimiy)

### 11. Performance Monitoring

#### A. Google PageSpeed Insights:
- https://pagespeed.web.dev/
- Har hafta tekshiring
- Score: 90+ bo'lishi kerak

#### B. GTmetrix:
- https://gtmetrix.com/
- Har hafta tekshiring

### 12. SEO Monitoring

#### A. Google Search Console (Har hafta):
- Impressions (ko'rinishlar)
- Clicks (bosishlar)
- CTR (Click-through rate)
- Average position

#### B. Yandex Webmaster (Har hafta):
- Indexing status
- Search queries
- Site quality

---

## 📝 CONTENT OPTIMIZATION (Doimiy)

### 13. Keyword Research

#### A. Google Keyword Planner:
- Asosiy kalit so'zlar:
  - "агроволокно узбекистан"
  - "укрывной материал ташкент"
  - "мульча купить"
  - "теплица материал"

#### B. Yandex Wordstat:
- https://wordstat.yandex.ru/

### 14. Content Updates

- Blog: Haftada 1-2 maqola
- Products: Yangi mahsulotlar qo'shish
- SEO: Meta tavsiflarni optimizatsiya qilish

---

## ✅ CHECKLIST (Serverga chiqargandan keyin)

### Birinchi Kun:
- [ ] Domain sozlash
- [ ] SSL sertifikat
- [ ] `lib/seo.ts` da URL yangilash
- [ ] Google Search Console ro'yxatdan o'tish
- [ ] Yandex Webmaster ro'yxatdan o'tish
- [ ] Sitemap yuborish (Google va Yandex)

### Birinchi Hafta:
- [ ] Google Analytics 4 sozlash
- [ ] Yandex Metrica sozlash
- [ ] OG image yaratish
- [ ] Verification codes qo'shish
- [ ] Performance test (PageSpeed)

### Birinchi Oy:
- [ ] 10-15 ta blog maqola yozish
- [ ] Backlinks olish (boshqa saytlardan)
- [ ] Social media profillari yaratish
- [ ] Google My Business ro'yxatdan o'tish

---

## 🚨 MUHIM ESLATMALAR

1. **Domain**: `agrovolokno.uz` ni olishdan oldin SEO ishlamaydi
2. **SSL**: HTTPS majburiy (Google ranking faktori)
3. **Content**: Kam content = past ranking
4. **Mobile**: Mobile-first indexing (Google)
5. **Speed**: Tez yuklash = yuqori ranking

## 📞 Yordam Kerak Bo'lsa

SEO bo'yicha savollar bo'lsa:
- Google Search Console Help
- Yandex Webmaster Help
- SEO mutaxassislar bilan maslahatlashing

