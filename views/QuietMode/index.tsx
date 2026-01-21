import { StyleSheet, Text } from "react-native"

import { BackgroundView } from "@/components/BackgroundView"

export function QuietMode() {
    return (
        <BackgroundView>
            <Text style={styles.text}>QuietMode</Text>
        </BackgroundView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: "white",
    },
})
