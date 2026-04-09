import type { FunctionComponent } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { FieldError } from 'react-hook-form'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const PLAIN_ONCHANGE = () => {}

export interface Controllability<T = unknown> {
  value?: T | undefined
  onChange?: (value: T) => void
}

export const FormItemContext = createContext<
  Required<Controllability<unknown>>
>({
  value: undefined,
  onChange: PLAIN_ONCHANGE,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAutoControl<P extends Controllability<any>>(
  Component: FunctionComponent<P>
) {
  return function ControllableComponent(props: P) {
    const ctx = useContext(FormItemContext)

    const propsInjectedWithAutoControllability = useMemo(() => {
      if (ctx.onChange === PLAIN_ONCHANGE) {
        // not wrapped by Form.Item
        return props
      }

      // easy to use input components
      return {
        ...props,

        value: props.value ?? ctx.value,
        onChange: (value) => {
          ctx.onChange(value)
          props.onChange?.(value)
        },
      }
    }, [ctx, props])

    return Component(propsInjectedWithAutoControllability)
  }
}

export function transformErrorMessage(error: FieldError | undefined) {
  return error?.message ?? ''
}
