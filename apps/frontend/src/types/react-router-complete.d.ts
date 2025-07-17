/**
 * Comprehensive React Router compatibility fixes for exactOptionalPropertyTypes
 * Based on React Router v6.26.2 official documentation and type definitions
 */

// Fix @remix-run/router exports that are missing or incompatible
declare module '@remix-run/router' {
  // Basic types that should be exported
  export interface ActionFunction {
    (args: ActionFunctionArgs): Promise<Response> | Response | Promise<any> | any;
  }

  export interface ActionFunctionArgs {
    request: Request;
    params: Params;
    context?: any;
  }

  export interface LoaderFunction {
    (args: LoaderFunctionArgs): Promise<Response> | Response | Promise<any> | any;
  }

  export interface LoaderFunctionArgs {
    request: Request;
    params: Params;
    context?: any;
  }

  export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
  };

  export interface Location<State = any> {
    pathname: string;
    search: string;
    hash: string;
    state: State;
    key: string;
  }

  export interface Router {
    state: RouterState;
    subscribe(fn: RouterSubscriber): () => void;
    navigate(to: To | number, opts?: RouterNavigateOptions): Promise<void>;
    fetch(key: string, routeId: string, href: string, opts?: RouterFetchOptions): Promise<void>;
    revalidate(): Promise<void>;
    createHref(location: Location | To): string;
    encodeLocation?(to: To): Path;
    getFetcher<TData = any>(key?: string): Fetcher<TData>;
    deleteFetcher(key?: string): void;
    dispose(): void;
    getBlocker(key: string, fn: BlockerFunction): Blocker;
    deleteBlocker(key: string): void;
    _internalFetchControllers: Map<string, AbortController>;
    _internalActiveDeferreds: Map<string, DeferredData>;
    _internalSetRoutes(routes: AgnosticRouteObject[]): void;
  }

  export interface RouterState {
    historyAction: Action;
    location: Location;
    matches: AgnosticDataRouteMatch[];
    initialized: boolean;
    navigation: Navigation;
    restoreScrollPosition: boolean | null;
    preventScrollReset: boolean;
    revalidation: RevalidationState;
    loaderData: RouteData;
    actionData: RouteData | null;
    errors: RouteData | null;
    fetchers: Map<string, Fetcher>;
    blockers: Map<string, Blocker>;
  }

  export type To = string | Partial<Path>;

  export interface Path {
    pathname: string;
    search: string;
    hash: string;
  }

  export interface NavigateOptions {
    replace?: boolean;
    state?: any;
    preventScrollReset?: boolean;
    relative?: RelativeRoutingType;
    flushSync?: boolean;
  }

  export type RelativeRoutingType = "route" | "path";

  export interface Fetcher<TData = any> {
    state: "idle" | "loading" | "submitting";
    formMethod?: FormMethod;
    formAction?: string;
    formEncType?: FormEncType;
    formData?: FormData;
    data?: TData;
  }

  export type FormMethod = "get" | "post" | "put" | "patch" | "delete";
  export type FormEncType = "application/x-www-form-urlencoded" | "multipart/form-data";

  export interface BlockerFunction {
    (args: { currentLocation: Location; nextLocation: Location }): boolean;
  }

  export interface Blocker {
    state: "unblocked" | "blocked" | "proceeding";
    reset(): void;
    proceed(): void;
    location?: Location;
  }

  export interface Navigation {
    state: "idle" | "loading" | "submitting";
    location?: Location;
    formMethod?: FormMethod;
    formAction?: string;
    formEncType?: FormEncType;
    formData?: FormData;
  }

  export type RevalidationState = "idle" | "loading";

  export interface RouteData {
    [routeId: string]: any;
  }

  export interface AgnosticRouteObject {
    caseSensitive?: false;
    path?: string;
    id?: string;
    loader?: LoaderFunction;
    action?: ActionFunction;
    hasErrorBoundary?: boolean;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
    index?: boolean;
    children?: AgnosticRouteObject[];
  }

  export interface AgnosticIndexRouteObject extends AgnosticRouteObject {
    caseSensitive?: false;
    children?: never;
    index: true;
  }

  export interface AgnosticNonIndexRouteObject extends AgnosticRouteObject {
    caseSensitive?: false;
    children?: AgnosticRouteObject[];
    index?: false;
  }

  export interface AgnosticDataRouteMatch extends AgnosticRouteMatch {
    route: AgnosticDataRouteObject;
  }

  export interface AgnosticRouteMatch<
    ParamKey extends string = string,
    RouteObjectType extends AgnosticRouteObject = AgnosticRouteObject
  > {
    params: Params<ParamKey>;
    pathname: string;
    pathnameBase: string;
    route: RouteObjectType;
  }

  export interface AgnosticDataRouteObject extends AgnosticRouteObject {
    hasErrorBoundary: boolean;
    id: string;
  }

  export interface ShouldRevalidateFunction {
    (args: ShouldRevalidateFunctionArgs): boolean;
  }

  export interface ShouldRevalidateFunctionArgs {
    currentUrl: URL;
    currentParams: Params;
    nextUrl: URL;
    nextParams: Params;
    formMethod?: FormMethod;
    formAction?: string;
    formEncType?: FormEncType;
    formData?: FormData;
    actionResult?: any;
    defaultShouldRevalidate: boolean;
  }

  export interface HydrationState {
    loaderData?: RouteData;
    actionData?: RouteData | null;
    errors?: RouteData | null;
  }

  export type Action = "POP" | "PUSH" | "REPLACE";

  export interface History {
    readonly action: Action;
    readonly location: Location;
    createHref(to: To): string;
    createURL(to: To): URL;
    encodeLocation?(to: To): Path;
    push(to: To, state?: any): void;
    replace(to: To, state?: any): void;
    go(delta: number): void;
    back(): void;
    forward(): void;
    listen(listener: Listener): () => void;
    block(blocker: Blocker): () => void;
  }

  export interface Listener {
    (update: Update): void;
  }

  export interface Update {
    action: Action;
    location: Location;
    delta: number | null;
  }

  export type HTMLFormMethod = "get" | "post";
  export type V7_FormMethod = FormMethod;

  export interface ErrorResponse {
    status: number;
    statusText: string;
    data: any;
  }

  export interface FutureConfig {
    v7_fetcherPersist: boolean;
    v7_normalizeFormMethod: boolean;
    v7_partialHydration: boolean;
    v7_prependBasename: boolean;
    v7_relativeSplatPath: boolean;
    v7_skipActionErrorRevalidation: boolean;
  }

  export interface GetScrollRestorationKeyFunction {
    (location: Location, matches: AgnosticRouteMatch[]): string | null;
  }

  export class UNSAFE_ErrorResponseImpl implements ErrorResponse {
    status: number;
    statusText: string;
    data: any;
    error?: Error;
    internal: boolean;

    constructor(
      status: number,
      statusText?: string,
      data?: any,
      internal?: boolean
    );
  }

  export interface UIMatch<Data = unknown, Handle = unknown> {
    id: string;
    pathname: string;
    params: Params;
    data: Data;
    handle: Handle;
  }

  export interface TrackedPromise extends Promise<any> {
    _tracked?: boolean;
    _data?: any;
    _error?: any;
  }

  export interface DeferredData {
    data: Record<string, unknown>;
    subscribe(fn: (aborted: boolean, settledKey?: string) => void): () => void;
    cancel(): void;
    resolveData(signal: AbortSignal): Promise<boolean>;
  }

  export type RouterSubscriber = (state: RouterState) => void;

  export interface RouterNavigateOptions extends NavigateOptions {
    fromRouteId?: string;
  }

  export interface RouterFetchOptions {
    formMethod?: FormMethod;
    formAction?: string;
    formEncType?: FormEncType;
    formData?: FormData;
    body?: any;
  }

  export interface StaticHandlerContext {
    basename: string;
    location: Partial<Location> | string;
    matches: StaticHandlerMatch[];
    loaderData: RouteData;
    actionData: RouteData | null;
    errors: RouteData | null;
    statusCode: number;
    loaderHeaders: Record<string, Headers>;
    actionHeaders: Record<string, Headers>;
    activeDeferreds: Record<string, DeferredData> | null;
    _deepestRenderedBoundaryId?: string | null;
  }

  export interface StaticHandlerMatch extends AgnosticRouteMatch<string, AgnosticDataRouteObject> {
    route: AgnosticDataRouteObject;
  }

  // Export utilities
  export function createPath(partialPath: Partial<Path>): string;
  export function parsePath(path: string): Path;
  export function resolvePath(to: To, fromPathname?: string): Path;
  export function generatePath<ParamKey extends string = string>(
    originalPath: string,
    params: { [key in ParamKey]: string | number } = {} as any
  ): string;
  export function matchPath<
    ParamKey extends string = string,
    Path extends string = string
  >(
    pattern: PathPattern<Path> | Path,
    pathname: string
  ): PathMatch<ParamKey> | null;

  export interface PathPattern<Path extends string = string> {
    path: Path;
    caseSensitive?: false;
    end?: boolean;
  }

  export interface PathMatch<ParamKey extends string = string> {
    params: Params<ParamKey>;
    pathname: string;
    pathnameBase: string;
    pattern: PathPattern;
  }

  export function matchRoutes(
    routes: AgnosticRouteObject[],
    location: Partial<Location> | string,
    basename?: string
  ): AgnosticRouteMatch[] | null;

  export function redirect(url: string, init?: number | ResponseInit): Response;
  export function redirectDocument(url: string, init?: number | ResponseInit): Response;
  export function replace(url: string, init?: number | ResponseInit): Response;
  export function json(data: any, init?: number | ResponseInit): Response;
  export function defer(data: Record<string, unknown>, init?: number | ResponseInit): Response;
  export function isRouteErrorResponse(error: any): error is ErrorResponse;

  // AbortedDeferredError class
  export class AbortedDeferredError extends Error {
    constructor(message?: string);
  }
}

