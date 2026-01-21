import { useState, } from "react"
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native"

import { Collapse } from "@/components/Collapse"
import { Todo } from "@/types/todo"

interface TodoCardProps {
    todo: Todo
    onLongPress?: (event: GestureResponderEvent) => void
}

export function TodoCard({ todo, onLongPress }: TodoCardProps) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <Pressable
            onPress={toggleCollapse}
            onLongPress={onLongPress}
            style={styles.container}>
            <Text>{todo.title}</Text>

            <Collapse collapsed={isCollapsed} >
                <View>
                    <Text>Something about description</Text>
                    <Text>Date: unknown</Text>
                </View>
            </Collapse>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#d9d9d9'
    },
})
