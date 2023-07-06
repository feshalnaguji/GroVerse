import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Switch, Button } from 'react-native';
import Home from './screens/Home';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AddTodo from './screens/AddTodo';
import Onboarding from './screens/Onboarding';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import React from 'react'; 
import SetTheme from './utils/ThemeManager';
// import { Provider as PaperProvider, DarkTheme as PaperDarkTheme } from 'react-native-paper'; 


const Stack = createNativeStackNavigator();

function HomeScreen (){
  const navigation = useNavigation();
    return (
    <SafeAreaView style={styles.container}>
      <Home />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Add')}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}




export default function App() {
  return (
    <Provider store={store}>        
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              presentation: 'modal',
              headerTitle: 'Home',
              headerTintColor: SetTheme.lightTheme.headerText,
              headerStyle: { backgroundColor: SetTheme.lightTheme.headerBackground }
            }} 
            />
          <Stack.Screen 
            name="Add" 
            component={AddTodo} 
            options={{
              presentation: 'modal',
              headerTitle: 'Task',
              headerTintColor: SetTheme.lightTheme.headerText,
              headerStyle: { backgroundColor: SetTheme.lightTheme.headerBackground }
            }} 
            />
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SetTheme.lightTheme.containerBackground,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: SetTheme.lightTheme.buttonBackground,
    position: 'absolute',
    bottom: 25,
    right: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .5,
    shadowRadius: 5,
    elevation: 5,
},
plus: {
    fontSize: 40,
    color: SetTheme.lightTheme.buttonColor,
    position: 'absolute',
    top: -8,
    left: 10,
}
});
