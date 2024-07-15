import { defineStore } from 'pinia'

export const useUserStore = defineStore('USER', () => {
  const router = useRouter()
  const userInfo = ref<ApiUser.UserInfo | null>()
  const accessToken = ref('')
  const refreshToken = ref('')

  function setUserInfo(info: ApiUser.UserInfo) {
    userInfo.value = info
  }

  function getUserInfo() {
    return userInfo.value
  }

  function setAccessToken(token: string) {
    accessToken.value = token
  }

  function getAccessToken() {
    return accessToken.value
  }

  function hasAccessToken() {
    return !!accessToken.value
  }
  function setRefreshToken(token: string) {
    refreshToken.value = token
  }

  function getRefreshToken() {
    return refreshToken.value
  }

  function hasRefreshToken() {
    return !!refreshToken.value
  }

  function resetStore() {
    userInfo.value = null
    accessToken.value = ''
    refreshToken.value = ''
  }

  function logout() {
    resetStore()
    router.replace('/login')
  }

  return {
    userInfo,
    accessToken,
    refreshToken,
    setUserInfo,
    getUserInfo,
    getAccessToken,
    setAccessToken,
    hasAccessToken,
    getRefreshToken,
    setRefreshToken,
    hasRefreshToken,
    resetStore,
    logout,
  }
}, {
  persist: true,
})
