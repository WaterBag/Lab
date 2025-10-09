import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    tutorial: defineCollection({
      type: 'page',
      source: 'tutorial/**',
    }),
  },
})

