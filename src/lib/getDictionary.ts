import en from '@/dictionaries/en.json';

export type Dictionary = typeof en;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default as Dictionary),
  es: () => import('@/dictionaries/es.json').then((module) => module.default as unknown as Dictionary),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] || dictionaries['en'];
  return loadDictionary();
};