import {View} from "react-native";
import {createStackNavigator} from "@react-navigation/native/src/__stubs__/createStackNavigator";
import {NavigationContainer} from "@react-navigation/native";
import Home from "./screens/Home";

const Stack = createStackNavigator();

export default function App() {
  return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Home"}>
                <Stack.Screen name="Home" component={Home} />

            </Stack.Navigator>
        </NavigationContainer>
  )
}