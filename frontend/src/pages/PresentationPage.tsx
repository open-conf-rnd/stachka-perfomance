import { Deck, Slide } from '@revealjs/react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import './presentation/fonts.css'
import './PresentationPage.css'
import {
  TitleSlide,
  WhoAmISlide,
  ConferencesSlide,
  WhatToExpectSlide,
  RegistrationSlide,
  ParticipantsSlide,
  ThanksSlide,
  SlideFrameBottom,
  SlideLogoBottom,
} from './presentation'

export function PresentationPage() {
  return (
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
            <ConferencesSlide />
          </SlideLogoBottom>
        </Slide>

        <Slide>
          <WhatToExpectSlide />
        </Slide>

        <Slide className="slide-fullsize" data-align="topleft">
          <RegistrationSlide />
        </Slide>

        <Slide>
          <h2>Участники</h2>
          <p style={{ fontSize: '0.8em', opacity: 0.8 }}>Зарегистрированные участники</p>
          <ParticipantsSlide />
        </Slide>

        <Slide>
          <ThanksSlide />
        </Slide>
      </Deck>
  )
}
