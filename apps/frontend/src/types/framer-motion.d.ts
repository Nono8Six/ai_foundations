// Type augmentation pour framer-motion v12.23.6
declare module 'framer-motion' {
  export * from 'framer-motion/dist/index';
  
  import type { ComponentType, ReactNode, CSSProperties } from 'react';
  
  // Motion component types
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    layout?: boolean | 'position' | 'size';
    layoutId?: string;
    drag?: boolean | 'x' | 'y';
    dragConstraints?: any;
    dragElastic?: number | boolean;
    dragMomentum?: boolean;
    dragTransition?: any;
    whileHover?: any;
    whileTap?: any;
    whileDrag?: any;
    whileFocus?: any;
    whileInView?: any;
    viewport?: any;
    onAnimationStart?: () => void;
    onAnimationComplete?: () => void;
    onLayoutAnimationStart?: () => void;
    onLayoutAnimationComplete?: () => void;
    onDrag?: (event: any, info: any) => void;
    onDragStart?: (event: any, info: any) => void;
    onDragEnd?: (event: any, info: any) => void;
    onHoverStart?: (event: any) => void;
    onHoverEnd?: (event: any) => void;
    onTap?: (event: any) => void;
    onTapStart?: (event: any) => void;
    onTapCancel?: (event: any) => void;
    onPan?: (event: any, info: any) => void;
    onPanStart?: (event: any, info: any) => void;
    onPanEnd?: (event: any, info: any) => void;
    [key: string]: any;
  }
  
  // Motion HTML elements
  export interface MotionDivProps extends MotionProps {
    id?: string;
    ref?: any;
  }
  
  export interface Motion {
    div: ComponentType<MotionDivProps>;
    section: ComponentType<MotionProps>;
    article: ComponentType<MotionProps>;
    header: ComponentType<MotionProps>;
    footer: ComponentType<MotionProps>;
    nav: ComponentType<MotionProps>;
    main: ComponentType<MotionProps>;
    aside: ComponentType<MotionProps>;
    h1: ComponentType<MotionProps>;
    h2: ComponentType<MotionProps>;
    h3: ComponentType<MotionProps>;
    h4: ComponentType<MotionProps>;
    h5: ComponentType<MotionProps>;
    h6: ComponentType<MotionProps>;
    p: ComponentType<MotionProps>;
    span: ComponentType<MotionProps>;
    a: ComponentType<MotionProps>;
    img: ComponentType<MotionProps>;
    button: ComponentType<MotionProps>;
    input: ComponentType<MotionProps>;
    form: ComponentType<MotionProps>;
    ul: ComponentType<MotionProps>;
    ol: ComponentType<MotionProps>;
    li: ComponentType<MotionProps>;
    [key: string]: ComponentType<MotionProps>;
  }
  
  export const motion: Motion;
  
  // AnimatePresence component
  export interface AnimatePresenceProps {
    children?: ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    mode?: 'sync' | 'wait' | 'popLayout';
    onExitComplete?: () => void;
    custom?: any;
    presenceAffectsLayout?: boolean;
  }
  
  export const AnimatePresence: ComponentType<AnimatePresenceProps>;
  
  // Utility functions
  export function useAnimation(): any;
  export function useMotionValue(initial: any): any;
  export function useTransform(value: any, input: any, output: any, options?: any): any;
  export function useSpring(source: any, options?: any): any;
  export function useScroll(options?: any): any;
  export function useMotionValueEvent(value: any, event: string, handler: any): void;
  export function useInView(ref: any, options?: any): boolean;
  export function useAnimationFrame(callback: any): void;
  export function useTime(): any;
  export function useVelocity(value: any): any;
  export function useElementScroll(ref: any): any;
  export function useViewportScroll(): any;
  export function useDragControls(): any;
  export function useAnimationControls(): any;
  export function useCycle(...items: any[]): [any, () => void];
  export function useReducedMotion(): boolean;
  export function usePresence(): [boolean, () => void];
  export function useIsPresent(): boolean;
  
  // Animation utilities
  export function animate(element: any, keyframes: any, options?: any): any;
  export function animateValue(from: any, to: any, options?: any): any;
  export function scroll(onScroll: any, options?: any): any;
  export function inView(element: any, onStart?: any, options?: any): any;
  export function resize(onResize: any): any;
  
  // Easing functions
  export const easeIn: any;
  export const easeOut: any;
  export const easeInOut: any;
  export const circIn: any;
  export const circOut: any;
  export const circInOut: any;
  export const backIn: any;
  export const backOut: any;
  export const backInOut: any;
  export const anticipate: any;
  
  // Transform utilities
  export function transform(inputRange: any, outputRange: any, options?: any): any;
  export function interpolate(input: any, inputRange: any, outputRange: any, options?: any): any;
  export function mix(from: any, to: any, progress: any): any;
  export function distance(a: any, b: any): number;
  export function angle(a: any, b: any): number;
  export function wrap(min: any, max: any, value: any): any;
  export function clamp(min: any, max: any, value: any): any;
  
  // Layout utilities
  export const LayoutGroup: ComponentType<{ children?: ReactNode; id?: string }>;
  export const LazyMotion: ComponentType<{ children?: ReactNode; features: any; strict?: boolean }>;
  export const MotionConfig: ComponentType<{ children?: ReactNode; transition?: any; reducedMotion?: string }>;
  export const Reorder: {
    Group: ComponentType<any>;
    Item: ComponentType<any>;
  };
  
  // Feature flags
  export const domAnimation: any;
  export const domMax: any;
  export const m: Motion;
  
  // Legacy interfaces pour compatibility
  interface MotionStyle {
    x?: string;
    y?: string;
    z?: string;
    scale?: string;
    rotate?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    skew?: string;
    skewX?: string;
    skewY?: string;
  }
  
  interface CSSStyleDeclarationWithTransform {
    x?: string;
    y?: string;
    z?: string;
    scale?: string;
    rotate?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    skew?: string;
    skewX?: string;
    skewY?: string;
  }
}