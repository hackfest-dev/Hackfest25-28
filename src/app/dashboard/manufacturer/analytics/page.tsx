// "use client"

// import { useState } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
// import { Button } from "~/components/ui/button"
// import { Calendar } from "~/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
// import { Alert, AlertTitle } from "~/components/ui/alert"
// import { Badge } from "~/components/ui/badge"
// import { CalendarIcon, Download, AlertCircle } from "lucide-react"
// import { format } from "date-fns"

// // Sample data for regional demand
// const regionalDemandData = [
//   { region: "North", demand: 1200, growth: 15 },
//   { region: "South", demand: 1900, growth: 8 },
//   { region: "East", demand: 1500, growth: 12 },
//   { region: "West", demand: 2100, growth: 20 },
//   { region: "Central", demand: 1700, growth: 5 },
// ]

// // Sample data for product performance
// const productPerformanceData = [
//   { name: "Premium Milk", sales: 1200, growth: 15, category: "Dairy" },
//   { name: "Artisan Bread", sales: 900, growth: 8, category: "Bakery" },
//   { name: "Organic Eggs", sales: 1500, growth: 12, category: "Dairy" },
//   { name: "Fresh Apples", sales: 2100, growth: 20, category: "Produce" },
//   { name: "Dark Chocolate", sales: 1700, growth: 5, category: "Confectionery" },
//   { name: "Sparkling Water", sales: 2400, growth: 18, category: "Beverages" },
//   { name: "Potato Chips", sales: 1800, growth: -3, category: "Snacks" },
//   { name: "Laundry Detergent", sales: 1100, growth: -8, category: "Household" },
// ]

// // Sample data for sales forecast
// const salesForecastData = [
//   { month: "Jan", actual: 1200, forecast: 1200 },
//   { month: "Feb", actual: 1900, forecast: 1800 },
//   { month: "Mar", actual: 1500, forecast: 1600 },
//   { month: "Apr", actual: 2100, forecast: 2000 },
//   { month: "May", actual: 2400, forecast: 2300 },
//   { month: "Jun", actual: 1800, forecast: 2000 },
//   { month: "Jul", forecast: 2200 },
//   { month: "Aug", forecast: 2400 },
//   { month: "Sep", forecast: 2100 },
//   { month: "Oct", forecast: 1900 },
//   { month: "Nov", forecast: 2300 },
//   { month: "Dec", forecast: 2500 },
// ]

// // Sample data for heatmap
// const heatmapData = [
//   { day: "Mon", "00-04": 12, "04-08": 18, "08-12": 36, "12-16": 42, "16-20": 24, "20-24": 18 },
//   { day: "Tue", "00-04": 8, "04-08": 15, "08-12": 45, "12-16": 48, "16-20": 30, "20-24": 15 },
//   { day: "Wed", "00-04": 10, "04-08": 20, "08-12": 40, "12-16": 45, "16-20": 28, "20-24": 16 },
//   { day: "Thu", "00-04": 15, "04-08": 22, "08-12": 38, "12-16": 40, "16-20": 32, "20-24": 20 },
//   { day: "Fri", "00-04": 18, "04-08": 25, "08-12": 42, "12-16": 50, "16-20": 45, "20-24": 30 },
//   { day: "Sat", "00-04": 25, "04-08": 30, "08-12": 50, "12-16": 55, "16-20": 48, "20-24": 35 },
//   { day: "Sun", "00-04": 20, "04-08": 22, "08-12": 35, "12-16": 40, "16-20": 38, "20-24": 25 },
// ]

// // Sample alerts
// const alerts = [
//   {
//     id: 1,
//     type: "overstock",
//     product: "Sparkling Water",
//     message: "Inventory levels 35% above optimal for current demand",
//     severity: "medium",
//   },
//   {
//     id: 2,
//     type: "expiry",
//     product: "Artisan Bread",
//     message: "Batch BAT-10046 expires in 3 days with 60% inventory remaining",
//     severity: "high",
//   },
//   {
//     id: 3,
//     type: "demand",
//     product: "Premium Milk",
//     message: "Demand spike detected in North region, 28% increase",
//     severity: "medium",
//   },
//   {
//     id: 4,
//     type: "supply",
//     product: "Organic Eggs",
//     message: "Supply chain disruption detected, potential 15% delivery delay",
//     severity: "high",
//   },
// ]

// export default function AnalyticsPage() {
//   const [date, setDate] = useState<Date>(new Date())
//   const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days" | "1year">("30days")

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//         <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
//         <div className="flex items-center gap-2">
//           <Select
//             defaultValue={dateRange}
//             onValueChange={(value: "7days" | "30days" | "90days" | "1year") => setDateRange(value)}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select Range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="30days">Last 30 Days</SelectItem>
//               <SelectItem value="90days">Last 90 Days</SelectItem>
//               <SelectItem value="1year">Last Year</SelectItem>
//             </SelectContent>
//           </Select>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" className="flex items-center gap-2">
//                 <CalendarIcon className="h-4 w-4" />
//                 {format(date, "PPP")}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
//             </PopoverContent>
//           </Popover>
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" /> Export
//           </Button>
//         </div>
//       </div>

//       {/* Alerts Section */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
//         <div className="grid gap-4 md:grid-cols-2">
//           {alerts.map((alert) => (
//             <Alert
//               key={alert.id}
//               variant={alert.severity === "high" ? "destructive" : "default"}
//               className={
//                 alert.severity === "medium"
//                   ? "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
//                   : undefined
//               }
//             >
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle className="flex items-center gap-2">
//                 {alert.product}{" "}
//                 <Badge
//                   variant="outline"
//                   className={
//                     alert.type === "overstock"
//                       ? "bg-blue-100 text-blue-800 border-blue-300"
//                       : alert.type === "expiry"
//                       ? "bg-red-100 text-red-800 border-red-300"
//                       : alert.type === "demand"
//                       ? "bg-emerald-100 text-emerald-800 border-emerald-300"
//                       : "bg-purple-100 text-purple-800 border-purple-300"
//                   }
//                 >
                  
