import { notificationStore, notify } from '../../src/libs/notification'

describe('notification store', () => {
  beforeEach(() => {
    notificationStore.clear()
  })

  it('replaces the current notification immediately when imperative', () => {
    const disposeCurrent = jest.fn()

    notify({
      message: 'first',
      onDispose: disposeCurrent,
    })

    notify({
      imperative: true,
      message: 'second',
    })

    expect(disposeCurrent).toHaveBeenCalledTimes(1)
    expect(notificationStore.getSnapshot()?.message).toBe('second')
  })

  it('can remove a persistent notification by id and continue the queue', () => {
    const disposeCurrent = jest.fn()
    const currentId = notify({
      duration: 'never',
      message: 'first',
      onDispose: disposeCurrent,
    })

    notify({
      message: 'second',
    })

    notificationStore.remove(currentId)

    expect(disposeCurrent).toHaveBeenCalledTimes(1)
    expect(notificationStore.getSnapshot()?.message).toBe('second')
  })
})
