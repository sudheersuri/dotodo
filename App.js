import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import {
  getData,
} from "./functions";
import GlobalContext from "./GlobalContext";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "./theme";
import List from "./src/screens/List";
import Create from "./src/screens/Create";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="Create" component={Create} />
    </Stack.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  // Choose the theme based on device appearance
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const [globals, setGlobals] = useState({ tasks: [], theme: theme });

  useEffect(() => {
    getData().then((data) => {
      if (data) {
        try {
          setGlobals({ ...globals, tasks: JSON.parse(data) });
        } catch (e) {
          console.log(e);
        }
      }
    });
  }, []);
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
  });
  if (!fontsLoaded) {
    return <Text>Hi</Text>;
  }
  return (
    <GlobalContext.Provider value={{ globals, setGlobals }}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </GlobalContext.Provider>
  );
}
