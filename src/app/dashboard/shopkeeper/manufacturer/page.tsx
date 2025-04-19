"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Check,
  Clock,
  Filter,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// Sample manufacturers data
const manufacturers = [
  {
    id: 1,
    name: "FreshFoods Inc.",
    logo: "/placeholder.svg?height=40&width=40",
    categories: ["Dairy", "Produce", "Bakery"],
    rating: 4.8,
    deliveryTime: "1-2 days",
  },
  {
    id: 2,
    name: "Organic Harvest",
    logo: "/placeholder.svg?height=40&width=40",
    categories: ["Produce", "Grains", "Snacks"],
    rating: 4.6,
    deliveryTime: "2-3 days",
  },
  {
    id: 3,
    name: "Quality Beverages",
    logo: "/placeholder.svg?height=40&width=40",
    categories: ["Beverages", "Juices", "Water"],
    rating: 4.5,
    deliveryTime: "1-2 days",
  },
  {
    id: 4,
    name: "Snack Masters",
    logo: "/placeholder.svg?height=40&width=40",
    categories: ["Snacks", "Confectionery", "Chips"],
    rating: 4.7,
    deliveryTime: "2-3 days",
  },
  {
    id: 5,
    name: "Clean Home Products",
    logo: "/placeholder.svg?height=40&width=40",
    categories: ["Household", "Cleaning", "Paper Goods"],
    rating: 4.4,
    deliveryTime: "3-4 days",
  },
];

// Sample products data
const products = [
  {
    id: 1,
    manufacturerId: 1,
    name: "Organic Whole Milk",
    category: "Dairy",
    price: 3.99,
    unit: "1 Gallon",
    minOrder: 10,
    inStock: true,
  },
  {
    id: 2,
    manufacturerId: 1,
    name: "Fresh Yogurt",
    category: "Dairy",
    price: 1.49,
    unit: "8 oz",
    minOrder: 24,
    inStock: true,
  },
  {
    id: 3,
    manufacturerId: 1,
    name: "Artisan Sourdough Bread",
    category: "Bakery",
    price: 4.99,
    unit: "1 loaf",
    minOrder: 12,
    inStock: true,
  },
  {
    id: 4,
    manufacturerId: 1,
    name: "Organic Apples",
    category: "Produce",
    price: 2.99,
    unit: "1 lb",
    minOrder: 20,
    inStock: true,
  },
  {
    id: 5,
    manufacturerId: 2,
    name: "Organic Carrots",
    category: "Produce",
    price: 1.99,
    unit: "1 lb",
    minOrder: 15,
    inStock: true,
  },
  {
    id: 6,
    manufacturerId: 2,
    name: "Quinoa",
    category: "Grains",
    price: 5.99,
    unit: "1 lb",
    minOrder: 10,
    inStock: true,
  },
  {
    id: 7,
    manufacturerId: 2,
    name: "Organic Trail Mix",
    category: "Snacks",
    price: 6.99,
    unit: "12 oz",
    minOrder: 12,
    inStock: false,
  },
  {
    id: 8,
    manufacturerId: 3,
    name: "Sparkling Water",
    category: "Beverages",
    price: 0.99,
    unit: "12 oz",
    minOrder: 24,
    inStock: true,
  },
  {
    id: 9,
    manufacturerId: 3,
    name: "Orange Juice",
    category: "Juices",
    price: 3.49,
    unit: "64 oz",
    minOrder: 12,
    inStock: true,
  },
  {
    id: 10,
    manufacturerId: 3,
    name: "Bottled Spring Water",
    category: "Water",
    price: 0.79,
    unit: "16.9 oz",
    minOrder: 36,
    inStock: true,
  },
  {
    id: 11,
    manufacturerId: 4,
    name: "Potato Chips",
    category: "Chips",
    price: 2.99,
    unit: "8 oz",
    minOrder: 24,
    inStock: true,
  },
  {
    id: 12,
    manufacturerId: 4,
    name: "Chocolate Bar",
    category: "Confectionery",
    price: 1.99,
    unit: "3.5 oz",
    minOrder: 36,
    inStock: true,
  },
  {
    id: 13,
    manufacturerId: 5,
    name: "All-Purpose Cleaner",
    category: "Cleaning",
    price: 3.99,
    unit: "32 oz",
    minOrder: 12,
    inStock: true,
  },
  {
    id: 14,
    manufacturerId: 5,
    name: "Paper Towels",
    category: "Paper Goods",
    price: 8.99,
    unit: "8 rolls",
    minOrder: 10,
    inStock: true,
  },
];

