import { Layer, RuntimeRoute } from "./types";

export function isRouteLayer(
  layer: Layer
): layer is Layer & { route: RuntimeRoute } {
  return (
    typeof layer.route === "object" &&
    layer.route !== null &&
    typeof layer.route.path === "string" &&
    typeof layer.route.methods === "object"
  );
}

export function isRouterLayer(
  layer: Layer
): layer is Layer & { handle: { stack: Layer[] } } {
  if (!layer || !Array.isArray(layer.handle.stack)) {
    return false;
  }

  return layer.handle.stack.every((subLayer): subLayer is Layer => {
    return (
      typeof subLayer === "object" &&
      subLayer !== null &&
      typeof subLayer.name === "string" &&
      Array.isArray(subLayer.keys) &&
      "handle" in subLayer &&
      "route" in subLayer
    );
  });
}
