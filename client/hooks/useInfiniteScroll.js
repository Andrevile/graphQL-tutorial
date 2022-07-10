import { useCallback, useEffect, useState, useRef } from "react";

const useInfiniteScroll = (targelEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, [observerRef.current]);
  useEffect(() => {
    if (targelEl.current) getObserver().observe(targelEl.current);
    return () => {
      getObserver().disconnect();
    };
  }, [targelEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
