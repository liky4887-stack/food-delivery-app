import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProvider } from './context/NavigationContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import RestaurantMenuScreen from './screens/RestaurantMenuScreen';
import ProductDetail from './screens/ProductDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="restaurant-menu" component={RestaurantMenuScreen} />
      <Stack.Screen name="product-detail" component={ProductDetail} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationProvider>
        <CartProvider>
          <UserProvider>
            <ToastProvider>
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                      let iconName: any;
                      if (route.name === 'Home') {
                        iconName = 'home';
                      } else if (route.name === 'Search') {
                        iconName = 'magnify';
                      } else if (route.name === 'Cart') {
                        iconName = 'cart';
                      } else if (route.name === 'Orders') {
                        iconName = 'receipt';
                      } else if (route.name === 'Profile') {
                        iconName = 'account';
                      }
                      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#FF2B2B',
                    tabBarInactiveTintColor: '#8E8E93',
                    tabBarStyle: {
                      borderTopColor: '#E5E5EA',
                      borderTopWidth: 1,
                      height: 60,
                      paddingBottom: 8,
                      paddingTop: 6,
                    },
                    tabBarLabelStyle: {
                      fontSize: 10,
                      fontWeight: '600',
                    },
                  })}
                >
                  <Tab.Screen name="Home" component={HomeStack} />
                  <Tab.Screen name="Search" component={SearchScreen} />
                  <Tab.Screen name="Cart" component={CartScreen} />
                  <Tab.Screen name="Orders" component={OrdersScreen} />
                  <Tab.Screen name="Profile" component={ProfileScreen} />
                </Tab.Navigator>
              </NavigationContainer>
            </UserProvider>
          </CartProvider>
        </NavigationProvider>
      </SafeAreaProvider>
  );
}

export default App;
