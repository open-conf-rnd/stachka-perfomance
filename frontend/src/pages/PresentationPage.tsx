import { Deck, Slide } from '@revealjs/react'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/white.css'
import './presentation/fonts.css'
import './PresentationPage.css'
import {
  TitleSlide,
  WhoAmISlide,
  RegistrationSlide,
  SlideFrame,
  SlideFrameBottom,
  SlideLogoBottom,
  SlideImageText,
  SlideBlocks,
} from './presentation'

const PLACEHOLDER_IMG = '/slides/rectangle-3.png'

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
        <RegistrationSlide />
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks
            title="Слайд 4"
            blockHeight={220}
            blocks={[
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок 1' },
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок 2' },
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок 3' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 5"
            description="Заголовок слева, описание и картинка справа"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks
            title="Слайд 6"
            blockHeight={220}
            blocks={[
              { imageSrc: PLACEHOLDER_IMG, description: 'Описание 1' },
              { imageSrc: PLACEHOLDER_IMG, description: 'Описание 2' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 7"
            description="Текст и картинка"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrameBottom>
          <h2>Слайд 8</h2>
          <p>SlideFrameBottom — лого внизу</p>
        </SlideFrameBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrameBottom>
          <h2>Слайд 9</h2>
          <p>SlideFrameBottom</p>
        </SlideFrameBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 10"
            description="SlideImageText"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideBlocks
            title="Слайд 11"
            blockHeight={200}
            blocks={[
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок A' },
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок B' },
              { imageSrc: PLACEHOLDER_IMG, description: 'Блок C' },
            ]}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 12"
            description="SlideImageText"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 13</h2>
          <p>SlideLogoBottom — лого слева внизу</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 14</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 15"
            description="SlideImageText"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 16"
            description="SlideImageText"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 17"
            description="SlideImageText"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 18</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText
            title="Слайд 19"
            description="SlideImageText"
            imageSrc={PLACEHOLDER_IMG}
          />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <h2>Слайд 20</h2>
          <p>SlideLogoBottom</p>
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 21" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 22" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
        </SlideLogoBottom>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame><h2>Слайд 23</h2><p>SlideFrame</p></SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideFrame><h2>Слайд 24</h2><p>SlideFrame</p></SlideFrame>
      </Slide>

      <Slide className="slide-fullsize" data-align="topleft">
        <SlideLogoBottom>
          <SlideImageText title="Слайд 25" description="SlideImageText" imageSrc={PLACEHOLDER_IMG} />
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
  )
}
