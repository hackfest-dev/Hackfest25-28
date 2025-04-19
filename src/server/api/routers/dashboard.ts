import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const dashboardRouter = createTRPCRouter({
  getTheTotalRevenue: publicProcedure.query(async ({ ctx }) => {
    const totalRevenue = await ctx.db.order.aggregate({
      _sum: {
        total: true,
      },
    });

    return totalRevenue._sum.total ?? 0;
  }),

  getManufacturerTotalRevenue: publicProcedure
    .input(z.object({ manufacturerId: z.number() }))
    .query(async ({ ctx, input }) => {
      const totalRevenue = await ctx.db.order.aggregate({
        where: {
          manufacturerId: input.manufacturerId,
        },
        _sum: {
          total: true,
        },
      });

      return totalRevenue._sum.total ?? 0;
    }),
});
