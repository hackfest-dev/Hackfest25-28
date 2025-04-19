import { string, z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const manufacturerRouter = createTRPCRouter({
    addSku: publicProcedure
    .input(
        z.object({
            skuId: z.string(),
            prodName: z.string(),
category: z.string(),
            price: z.number(),
            maid: z.number(),
            minorder: z.number(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const { skuId, prodName , maid, minorder, category, price } = input;

        const sku = await ctx.db.myProduct.create({
            data: {
                skuId: Number(skuId),
                name: prodName,
                category,
                minOrder: minorder,
                price: Number(price),
                manufacturerId: maid,
            },
        });

        return sku;
    })
});
