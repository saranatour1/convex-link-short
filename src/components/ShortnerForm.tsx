"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { use } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const ShortnerForm = () => {
  const user = useQuery(api.users.viewer);
  return (
    <div className="w-full h-full max-w-full px-10 flex flex-col items-center justify-center">
      <div className="w-full h-full max-w-5xl flex flex-col items-center justify-center">
      <p className="text-2xl font-bold text-center">Generate shortlinks</p>
      <span className="text-center text-sm text-gray-950/50">they automatically get deleted every 30 days</span>
      <FormEl isAnonymous={user?.isAnonymous} />
      </div>
    </div>
  );
};

const FormEl = ({ isAnonymous }: { isAnonymous?: boolean }) => {
  const addUrl = useMutation(api.links.addUrl)
  const formSchema = z.object({
    url: z.string().url(),
    name: z.string().max(32).min(8).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      // name: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form",values);
    addUrl(values)    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-8 flex items-center justify-between gap-x-4 w-full max-w-lg">
        <Collapsible className="flex w-full h-full items-center justify-between gap-x-4">
          <div className="flex flex-col items-start justify-between w-full gap-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="sr-only">link</FormLabel>
                  <FormControl>
                    <Input placeholder="add your valid url here" {...field} className="!my-0 w-full" />
                  </FormControl>
                  <FormDescription className="sr-only">add your link here</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CollapsibleContent>
              {!isAnonymous && (
                <FormField 
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">name</FormLabel>
                      <FormControl>
                        <Input placeholder="custom name?" {...field} className="!my-0 w-full" />
                      </FormControl>
                      <FormDescription className="sr-only">Customize your link here</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CollapsibleContent>
          </div>
          <CollapsibleTrigger title="more options" disabled={isAnonymous}>
            <PaperPlaneIcon />
          </CollapsibleTrigger>
        </Collapsible>
          <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
