# 🤖 Gemini Chat

ChatGPT'ga o'xshash, lekin **bepul** va **ochiq kodli** AI chat ilovasi. Google Gemini API asosida ishlaydi.

---

## ✨ Xususiyatlar

- 🌙 Qorong'i dizayn (Dark mode)
- 💬 Real vaqtda Gemini AI bilan suhbat
- 💾 Chat tarixi (localStorage'da saqlanadi)
- 📱 Mobil qurilmalarga moslashgan (Responsive)
- 💻 Kod bloklari formatlash (syntax highlight)
- 🔀 Model tanlash: Gemini 2.0 Flash / 1.5 Pro / 1.5 Flash
- ➕ Bir vaqtda bir nechta chat sessiyasi
- ⚙️ Sozlamalar paneli (API kalit va model)

---

## 📁 Fayl tuzilmasi

```
gemini-chat/
├── index.html   # Asosiy HTML sahifa
├── style.css    # Barcha stillar
└── app.js       # Logika va API chaqiruvlar
```

---

## 🚀 Ishga tushirish

### 1. API kalit olish (bepul)

1. [Google AI Studio](https://aistudio.google.com/app/apikey) saytiga o'ting
2. Google akkauntingiz bilan kiring
3. **"Create API Key"** tugmasini bosing
4. Kalitni nusxalab oling (`AIza...` bilan boshlanadi)

### 2. Loyihani ishga tushirish

```bash
# Fayllarni yuklab oling
# Keyin index.html ni brauzerda oching
```

Yoki to'g'ridan-to'g'ri `index.html` faylini ikki marta bosing — brauzerda ochiladi.

### 3. API kalitni kiriting

1. Ilovani ochgandan so'ng **⚙️ Sozlamalar** tugmasini bosing
2. API kalitingizni kiriting
3. **Saqlash** tugmasini bosing
4. Tayyor! 🎉

---

## 🎮 Foydalanish

| Amal | Qanday |
|------|--------|
| Xabar yuborish | `Enter` yoki ➤ tugma |
| Yangi qator | `Shift + Enter` |
| Yangi chat | Chap paneldagi **+ Yangi chat** |
| Tarixni ko'rish | Chap paneldagi chat ro'yxati |
| Model almashtirish | ⚙️ Sozlamalar → Model |

---

## 🔧 Modellar

| Model | Tezlik | Sifat | Tavsiya |
|-------|--------|-------|---------|
| `gemini-2.0-flash` | ⚡ Tez | ✅ Yaxshi | Kundalik foydalanish |
| `gemini-1.5-flash` | ⚡ Tez | ✅ Yaxshi | Oddiy savollar |
| `gemini-1.5-pro` | 🐢 Sekin | 🌟 A'lo | Murakkab vazifalar |

---

## ⚠️ Muhim eslatmalar

- API kalit **brauzerda** saqlanadi — shaxsiy qurilmangizda ishlating
- API kalit boshqalarga **ko'rsatmang**
- Bepul kvota: kuniga ~1500 so'rov (Flash model)
- Internet ulanishi talab etiladi

---

## 🛠️ Texnologiyalar

- **HTML5** — tuzilma
- **CSS3** — dizayn (CSS Variables, Flexbox, Animation)
- **Vanilla JavaScript** — logika (framework'siz)
- **Gemini API** — AI model

---

## 📄 Litsenziya

MIT License — erkin foydalaning, o'zgartiring, tarqating.

---

> 💡 **Maslahat:** Gemini 2.0 Flash modeli eng tez va bepul kvotasi ko'p — kundalik foydalanish uchun ideal!
