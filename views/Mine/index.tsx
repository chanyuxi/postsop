import { StyleSheet, Text } from "react-native"

import { BackgroundView } from "@/components/BackgroundView"

export function Mine() {
    return (
        <BackgroundView>
            <Text style={styles.text}>Mine</Text>
        </BackgroundView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: "white",
    },
})
