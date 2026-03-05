import { type PropsWithChildren } from 'react'
import { Pressable } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

import { ThemeText } from '../ThemeText'

const button = tv({
  slots: {
    wrapper: '',
    text: 'text-foreground text-center',
  },
  variants: {
    variant: {
      primary: {
        wrapper: 'bg-button-primary',
        text: 'text-white',
      },
      secondary: {
        wrapper: 'bg-button-secondary',
        text: 'text-white',
      },
    },
    size: {
      medium: {
        wrapper: 'px-6 py-4',
      },
    },
    rounded: {
      true: {
        wrapper: 'rounded-lg',
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
    rounded: true,
    block: true,
  },
})

interface ButtonProps extends VariantProps<typeof button> {
  wrapperClassName?: string
  textClassName?: string
  uppercase?: boolean
  onPress?: () => void
}

export function Button({
  wrapperClassName,
  textClassName,
  uppercase = true,
  onPress,
  variant,
  size,
  rounded,
  block,
  disabled,
  children,
}: PropsWithChildren<ButtonProps>) {
  const { wrapper, text } = button({ variant, size, rounded, block, disabled })

  const handlePress = () => {
    onPress?.()
  }

  const renderContent =
    typeof children === 'string' ? (
      <ThemeText className={text({ className: textClassName })}>
        {uppercase ? children.toUpperCase() : children}
      </ThemeText>
    ) : (
      children
    )

  return (
    <Pressable
      className={wrapper({ className: wrapperClassName })}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => pressed && { opacity: 0.85 }}
    >
      {renderContent}
    </Pressable>
  )
}
