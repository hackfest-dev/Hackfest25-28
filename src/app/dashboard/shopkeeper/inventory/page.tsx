"use client";

import type React from "react";

import { useEffect, useState } from "react";
import type { shopItem } from "@prisma/client";

import {
  AlertCircle,
  ArrowUpDown,
  ScanBarcodeIcon as BarcodeScan,
  Download,
  FileSpreadsheet,
  Filter,
  Plus,
  Search,
  Upload,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/react";


// Sample inventory data

interface shopItemType extends shopItem {
  inventory?: {
        id: number;
        skuId: number | null;
        quantity: number;
  };
  shopKeeper?: {
    name: string;
        id: number;
        categories: string[];
        rating: number;
        deliveryTime: string;
  };
}

const inventoryData = [
  {
    id: 1,
    name: "Organic Milk",
    brand: "Farm Fresh",
    category: "Dairy",
    quantity: 24,
    price: 3.99,
    expiry: "2023-05-15",
    barcode: "8901234567890",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    brand: "Healthy Bake",
    category: "Bakery",
    quantity: 15,
    price: 2.49,
    expiry: "2023-04-25",
    barcode: "8901234567891",
  },
  {
    id: 3,
    name: "Free Range Eggs (12)",
    brand: "Happy Hens",
    category: "Dairy",
    quantity: 10,
    price: 4.99,
    expiry: "2023-05-10",
    barcode: "8901234567892",
  },
  {
    id: 4,
    name: "Organic Apples (1kg)",
    brand: "Nature's Best",
    category: "Produce",
    quantity: 30,
    price: 5.99,
    expiry: "2023-04-28",
    barcode: "8901234567893",
  },
  {
    id: 5,
    name: "Dark Chocolate Bar",
    brand: "Sweet Delights",
    category: "Confectionery",
    quantity: 50,
    price: 3.49,
    expiry: "2023-12-31",
    barcode: "8901234567894",
  },
  {
    id: 6,
    name: "Sparkling Water (6-pack)",
    brand: "Crystal Clear",
    category: "Beverages",
    quantity: 18,
    price: 4.99,
    expiry: "2024-02-15",
    barcode: "8901234567895",
  },
  {
    id: 7,
    name: "Potato Chips",
    brand: "Crunchy Bites",
    category: "Snacks",
    quantity: 3,
    price: 2.99,
    expiry: "2023-06-30",
    barcode: "8901234567896",
  },
  {
    id: 8,
    name: "Laundry Detergent",
    brand: "Clean & Fresh",
    category: "Household",
    quantity: 12,
    price: 8.99,
    expiry: "2025-01-01",
    barcode: "8901234567897",
  },
];

// Sample brands and categories for filters
const brands = [
  "All Brands",
  "Farm Fresh",
  "Healthy Bake",
  "Happy Hens",
  "Nature's Best",
  "Sweet Delights",
  "Crystal Clear",
  "Crunchy Bites",
  "Clean & Fresh",
];
const categories = [
  "All Categories",
  "Dairy",
  "Bakery",
  "Produce",
  "Confectionery",
  "Beverages",
  "Snacks",
  "Household",
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(inventoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState(0);
  const [inventoryItem, setInventoryItem] = useState<shopItemType>({
    id: 0,
    name: "",
    brand: "",
    category: "",
    price: 0,
    inventoryId: 0,
    shopkeeperId: 0, // Add the missing property with a default value
  });
  const [shopItems, setShopItems] = useState<shopItemType[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const {mutate: addInventoryItem} = api.shopkeeper.createInventoryBatch.useMutation();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false);
  const [searchEvent,setSearchEvent] = useState(false)
  const [inventoryExpiry, setInventoryExpiry] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    quantity: 0,
    price: 0,
    expiry: "",
    barcode: "",
  });

  // const fetchInventory = api.shopkeeper.getInventory.useQuery({id:1});
  const {data : getShopItems, refetch: fetchShopItems} = api.shopkeeper.getShopItems.useQuery({shopkeeperid:1})
  const {mutate: addShopItem} = api.shopkeeper.createShopItem.useMutation();
  // const addProduct = api.shopkeeper.
    

  // Filter inventory based on search term, brand, and category
  const filteredInventory = getShopItems
    ?.map((item2) => ({
      id: item2.id,
      name: item2.name,
      brand: item2.brand,
      inventoryId: item2.inventoryId,
      price: item2.price,
      category: item2.category,
      quantity: item2.inventory?.quantity,
      expiry: "",
    }))
    .filter(
      (item) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (((item.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ??
          item.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrand === "All Brands" || item.brand === selectedBrand) &&
        (selectedCategory === "All Categories" ||
          item.category === selectedCategory)
    ));

  // Get low stock items (quantity < 5)
  const lowStockItems = inventory.filter((item) => item.quantity < 5);
  // Get expired or soon to expire items (within 7 days)
  const today = new Date();
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);

  const expiringItems = inventory.filter((item) => {
    const expiryDate = new Date(item.expiry);
    return expiryDate <= sevenDaysLater;
  });

  // Add new product
  const handleAddProduct =async () => {
    addShopItem({
      name: newProduct.name,
      brand: newProduct.brand,
      category: newProduct.category,
      price: newProduct.price,
      shopkeeperId: 1
    }, {onSuccess: () => {
      fetchShopItems();
      setShowAddDialog(false);
      setNewProduct({
        name: "",
        brand: "",
        category: "",
        quantity: 0,
        price: 0,
        expiry: "",
        barcode: "",
      });
    }});
    }

      // setShowAddDialog(false);
    // setNewProduct({
    //   name: "",

    //   expiry: "",
    //   barcode: "",
    // });

  const handleAddInventory =async () => {
    addInventoryItem({
      inventoryId: Number(inventoryItem?.inventoryId),
      quantity: inventoryQuantity
    });

    setShowAddInventoryDialog(false);
    setInventoryItem({
      id: 0,
      name: "",
      brand: "",
      category: "",
      price: 0,
      inventoryId: 0,
      shopkeeperId: 0, 
    });

    setInventoryQuantity(0);
    setInventoryExpiry("");

    // setShowAddDialog(false);
    // setNewProduct({
    //   name: "",

    //   expiry: "",
    //   barcode: "",
    // });
    
  };
  // Delete product
  const handleDeleteProduct = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  // Update product quantity
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 0) return;
    setInventory(
      inventory.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Inventory Management
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BarcodeScan className="h-4 w-4" />
            Scan Barcode
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={()=>setShowAddInventoryDialog(true)}
            >
            <Plus className="mr-2 h-4 w-4" />  Add Items to Inventory
            </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Low Stock Alert</AlertTitle>
              <AlertDescription>
                {lowStockItems.length} products are running low on stock. Please
                reorder soon.
              </AlertDescription>
            </Alert>
          )}
          {expiringItems.length > 0 && (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Expiry Alert</AlertTitle>
              <AlertDescription>
                {expiringItems.length} products are expiring soon or have
                already expired.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage your store&apos;s inventory</CardDescription>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search by name, brand, or barcode..."
                className="pl-8"
                value={searchTerm}
                onSelect={(e)=>setSearchEvent(true)}
                onChange={(e) => {setSearchTerm(e.target.value);}
              
              
              }
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>  


          
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    Quantity
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-4 text-center"
                  >
                    No products found. Try a different search term or filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory?.map((item) => {
                  const isLowStock = (item?.quantity ?? 0) < 5;
                  const expiryDate = new Date(item.expiry);
                  const isExpired = expiryDate <= today;
                  const isExpiringSoon =
                    expiryDate <= sevenDaysLater && expiryDate > today;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          <span
                            className={
                              isLowStock ? "font-bold text-red-500" : ""
                            }
                          >
                            {item.quantity}
                          </span>
                          
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                      ₹{item.price.toFixed(2)}
                      </TableCell>
                      <TableCell>{item.expiry}</TableCell>
                      <TableCell>
                        {isExpired && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                        {isExpiringSoon && (
                          <Badge variant="default">Expiring Soon</Badge>
                        )}
                        {isLowStock && (
                          <Badge variant="destructive">Low Stock</Badge>
                        )}
                        {!isExpired && !isExpiringSoon && !isLowStock && (
                          <Badge variant="outline">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit Product</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteProduct(item.id)}
                            >
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {/* {getInventory.data?.length && <div>
                 {JSON.stringify(getInventory.data)}
                {/* {getInventory.data.map((item)=>{console.log(item)})} */}  
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between py-4">
          <div className="text-muted-foreground text-sm">
            Showing {filteredInventory?.length} of {shopItems.length} products
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Tabs for Low Stock and Expiring Items */}
      <Tabs defaultValue="low-stock" className="mt-4">
        <TabsList>
          <TabsTrigger value="low-stock" className="flex items-center gap-2">
            Low Stock Items
            {lowStockItems.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowStockItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            Expiring Items
            {expiringItems.length > 0 && (
              <Badge variant="default" className="ml-2">
                {expiringItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="low-stock" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>
                Products that need to be restocked soon
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No low stock items. Your inventory is well-stocked!
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right font-bold text-red-500">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expiring" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Items</CardTitle>
              <CardDescription>
                Products that are expiring soon or have already expired
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No expiring items. Your inventory is fresh!
                      </TableCell>
                    </TableRow>
                  ) : (
                    expiringItems.map((item) => {
                      const expiryDate = new Date(item.expiry);
                      const isExpired = expiryDate <= today;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.expiry}</TableCell>
                          <TableCell>
                            {isExpired ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : (
                              <Badge variant="default">Expiring Soon</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              {isExpired ? "Discard" : "Discount"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details of the new product to add to inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
           
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              
            </div>
           
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddInventoryDialog} onOpenChange={setShowAddInventoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Items to Inventory</DialogTitle>
            <DialogDescription>
              Enter the details of the new product to add to inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <div className="relative flex-1 overflow-y-auto ">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search by name, brand, or barcode..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             <div className="max-h-64 overflow-y-auto border rounded-md">
    <table className="w-full text-sm">
      <TableBody>
        {filteredInventory?.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-muted-foreground py-4 text-center"
            >
              No products found. Try a different search term or filter.
            </TableCell>
          </TableRow>
        ) : (
          filteredInventory?.map((item) => (
            <TableRow key={item.id} onClick={() => setInventoryItem({ ...item, shopkeeperId: 1, inventoryId: item.inventoryId })}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Action buttons or info */}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </table>
  </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={inventoryItem?.name}
                  disabled={true}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={inventoryItem?.brand}
                  disabled={true}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                disabled={true}
                  value={inventoryItem?.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
           
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  disabled={true}
                  value={inventoryItem?.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={inventoryQuantity}
                  onChange={(e) =>
                    setInventoryQuantity(
                      Number(e.target.value)
                )
                  }
                />
              </div>
              
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={inventoryExpiry}
                  onChange={(e) =>
                    setInventoryExpiry(e.target.value)
                  }
                />
              </div>
             
</div>
           
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAddInventory}
            >
              Add Product
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}

function MoreHorizontal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}


