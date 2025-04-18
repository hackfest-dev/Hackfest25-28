"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { useState, type SetStateAction } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  Pie,
  Cell,
} from "recharts";

// Sample data for sales trends
const dailySalesData = [
  { day: "Mon", sales: 1200, transactions: 48 },
  { day: "Tue", sales: 1900, transactions: 56 },
  { day: "Wed", sales: 1500, transactions: 42 },
  { day: "Thu", sales: 2100, transactions: 64 },
  { day: "Fri", sales: 2400, transactions: 72 },
  { day: "Sat", sales: 2800, transactions: 86 },
  { day: "Sun", sales: 1800, transactions: 54 },
];

const weeklySalesData = [
  { week: "Week 1", sales: 9500, transactions: 285 },
  { week: "Week 2", sales: 11200, transactions: 336 },
  { week: "Week 3", sales: 10800, transactions: 324 },
  { week: "Week 4", sales: 12500, transactions: 375 },
];

// Sample data for product performance
const productPerformanceData = [
  { name: "Dairy", value: 25, color: "#10b981" },
  { name: "Bakery", value: 15, color: "#3b82f6" },
  { name: "Produce", value: 20, color: "#f59e0b" },
  { name: "Beverages", value: 18, color: "#8b5cf6" },
  { name: "Snacks", value: 12, color: "#ef4444" },
  { name: "Household", value: 10, color: "#6366f1" },
];

// Sample data for fast/slow moving products
const fastMovingProducts = [
  { name: "Organic Milk", sales: 120, growth: 15 },
  { name: "Whole Wheat Bread", sales: 95, growth: 8 },
  { name: "Free Range Eggs", sales: 85, growth: 12 },
  { name: "Sparkling Water", sales: 75, growth: 20 },
  { name: "Potato Chips", sales: 65, growth: 5 },
];

const slowMovingProducts = [
  { name: "Gluten-Free Pasta", sales: 12, growth: -5 },
  { name: "Vegan Cheese", sales: 15, growth: -8 },
  { name: "Kombucha", sales: 18, growth: -3 },
  { name: "Organic Quinoa", sales: 20, growth: -2 },
  { name: "Almond Flour", sales: 22, growth: -10 },
];

// Sample data for restocking suggestions
const restockingSuggestions = [
  {
    name: "Organic Milk",
    currentStock: 5,
    suggestedStock: 30,
    priority: "High",
  },
  {
    name: "Whole Wheat Bread",
    currentStock: 8,
    suggestedStock: 25,
    priority: "High",
  },
  {
    name: "Free Range Eggs",
    currentStock: 10,
    suggestedStock: 20,
    priority: "Medium",
  },
  {
    name: "Sparkling Water",
    currentStock: 12,
    suggestedStock: 40,
    priority: "Medium",
  },
  {
    name: "Potato Chips",
    currentStock: 4,
    suggestedStock: 35,
    priority: "High",
  },
];

export default function AnalyticsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days">(
    "30days",
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Select
            defaultValue={dateRange}
            onValueChange={(value: "7days" | "30days" | "90days") =>
              setDateRange(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Sales Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
          <CardDescription>
            View your daily and weekly sales performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="pt-4">
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales ($)",
                    color: "hsl(var(--chart-1))",
                  },
                  transactions: {
                    label: "Transactions",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="var(--color-sales)"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--color-transactions)"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--color-sales)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="transactions"
                      stroke="var(--color-transactions)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="weekly" className="pt-4">
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales ($)",
                    color: "hsl(var(--chart-1))",
                  },
                  transactions: {
                    label: "Transactions",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="var(--color-sales)"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--color-transactions)"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--color-sales)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="transactions"
                      stroke="var(--color-transactions)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Category Breakdown and Product Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Sales distribution by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {productPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Fast vs. slow moving products</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fast">
              <TabsList>
                <TabsTrigger value="fast">Fast Moving</TabsTrigger>
                <TabsTrigger value="slow">Slow Moving</TabsTrigger>
              </TabsList>
              <TabsContent value="fast" className="pt-4">
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales",
                      color: "hsl(var(--chart-1))",
                    },
                    growth: {
                      label: "Growth (%)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fastMovingProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="sales" fill="var(--color-sales)" />
                      <Bar dataKey="growth" fill="var(--color-growth)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="slow" className="pt-4">
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales",
                      color: "hsl(var(--chart-1))",
                    },
                    growth: {
                      label: "Growth (%)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={slowMovingProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="sales" fill="var(--color-sales)" />
                      <Bar dataKey="growth" fill="var(--color-growth)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Restocking Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Restocking Suggestions</CardTitle>
          <CardDescription>
            AI-powered inventory recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-center">Current Stock</th>
                  <th className="px-4 py-3 text-center">Suggested Stock</th>
                  <th className="px-4 py-3 text-center">Priority</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {restockingSuggestions.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-muted/50" : ""}
                  >
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={
                          item.currentStock < 10 ? "font-bold text-red-500" : ""
                        }
                      >
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.suggestedStock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-1 text-xs font-medium",
                          item.priority === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : item.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                        )}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline">
                        Reorder
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sales Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Insights</CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm font-medium">
                Average Transaction Value
              </div>
              <div className="text-3xl font-bold">$32.45</div>
              <div className="flex items-center text-xs text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                    clipRule="evenodd"
                  />
                </svg>
                +4.5% from last period
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm font-medium">
                Customer Retention Rate
              </div>
              <div className="text-3xl font-bold">78.3%</div>
              <div className="flex items-center text-xs text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                    clipRule="evenodd"
                  />
                </svg>
                +2.1% from last period
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm font-medium">
                Inventory Turnover Rate
              </div>
              <div className="text-3xl font-bold">6.2x</div>
              <div className="flex items-center text-xs text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                -0.8% from last period
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
