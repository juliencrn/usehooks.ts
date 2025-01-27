import Link from 'next/link'

import { DocSearch } from '@/components/doc-search'
import { LeftSidebar } from '@/components/docs/left-sidebar'
import { MainNav } from '@/components/main-nav'
import { GitHub } from '@/components/ui/icons'
import { docsConfig } from '@/config/docs'
import { siteConfig } from '@/config/site'
import { getHookList } from '@/lib/api'

type DocsLayoutProps = {
  children: React.ReactNode
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const hooks = await getHookList()

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav>
            <LeftSidebar items={docsConfig.sidebarNav} hooks={hooks} />
          </MainNav>
          <div className="flex flex-1 items-center space-x-4 sm:justify-end">
            <nav className="flex space-x-4">
              <DocSearch />
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex"
              >
                <GitHub className="h-6 w-6 my-auto" />
                <span className="sr-only">GitHub</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container flex-1">
        <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <LeftSidebar
            items={docsConfig.sidebarNav}
            hooks={hooks}
            className="hidden md:block"
          />
          {children}
        </div>
      </main>
    </>
  )
}
