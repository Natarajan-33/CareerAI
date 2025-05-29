// React and React Router DOM type declarations
import 'react';
import 'react-dom';
import 'react-router-dom';

// Global type declarations
declare global {
  interface Window {
    // Add any global window properties here if needed
  }
}

// Module declarations for any untyped libraries
declare module 'react-type-animation' {
  export const TypeAnimation: React.FC<any>;
  export default TypeAnimation;
}
