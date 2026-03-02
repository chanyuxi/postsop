import { PropsWithChildren } from 'react'
import { Pressable } from 'react-native'
import { twMerge } from 'tailwind-merge'
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
        wrapper: 'bg-primary',
      },
      secondary: {
        wrapper: 'bg-gray-500',
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
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
})

const { wrapper, text } = button()

interface ButtonProps extends VariantProps<typeof button> {
  className?: string
  onPress?: () => void
}

export function Button({
  className,
  onPress,
  variant,
  size,
  block,
  children,
}: PropsWithChildren<ButtonProps>) {
  const renderContent =
    typeof children === 'string' ? (
      <ThemeText className={text({ size })}>{children}</ThemeText>
    ) : (
      children
    )

  return (
    <Pressable
      className={twMerge(wrapper({ variant, size, block }), className)}
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 3 / 4 }}
    >
      {renderContent}
    </Pressable>
  )
}