// Sample low stock items
const lowStockItems = [
  { id: 1, name: "Organic Milk", currentStock: 5, minStock: 20 },
  { id: 2, name: "Whole Wheat Bread", currentStock: 8, minStock: 15 },
  { id: 3, name: "Potato Chips", currentStock: 4, minStock: 25 },
  { id: 4, name: "Sparkling Water", currentStock: 12, minStock: 30 },
  { id: 5, name: "Paper Towels", currentStock: 6, minStock: 15 },
];

// Sample orders
const orders = [
  {
    id: "ORD-001",
    manufacturerId: 1,
    manufacturerName: "FreshFoods Inc.",
    date: "2023-04-15",
    items: 3,
    total: 245.67,
    status: "shipped",
  },
  {
    id: "ORD-002",
    manufacturerId: 3,
    manufacturerName: "Quality Beverages",
    date: "2023-04-16",
    items: 2,
    total: 178.92,
    status: "approved",
  },
  {
    id: "ORD-003",
    manufacturerId: 2,
    manufacturerName: "Organic Harvest",
    date: "2023-04-17",
    items: 4,
    total: 312.45,
    status: "pending",
  },
  {
    id: "ORD-004",
    manufacturerId: 5,
    manufacturerName: "Clean Home Products",
    date: "2023-04-18",
    items: 2,
    total: 156.78,
    status: "shipped",
  },
  {
    id: "ORD-005",
    manufacturerId: 4,
    manufacturerName: "Snack Masters",
    date: "2023-04-19",
    items: 3,
    total: 198.34,
    status: "pending",
  },
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  manufacturerId: number;
  manufacturerName: string;
};

