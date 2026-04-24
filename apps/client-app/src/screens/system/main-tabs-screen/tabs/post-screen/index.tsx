import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useCSSVariable } from 'uniwind'

import { TopBar } from '@/components/common'
import { ScreenWrapper } from '@/components/common/screen-wrapper'

export function PostScreen() {
  const foregroundColor = useCSSVariable('--color-foreground') as string

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar
        hideBackButton
        rightIcon={
          <MaterialDesignIcons
            color={foregroundColor}
            name="bell-outline"
          />
        }
        title="Post"
      />
    </ScreenWrapper>
  )
}
