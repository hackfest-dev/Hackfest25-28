"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  ArrowUpDown,
  Package,
  ShoppingCart,
  Clock,
  BarChart2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Progress } from "~/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

// Sample data for SKUs
const skuData = [
  {
    id: 1,
    name: "Premium Milk",
    sku: "PRD-001",
    category: "Dairy",
    totalProduced: 5000,
    inRetail: 2500,
    sold: 2000,
    expiryStart: "2023-05-01",
    expiryEnd: "2023-05-15",
    lowStockThreshold: 500,
    retailers: [
      { name: "City Mart", quantity: 800 },
      { name: "Fresh Market", quantity: 1200 },
      { name: "Green Grocers", quantity: 500 },
    ],
  },
  {
    id: 2,
    name: "Artisan Bread",
    sku: "PRD-002",
    category: "Bakery",
    totalProduced: 3000,
    inRetail: 300,
    sold: 2500,
    expiryStart: "2023-04-25",
    expiryEnd: "2023-05-05",
    lowStockThreshold: 400,
    retailers: [
      { name: "City Mart", quantity: 100 },
      { name: "Fresh Market", quantity: 150 },
      { name: "Corner Store", quantity: 50 },
    ],
  },
  {
    id: 3,
    name: "Organic Eggs",
    sku: "PRD-003",
    category: "Dairy",
    totalProduced: 10000,
    inRetail: 4000,
    sold: 5500,
    expiryStart: "2023-05-10",
    expiryEnd: "2023-05-25",
    lowStockThreshold: 1000,
    retailers: [
      { name: "City Mart", quantity: 1500 },
      { name: "Fresh Market", quantity: 1800 },
      { name: "Green Grocers", quantity: 700 },
    ],
  },
  {
    id: 4,
    name: "Fresh Apples",
    sku: "PRD-004",
    category: "Produce",
    totalProduced: 8000,
    inRetail: 3500,
    sold: 4000,
    expiryStart: "2023-04-20",
    expiryEnd: "2023-05-10",
    lowStockThreshold: 800,
    retailers: [
      { name: "City Mart", quantity: 1200 },
      { name: "Fresh Market", quantity: 1500 },
      { name: "Neighborhood Market", quantity: 800 },
    ],
  },
  {
    id: 5,
    name: "Dark Chocolate",
    sku: "PRD-005",
    category: "Confectionery",
    totalProduced: 12000,
    inRetail: 7000,
    sold: 4500,
    expiryStart: "2023-08-01",
    expiryEnd: "2023-12-31",
    lowStockThreshold: 1500,
    retailers: [
      { name: "City Mart", quantity: 2500 },
      { name: "Fresh Market", quantity: 2000 },
      { name: "Corner Store", quantity: 1500 },
      { name: "Neighborhood Market", quantity: 1000 },
    ],
  },
  {
    id: 6,
    name: "Sparkling Water",
    sku: "PRD-006",
    category: "Beverages",
    totalProduced: 20000,
    inRetail: 12000,
    sold: 7500,
    expiryStart: "2024-01-01",
    expiryEnd: "2024-06-30",
    lowStockThreshold: 3000,
    retailers: [
      { name: "City Mart", quantity: 4000 },
      { name: "Fresh Market", quantity: 3500 },
      { name: "Green Grocers", quantity: 2500 },
      { name: "Corner Store", quantity: 2000 },
    ],
  },
  {
    id: 7,
    name: "Potato Chips",
    sku: "PRD-007",
    category: "Snacks",
    totalProduced: 15000,
    inRetail: 6000,
    sold: 8500,
    expiryStart: "2023-06-01",
    expiryEnd: "2023-09-30",
    lowStockThreshold: 2000,
    retailers: [
      { name: "City Mart", quantity: 2000 },
      { name: "Fresh Market", quantity: 1500 },
      { name: "Corner Store", quantity: 1500 },
      { name: "Neighborhood Market", quantity: 1000 },
    ],
  },
  {
    id: 8,
    name: "Laundry Detergent",
    sku: "PRD-008",
    category: "Household",
    totalProduced: 8000,
    inRetail: 5000,
    sold: 2500,
    expiryStart: "2025-01-01",
    expiryEnd: "2026-01-01",
    lowStockThreshold: 1000,
    retailers: [
      { name: "City Mart", quantity: 2000 },
      { name: "Fresh Market", quantity: 1500 },
      { name: "Neighborhood Market", quantity: 1500 },
    ],
  },
];

// Sample categories for filters
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

