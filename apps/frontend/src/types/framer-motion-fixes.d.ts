// Framer Motion compatibility fixes for exactOptionalPropertyTypes
declare module 'framer-motion' {
  interface CSSStyleDeclarationWithTransform {
    x?: string;
    y?: string;
    z?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    scaleX?: string;
    scaleY?: string;
    scaleZ?: string;
    skewX?: string;
    skewY?: string;
    perspective?: string;
  }
}