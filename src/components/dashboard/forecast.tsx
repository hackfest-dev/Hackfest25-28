import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

export default function SalesForecastChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productIds, setProductIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/forecast");
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setData(result);

        // Extract product IDs from the first item
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (result.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const firstItem = result[0];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const productColumns = Object.keys(firstItem).filter((key) =>
            key.startsWith("product_"),
          );
          setProductIds(productColumns);
        }

        setLoading(false);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  if (loading)
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales Forecast</CardTitle>
          <CardDescription>Loading forecast data...</CardDescription>
        </CardHeader>
      </Card>
    );

  if (error)
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales Forecast</CardTitle>
          <CardDescription className="text-red-500">
            Error: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>30-Day Sales Forecast</CardTitle>
        <CardDescription>Predicted sales volume per product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              {productIds.map((productId, index) => (
                <Line
                  key={productId}
                  type="monotone"
                  dataKey={productId}
                  name={`Product ${productId.replace("product_", "")}`}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
