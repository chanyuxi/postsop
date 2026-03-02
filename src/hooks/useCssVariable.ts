import { useCSSVariable } from 'uniwind'

type Tier = 'light' | 'lighter' | 'lightest' | 'dark' | 'darker' | 'darkest'

export const useForegroundColor = () =>
  useCSSVariable('--color-foreground') as string
export const useBackgroundColor = (tier?: Tier) =>
  useCSSVariable(
    tier ? `--color-background-${tier}` : '--color-background'
  ) as string

export const usePrimaryColor = () => useCSSVariable('--color-primary') as string
