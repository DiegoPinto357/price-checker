import { useRef, useEffect } from 'react';

export type ObserverProps = {
  'data-testid'?: string;
  onIntersection: () => void;
};

const Observer = ({
  'data-testid': dataTestId,
  onIntersection,
}: ObserverProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onIntersection();
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const refMemo = ref;

    return () => {
      if (refMemo.current) {
        observer.unobserve(refMemo.current);
      }
    };
  }, [ref, onIntersection]);

  return <div ref={ref} data-testid={dataTestId} />;
};

export default Observer;
