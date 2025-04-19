"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Factory, Store, Upload, Star, Truck, ArrowRight } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// Available categories
const availableCategories = [
  { id: "dairy", label: "Dairy" },
  { id: "bakery", label: "Bakery" },
  { id: "produce", label: "Produce" },
  { id: "confectionery", label: "Confectionery" },
  { id: "beverages", label: "Beverages" },
  { id: "snacks", label: "Snacks" },
  { id: "household", label: "Household" },
];

// Manufacturer form schema
const manufacturerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  logo: z.any().optional(),
  categories: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  rating: z.coerce.number().min(0).max(5),
  deliveryTime: z.string().min(2, {
    message: "Please specify delivery time.",
  }),
});

// Shopkeeper form schema
const shopkeeperFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  categories: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  rating: z.coerce.number().min(0).max(5),
  deliveryTime: z.string().min(2, {
    message: "Please specify delivery time.",
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manufacturer");
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Manufacturer form
  const manufacturerForm = useForm<z.infer<typeof manufacturerFormSchema>>({
    resolver: zodResolver(manufacturerFormSchema),
    defaultValues: {
      name: "",
      categories: [],
      rating: 0,
      deliveryTime: "",
    },
  });

  // Shopkeeper form
  const shopkeeperForm = useForm<z.infer<typeof shopkeeperFormSchema>>({
    resolver: zodResolver(shopkeeperFormSchema),
    defaultValues: {
      name: "",
      categories: [],
      rating: 0,
      deliveryTime: "",
    },
  });

  // Handle manufacturer registration
  function onManufacturerSubmit(
    values: z.infer<typeof manufacturerFormSchema>,
  ) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      router.push("/dashboard/manufacturer");
    }, 1500);
  }

  // Handle shopkeeper registration
  function onShopkeeperSubmit(values: z.infer<typeof shopkeeperFormSchema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      router.push("/dashboard/shopkeeper");
    }, 1500);
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Retail<span className="text-emerald-500">IQ</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Register your account to get started
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger
              value="manufacturer"
              className="flex items-center gap-2"
            >
              <Factory className="h-4 w-4" />
              Manufacturer
            </TabsTrigger>
            <TabsTrigger value="shopkeeper" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Shopkeeper
            </TabsTrigger>
          </TabsList>

          {/* Manufacturer Registration Form */}
          <TabsContent value="manufacturer">
            <Card>
              <CardHeader>
                <CardTitle>Register as a Manufacturer</CardTitle>
                <CardDescription>
                  Create your manufacturer account to start selling your
                  products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...manufacturerForm}>
                  <form
                    onSubmit={manufacturerForm.handleSubmit(
                      onManufacturerSubmit,
                    )}
                    className="space-y-6"
                  >
                    <FormField
                      control={manufacturerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo (Optional)</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <Avatar className="h-16 w-16">
                            {logoPreview ? (
                              <AvatarImage
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo preview"
                              />
                            ) : (
                              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                <Factory className="h-8 w-8" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor="logo-upload"
                            className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload Logo</span>
                            <Input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <FormField
                      control={manufacturerForm.control}
                      name="categories"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Categories</FormLabel>
                            <FormDescription>
                              Select the categories your products belong to
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {availableCategories.map((category) => (
                              <FormField
                                key={category.id}
                                control={manufacturerForm.control}
                                name="categories"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={category.id}
                                      className="flex flex-row items-start space-y-0 space-x-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            category.id,
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  category.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !== category.id,
                                                  ),
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {category.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rating */}
                    <FormField
                      control={manufacturerForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                {...field}
                              />
                            </FormControl>
                            <Star className="h-5 w-5 text-amber-500" />
                          </div>
                          <FormDescription>
                            Your initial rating (0-5). This will be updated
                            based on performance.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Delivery Time */}
                    <FormField
                      control={manufacturerForm.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Time</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input placeholder="e.g. 2-3 days" {...field} />
                            </FormControl>
                            <Truck className="h-5 w-5 text-slate-500" />
                          </div>
                          <FormDescription>
                            Average time to deliver products to retailers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Registering...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Register</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t px-6 py-4">
                <div className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link href="/" className="text-emerald-600 hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Shopkeeper Registration Form */}
          <TabsContent value="shopkeeper">
            <Card>
              <CardHeader>
                <CardTitle>Register as a Shopkeeper</CardTitle>
                <CardDescription>
                  Create your shopkeeper account to manage your retail store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...shopkeeperForm}>
                  <form
                    onSubmit={shopkeeperForm.handleSubmit(onShopkeeperSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={shopkeeperForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your store name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Categories */}
                    <FormField
                      control={shopkeeperForm.control}
                      name="categories"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Categories</FormLabel>
                            <FormDescription>
                              Select the categories your store specializes in
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {availableCategories.map((category) => (
                              <FormField
                                key={category.id}
                                control={shopkeeperForm.control}
                                name="categories"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={category.id}
                                      className="flex flex-row items-start space-y-0 space-x-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            category.id,
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  category.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !== category.id,
                                                  ),
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {category.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rating */}
                    <FormField
                      control={shopkeeperForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                {...field}
                              />
                            </FormControl>
                            <Star className="h-5 w-5 text-amber-500" />
                          </div>
                          <FormDescription>
                            Your initial rating (0-5). This will be updated
                            based on performance.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Delivery Time */}
                    <FormField
                      control={shopkeeperForm.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Time</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input placeholder="e.g. Same day" {...field} />
                            </FormControl>
                            <Truck className="h-5 w-5 text-slate-500" />
                          </div>
                          <FormDescription>
                            Average time to deliver products to customers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Registering...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Register</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t px-6 py-4">
                <div className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link href="/" className="text-emerald-600 hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
