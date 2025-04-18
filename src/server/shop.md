# Shop Router API Documentation

This document describes the tRPC API endpoints available in the `shopRouter`.

## 1. Shopkeeper Procedures

*   **createShopkeeper**:
    *   Path: `shop.createShopkeeper`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "name": string,
          "categories": string[],
          "rating": number,
          "deliveryTime": string
        }
        ```
    *   Output: `Shopkeeper` object
    *   Description: Creates a new shopkeeper.
*   **getShopkeeper**:
    *   Path: `shop.getShopkeeper`
    *   Type: Query
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `Shopkeeper` object
    *   Description: Retrieves a shopkeeper by ID.
*   **updateShopkeeper**:
    *   Path: `shop.updateShopkeeper`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number,
          "name"?: string,
          "categories"?: string[],
          "rating"?: number,
          "deliveryTime"?: string
        }
        ```
    *   Output: `Shopkeeper` object
    *   Description: Updates an existing shopkeeper.
*   **deleteShopkeeper**:
    *   Path: `shop.deleteShopkeeper`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `{ success: true }`
    *   Description: Deletes a shopkeeper.

## 2. ShopItem Procedures

*   **createShopItem**:
    *   Path: `shop.createShopItem`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "shopkeeperId": number,
          "inventoryId": number,
          "price": number
        }
        ```
    *   Output: `ShopItem` object
    *   Description: Creates a new shop item.
*   **getShopItem**:
    *   Path: `shop.getShopItem`
    *   Type: Query
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `ShopItem` object
    *   Description: Retrieves a shop item by ID.
*   **updateShopItem**:
    *   Path: `shop.updateShopItem`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number,
          "shopkeeperId"?: number,
          "inventoryId"?: number,
          "price"?: number
        }
        ```
    *   Output: `ShopItem` object
    *   Description: Updates an existing shop item.
*   **deleteShopItem**:
    *   Path: `shop.deleteShopItem`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `{ success: true }`
    *   Description: Deletes a shop item.

## 3. Inventory Procedures

*   **createInventory**:
    *   Path: `shop.createInventory`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "skuId"?: number,
          "quantity": number
        }
        ```
    *   Output: `Inventory` object
    *   Description: Creates a new inventory item.
*   **getInventory**:
    *   Path: `shop.getInventory`
    *   Type: Query
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `Inventory` object
    *   Description: Retrieves an inventory item by ID.
*   **updateInventory**:
    *   Path: `shop.updateInventory`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number,
          "skuId"?: number,
          "quantity"?: number
        }
        ```
    *   Output: `Inventory` object
    *   Description: Updates an existing inventory item.
*   **deleteInventory**:
    *   Path: `shop.deleteInventory`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `{ success: true }`
    *   Description: Deletes an inventory item.

## 4. InventoryBatch Procedures

*   **createInventoryBatch**:
    *   Path: `shop.createInventoryBatch`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "inventoryId": number,
          "batchId"?: number,
          "quantity": number
        }
        ```
    *   Output: `InventoryBatch` object
    *   Description: Creates a new inventory batch.
*   **getInventoryBatch**:
    *   Path: `shop.getInventoryBatch`
    *   Type: Query
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `InventoryBatch` object
    *   Description: Retrieves an inventory batch by ID.
*   **updateInventoryBatch**:
    *   Path: `shop.updateInventoryBatch`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number,
          "inventoryId"?: number,
          "batchId"?: number,
          "quantity"?: number
        }
        ```
    *   Output: `InventoryBatch` object
    *   Description: Updates an existing inventory batch.
*   **deleteInventoryBatch**:
    *   Path: `shop.deleteInventoryBatch`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `{ success: true }`
    *   Description: Deletes an inventory batch.

## 5. Billing Procedures

*   **createBilling**:
    *   Path: `shop.createBilling`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "shopkeeperId": number,
          "amount": number,
          "paymentMethod": string,
          "invoice"?: string,
          "invoiceDate": date,
          "customerId"?: number
        }
        ```
    *   Output: `Billing` object
    *   Description: Creates a new billing record.
*   **getBilling**:
    *   Path: `shop.getBilling`
    *   Type: Query
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `Billing` object
    *   Description: Retrieves a billing record by ID.
*   **updateBilling**:
    *   Path: `shop.updateBilling`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number,
          "shopkeeperId"?: number,
          "amount"?: number,
          "paymentMethod"?: string,
          "invoice"?: string,
          "invoiceDate"?: date,
          "customerId"?: number
        }
        ```
    *   Output: `Billing` object
    *   Description: Updates an existing billing record.
*   **deleteBilling**:
    *   Path: `shop.deleteBilling`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `{ success: true }`
    *   Description: Deletes a billing record.

## 6. BillItem Procedures

*   **createBillItem**:
    *   Path: `shop.createBillItem`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "billingId": number,
          "shopitemId": number,
          "quantity": number,
          "price": number,
          "totalPrice"?: number
        }
        ```
    *   Output: `BillItem` object
    *   Description: Creates a new bill item.
*   **getBillItem**:
    *   Path: `shop.getBillItem`
    *   Type: Query
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `BillItem` object
    *   Description: Retrieves a bill item by ID.
*   **updateBillItem**:
    *   Path: `shop.updateBillItem`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number,
          "billingId"?: number,
          "shopitemId"?: number,
          "quantity"?: number,
          "price"?: number,
          "totalPrice"?: number
        }
        ```
    *   Output: `BillItem` object
    *   Description: Updates an existing bill item.
*   **deleteBillItem**:
    *   Path: `shop.deleteBillItem`
    *   Type: Mutation
    *   Input:
        ```json
        {
          "id": number
        }
        ```
    *   Output: `{ success: true }`
    *   Description: Deletes a bill item.

## Notes

*   This documentation is auto-generated and might not be entirely up-to-date. Always refer to the source code for the most accurate information.
*   Input and output types are based on the Zod schemas defined in the tRPC procedures.