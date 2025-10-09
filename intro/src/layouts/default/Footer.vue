<template>
  <footer class="--layout-footer h-[--layout-footer-height] text-(#fff 14px) font-500 bg-#2c2c2c lg:py-32px at-sm:py-16px">
    <div class="px-4 mx-auto max-w-1080px">
      <!-- <div class="flex justify-between gap-x-32px at-sm:hidden">
        <div
          v-for="item in list"
          :key="item.name"
        >
          <p class="text-16px text-gray-400">{{ item.name }}</p>

          <ul class="mt-16px space-y-4">
            <li
              v-for="link in item.links"
              :key="link.name"
            >
              <a
                :href="link.href"
                target="_blank"
                class="transition-color duration-300 hover:text-[--td-brand-color-5] focus:text-[--td-brand-color-6]"
              >{{ link.name }}</a>
            </li>
          </ul>
        </div>
      </div>

      <hr class="my-32px border-gray-600 at-sm:hidden" /> -->

      <div class="flex flex-wrap items-center justify-center at-sm:text-12px">
        <p class="text-center">© Copyright 2019-2025 SZU. <br class="lg:hidden" />All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// const list = [
// {
//   name: 'CEP',
//   links: [{ name: '产品文档', href: p('/document') }],
// },
// {
//   name: 'Service and Support',
//   links: [
//     { name: '客户案例', href: p('/custom-story') }, { name: '解决方案', href: p('/solution') },
//   ],
// },
//   {
//     name: 'Extra links',
//     links: [
//       { name: 'Security & Compliance Services', href: 'https://tencent.service-now.com/stc?id=stc_cat_home&catalog_id=e661a3001b28ad10f787c840604bcb72' },
//       { name: 'CES', href: 'https://tencent.service-now.com/stc?id=stc_cat_home&catalog_id=9681af401b28ad10f787c840604bcb95' },
//       { name: 'OIT', href: 'https://tencent.service-now.com/stc?id=stc_cat_op&catalog_id=d05beb3f1bb43d506f420e10604bcb97' },
//     ],
//   },
// ]
</script>
