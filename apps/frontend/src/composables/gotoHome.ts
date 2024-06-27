import { useUserStore } from '~/store';

export function gotoHome() {
  const userStore = useUserStore()
  const { pushHomePage, pushClientHomePage } = useGotoPage()

  function handleToHome() {
    if(userStore.userInfo?.isAdmin) {
      pushHomePage()
    }else {
      pushClientHomePage()
    }
  }

  return {
    handleToHome
  }
}
