import { type BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Pressable, StyleSheet, View } from "react-native"
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Home } from "@/views/Home"
import { Mine } from "@/views/Mine"
import { QuietMode } from "@/views/QuietMode"

const Tab = createBottomTabNavigator()

// reference from https://pictogrammers.com/library/mdi/
const tabItemIconNameMap: Record<string, string> = {
    Home: 'alpha-t-circle-outline',
    QuietMode: 'alarm',
    Mine: 'account-circle-outline',
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    return (
        <View style={customTabBarStyles.container}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index

                const handlePress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params)
                    }
                }

                return (
                    <Pressable key={route.key} style={customTabBarStyles.item} onPress={handlePress}>
                        <MCIIcon
                            size={26}
                            name={tabItemIconNameMap[route.name]}
                            color={isFocused ? '#22a7f2' : '#fff'} />
                    </Pressable>
                )
            })}
        </View>
    )
}

function MainInterface() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={CustomTabBar}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="QuietMode" component={QuietMode} />
            <Tab.Screen name="Mine" component={Mine} />
        </Tab.Navigator>
    )
}

const Stack = createStackNavigator()

function StackRoot() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainInterface" component={MainInterface} />
        </Stack.Navigator>
    )
}

export function RouteRender() {
    return (
        <NavigationContainer>
            <StackRoot />
        </NavigationContainer>
    )
}

const customTabBarStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        backgroundColor: "#1f2428",
    },
    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})
