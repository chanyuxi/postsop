import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useCallback, useState } from 'react'
import { Modal, TouchableOpacity, View } from 'react-native'

import { ThemeText } from '@/components/common'

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
          <ThemeText className="text-white">CALENDAR</ThemeText>
        </View>

        <TouchableOpacity onPress={toggleFullViewMode}>
          <MaterialDesignIcons
            color="#fff"
            name={isFullViewMode ? 'arrow-collapse' : 'arrow-expand'}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={isFullViewMode}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 items-center justify-center bg-black/50"
          onPressOut={closeModal}
        >
          <View className="max-h-4/5 w-4/5 rounded-xl bg-white p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <ThemeText className="text-lg font-bold">
                Calendar Details
              </ThemeText>
              <TouchableOpacity onPress={closeModal}>
                <MaterialDesignIcons
                  color="#000"
                  name="close"
                />
              </TouchableOpacity>
            </View>
            <ThemeText>Calendar Content 1</ThemeText>
            <ThemeText>Calendar Content 2</ThemeText>
            <ThemeText>Calendar Content 3</ThemeText>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}
