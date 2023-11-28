import { Spinner } from '@nextui-org/react';

const Loader = () => (
  <div className="fixed w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#00000050]">
    <Spinner
      className="scale-150 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      size="lg"
    />
  </div>
);

export default Loader;
