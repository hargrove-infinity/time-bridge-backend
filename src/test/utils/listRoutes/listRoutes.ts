import type { Express } from "express";
import { ExpressAppInternal } from "./types";
import { isRouteLayer, isRouterLayer } from "./typeGuards";

export function listRoutes(app: Express) {
  const routes: { path: string; methods: string[] }[] = [];

  const internalApp = app as unknown as ExpressAppInternal;
  const router = internalApp.router;

  if (!router?.stack) return routes;

  router.stack.forEach((layer) => {
    if (layer.name === "router" && isRouterLayer(layer)) {
      layer.handle.stack.forEach((subLayer) => {
        if (isRouteLayer(subLayer)) {
          routes.push({
            path: subLayer.route.path,
            methods: Object.keys(subLayer.route.methods),
          });
        }
      });
    }
  });

  return routes;
}
