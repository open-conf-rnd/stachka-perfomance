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
  SlideFrame,
  SlideLogoBottom,
  SlideImageText,
  SlideBlocks,
  SlideFullImage,
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
        <SlideLogoBottom>
          <SlideImageText title="Слайд 22" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
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

      {[26, 27, 28, 29, 30].map((n) => (
        <Slide key={n} className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <h2>Слайд {n}</h2>
            <p>SlideLogoBottom</p>
          </SlideLogoBottom>
        </Slide>
      ))}

      {[31, 32].map((n) => (
        <Slide key={n} className="slide-fullsize" data-align="topleft">
          <SlideLogoBottom>
            <SlideImageText title={`Слайд ${n}`} description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
          </SlideLogoBottom>
        </Slide>
      ))}

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 33</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Слайд 34" blockHeight={200} blocks={[
            { imageSrc: PLACEHOLDER_IMG, description: '1' },
            { imageSrc: PLACEHOLDER_IMG, description: '2' },
            { imageSrc: PLACEHOLDER_IMG, description: '3' },
          ]} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 35" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      {[36, 37].map((n) => (
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
          <h2>Слайд 38</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks title="Слайд 39" blockHeight={200} blocks={[
            { imageSrc: PLACEHOLDER_IMG, description: 'A' },
            { imageSrc: PLACEHOLDER_IMG, description: 'B' },
          ]} />
        </SlideLogoBottom>
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
