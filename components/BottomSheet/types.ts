import { BottomSheetProps as BottomSheetPropsGorhom } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/types';
import { RefObject } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export type BottomSheetProps = {
  reference: RefObject<BottomSheetModal>;
  title?: string;
} & Omit<BottomSheetPropsGorhom, 'ref'>;
