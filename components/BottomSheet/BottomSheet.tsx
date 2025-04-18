import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View } from 'components/View';
import { Fragment, useCallback } from 'react';
import { Button, Text } from 'react-native-magnus';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { BottomSheetProps } from './types';
import { ScreenContainer } from '../ScreenContainer/ScreenContainer';

const Backdrop = ({ animatedIndex }: BottomSheetBackdropProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 0.5]),
  }));

  return <Animated.View style={animatedStyle} />;
};

export const BottomSheet = ({
  children,
  snapPoints = ['95%'],
  title,
  enablePanDownToClose = false,
  ...props
}: BottomSheetProps) => {
  const handleClose = useCallback(() => {
    props.reference?.current?.close();
  }, [props.reference?.current?.close]);

  const panDownToClose = !enablePanDownToClose ? { handleComponent: null } : {};

  const Header = () => {
    if (enablePanDownToClose) {
      return (
        <View p="lg" pt="xl">
          <Text fontSize="xl" fontFamily="Bold">
            {title}
          </Text>
        </View>
      );
    }
    return (
      <>
        <View flexDir="row" justifyContent="space-between" p="lg" pt="xl">
          <Text fontSize="xl" fontFamily="Bold">
            {title}
          </Text>
          {!enablePanDownToClose && (
            <Button p="sm" bg="transparent" onPress={handleClose}>
              <Text>Schließen</Text>
            </Button>
          )}
        </View>
      </>
    );
  };

  return (
    <BottomSheetModal
      ref={props.reference}
      snapPoints={!props.enableDynamicSizing ? snapPoints : undefined}
      enablePanDownToClose={enablePanDownToClose}
      {...props}
      {...panDownToClose}
      backdropComponent={Backdrop}>
      <BottomSheetView style={{ flex: 1 }}>
        <Header />
        <ScreenContainer enableGoBack={false}>
          {children}
          {props.enableDynamicSizing && <View h={30} />}
        </ScreenContainer>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
