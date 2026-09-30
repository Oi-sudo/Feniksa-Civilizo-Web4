import { cookies } from 'next/headers';
import zh from '@/locales/zh.json';
import eo from '@/locales/eo.json';
import en from '@/locales/en.json';

export const supportedLocales = ['zh', 'eo', 'en'] as const;
export type Locale = (typeof supportedLocales)[number];
export type Messages = typeof zh;

const dictionaries: Record<Locale, Messages> = { zh, eo, en };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && supportedLocales.includes(value as Locale);
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get('feniksa_locale')?.value;
  return isLocale(value) ? value : 'zh';
}

export async function getMessages(): Promise<Messages> {
  const locale = await getLocale();
  return dictionaries[locale];
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
