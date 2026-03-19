import { Deck, Slide } from '@revealjs/react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
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
} from './presentation'
import { QRCodeSVG } from 'qrcode.react'

const PLACEHOLDER_IMG = '/slides/rectangle-3.png'
const BOT_USERNAME = 'stachkagrosh_bot'
const BINGO_START_PARAM = 'bingo'
const FEEDBACK_FORM_QR_CODE = 'stachka-feedback-form-qr'

export function PresentationPage() {
  const botBingoLink = `https://t.me/${BOT_USERNAME}?startapp=${BINGO_START_PARAM}`

  return (
    <>
      <QrVerifiedNotificationsOverlay />
      <Deck
        config={{
          hash: true,
          transition: 'slide',
          controls: true,
          progress: true,
          center: true,
          slideNumber: 'c/t',
          width: 1920,
          height: 1080,
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
            title="Чего ждать от доклада?"
            description="Неболшой дислеймер"
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
            title="Основаная мысль"
            description="Делать приложения под tma не сложно и полезно"
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
            revealByClick
            blocks={[
              { imageSrc: "/slides/navigation.png", description: 'Как сделать удобную навигацию?' },
              { imageSrc: "/slides/activity.png", description: 'Как помочь партнерам с активностями?' },
              { imageSrc: "/slides/form.png", description: 'Как собрать обратную связь?' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Уточка помоги"
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
            title="Как помочь партнерам с активностью"
            description="Мы хотим чтобы к каждому партнеру подходили участники"
            imageSrc="/slides/activity.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
        <QRCodeSVG
            value={botBingoLink}
            size={900}
            level="M"
            bgColor="transparent"
            fgColor="#1a1a1a"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Прямо в бинго"
            description="так же говорят?"
            imageSrc="/slides/bingo.png"
            objectFit="contain"
          />
        </SlideLogoBottom>
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
            description="Мы хотим чтобы все люди всегда знали время следующего доклада и где он будет идти"
            imageSrc="/slides/navigation.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Навигация и уведомления" blockHeight={200} blocks={[
            { imageSrc: "/slides/notification1.png", description: 'Уведомлении о начале доклада' },
            { imageSrc: "/slides/notification-2.png", description: 'Уведомлении о начале активности' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Как собрать обратную связь"
            description="Мы хотим чтобы все люди могли оставить свою обратную связь"
            imageSrc="/slides/form.png"
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Сбор связи после доклада"
            description="Уведомления в бот о том что прошел докалад и на него можно оставить обратную связь + у каждого доклада есть прямая ссылка на то чтобы человек зашел и оставил обратку"
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
        <SlideFrame><h2>Что не успели сделать</h2><p>Но очень хотелось бы</p></SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Мини игры" description="Играем и получаем награды" imageSrc="/slides/games.png" />
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
          <SlideImageText title="TMA-стартер" description="Сча разберемся как стартовать" imageSrc="/slides/starter.png" />
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
          <SlideImageText title="Локальная разработка" description="На этапе разработки мини-приложения Telegram требуют действительного URL-адреса для отображения и тестирования в клиенте Telegram." imageSrc="/slides/local.png" />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <SlideBlocks title="Как поднять локальный https" blockHeight={200} blocks={[
              { imageSrc: "/slides/ngrok.png", description: 'Самый популярный способ, но нужен vpn' },
              { imageSrc: "/slides/cloudflare.png", description: 'Второй по популярности способ, но нужен vpn' },
              { imageSrc: "/slides/nginx.png", description: 'поднимаем локальный proxy ' },
            ]} />
          </SlideLogoBottom>
        </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Как поднять локальный https" description="SlideImageText" imageSrc="/slides/ngrok.png" />
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

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 40</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Слайд 41" blockHeight={200} blocks={[
            { imageSrc: PLACEHOLDER_IMG, description: 'Блок 1' },
            { imageSrc: PLACEHOLDER_IMG, description: 'Блок 2' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 42</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 43" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Слайд 44" blockHeight={200} blocks={[
            { imageSrc: PLACEHOLDER_IMG, description: '1' },
            { imageSrc: PLACEHOLDER_IMG, description: '2' },
            { imageSrc: PLACEHOLDER_IMG, description: '3' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 45</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 46" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Слайд 47" blockHeight={200} blocks={[
            { imageSrc: PLACEHOLDER_IMG, description: 'Блок 1' },
            { imageSrc: PLACEHOLDER_IMG, description: 'Блок 2' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 48" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Слайд 49" blockHeight={200} blocks={[
            { imageSrc: PLACEHOLDER_IMG, description: '1' },
            { imageSrc: PLACEHOLDER_IMG, description: '2' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 50" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 51</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 52" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      {[53, 54].map((n) => (
        <Slide key={n} className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <SlideBlocks title={`Слайд ${n}`} blockHeight={200} blocks={[
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок 1' },
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок 2' },
            ]} />
          </SlideLogoBottom>
        </Slide>
      ))}

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 55</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      {Array.from({ length: 10 }, (_, i) => i + 56).map((n) => (
        <Slide key={n} className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <SlideImageText title={`Слайд ${n}`} description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
          </SlideLogoBottom>
        </Slide>
      ))}
      </Deck>
    </>
  )
}
