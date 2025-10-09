<template>
  <router-view v-if="UserStore.isLogin || isLoginRoute" />
</template>

<script lang="ts" setup>
import { LoginBaseRouteName } from '@/router/modules/Login'
import { useUserStore } from './stores/User'

const route = useRoute()
const UserStore = useUserStore()

const isLoginRoute = computed(() => route.matched[0]?.name === LoginBaseRouteName)

</script>
