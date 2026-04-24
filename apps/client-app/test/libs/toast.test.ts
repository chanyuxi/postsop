import { toast, toastStore } from '../../src/libs/toast'

describe('toast store', () => {
  beforeEach(() => {
    toastStore.clear()
  })

  it('shows the next queued toast after the current one is disposed', () => {
    toast('first')
    toast('second')

    expect(toastStore.getSnapshot()?.message).toBe('first')

    toastStore.dispose()

    expect(toastStore.getSnapshot()?.message).toBe('second')
  })

  it('clears the active toast and queued toasts together', () => {
    toast('first')
    toast('second')

    toastStore.clear()
    toastStore.dispose()

    expect(toastStore.getSnapshot()).toBeNull()
  })
})
