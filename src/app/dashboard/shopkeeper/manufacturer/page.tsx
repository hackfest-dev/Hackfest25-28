"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  BadgePercent,
  CalendarIcon,
  Download,
  Filter,
  Gift,
  Plus,
  Search,
  Star,
  Users,
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
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import { format } from "date-fns";

// Sample customers data
const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-01-15",
    points: 450,
    tier: "Gold",
    totalSpent: 1245.67,
    visits: 12,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-02-20",
    points: 280,
    tier: "Silver",
    totalSpent: 876.45,
    visits: 8,
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-01-05",
    points: 620,
    tier: "Platinum",
    totalSpent: 2345.89,
    visits: 18,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2023-03-10",
    points: 150,
    tier: "Bronze",
    totalSpent: 456.78,
    visits: 5,
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+1 (555) 567-8901",
    joinDate: "2023-02-01",
    points: 320,
    tier: "Silver",
    totalSpent: 987.65,
    visits: 9,
  },
];

// Sample purchase history
const purchaseHistory = [
  {
    id: "INV-001",
    customerId: 1,
    date: "2023-04-15",
    items: 5,
    total: 125.45,
    pointsEarned: 12,
  },
  {
    id: "INV-002",
    customerId: 1,
    date: "2023-04-02",
    items: 3,
    total: 78.92,
    pointsEarned: 7,
  },
  {
    id: "INV-003",
    customerId: 1,
    date: "2023-03-20",
    items: 7,
    total: 156.78,
    pointsEarned: 15,
  },
  {
    id: "INV-004",
    customerId: 2,
    date: "2023-04-10",
    items: 4,
    total: 98.45,
    pointsEarned: 9,
  },
  {
    id: "INV-005",
    customerId: 2,
    date: "2023-03-25",
    items: 2,
    total: 45.67,
    pointsEarned: 4,
  },
  {
    id: "INV-006",
    customerId: 3,
    date: "2023-04-18",
    items: 8,
    total: 234.56,
    pointsEarned: 23,
  },
  {
    id: "INV-007",
    customerId: 3,
    date: "2023-04-05",
    items: 6,
    total: 178.9,
    pointsEarned: 17,
  },
  {
    id: "INV-008",
    customerId: 4,
    date: "2023-04-12",
    items: 3,
    total: 67.89,
    pointsEarned: 6,
  },
  {
    id: "INV-009",
    customerId: 5,
    date: "2023-04-08",
    items: 5,
    total: 123.45,
    pointsEarned: 12,
  },
];

// Sample rewards
const rewards = [
  {
    id: 1,
    name: "10% Off Next Purchase",
    description: "Get 10% off your next purchase",
    pointsCost: 100,
    expiryDays: 30,
  },
  {
    id: 2,
    name: "Free Coffee",
    description: "Enjoy a free coffee with your next purchase",
    pointsCost: 50,
    expiryDays: 15,
  },
  {
    id: 3,
    name: "$25 Gift Card",
    description: "Redeem a $25 gift card",
    pointsCost: 250,
    expiryDays: 60,
  },
  {
    id: 4,
    name: "Free Delivery",
    description: "Get free delivery on your next order",
    pointsCost: 75,
    expiryDays: 30,
  },
  {
    id: 5,
    name: "VIP Shopping Event",
    description: "Exclusive access to our VIP shopping event",
    pointsCost: 500,
    expiryDays: 90,
  },
];

