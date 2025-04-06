import { useCallback, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export const useBottomSheetControls = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpen = useCallback((open: boolean) => {
    if (open) {
      bottomSheetRef.current?.present();
      return;
    }
    bottomSheetRef.current?.close();
  }, []);

  const openSheet = () => handleOpen(true);
  const closeSheet = () => handleOpen(false);

  return { handleOpen, openSheet, closeSheet, bottomSheetRef } as const;
};
