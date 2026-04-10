// src/components/icons/PaypalIcon.tsx
export function PaypalIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M19.5 8.5C19.5 12.5 16.5 15 12.5 15H10L10.5 8.5H15.5C18 8.5 19.5 9.5 19.5 8.5Z" 
        fill="currentColor"
      />
      <path 
        d="M7.5 3L5.5 15H9.5L8 21H12L13.5 15H17.5L19.5 3H7.5Z" 
        fill="currentColor"
      />
    </svg>
  );
}