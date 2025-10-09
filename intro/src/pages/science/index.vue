<template>
  <div>
    <div class="bg-#f3f3f3">
      <section class="main-box-responsive flex items-center h-300px px-24px">
        <div class="w-55% pb-20px">
          <h3 class="text-(24px #0052d9) lh-32px mb-24px">AI科研平台，助力数据驱动研究协同创新</h3>
          <p>降低人工智能驱动的科学研究门槛，为每位从事数据创新研究的开拓者及其团队提供支持、优化体验</p>
        </div>
        <div class="text-center w-45%" />
      </section>
    </div>

    <section class="common-section grid cols-1 gap-row-32px">
      <h2 class="common-section-title">探索AI科研平台的强大功能</h2>
      <div
        v-for="item, i in l1"
        :key="i"
        class="py-24px px-32px b rd-16px base-shadow"
      >
        <h3 class="text-24px font-600">{{ item.title }}</h3>
        <p class="my-16px">{{ item.desc }}</p>
        <ul
          v-for="li, d in item.ul"
          :key="d"
          class="list-disc-inside text-#000/60"
        >
          <li class="marker:color-#0052d9 my-8px">{{ li }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const l1 = [
  {
    title: 'JupyterLab增强环境',
    desc: '我们的平台以JupyterLab为基础，为您提供了一个熟悉而强大的研究环境。除了JupyterLab原有的功能外，我们还增加了许多创新特性：',
    ul: [
      '实时代码协作，让团队成员可以同时编辑同一个notebook、同一个Pipeline工作流',
      'IDE环境的文件系统，轻松管理各类资源',
      '丰富的可视化工具，帮助您更好地理解和展示数据',
      '云端存储，随时随地访问您的研究成果',
      '支持Git集成，可与GitHub等平台无缝连接',
    ],
  },
  {
    title: 'Pipeline拖拽式编辑（CPW模式）',
    desc: '我们独特的CPW（Computational Pipeline Workflow）模式优化了科研工作流程：',
    ul: [
      '直观的拖拽界面，让复杂的研究流程变得简单',
      '丰富的预设算法组件库，持续更新最新的AI算法',
      '支持自定义代码组件，满足个性化研究需求',
      '灵活的参数配置，轻松调整和优化您的实验',
    ],
  },
  {
    title: '内置算法代码组件',
    desc: '我们的平台提供了大量预设的算法代码组件，涵盖了机器学习、深度学习和AI模型研究的各个方面：',
    ul: [
      '经典机器学习算法：线性回归、决策树、随机森林等',
      '深度学习模型：CNN、RNN、Transformer等',
      '自然语言处理工具：分词、命名实体识别、情感分析等',
      '计算机视觉算法：目标检测、图像分割、人脸识别等',
      '强化学习框架：Q-learning、Policy Gradient等',
    ],
  },
]
</script>

<style lang="scss" scoped>

</style>