// Fix react-router exports that depend on @remix-run/router
declare module 'react-router' {
  import type {
    ActionFunction,
    ActionFunctionArgs,
    LoaderFunction,
    LoaderFunctionArgs,
    Router,
    Location,
    NavigateOptions,
    RelativeRoutingType,
    Params,
    Path,
    PathMatch,
    PathPattern,
    To,
    Fetcher,
    Blocker,
    BlockerFunction,
    Navigation,
    UIMatch,
    HydrationState,
    ErrorResponse,
    FutureConfig,
    AgnosticRouteObject,
    AgnosticIndexRouteObject,
    AgnosticNonIndexRouteObject,
    ShouldRevalidateFunction,
    ShouldRevalidateFunctionArgs,
    TrackedPromise,
    Action,
    UNSAFE_ErrorResponseImpl,
    AbortedDeferredError
  } from '@remix-run/router';

  // Re-export everything that react-router-dom needs
  export type {
    ActionFunction,
    ActionFunctionArgs,
    LoaderFunction,
    LoaderFunctionArgs,
    Location,
    NavigateOptions,
    RelativeRoutingType,
    Params,
    Path,
    PathMatch,
    PathPattern,
    To,
    Fetcher,
    Blocker,
    BlockerFunction,
    Navigation,
    UIMatch,
    HydrationState,
    ErrorResponse,
    FutureConfig,
    ShouldRevalidateFunction,
    ShouldRevalidateFunctionArgs,
    Action as NavigationType,
    UNSAFE_ErrorResponseImpl,
    AbortedDeferredError
  };

