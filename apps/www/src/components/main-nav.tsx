'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MobileNav } from '@/components/mobile-nav'
import { Close, Logo } from '@/components/ui/icons'
import { siteConfig } from '@/config/site'
import type { MainNavItem } from '@/types'

type MainNavProps = {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ children }: MainNavProps) {
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
