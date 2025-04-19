import { string, z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const order = createTRPCRouter({
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

export const orderRouter = createTRPCRouter({
  // Create a new order
  createOrder: publicProcedure
    .input(
      z.object({
        manufacturerId: z.number(),
        shopkeeperId: z.number(),
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            price: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.db.order.create({
        data: {
          manufacturerId: input.manufacturerId,
          shopkeeperId: input.shopkeeperId,
          date: new Date(),
          total: input.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
          status: "PENDING",
          orderItem: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              totalPrice: item.quantity * item.price,
            })),
          },
        },
      });
      return order;
    }),

  // Get all orders for a shopkeeper
  getOrdersByShopkeeper: publicProcedure
    .input(z.object({ shopkeeperId: z.number() }))
    .query(async ({ input, ctx }) => {
      const orders = await ctx.db.order.findMany({
        where: { shopkeeperId: input.shopkeeperId },
        include: {
          manufacturer: true,
          orderItem: {
            include: {
              product: true,
            },
          },
        },
      });
      return orders;
    }),

  // Get all orders for a manufacturer
  getOrdersByManufacturer: publicProcedure
    .input(z.object({ manufacturerId: z.number() }))
    .query(async ({ input, ctx }) => {
      const orders = await ctx.db.order.findMany({
        where: { manufacturerId: input.manufacturerId },
        include: {
          shopkeeper: true,
          orderItem: {
            include: {
              product: true,
            },
          },
        },
      });
      return orders;
    }),

  // Update order status
  updateOrderStatus: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "REJECTED"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });
      return order;
    }),

  // Delete an order
  deleteOrder: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.order.delete({
        where: { id: input.orderId },
      });
      return { success: true };
    }),
});
