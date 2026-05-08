import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more about the work."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  action: string;
  businessName: string;
};

export default function ContactForm({
  action,
  businessName,
}: ContactFormProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setStatusMessage("");

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("phone", values.phone ?? "");
    formData.set("message", values.message);
    formData.set("_subject", `Estimate request for ${businessName}`);

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Form endpoint returned ${response.status}`);
      }

      form.reset();
      const msg = "Request sent. We will follow up soon.";
      setStatusMessage(msg);
      toast.success("Request sent", {
        description: "Thanks for reaching out.",
      });
    } catch {
      const msg = "Could not send the form. Please email or call us instead.";
      setStatusMessage(msg);
      toast.error("Form could not be sent", {
        description: "Use the contact details on this page.",
      });
    }
  }

  return (
    <>
      <Toaster richColors />
      <Form {...form}>
        <form
          className="bg-card rounded-lg border p-6 shadow-xs"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" required {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter your full name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter the email address we should use to reply.
                  </FormDescription>
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
                    <Input type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter a phone number if you prefer a call.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      placeholder="Tell us what you need help with."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Describe the service or question you need help with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-3 sm:flex sm:items-center">
              <Button
                className="w-full sm:w-fit"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                <SendIcon aria-hidden="true" />
                {form.formState.isSubmitting ? "Sending..." : "Send Request"}
              </Button>
              {statusMessage && (
                <p
                  className="text-muted-foreground text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
