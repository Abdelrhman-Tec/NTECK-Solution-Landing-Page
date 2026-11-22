import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "next/server") return next("next/server.js", context);
    if (specifier === "./schema" && context.parentURL?.endsWith("/inquiry/server.ts")) {
      return next("./schema.ts", context);
    }
    return next(specifier, context);
  },
});
