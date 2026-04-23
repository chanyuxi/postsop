import { TopBar } from '@/components/common'
import { ScreenWrapper } from '@/components/common/screen-wrapper'

export function QuietMode() {
  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar
        hideBackButton
        title="Quiet Mode"
      />
    </ScreenWrapper>
  )
}
