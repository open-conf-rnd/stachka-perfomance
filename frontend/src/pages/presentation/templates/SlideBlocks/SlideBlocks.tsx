import './SlideBlocks.css'

interface SlideBlocksProps {
  title: string
  blocks: Array<{ imageSrc: string; description: string }>
  blockHeight?: string | number
  revealByClick?: boolean
}

function toBlockHeightStyle(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`
  }
  return value
}

export function SlideBlocks({
  title,
  blocks,
  blockHeight = 'auto',
  revealByClick = false,
}: SlideBlocksProps) {
  const blockHeightStyle = toBlockHeightStyle(blockHeight)

  return (
    <div className="slide-blocks">
      <h2 className="slide-blocks__title">{title}</h2>
      <div className="slide-blocks__row">
        {blocks.map((block, index) => (
          <div
            key={index}
            className={`slide-blocks__block ${revealByClick ? 'fragment' : ''}`}
            data-fragment-index={revealByClick ? index : undefined}
            style={{ minHeight: blockHeightStyle }}
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
