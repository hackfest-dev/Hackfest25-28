import React from "react";
import { inventory, InventoryBatch } from "@prisma/client";

interface InventoryDetailsProps {
  inventory: inventory & {
    inventoryBatches: InventoryBatch[];
    shopItem: {
      name: string;
      brand: string;
      category: string;
      price: number;
    };
  };
}

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ inventory }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inventory Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Product Name:</strong> {inventory.shopItem.name}
          </p>
          <p>
            <strong>Brand:</strong> {inventory.shopItem.brand}
          </p>
          <p>
            <strong>Category:</strong> {inventory.shopItem.category}
          </p>
          <p>
            <strong>Price:</strong> ${inventory.shopItem.price.toFixed(2)}
          </p>
          <p>
            <strong>SKU ID:</strong> {inventory.skuId ?? "N/A"}
          </p>
          <p>
            <strong>Total Quantity:</strong> {inventory.quantity}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Batches:</h3>
          {inventory.inventoryBatches.length > 0 ? (
            <ul className="list-disc pl-5">
              {inventory.inventoryBatches.map((batch) => (
                <li key={batch.id}>
                  Batch ID: {batch.id}, Quantity: {batch.quantity}, Expiry Date:{" "}
                  {batch.expiryDate ? batch.expiryDate.toLocaleDateString() : "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No batches found for this item.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;
