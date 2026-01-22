# SEO Qo'llanma - SunAgro Sayti

## 1. Google Search Console ga Ro'yxatdan O'tkazish

### Qadam 1: Google Search Console ga Kirish
1. [Google Search Console](https://search.google.com/search-console) ga kiring
2. Google akkauntingiz bilan tizimga kiring
3. "Add Property" tugmasini bosing
4. "URL prefix" ni tanlang va sayt URL ni kiriting: `https://sunagro.uz`

### Qadam 2: Saytni Tasdiqlash
Quyidagi usullardan birini tanlang:

**HTML fayl orqali:**
- Google HTML fayl yuklab beradi
- Uni saytning root papkasiga (`public/` yoki root) qo'ying
- "Verify" tugmasini bosing

**HTML tag orqali:**
- Google meta tag beradi
- Uni `app/layout.tsx` faylining `<head>` qismiga qo'shing:
```tsx
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

**DNS orqali:**
- DNS sozlamalariga TXT record qo'shing

### Qadam 3: Sitemap Yuborish
1. Search Console da "Sitemaps" bo'limiga kiring
2. Sitemap URL ni kiriting: `https://sunagro.uz/sitemap.xml`
3. "Submit" tugmasini bosing

## 2. Yandex Webmaster ga Ro'yxatdan O'tkazish

### Qadam 1: Yandex Webmaster ga Kirish
1. [Yandex Webmaster](https://webmaster.yandex.ru) ga kiring
2. Yandex akkauntingiz bilan tizimga kiring
3. "Add site" tugmasini bosing
4. Sayt URL ni kiriting: `https://sunagro.uz`

### Qadam 2: Saytni Tasdiqlash
**HTML fayl orqali:**
- Yandex HTML fayl yuklab beradi
- Uni saytning root papkasiga qo'ying
- "Check" tugmasini bosing

**Meta tag orqali:**
- Yandex meta tag beradi
- Uni `app/layout.tsx` faylining `<head>` qismiga qo'shing:
```tsx
<meta name="yandex-verification" content="YOUR_VERIFICATION_CODE" />
```

### Qadam 3: Sitemap Yuborish
1. Yandex Webmaster da "Indexing" > "Sitemap files" bo'limiga kiring
2. Sitemap URL ni kiriting: `https://sunagro.uz/sitemap.xml`
3. "Add" tugmasini bosing

## 3. robots.txt Sozlash

`public/robots.txt` faylini yaratish/yangilash:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://sunagro.uz/sitemap.xml
```

## 4. SEO Optimizatsiya

### Asosiy Keywordlar

**O'zbek tilida:**
- agrovolokno
- agrofiber
- sunagro
- dehqonchilik materiallari
- bog'dorchilik materiallari
- issiqxona materiallari
- mulchlash materiallari
- qishloq xo'jaligi materiallari
- hosil himoyasi
- sovuqdan himoya

**Rus tilida:**
- агроволокно
- агротекстиль
- укрывной материал
- теплица
- мульчирование
- сельское хозяйство
- садоводство
- защита растений
- агроматериалы

**Ingliz tilida:**
- agrofiber
- agricultural fabric
- greenhouse cover
- mulch
- frost protection
- agricultural materials
- farming supplies

### Meta Taglar

Har bir sahifa uchun:
- **Title**: Max 60 belgi, keyword bilan boshlash
- **Description**: Max 160 belgi, foydali va jozibali
- **Keywords**: 5-10 ta relevant keyword

### Structured Data (Schema.org)

Saytda quyidagi Schema turlari qo'llanilgan:
- Organization
- WebSite
- Product
- BlogPosting
- BreadcrumbList

### Content Optimizatsiya

1. **Sarlavhalar (H1-H6)**
   - Har bir sahifada bitta H1
   - H2-H6 ni mantiqiy tartibda ishlatish
   - Keywordlarni tabiiy ravishda qo'shish

2. **Alt Text**
   - Barcha rasmlarga descriptive alt text
   - Keywordlarni tabiiy ravishda qo'shish

3. **Internal Linking**
   - Sahifalar o'rtasida relevant linklar
   - Anchor textlarni keyword bilan to'ldirish

4. **External Linking**
   - Authoritative saytlarga linklar (Wikipedia, etc.)
   - Social media linklar

### Page Speed Optimizatsiya

1. **Image Optimization**
   - Next.js Image component ishlatish
   - WebP format
   - Lazy loading

2. **Code Splitting**
   - Dynamic imports
   - Route-based code splitting

3. **Caching**
   - Static pages caching
   - API responses caching

## 5. Local SEO

### Google My Business
1. [Google My Business](https://www.google.com/business/) ga kiring
2. Biznes ma'lumotlarini to'ldiring:
   - Nomi: SunAgro
   - Manzil: Toshkent, O'zbekiston
   - Telefon: +998909665800
   - Website: https://sunagro.uz
   - Kategoriya: Agricultural Supply Store

### Yandex Directory
1. [Yandex Directory](https://yandex.ru/direct/) ga kiring
2. Biznes ma'lumotlarini qo'shing

## 6. Social Media Integration

### Open Graph Tags
Saytda OG taglar qo'llanilgan:
- og:title
- og:description
- og:image
- og:url
- og:type

### Social Media Links
- Telegram: https://t.me/agrotola
- Instagram: https://www.instagram.com/agrovolokno.uz
- TikTok: https://www.tiktok.com/@sunagro.uz

## 7. Monitoring va Analytics

### Google Analytics
1. [Google Analytics](https://analytics.google.com) ga kiring
2. Property yarating
3. Tracking code ni `app/layout.tsx` ga qo'shing

### Yandex Metrika
1. [Yandex Metrika](https://metrika.yandex.ru) ga kiring
2. Counter yarating
3. Tracking code ni `app/layout.tsx` ga qo'shing

## 8. ChatGPT va Gemini orqali Topilish

### Knowledge Graph Optimization
1. **Structured Data**: Schema.org markup to'liq qo'llanilgan
2. **Entity Recognition**: 
   - Organization name: SunAgro
   - Product names: Agrovolokno, Agrofiber
   - Location: Tashkent, Uzbekistan
   - Industry: Agriculture, Gardening

3. **Content Richness**:
   - Batafsil product descriptions
   - Blog posts
   - FAQ section
   - Category pages

4. **Semantic Keywords**:
   - Related terms qo'shish
   - Synonyms ishlatish
   - Contextual keywords

### AI Search Optimization
1. **Natural Language Content**:
   - Q&A format content
   - Conversational tone
   - FAQ sections

2. **Comprehensive Coverage**:
   - Barcha mavzularni qamrab olish
   - Deep content
   - Expert knowledge

3. **Citations**:
   - Authoritative sources ga linklar
   - Research papers
   - Industry standards

## 9. Checklist

### Pre-Launch
- [ ] robots.txt sozlangan
- [ ] sitemap.xml yaratilgan
- [ ] Barcha sahifalarda meta taglar
- [ ] Structured data qo'shilgan
- [ ] Image alt textlar
- [ ] Internal linking
- [ ] Mobile-friendly (responsive)
- [ ] Page speed optimizatsiya

### Post-Launch
- [ ] Google Search Console ga ro'yxatdan o'tkazish
- [ ] Yandex Webmaster ga ro'yxatdan o'tkazish
- [ ] Sitemap yuborish
- [ ] Google Analytics sozlash
- [ ] Yandex Metrika sozlash
- [ ] Google My Business yaratish
- [ ] Social media linklar tekshirish
- [ ] 404 errors tekshirish
- [ ] Broken links tekshirish

### Ongoing
- [ ] Muntazam content yangilash
- [ ] Blog posts yozish
- [ ] Backlink building
- [ ] Social media activity
- [ ] Performance monitoring
- [ ] Keyword ranking tracking

## 10. Foydali Resurslar

- [Google Search Central](https://developers.google.com/search)
- [Yandex Webmaster Help](https://yandex.com/support/webmaster/)
- [Schema.org Documentation](https://schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## 11. Muhim Eslatmalar

1. **SEO - uzoq muddatli jarayon**: Natijalar 3-6 oydan keyin ko'rinadi
2. **Quality over Quantity**: Sifatli content miqdordan muhimroq
3. **User Experience**: Foydalanuvchi tajribasi SEO uchun muhim
4. **Mobile-First**: Mobile versiya asosiy e'tibor
5. **Local SEO**: Mahalliy qidiruvlar uchun optimizatsiya
6. **Regular Updates**: Muntazam yangilanishlar kerak

## 12. Monitoring Tools

- Google Search Console
- Yandex Webmaster
- Google Analytics
- Yandex Metrika
- Ahrefs (optional)
- SEMrush (optional)
- Screaming Frog (optional)
