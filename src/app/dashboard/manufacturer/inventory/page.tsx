"use client";

import type React from "react";

import { useState } from "react"
import { AlertCircle, ArrowUpDown, BarChart3, ClipboardList, Download, Filter, LayoutDashboard, Package, Plus, Search, Upload } from "lucide-react"

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
} from "~/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import Link from "next/link"
import { api } from "~/trpc/react"

// Sample inventory data
const inventoryData = [
  {
    id: 1,
    sku: "PRD-001",
    name: "Premium Milk",
    category: "Dairy",
    batchNumber: "BAT-10045",
    quantity: 500,
    price: 2.99,
    manufactureDate: "2023-03-15",
    expiryDate: "2023-05-15",
    location: "Warehouse A",
  },
  {
    id: 2,
    sku: "PRD-002",
    name: "Artisan Bread",
    category: "Bakery",
    batchNumber: "BAT-10046",
    quantity: 300,
    price: 3.49,
    manufactureDate: "2023-04-01",
    expiryDate: "2023-04-08",
    location: "Warehouse A",
  },
  {
    id: 3,
    sku: "PRD-003",
    name: "Organic Eggs",
    category: "Dairy",
    batchNumber: "BAT-10047",
    quantity: 1000,
    price: 4.99,
    manufactureDate: "2023-03-25",
    expiryDate: "2023-04-25",
    location: "Warehouse B",
  },
  {
    id: 4,
    sku: "PRD-004",
    name: "Fresh Apples",
    category: "Produce",
    batchNumber: "BAT-10048",
    quantity: 800,
    price: 1.99,
    manufactureDate: "2023-03-28",
    expiryDate: "2023-04-15",
    location: "Warehouse B",
  },
  {
    id: 5,
    sku: "PRD-005",
    name: "Dark Chocolate",
    category: "Confectionery",
    batchNumber: "BAT-10049",
    quantity: 1200,
    price: 2.49,
    manufactureDate: "2023-02-15",
    expiryDate: "2023-08-15",
    location: "Warehouse A",
  },
  {
    id: 6,
    sku: "PRD-006",
    name: "Sparkling Water",
    category: "Beverages",
    batchNumber: "BAT-10050",
    quantity: 2000,
    price: 0.99,
    manufactureDate: "2023-03-10",
    expiryDate: "2024-03-10",
    location: "Warehouse C",
  },
  {
    id: 7,
    sku: "PRD-007",
    name: "Potato Chips",
    category: "Snacks",
    batchNumber: "BAT-10051",
    quantity: 1500,
    price: 1.99,
    manufactureDate: "2023-03-05",
    expiryDate: "2023-06-05",
    location: "Warehouse A",
  },
  {
    id: 8,
    sku: "PRD-008",
    name: "Laundry Detergent",
    category: "Household",
    batchNumber: "BAT-10052",
    quantity: 800,
    price: 7.99,
    manufactureDate: "2023-01-15",
    expiryDate: "2025-01-15",
    location: "Warehouse C",
  },
];

// Sample categories and locations for filters
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
const locations = [
  "All Locations",
  "Warehouse A",
  "Warehouse B",
  "Warehouse C",
];
const batches = [
  "All Batches",
  "BAT-10045",
  "BAT-10046",
  "BAT-10047",
  "BAT-10048",
  "BAT-10049",
  "BAT-10050",
  "BAT-10051",
  "BAT-10052",
];