  // Route objects with exactOptionalPropertyTypes fixes
  export interface RouteObject {
    caseSensitive?: false;
    children?: RouteObject[];
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    index?: boolean;
    path?: string;
    loader?: LoaderFunction;
    action?: ActionFunction;
    id?: string;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
    Component?: React.ComponentType<any> | null;
    lazy?: LazyRouteFunction<RouteObject>;
    ErrorBoundary?: React.ComponentType<any> | null;
    HydrateFallback?: React.ComponentType<any> | null;
  }

  export interface IndexRouteObject {
    caseSensitive?: false;
    children?: never;
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    index: true;
    path?: never;
    loader?: LoaderFunction;
    action?: ActionFunction;
    id?: string;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
    Component?: React.ComponentType<any> | null;
    lazy?: LazyRouteFunction<RouteObject>;
    ErrorBoundary?: React.ComponentType<any> | null;
    HydrateFallback?: React.ComponentType<any> | null;
  }

  export interface NonIndexRouteObject {
    caseSensitive?: false;
    children?: RouteObject[];
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    index?: false;
    path?: string;
    loader?: LoaderFunction;
    action?: ActionFunction;
    id?: string;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
    Component?: React.ComponentType<any> | null;
    lazy?: LazyRouteFunction<RouteObject>;
    ErrorBoundary?: React.ComponentType<any> | null;
    HydrateFallback?: React.ComponentType<any> | null;
  }

  export interface LazyRouteFunction<R extends RouteObject> {
    (): Promise<LazyRouteModule<R>>;
  }

