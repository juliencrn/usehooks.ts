'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn, mapHookToNavLink } from '@/lib/utils'
import type { BaseHook, SidebarNavItem } from '@/types'

type DocsSidebarNavProps = {
  items: SidebarNavItem[]
  hooks: BaseHook[]
  className?: string
}

export function LeftSidebar(props: DocsSidebarNavProps) {
  const pathname = usePathname()
  const items = [
    ...props.items,
    { title: 'Hooks', items: props.hooks.map(mapHookToNavLink) },
  ]

  if (!items.length) {
    return null
  }

  return (
    <aside
      className={cn(
        'top-16 z-30 h-[calc(100vh-4rem-1px)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky lg:py-10',
        props.className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className={'pb-8'}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            {item.title}
          </h4>
          {item.items ? (
            <NavItems items={item.items} pathname={pathname} />
          ) : null}
        </div>
      ))}
    </aside>
  )
}

type NavItemsProps = {
  items: SidebarNavItem[]
  pathname: string | null
}

function NavItems({ items, pathname }: NavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'flex w-full items-center rounded-md p-2 hover:underline',
              {
                'bg-muted': pathname === item.href,
              },
            )}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            {item.title}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60"
          >
            {item.title}
          </span>
        ),
      )}
    </div>
  ) : null
}
