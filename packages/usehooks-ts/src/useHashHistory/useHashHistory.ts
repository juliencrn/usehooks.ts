import { useState,useEffect } from 'react';

// Hook to track hash history
export function useHashHistory(): string[] {
    const [history, setHistory] = useState<string[]>([window.location.hash]);

    useEffect(() => {
      const handleHashChange = () => {
        setHistory((prevHistory) => [...prevHistory, window.location.hash]);
      };

      window.addEventListener("hashchange", handleHashChange);

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, []);

    return history;
  }