  export interface LazyRouteModule<R extends RouteObject> {
    Component?: R['Component'];
    ErrorBoundary?: R['ErrorBoundary'];
    HydrateFallback?: R['HydrateFallback'];
    element?: R['element'];
    errorElement?: R['errorElement'];
    loader?: R['loader'];
    action?: R['action'];
    shouldRevalidate?: R['shouldRevalidate'];
    handle?: R['handle'];
  }

  // Data route types
  export interface DataRouteMatch extends AgnosticDataRouteMatch {
    route: DataRouteObject;
  }

  export interface DataRouteObject extends RouteObject {
    children?: DataRouteObject[];
    id: string;
  }

  // Component prop types
  export interface MemoryRouterProps {
    basename?: string;
    children?: React.ReactNode;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
    future?: Partial<FutureConfig>;
  }

  export type InitialEntry = string | Partial<Location>;

  export interface NavigateProps {
    to: To;
    replace?: boolean;
    state?: any;
    relative?: RelativeRoutingType;
  }

  export interface OutletProps {
    context?: unknown;
  }

  export interface IndexRouteProps {
    caseSensitive?: false;
    path?: never;
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    index: true;
    loader?: LoaderFunction;
    action?: ActionFunction;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
    id?: string;
    Component?: React.ComponentType<any> | null;
    lazy?: LazyRouteFunction<RouteObject>;
    ErrorBoundary?: React.ComponentType<any> | null;
    HydrateFallback?: React.ComponentType<any> | null;
  }

  export interface LayoutRouteProps extends PathRouteProps {
    children?: React.ReactNode;
  }

  export interface PathRouteProps {
    caseSensitive?: false;
    path: string;
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    index?: false;
    loader?: LoaderFunction;
    action?: ActionFunction;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
    id?: string;
    Component?: React.ComponentType<any> | null;
    lazy?: LazyRouteFunction<RouteObject>;
    ErrorBoundary?: React.ComponentType<any> | null;
    HydrateFallback?: React.ComponentType<any> | null;
  }

  export interface RouteProps {
    caseSensitive?: false;
    children?: React.ReactNode;
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    index?: boolean;
    path?: string;
  }

  export interface RouterProps {
    basename?: string;
    children?: React.ReactNode;
    location: Partial<Location> | string;
    navigationType?: NavigationType;
    navigator: Navigator;
    static?: boolean;
  }

  export interface RoutesProps {
    children?: React.ReactNode;
    location?: Partial<Location> | string;
  }

  // Navigator interface
  export interface Navigator {
    createHref: History['createHref'];
    go: History['go'];
    push(to: To, state?: any): void;
    replace(to: To, state?: any): void;
  }

  // Hook return types
  export interface NavigateFunction {
    (to: To, options?: NavigateOptions): void;
    (delta: number): void;
  }

  // Context types
  export interface RouterProviderProps {
    fallbackElement?: React.ReactNode;
    router: Router;
    future?: Partial<FutureConfig>;
  }

  // Utility types
  export type Hash = string;
  export type Pathname = string;
  export type Search = string;

  export type ParamParseKey<Segment extends string> =
    Segment extends `${infer LeftSegment}/${infer RightSegment}`
      ? ParamParseKey<LeftSegment> | ParamParseKey<RightSegment>
      : Segment extends `:${infer Param}`
      ? Param extends `${infer OptionalParam}?`
        ? OptionalParam
        : Param
      : Segment extends `*${infer RestParam}`
      ? RestParam extends ''
        ? '*'
        : RestParam
      : never;

  export type PathParam<Path extends string> = Path extends `*${infer Rest}`
    ? Rest extends ''
      ? '*'
      : Rest
    : Path extends `:${infer Param}`
    ? Param extends `${infer OptionalParam}?`
      ? OptionalParam
      : Param
    : never;

  // JSON helper
  export interface JsonFunction {
    <Data>(data: Data, init?: number | ResponseInit): Response;
  }

  export interface RedirectFunction {
    (url: string, init?: number | ResponseInit): Response;
  }

  // Await component props
  export interface AwaitProps<Resolve> {
    children: React.ReactNode | ((value: Awaited<Resolve>) => React.ReactNode);
    errorElement?: React.ReactNode;
    resolve: Resolve;
  }

  // UNSAFE context exports (re-exported from react-router-dom)
  export interface UNSAFE_DataRouterContext {
    router: Router;
  }

  export interface UNSAFE_DataRouterStateContext {
    router: Router;
    static: boolean;
  }

  export interface UNSAFE_NavigationContext {
    basename: string;
    navigator: Navigator;
    static: boolean;
  }

