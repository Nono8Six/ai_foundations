declare namespace _default {
    let content: string[];
    namespace theme {
        namespace extend {
            let colors: {
                primary: string;
                'primary-50': string;
                'primary-100': string;
                'primary-500': string;
                'primary-600': string;
                'primary-700': string;
                'primary-800': string;
                'primary-900': string;
                secondary: string;
                'secondary-50': string;
                'secondary-100': string;
                'secondary-200': string;
                'secondary-300': string;
                'secondary-400': string;
                'secondary-500': string;
                'secondary-600': string;
                'secondary-700': string;
                'secondary-800': string;
                'secondary-900': string;
                accent: string;
                'accent-50': string;
                'accent-100': string;
                'accent-500': string;
                'accent-600': string;
                'accent-700': string;
                background: string;
                surface: string;
                'text-primary': string;
                'text-secondary': string;
                success: string;
                'success-50': string;
                'success-100': string;
                warning: string;
                'warning-50': string;
                'warning-100': string;
                error: string;
                'error-50': string;
                'error-100': string;
                border: string;
                'border-focus': string;
            };
            namespace fontFamily {
                let sans: string[];
                let mono: string[];
            }
            let fontSize: {
                xs: (string | {
                    lineHeight: string;
                })[];
                sm: (string | {
                    lineHeight: string;
                })[];
                base: (string | {
                    lineHeight: string;
                })[];
                lg: (string | {
                    lineHeight: string;
                })[];
                xl: (string | {
                    lineHeight: string;
                })[];
                '2xl': (string | {
                    lineHeight: string;
                })[];
                '3xl': (string | {
                    lineHeight: string;
                })[];
                '4xl': (string | {
                    lineHeight: string;
                })[];
                '5xl': (string | {
                    lineHeight: string;
                })[];
                '6xl': (string | {
                    lineHeight: string;
                })[];
            };
            let spacing: {
                '18': string;
                '88': string;
                '128': string;
            };
            let boxShadow: {
                subtle: string;
                medium: string;
                'elevation-1': string;
                'elevation-2': string;
                'elevation-3': string;
            };
            namespace transitionTimingFunction {
                let spring: string;
            }
            let transitionDuration: {
                '150': string;
                '200': string;
                '250': string;
                '300': string;
            };
            let animation: {
                'fade-in': string;
                'slide-in': string;
                'bounce-subtle': string;
            };
            namespace keyframes {
                let fadeIn: {
                    '0%': {
                        opacity: string;
                    };
                    '100%': {
                        opacity: string;
                    };
                };
                let slideIn: {
                    '0%': {
                        transform: string;
                        opacity: string;
                    };
                    '100%': {
                        transform: string;
                        opacity: string;
                    };
                };
                let bounceSubtle: {
                    '0%': {
                        transform: string;
                    };
                    '50%': {
                        transform: string;
                    };
                    '100%': {
                        transform: string;
                    };
                };
            }
            let zIndex: {
                '60': string;
                '70': string;
                '80': string;
                '90': string;
                '100': string;
                header: string;
                sidebar: string;
                dropdown: string;
                overlay: string;
                modal: string;
            };
        }
    }
    let plugins: (typeof typography | typeof forms)[];
}
export default _default;
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
