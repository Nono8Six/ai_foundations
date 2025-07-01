import type React from 'react';

export type Polymorphic<C extends React.ElementType, Props = {}> = Props &
  Omit<React.ComponentPropsWithRef<C>, keyof Props | 'as'> & { as?: C };
