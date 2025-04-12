import { EventCreationSheet } from './EventCreationSheet';
import { EventShareSheet } from './EventShareSheet';
import { useBottomSheetControls } from '../../components/BottomSheet';

export const EventCreation = () => {
  const {
    bottomSheetRef: shareRef,
    openSheet: openShare,
    closeSheet: closeShare,
  } = useBottomSheetControls();

  return (
    <>
      <EventCreationSheet openShare={openShare} />
      <EventShareSheet reference={shareRef} />
    </>
  );
};
