# Scalekit Magic Link + Vercel

Готовая Next.js-сборка для Vercel:

1. Пользователь вводит email на главной странице.
2. Vercel server route вызывает Scalekit Passwordless API.
3. Scalekit отправляет одноразовую Magic Link через свою email-инфраструктуру.
4. Ссылка приходит на `/api/auth/verify`.
5. Сервер проверяет `link_token`, создаёт HttpOnly-сессию и открывает `/success`.

## 1. Настрой Scalekit

В Dashboard открой:

`Authentication -> Auth methods -> Magic Link & OTP`

Установи:

- **Authentication method:** `Magic link`
- **Expiry period:** `600` секунд для теста или `300` секунд для более строгого режима
- **Regenerate credentials on resend:** `ON`
- **Enforce same browser origin:** сначала `OFF` для простого теста; затем можно включить, если ссылка всегда открывается в том же браузере, где её запросили

Затем открой:

`Developers -> API Credentials`

Скопируй:

- Environment URL
- Client ID
- Client Secret

Для этой headless Passwordless-сборки OAuth `Allowed callback URL` не используется. Адрес возврата Magic Link передаётся сервером в параметре `magiclinkAuthUri` и имеет вид:

`https://YOUR-DOMAIN.vercel.app/api/auth/verify`

## 2. Залей проект в GitHub

Замени содержимое старого репозитория файлами из этой папки. Старые `index.html`, `main.js`, `style.css`, `vercel.json` и Vite-конфиг для этой сборки не нужны.

Не добавляй `.env.local` или секреты в GitHub.

## 3. Подключи GitHub к Vercel

В Vercel:

1. **Add New -> Project**
2. Импортируй GitHub-репозиторий
3. Framework Preset должен определиться как **Next.js**
4. Build Command оставь `next build`
5. Нажми **Environment Variables** и добавь значения ниже

## 4. Environment Variables в Vercel

Обязательные:

```env
SCALEKIT_ENVIRONMENT_URL=https://poshinfo.scalekit.dev
SCALEKIT_CLIENT_ID=skc_135200015827075076
SCALEKIT_CLIENT_SECRET=PASTE_SCALEKIT_CLIENT_SECRET_HERE
SESSION_SECRET=GENERATE_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS
APP_URL=https://YOUR-PROJECT.vercel.app
MAGIC_LINK_EXPIRES_IN=600
```

Сгенерировать `SESSION_SECRET` на Windows можно в PowerShell или CMD, если установлен Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Необязательная переменная для кнопки **Continue** на success page:

```env
DESTINATION_URL=https://example.com/
```

Если `DESTINATION_URL` пустая, кнопка **Finish** завершит локальную сессию и вернёт на форму входа.

Важно: `APP_URL` должен быть без `/` в конце и совпадать с реальным production-доменом. После смены домена обнови эту переменную и сделай Redeploy.

## 5. Тест

1. Открой `https://YOUR-PROJECT.vercel.app`
2. Введи свой email
3. Нажми **Send magic link**
4. Открой письмо ScaleKit
5. Нажми ссылку
6. Должна открыться `/success`

## Ошибки

### Письмо не отправляется

Проверь Vercel -> Project -> Settings -> Environment Variables. После изменения переменных обязательно сделай новый Deploy.

### Link invalid / expired

Запроси новое письмо. Magic Link одноразовая; старую ссылку нельзя использовать повторно. Проверь `MAGIC_LINK_EXPIRES_IN` и настройку Expiry в ScaleKit.

### Ссылка работает только в одном браузере

Это поведение настройки **Enforce same browser origin**. Для теста выключи её. Для чувствительных приложений лучше держать включённой.

### После клика открывается неправильный домен

Исправь `APP_URL` в Vercel и сделай Redeploy.

## Локальный запуск

```bash
npm install
copy .env.example .env.local
npm run dev
```

Открой `http://localhost:3000`.

## Vercel install fix

В этой версии Node.js закреплён на `20.x`, npm использует публичный реестр `https://registry.npmjs.org/`, а Vercel запускает `npm ci`. Это устраняет ошибку установки `Exit handler never called!`, возникавшую при автоматическом переходе на новый major Node.js и при lock-файле с недоступными registry URL.
