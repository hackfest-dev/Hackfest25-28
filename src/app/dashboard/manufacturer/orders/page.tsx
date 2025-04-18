"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Search,
  Truck,
  X,
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// Sample orders data
const ordersData = [
  {
    id: "ORD-001",
    shopkeeper: {
      id: 1,
      name: "City Mart",
      logo: "/placeholder.svg?height=40&width=40",
      location: "New York",
    },
    date: "2023-04-15",
    items: [
      { id: 1, name: "Premium Milk", quantity: 50, price: 2.99 },
      { id: 2, name: "Artisan Bread", quantity: 30, price: 3.49 },
      { id: 3, name: "Organic Eggs", quantity: 20, price: 4.99 },
    ],
    total: 345.5,
    status: "pending",
  },
  {
    id: "ORD-002",
    shopkeeper: {
      id: 2,
      name: "Fresh Market",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Los Angeles",
    },
    date: "2023-04-16",
    items: [
      { id: 1, name: "Premium Milk", quantity: 40, price: 2.99 },
      { id: 4, name: "Fresh Apples", quantity: 25, price: 1.99 },
    ],
    total: 169.55,
    status: "approved",
  },
  {
    id: "ORD-003",
    shopkeeper: {
      id: 3,
      name: "Green Grocers",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Chicago",
    },
    date: "2023-04-17",
    items: [
      { id: 5, name: "Dark Chocolate", quantity: 60, price: 2.49 },
      { id: 6, name: "Sparkling Water", quantity: 100, price: 0.99 },
      { id: 7, name: "Potato Chips", quantity: 75, price: 1.99 },
      { id: 8, name: "Laundry Detergent", quantity: 20, price: 7.99 },
    ],
    total: 478.25,
    status: "shipped",
  },
  {
    id: "ORD-004",
    shopkeeper: {
      id: 4,
      name: "Corner Store",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Houston",
    },
    date: "2023-04-18",
    items: [
      { id: 6, name: "Sparkling Water", quantity: 80, price: 0.99 },
      { id: 7, name: "Potato Chips", quantity: 50, price: 1.99 },
    ],
    total: 179.1,
    status: "delivered",
  },
  {
    id: "ORD-005",
    shopkeeper: {
      id: 5,
      name: "Neighborhood Market",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Miami",
    },
    date: "2023-04-19",
    items: [
      { id: 1, name: "Premium Milk", quantity: 60, price: 2.99 },
      { id: 3, name: "Organic Eggs", quantity: 40, price: 4.99 },
      { id: 5, name: "Dark Chocolate", quantity: 30, price: 2.49 },
    ],
    total: 423.1,
    status: "pending",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof ordersData)[0] | null
  >(null);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shopkeeper.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedStatus === "all" || order.status === selectedStatus),
  );

  // Update order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
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
            className="border-emerald-300 bg-emerald-100 text-emerald-800"
          >
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="border-green-300 bg-green-100 text-green-800"
          >
            Delivered
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="border-red-300 bg-red-100 text-red-800"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Orders
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Orders
            <Badge variant="secondary" className="ml-1">
              {orders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            <Badge variant="secondary" className="ml-1">
              {orders.filter((order) => order.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            Approved
            <Badge variant="secondary" className="ml-1">
              {orders.filter((order) => order.status === "approved").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="shipped" className="flex items-center gap-2">
            Shipped
            <Badge variant="secondary" className="ml-1">
              {orders.filter((order) => order.status === "shipped").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                Manage and track all incoming orders
              </CardDescription>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search by order ID or shopkeeper..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedStatus("all");
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Order ID
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Shopkeeper</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No orders found. Try a different search term or filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  order.shopkeeper.logo || "/placeholder.svg"
                                }
                                alt={order.shopkeeper.name}
                              />
                              <AvatarFallback>
                                {order.shopkeeper.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {order.shopkeeper.name}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {order.shopkeeper.location}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right">
                          {order.items.length}
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetailsDialog(true);
                            }}
                          >
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {order.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(order.id, "approved")
                                    }
                                  >
                                    Approve Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateStatus(order.id, "rejected")
                                    }
                                  >
                                    Reject Order
                                  </DropdownMenuItem>
                                </>
                              )}
                              {order.status === "approved" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "shipped")
                                  }
                                >
                                  Mark as Shipped
                                </DropdownMenuItem>
                              )}
                              {order.status === "shipped" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(order.id, "delivered")
                                  }
                                >
                                  Mark as Delivered
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Print Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="text-muted-foreground text-sm">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Orders awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Shopkeeper</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter((order) => order.status === "pending")
                    .length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No pending orders.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders
                      .filter((order) => order.status === "pending")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    order.shopkeeper.logo || "/placeholder.svg"
                                  }
                                  alt={order.shopkeeper.name}
                                />
                                <AvatarFallback>
                                  {order.shopkeeper.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {order.shopkeeper.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {order.shopkeeper.location}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-right">
                            {order.items.length}
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailsDialog(true);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="mr-2 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() =>
                                handleUpdateStatus(order.id, "approved")
                              }
                            >
                              <Check className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() =>
                                handleUpdateStatus(order.id, "rejected")
                              }
                            >
                              <X className="mr-1 h-4 w-4" /> Reject
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

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Orders</CardTitle>
              <CardDescription>Orders ready for shipping</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Shopkeeper</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter((order) => order.status === "approved")
                    .length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No approved orders.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders
                      .filter((order) => order.status === "approved")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    order.shopkeeper.logo || "/placeholder.svg"
                                  }
                                  alt={order.shopkeeper.name}
                                />
                                <AvatarFallback>
                                  {order.shopkeeper.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {order.shopkeeper.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {order.shopkeeper.location}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-right">
                            {order.items.length}
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailsDialog(true);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() =>
                                handleUpdateStatus(order.id, "shipped")
                              }
                            >
                              <Truck className="mr-1 h-4 w-4" /> Ship Order
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

        <TabsContent value="shipped" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipped Orders</CardTitle>
              <CardDescription>
                Orders in transit to shopkeepers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Shopkeeper</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter((order) => order.status === "shipped")
                    .length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No shipped orders.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders
                      .filter((order) => order.status === "shipped")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    order.shopkeeper.logo || "/placeholder.svg"
                                  }
                                  alt={order.shopkeeper.name}
                                />
                                <AvatarFallback>
                                  {order.shopkeeper.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {order.shopkeeper.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {order.shopkeeper.location}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-right">
                            {order.items.length}
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailsDialog(true);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() =>
                                handleUpdateStatus(order.id, "delivered")
                              }
                            >
                              <Check className="mr-1 h-4 w-4" /> Mark Delivered
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

      {/* Order Details Dialog */}
      <Dialog
        open={showOrderDetailsDialog}
        onOpenChange={setShowOrderDetailsDialog}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder
                ? `Order ${selectedOrder.id} from ${selectedOrder.shopkeeper.name}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedOrder.shopkeeper.logo || "/placeholder.svg"}
                      alt={selectedOrder.shopkeeper.name}
                    />
                    <AvatarFallback>
                      {selectedOrder.shopkeeper.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedOrder.shopkeeper.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedOrder.shopkeeper.location}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm">
                    Order Date
                  </div>
                  <div className="font-medium">{selectedOrder.date}</div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right font-semibold"
                      >
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <div className="font-semibold">Order Status</div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedOrder.status)}
                  <div className="text-muted-foreground text-sm">
                    {selectedOrder.status === "pending" && "Awaiting approval"}
                    {selectedOrder.status === "approved" &&
                      "Ready for shipping"}
                    {selectedOrder.status === "shipped" &&
                      "In transit to shopkeeper"}
                    {selectedOrder.status === "delivered" &&
                      "Successfully delivered"}
                    {selectedOrder.status === "rejected" &&
                      "Order was rejected"}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2">
                    Order Timeline
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600`}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="mt-1 text-xs">Ordered</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        selectedOrder.status === "approved" ||
                        selectedOrder.status === "shipped" ||
                        selectedOrder.status === "delivered"
                          ? "bg-emerald-100 text-emerald-600"
                          : selectedOrder.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {selectedOrder.status === "rejected" ? (
                        <X className="h-4 w-4" />
                      ) : selectedOrder.status === "approved" ||
                        selectedOrder.status === "shipped" ||
                        selectedOrder.status === "delivered" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <span className="mt-1 text-xs">
                      {selectedOrder.status === "rejected"
                        ? "Rejected"
                        : "Approved"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        selectedOrder.status === "shipped" ||
                        selectedOrder.status === "delivered"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {selectedOrder.status === "shipped" ||
                      selectedOrder.status === "delivered" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <span className="mt-1 text-xs">Shipped</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        selectedOrder.status === "delivered"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {selectedOrder.status === "delivered" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <span className="mt-1 text-xs">Delivered</span>
                  </div>
                </div>
                <div className="bg-muted absolute top-4 right-0 left-0 h-0.5">
                  <div
                    className={`h-full ${selectedOrder.status === "rejected" ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{
                      width:
                        selectedOrder.status === "pending"
                          ? "0%"
                          : selectedOrder.status === "rejected" ||
                              selectedOrder.status === "approved"
                            ? "33%"
                            : selectedOrder.status === "shipped"
                              ? "66%"
                              : "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div>
              {selectedOrder && selectedOrder.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive mr-2"
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "rejected");
                      setShowOrderDetailsDialog(false);
                    }}
                  >
                    <X className="mr-1 h-4 w-4" /> Reject Order
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "approved");
                      setShowOrderDetailsDialog(false);
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" /> Approve Order
                  </Button>
                </>
              )}
              {selectedOrder && selectedOrder.status === "approved" && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id, "shipped");
                    setShowOrderDetailsDialog(false);
                  }}
                >
                  <Truck className="mr-1 h-4 w-4" /> Ship Order
                </Button>
              )}
              {selectedOrder && selectedOrder.status === "shipped" && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id, "delivered");
                    setShowOrderDetailsDialog(false);
                  }}
                >
                  <Check className="mr-1 h-4 w-4" /> Mark as Delivered
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowOrderDetailsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
