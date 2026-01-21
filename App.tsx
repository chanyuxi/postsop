import { Platform, StatusBar, StyleSheet, View } from "react-native"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"

import { RouteRender } from "@/routes"

const isAndroidLargerThan35 = Platform.OS === 'android' && Platform.Version >= 35

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets()

  const inlineStyles = {
    paddingTop: isAndroidLargerThan35 ? 0 : safeAreaInsets.top,
    paddingBottom: safeAreaInsets.bottom,
  }

  return (
    <View style={[styles.container, inlineStyles]}>
      <RouteRender />
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      {!isAndroidLargerThan35 && <StatusBar backgroundColor="#24292e" />}
      <AppContent />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24292e'
  },
})