export default function LiveRetailVisibilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterNearExpiry, setFilterNearExpiry] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedSku, setSelectedSku] = useState<number | null>(null);

  // Filter SKUs based on search term, category, and other filters
  const filteredSkus = skuData.filter((sku) => {
    const matchesSearch =
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      sku.category === selectedCategory;
    const matchesLowStock =
      !filterLowStock || sku.inRetail < sku.lowStockThreshold;

    // Check if product is near expiry (within 7 days)
    const today = new Date();
    const expiryDate = new Date(sku.expiryEnd);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    const isNearExpiry = expiryDate <= sevenDaysLater;
    const matchesNearExpiry = !filterNearExpiry || isNearExpiry;

    return (
      matchesSearch && matchesCategory && matchesLowStock && matchesNearExpiry
    );
  });

  // Get low stock items
  const lowStockItems = skuData.filter(
    (sku) => sku.inRetail < sku.lowStockThreshold,
  );

  // Get near expiry items
  const today = new Date();
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);
  const nearExpiryItems = skuData.filter((sku) => {
    const expiryDate = new Date(sku.expiryEnd);
    return expiryDate <= sevenDaysLater;
  });

  // Calculate retail distribution percentage
  const getRetailPercentage = (sku: (typeof skuData)[0]) => {
    return (sku.inRetail / sku.totalProduced) * 100;
  };

  // Calculate sales percentage
  const getSalesPercentage = (sku: (typeof skuData)[0]) => {
    return (sku.sold / sku.totalProduced) * 100;
  };

  // Check if SKU is low on stock
  const isLowStock = (sku: (typeof skuData)[0]) => {
    return sku.inRetail < sku.lowStockThreshold;
  };

  // Check if SKU is near expiry
  const isNearExpiry = (sku: (typeof skuData)[0]) => {
    const expiryDate = new Date(sku.expiryEnd);
    return expiryDate <= sevenDaysLater;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Live Retail Visibility
          </h1>
          <p className="text-muted-foreground">
            Real-time visibility of your products across all retail locations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <BarChart2 className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || nearExpiryItems.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Low Stock Alert</AlertTitle>
              <AlertDescription>
                {lowStockItems.length} products are running low in retail.
                Consider restocking soon.
              </AlertDescription>
            </Alert>
          )}
          {nearExpiryItems.length > 0 && (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Expiry Alert</AlertTitle>
              <AlertDescription>
                {nearExpiryItems.length} products are nearing expiry in retail
                locations.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skuData.length}</div>
            <p className="text-muted-foreground text-xs">
              Across {categories.length - 1} categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total In Retail
            </CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skuData
                .reduce((sum, sku) => sum + sku.inRetail, 0)
                .toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Units across all retailers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
            <BarChart2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skuData.reduce((sum, sku) => sum + sku.sold, 0).toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Units sold to consumers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-muted-foreground text-xs">
              Products below threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Visibility</CardTitle>
          <CardDescription>
            Track your products across all retail locations
          </CardDescription>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search by product name or SKU..."
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
              <Button
                variant={filterLowStock ? "default" : "outline"}
                className={filterLowStock ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setFilterLowStock(!filterLowStock)}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Low Stock
              </Button>
              <Button
                variant={filterNearExpiry ? "default" : "outline"}
                className={
                  filterNearExpiry ? "bg-amber-600 hover:bg-amber-700" : ""
                }
                onClick={() => setFilterNearExpiry(!filterNearExpiry)}
              >
                <Clock className="mr-2 h-4 w-4" />
                Near Expiry
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setFilterLowStock(false);
                  setFilterNearExpiry(false);
                  setSearchTerm("");
                }}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Reset Filters</span>
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={
                  viewMode === "table"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                Table View
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className={
                  viewMode === "cards"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                Card View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Product
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        SKU
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        Total Produced
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        In Retail
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        Sold
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Expiry Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSkus.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No products found. Try a different search term or
                        filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSkus.map((sku) => (
                      <TableRow key={sku.id}>
                        <TableCell className="font-medium">
                          {sku.name}
                        </TableCell>
                        <TableCell>{sku.sku}</TableCell>
                        <TableCell>{sku.category}</TableCell>
                        <TableCell className="text-right">
                          {sku.totalProduced.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              isLowStock(sku) ? "font-bold text-red-500" : ""
                            }
                          >
                            {sku.inRetail.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {sku.sold.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {sku.expiryStart} to {sku.expiryEnd}
                        </TableCell>
                        <TableCell>
                          {isLowStock(sku) && (
                            <Badge variant="destructive" className="mr-1">
                              Low Stock
                            </Badge>
                          )}
                          {isNearExpiry(sku) && (
                            <Badge
                              variant="outline"
                              className="border-amber-300 bg-amber-100 text-amber-800"
                            >
                              Near Expiry
                            </Badge>
                          )}
                          {!isLowStock(sku) && !isNearExpiry(sku) && (
                            <Badge
                              variant="outline"
                              className="border-emerald-300 bg-emerald-100 text-emerald-800"
                            >
                              Good
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedSku(
                                selectedSku === sku.id ? null : sku.id,
                              )
                            }
                          >
                            {selectedSku === sku.id
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSkus.length === 0 ? (
                <div className="text-muted-foreground col-span-full py-4 text-center">
                  No products found. Try a different search term or filter.
                </div>
              ) : (
                filteredSkus.map((sku) => (
                  <Card key={sku.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{sku.name}</CardTitle>
                          <CardDescription>
                            {sku.sku} • {sku.category}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          {isLowStock(sku) && (
                            <Badge variant="destructive" className="mb-1">
                              Low Stock
                            </Badge>
                          )}
                          {isNearExpiry(sku) && (
                            <Badge
                              variant="outline"
                              className="border-amber-300 bg-amber-100 text-amber-800"
                            >
                              Near Expiry
                            </Badge>
                          )}
                          {!isLowStock(sku) && !isNearExpiry(sku) && (
                            <Badge
                              variant="outline"
                              className="border-emerald-300 bg-emerald-100 text-emerald-800"
                            >
                              Good
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Total</div>
                          <div className="font-medium">
                            {sku.totalProduced.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">In Retail</div>
                          <div
                            className={`font-medium ${isLowStock(sku) ? "font-bold text-red-500" : ""}`}
                          >
                            {sku.inRetail.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sold</div>
                          <div className="font-medium">
                            {sku.sold.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Retail Distribution</span>
                          <span>{Math.round(getRetailPercentage(sku))}%</span>
                        </div>
                        <Progress
                          value={getRetailPercentage(sku)}
                          className="h-2"
                        />
                      </div>

                      <div className="mt-2">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Sales Progress</span>
                          <span>{Math.round(getSalesPercentage(sku))}%</span>
                        </div>
                        <Progress
                          value={getSalesPercentage(sku)}
                          className="h-2"
                        />
                      </div>

                      <div className="text-muted-foreground mt-4 text-xs">
                        Expiry: {sku.expiryStart} to {sku.expiryEnd}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          setSelectedSku(selectedSku === sku.id ? null : sku.id)
                        }
                      >
                        {selectedSku === sku.id
                          ? "Hide Details"
                          : "View Details"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between py-4">
          <div className="text-muted-foreground text-sm">
            Showing {filteredSkus.length} of {skuData.length} products
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Selected SKU Details */}
      {selectedSku !== null && (
        <Card>
          <CardHeader>
            <CardTitle>
              {skuData.find((sku) => sku.id === selectedSku)?.name} Details
            </CardTitle>
            <CardDescription>
              Detailed view of retail distribution for{" "}
              {skuData.find((sku) => sku.id === selectedSku)?.sku}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="distribution">
              <TabsList>
                <TabsTrigger value="distribution">
                  Retail Distribution
                </TabsTrigger>
                <TabsTrigger value="trends">Sales Trends</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="distribution" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Retailer Breakdown</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Retailer</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">
                            % of Total
                          </TableHead>
                          <TableHead>Distribution</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {skuData
                          .find((sku) => sku.id === selectedSku)
                          ?.retailers.map((retailer) => {
                            const sku = skuData.find(
                              (sku) => sku.id === selectedSku,
                            )!;
                            const percentage =
                              (retailer.quantity / sku.inRetail) * 100;

                            return (
                              <TableRow key={retailer.name}>
                                <TableCell className="font-medium">
                                  {retailer.name}
                                </TableCell>
                                <TableCell className="text-right">
                                  {retailer.quantity.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  {Math.round(percentage)}%
                                </TableCell>
                                <TableCell>
                                  <div className="bg-muted h-2.5 w-full rounded-full">
                                    <div
                                      className="h-2.5 rounded-full bg-emerald-600"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="trends" className="pt-4">
                <div className="bg-muted/20 text-muted-foreground flex h-[300px] w-full items-center justify-center rounded-md">
                  Sales Trends Chart Placeholder
                </div>
              </TabsContent>
              <TabsContent value="forecast" className="pt-4">
                <div className="bg-muted/20 text-muted-foreground flex h-[300px] w-full items-center justify-center rounded-md">
                  Sales Forecast Chart Placeholder
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
