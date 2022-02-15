import { useEffect } from "react";
import { useState } from "react";

export function usePersistedState(key: string, defaultValue?: any) {
  const fromStorage = window.localStorage.getItem(key);
  const [state, setState] = useState(
    fromStorage ? JSON.parse(fromStorage)?.value : defaultValue
  );

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify({ value: state }));
  }, [state]);

  return [state, setState];
}
