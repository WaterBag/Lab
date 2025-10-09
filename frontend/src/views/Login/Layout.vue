<template>
  <div
    class="login-layout-container"
    :style="`background-image: url(${isSignUpAll ? 'none' : bg})`"
  >
    <template v-if="isSignUpAll">
      <div class="header-nav">
        <!-- <div
          :style="`background-image: url(${logo})`"
          class="nav-log"
        /> -->
      </div>
      <div class="signupall-aside-warpper">
        <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            name="login"
            appear
          >
            <Component :is="Component" />
          </transition>
        </router-view>
      </div>
    </template>

    <template v-else>
      <div class="login-logo flex-y-center">
        <!-- <img
          src="/logo.svg"
          style="height: 30px; margin-right: 12px;"
        /> -->
        <span>一站式 AI 科研平台</span>
      </div>
      <div class="aside-warpper">
        <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            name="login"
            appear
          >
            <Component :is="Component" />
          </transition>
        </router-view>
      </div>
    </template>
  </div>
</template>

<script lang="tsx" setup>
import bg from './imgs/bg.png'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSignUpAll = ref(false)

watch(() => route.name, (newVal) => {
  const fullScreen = ['SignUpAll', 'ForgetVerify', 'ResetPwd']
  isSignUpAll.value = fullScreen.includes(newVal as string)
}, {
  immediate: true,
})

</script>

<style lang="scss">
.login-layout-container {
  position: relative;
  --border-color: var(--td-border-level-2-color);
  width: 100%;
  height: 100%;
  min-height: 100vh;
  // font-weight: 500;
  background-position: center;
  background-size: cover;
  background-color: #f3f3f3;
  /* padding-bottom: 20px; */
  .header-nav {
    height: 56px;
    width: 100%;
    display: flex;
    background: #fff;
    align-items: center;
    .nav-log {
      width: 200px;
      height: 28px;
      background-position: left center;
      background-size: cover;
    }
  }
  .login-logo {
    position: absolute;
    top: 32px;
    left: 40px;
    font-size: 32px;
    font-family: var(--TencentW7-en);
    color: #0052d9;
    line-height: 48px;
  }

  .t-form__item {
    // .t-input__extra ,
    // .t-input__inner {
    //   font-weight: 500;
    // }
    .t-form__label {
      // font-weight: 500;
      &.t-form__label--top {
        padding-right: 0;
      }
    }

  }

  // .t-link {
  //   font-weight: 500;
  // }

  .t-button {
    // border-radius: 3px;
    // font-weight: 500;
    font-size: 14px;
  }

  .t-divider {
    --td-border-level-1-color: var(--border-color);
    // font-weight: 500;
  }

  .aside-warpper {
    position: absolute;
    width: 44%;
    height: 100%;
    min-height: max-content;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #ffffff66;
    backdrop-filter: blur(20px);
  }

  .signupall-aside-warpper {
    width: 100%;
    min-height: calc(100vh - 56px);
    overflow-y: hidden;
  }

  // .header-text {
  //   padding-bottom: 24px;
  //   font-weight: 700;
  //   font-size: 48px;
  //   font-family: var(--TencentW7-en);
  //   color: #0052d9;
  // }

  .login-card {
    border-radius: 8px;
    background-color: #fff;
    padding: 40px;
    width: 460px;

    .login-title {
      margin-bottom: 16px;
      font-size: 24px;
      text-align: center;
      font-weight: 500;
    }

    .form-input .t-input {
      height: 40px;
      padding: 0 12px;
    }
  }

  .or-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px 0;

    .opt-btn {
      height: 40px;
      width: 100%;
      border: 1px solid var(--border-color);
      border-radius: 3px;
      // box-shadow: 0px 2px 4px rgba(0, 0, 0, .12), inset 0px 2px 0px rgba(255, 255, 255, .04);
      cursor: pointer;
      transition: background-color 200ms;
      // font-weight: 500;
      user-select: none;
      color: inherit;
      line-height: 18px;

      &:hover {
        background-color: #f3f3f3;
      }

      &:active {
        background-color: #e8e8e8;
      }

      img {
        width: 18px;
        height: 18px;
        margin-bottom: 2px;
      }
    }
  }

  .gray-text {
    color: var(--td-gray-color-7);
  }

  .footer-text {
    padding-top: 16px;
    text-align: center;
    color: #00000066;
  }

  .login-enter-active {
    transition: all 300ms ease;
  }
  .login-leave-active {
    transition: all 200ms ease;
  }
  .login-enter-from,
  .login-leave-to {
    opacity: 0;
    transform: translateY(15px);
  }
}
</style>
