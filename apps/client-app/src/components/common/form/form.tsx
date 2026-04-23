import type { PropsWithChildren } from 'react'
import type { FieldValues } from 'react-hook-form'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { tw } from '@/utils/style'

import { ThemeText } from '../theme-text'
import { FormItemContext, transformErrorMessage } from './core'

interface FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> {
  /** The className to apply to the form */
  className?: string
  /** The methods returned from `useForm` */
  form: ReturnType<typeof useForm<TFieldValues, TContext, TTransformedValues>>
}

interface FormItemProps {
  /** The name of the field */
  name: string
  /** The label to display above the field */
  label?: string
  /** The className to apply to the form item */
  className?: string
}

function Form<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>(
  props: PropsWithChildren<
    FormProps<TFieldValues, TContext, TTransformedValues>
  >
) {
  const { className, form, children } = props

  return (
    <View className={tw('w-full', className)}>
      <FormProvider {...form}>{children}</FormProvider>
    </View>
  )
}

Form.Item = function FormItem(props: PropsWithChildren<FormItemProps>) {
  const { name, label, className, children } = props

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        const { value, onChange } = field
        const { error } = fieldState

        return (
          <View className={tw('relative', className)}>
            {label && (
              <View className="mb-2">
                <ThemeText className="text-lg">{label}</ThemeText>
              </View>
            )}

            <FormItemContext.Provider
              value={{ value, onChange, isError: !!error }}
            >
              <View>{children}</View>
            </FormItemContext.Provider>

            {fieldState.error && (
              <Animated.View
                className="absolute top-full"
                entering={FadeIn}
                exiting={FadeOut}
              >
                <ThemeText className="text-brand-danger text-sm">
                  {transformErrorMessage(fieldState.error)}
                </ThemeText>
              </Animated.View>
            )}
          </View>
        )
      }}
    />
  )
}

export { Form }
