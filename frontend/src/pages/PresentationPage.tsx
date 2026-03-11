import { Deck, Slide } from '@revealjs/react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import './PresentationPage.css'
import {
  TitleSlide,
  WhoAmISlide,
  ConferencesSlide,
  WhatToExpectSlide,
  RegistrationSlide,
  ParticipantsSlide,
  ThanksSlide,
} from './presentation'

export function PresentationPage() {
  const displayToken =
    typeof location !== 'undefined'
      ? new URLSearchParams(location.search).get('token')
      : undefined

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
        <Slide>
          <TitleSlide />
        </Slide>

        <Slide>
          <WhoAmISlide />
        </Slide>

        <Slide>
          <ConferencesSlide />
        </Slide>

        <Slide>
          <WhatToExpectSlide />
        </Slide>

        <Slide className="slide-fullsize" data-align="topleft">
          <RegistrationSlide displayToken={displayToken ?? undefined} />
        </Slide>

        <Slide>
          <h2>Участники</h2>
          <p style={{ fontSize: '0.8em', opacity: 0.8 }}>Зарегистрированные участники</p>
          <ParticipantsSlide displayToken={displayToken ?? undefined} />
        </Slide>

        <Slide>
          <ThanksSlide />
        </Slide>
      </Deck>
  )
}