export default function ManufacturerInventoryPage() {
  const [inventory, setInventory] = useState(inventoryData);
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState(0);
  
  const {mutate: addSku} = api.manufacturer.addSku.useMutation();
  const [showAddInventoryDialog, setShowAddInventoryDialog] = useState(false);
   
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    category: "",
    price: 0,
    minorder: 0,
  });
  

  // Filter inventory based on search term, category, location, and batch
  const filteredInventory = inventory.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "All Categories" ||
        item.category === selectedCategory) &&
      (selectedLocation === "All Locations" ||
        item.location === selectedLocation) &&
      (selectedBatch === "All Batches" || item.batchNumber === selectedBatch),
  );

  // Get low stock items (quantity < 300)
  const lowStockItems = inventory.filter((item) => item.quantity < 300);

  // Get expired or soon to expire items (within 7 days)
  const today = new Date();
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);

  const expiringItems = inventory.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= sevenDaysLater;
  });

  // Add new product
  const handleAddProduct = () => {
    addSku({
      skuId: newProduct.sku,
      prodName: newProduct.name,
      category: newProduct.category,
      minorder: newProduct.minorder,
      price: newProduct.price,
      maid: 1
    }, {
      onSuccess:{
        void getSkus();
      }
    });
    
    setShowAddDialog(false)
    setNewProduct({
      sku: "",
      name: "",
      category: "",
      price: 0,
      minorder: 0,
    })
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="mb-2 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="h-10 px-4 py-2">
          <Link
            href="/dashboard/manufacturer"
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-10 px-4 py-2">
          <Link
            href="/dashboard/manufacturer/analytics"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-10 px-4 py-2">
          <Link
            href="/dashboard/manufacturer/orders"
            className="flex items-center gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Orders</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-10 px-4 py-2">
          <Link
            href="/dashboard/manufacturer/inventory"
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            <span>Inventory</span>
          </Link>
        </Button>
      </div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
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
                restock soon.
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
          <CardDescription>Manage your manufacturing inventory</CardDescription>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search by name, SKU, or batch number..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedLocation("All Locations");
                  setSelectedBatch("All Batches");
                  setSearchTerm("");
                }}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Reset Filters</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      SKU
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Product
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      Quantity
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Manufacture Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-muted-foreground py-4 text-center"
                    >
                      No products found. Try a different search term or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => {
                    const isLowStock = item.quantity < 300;
                    const expiryDate = new Date(item.expiryDate);
                    const isExpired = expiryDate <= today;
                    const isExpiringSoon =
                      expiryDate <= sevenDaysLater && expiryDate > today;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.sku}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.batchNumber}</TableCell>
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
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{item.manufactureDate}</TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                        <TableCell>{item.location}</TableCell>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between py-4">
          <div className="text-muted-foreground text-sm">
            Showing {filteredInventory.length} of {inventory.length} products
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
          <TabsTrigger value="batches" className="flex items-center gap-2">
            Batch Management
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
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No low stock items. Your inventory is well-stocked!
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.sku}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.batchNumber}</TableCell>
                        <TableCell className="text-right font-bold text-red-500">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Restock
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
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Manufacture Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No expiring items. Your inventory is fresh!
                      </TableCell>
                    </TableRow>
                  ) : (
                    expiringItems.map((item) => {
                      const expiryDate = new Date(item.expiryDate);
                      const isExpired = expiryDate <= today;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.sku}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.batchNumber}</TableCell>
                          <TableCell>{item.manufactureDate}</TableCell>
                          <TableCell>{item.expiryDate}</TableCell>
                          <TableCell>
                            {isExpired ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : (
                              <Badge variant="default">Expiring Soon</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              {isExpired ? "Discard" : "Mark for Clearance"}
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
        <TabsContent value="batches" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Management</CardTitle>
              <CardDescription>
                Track and manage product batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batches.slice(1).map((batch) => (
                  <Card key={batch}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{batch}</CardTitle>
                        <Badge variant="outline">
                          {
                            inventory.filter(
                              (item) => item.batchNumber === batch,
                            ).length
                          }{" "}
                          Products
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <div className="text-muted-foreground text-sm font-medium">
                            Manufacture Date
                          </div>
                          <div className="font-medium">
                            {
                              inventory.find(
                                (item) => item.batchNumber === batch,
                              )?.manufactureDate
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm font-medium">
                            Expiry Date
                          </div>
                          <div className="font-medium">
                            {
                              inventory.find(
                                (item) => item.batchNumber === batch,
                              )?.expiryDate
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm font-medium">
                            Location
                          </div>
                          <div className="font-medium">
                            {
                              inventory.find(
                                (item) => item.batchNumber === batch,
                              )?.location
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm font-medium">
                            Total Quantity
                          </div>
                          <div className="font-medium">
                            {inventory
                              .filter((item) => item.batchNumber === batch)
                              .reduce((sum, item) => sum + item.quantity, 0)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View Batch Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      {/* <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details of the new product to add to inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                />
              </div>
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
            </div>
            <div className="grid gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="minorder">Min Order</Label>
                <Input
                  id="minorder"
                  type="number"
                  step="1"
                  value={newProduct.minorder}
                  onChange={(e) => setNewProduct({ ...newProduct, minorder: Number(e.target.value) })}
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
      </Dialog> */}


      <Dialog
              open={showAddInventoryDialog}
              onOpenChange={setShowAddInventoryDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Items to Inventory</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new product to add to inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="relative flex-1 overflow-y-auto">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search by name, brand, or barcode..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-64 overflow-y-auto rounded-md border">
                      <table className="w-full text-sm">
                        <TableBody>
                          {filteredInventory?.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="text-muted-foreground py-4 text-center"
                              >
                                No products found. Try a different search term or
                                filter.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredInventory?.map((item) => (
                              <TableRow
                                key={item.id}
                                // onClick={() =>
                                //   setInventoryItem({
                                //     ...item,
                                //     shopkeeperId: 1,
                                //     inventoryId: item.inventoryId,
                                //   })
                                // }
                              >
                                <TableCell className="font-medium">
                                  {item.name}
                                </TableCell>

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
                        value={"Name"}
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
                        value={"brand"}
                        disabled={true}
                        // onChange={(e) =>
                        //   setNewProduct({ ...newProduct, brand: e.target.value })
                        // }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        disabled={true}
                        value={"category"}
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
                        value={"price"}
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
                        value={"inventoryQuantity"}
                        onChange={(e) => setInventoryQuantity(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        type="date"
                        value={"inventoryExpiry"}
                        // onChange={(e) => setInventoryExpiry(e.target.value)}
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
                    // onClick={handleAddInventory}
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

function Minus(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
    </svg>
  );
}
