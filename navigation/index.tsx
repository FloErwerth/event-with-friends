import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { defaultTheme, ThemeProvider, ThemeType } from 'react-native-magnus';

import { EventCreation } from '../screens/EventCreation';
import { LoginScreen } from '../screens/Login/Login';
import Overview from '../screens/Overview';

export type RootStackParamList = {
  Overview: undefined;
  CreateEvent: undefined;
  Authentication: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

const theme: ThemeType = {
  ...defaultTheme,
  spacing: {
    none: 0,
    ...defaultTheme.spacing,
  },
  colors: {
    ...defaultTheme.colors,
  },
  fontFamily: {
    normal: 'Regular',
    bold: 'Bold',
  },
  components: {
    Button: {
      rounded: 'lg',
      borderWidth: 1,
      borderColor: 'blue500',
      p: 4,
      variants: {
        ghost: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
        secondary: {
          bg: 'blue100',
          borderWidth: 1,
          borderColor: 'blue500',
        },
      },
    },
    Text: {
      fontFamily: 'Regular',
      fontSize: 'md',
      lineHeight: 16,
      variants: {
        sm: {
          fontSize: 'sm',
          lineHeight: 14,
        },
        md: {
          fontSize: 'md',
          lineHeight: 16,
        },
        lg: {
          fontSize: 'lg',
          lineHeight: 18,
        },
        title: {
          fontFamily: 'Bold',
          fontSize: '4xl',
          lineHeight: 32,
        },
        bold: {
          fontFamily: 'Bold',
        },
      },
    },
    Textarea: {
      fontFamily: 'Regular',
      p: 0,
      variants: {
        bold: {
          fontFamily: 'Bold',
        },
      },
    },
    Input: {
      px: 8,
      py: 4,
      rounded: 'lg',
      borderWidth: 0,
      variants: {
        small: {
          px: 'sm',
          py: 'sm',
        },
        medium: {
          px: 'md',
          py: 'md',
        },
        large: {
          px: 'lg',
          py: 'lg',
        },
      },
    },
  },
};

export default function RootStack() {
  const isAuthenticated = auth().currentUser !== null;

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <StatusBar />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Overview" component={Overview} />
              <Stack.Screen name="CreateEvent" component={EventCreation} />
            </>
          ) : (
            <Stack.Screen name="Authentication" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
}
