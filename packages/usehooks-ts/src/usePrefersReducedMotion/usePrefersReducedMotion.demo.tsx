import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <button
      style={{
        animation: prefersReducedMotion ? 'none' : 'spin 2s linear infinite',
      }}
    >
      {prefersReducedMotion ? 'Not spinning' : 'Spinning'}
    </button>
  )
}
