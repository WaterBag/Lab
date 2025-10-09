<template>
  <t-tabs
    v-bind="$attrs"
    scroll-position="center"
    class="custom-center-tabs"
  >
    <slot />
  </t-tabs>
</template>

<style lang="scss">
.t-tabs.custom-center-tabs {
  background-color: unset;

  .t-tabs__nav-wrap {
    flex: 1;
    justify-content: space-around;
  }
  .t-tabs__nav-item {
    --td-brand-color: rgba(0, 0, 0, 0.9);
    text-shadow: none;
    border-bottom: 2px solid transparent;
    transition: border-color 300ms, background-color 300ms, color 300ms;

    &.t-is-active {
      border-color: #0052d9;
    }

    .t-tabs__nav-item-wrapper {
      height: auto !important;
      // padding: 0 24px;
      border-radius: 6px;
    }
  }

  .t-tabs__bar {
    display: none;
  }

  .t-tabs__btn {
    border: none;
  }

}

@media (min-width: 768px) {
  .custom-center-tabs {
    .t-tabs__nav-item {
      font-size: 22px;
      height: 58px !important;
      line-height: 46px !important;

      .t-tabs__nav-item-wrapper {
        padding: 0 24px;
      }
    }

    .t-tabs__btn {
      height: 58px !important;
      width: 40px;
    }
  }
}

@media (min-width: 0px) and (max-width: 767.9px) {
  .custom-center-tabs {
    .t-tabs__nav-item {
      font-size: 12px;
      height: 32px !important;
      line-height: 24px !important;

      .t-tabs__nav-item-wrapper {
        padding: 0 12px;
      }
    }
    .t-tabs__btn {
      height: 32px !important;
      width: 20px;
    }
  }
}

</style>
