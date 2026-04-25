export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '梗详情' })
  : { navigationBarTitleText: '梗详情' }
