import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyableOrderIdProps {
  orderId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CopyableOrderId({
  orderId,
  className = '',
  size = 'md',
}: CopyableOrderIdProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(orderId)
    } catch {
      const input = document.createElement('textarea')
      input.value = orderId
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      className={`copyable-id copyable-id--${size} ${copied ? 'copyable-id--copied' : ''} ${className}`.trim()}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : `Copy order ID ${orderId}`}
      title="Tap to copy order ID"
    >
      <span className="copyable-id__text">{orderId}</span>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied && <span className="copyable-id__toast">Copied!</span>}
    </button>
  )
}
