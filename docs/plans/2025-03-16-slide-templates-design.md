# Slide Templates Design

**Date:** 2025-03-16

## Goal

Создать две заготовки слайдов для презентации: SlideImageText (текст слева, картинка справа) и SlideBlocks (заголовок + до 4 блоков в ряд). Оба используют SlideLogoBottom как базовый слой с логотипом в левом нижнем углу.

## Architecture

Два отдельных компонента (`SlideImageText` и `SlideBlocks`), каждый рендерится внутри `SlideLogoBottom`. Типография и отступы наследуют паттерны из WhoAmISlide и SlideLogoBottom.

## Components

### SlideImageText

Слайд: левая половина — заголовок сверху, описание снизу; правая половина — картинка на весь блок.

**Props:**
- `title: string`
- `description: string`
- `imageSrc: string`
- `objectFit?: 'contain' | 'cover'` (default: `'contain'`)

**Layout:** 50/50 split, flex. Картинка занимает всю правую половину, object-fit задаётся пропом.

### SlideBlocks

Слайд: заголовок в левом верхнем углу; по центру до 4 блоков в одну строку. Каждый блок: картинка + описание. Gap 16px, блоки flex: 1.

**Props:**
- `title: string`
- `blocks: Array<{ imageSrc: string; description: string }>`
- `blockHeight?: string | number` (default: `'auto'`)

**Layout:** Заголовок сверху. Flex row для блоков, gap: 16px, flex: 1 на каждый блок.

## Integration

Оба компонента оборачиваются в `SlideLogoBottom` при использовании. Примеры отображения добавляются в PresentationPage.tsx.
