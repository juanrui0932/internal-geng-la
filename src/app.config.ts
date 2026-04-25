export default defineAppConfig({
  pages: [
    'pages/welcome/index',
    'pages/index/index',
    'pages/plaza/index',
    'pages/publish/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '玩内部梗啦！',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#f97316',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png',
      },
      {
        pagePath: 'pages/plaza/index',
        text: '广场',
        iconPath: './assets/tabbar/flame.png',
        selectedIconPath: './assets/tabbar/flame-active.png',
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布',
        iconPath: './assets/tabbar/plus.png',
        selectedIconPath: './assets/tabbar/plus-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png',
      },
    ],
  }
})
