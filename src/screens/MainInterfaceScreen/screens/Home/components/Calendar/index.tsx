import { useCallback, useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

import { Icons } from '@/components/common/MaterialDesignIcons'

export function Calendar() {
  const [isFullViewMode, setIsFullViewMode] = useState(false)

  const toggleFullViewMode = useCallback(() => {
    setIsFullViewMode((prev) => !prev)
    console.log('Modal visible:', !isFullViewMode)
  }, [isFullViewMode])

  const closeModal = useCallback(() => {
    setIsFullViewMode(false)
  }, [])

  return (
    <>
      <View className="flex-row items-center justify-between bg-gray-800 p-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">CALENDAR</Text>
        </View>

        <TouchableOpacity onPress={toggleFullViewMode}>
          <Icons
            name={isFullViewMode ? 'arrow-collapse' : 'arrow-expand'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={isFullViewMode}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          className="flex-1 items-center justify-center bg-black/50"
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <View className="max-h-4/5 w-4/5 rounded-xl bg-white p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Calendar Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icons
                  name="close"
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <Text>Calendar Content 1</Text>
            <Text>Calendar Content 2</Text>
            <Text>Calendar Content 3</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}
