<template>
  <div>
    <div class="bg-#f3f3f3">
      <section class="main-box-responsive flex items-center h-400px px-24px ">
        <div class="w-55% pb-20px">
          <h3 class="text-24px lh-32px mb-32px">个人数据分析工具 · 组织数据科学协同平台</h3>
          <t-button
            content="申请使用"
            size="large"
            theme="primary"
            shape="round"
            :href="LAB_ORIGIN"
            target="_blank"
          />
        </div>
        <div class="text-center w-45%" />
      </section>
    </div>

    <div class="bg-#f8faff">
      <section class="common-section">
        <h2 class="common-section-title">欢迎来到AI科研平台</h2>
        <p class="text-(18px #000/60 center) mt-12px mb-24px">为机器学习、深度学习和AI模型研究提供强大支持</p>
        <div class="grid cols-2 gap-24px">
          <div
            v-for="item, i in l1"
            :key="i"
            class="flex items-center bg-#fff rd-16px base-shadow py-16px px-12px"
          >
            <Icon
              :name="item.icon"
              class="w-100px h-100px p-8px"
              :style="{ color: item.iconColor }"
            />
            <div class="w-0 flex-1 pl-12px">
              <p class="mb-12px text-24px lh-34px">{{ item.title }}</p>
              <p class="text-#000/60 text-16px lh-22px">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section class="common-section">
      <h2 class="common-section-title mb-32px">多场景应用</h2>
      <div class="grid cols-3 gap-24px">
        <div
          v-for="item, i in l2"
          :key="i"
          class="bg-#fff rd-16px base-shadow py-16px px-24px b"
        >
          <p class="mb-12px text-24px lh-34px">{{ item.title }}</p>
          <p>{{ item.desc }}</p>
          <div class="text-#000/60 [&>div]:(flex items-center my-16px) [&>div>span]:(h-7px w-7px mr-12px rd-50% bg-#0052d9 shrink-0)">
            <div
              v-for="li, d in item.ul"
              :key="d"
            >
              <span /><p>{{ li }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="common-section">
      <h2 class="common-section-title mb-32px">个人研究</h2>
      <div class="grid grid-cols-2 gap-col-48px [&_.\_hul]:(text-#00000099) [&_.\_hul>div]:(flex items-center my-16px) [&_.\_hul>div>span]:(h-7px w-7px mr-12px rd-50% bg-#0052d9 shrink-0)">
        <div>
          <h4 class="text-24px lh-32px">降低工程复杂度<br />低门槛上手数据分析工作</h4>
          <div class="_hul">
            <div><span /><p>即开即用的Jupyterlab Python环境</p></div>
            <div><span /><p>不断更新的算法代码片段库涵盖数据处理、可视化与常用模型，调用复用都方便</p></div>
            <div><span /><p>支持 Notebook 交互式编程、Pipeline 拖拽式编程开发模式，契合不同工程能力研究者的分析工作需求</p></div>
          </div>
          <p>相关功能：Notebook 交互式分析建模、Pipeline 低代码拖拽式分析建模、IDE 编程、代码片段收藏与复用</p>
        </div>

        <div>
          <h4 class="text-24px lh-32px">拓展数据研究边界<br />为创造力的实现提供坚实基础</h4>
          <div class="_hul">
            <div><span /><p>文件系统式管理工作内容、数据集，一键下载至本地或分享</p></div>
            <div><span /><p>训练记录为自主建模流程提供从过程跟踪到成果发布的模型管理工具</p></div>
            <div><span /><p>训练记录为自主建模流程提供从过程跟踪到成果发布的模型管理工具</p></div>
          </div>
          <p>相关功能：数据集管理、训练记录</p>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script lang="ts" setup>
// __disable-nuxt-auto-route__
// import Banner from './Banner/index.vue'
// onMounted(sal)

const l1 = [
  { icon: 'vscode-icons:file-type-jupyter', title: '基于JupyterLab的增强IDE环境', iconColor: '', desc: '我们的平台以JupyterLab为基础，提供了更多强大的功能，帮助您更高效地进行科研工作。无论是编写代码、数据分析还是模型训练，都能得心应手。' },
  { icon: 'hugeicons:workflow-square-03', title: 'Pipeline拖拽式编辑', iconColor: '#f37726', desc: '通过我们独特的CPW模式，您可以轻松创建和运行复杂的研究流水线。系统持续更新常用算法代码片段，同时支持自定义代码组件，灵活配置运行参数、输入和输出。' },
  { icon: 'material-symbols:data-table-rounded', iconColor: '#00bcd4', title: '数据集管理', desc: '轻松上传、下载和管理您的数据集，包括CPW模式文件。所有数据都无缝集成到JupyterLab的文件系统中，让您的研究工作更加流畅。' },
  { icon: 'solar:users-group-rounded-bold', iconColor: '#ff7262', title: '协作与共享', desc: '我们的平台支持团队协作，让您可以轻松与同事分享代码、数据和结果。无论是个人研究还是团队项目，都能得到完美支持。' },
]

const l2 = [
  {
    title: '个人研究',
    desc: '降低工程复杂度，低门槛上手数据分析工作',
    ul: ['即开即用的Jupyterlab Python环境', '不断更新的算法代码片段库涵盖数据处理、可视化与常用模型，调用复用都方便', '支持 Notebook 交互式编程、Pipeline 拖拽式编程开发模式，契合不同工程能力研究者的分析工作需求'],
  },
  {
    title: '研究团队',
    desc: '多人、多角色、随时随地进行数据驱动的研究与分享',
    ul: ['云端容器确保协作者分析环境的统一', '多类型数据源的灵活接入', '科研成果数据集、成果模型和分析过程可在知识库中安全便捷地托管, 轻松同步团队进展'],
  },
  {
    title: '教学场景',
    desc: '多人、多角色、随时随地进行数据驱动的研究与分享',
    ul: ['多项目独立的工作环境与数据', '低代码拖拽搭建分析思路，降低零基础学生上手门槛', '数据、环境、代码以项目式集成，教学过程中案例材料、导师研究成果皆可轻松复现'],
  },
]
</script>
