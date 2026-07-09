import { SendIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import LightToaster from "@/components/shared/LightToaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  action: string;
  businessName: string;
  siteKey?: string;
};

type ContactFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

type HcaptchaWindow = Window & {
  hcaptcha?: {
    getResponse: () => string;
    reset: () => void;
  };
};

export default function ContactForm({
  action,
  businessName,
  siteKey,
}: ContactFormProps) {
  const firstNameDescriptionId = useId();
  const lastNameDescriptionId = useId();
  const emailDescriptionId = useId();
  const phoneDescriptionId = useId();
  const messageDescriptionId = useId();
  const [values, setValues] = useState<ContactFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = captchaRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.disconnect();
        if (
          document.querySelector('script[src^="https://hcaptcha.com/1/api.js"]')
        ) {
          return;
        }
        const script = document.createElement("script");
        script.src = "https://hcaptcha.com/1/api.js";
        script.async = true;
        script.defer = true;
        document.head.append(script);
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function validateForm(nextValues: ContactFormValues): ContactFormErrors {
    const nextErrors: ContactFormErrors = {};

    if (!nextValues.first_name.trim()) {
      nextErrors.first_name = "Enter your first name.";
    }

    if (!nextValues.last_name.trim()) {
      nextErrors.last_name = "Enter your last name.";
    }

    const email = nextValues.email.trim();
    if (!email) {
      nextErrors.email = "Enter a valid email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (nextValues.message.trim().length < 10) {
      nextErrors.message = "Tell us a little more about the work.";
    }

    return nextErrors;
  }

  function setFieldValue<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function onSubmit(values: ContactFormValues) {
    setStatusMessage("");
    setIsSubmitting(true);

    let captchaResponse = "";
    if (siteKey) {
      captchaResponse =
        (window as HcaptchaWindow).hcaptcha?.getResponse() ?? "";
      if (!captchaResponse) {
        const msg = "Please complete the captcha before submitting.";
        setStatusMessage(msg);
        setIsSubmitting(false);
        toast.error("Captcha required", {
          description: "Complete the verification and try again.",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.set("first_name", values.first_name);
    formData.set("last_name", values.last_name);
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("message", values.message);
    if (captchaResponse) {
      formData.set("h-captcha-response", captchaResponse);
    }
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

      setValues({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
      (window as HcaptchaWindow).hcaptcha?.reset();
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <LightToaster richColors />
      <form
        className="bg-card rounded-lg border p-6 shadow-xs"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const nextErrors = validateForm(values);
          setErrors(nextErrors);

          if (Object.keys(nextErrors).length > 0) {
            return;
          }

          void onSubmit({
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            message: values.message.trim(),
          });
        }}
      >
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="first_name">
                First Name
              </label>
              <Input
                id="first_name"
                autoComplete="given-name"
                aria-describedby={firstNameDescriptionId}
                aria-invalid={errors.first_name ? "true" : "false"}
                name="first_name"
                onChange={(event) => {
                  setFieldValue("first_name", event.target.value);
                }}
                placeholder="First Name"
                required
                value={values.first_name}
              />
              <p className="sr-only" id={firstNameDescriptionId}>
                Enter your first name.
              </p>
              {errors.first_name ? (
                <p className="text-destructive text-sm">{errors.first_name}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="last_name">
                Last Name
              </label>
              <Input
                id="last_name"
                autoComplete="family-name"
                aria-describedby={lastNameDescriptionId}
                aria-invalid={errors.last_name ? "true" : "false"}
                name="last_name"
                onChange={(event) => {
                  setFieldValue("last_name", event.target.value);
                }}
                placeholder="Last Name"
                required
                value={values.last_name}
              />
              <p className="sr-only" id={lastNameDescriptionId}>
                Enter your last name.
              </p>
              {errors.last_name ? (
                <p className="text-destructive text-sm">{errors.last_name}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-describedby={emailDescriptionId}
              aria-invalid={errors.email ? "true" : "false"}
              name="email"
              onChange={(event) => {
                setFieldValue("email", event.target.value);
              }}
              placeholder="Email"
              required
              value={values.email}
            />
            <p className="sr-only" id={emailDescriptionId}>
              Enter the email address we should use to reply.
            </p>
            {errors.email ? (
              <p className="text-destructive text-sm">{errors.email}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="phone">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              aria-describedby={phoneDescriptionId}
              name="phone"
              onChange={(event) => {
                setFieldValue("phone", event.target.value);
              }}
              placeholder="Phone Number"
              value={values.phone}
            />
            <p className="sr-only" id={phoneDescriptionId}>
              Enter a phone number if you prefer a call.
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="message">
              Message
            </label>
            <Textarea
              id="message"
              aria-describedby={messageDescriptionId}
              aria-invalid={errors.message ? "true" : "false"}
              name="message"
              onChange={(event) => {
                setFieldValue("message", event.target.value);
              }}
              placeholder="Message"
              required
              rows={6}
              value={values.message}
            />
            <p className="sr-only" id={messageDescriptionId}>
              Describe the service or question you need help with.
            </p>
            {errors.message ? (
              <p className="text-destructive text-sm">{errors.message}</p>
            ) : null}
          </div>
          {siteKey ? (
            <div
              ref={captchaRef}
              className="h-captcha min-h-19.5"
              data-sitekey={siteKey}
            />
          ) : null}
          <div className="grid gap-3 sm:flex sm:items-center">
            <Button
              className="w-full sm:w-fit"
              type="submit"
              disabled={isSubmitting}
            >
              <SendIcon aria-hidden="true" />
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
            {statusMessage ? (
              <p
                className="text-muted-foreground text-sm"
                role="status"
                aria-live="polite"
              >
                {statusMessage}
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}
