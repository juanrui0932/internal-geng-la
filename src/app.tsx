import { useEffect, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { LucideTaroProvider } from 'lucide-react-taro';
import '@/app.css';
import { Toaster } from '@/components/ui/toast';
import { Preset } from './presets';

const App = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    // 检测用户是否已设置昵称
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage?.route || '';

    // 如果当前不在欢迎页，则检测用户昵称
    if (!route.includes('welcome')) {
      const userInfo = Taro.getStorageSync('userInfo');
      if (!userInfo || !userInfo.nickname) {
        // 无昵称，跳转到欢迎页
        Taro.redirectTo({ url: '/pages/welcome/index' });
      }
    }
  }, []);

  return (
    <LucideTaroProvider defaultColor="#000" defaultSize={24}>
      <Preset>{children}</Preset>
      <Toaster />
    </LucideTaroProvider>
  );
};

export default App;