export default function LoyaltyPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [showAddPointsDialog, setShowAddPointsDialog] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [pointsToAdd, setPointsToAdd] = useState(0);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  // Get customer details
  const customerDetails = selectedCustomer
    ? customers.find((c) => c.id === selectedCustomer)
    : null;

  // Get customer purchase history
  const customerPurchases = selectedCustomer
    ? purchaseHistory.filter((p) => p.customerId === selectedCustomer)
    : [];

  // Get tier badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-100 text-amber-800"
          >
            Bronze
          </Badge>
        );
      case "Silver":
        return (
          <Badge
            variant="outline"
            className="border-slate-300 bg-slate-100 text-slate-800"
          >
            Silver
          </Badge>
        );
      case "Gold":
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 bg-yellow-100 text-yellow-800"
          >
            Gold
          </Badge>
        );
      case "Platinum":
        return (
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-100 text-emerald-800"
          >
            Platinum
          </Badge>
        );
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  // Add new customer
  const handleAddCustomer = () => {
    // In a real app, this would add the customer to the database
    setShowAddCustomerDialog(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
    });
    // Show success message or redirect
  };

  // Add points to customer
  const handleAddPoints = () => {
    // In a real app, this would update the customer's points in the database
    setShowAddPointsDialog(false);
    setPointsToAdd(0);
    // Show success message or redirect
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Program</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date: React.SetStateAction<Date>) => date && setDate(date)}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowAddCustomerDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BadgePercent className="h-4 w-4" />
            Program Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {selectedCustomer === null ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Loyalty Customers</CardTitle>
                  <CardDescription>
                    Manage your loyalty program members
                  </CardDescription>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search customers by name, email, or phone..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Tiers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tiers</SelectItem>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
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
                            Customer
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead className="text-right">
                          Total Spent
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-muted-foreground py-4 text-center"
                          >
                            No customers found. Try a different search term or
                            filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.name}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{customer.email}</div>
                              <div className="text-muted-foreground text-xs">
                                {customer.phone}
                              </div>
                            </TableCell>
                            <TableCell>{customer.joinDate}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {customer.points}
                            </TableCell>
                            <TableCell>{getTierBadge(customer.tier)}</TableCell>
                            <TableCell className="text-right">
                              ${customer.totalSpent.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => setSelectedCustomer(customer.id)}
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
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedCustomer(customer.id);
                                      setShowAddPointsDialog(true);
                                    }}
                                  >
                                    Add Points
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit Customer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Delete Customer
                                  </DropdownMenuItem>
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
                    Showing {filteredCustomers.length} of {customers.length}{" "}
                    customers
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Tier Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Loyalty Tier Overview</CardTitle>
                  <CardDescription>
                    Distribution of customers across loyalty tiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                            <Star className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm font-medium">
                              Bronze
                            </div>
                            <div className="text-2xl font-bold">1</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <Star className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm font-medium">
                              Silver
                            </div>
                            <div className="text-2xl font-bold">2</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                            <Star className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm font-medium">
                              Gold
                            </div>
                            <div className="text-2xl font-bold">1</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <Star className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm font-medium">
                              Platinum
                            </div>
                            <div className="text-2xl font-bold">1</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Customer Details */}
              {customerDetails && (
                <>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      ← Back to Customers
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddPointsDialog(true);
                      }}
                    >
                      Add Points
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">
                              {customerDetails.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{customerDetails.name}</CardTitle>
                            <CardDescription>
                              Member since {customerDetails.joinDate}
                            </CardDescription>
                          </div>
                        </div>
                        <div>{getTierBadge(customerDetails.tier)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm font-medium">
                            Email
                          </div>
                          <div>{customerDetails.email}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm font-medium">
                            Phone
                          </div>
                          <div>{customerDetails.phone}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm font-medium">
                            Total Spent
                          </div>
                          <div className="font-bold">
                            ${customerDetails.totalSpent.toFixed(2)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm font-medium">
                            Store Visits
                          </div>
                          <div className="font-bold">
                            {customerDetails.visits}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              Loyalty Points
                            </div>
                            <div className="text-3xl font-bold">
                              {customerDetails.points}
                            </div>
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {customerDetails.tier === "Bronze" &&
                              "150 points to Silver"}
                            {customerDetails.tier === "Silver" &&
                              "220 points to Gold"}
                            {customerDetails.tier === "Gold" &&
                              "380 points to Platinum"}
                            {customerDetails.tier === "Platinum" &&
                              "Maximum tier reached"}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress
                            value={
                              customerDetails.tier === "Bronze"
                                ? (customerDetails.points / 300) * 100
                                : customerDetails.tier === "Silver"
                                  ? (customerDetails.points / 500) * 100
                                  : customerDetails.tier === "Gold"
                                    ? (customerDetails.points / 1000) * 100
                                    : 100
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Purchase History */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Purchase History</CardTitle>
                      <CardDescription>
                        View customer's purchase history and points earned
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">
                              Points Earned
                            </TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerPurchases.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-muted-foreground py-4 text-center"
                              >
                                No purchase history found for this customer.
                              </TableCell>
                            </TableRow>
                          ) : (
                            customerPurchases.map((purchase) => (
                              <TableRow key={purchase.id}>
                                <TableCell className="font-medium">
                                  {purchase.id}
                                </TableCell>
                                <TableCell>{purchase.date}</TableCell>
                                <TableCell className="text-right">
                                  {purchase.items}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${purchase.total.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-emerald-600">
                                  +{purchase.pointsEarned}
                                </TableCell>
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

                  {/* Available Rewards */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Rewards</CardTitle>
                      <CardDescription>
                        Rewards this customer can redeem with their points
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {rewards.map((reward) => (
                          <Card key={reward.id}>
                            <CardContent className="p-4">
                              <div className="flex h-full flex-col">
                                <div className="mb-2 flex items-center gap-2">
                                  <Gift className="h-5 w-5 text-emerald-500" />
                                  <h3 className="font-semibold">
                                    {reward.name}
                                  </h3>
                                </div>
                                <p className="text-muted-foreground mb-4 text-sm">
                                  {reward.description}
                                </p>
                                <div className="mt-auto flex items-center justify-between">
                                  <div className="font-semibold">
                                    {reward.pointsCost} points
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                      customerDetails.points < reward.pointsCost
                                    }
                                  >
                                    Redeem
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Rewards</CardTitle>
              <CardDescription>
                Manage your loyalty program rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => (
                  <Card key={reward.id}>
                    <CardContent className="p-4">
                      <div className="flex h-full flex-col">
                        <div className="mb-2 flex items-center gap-2">
                          <Gift className="h-5 w-5 text-emerald-500" />
                          <h3 className="font-semibold">{reward.name}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2 text-sm">
                          {reward.description}
                        </p>
                        <div className="mb-4 text-sm">
                          <span className="font-medium">Expires:</span>{" "}
                          {reward.expiryDays} days after redemption
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="font-semibold">
                            {reward.pointsCost} points
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit Reward</DropdownMenuItem>
                              <DropdownMenuItem>
                                View Redemptions
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Reward
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Reward Card */}
                <Card className="border-dashed">
                  <CardContent className="hover:bg-accent/50 flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center p-4 transition-colors">
                    <Plus className="text-muted-foreground mb-2 h-8 w-8" />
                    <p className="font-medium">Add New Reward</p>
                    <p className="text-muted-foreground text-sm">
                      Create a new loyalty reward
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Reward Redemption History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Redemptions</CardTitle>
              <CardDescription>
                Track reward redemptions by your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Points Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Smith</TableCell>
                    <TableCell>10% Off Next Purchase</TableCell>
                    <TableCell>2023-04-15</TableCell>
                    <TableCell className="text-right">100</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-100 text-emerald-800"
                      >
                        Redeemed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Brown</TableCell>
                    <TableCell>Free Coffee</TableCell>
                    <TableCell>2023-04-12</TableCell>
                    <TableCell className="text-right">50</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-yellow-300 bg-yellow-100 text-yellow-800"
                      >
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Johnson</TableCell>
                    <TableCell>$25 Gift Card</TableCell>
                    <TableCell>2023-04-10</TableCell>
                    <TableCell className="text-right">250</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-100 text-emerald-800"
                      >
                        Redeemed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Members
                  </p>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-xs text-emerald-500">+2 this month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Points Issued
                  </p>
                  <div className="text-3xl font-bold">1,820</div>
                  <p className="text-xs text-emerald-500">+105 this month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Points Redeemed
                  </p>
                  <div className="text-3xl font-bold">400</div>
                  <p className="text-xs text-emerald-500">+150 this month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Redemption Rate
                  </p>
                  <div className="text-3xl font-bold">22%</div>
                  <p className="text-xs text-emerald-500">
                    +5% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Program Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Program Performance</CardTitle>
              <CardDescription>
                Key metrics for your loyalty program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 text-muted-foreground flex h-[300px] w-full items-center justify-center rounded-md">
                Loyalty Program Performance Chart Placeholder
              </div>
            </CardContent>
          </Card>

          {/* Customer Engagement */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Engagement</CardTitle>
              <CardDescription>
                Loyalty program engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      Average Points per Customer
                    </div>
                    <div className="font-bold">364</div>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      Repeat Purchase Rate
                    </div>
                    <div className="font-bold">68%</div>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      Program Participation
                    </div>
                    <div className="font-bold">85%</div>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      Customer Retention
                    </div>
                    <div className="font-bold">92%</div>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Customer Dialog */}
      <Dialog
        open={showAddCustomerDialog}
        onOpenChange={setShowAddCustomerDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your loyalty program
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddCustomerDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Points Dialog */}
      <Dialog open={showAddPointsDialog} onOpenChange={setShowAddPointsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Points</DialogTitle>
            <DialogDescription>
              Add loyalty points to {customerDetails?.name || "customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points to Add</Label>
              <Input
                id="points"
                type="number"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select defaultValue="purchase">
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="birthday">Birthday Bonus</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddPointsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAddPoints}
            >
              Add Points
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MoreVertical(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
