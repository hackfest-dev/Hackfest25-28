"use client";

import type React from "react";
import { useState } from "react";
import { api } from "~/trpc/react";
import {
  ArrowUpDown,
  Filter,
  Package,
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
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: manufacturers, isLoading: isLoadingManufacturers, error: manufacturersError } =
    api.shop.getManufacturers.useQuery();
  const { data: products, isLoading: isLoadingProducts, error: productsError } =
    api.shop.getProducts.useQuery();
  const { data: orders, isLoading: isLoadingOrders, error: ordersError } =
    api.order.getOrdersByShopkeeper.useQuery({ shopkeeperId: 1 });

  const filteredManufacturers = manufacturers?.filter(
    (manufacturer) =>
      manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manufacturer.categories.some((category) =>
        category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const filteredProducts = products?.filter(
    (product) =>
      (selectedManufacturer === null || product.manufacturerId === selectedManufacturer) &&
      (selectedCategory === null || product.category === selectedCategory) &&
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const addToCart = (product: any) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  if (isLoadingManufacturers || isLoadingProducts || isLoadingOrders) {
    return <p>Loading...</p>;
  }

  if (manufacturersError || productsError || ordersError) {
    return <p>Error loading data. Please try again later.</p>;
  }

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
                  {orders?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.manufacturer.name}</TableCell>
                        <TableCell>{order.date.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{order.orderItem.length}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Details
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
      </Tabs>
    </div>
  );
}
