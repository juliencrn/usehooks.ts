import { useState,useEffect } from 'react';


export function useHash() {
    const [hash, setHash] = useState<string>("");

    useEffect(() => {
      const handleHashChange = () => {
        setHash(window.location.hash.slice(1));
      };
      handleHashChange();

      window.addEventListener("hashchange", handleHashChange);

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, []);

    return hash;
  }
