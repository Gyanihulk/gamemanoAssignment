"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { AddressSchema } from "@/schemas";
import axios from "axios";

export const AddressForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [addressExists, setAddressExists] = useState<boolean>(false); // New state to track if the address exists
  const [addressId, setAddressId] = useState<string | null>(null); //
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      phone: "",
      zipCode: "",
      country: "",
    },
  });
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // Assuming the GET request returns an object with an 'id' field
        const response = await axios.get("/api/user/address");
        const addressData = response.data;

        if (addressData) {
          form.reset(addressData);
          setAddressExists(true);
          setAddressId(addressData.id); // Store the address ID
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };

    fetchAddress();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof AddressSchema>) => {
    setError("");
    setSuccess("");

    // Determine the endpoint based on whether the address exists
    const endpoint = addressExists ? `/api/user/address/${addressId}` : "/api/user/address";

    try {
      const response = await axios({
        method: addressExists ? 'put' : 'post',
        url: endpoint,
        data: values,
      });
      setSuccess(addressExists ? "Address updated successfully." : "Address created successfully.");
      if (!addressExists) {
        setAddressExists(true);
        setAddressId(response.data.id); // Store the new address ID if the address didn't exist before
      }
    } catch (err) {
      const error = err as any;
      if (error.response && error.response.data) {
        setError(error.response.data.message as string);
      } else {
        setError("Failed to process address. Please try again.");
      }
    }
  };



  return (
    <CardWrapper
      headerLabel="Create an address"
      backButtonLabel="Open Shopping Page"
      backButtonHref="/shop"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Street field */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123 Main St"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* City field */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Anytown"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* State field */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="State"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Zip Code field */}
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="12345"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Country field */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Save Address
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
