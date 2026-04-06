import { useRef } from 'react'
import { Deck, Slide } from '@revealjs/react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import 'reveal.js/plugin/highlight/monokai.css'
import '../presentation/fonts.css'
import './PresentationPage.css'
import {
  TitleSlide,
  WhoAmISlide,
  RegistrationSlide,
  QrTaskSlide,
  QrVerifiedNotificationsOverlay,
  PollHistogramSlides,
  TapTotalSlide,
  ReactionPresentationSlide,
  SlideFrame,
  SlideLogoBottom,
  SlideImageText,
  SlideBlocks,
  SlideFullImage,
  SlideCode,
  SlideFlow,
  SlideProsCons,
  SlideLogisticsRoute,
  SlideRouteStats,
} from '../presentation'
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
        <SlideFullImage imageSrc="/slides/rostov.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogisticsRoute />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideRouteStats />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/cat.jpg" />
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
          <SlideImageText
            title="Основная мысль"
            description="Делать приложения под TMA несложно и полезно"
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
            descriptionScale={1.8}
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
        <SlideFrame>
          <h2>Минутка на активацию</h2>
          <p>Подождите, пока спикер откроет вам функционал в мини-приложении.</p>
        </SlideFrame>
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
            title="Шаринг"
            description=""
            imageSrc="/slides/bingo-share.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame>
          <h2>Минутка на активацию</h2>
          <p>Подождите, пока спикер откроет вам функционал в мини-приложении.</p>
        </SlideFrame>
      </Slide>

            {/* 9. shareToStory — использование */}
            <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="shareToStory: где используется"
            subtitle=""
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
          title="shareToStory — шаринг в Stories"
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


      {/* 6. LaunchParams — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="startParam: где используется"
            subtitle=""
            revealByClick
            steps={[
              { label: 'Ссылка из бота/рекламы', description: '?startapp=bingo' },
              { label: 'При открытии TMA', description: 'start_param → флаг в sessionStorage (сессия WebView) → /bingo' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      {/* 6. LaunchParams / startParam — код (AppContent, App.tsx) */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideCode
          title="LaunchParams и флаг в sessionStorage"
          code={`
const startParam =
  useLaunchParams().startParam
  ?? window.Telegram?.WebApp?.initDataUnsafe?.start_param

if (startParam === 'bingo' && location.pathname === '/') {
  if (sessionStorage.getItem('bingo-start-param-consumed') === '1') return
  sessionStorage.setItem('bingo-start-param-consumed', '1')
  navigate('/bingo', { replace: true })
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
        <SlideFrame>
          <h2>Минутка на активацию</h2>
          <p>Подождите, пока спикер откроет вам функционал в мини-приложении.</p>
        </SlideFrame>
      </Slide>

      {/* 10. Telegram QR Scanner — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="QR-сканирование: где используется"
            subtitle=""
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
          title="QR Scanner — открытие камеры"
          code={`
const show = window.Telegram?.WebApp?.showScanQrPopup

const content = await new Promise((resolve) => {
  show(
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
          <QrTaskSlide />
        </SlideLogoBottom>
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
            description="Сканируй QR в мини-аппе"
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
        <SlideFrame>
          <h2>Минутка на активацию</h2>
          <p>Подождите, пока спикер откроет вам функционал в мини-приложении.</p>
        </SlideFrame>
      </Slide>

      {/* 4. HapticFeedback — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="HapticFeedback: где используется"
            subtitle=""
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

      <PollHistogramSlides />

      {/* 5. showPopup — использование */}
      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideFlow
            title="showPopup / showAlert: где используется"
            subtitle=""
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
          <TapTotalSlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <ReactionPresentationSlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Локальная разработка" description="" imageSrc="/slides/image.png" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          </div>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks descriptionScale={2} title="Идеальный мир" blockHeight={200} blocks={[
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', height: '100%', minHeight: 0 }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vmin, 72px)', fontWeight: 700, color: '#1a1a1a', flexShrink: 0 }}>
              Немного про отладку
            </h2>
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
          <SlideImageText title="Нажимаем правой кнопкой мыши" description="" objectFit="fill" imageSrc="/slides/rightclick.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame>
          <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vmin, 72px)', fontWeight: 700, color: '#1a1a1a' }}>
            Особенности отладки
          </h2>
          <ul
            style={{
              margin: '1.25rem 0 0',
              paddingLeft: '1.35em',
              fontSize: 'clamp(1.8rem, 2.3vmin, 48px)',
              lineHeight: 1.55,
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.35rem, 3vmin, 48px)',
            }}
          >
            <li className="fragment" data-fragment-index={0}>
              Если смотреть логи только из самого бота — помните о жёсткой привязке к Safari на Mac.
            </li>
            <li className="fragment" data-fragment-index={1}>
              Приложения могут подстраиваться под разные экраны; в вебе окно можно растянуть и вести себя как
              десктоп-сайт или приложение.
            </li>
            <li className="fragment" data-fragment-index={2}>
              Не забывайте про CORS: мини-приложение может открываться в браузере (например, виджет в
              Яндекс.Браузере).
            </li>
            <li className="fragment" data-fragment-index={3}>
              Тестировать можно и в Telegram Desktop.
            </li>
            <li className="fragment" data-fragment-index={4}>
              И в веб-версии Telegram — там часто удобнее привычные DevTools Chrome.
            </li>
          </ul>
        </SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame>
          <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vmin, 72px)', fontWeight: 700, color: '#1a1a1a' }}>
            Домашнее задание
          </h2>
          <ul
            style={{
              margin: '1.25rem 0 0',
              paddingLeft: '1.35em',
              fontSize: 'clamp(2.2rem, 3vmin, 48px)',
              lineHeight: 1.55,
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.35rem, 3vmin, 48px)',
            }}
          >
            <li className="fragment" data-fragment-index={0}>
              Для локальных TLS-сертификатов попробуйте что-то вроде <strong>mkcert</strong>.
            </li>
            <li className="fragment" data-fragment-index={1}>
              На бесплатном <strong>ngrok</strong> бывает заглушка с предложением включить куки — она может
              помешать загрузке ресурсов.
            </li>
          </ul>
        </SlideFrame>
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
          <SlideImageText
            title="На самом деле"
            description="мини ап как быстрый доступ к веб приложению с встроенной авторизацией"
            imageSrc="/slides/mind.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%', height: '100%' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vmin, 72px)', fontWeight: 700, color: '#1a1a1a' }}>
              Обратная связь (сканировать обычной камерой)
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
