import type { PropsWithChildren } from 'react'
import { Pressable } from 'react-native'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

import { ThemeText } from '../theme-text'

const buttonVariants = tv({
  slots: {
    wrapper: 'items-center justify-center',
    text: 'text-white',
  },
  variants: {
    variant: {
      primary: {
        wrapper: 'bg-brand-primary border-brand-primary border',
      },
      secondary: {
        wrapper: 'bg-brand-secondary border-brand-secondary border',
      },
      success: {
        wrapper: 'bg-brand-success border-brand-success border',
      },
      danger: {
        wrapper: 'bg-brand-danger border-brand-danger border',
      },
      warning: {
        wrapper: 'bg-brand-warning border-brand-warning border',
      },
    },
    size: {
      medium: {
        wrapper: 'h-13',
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
    ghost: {
      true: {
        wrapper: 'bg-transparent',
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

interface ButtonProps extends VariantProps<typeof buttonVariants> {
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
  ghost,
  children,
}: PropsWithChildren<ButtonProps>) {
  const { wrapper, text } = buttonVariants({
    variant,
    size,
    rounded,
    block,
    disabled,
    ghost,
  })

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
      style={({ pressed }) => pressed && { opacity: 0.85 }}
      onPress={handlePress}
    >
      {renderContent}
    </Pressable>
  )
}
