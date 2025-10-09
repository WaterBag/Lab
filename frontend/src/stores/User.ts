import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    username: '',
    email: '',
    is_superuser: false,
    auth_keys: [] as string[],
  }),
  getters: {
    isLogin: state => !!state.username,
  },
})
