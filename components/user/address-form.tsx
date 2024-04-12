"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
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
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import { AddressSchema } from "@/schemas";
import axios from "axios";

export const AddressForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(async() => {
      console.log(values)
      try {
        const response = await axios.post('/api/user/address', values);
        setSuccess('Address created successfully.');
      } catch (error) {
        // Check if the error response has data and a message
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to create address. Please try again.');
        }
      }
    });
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
                    <Input {...field} disabled={isPending} placeholder="123 Main St" />
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
                    <Input {...field} disabled={isPending} placeholder="Anytown" />
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
                    <Input {...field} disabled={isPending} placeholder="State" />
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
                    <Input {...field} disabled={isPending} placeholder="Phone" />
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
                    <Input {...field} disabled={isPending} placeholder="12345" />
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
                    <Input {...field} disabled={isPending} placeholder="Country" />
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
