import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";

export default function ManufacturerDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Manufacturer Dashboard
      </h1>
      <p className="text-muted-foreground">
        Welcome back! Here's an overview of your products' performance across
        retailers.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,231.89</div>
            <p className="text-muted-foreground text-xs">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+42,234</div>
            <p className="text-muted-foreground text-xs">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retail Partners
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-muted-foreground text-xs">
              +7 new partners this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Lines</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-muted-foreground h-4 w-4"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-muted-foreground text-xs">
              +3 new lines this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="retailers" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Retailers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales by Region</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="bg-muted/20 text-muted-foreground flex h-[200px] w-full items-center justify-center rounded-md">
                  Regional Sales Chart Placeholder
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Your best-selling products across all retailers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Premium Widget",
                    "Deluxe Gadget",
                    "Ultra Device",
                    "Pro Tool",
                  ].map((product, i) => (
                    <div key={product} className="flex items-center">
                      <div className="bg-muted mr-4 flex h-[46px] w-[46px] items-center justify-center rounded">
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm leading-none font-medium">
                          {product}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          ${Math.floor(Math.random() * 10000) + 1000}.00
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        +{Math.floor(Math.random() * 100) + 10}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Network</CardTitle>
              <CardDescription>
                Overview of your product distribution channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 text-muted-foreground flex h-[300px] w-full items-center justify-center rounded-md">
                Distribution Network Map Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="retailers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retailer Performance</CardTitle>
              <CardDescription>
                Compare performance across your retail partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 text-muted-foreground flex h-[300px] w-full items-center justify-center rounded-md">
                Retailer Comparison Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
