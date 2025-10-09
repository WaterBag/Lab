<template>
  <div class="content-page">
    <div class="doc-tree --small-scroll">
      <ContentNavigationTree :navigation="tree!" />
    </div>

    <div class="flex-1 px-16px py-32px">
      <template v-if="doc">
        <h1 class="text-36px pb-16px lh-40px">{{ doc.title }}</h1>
        <p class="text-#000/60">{{ doc.description }}</p>

        <t-divider />

        <article class="markdown-body">
          <ContentRenderer :value="doc" />
        </article>

        <template v-if="surrounds?.filter(Boolean).length">
          <t-divider class="mt-1rem! mb-32px!" />
          <div class="grid grid-cols-2 gap-x-32px">
            <template
              v-for="surround, idx in surrounds"
              :key="idx"
            >
              <NuxtLink
                v-if="surround"
                :to="surround.path"
                class="b b-[--td-border-level-1-color] rd-8px group transition-colors hover:bg-#f7f9fc p-24px"
                :class="idx === 1 && 'text-right'"
              >
                <div class="b b-[--td-border-level-1-color] rd-50% inline-flex items-center justify-center p-6px">
                  <Icon
                    v-if="idx === 0"
                    name="material-symbols:arrow-back-rounded"
                    size="20px"
                  />
                  <Icon
                    v-else-if="idx === 1"
                    name="material-symbols:arrow-forward-rounded"
                    size="20px"
                  />
                </div>
                <p class="font-600 text-15px mb-4px mt-16px ellipsis-1">{{ surround.title }}</p>
                <p class="text-(#000/60 14px) ellipsis-1">{{ surround.description }}</p>
              </NuxtLink>
              <div v-else />
            </template>
          </div>
        </template>
      </template>
    </div>

    <aside class="doc-toc">
      <template v-if="doc?.body.toc?.links.length">
        <div class="text-#000/60 shrink-0 pb-16px">本页内容</div>
        <div class="overflow-y-auto flex-1 --small-scroll">
          <t-anchor
            :bounds="120"
            style="width: 100%"
          >
            <TocList :links="doc.body.toc.links" />
          </t-anchor>
        </div>
      </template>
    </aside>
  </div>
</template>

<script lang="tsx" setup>
import type { TocLink } from '@nuxt/content'
import { TAnchorItem } from '#components'

definePageMeta({
  scrollToTop: true,
})

const route = useRoute()

const { data: doc } = await useAsyncData(route.path, () => queryCollection('tutorial').where('extension', '=', 'md').path(route.path).first())

if (!doc.value) throw createError({ statusCode: 404, statusMessage: '文档不存在' })

const { data: tree } = await useAsyncData('tutorial-navigation', () => queryCollectionNavigation('tutorial').then(tree => tree.find(o => o.path === '/tutorial')?.children || []))

const { data: surrounds } = await useAsyncData(
  'tutorial-surround',
  () => queryCollectionItemSurroundings('tutorial', route.path, { fields: ['description'] })
    .where('extension', '=', 'md'),
)

// onMounted(() => {
// console.log(doc.value)
// console.log(queryCollection('tutorial').where('extension', '=', 'md').all())
// console.log(surrounds.value)
// })

if (doc.value) useSeoMeta(doc.value.seo)

const TocList = ({ links }: {links: TocLink[]}) => {
  return <>{
    links.map(link => (
      <TAnchorItem key={link.id} href={'#' + link.id} title={link.text} customScroll>
        { link.children?.length && <TocList links={link.children} /> }
      </TAnchorItem>
    ))
  }</>
}
</script>

<style lang="scss">
$minHeight: var(--layout-no-footer-content-height);

.content-page {
  min-height: $minHeight;
  display: flex;
  flex-wrap: nowrap;
  max-width: 1400px;
  padding: 0 32px;
  margin: 0 auto;

  .doc-tree,
  .doc-toc {
    height: $minHeight;
    width: 220px;
    flex-shrink: 0;
    padding-top: 32px;
    position: sticky;
    top: var(--layout-header-height);
    overflow-y: auto;
    font-size: 14px;
  }

  .doc-tree {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    padding-right: 24px;
  }

  .doc-toc {
    padding-left: 24px;
    display: flex;
    flex-direction: column;
  }

  .markdown-body {
    h1, h2, h3, h4, h5, h6 {
      border-bottom: none !important;

      a {
        color: inherit;
        text-decoration: none;
      }
    }

    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal;
    }

    img {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(145, 145, 145, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
