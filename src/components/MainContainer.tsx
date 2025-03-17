import { PropsWithChildren } from 'react';

const MainContainer = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col justify-between h-full">{children}</div>
);

export default MainContainer;
