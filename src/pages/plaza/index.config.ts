export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '梗广场' })
  : { navigationBarTitleText: '梗广场' }
