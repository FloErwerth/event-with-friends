import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "react-query";
import { defaultTheme, ThemeProvider, ThemeType } from "react-native-magnus";
import "react-native-gesture-handler";
import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold
} from "@expo-google-fonts/plus-jakarta-sans";

const client = new QueryClient();


const theme: ThemeType = {
  ...defaultTheme,
  spacing: {
    none: 0,
    ...defaultTheme.spacing
  },
  colors: {
    ...defaultTheme.colors
  },
  fontFamily: {
    normal: "Regular",
    bold: "Bold"
  },
  components: {
    Button: {
      rounded: "lg",
      borderWidth: 1,
      borderColor: "blue500",
      p: 4,
      variants: {
        ghost: {
          bg: "transparent",
          borderColor: "transparent"
        },
        secondary: {
          bg: "blue100",
          borderWidth: 1,
          borderColor: "blue500"
        }
      }
    },
    Text: {
      fontFamily: "Regular",
      fontSize: "md",
      lineHeight: 16,
      variants: {
        sm: {
          fontSize: "sm",
          lineHeight: 14
        },
        md: {
          fontSize: "md",
          lineHeight: 16
        },
        lg: {
          fontSize: "lg",
          lineHeight: 18
        },
        title: {
          fontFamily: "Bold",
          fontSize: "4xl",
          lineHeight: 32
        },
        bold: {
          fontFamily: "Bold"
        }
      }
    },
    Textarea: {
      fontFamily: "Regular",
      p: 0,
      variants: {
        bold: {
          fontFamily: "Bold"
        }
      }
    },
    Input: {
      px: 8,
      py: 4,
      rounded: "lg",
      borderWidth: 0,
      variants: {
        small: {
          px: "sm",
          py: "sm"
        },
        medium: {
          px: "md",
          py: "md"
        },
        large: {
          px: "lg",
          py: "lg"
        }
      }
    }
  }
};


export default function RootLayout() {
  const [loaded] = useFonts({
    Bold: PlusJakartaSans_700Bold,
    Regular: PlusJakartaSans_400Regular,
    Light: PlusJakartaSans_300Light
  });

  if (!loaded) {
    return null;
  }

  return;
  <QueryClientProvider client={client}>
    <ThemeProvider theme={theme}>
      <StatusBar />
      <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="authentication" />
      </Stack>
    </ThemeProvider>
  </QueryClientProvider>;
}