import { useUserStore } from './stores/User'
import { requestErrorMsg } from '@/common/plugins/request'
import { reqUserInfo } from '@/api/Users'

export const presetup = async () => {
  if (window.location.pathname === '/email-verification') {
    return
  }
  let userInfo
  try {
    userInfo = await reqUserInfo()
  } catch (err: any) {
    if (err?.code === 401 || err?.response?.status === 401) return
    requestErrorMsg(err?.message ?? '����ʧ��')
    return
  }

  const UserStore = useUserStore()

  UserStore.username = userInfo.username
  UserStore.name = userInfo.name || userInfo.username
  UserStore.is_superuser = userInfo.is_superuser
  UserStore.email = userInfo.email
}
