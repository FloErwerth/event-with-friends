import { Share } from 'react-native';

export const shareEvent = async (eventId: string) =>
  await Share.share({
    title: 'Dein Event teilen',
    message: 'Teile nun dein Event mit deinen Freunden!',
    url: `https://events-with-friends-9e33b.web.app?eventId=${eventId}`,
  });
