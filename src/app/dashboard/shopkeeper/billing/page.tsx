"use client";

import { useState, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  CreditCard,
  Minus,
  Plus,
  Printer,
  Receipt,
  Search,
  Trash2,
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
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { api } from "~/trpc/react";

// Sample product data
const productDatabase = [
  {
    id: 1,
    name: "Organic Milk",
    brand: "Farm Fresh",
    price: 3.99,
    category: "Dairy",
    barcode: "8901234567890",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    brand: "Healthy Bake",
    price: 2.49,
    category: "Bakery",
    barcode: "8901234567891",
  },
  {
    id: 3,
    name: "Free Range Eggs (12)",
    brand: "Happy Hens",
    price: 4.99,
    category: "Dairy",
    barcode: "8901234567892",
  },
  {
    id: 4,
    name: "Organic Apples (1kg)",
    brand: "Nature's Best",
    price: 5.99,
    category: "Produce",
    barcode: "8901234567893",
  },
  {
    id: 5,
    name: "Dark Chocolate Bar",
    brand: "Sweet Delights",
    price: 3.49,
    category: "Confectionery",
    barcode: "8901234567894",
  },
  {
    id: 6,
    name: "Sparkling Water (6-pack)",
    brand: "Crystal Clear",
    price: 4.99,
    category: "Beverages",
    barcode: "8901234567895",
  },
  {
    id: 7,
    name: "Potato Chips",
    brand: "Crunchy Bites",
    price: 2.99,
    category: "Snacks",
    barcode: "8901234567896",
  },
  {
    id: 8,
    name: "Laundry Detergent",
    brand: "Clean & Fresh",
    price: 8.99,
    category: "Household",
    barcode: "8901234567897",
  },
];

// Sample recent bills
const recentBills = [
  {
    id: "INV-001",
    date: "2023-04-18",
    items: 5,
    total: 45.97,
    customer: "Walk-in Customer",
  },
  {
    id: "INV-002",
    date: "2023-04-18",
    items: 3,
    total: 22.47,
    customer: "John Smith",
  },
  {
    id: "INV-003",
    date: "2023-04-17",
    items: 8,
    total: 67.92,
    customer: "Walk-in Customer",
  },
  {
    id: "INV-004",
    date: "2023-04-17",
    items: 2,
    total: 12.98,
    customer: "Sarah Johnson",
  },
  {
    id: "INV-005",
    date: "2023-04-16",
    items: 6,
    total: 54.94,
    customer: "Walk-in Customer",
  },
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

export default function BillingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [date, setDate] = useState<Date>(new Date());
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const fetchInventory = api.shopkeeper.getInventory.useQuery({id:1});
  const createBill = api.shopkeeper.createBilling
    .useMutation({
      onSuccess: () => {
        // Handle success (e.g., show a success message or redirect)
        setCart([]);
        setDiscount(0);
        setCustomerName("Walk-in Customer");
      },
      onError: (error) => {
        // Handle error (e.g., show an error message)
        console.error("Error creating bill:", error);
      },
    });
  // Filter products based on search term
  const filteredProducts= fetchInventory.data
  //  = productDatabase.filter(
  //   (product) =>
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.barcode.includes(searchTerm),
  // );

  // Add product to cart
  const addToCart = (product: (typeof productDatabase)[0]) => {
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
            quantity: 1,
            total: product.price,
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

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);

  // Calculate tax (assuming 10%)
  const tax = subtotal * 0.1;

  // Calculate total
  const total = subtotal + tax - discount;

  // Handle payment
  const handlePayment = () => {
    // In a real app, this would process the payment and generate a receipt
    setShowPaymentDialog(false);
    setCart([]);
    setDiscount(0);
    setCustomerName("Walk-in Customer");
    // Show success message or redirect
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                required={true}
                selected={date}
                onSelect={(date: SetStateAction<Date>) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Product Search and Selection */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Search and add products to the bill
            </CardDescription>
            <div className="relative mt-2">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search by name, brand, or scan barcode..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader className="bg-background sticky top-0">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground py-4 text-center"
                      >
                        No products found. Try a different search term.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell className="text-right">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add to cart</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )} */}

{filteredProducts && (

    <div>
     
       {/* {JSON.stringify(filteredProducts.shopItem)} */}
      
       <TableRow key={filteredProducts.id}>
        
      {filteredProducts.shopItem && (
        <div>
         
          <TableCell className="font-medium">
                          {filteredProducts.shopItem.name}
                        </TableCell>
          <TableCell className="font-medium">
            {filteredProducts.shopItem.brand}
          </TableCell>
          {/* <TableCell>{filteredProducts.product.manufacturerId}</TableCell> */}
          <TableCell className="text-right">
                          ${filteredProducts.shopItem.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addToCart({
                              id: filteredProducts.shopItem.id,
                              name: filteredProducts.shopItem.name,
                              price: filteredProducts.shopItem.price,
                              brand: filteredProducts.shopItem.brand,
                              category: filteredProducts.shopItem?.category ?? "Unknown",
                              barcode: "8901234567890",
                            })}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add to cart</span>
                          </Button>
                        </TableCell>
        </div>
      )}
                        
                        
                        
                   
         </TableRow>

   

      
    </div>

)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Current Bill */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Current Bill</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="h-8 px-2"
              >
                <Trash2 className="mr-1 h-4 w-4" /> Clear
              </Button>
            </div>
            <div className="mt-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[250px] overflow-auto px-6">
              {cart.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  No items added yet. Search and add products from the left.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground text-sm">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-6 w-6"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-2 px-6 py-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="h-7 w-16 text-right"
                  />
                  <span>$</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            disabled={cart.length === 0}
            onClick={() => {
              setShowPaymentDialog(true);
              createBill.mutate({
                shopkeeperId: 1, // Replace with the correct shopkeeperId
                amount: total,
                paymentMethod: "Cash", // Replace with the selected payment method
                invoice: `INV-${Date.now()}`, // Generate unique invoice number
                invoiceDate: new Date(), // Current date
                // customerId: customerName === "Walk-in Customer" ? null : 123, // Replace "123" with the correct customer ID if applicable
              });
            }}
          >
            <Receipt className="mr-2 h-4 w-4" /> Generate Bill
          </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={cart.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Bills */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
          <CardDescription>
            View and manage your recent transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBills.slice(0, 2).map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.customer}</TableCell>
                      <TableCell className="text-right">{bill.items}</TableCell>
                      <TableCell className="text-right">
                        ${bill.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Printer className="mr-1 h-4 w-4" /> Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="yesterday" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBills.slice(2, 4).map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.customer}</TableCell>
                      <TableCell className="text-right">{bill.items}</TableCell>
                      <TableCell className="text-right">
                        ${bill.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Printer className="mr-1 h-4 w-4" /> Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="week" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.customer}</TableCell>
                      <TableCell className="text-right">{bill.items}</TableCell>
                      <TableCell className="text-right">
                        ${bill.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Printer className="mr-1 h-4 w-4" /> Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select a payment method to complete the transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex h-20 flex-col items-center justify-center"
              >
                <CreditCard className="mb-2 h-6 w-6" />
                Card Payment
              </Button>
              <Button
                variant="outline"
                className="flex h-20 flex-col items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 h-6 w-6"
                >
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
                Cash Payment
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-tendered">Amount Tendered</Label>
              <Input
                id="amount-tendered"
                type="number"
                defaultValue={Math.ceil(total)}
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>Change Due:</span>
              <span>${(Math.ceil(total) - total).toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handlePayment}
            >
              Complete Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
