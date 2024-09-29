import { createI18n } from 'vue-i18n';
import type { App } from 'vue';
import { Locale } from 'vant';
import enUS from 'vant/lib/locale/lang/en-US';
import sg from './en-SG';
import ja from './ja-JP';
import ko from './ko-KR';
import zh from './zh-CN';
Locale.use('en-US', enUS);

const defaultLang = localStorage.getItem('locale') || 'zh-CN';

const createI18nOptions = async () => {
  const messages = {
    'en-SG': sg,
    'ja-JP': ja,
    'ko-KR': ko,
    'zh-CN': zh,
  };
  return {
    globalInjection: true,
    legacy: false,
    locale: defaultLang,
    fallbackLocale: defaultLang,
    fallbackWarn: false,
    messages: messages,
  };
};

export const setDefaultLang = async (i18n: any) => {
  i18n.global.locale.value = defaultLang;
};

export const setupI18n = async (app: App<Element>) => {
  const options = await createI18nOptions();
  const i18n = createI18n(options);
  app.use(i18n);
  await setDefaultLang(i18n);
};
