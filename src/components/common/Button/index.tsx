import { PropsWithChildren } from 'react'
import { Pressable } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

import { ThemeText } from '../ThemeText'

const button = tv({
  slots: {
    wrapper: 'rounded',
    text: 'text-foreground text-center',
  },
  variants: {
    variant: {
      primary: {
        wrapper: 'bg-button-primary',
      },
      secondary: {
        wrapper: 'bg-button-secondary',
      },
    },
    size: {
      medium: {
        wrapper: 'px-6 py-4',
      },
    },
    block: {
      true: {
        wrapper: 'w-full',
      },
    },
    disabled: {
      true: {
        wrapper: 'opacity-50',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
    block: true,
  },
})

interface ButtonProps extends VariantProps<typeof button> {
  wrapperClassName?: string
  textClassName?: string
  onPress?: () => void
}

export function Button({
  wrapperClassName,
  textClassName,
  onPress,
  variant,
  size,
  block,
  disabled,
  children,
}: PropsWithChildren<ButtonProps>) {
  const { wrapper, text } = button({ variant, size, block, disabled })

  const handlePress = () => {
    if (disabled) {
      return
    }

    onPress?.()
  }

  const renderContent =
    typeof children === 'string' ? (
      <ThemeText className={text({ className: textClassName })}>
        {children}
      </ThemeText>
    ) : (
      children
    )

  return (
    <Pressable
      className={wrapper({ className: wrapperClassName })}
      onPress={handlePress}
      style={({ pressed }) => pressed && { opacity: 0.85 }}
    >
      {renderContent}
    </Pressable>
  )
}
