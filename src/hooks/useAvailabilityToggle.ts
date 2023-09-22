import { useState } from "react";

export function useAvailabilityToggle(initialState = true) {
  const [showAvailable, setShowAvailable] = useState(initialState);

  const toggleShowAvailable = () => {
    setShowAvailable((prev) => !prev);
  };

  return { showAvailable, toggleShowAvailable };
}
