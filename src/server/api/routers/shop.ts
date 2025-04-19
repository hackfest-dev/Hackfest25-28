import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../trpc";

export const shopRouter = createTRPCRouter({
  // Shopkeeper CRUD
  createShopkeeper: publicProcedure
    .input(
      z.object({
        name: z.string(),
        categories: z.string().array(),
        rating: z.number(),
        deliveryTime: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const shopkeeper = await ctx.db.shopkeeper.create({
        data: {
          name: input.name,
          categories: input.categories,
          rating: input.rating,
          deliveryTime: input.deliveryTime,
        },
      });
      return shopkeeper;
    }),
  getShopkeeper: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const shopkeeper = await ctx.db.shopkeeper.findUnique({
        where: { id: input.id },
        include: {
          orders: true,
          shopItem: true,
          billing: true,
        },
      });
      return shopkeeper;
    }),
  updateShopkeeper: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        categories: z.string().array().optional(),
        rating: z.number().optional(),
        deliveryTime: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const shopkeeper = await ctx.db.shopkeeper.update({
        where: { id: input.id },
        data: {
          name: input.name,
          categories: input.categories,
          rating: input.rating,
          deliveryTime: input.deliveryTime,
        },
      });
      return shopkeeper;
    }),
  deleteShopkeeper: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.shopkeeper.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // ShopItem CRUD
  createShopItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
      brand: z.string(),
        shopkeeperId: z.number(),
        price: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inventory = await ctx.db.inventory.create({
        data:{
          quantity: 0,
        }
      });
      
      const shopItem = await ctx.db.shopItem.create({
        data: {
          name: input.name,
          brand: input.brand,
          shopkeeperId: input.shopkeeperId,
          price: input.price,
          inventoryId: inventory.id,
        },
      });
      return shopItem;
    }),
  getShopItems: publicProcedure
    .input(z.object({ shopkeeperid: z.number() }))
    .query(async ({ input, ctx }) => {
      const shopItems = await ctx.db.shopItem.findMany({
        where: { shopkeeperId: input.shopkeeperid },
        include:{
          shopkeeper: true,
          inventory: true,
          billItem: true,
        }
      });
      return shopItems;
    }),
  // updateShopItem: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.number(),
  //       shopkeeperId: z.number().optional(),
  //       inventoryId: z.number().optional(),
  //       price: z.number().optional(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const shopItem = await ctx.db.shopItem.update({
  //       where: { id: input.id },
  //       data: {
  //         shopkeeperId: input.shopkeeperId,
  //         inventoryId: input.inventoryId,
  //         price: input.price,
  //       },
  //     });
  //     return shopItem;
  //   }),
  deleteShopItem: publicProcedure
    .input(z.object({ shopItemid: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.shopItem.delete({
        where: { id: input.shopItemid },
      });
      return { success: true };
    }),

  // Inventory CRUD
  createInventory: publicProcedure
    .input(
      z.object({
        skuId: z.number().optional(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inventory = await ctx.db.inventory.create({
        data: {
          skuId: input.skuId,
          quantity: input.quantity,
        },
      });
      return inventory;
    }),
  getInventory: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const inventory = await ctx.db.inventory.findUnique({
        where: { id: input.id },
        include: {
          product: true,
          shopItem: true,
          inventoryBatches: true,
        },
      });
      return inventory;
    }),
  updateInventory: publicProcedure
    .input(
      z.object({
        id: z.number(),
        skuId: z.number().optional(),
        quantity: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inventory = await ctx.db.inventory.update({
        where: { id: input.id },
        data: {
          skuId: input.skuId,
          quantity: input.quantity,
        },
      });
      return inventory;
    }),
  deleteInventory: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.inventory.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // InventoryBatch CRUD
  createInventoryBatch: publicProcedure
    .input(
      z.object({
        inventoryId: z.number(),
        batchId: z.number().optional(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inventoryBatch = await ctx.db.inventoryBatch.create({
        data: {
          inventoryId: input.inventoryId,
          batchId: input.batchId,
          quantity: input.quantity,
        },
      });
      return inventoryBatch;
    }),
  getInventoryBatch: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const inventoryBatch = await ctx.db.inventoryBatch.findUnique({
        where: { id: input.id },
        include: {
          inventory: true,
          batch: true,
        },
      });
      return inventoryBatch;
    }),
  updateInventoryBatch: publicProcedure
    .input(
      z.object({
        id: z.number(),
        inventoryId: z.number().optional(),
        batchId: z.number().optional(),
        quantity: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const inventoryBatch = await ctx.db.inventoryBatch.update({
        where: { id: input.id },
        data: {
          inventoryId: input.inventoryId,
          batchId: input.batchId,
          quantity: input.quantity,
        },
      });
      return inventoryBatch;
    }),
  deleteInventoryBatch: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.inventoryBatch.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // Billing CRUD
  createBilling: publicProcedure
    .input(
      z.object({
        shopkeeperId: z.number(),
        amount: z.number(),
        paymentMethod: z.string(),
        invoice: z.string().optional(),
        invoiceDate: z.date(),
        customerId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const billing = await ctx.db.billing.create({
        data: {
          shopkeeperId: input.shopkeeperId,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          invoice: input.invoice,
          invoiceDate: input.invoiceDate,
          customerId: input.customerId,
        },
      });
      return billing;
    }),
  getBilling: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const billing = await ctx.db.billing.findUnique({
        where: { id: input.id },
        include: {
          shopkeeper: true,
          billItem: true,
          customer: true,
        },
      });
      return billing;
    }),
  updateBilling: publicProcedure
    .input(
      z.object({
        id: z.number(),
        shopkeeperId: z.number().optional(),
        amount: z.number().optional(),
        paymentMethod: z.string().optional(),
        invoice: z.string().optional(),
        invoiceDate: z.date().optional(),
        customerId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const billing = await ctx.db.billing.update({
        where: { id: input.id },
        data: {
          shopkeeperId: input.shopkeeperId,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          invoice: input.invoice,
          invoiceDate: input.invoiceDate,
          customerId: input.customerId,
        },
      });
      return billing;
    }),
  deleteBilling: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.billing.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // BillItem CRUD
  createBillItem: publicProcedure
    .input(
      z.object({
        billingId: z.number(),
        shopitemId: z.number(),
        quantity: z.number(),
        price: z.number(),
        totalPrice: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const billItem = await ctx.db.billItem.create({
        data: {
          billingId: input.billingId,
          shopitemId: input.shopitemId,
          quantity: input.quantity,
          price: input.price,
          totalPrice: input.totalPrice,
        },
      });
      return billItem;
    }),
  getBillItem: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const billItem = await ctx.db.billItem.findUnique({
        where: { id: input.id },
        include: {
          billing: true,
          shopitem: true,
        },
      });
      return billItem;
    }),
  updateBillItem: publicProcedure
    .input(
      z.object({
        id: z.number(),
        billingId: z.number().optional(),
        shopitemId: z.number().optional(),
        quantity: z.number().optional(),
        price: z.number().optional(),
        totalPrice: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const billItem = await ctx.db.billItem.update({
        where: { id: input.id },
        data: {
          billingId: input.billingId,
          shopitemId: input.shopitemId,
          quantity: input.quantity,
          price: input.price,
          totalPrice: input.totalPrice,
        },
      });
      return billItem;
    }),
    deleteBillItem: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.billItem.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

});
