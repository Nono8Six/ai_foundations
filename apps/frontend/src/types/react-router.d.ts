type NotUndefined<T> = T extends undefined ? never : T;

declare module 'react-router-dom' {
  interface RouteObject {
    caseSensitive?: NotUndefined<boolean>;
  }
}

declare module 'react-router' {
  interface AgnosticBaseRouteObject {
    caseSensitive?: NotUndefined<boolean>;
  }
  
  interface AgnosticIndexRouteObject {
    caseSensitive?: NotUndefined<boolean>;
  }
  
  interface AgnosticNonIndexRouteObject {
    caseSensitive?: NotUndefined<boolean>;
  }
}