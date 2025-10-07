export interface RuntimeRoute {
  path: string;
  methods: Record<string, boolean>;
  stack: Layer[];
}

export interface Layer {
  handle: {
    caseSensitive?: boolean | undefined;
    mergeParams?: boolean | undefined;
    params?: Record<string, any>;
    strict?: boolean | undefined;
    stack: Layer[];
  };
  keys: string[];
  name: string | "<anonymous>";
  params?: Record<string, any>;
  path?: string;
  slash: boolean;
  matchers: Function[];
  route: RuntimeRoute | undefined;
}

interface ExpressRouterInternal {
  stack: Layer[];
}

export interface ExpressAppInternal {
  router: ExpressRouterInternal;
}
