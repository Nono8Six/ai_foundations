export default ErrorBoundary;
declare class ErrorBoundary extends React.Component<any, any, any> {
    static contextType: React.Context<import("../context/ErrorContext").ErrorLogger>;
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    constructor(props: any);
    state: {
        hasError: boolean;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    render(): any;
}
import React from 'react';
