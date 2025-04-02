import { Div, DivProps } from 'react-native-magnus';

export const View = (props: DivProps & { gap?: number }) => {
  return <Div {...props} />;
};
