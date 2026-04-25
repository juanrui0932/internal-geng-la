export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '发布梗' })
  : { navigationBarTitleText: '发布梗' }
