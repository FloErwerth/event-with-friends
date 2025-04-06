import { getAuth } from '@react-native-firebase/auth';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

const screenOptions = {
  tabBarStyle: { borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  headerShown: false,
} as const;

export default function TabsLayout() {
  const user = getAuth().currentUser;

  if (!user) {
    return <Redirect href="authentication" />;
  }

  return (
    <Tabs screenOptions={screenOptions} initialRouteName="index">
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
        }}
      />

      <Tabs.Screen
        name="host"
        options={{
          title: 'Host',
        }}
      />
    </Tabs>
  );
}
