import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
// import { manufacturerRouter } from "~/server/api/routers/manufacturer";
// import { myProductRouter } from "~/server/api/routers/myProduct";
// import { middleMenRouter } from "~/server/api/routers/middleMen";
import { shopRouter } from "~/server/api/routers/shop" 
export const appRouter = createTRPCRouter({
  post: postRouter,
  // manufacturer: manufacturerRouter,
  // myProduct: myProductRouter,
  // middleMen: middleMenRouter,
  shopkeeper: shopRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
