import { useIntersectionObserver } from './useIntersectionObserver'

const Section = (props: { title: string }) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  })

  console.log(`Render Section ${props.title}`, {
    isIntersecting,
  })

  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        border: '1px dashed #000',
        fontSize: '2rem',
      }}
    >
      <div style={{ margin: 'auto' }}>{props.title}</div>
    </div>
  )
}

export default function Component() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Section key={index + 1} title={(index + 1).toFixed()} />
      ))}
    </>
  )
}
