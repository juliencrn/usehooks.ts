import Link from 'next/link'

import { DocSearch } from '@/components/doc-search'
import { LeftSidebar } from '@/components/docs/left-sidebar'
import { MainNav } from '@/components/main-nav'
import { GitHub } from '@/components/ui/icons'
import { docsConfig } from '@/config/docs'
import { siteConfig } from '@/config/site'
import { getHookList } from '@/lib/api'

type MarketingLayoutProps = {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const hooks = await getHookList()

  return (
    <>
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav>
            <LeftSidebar items={docsConfig.sidebarNav} hooks={hooks} />
          </MainNav>
          <nav className="flex space-x-4 justify-center align-middle">
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
      </header>

      <main className="flex-1">{children}</main>
    </>
  )
}
