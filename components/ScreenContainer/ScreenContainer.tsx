import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-magnus';

import { View } from '../View';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

type ScreenContainerProps = {
  title?: string;
  enableGoBack?: boolean;
} & PropsWithChildren;

export const ScreenContainer = ({ children, title, enableGoBack = true }: ScreenContainerProps) => {
  const { canGoBack, goBack } = useNavigation();

  const Header = () => {
    if (!title && !enableGoBack) {
      return null;
    }

    return (
      <View p="lg" flexDir="row" alignItems="center" gap={16}>
        {enableGoBack && canGoBack() && (
          <Button variant="ghost" p={0} my="auto" onPress={goBack}>
            <ChevronLeft size={32} />
          </Button>
        )}
        {title && <Text variant="title">{title}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header />
      <View p="lg" flex={1}>
        {children}
      </View>
    </SafeAreaView>
  );
};
