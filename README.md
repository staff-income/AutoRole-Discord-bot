Discord AutoRole — полный проект с Web Panel (backend + frontend).

Установка и запуск локально (backend + frontend):
1. Установи Node.js 18+
2. Перейди в web-panel/frontend, установи зависимости: `npm install`
   затем сделай `npm run build`
3. Перейди в web-panel/backend, установи зависимости: `npm install`
4. Создай файл `.env` в web-panel/backend с содержимым:
   TOKEN=твой_дискорд_токен
   GUILD_ID=ид_сервера
   ROLE_IDS=111111,222222,333333
   LOG_CHANNEL= (необязательно)
5. Запусти backend: `node index.js` (он отдаст собранный frontend)

Для деплоя на Railway:
- Укажи переменные окружения TOKEN, GUILD_ID, ROLE_IDS
- Стартовая команда: `node web-panel/backend/index.js`
