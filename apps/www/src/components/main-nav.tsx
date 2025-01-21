'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'

import { MobileNav } from '@/components/mobile-nav'
import { Close, Logo } from '@/components/ui/icons'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import type { MainNavItem } from '@/types'

type MainNavProps = {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = React.useState<string>(pathname)
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  if (pathname !== prevPathname) {
    setShowMobileMenu(false)
    setPrevPathname(pathname)
  }

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Logo />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => {
          setShowMobileMenu(!showMobileMenu)
        }}
      >
        {showMobileMenu ? <Close /> : <Logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && <MobileNav>{children}</MobileNav>}
    </div>
  )
}
