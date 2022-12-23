import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImageSelector from "./imagerelated/ImageSelector";
//import TakeNewImage from './imagerelated/takenewimage';
const Stack = createNativeStackNavigator();

export default function App() {
  //homescreen
  function HomeScreen() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.fontHeader}>m_mayne139376</Text>
        <ImageSelector></ImageSelector>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    margin: 30,
  },
  everythingContainer: {
    paddingVertical: 40,
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: "40%",
  },
  center: {
    marginLeft: "47%",
    backgroundColor: "#87ceeb",
    marginRight: "47%",
    fontSize: "larger",
    marginBottom: "30px",
  },
  fontHeader: {
    fontSize: 30,
  },
});
