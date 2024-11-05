import { useNetworkStatus } from './useNetworkStatus'

export default function Component() {
  const { isOnline } = useNetworkStatus()

  return (
    <div>
      The current user network status is: {isOnline ? 'Online' : 'Offline'}
    </div>
  )
}
