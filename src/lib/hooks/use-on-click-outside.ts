// useOnClickOutside.ts
import { RefObject, useEffect } from 'react'

/**
 * Hook that triggers a callback when a click or keypress happens outside of the ref element.
 *
 * @param {RefObject<HTMLElement>} ref - The ref of the element to detect outside clicks or keypresses for.
 * @param {() => void} callback - The callback to run when an outside click or keypress is detected.
 */
function useOnClickOutside(ref: RefObject<HTMLElement>, callback: () => void): void {
  useEffect(() => {
    // Function to check if the click is outside the ref element
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    // Function to check for specific keypresses (e.g., escape key) outside the ref element
    const handleKeyPressOutside = (event: KeyboardEvent): void => {
      // Example: Check for the Escape key
      if (event.key === 'Escape') {
        callback()
      }
    }

    // Add event listeners to the document
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyPressOutside)

    // Clean up the event listeners on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyPressOutside)
    }
  }, [ref, callback]) // Re-run if ref or callback changes
}

export default useOnClickOutside
