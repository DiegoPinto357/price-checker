import { twMerge } from 'tailwind-merge';
import { Spinner } from '@heroui/react';

type Props = {
  fullScreen?: boolean;
  opaque?: boolean;
};

const Loader = ({ opaque, fullScreen = true }: Props) => {
  const position = fullScreen ? 'fixed' : 'relative';
  const backgroundColor = opaque ? 'bg-white' : 'bg-[#00000050]';

  return (
    <div
      className={twMerge(
        'relative w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50',
        position,
        backgroundColor
      )}
    >
      <Spinner
        className="scale-150 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        size="lg"
      />
    </div>
  );
};

export default Loader;
