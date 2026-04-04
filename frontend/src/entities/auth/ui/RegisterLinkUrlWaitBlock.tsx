import { copyToClipboard } from '@/lib/copyToClipboard'

type Props = {
  url: string
  linkWaitExpired: boolean
  onCopyFailed: () => void
  waitingMessage: string
  expiredMessage: string
}

export function RegisterLinkUrlWaitBlock({
  url,
  linkWaitExpired,
  onCopyFailed,
  waitingMessage,
  expiredMessage,
}: Props) {
  const onCopy = async () => {
    const ok = await copyToClipboard(url)
    if (!ok) onCopyFailed()
  }

  return (
    <div className="register__link-result">
      <div className="register__link-url-wrap">
        <span className="register__link-url">{url}</span>
      </div>
      <div className="register__link-actions">
        <button type="button" className="btn register__btn-secondary" onClick={() => void onCopy()}>
          Скопировать ссылку
        </button>
      </div>
      {!linkWaitExpired ? (
        <p className="page__loading" style={{ marginTop: '0.75rem' }}>
          {waitingMessage}
        </p>
      ) : (
        <p className="page__error" style={{ marginTop: '0.75rem' }}>
          {expiredMessage}
        </p>
      )}
    </div>
  )
}
