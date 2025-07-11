import * as React from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export function FocusTrap({ 
  children,
  active = true,
}: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = React.useState<HTMLElement[]>([]);

  React.useEffect(() => {
    if (!active) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const elements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    setFocusableElements(Array.from(elements));

    // Focus the first element
    if (elements.length > 0) {
      elements[0].focus();
    }

    // Trap focus inside the container
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const { activeElement } = document;
      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
