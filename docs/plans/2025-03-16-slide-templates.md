# Slide Templates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Создать две заготовки слайдов SlideImageText и SlideBlocks с примерами в PresentationPage.

**Architecture:** Два отдельных компонента в `frontend/src/pages/presentation/`, каждый со своим CSS. Оба рендерятся внутри SlideLogoBottom. Типография по образцу WhoAmISlide.

**Tech Stack:** React, Reveal.js, CSS

---

### Task 1: SlideImageText component

**Files:**
- Create: `frontend/src/pages/presentation/SlideImageText/SlideImageText.tsx`
- Create: `frontend/src/pages/presentation/SlideImageText/SlideImageText.css`
- Create: `frontend/src/pages/presentation/SlideImageText/index.ts`

**Step 1: Create component structure**

Create `SlideImageText.tsx`:

```tsx
import './SlideImageText.css'

interface SlideImageTextProps {
  title: string
  description: string
  imageSrc: string
  objectFit?: 'contain' | 'cover'
}

export function SlideImageText({
  title,
  description,
  imageSrc,
  objectFit = 'contain',
}: SlideImageTextProps) {
  return (
    <div className="slide-image-text">
      <div className="slide-image-text__left">
        <h2 className="slide-image-text__title">{title}</h2>
        <p className="slide-image-text__description">{description}</p>
      </div>
      <div className="slide-image-text__right">
        <img
          src={imageSrc}
          alt=""
          className="slide-image-text__image"
          style={{ objectFit }}
        />
      </div>
    </div>
  )
}
```

**Step 2: Create CSS**

Create `SlideImageText.css` (layout 50/50, typography from WhoAmISlide):

```css
.slide-image-text {
  display: flex;
  gap: 48px;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.slide-image-text__left {
  flex: 0 1 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.slide-image-text__title {
  margin: 0;
  font-size: clamp(4rem, 7vmin, 110px);
  font-weight: 700;
  color: #1a1a1a;
}

.slide-image-text__description {
  margin: 0;
  font-size: clamp(2.5rem, 4vmin, 60px);
  font-weight: 400;
  color: #333;
}

.slide-image-text__right {
  flex: 0 1 50%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image-text__image {
  width: 100%;
  height: 100%;
  object-position: center;
}
```

**Step 3: Create index.ts**

```ts
export { SlideImageText } from './SlideImageText'
```

**Step 4: Verify build**

Run: `npm run build:frontend`
Expected: Success

**Step 5: Commit**

```bash
git add frontend/src/pages/presentation/SlideImageText/
git commit -m "feat: add SlideImageText slide template"
```

---

### Task 2: SlideBlocks component

**Files:**
- Create: `frontend/src/pages/presentation/SlideBlocks/SlideBlocks.tsx`
- Create: `frontend/src/pages/presentation/SlideBlocks/SlideBlocks.css`
- Create: `frontend/src/pages/presentation/SlideBlocks/index.ts`

**Step 1: Create component structure**

```tsx
import './SlideBlocks.css'

interface SlideBlock {
  imageSrc: string
  description: string
}

interface SlideBlocksProps {
  title: string
  blocks: SlideBlock[]
  blockHeight?: string | number
}

export function SlideBlocks({
  title,
  blocks,
  blockHeight = 'auto',
}: SlideBlocksProps) {
  const heightStyle =
    typeof blockHeight === 'number' ? `${blockHeight}px` : blockHeight

  return (
    <div className="slide-blocks">
      <h2 className="slide-blocks__title">{title}</h2>
      <div className="slide-blocks__row">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="slide-blocks__block"
            style={{ minHeight: heightStyle }}
          >
            <img
              src={block.imageSrc}
              alt=""
              className="slide-blocks__block-image"
            />
            <p className="slide-blocks__block-description">{block.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Create CSS**

```css
.slide-blocks {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.slide-blocks__title {
  margin: 0;
  font-size: clamp(4rem, 7vmin, 110px);
  font-weight: 700;
  color: #1a1a1a;
  flex-shrink: 0;
}

.slide-blocks__row {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.slide-blocks__block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slide-blocks__block-image {
  width: 100%;
  flex: 1;
  min-height: 0;
  object-fit: contain;
  object-position: center;
}

.slide-blocks__block-description {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vmin, 36px);
  font-weight: 400;
  color: #333;
  flex-shrink: 0;
}
```

**Step 3: Create index.ts**

```ts
export { SlideBlocks } from './SlideBlocks'
```

**Step 4: Verify build**

Run: `npm run build:frontend`
Expected: Success

**Step 5: Commit**

```bash
git add frontend/src/pages/presentation/SlideBlocks/
git commit -m "feat: add SlideBlocks slide template"
```

---

### Task 3: Export and add examples to PresentationPage

**Files:**
- Modify: `frontend/src/pages/presentation/index.ts`
- Modify: `frontend/src/pages/PresentationPage.tsx`

**Step 1: Add exports to index.ts**

Add after SlideLogoBottom export:
```ts
export { SlideImageText } from './SlideImageText'
export { SlideBlocks } from './SlideBlocks'
```

**Step 2: Add example slides to PresentationPage**

Import SlideImageText and SlideBlocks. Add two new Slide elements after ConferencesSlide (before WhatToExpectSlide):

```tsx
<Slide className="slide-fullsize" data-align="topleft">
  <SlideLogoBottom>
    <SlideImageText
      title="Пример: текст и картинка"
      description="Левая половина — заголовок и описание, правая — картинка с object-fit"
      imageSrc="/slides/rectangle-3.png"
      objectFit="contain"
    />
  </SlideLogoBottom>
</Slide>

<Slide className="slide-fullsize" data-align="topleft">
  <SlideLogoBottom>
    <SlideBlocks
      title="Пример: блоки"
      blockHeight={240}
      blocks={[
        { imageSrc: "/slides/rectangle-3.png", description: "Блок 1" },
        { imageSrc: "/slides/image-4.png", description: "Блок 2" },
        { imageSrc: "/slides/rectangle-3.png", description: "Блок 3" },
      ]}
    />
  </SlideLogoBottom>
</Slide>
```

**Step 3: Verify build and dev**

Run: `npm run build:frontend`
Expected: Success

Run: `npm run dev:frontend` (optional, visual check)
Expected: App runs, new slides visible in presentation

**Step 4: Commit**

```bash
git add frontend/src/pages/presentation/index.ts frontend/src/pages/PresentationPage.tsx
git commit -m "feat: add SlideImageText and SlideBlocks examples to PresentationPage"
```

---

### Task 4: Commit design docs

```bash
git add docs/plans/
git commit -m "docs: add slide templates design and implementation plan"
```
