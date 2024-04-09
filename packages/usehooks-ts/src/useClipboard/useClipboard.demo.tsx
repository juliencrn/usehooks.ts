import { useClipboard } from './useClipboard'

// mock message
const message = {
  content: 'I am comming from openAi response',
}

export default function CopyToClipboard({ ...props }) {
  const { isCopied, copyToClipboard } = useClipboard({ timeout: 1000 })

  return (
    <div {...props}>
      <button
        className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
        onClick={() => copyToClipboard(message.content)}
      >
        {isCopied ? (
          <span className="text-green-500">Copied</span>
        ) : (
          <span className="text-gray-600">Copy</span>
        )}
      </button>
    </div>
  )
}
