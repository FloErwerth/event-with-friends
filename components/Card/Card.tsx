import { ComponentProps } from 'react';

import { View } from '../View';

type CardProps = ComponentProps<typeof View>;

export const Card = ({ children, ...props }: CardProps) => {
  return (
    <View p="sm" bg="white" shadow="xs" rounded="xl" {...props}>
      {children}
    </View>
  );
};