export default function ManufacturersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    number | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  // Get all unique categories
  const allCategories = Array.from(
    new Set(products.map((product) => product.category)),
  );

  // Filter manufacturers based on search term
  const filteredManufacturers = manufacturers.filter(
    (manufacturer) =>
      manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manufacturer.categories.some((category) =>
        category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // Filter products based on selected manufacturer and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedManufacturer === null ||
        product.manufacturerId === selectedManufacturer) &&
      (selectedCategory === null || product.category === selectedCategory) &&
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Add product to cart
  const addToCart = (product: (typeof products)[0]) => {
    const manufacturer = manufacturers.find(
      (m) => m.id === product.manufacturerId,
    );
    if (!manufacturer) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item,
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.minOrder,
            total: product.minOrder * product.price,
            manufacturerId: product.manufacturerId,
            manufacturerName: manufacturer.name,
          },
        ];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update product quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity, total: quantity * item.price }
          : item,
      ),
    );
  };

  // Calculate total by manufacturer
  const calculateTotalByManufacturer = (manufacturerId: number) => {
    return cart
      .filter((item) => item.manufacturerId === manufacturerId)
      .reduce((sum, item) => sum + item.total, 0);
  };

  // Group cart items by manufacturer
  const cartByManufacturer = cart.reduce(
    (acc, item) => {
      if (!acc[item.manufacturerId]) {
        acc[item.manufacturerId] = {
          manufacturerId: item.manufacturerId,
          manufacturerName: item.manufacturerName,
          items: [],
        };
      }
      acc[item.manufacturerId].items.push(item);
      return acc;
    },
    {} as Record<
      number,
      { manufacturerId: number; manufacturerName: string; items: CartItem[] }
    >,
  );

  // Place order
  const placeOrder = () => {
    // In a real app, this would send the order to the backend
    setShowCartDialog(false);
    setCart([]);
    // Show success message or redirect
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 bg-yellow-100 text-yellow-800"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="border-blue-300 bg-blue-100 text-blue-800"
          >
            Approved
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="border-green-300 bg-green-100 text-green-800"
          >
            Shipped
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manufacturers</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowOrderDialog(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            Order Low Stock Items
          </Button>
          {cart.length > 0 && (
            <Button
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowCartDialog(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              View Cart ({cart.length})
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Browse Manufacturers
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            My Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Find Products</CardTitle>
              <CardDescription>
                Browse products from our trusted manufacturers
              </CardDescription>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search manufacturers or products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedCategory ? selectedCategory : "all"}
                    onValueChange={(value) =>
                      setSelectedCategory(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedManufacturer(null);
                      setSelectedCategory(null);
                      setSearchTerm("");
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Reset Filters</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Manufacturers List */}
          {selectedManufacturer === null && (
            <Card>
              <CardHeader>
                <CardTitle>Manufacturers</CardTitle>
                <CardDescription>
                  Select a manufacturer to view their products
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
                  {filteredManufacturers.map((manufacturer) => (
                    <Card
                      key={manufacturer.id}
                      className="hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedManufacturer(manufacturer.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={manufacturer.logo || "/placeholder.svg"}
                              alt={manufacturer.name}
                            />
                            <AvatarFallback>
                              {manufacturer.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">
                              {manufacturer.name}
                            </h3>
                            <div className="text-muted-foreground flex items-center text-sm">
                              <span className="flex items-center">
                                ★ {manufacturer.rating}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{manufacturer.deliveryTime}</span>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {manufacturer.categories.map((category) => (
                                <Badge
                                  key={category}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          {(selectedManufacturer !== null ||
            selectedCategory !== null ||
            searchTerm !== "") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    {selectedManufacturer !== null
                      ? `Products from ${manufacturers.find((m) => m.id === selectedManufacturer)?.name}`
                      : "All products"}
                  </CardDescription>
                </div>
                {selectedManufacturer !== null && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedManufacturer(null)}
                  >
                    View All Manufacturers
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Product
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Min. Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-muted-foreground py-4 text-center"
                        >
                          No products found. Try a different search term or
                          filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => {
                        const manufacturer = manufacturers.find(
                          (m) => m.id === product.manufacturerId,
                        );
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{manufacturer?.name}</TableCell>
                            <TableCell className="text-right">
                              ${product.price.toFixed(2)} / {product.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.minOrder} units
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                                disabled={!product.inStock}
                                onClick={() => addToCart(product)}
                              >
                                <Plus className="h-3 w-3" />
                                {product.inStock
                                  ? "Add to Cart"
                                  : "Out of Stock"}
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
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
                Track and manage your orders from manufacturers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.manufacturerName}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-right">
                        {order.items}
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Timeline</CardTitle>
              <CardDescription>
                Track the progress of your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="relative">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarFallback>
                            {order.manufacturerName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {order.id} - {order.manufacturerName}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {order.date}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="relative">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    order.status === "pending" ||
                                    order.status === "approved" ||
                                    order.status === "shipped"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {order.status === "pending" ||
                                  order.status === "approved" ||
                                  order.status === "shipped" ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-4 w-4" />
                                  )}
                                </div>
                                <span className="mt-1 text-xs">Ordered</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    order.status === "approved" ||
                                    order.status === "shipped"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {order.status === "approved" ||
                                  order.status === "shipped" ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-4 w-4" />
                                  )}
                                </div>
                                <span className="mt-1 text-xs">Approved</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    order.status === "shipped"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {order.status === "shipped" ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Clock className="h-4 w-4" />
                                  )}
                                </div>
                                <span className="mt-1 text-xs">Shipped</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full">
                                  <Clock className="h-4 w-4" />
                                </div>
                                <span className="mt-1 text-xs">Delivered</span>
                              </div>
                            </div>
                            <div className="bg-muted absolute top-4 right-0 left-0 h-0.5">
                              <div
                                className="h-full bg-emerald-500"
                                style={{
                                  width:
                                    order.status === "pending"
                                      ? "0%"
                                      : order.status === "approved"
                                        ? "33%"
                                        : order.status === "shipped"
                                          ? "66%"
                                          : "100%",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cart Dialog */}
      <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
            <DialogDescription>
              Review your items before placing an order
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {Object.values(cartByManufacturer).map((manufacturerCart) => (
              <div key={manufacturerCart.manufacturerId} className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {manufacturerCart.manufacturerName}
                  </h3>
                  <div className="text-muted-foreground text-sm">
                    Total: $
                    {calculateTotalByManufacturer(
                      manufacturerCart.manufacturerId,
                    ).toFixed(2)}
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manufacturerCart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-6 w-6"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCartDialog(false)}>
              Continue Shopping
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={placeOrder}
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Low Stock Items Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Low Stock Items</DialogTitle>
            <DialogDescription>
              Quickly restock items that are running low
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Min. Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-bold text-red-500">
                      {item.currentStock}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.minStock}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        Add to Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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

function X(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
