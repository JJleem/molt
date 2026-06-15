// 언어 차원을 "비워둔" 구조 — 지금은 한국어만 채우고, 영어는 나중에 `en` 키만 추가하면 됨.
// i18n 라우팅/기계는 아직 도입하지 않는다 (오버엔지니어링 회피).

export type Locale = "ko" | "en";

export const DEFAULT_LOCALE: Locale = "ko";

/** ko는 필수, en은 선택. 영어 확장 시 en만 채우면 된다. */
export type Localized<T> = { ko: T; en?: T };

export function localize<T>(
  content: Localized<T>,
  locale: Locale = DEFAULT_LOCALE
): T {
  return content[locale] ?? content.ko;
}
