# Product Qo'shish Qo'llanmasi

## Backend API orqali Product Qo'shish

### 1. API Endpoint
```
POST /api/products
```

### 2. Product Ma'lumotlari (JSON Format)

#### Variant 1: Агротекс 17 г/м² (3,2х500м) - 1 600 000 сум
```json
{
  "name": {
    "uz": "Агротекс агроволокно 17 г/м² (3,2х500м) оқ",
    "ru": "Агротекс агроволокно 17 г/м² (3,2х500м) белое",
    "en": "Agrotex agrofiber 17 g/m² (3.2x500m) white"
  },
  "slug": "agrotex-agrovolokno-17-32x500",
  "description": {
    "uz": "Агротекс брендининг юқори сифатли агроволокноси. 17 г/м² зичлик, 3,2м кенглик, 500м узунлик. Иссиқхона ва очиқ майдонлар учун. -2°С гача совуқдан химоя қилади. Оптимал нарх ва сифат.",
    "ru": "Высококачественное агроволокно бренда Агротекс. Плотность 17 г/м², ширина 3,2м, длина 500м. Для теплиц и открытого грунта. Защищает от заморозков до -2°С. Оптимальное соотношение цены и качества.",
    "en": "High-quality agrofiber from Agrotex brand. Density 17 g/m², width 3.2m, length 500m. For greenhouses and open fields. Protects from frost down to -2°C. Optimal price and quality ratio."
  },
  "price": 1600000,
  "specifications": {
    "density": "17 г/м²",
    "width": "3,2м",
    "length": "500м",
    "size": "3,2х500м",
    "color": "white",
    "usage": ["greenhouse", "open_field"],
    "temperature": "до -2°С",
    "brand": "Агротекс"
  },
  "isActive": true,
  "images": {
    "image1": {
      "url": "/white-agrofiber-roll-agricultural-fabric.jpg"
    }
  }
}
```

#### Variant 2: Агротекс 17 г/м² (1,6х500м) - 750 000 сум
```json
{
  "name": {
    "uz": "Агротекс агроволокно 17 г/м² (1,6х500м) оқ",
    "ru": "Агротекс агроволокно 17 г/м² (1,6х500м) белое",
    "en": "Agrotex agrofiber 17 g/m² (1.6x500m) white"
  },
  "slug": "agrotex-agrovolokno-17-16x500",
  "description": {
    "uz": "Агротекс брендининг агроволокноси. 17 г/м² зичлик, 1,6м кенглик, 500м узунлик. Кичик ва ўртача иссиқхоналар учун. -2°С гача совуқдан химоя қилади.",
    "ru": "Агроволокно бренда Агротекс. Плотность 17 г/м², ширина 1,6м, длина 500м. Для небольших и средних теплиц. Защищает от заморозков до -2°С.",
    "en": "Agrofiber from Agrotex brand. Density 17 g/m², width 1.6m, length 500m. For small and medium greenhouses. Protects from frost down to -2°C."
  },
  "price": 750000,
  "specifications": {
    "density": "17 г/м²",
    "width": "1,6м",
    "length": "500м",
    "size": "1,6х500м",
    "color": "white",
    "usage": ["greenhouse", "open_field"],
    "temperature": "до -2°С",
    "brand": "Агротекс"
  },
  "isActive": true,
  "images": {
    "image1": {
      "url": "/white-agrofiber-roll-agricultural-fabric.jpg"
    }
  }
}
```

#### Variant 3: ДонАгроТех 30 г/м² (1,6х600м) - 1 400 000 сум
```json
{
  "name": {
    "uz": "ДонАгроТех агроволокно 30 г/м² (1,6х600м) оқ",
    "ru": "ДонАгроТех агроволокно 30 г/м² (1,6х600м) белое",
    "en": "DonAgroTex agrofiber 30 g/m² (1.6x600m) white"
  },
  "slug": "donagrotex-agrovolokno-30-16x600",
  "description": {
    "uz": "ДонАгроТех брендининг юқори сифатли агроволокноси. 30 г/м² зичлик, 1,6м кенглик, 600м узунлик. Кучли химоя - -3°С дан -4°С гача совуқдан химоя қилади. Узун муддатли фойдаланиш.",
    "ru": "Высококачественное агроволокно бренда ДонАгроТех. Плотность 30 г/м², ширина 1,6м, длина 600м. Сильная защита - защищает от заморозков от -3°С до -4°С. Долговечное использование.",
    "en": "High-quality agrofiber from DonAgroTex brand. Density 30 g/m², width 1.6m, length 600m. Strong protection - protects from frost from -3°C to -4°C. Long-lasting use."
  },
  "price": 1400000,
  "specifications": {
    "density": "30 г/м²",
    "width": "1,6м",
    "length": "600м",
    "size": "1,6х600м",
    "color": "white",
    "usage": ["greenhouse", "open_field"],
    "temperature": "до -3-4°С",
    "brand": "ДонАгроТех"
  },
  "isActive": true,
  "images": {
    "image1": {
      "url": "/white-agrofiber-roll-30gsm-protection.jpg"
  }
}
```

## SEO Metadata (Avtomatik generatsiya qilinadi)

Product qo'shilgandan keyin, quyidagi SEO metadata avtomatik yaratiladi:

### Title (50-60 belgi):
**"Белое агроволокно 17 г/м² для теплиц купить в Ташкенте | SunAgro"**

### Description (150-160 belgi):
**"Белое агроволокно плотностью 17 г/м² для теплиц. Защита до -2°С. От 1 600 000 сум. Доставка по Узбекистану. Оптовые цены."**

### Keywords (Avtomatik):
- агроволокно
- агротекстиль
- спанбонд
- белое агроволокно
- агроволокно 17 г/м²
- агроволокно для теплиц
- укрывной материал для теплиц
- агроволокно для открытого грунта
- защита растений
- Агротекс

## Admin Panel orqali Qo'shish

1. Admin panelga kiring: `/admin/products/create`
2. Quyidagi maydonlarni to'ldiring:
   - **Название (Узбекский)**: Агротекс агроволокно 17 г/м² (3,2х500м) оқ
   - **Название (Русский)**: Агротекс агроволокно 17 г/м² (3,2х500м) белое
   - **Название (Английский)**: Agrotex agrofiber 17 g/m² (3.2x500m) white
   - **Описание**: Yuqoridagi description ma'lumotlari
   - **Slug**: `agrotex-agrovolokno-17-32x500`
   - **Цена**: 1600000
   - **Цвет**: Белый
   - **Плотность**: 17 г/м²
   - **Размер**: 3,2х500м
   - **Температура**: до -2°С
   - **Тип продажи**: Теплица, Открытый грунт
   - **Активно**: ✅

3. **Изображение** yuklang
4. **Сохранить** tugmasini bosing

## API orqali Qo'shish (cURL)

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @PRODUCT_ADD_EXAMPLE.json
```

## Tekshirish

Product qo'shilgandan keyin:
1. `/shop/agrotex-agrovolokno-17-32x500` sahifasini oching
2. View Page Source (Ctrl+U) qiling
3. Quyidagilarni tekshiring:
   - `<title>` tag
   - `<meta name="description">`
   - `<meta property="og:title">`
   - `<script type="application/ld+json">` (Product Schema)
