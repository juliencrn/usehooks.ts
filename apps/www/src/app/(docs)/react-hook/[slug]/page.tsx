import type { Metadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { PageHeader } from '@/components/docs/page-header'
import { Pager } from '@/components/docs/pager'
import { RightSidebar } from '@/components/docs/right-sidebar'
import { siteConfig } from '@/config/site'
import { getHook, getHookList } from '@/lib/api'

type Params = Promise<{ slug: string }>

export const generateStaticParams = async () => {
  const hooks = await getHookList()
  return hooks.map(hook => ({ slug: hook.slug }))
}

function stringifyDescription(description: string) {
  return description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '')
}

function getPostUrl(slug: string) {
  return `${siteConfig.url}/react-hook/${slug}`
}

function getImageUrl(name: string) {
  return `https://via.placeholder.com/1200x630.png/007ACC/fff/?text=${name}`
}

export const generateMetadata = async ({
  params,
}: {
  params: Params
}): Promise<Metadata> => {
  const { slug } = await params
  const hooks = await getHookList()
  const hook = hooks.find(hook => hook.slug === slug)
  if (!hook) {
    return {}
  }

  const title = hook.name
  const description = stringifyDescription(hook.summary)
  const url = getPostUrl(hook.slug)
  const imageUrl = getImageUrl(title)
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function HookPage({ params }: { params: Params }) {
  const { slug } = await params
  const [{ frontmatter, content }, hookList] = await Promise.all([
    getHook(slug),
    getHookList(),
  ])

  const ldJson: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.name,
    description: stringifyDescription(frontmatter.summary),
    url: getPostUrl(frontmatter.slug),
    image: [getImageUrl(frontmatter.name)],
    author: [
      {
        '@type': 'Organization',
        name: 'usehooks-ts',
        url: siteConfig.url,
      },
    ],
  }

  return (
    <>
      <script
        id="ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson),
        }}
      />

      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px] xl:grid-rows-[auto_1fr_auto]">
        <div className="mx-auto w-full min-w-0 grid">
          <PageHeader
            id="introduction"
            className="scroll-m-20"
            heading={frontmatter.name}
          />

          {content}

          <hr className="my-4 md:my-6" />
          <Pager slug={frontmatter.slug} hooks={hookList} />
        </div>

        <RightSidebar
          toc={{
            items: [
              { title: 'Usage', url: '#usage' },
              { title: 'API', url: '#api' },
              { title: 'Hook', url: '#hook' },
            ],
          }}
        />
      </main>
    </>
  )
}
