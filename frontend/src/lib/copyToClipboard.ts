/**
 * Копирование в буфер. Во iframe (VK / Telegram Mini App) Async Clipboard API
 * часто заблокирован Permissions-Policy — используем execCommand.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  const tryExecCommand = (): boolean => {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.setAttribute('aria-hidden', 'true')
      Object.assign(ta.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '1px',
        height: '1px',
        opacity: '0',
        padding: '0',
        border: 'none',
      })
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      ta.setSelectionRange(0, text.length)
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }

  let inIframe = true
  try {
    inIframe = window.self !== window.top
  } catch {
    inIframe = true
  }

  if (!inIframe && navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      /* fall through */
    }
  }

  return tryExecCommand()
}
