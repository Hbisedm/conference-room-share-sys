export  function useGotoPage() {
  const router = useRouter()

  function pushHomePage() {
    router.push('/main/userManage')
  }

  function pushClientHomePage() {
    router.push('/client/meetingRoomList')
  }

  function pushRegisterPage() {
    router.push('/login/register')
  }

  function replaceLoginPage(){
    router.replace('/login')
  }

  function pushUpdatePasswordPage(){
    router.push('/login/updatePassword')
  }

  function pushUpdateInfoPage(){
    router.push('/common/updateInfo')
  }

  return {
    pushHomePage,
    pushClientHomePage,
    pushRegisterPage,
    replaceLoginPage,
    pushUpdatePasswordPage,
    pushUpdateInfoPage,
  }
}
