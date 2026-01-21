import { useCallback, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export function Calendar() {
    const [isFullViewMode, setIsFullViewMode] = useState(false) // 改为false

    const toggleFullViewMode = useCallback(() => {
        setIsFullViewMode(prev => !prev)
        console.log("Modal visible:", !isFullViewMode)
    }, [isFullViewMode])

    const closeModal = useCallback(() => {
        setIsFullViewMode(false)
    }, [])

    return (
        <>
            <View style={outer.container}>
                <View style={outer.dateArea}>
                    <Text style={outer.text}>CALENDAR</Text>
                </View>

                <TouchableOpacity onPress={toggleFullViewMode}>
                    <MCIIcon
                        name={isFullViewMode ? "arrow-collapse" : "arrow-expand"} // 图标随状态变化
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            <Modal
                transparent
                visible={isFullViewMode}
                animationType="fade"
                onRequestClose={closeModal} // Android返回键支持
            >
                <TouchableOpacity
                    style={inner.overlay}
                    activeOpacity={1}
                    onPressOut={closeModal} // 点击外部关闭
                >
                    <View style={inner.modalContent}>
                        <View style={inner.header}>
                            <Text style={inner.title}>Calendar Details</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <MCIIcon name="close" size={24} color="#000" />
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

// 更新样式
const inner = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})
const outer = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#1E1E1E',
    },
    dateArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    }
})
