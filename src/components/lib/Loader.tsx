import { Spinner } from '@nextui-org/react';

const Loader = ({ opaque }: { opaque?: boolean }) => {
  const classes = opaque ? 'bg-white' : 'bg-[#00000050]';

  return (
    <div
      className={`fixed w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${classes}`}
    >
      <Spinner
        className="scale-150 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        size="lg"
      />
    </div>
  );
};

export default Loader;
