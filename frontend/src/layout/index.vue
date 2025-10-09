<template>
  <div class="--jp-layout-container">
    <Nav />

    <div class="--jp-layout-main-warpper">
      <Aside />

      <div class="--jp-layout-main">
        <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            enter-active-class="--jp-layout-animate --jp-layout-animate-in"
            leave-active-class="--jp-layout-animate --jp-layout-animate-out"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <t-back-top
      container=".--jp-layout-main"
      :visible-height="150"
      :offset="['20px', '20px']"
      shape="circle"
      size="small"
    />
  </div>
</template>

<script lang="ts" setup>
import Nav from './Nav/index.vue'
import Aside from './Aside/index.vue'
</script>

<style lang="scss">
.--jp-layout-container {
  // width: var(--jp-app-width);
  // height: var(--jp-app-height);
  height: 100%;
  // min-width: 1080px;

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
}

.--jp-layout-main-warpper {
  display: flex;
  height: calc(100% - var(--jp-nav-bar-height));
  width: 100%;

  .--jp-layout-main {
    flex: 1;
    height: 100%;
    background-color: #f3f3f3;
    overflow-y: auto; // 固定scroll，避免动画过程中宽度突然改变
  }
}

.--jp-layout-animate {
  animation-fill-mode: forwards;
  animation-iteration-count: 1;

  @keyframes fade-x-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fade-x-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  &.--jp-layout-animate-in {
    animation-name: fade-x-in;
    animation-duration: 200ms;

  }

  &.--jp-layout-animate-out {
    animation-name: fade-x-out;
    animation-duration: 100ms;
  }
}

</style>
