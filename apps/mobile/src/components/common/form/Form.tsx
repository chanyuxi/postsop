import { type PropsWithChildren } from 'react'
import {
  Controller,
  type FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

import { ThemeText } from '../ThemeText'
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
    <View className={twMerge('w-full', className)}>
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { value, onChange } = field

        return (
          <View className={className}>
            {label && (
              <View className="mb-2">
                <ThemeText className="text-lg">{label}</ThemeText>
              </View>
            )}

            <FormItemContext.Provider value={{ value, onChange }}>
              <View>{children}</View>
            </FormItemContext.Provider>

            {fieldState.error && (
              <Animated.View
                className="mt-2"
                entering={FadeIn}
                exiting={FadeOut}
              >
                <ThemeText className="text-brand-danger">
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
