import type { StyleProp, TextStyle } from 'react-native'
import { StyleSheet } from 'react-native'

const NUNITO_FONT_FAMILY = {
  black: 'Nunito-Black',
  blackItalic: 'Nunito-BlackItalic',
  bold: 'Nunito-Bold',
  boldItalic: 'Nunito-BoldItalic',
  extraBold: 'Nunito-ExtraBold',
  extraBoldItalic: 'Nunito-ExtraBoldItalic',
  extraLight: 'Nunito-ExtraLight',
  extraLightItalic: 'Nunito-ExtraLightItalic',
  italic: 'Nunito-Italic',
  light: 'Nunito-Light',
  lightItalic: 'Nunito-LightItalic',
  medium: 'Nunito-Medium',
  mediumItalic: 'Nunito-MediumItalic',
  regular: 'Nunito-Regular',
  semiBold: 'Nunito-SemiBold',
  semiBoldItalic: 'Nunito-SemiBoldItalic',
} as const

type NormalizedFontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'

const CLASS_NAME_FONT_WEIGHT_MAP = [
  ['font-black', '900'],
  ['font-extrabold', '800'],
  ['font-bold', '700'],
  ['font-semibold', '600'],
  ['font-medium', '500'],
  ['font-normal', '400'],
  ['font-light', '300'],
  ['font-extralight', '200'],
  ['font-thin', '100'],
] as const satisfies readonly (readonly [string, NormalizedFontWeight])[]

const FONT_WEIGHT_STYLE_MAP: Record<
  NormalizedFontWeight,
  { normal: string; italic: string }
> = {
  '100': {
    normal: NUNITO_FONT_FAMILY.extraLight,
    italic: NUNITO_FONT_FAMILY.extraLightItalic,
  },
  '200': {
    normal: NUNITO_FONT_FAMILY.extraLight,
    italic: NUNITO_FONT_FAMILY.extraLightItalic,
  },
  '300': {
    normal: NUNITO_FONT_FAMILY.light,
    italic: NUNITO_FONT_FAMILY.lightItalic,
  },
  '400': {
    normal: NUNITO_FONT_FAMILY.regular,
    italic: NUNITO_FONT_FAMILY.italic,
  },
  '500': {
    normal: NUNITO_FONT_FAMILY.medium,
    italic: NUNITO_FONT_FAMILY.mediumItalic,
  },
  '600': {
    normal: NUNITO_FONT_FAMILY.semiBold,
    italic: NUNITO_FONT_FAMILY.semiBoldItalic,
  },
  '700': {
    normal: NUNITO_FONT_FAMILY.bold,
    italic: NUNITO_FONT_FAMILY.boldItalic,
  },
  '800': {
    normal: NUNITO_FONT_FAMILY.extraBold,
    italic: NUNITO_FONT_FAMILY.extraBoldItalic,
  },
  '900': {
    normal: NUNITO_FONT_FAMILY.black,
    italic: NUNITO_FONT_FAMILY.blackItalic,
  },
}

// TODO: Optimize this function
function normalizeFontWeight(
  fontWeight?: TextStyle['fontWeight']
): NormalizedFontWeight {
  switch (fontWeight) {
    case 100:
    case '100':
      return '100'
    case 200:
    case '200':
      return '200'
    case 300:
    case '300':
      return '300'
    case 500:
    case '500':
      return '500'
    case 600:
    case '600':
      return '600'
    case 700:
    case '700':
    case 'bold':
      return '700'
    case 800:
    case '800':
      return '800'
    case 900:
    case '900':
      return '900'
    case 400:
    case '400':
    case 'normal':
    default:
      return '400'
  }
}

function getFontWeightFromClassName(className?: string) {
  if (!className) {
    return undefined
  }

  const tokens = className.split(/\s+/)

  for (const [token, fontWeight] of CLASS_NAME_FONT_WEIGHT_MAP) {
    if (tokens.includes(token)) {
      return fontWeight
    }
  }

  return undefined
}

function isItalic(className?: string, style?: TextStyle) {
  if (className?.split(/\s+/).includes('italic')) {
    return true
  }

  return style?.fontStyle === 'italic'
}

function resolveFontFamily({
  className,
  style,
}: {
  className?: string
  style?: TextStyle
}) {
  const fontWeight =
    getFontWeightFromClassName(className) ??
    normalizeFontWeight(style?.fontWeight)
  const variant = isItalic(className, style) ? 'italic' : 'normal'

  return FONT_WEIGHT_STYLE_MAP[fontWeight][variant]
}

export function withDefaultFontStyle({
  className,
  style,
}: {
  className?: string
  style?: StyleProp<TextStyle>
}) {
  const flattenedStyle = StyleSheet.flatten(style)
  const fontFamily = resolveFontFamily({
    className,
    style: flattenedStyle ?? undefined,
  })

  return [
    style,
    {
      fontFamily,
      fontStyle: 'normal',
      fontWeight: '400',
    } satisfies TextStyle,
  ]
}

export const DEFAULT_FONT_FAMILY = NUNITO_FONT_FAMILY.regular

export { NUNITO_FONT_FAMILY }
