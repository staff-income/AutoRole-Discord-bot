FROM node:18

WORKDIR /app

COPY web-panel/backend ./backend
COPY web-panel/frontend ./frontend

WORKDIR /app/backend
RUN npm install

WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app
RUN mkdir -p backend/public
RUN cp -r frontend/build/* backend/public/

WORKDIR /app/backend
CMD ["node", "index.js"]
