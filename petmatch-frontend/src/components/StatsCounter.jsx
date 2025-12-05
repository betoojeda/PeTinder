import React, { useState, useEffect, useRef } from 'react';

const StatsCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const endValue = parseInt(end, 10);
          if (start === endValue) return;

          const incrementTime = (duration / endValue);
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === endValue) {
              clearInterval(timer);
            }
          }, incrementTime);

          // Detener el observer una vez que la animación ha comenzado
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // La animación empieza cuando el 50% del elemento es visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export default StatsCounter;
