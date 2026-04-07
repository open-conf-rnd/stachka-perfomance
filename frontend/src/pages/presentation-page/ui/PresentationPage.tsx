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
  Merge2048LeaderboardSlide,
  SlideFrame,
  SlideLogoBottom,
  SlideImageText,
  SlideBlocks,
  SlideFullImage,
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
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_2.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame>
          <h2>Минутка на активацию</h2>
          <p>Подождите, пока спикер откроет вам функционал в мини-приложении.</p>
        </SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Шарим в сторис"
            description=""
            imageSrc="/slides/share_to.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_3.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame>
          <h2>Минутка на активацию</h2>
          <p>Подождите, пока спикер откроет вам функционал в мини-приложении.</p>
        </SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="QR-сканирование"
            description=""
            imageSrc="/slides/scan.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_4.png" />
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
          <SlideBlocks descriptionScale={1.9} title="Навигация и уведомления" blockHeight={200} blocks={[
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
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_5.png" />
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

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Вибрации" description="" imageSrc="/slides/haptic.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_6.png" />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_7.png" />
      </Slide>

      <PollHistogramSlides />

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
          <Merge2048LeaderboardSlide />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFullImage objectFit="contain" imageSrc="/slides/carbon_8.png" />
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

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Nginx + Self-Signed SSL"
            description="Локальный HTTPS для Telegram Mini App без облачного туннеля"
            imageSrc="/slides/nginx.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideProsCons
            title="Nginx (локальный HTTPS)"
            titleFontSize="clamp(2.6rem, 5vmin, 80px)"
            columnTitleFontSize="clamp(2.4rem, 4.8vmin, 72px)"
            itemFontSize="clamp(2.8rem, 4vmin, 64px)"
            revealByClick
            pros={[
              'Всё локально: не зависит от внешних сервисов',
            ]}
            cons={[
              'Самоподписанный серт',
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
              fontSize: 'clamp(2.2rem, 3vmin, 48px)',
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
              Приложения могут подстраиваться под разные экраны;
            </li>
            <li className="fragment" data-fragment-index={2}>
              Не забывайте про CORS: мини-приложение может открываться в виджете
            </li>
          </ul>
        </SlideFrame>
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
              fontSize: 'clamp(2.2rem, 3vmin, 48px)',
              lineHeight: 1.55,
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.35rem, 3vmin, 48px)',
            }}
          >
            <li className="fragment" data-fragment-index={0}>
              Тестировать можно и в Telegram Desktop.
            </li>
            <li className="fragment" data-fragment-index={1}>
              В веб-версии Telegram — там часто удобнее привычные DevTools Chrome.
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
          <ul
            style={{
              margin: '1.5rem 0 0',
              paddingLeft: '1.5em',
              fontSize: 'clamp(3rem, 2.5vmin, 36px)',
              lineHeight: 1.5,
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(2rem, 4vmin, 56px)',
            }}
          >
            <li>TMA — один бот, регистрация, навигация, активности, обратная связь</li>
            <li>Веб версия Telegram, тот же самый веб как и везде</li>
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
