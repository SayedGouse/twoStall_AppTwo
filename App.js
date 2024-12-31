import React, { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigation from "./src/StackNavigation";
import { NavigationContainer } from "@react-navigation/native";


export default function App() {
  return (
    <NavigationContainer  >
      <StackNavigation  />
    </NavigationContainer>
  );
}
