"use client";

import { useState } from "react";
import { api } from "~/trpc/react"; // Adjust this path if needed

export default function ShopkeeperTestComponent() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("Grocery,Snacks");
  const [rating, setRating] = useState(4.5);
  const [deliveryTime, setDeliveryTime] = useState("30 mins");
  const [shopkeeperId, setShopkeeperId] = useState<number | null>(null);

  const createShopkeeper = api.shopkeeper.createShopkeeper.useMutation();
  const getShopkeeper = api.shopkeeper.getShopkeeper.useQuery(
    { id: shopkeeperId ?? -1 },
    { enabled: !!shopkeeperId }
  );
  const deleteShopkeeper = api.shopkeeper.deleteShopkeeper.useMutation();

  const handleCreate = async () => {
    const result = await createShopkeeper.mutateAsync({
      name,
      categories: categories.split(","),
      rating,
      deliveryTime,
    });
    setShopkeeperId(result.id);
  };

  const handleDelete = async () => {
    if (shopkeeperId) {
      await deleteShopkeeper.mutateAsync({ id: shopkeeperId });
      setShopkeeperId(null);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold">Shopkeeper Tester</h1>

      <div>
        <label>Name:</label>
        <input
          className="w-full p-2 bg-gray-800 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Categories (comma separated):</label>
        <input
          className="w-full p-2 bg-gray-800 rounded"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
      </div>

      <div>
        <label>Rating:</label>
        <input
          type="number"
          className="w-full p-2 bg-gray-800 rounded"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Delivery Time:</label>
        <input
          className="w-full p-2 bg-gray-800 rounded"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreate}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      {getShopkeeper.data && (
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify(getShopkeeper.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
