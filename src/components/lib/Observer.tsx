import { useRef, useEffect } from 'react';

type ObserverProps = {
  onIntersection: () => void;
};

const Observer = ({ onIntersection }: ObserverProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onIntersection();
        }
      },
      { threshold: 0.001 }
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

  return <div ref={ref} />;
};

export default Observer;
