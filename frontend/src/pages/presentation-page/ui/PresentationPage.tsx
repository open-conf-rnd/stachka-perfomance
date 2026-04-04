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

      {/* 4. HapticFeedback — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="HapticFeedback: где используется"
            subtitle="Тактильный отклик Telegram WebApp"
            revealByClick
            blockDescFontSize="clamp(1.5rem, 2.6vmin, 40px)"
            steps={[
              { label: 'Вибрации', description: 'разные части приложения' },
              { label: 'Бинго, тап, реакции', description: 'вызываем вибрации' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 4. HapticFeedback — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="HapticFeedback"
          code={`
const haptic = window.Telegram?.WebApp?.HapticFeedback

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type NotificationType = 'success' | 'warning' | 'error'

export function triggerHaptic(payload) {

  if (payload.type === 'impact') {
    haptic.impactOccurred?.(payload.style ?? 'medium')
    return
  }

  if (payload.type === 'notification') {
    haptic.notificationOccurred?.(payload.notificationType ?? 'success')
    return
  }
}`}
          language="typescript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(1.8rem, 2.2vmin, 38px)"
        />
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

      {/* 3. BackButton — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="BackButton: где используется"
            subtitle="Нативная кнопка «Назад» в шапке Mini App"
            revealByClick
            blockDescFontSize="clamp(1.5rem, 2.6vmin, 40px)"
            steps={[
              { label: 'Все страницы', description: 'по умолчанию true' },
              { label: 'Когда скрываем', description: 'Главная — false' },
              { label: 'По клику', description: '.onClick → возврат на главную' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 3. BackButton — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="BackButton"
          code={`
// Telegram.WebApp.BackButton — Bot API 6.1+
const back = window.Telegram?.WebApp?.BackButton

const onBack = () => {
  // Router: navigate('/')
}

back?.show()
back?.onClick(onBack)

// перед уходом со «внутренней» страницы:
back?.offClick(onBack)
back?.hide()
`}
          language="typescript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(2.8rem, 2.2vmin, 38px)"
        />
      </Slide>

      {/* 5. showPopup — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="showPopup / showAlert: где используется"
            subtitle="Сообщение пользователю и тактильный отклик"
            revealByClick
            blockDescFontSize="clamp(1.5rem, 2.6vmin, 40px)"
            steps={[
              { label: 'Мини-игры', description: 'Ошибки и успехи' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 5. showPopup / showAlert — код */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="Уведомления"
          code={`
const webApp = window.Telegram?.WebApp

webApp.showAlert(message)

webApp.showPopup({
  title: 'Уведомление',
  message,
  buttons: [{ type: 'close' }],
})
            `}
          language="typescript"
          revealByClick={false}
          preFullWidth
          codeVerticalAlign="center"
          codeFontSize="clamp(3.8rem, 2.2vmin, 38px)"
        />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Мини-игры" description="Играем и получаем награды" imageSrc="/slides/games.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="TMA-стартер" description="Сейчас разберёмся, как стартовать" imageSrc="/slides/starter.png" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
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
            <SlideBlocks descriptionScale={2}  title="Как поднять локальный HTTPS" blockHeight={200} blocks={[
              { imageSrc: "/slides/ngrok.png", description: 'Самый популярный способ, но ...' },
              { imageSrc: "/slides/nginx.png", description: 'Поднимаем локальный прокси' },
            ]} />
          </SlideLogoBottom>
        </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Как поднять локальный HTTPS" description="" imageSrc="/slides/ngrok.png" />
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
              'Валидный SSL',
              'Быстрый старт',
              'Удобно для демо и тестов с реального телефона',
            ]}
            cons={[
              'Нужен интернет и доступ к ngrok',
              'Бесячая авторизация при входе',
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
          <SlideProsCons
            title="Docker + Nginx (локальный HTTPS)"
            titleFontSize="clamp(2.6rem, 5vmin, 80px)"
            columnTitleFontSize="clamp(2.4rem, 4.8vmin, 72px)"
            itemFontSize="clamp(2.8rem, 4vmin, 64px)"
            revealByClick
            pros={[
              'Всё локально: не зависит от внешних сервисов',
              'Один docker compose — Nginx + Frontend + API + WS',
            ]}
            cons={[
              'Самоподписанный серт',
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
