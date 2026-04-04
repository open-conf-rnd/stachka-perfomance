# Ссылки из доклада — Telegram Mini App (TMA)

Все ссылки и пояснения, которые используются в презентации. Можно скопировать в [GitHub Gist](https://gist.github.com/) и шарить один URL.

---

## О спикере

- **Дима Грош** — фулстек-разработчик в Айтулабс  
- **GitHub:** https://github.com/DmitriyGrosh  
- **Telegram-бот доклада:** https://t.me/stachkagrosh_bot  

---

## Репозиторий стартера

- **TMA Starter** (стартер для своего Mini App):  
  https://github.com/DmitriyGrosh/tma-starter  

---

## Конференции (митапы, где выступаю)

- **OpenConf** — конференция (на слайде с митапами)  
- **Кодьё** — митап/конференция  
- **Фронтенд? Да, ну!** — митап/конференция  

*При необходимости добавьте сюда точные ссылки на сайты или анонсы конференций.*

---

## Локальный HTTPS и отладка

### Telegram Desktop — бета-версия (для отладки TMA)

- **Версии и бета:** https://desktop.telegram.org/changelog#beta-version  
- Зачем: в бета обновления и фичи (в т.ч. Debug Web App) появляются раньше. Для отладки Mini App удобнее ставить бета поверх текущего Telegram Desktop.

### Отладка в TMA (шаги со слайдов)

1. Нажать 5 раз на **Настройки** в Telegram Desktop.  
2. В разделе **Developer** включить **Debug Web App**.  
3. В открытом Mini App — **правый клик** → «Проверить элемент» (DevTools).

---

## Обратная связь по докладу

- **Форма (Яндекс):** https://forms.yandex.ru/cloud/698dbe0f6d2d734220a9f7bc/?stachka_ul26=62  
- На последнем слайде презентации — QR-код на эту форму.

---

## Полезные ссылки по TMA (из слайдов)

| Что | Ссылка / пример |
|-----|------------------|
| Бот + переход в бинго | https://t.me/stachkagrosh_bot?startapp=bingo |
| ngrok (пример URL) | https://xxxx.ngrok-free.app → http://localhost:3000 |
| Локальный домен (Nginx) | https://my.local (DOMAIN из .env) |
| Шаринг в чат (формат) | https://t.me/share/url?url=...&text=... |

---

## Кратко по фичам TMA в докладе

1. **initData** — авторизация запросов к API (заголовок `x-telegram-init-data`).  
2. **ThemeParams** — тема (фон и цвет текста) из настроек Telegram.  
3. **BackButton** — кнопка «Назад» в шапке Telegram.  
4. **HapticFeedback** — вибрации (impact / notification).  
5. **showPopup / showAlert** — всплывающие уведомления.  
6. **LaunchParams (startParam)** — глубокие ссылки (?startapp=bingo).  
7. **openTelegramLink** — открытие ссылки внутри Telegram.  
8. **shareToStory** — шаринг в Stories с виджетом на Mini App.

---

*Файл подготовлен для копирования в GitHub Gist. Создайте новый Gist (gist.github.com), вставьте содержимое и при необходимости добавьте ссылки на конференции.*
