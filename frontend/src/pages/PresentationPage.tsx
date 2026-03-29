import { useRef } from 'react'
import { Deck, Slide } from '@revealjs/react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import 'reveal.js/plugin/highlight/monokai.css'
import './presentation/fonts.css'
import './PresentationPage.css'
import {
  TitleSlide,
  WhoAmISlide,
  RegistrationSlide,
  QrTaskSlide,
  QrVerifiedNotificationsOverlay,
  PollsStatsSlide,
  PollsLeadersSlide,
  PollsSummarySlide,
  SlideFrame,
  SlideLogoBottom,
  SlideImageText,
  SlideBlocks,
  SlideFullImage,
  SlideCode,
  SlideFlow,
  SlideProsCons,
} from './presentation'
import { QRCodeSVG } from 'qrcode.react'

const PLACEHOLDER_IMG = '/slides/rectangle-3.png'
const BOT_USERNAME = 'stachkagrosh_bot'
const BINGO_START_PARAM = 'bingo'
const FEEDBACK_FORM_QR_CODE = 'stachka-feedback-form-qr'

export function PresentationPage() {
  const botBingoLink = `https://t.me/${BOT_USERNAME}?startapp=${BINGO_START_PARAM}`
  const deckRef = useRef<{ getPlugin?: (name: string) => unknown } | null>(null)

  const applyRevealHighlight = () => {
    const plugin = deckRef.current?.getPlugin?.('highlight') as
      | { hljs?: { highlightElement?: (node: Element) => void } }
      | undefined
    const highlightElement = plugin?.hljs?.highlightElement
    if (!highlightElement) return

    document.querySelectorAll('.reveal pre code').forEach((node) => {
      highlightElement(node)
    })
  }

  return (
    <>
      <QrVerifiedNotificationsOverlay />
      <Deck
        deckRef={deckRef}
        plugins={[RevealHighlight]}
        onReady={() => {
          requestAnimationFrame(() => applyRevealHighlight())
        }}
        onSlideChange={() => {
          requestAnimationFrame(() => applyRevealHighlight())
        }}
        config={{
          hash: true,
          transition: 'slide',
          controls: true,
          progress: true,
          center: true,
          slideNumber: 'c/t',
          width: 1920,
          height: 1080,
          highlight: {
            highlightOnLoad: true,
          },
        }}
      >
      <Slide className="slide-fullsize" data-align="topleft">
        <TitleSlide />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <WhoAmISlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks
            title="Делаю разные митапы и конференции"
            blockHeight={220}
            descriptionScale={1.8}
            blocks={[
              { imageSrc: "/slides/openconf.png", description: 'OpenConf' },
              { imageSrc: '/slides/codieue.png', description: 'Кодьё' },
              { imageSrc: '/slides/fnd.png', description: 'Фронтенд? Да, ну!' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            titleScale={1}
            descriptionScale={1.2}
            title="Чего ждать от доклада?"
            description="Небольшой дисклеймер"
            imageSrc="/slides/disclaimer.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <RegistrationSlide />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks
            title="Структура"
            blockHeight={220}
            revealByClick
            blocks={[
              { imageSrc: "/slides/business.png", description: 'Много бизнеса' },
              { imageSrc: "/slides/interactive.png", description: 'Много интерактива' },
              { imageSrc: "/slides/code.png", description: 'Много кода' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Основная мысль"
            description="Делать приложения под TMA несложно и полезно"
            imageSrc="/slides/mind.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="На самом деле"
            description="мини ап как быстрый доступ к веб приложению с встроенной авторизацией"
            imageSrc="/slides/mind.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage imageSrc="/slides/openconf-banner.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage imageSrc="/slides/stand.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks
            title="Типичные задачи"
            blockHeight={220}
            descriptionScale={1.4}
            revealByClick
            blocks={[
              { imageSrc: "/slides/navigation.png", description: 'Как сделать удобную навигацию?' },
              { imageSrc: "/slides/activity.png", description: 'Как помочь партнёрам с активностями?' },
              { imageSrc: "/slides/form.png", description: 'Как собрать обратную связь?' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Уточка, помоги"
            description="Как объединить всё в одном месте?"
            imageSrc="/slides/help.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <RegistrationSlide />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Как помочь партнёрам с активностью"
            description="Мы хотим, чтобы к каждому партнёру подходили участники"
            imageSrc="/slides/activity.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              width: '100%',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 'clamp(5rem, 10vmin, 180px)', color: '#1a1a1a', textAlign: 'left' }}>
              Бинго
            </h2>
            <QRCodeSVG
              value={botBingoLink}
              size={900}
              level="M"
              bgColor="transparent"
              fgColor="#1a1a1a"
            />
          </div>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Прямо в Бинго"
            description="Так говорят?"
            imageSrc="/slides/bingo.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Всё ещё Бинго"
            description="для вниманательных"
            imageSrc="/slides/bingo-share.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Как будем взаимодействовать"
            titleScale={0.8}
            descriptionScale={1.2}
            description="Удобно и просто"
            imageSrc="/slides/pilot.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Шаринг"
            description=""
            imageSrc="/slides/bingo-share.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

            {/* 9. shareToStory — использование */}
            <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="shareToStory: где используется"
            subtitle="Кнопка «Share to Story» в Бинго"
            revealByClick
            blockDescFontSize="clamp(1.6rem, 2.8vmin, 42px)"
            steps={[
              { label: 'Бинго', description: 'Кнопка «Share to Story»' },
              { label: 'Stories', description: 'Медиа + текст + ссылка' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

            {/* 9. shareToStory — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="1. shareToStory — шаринг в Stories"
          code={`
const share = window.Telegram?.WebApp?.shareToStory

share(mediaUrl, {
  text: 'Прохожу бинго на докладе!',
  widget_link: { url: location.href, name: 'Открыть TMA' }
})`}
          language="javascript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(3rem, 3vmin, 64px)"
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit='contain' imageSrc="/slides/dogovor.png" />
      </Slide>


      {/* 6. LaunchParams — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="startParam и Cloud Storage: где используется"
            subtitle=""
            revealByClick
            steps={[
              { label: 'Ссылка из бота/рекламы', description: '?startapp=bingo' },
              { label: 'При открытии TMA', description: 'start_param → флаг в Cloud Storage → /bingo' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 6. LaunchParams / startParam — код (AppContent, App.tsx) */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="LaunchParams и Telegram Cloud Storage"
          code={`
const cloud = window.Telegram?.WebApp?.CloudStorage
const launchParams = window.Telegram?.WebApp?.initDataUnsafe?.start_param

if (launchParams === 'bingo') {
  cloud.getItem('bingoParam', (err, value) => {
    if (err || value === '1') return

    cloud.setItem('bingoParam', '1', () => {
      navigate('/bingo', { replace: true })
    })
  })
}
`}
          language="typescript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(2.4rem, 2.2vmin, 38px)"
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <QrTaskSlide />
        </SlideLogoBottom>
      </Slide>

      {/* 10. Telegram QR Scanner — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="QR-сканирование: где используется"
            subtitle="Telegram открывает нативную камеру внутри Mini App"
            revealByClick
            blockDescFontSize="clamp(1.5rem, 2.6vmin, 40px)"
            steps={[
              { label: 'Кнопка', description: 'Пользователь нажимает «Сканировать QR»' },
              { label: 'Метод', description: 'вызываем showScanQrPopup()' },
              { label: 'Камера', description: 'Открывается нативный сканер QR-кодов' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 10. Telegram QR Scanner — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="2. QR Scanner — открытие камеры"
          code={`
const webApp = window.Telegram?.WebApp

const content = await new Promise((resolve) => {
  webApp?.showScanQrPopup(
    { text: 'Наведи на QR-код задания' },
    (qrText) => {
      resolve(qrText ?? null)
      return true // true = закрыть сканер после чтения
    }
  )
})`}
          language="typescript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(2.2rem, 2.8vmin, 52px)"
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Как помочь участнику с навигацией"
            description="Мы хотим, чтобы все всегда знали время следующего доклада и где он будет проходить"
            imageSrc="/slides/navigation.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks descriptionScale={2} title="Навигация и уведомления" blockHeight={200} blocks={[
            { imageSrc: "/slides/notification1.png", description: 'Уведомления о начале доклада' },
            { imageSrc: "/slides/notification-2.png", description: 'Уведомления о начале активности' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Как собрать обратную связь"
            description="Мы хотим, чтобы все могли оставить обратную связь"
            imageSrc="/slides/form.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Сбор обратной связи после доклада"
            description=""
            imageSrc={PLACEHOLDER_IMG}
            imageContent={(
              <QRCodeSVG
                value={FEEDBACK_FORM_QR_CODE}
                size={760}
                level="M"
                bgColor="transparent"
                fgColor="#1a1a1a"
              />
            )}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="Отправка сообщения"
          code={`
await fetch(
  \`https://api.telegram.org/bot\${botToken}/sendMessage\`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  },
)`}
          language="typescript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(2.7rem, 2.2vmin, 38px)"
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame><h2>Что не успели сделать</h2><p>Но очень хотелось бы</p></SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Мини-игры" description="Играем и получаем награды" imageSrc="/slides/games.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <PollsStatsSlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <PollsLeadersSlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <PollsSummarySlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="TMA-стартер" description="Сейчас разберёмся, как стартовать" imageSrc="/slides/starter.png" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(2rem, 4vmin, 48px)', fontWeight: 700 }}>https://github.com/DmitriyGrosh/tma-starter</h2>
          </div>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Идеальный мир" blockHeight={200} blocks={[
            { imageSrc: "/slides/code-1.png", description: 'Устанавливаем' },
            { imageSrc: "/slides/code-2.png", description: 'Запускаем' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Локальная разработка" description="На этапе разработки мини-приложения Telegram требует действительного URL-адреса для отображения и тестирования в клиенте." imageSrc="/slides/local.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <SlideBlocks title="Как поднять локальный HTTPS" blockHeight={200} blocks={[
              { imageSrc: "/slides/ngrok.png", description: 'Самый популярный способ, но нужен VPN' },
              { imageSrc: "/slides/cloudflare.png", description: 'Второй по популярности способ, но нужен VPN' },
              { imageSrc: "/slides/nginx.png", description: 'Поднимаем локальный прокси' },
            ]} />
          </SlideLogoBottom>
        </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Как поднять локальный HTTPS" description="Покажу на примере ngrok" imageSrc="/slides/ngrok.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="Запуск ngrok"
          codeFontSize="clamp(3rem, 6vmin, 100px)"
          lines={[
            { text: '# Установка (если ещё нет)', comment: true },
            { text: 'npm install -g ngrok', comment: false },
            { text: '# или: brew install ngrok', comment: true },
            { text: '', comment: false },
            { text: '# Запуск туннеля на порт приложения', comment: true },
            { text: 'ngrok http 3000', comment: false },
            { text: '', comment: false },
            { text: '# ngrok создаёт URL вида:', comment: true },
            { text: 'https://a1b2c3d4.ngrok-free.app ->', comment: false },
            { text: '-> http://localhost:3000', comment: false },
          ]}
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="Local HTTPS + ngrok для Telegram Mini App"
            subtitle="Как Telegram открывает ваше локальное приложение через безопасный туннель"
            revealByClick
            steps={[
              { label: 'Telegram', description: 'Пользователь жмёт кнопку → WebView' },
              { label: 'Bot API', description: 'web_app.url = https://xx.ngrok.app', arrowLabel: 'HTTPS' },
              { label: 'ngrok Edge', description: 'SSL терминация, валидный сертификат', arrowLabel: 'DNS', zone: 'cloud' },
              { label: 'ngrok Agent', description: 'Исходящее соединение', arrowLabel: 'TLS туннель', zone: 'local' },
              { label: 'Dev Server', description: 'localhost:5173. HMR & DevTools', arrowLabel: ':5173', zone: 'local' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="Шаги настройки"
            revealByClick
            steps={[
              { label: '1. Dev-сервер', description: 'npm run dev → :5173' },
              { label: '2. ngrok', description: 'ngrok http 5173 → https URL' },
              { label: '3. Бот', description: 'URL → web_app.url' },
              { label: '4. Готово', description: 'TG → ngrok → localhost' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="Терминал: dev + ngrok + Bot API"
          codeFontSize="clamp(2.2rem, 4vmin, 56px)"
          lines={[
            { text: '$ npm run dev   # :5173', comment: false },
            { text: '$ ngrok http 5173', comment: false },
            { text: '', comment: false },
            { text: '# Подставить свой https URL в setChatMenuButton:', comment: true },
            { text: '$ curl -X POST ".../setChatMenuButton" \\', comment: false },
            { text: "  -d '{\"url\":\"https://xx.ngrok-free.app\"}'", comment: false },
          ]}
        />
      </Slide>

      {/* Плюсы и минусы подходов */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideProsCons
            title="ngrok"
            titleFontSize="clamp(2.6rem, 5vmin, 80px)"
            columnTitleFontSize="clamp(2.4rem, 4.8vmin, 72px)"
            itemFontSize="clamp(3rem, 4vmin, 64px)"
            revealByClick
            pros={[
              'Валидный SSL — Telegram доверяет без доп. настроек',
              'Быстрый старт: одна команда, не нужен Docker',
              'Не нужно трогать /etc/hosts и сертификаты',
              'Удобно для демо и тестов с реального телефона',
            ]}
            cons={[
              'Нужен интернет и доступ к ngrok',
              'Лимиты бесплатного плана',
              'Трафик идёт через облако ngrok',
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* Docker + Nginx + Self-Signed SSL для TMA — та же логика, что и для ngrok */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Docker + Nginx + Self-Signed SSL"
            description="Локальный HTTPS для Telegram Mini App без облачного туннеля"
            imageSrc="/slides/nginx.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="SSL, hosts и Docker"
          codeFontSize="clamp(2.2rem, 4vmin, 56px)"
          lines={[
            { text: '# Генерация самоподписанного сертификата', comment: true },
            { text: '$ ./scripts/gen-ssl.sh   # cert.pem, key.pem', comment: false },
            { text: '', comment: false },
            { text: '# DNS на localhost (DOMAIN из .env, например my.local)', comment: true },
            { text: '$ echo "127.0.0.1 my.local" | sudo tee -a /etc/hosts', comment: false },
            { text: '', comment: false },
            { text: '# Запуск Nginx + сервисов', comment: true },
            { text: '$ docker compose -f docker/docker-compose.dev.yml up --build', comment: false },
            { text: '# → https://my.local:443', comment: true },
          ]}
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="Docker + Nginx + Self-Signed SSL для Telegram Mini App"
            subtitle="Как Telegram доходит до вашего приложения через /etc/hosts и Nginx"
            revealByClick
            steps={[
              { label: 'Telegram', description: 'Пользователь жмёт кнопку → WebView' },
              { label: 'Bot API', description: 'web_app.url = https://DOMAIN', arrowLabel: 'HTTPS' },
              { label: '/etc/hosts', description: 'DOMAIN → 127.0.0.1', arrowLabel: 'DNS' },
              { label: 'Nginx (Docker)', description: 'SSL терминация (cert.pem + key.pem). / → :5173, /api/ → :3000, /ws → :3001', arrowLabel: ':443' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="Шаги настройки (Nginx)"
            revealByClick
            steps={[
              { label: '1. SSL', description: './scripts/gen-ssl.sh — самоподписанный серт' },
              { label: '2. .env', description: 'DOMAIN=my.local' },
              { label: '3. /etc/hosts', description: '127.0.0.1 my.local' },
              { label: '4. Docker', description: 'docker compose up — Nginx + Frontend, API, WS' },
              { label: '5. Бот', description: 'web_app.url = https://my.local' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="Терминал: SSL + hosts + Docker"
          codeFontSize="clamp(2.2rem, 4vmin, 56px)"
          lines={[
            { text: '$ ./scripts/gen-ssl.sh', comment: false },
            { text: '$ echo "127.0.0.1 my.local" >> /etc/hosts', comment: false },
            { text: '$ docker compose -f docker/docker-compose.dev.yml up --build', comment: false },
            { text: '', comment: false },
            { text: '# Самоподписанный серт — Telegram не доверяет.', comment: true },
            { text: '# Нужен --ignore-certificate-errors в WebView или ngrok.', comment: true },
          ]}
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideProsCons
            title="Docker + Nginx (локальный HTTPS)"
            titleFontSize="clamp(2.6rem, 5vmin, 80px)"
            columnTitleFontSize="clamp(2.4rem, 4.8vmin, 72px)"
            itemFontSize="clamp(2.8rem, 4vmin, 64px)"
            revealByClick
            pros={[
              'Всё локально: не зависит от внешних сервисов',
              'Один docker compose — Nginx + Frontend + API + WS',
              'Полный контроль над доменом и сертификатами',
              'Нет лимитов и платных подписок',
            ]}
            cons={[
              'Самоподписанный серт — Telegram не доверяет по умолчанию',
              'Нужен --ignore-certificate-errors или обход для теста в TG',
              'Сложнее настройка: SSL, /etc/hosts, Docker',
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText description="" title="Проблемы и их решения" imageSrc="/slides/problems.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="scripts/gen-ssl.sh"
          codeFontSize="clamp(1.4rem, 2.8vmin, 44px)"
          fragmentIndexPerLine={[
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* блок 1: пути и загрузка .env */
            1, 1, 1, 1, /* блок 2: DOMAIN и mkdir */
            2, 2, 2, 2, 2, /* блок 3: openssl */
          ]}
          lines={[
            { text: '# Пути и загрузка переменных из .env', comment: true },
            { text: 'set -e', comment: false },
            { text: 'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"', comment: false },
            { text: 'PROJECT_DIR="$SCRIPT_DIR/.."', comment: false },
            { text: 'SSL_DIR="$PROJECT_DIR/docker/nginx/ssl"', comment: false },
            { text: 'ENV_FILE="$PROJECT_DIR/.env"', comment: false },
            { text: '', comment: false },
            { text: 'if [ -f "$ENV_FILE" ]; then', comment: false },
            { text: '  set -a && source "$ENV_FILE" && set +a', comment: false },
            { text: 'fi', comment: false },
            { text: '', comment: false },
            { text: '# Домен из аргумента или .env, создаём каталог для сертификатов', comment: true },
            { text: 'DOMAIN="${1:-${DOMAIN}}"', comment: false },
            { text: 'mkdir -p "$SSL_DIR"', comment: false },
            { text: '', comment: false },
            { text: '# Генерация самоподписанного сертификата (cert.pem, key.pem)', comment: true },
            { text: 'openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\', comment: false },
            { text: '  -keyout "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.pem" \\', comment: false },
            { text: '  -subj "/CN=$DOMAIN" -addext "subjectAltName=DNS:$DOMAIN"', comment: false },
            { text: 'echo "SSL сертификаты созданы в $SSL_DIR для домена: $DOMAIN"', comment: false },
          ]}
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title=".env (переменные для TMA / локального HTTPS)"
          codeFontSize="clamp(1.6rem, 3vmin, 52px)"
          lines={[
            { text: '# Telegram Bot API (для бота Mini App)', comment: true },
            { text: 'TG_BOT_API=your_bot_token', comment: false },
            { text: '', comment: false },
            { text: '# Домен для HTTPS (ngrok, my.local и т.д.). После смены — ./scripts/gen-ssl.sh', comment: true },
            { text: 'DOMAIN=localhost', comment: false },
            { text: '', comment: false },
            { text: 'API_PORT=3000', comment: false },
            { text: 'STATS_WS_PORT=3001', comment: false },
          ]}
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Проблема самоподписанного сертификата" description="Нельзя просто так сгенерировать сертификат" imageSrc="/slides/cert.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Открываем Keyscan" description="" imageSrc="/slides/keyscan.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Ищем локальный домен" description="" imageSrc="/slides/local-domain.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Нажимаем на доверие" description="" imageSrc="/slides/trust.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(2.5rem, 5vmin, 80px)', fontWeight: 700, color: '#1a1a1a' }}>
                Выводы
              </h2>
              <p style={{ margin: 0, fontSize: 'clamp(2rem, 4.2vmin, 64px)', lineHeight: 1.4, color: '#334155', maxWidth: '90%' }}>
                Если возьмёте мой стартер или похожее решение — вот такой простой старт можете сделать.
              </p>
              <pre
                style={{
                  margin: 0,
                  padding: '24px 32px',
                  background: '#1a1b26',
                  color: '#c0caf5',
                  borderRadius: 16,
                  fontSize: 'clamp(1.4rem, 2.8vmin, 44px)',
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  overflow: 'auto',
                }}
              >
                <code>docker compose -f docker/docker-compose.dev.yml up --build -d</code>
              </pre>
            </div>
          </div>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', height: '100%', minHeight: 0 }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vmin, 72px)', fontWeight: 700, color: '#1a1a1a', flexShrink: 0 }}>
              Немного про отладку
            </h2>
            <p style={{ margin: 0, fontSize: 'clamp(1.1rem, 2.2vmin, 28px)', lineHeight: 1.4, color: '#334155', flexShrink: 0 }}>
              Нужно скачать бета-версию Telegram Desktop: обновления приходят быстрее, новые фичи доступны раньше. Стабильная версия обновляется реже, но лучше протестирована. Установите бета поверх текущего Telegram Desktop.
            </p>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <img src="/slides/beta.png" alt="Beta version и Old system versions на desktop.telegram.org" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
            </div>
            <a
              href="https://desktop.telegram.org/changelog#beta-version"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 'clamp(1rem, 2vmin, 24px)', color: '#0088cc', fontWeight: 600, flexShrink: 0 }}
            >
              desktop.telegram.org/changelog#beta-version
            </a>
          </div>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Нажмите 5 раз на «Настройки»" description="" imageSrc="/slides/5click.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Включаем режим отладки" description="" imageSrc="/slides/debug.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Нажимаем правой кнопкой мыши" description="" imageSrc="/slides/rightclick.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideCode
            title="Решаем проблемы на Linux"
            codeFontSize="clamp(2rem, 3.5vmin, 56px)"
            revealByClick
            lines={[
              { text: '# Самоподписанный сертификат — добавить в доверенные', comment: true },
              { text: 'sudo cp docker/nginx/ssl/cert.pem /usr/local/share/ca-certificates/my-local.crt', comment: false },
              { text: 'sudo update-ca-certificates', comment: false },
              { text: '', comment: false },
              { text: '# Или запуск Chrome с игнором сертификата (только для разработки)', comment: true },
              { text: 'google-chrome --ignore-certificate-errors \\', comment: false },
              { text: '  --ignore-certificate-errors-spki-list \\', comment: false },
              { text: '  --user-data-dir=/tmp/chrome-dev https://my.local', comment: false },
              { text: '', comment: false },
              { text: '# Chromium', comment: true },
              { text: 'chromium --ignore-certificate-errors --user-data-dir=/tmp/chrome-dev https://my.local', comment: false },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideCode
            title="Решаем проблемы на Windows"
            codeFontSize="clamp(2rem, 3.5vmin, 56px)"
            revealByClick
            lines={[
              { text: 'REM Добавить сертификат в доверенные (PowerShell от администратора)', comment: true },
              { text: 'Import-Certificate -FilePath "docker\\nginx\\ssl\\cert.pem" -CertStoreLocation Cert:\\LocalMachine\\Root', comment: false },
              { text: '', comment: false },
              { text: 'REM Или через certmgr: certmgr.msc → Доверенные корневые ЦС → Действия → Импорт', comment: true },
              { text: '', comment: false },
              { text: 'REM Chrome с игнором сертификата (только для разработки)', comment: true },
              { text: '& "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" ^', comment: false },
              { text: '  --ignore-certificate-errors --user-data-dir=%TEMP%\\chrome-dev https://my.local', comment: false },
              { text: '', comment: false },
              { text: 'REM После добавления серта перезапустить браузер', comment: true },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* Фичи TMA в приложении — по одной: код → использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2 style={{ margin: 0, fontSize: 'clamp(2.5rem, 5vmin, 80px)', fontWeight: 700, color: '#1a1a1a' }}>
            Фичи TMA в приложении
          </h2>
          <p style={{ margin: 0, fontSize: 'clamp(1.4rem, 2.8vmin, 40px)', color: '#555', marginTop: '16px' }}>
            Разберём по шагам: код → где используется
          </p>
          <SlideBlocks
            title=""
            blockHeight={220}
            blocks={[
              { imageSrc: '/slides/code.png', description: 'Код фичи' },
              { imageSrc: '/slides/interactive.png', description: 'В приложении' },
              { imageSrc: '/slides/form.png', description: 'Где используется' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 2. ThemeParams — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="2. ThemeParams — тема (фон и текст)"
          codeFontSize="clamp(3.2rem, 3vmin, 64px)"
          revealByClick={false}
          lines={[
            { text: '// App.tsx', comment: true },
            { text: 'const themeParams = useThemeParams()', comment: false },
            { text: '', comment: false },
            { text: 'const bg = themeParams?.bgColor ?? "#1c1c1e"', comment: false },
            { text: 'const fg = themeParams?.textColor ?? "#ffffff"', comment: false },
            { text: '', comment: false },
            { text: 'return (', comment: false },
            { text: '  <div style={{ backgroundColor: bg, color: fg }}>', comment: false },
            { text: '    ...', comment: false },
            { text: '  </div>', comment: false },
            { text: ')', comment: false },
          ]}
        />
      </Slide>

      {/* 2. ThemeParams — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="ThemeParams: где используется"
            subtitle="Приложение подстраивается под светлую/тёмную тему Telegram"
            revealByClick
            steps={[
              { label: 'App', description: 'Корневой div получает bgColor и textColor из Telegram' },
              { label: 'Все экраны', description: 'Наследуют фон и цвет текста — без своих стилей темы' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 3. BackButton — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="3. BackButton — кнопка «Назад»"
          codeFontSize="clamp(3rem, 3vmin, 64px)"
          revealByClick={false}
          lines={[
            { text: '// useTelegramBackButton.ts', comment: true },
            { text: 'const backButton = useBackButton()', comment: false },
            { text: '', comment: false },
            { text: 'useEffect(() => {', comment: false },
            { text: '  backButton.show()', comment: false },
            { text: "  backButton.on('click', () => navigate('/'))", comment: false },
            { text: '  return () => {', comment: false },
            { text: "    backButton.off('click', ...)", comment: false },
            { text: '    backButton.hide()', comment: false },
            { text: '  }', comment: false },
            { text: '}, [backButton, navigate])', comment: false },
          ]}
        />
      </Slide>

      {/* 3. BackButton — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="BackButton: где используется"
            subtitle="PageLayout включает кнопку на всех экранах кроме главной и админки"
            revealByClick
            steps={[
              { label: 'PageLayout', description: 'useTelegramBackButton(enableBackButton)' },
              { label: 'Вложенные страницы', description: 'Видна кнопка «Назад» в шапке Telegram' },
              { label: 'По клику', description: 'navigate("/") — возврат на главную' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 4. HapticFeedback — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="4. HapticFeedback — вибрации"
          codeFontSize="clamp(2.3rem, 2.8vmin, 64px)"
          revealByClick={false}
          lines={[
            { text: '// lib/haptic.ts', comment: true },
            { text: 'const haptic = window.Telegram?.WebApp?.HapticFeedback', comment: false },
            { text: '', comment: false },
            { text: '// Удар (кнопка, тап)', comment: true },
            { text: 'haptic.impactOccurred?.(style)  // light | medium | heavy', comment: false },
            { text: '', comment: false },
            { text: '// Уведомление (успех/ошибка)', comment: true },
            { text: 'haptic.notificationOccurred?.(type)  // success | warning | error', comment: false },
          ]}
        />
      </Slide>

      {/* 4. HapticFeedback — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="HapticFeedback: где используется"
            subtitle="Вибрация при действиях и после ответа API"
            revealByClick
            steps={[
              { label: 'HapticPage', description: 'Демо: кнопки impact и notification' },
              { label: 'Бинго, тап, реакции', description: 'impact при нажатии, notification после успеха/ошибки' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 5. showPopup / showAlert — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="5. showPopup / showAlert — уведомления"
          codeFontSize="clamp(2.3rem, 3vmin, 64px)"
          revealByClick={false}
          lines={[
            { text: '// telegramNotifications.ts', comment: true },
            { text: 'webApp.showPopup({ title, message, buttons: [{ type: "close" }] })', comment: false },
            { text: '// или showAlert(message)', comment: true },
            { text: '', comment: false },
            { text: 'notifyTelegramResult(type, message)  // haptic + popup', comment: false },
          ]}
        />
      </Slide>

      {/* 5. showPopup — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="showPopup: где используется"
            subtitle="Всплывающее окно после действия + вибрация"
            revealByClick
            steps={[
              { label: 'apiRequestWithNotifications', description: 'Успех/ошибка после API (бинго, тап, опросы)' },
              { label: 'SupportPage', description: 'После оплаты Stars: «Оплата прошла» / «Оплата не прошла»' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 8. openTelegramLink — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="8. openTelegramLink — открыть ссылку в Telegram"
          codeFontSize="clamp(2.4rem, 3vmin, 64px)"
          revealByClick={false}
          lines={[
            { text: '// BingoPage — Share в чат', comment: true },
            { text: 'const shareUrl = `https://t.me/share/url?url=...&text=...`', comment: false },
            { text: 'const openTelegramLink = window.Telegram?.WebApp?.openTelegramLink', comment: false },
            { text: '', comment: false },
            { text: 'if (openTelegramLink) {', comment: false },
            { text: '  openTelegramLink(shareUrl)  // внутри Telegram', comment: false },
            { text: '} else {', comment: false },
            { text: "  window.open(shareUrl, '_blank')  // fallback", comment: false },
            { text: '}', comment: false },
          ]}
        />
      </Slide>

      {/* 8. openTelegramLink — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="openTelegramLink: где используется"
            subtitle="Шаринг в чат без выхода из TMA"
            revealByClick
            steps={[
              { label: 'Бинго', description: 'Кнопка «Share в чат» — t.me/share/url с текстом и ссылкой на TMA' },
              { label: 'Открытие', description: 'Выбор чата в интерфейсе Telegram, не браузер' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame>
          <h2 style={{ margin: 0, fontSize: 'clamp(2.5rem, 5vmin, 80px)', fontWeight: 700, color: '#1a1a1a' }}>
            Итоги доклада
          </h2>
          <ul style={{ margin: '1.5rem 0 0', paddingLeft: '1.5em', fontSize: 'clamp(3rem, 2.5vmin, 36px)', lineHeight: 1.5, color: '#333' }}>
            <li>TMA — один бот, регистрация, навигация, активности, обратная связь</li>
            <li>Делать мини-приложения под Telegram не сложно и полезно</li>
          </ul>
        </SlideFrame>
      </Slide>


      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%', height: '100%' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vmin, 72px)', fontWeight: 700, color: '#1a1a1a' }}>
              Обратная связь
            </h2>
            <p style={{ margin: 0, fontSize: 'clamp(1.2rem, 2.4vmin, 32px)', color: '#555' }}>
              Отсканируйте QR-код
            </p>
            <QRCodeSVG
              value="https://forms.yandex.ru/cloud/698dbe0f6d2d734220a9f7bc/?stachka_ul26=62"
              size={400}
              level="M"
              bgColor="transparent"
              fgColor="#1a1a1a"
            />
          </div>
        </SlideLogoBottom>
      </Slide>

      </Deck>
    </>
  )
}
