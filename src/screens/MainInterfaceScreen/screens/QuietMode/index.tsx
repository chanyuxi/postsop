import { TopBar } from '@/components/common'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'

export function QuietMode() {
  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar
        title="Quiet Mode"
        hideBackButton
      />
    </ScreenWrapper>
  )
}