  export interface UNSAFE_LocationContext {
    location: Location;
    navigationType: NavigationType;
  }

  export interface UNSAFE_RouteContext {
    outlet: React.ReactElement | null;
    matches: RouteMatch[];
    isDataRoute: boolean;
  }

  export interface RouteMatch<ParamKey extends string = string, RouteObjectType extends RouteObject = RouteObject> {
    params: Params<ParamKey>;
    pathname: string;
    pathnameBase: string;
    route: RouteObjectType;
  }

  // Component and hook declarations
  export const Router: React.ComponentType<RouterProps>;
  export const Routes: React.ComponentType<RoutesProps>;
  export const Route: React.ComponentType<RouteProps>;
  export const Navigate: React.ComponentType<NavigateProps>;
  export const Outlet: React.ComponentType<OutletProps>;
  export const MemoryRouter: React.ComponentType<MemoryRouterProps>;
  export const Await: <T>(props: AwaitProps<T>) => React.ReactElement;

  // Hook declarations
  export function useHref(to: To, options?: { relative?: RelativeRoutingType }): string;
  export function useInRouterContext(): boolean;
  export function useLocation(): Location;
  export function useNavigationType(): NavigationType;
  export function useNavigate(): NavigateFunction;
  export function useOutlet(context?: unknown): React.ReactElement | null;
  export function useOutletContext<Context = unknown>(): Context;
  export function useParams<ParamsOrKey extends string | Record<string, string | undefined> = string>(): Readonly<
    [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
  >;
  export function useResolvedPath(to: To, options?: { relative?: RelativeRoutingType }): Path;
  export function useRoutes(routes: RouteObject[], locationArg?: Partial<Location> | string): React.ReactElement | null;
  export function useMatch<ParamKey extends ParamParseKey<Path>, Path extends string>(
    pattern: PathPattern<Path> | Path
  ): PathMatch<ParamKey> | null;
  export function useMatches(): UIMatch[];
  export function useNavigation(): Navigation;
  export function useRevalidator(): {
    revalidate: () => Promise<void>;
    state: "idle" | "loading";
  };
  export function useLoaderData<T = any>(): T;
  export function useRouteLoaderData<T = any>(routeId: string): T | undefined;
  export function useActionData<T = any>(): T | undefined;
  export function useRouteError(): unknown;
  export function useAsyncValue(): unknown;
  export function useAsyncError(): unknown;
  export function useBlocker(shouldBlock: boolean | BlockerFunction): Blocker;

  // Utility functions
  export const createMemoryRouter: typeof import('@remix-run/router').createMemoryRouter;
  export const createPath: typeof import('@remix-run/router').createPath;
  export const createRoutesFromChildren: (children: React.ReactNode, parentPath?: number[]) => RouteObject[];
  export const createRoutesFromElements: (children: React.ReactNode, parentPath?: number[]) => RouteObject[];
  export const generatePath: typeof import('@remix-run/router').generatePath;
  export const isRouteErrorResponse: typeof import('@remix-run/router').isRouteErrorResponse;
  export const json: JsonFunction;
  export const matchPath: typeof import('@remix-run/router').matchPath;
  export const matchRoutes: typeof import('@remix-run/router').matchRoutes;
  export const parsePath: typeof import('@remix-run/router').parsePath;
  export const redirect: RedirectFunction;
  export const redirectDocument: typeof import('@remix-run/router').redirectDocument;
  export const replace: typeof import('@remix-run/router').replace;
  export const renderMatches: (matches: RouteMatch[] | null, parentMatches?: RouteMatch[]) => React.ReactElement | null;
  export const resolvePath: typeof import('@remix-run/router').resolvePath;
  export const defer: typeof import('@remix-run/router').defer;

  // UNSAFE exports
  export const UNSAFE_DataRouterContext: React.Context<UNSAFE_DataRouterContext | null>;
  export const UNSAFE_DataRouterStateContext: React.Context<UNSAFE_DataRouterStateContext | null>;
  export const UNSAFE_NavigationContext: React.Context<UNSAFE_NavigationContext>;
  export const UNSAFE_LocationContext: React.Context<UNSAFE_LocationContext>;
  export const UNSAFE_RouteContext: React.Context<UNSAFE_RouteContext>;
  export function UNSAFE_useRouteId(): string | undefined;

  // Error class re-exports
  export { AbortedDeferredError } from '@remix-run/router';
  export { UNSAFE_ErrorResponseImpl } from '@remix-run/router';
}