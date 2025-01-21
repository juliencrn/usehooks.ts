import * as React from 'react'

import Link from 'next/link'
import { useScrollLock } from 'usehooks-ts'

import { Logo } from '@/components/ui/icons'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

type MobileNavProps = {
  children?: React.ReactNode
}

export function MobileNav({ children }: MobileNavProps) {
  useScrollLock()

  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max px-6 pt-0 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        {children}
      </div>
    </div>
  )
}
