// React Router compatibility fixes for exactOptionalPropertyTypes
declare module '@remix-run/router' {
  interface AgnosticBaseRouteObject {
    caseSensitive?: false;
  }
  
  interface AgnosticIndexRouteObject {
    caseSensitive?: false;
  }
  
  interface AgnosticNonIndexRouteObject {
    caseSensitive?: false;
  }
}

declare module 'react-router' {
  interface IndexRouteObject {
    caseSensitive?: false;
  }
  
  interface NonIndexRouteObject {
    caseSensitive?: false;
  }
}