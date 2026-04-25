export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '欢迎',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '欢迎',
      navigationStyle: 'custom'
    }
