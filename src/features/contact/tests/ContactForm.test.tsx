import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock("@/components/shared/LightToaster", () => ({
  default: () => null,
}));

import ContactForm from "@/features/contact/ContactForm";

const defaultProps = {
  action: "https://example.com/contact",
  businessName: "Test Business",
  siteKey: "test-site-key",
};

function renderForm() {
  return render(<ContactForm {...defaultProps} />);
}

describe("ContactForm rendering", () => {
  it("renders all fields", () => {
    renderForm();
    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    // Phone and Message inputs
    expect(document.querySelector('input[name="phone"]')).toBeInTheDocument();
    expect(
      document.querySelector('textarea[name="message"]'),
    ).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderForm();
    expect(
      screen.getByRole("button", { name: /send request/i }),
    ).toBeInTheDocument();
  });

  it("marks all validated fields as not invalid before submission", () => {
    renderForm();
    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toHaveAttribute("aria-invalid", "false");
    expect(screen.getByRole("textbox", { name: /last name/i })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    expect(document.querySelector('textarea[name="message"]')).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });
});

describe("ContactForm validation", () => {
  it("marks all required fields invalid when submitting empty", async () => {
    renderForm();
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /first name/i }),
      ).toHaveAttribute("aria-invalid", "true");
    });

    expect(screen.getByRole("textbox", { name: /last name/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(document.querySelector('textarea[name="message"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows a visible error paragraph for each invalid field", async () => {
    renderForm();
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    // Each field has an sr-only description + a visible error = 2 elements per text.
    // Confirm visible errors appear by checking the count increases from 1 → 2.
    await waitFor(() => {
      expect(screen.getAllByText(/enter your first name/i)).toHaveLength(2);
    });
    expect(screen.getAllByText(/enter your last name/i)).toHaveLength(2);
    expect(screen.getAllByText(/enter a valid email address/i)).toHaveLength(1);
    expect(
      screen.getAllByText(/tell us a little more about the work/i),
    ).toHaveLength(1);
  });

  it("marks email invalid for a bad format", async () => {
    renderForm();
    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "not-an-email",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });

  it("marks message invalid when fewer than 10 characters", async () => {
    renderForm();
    await userEvent.type(
      document.querySelector('textarea[name="message"]') as HTMLElement,
      "short",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(
        document.querySelector('textarea[name="message"]'),
      ).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("does not mark phone as invalid — phone is optional", async () => {
    renderForm();
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /first name/i }),
      ).toHaveAttribute("aria-invalid", "true");
    });

    expect(document.querySelector('input[name="phone"]')).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("clears the first name error when the user starts typing", async () => {
    renderForm();
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /first name/i }),
      ).toHaveAttribute("aria-invalid", "true");
    });

    await userEvent.type(
      screen.getByRole("textbox", { name: /first name/i }),
      "D",
    );

    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toHaveAttribute("aria-invalid", "false");
  });

  it("clears the email error when the user starts typing", async () => {
    renderForm();
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    await userEvent.type(screen.getByRole("textbox", { name: /email/i }), "a");

    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("passes all validation with correct field values", async () => {
    renderForm();

    await userEvent.type(
      screen.getByRole("textbox", { name: /first name/i }),
      "Dylan",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /last name/i }),
      "Logan",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "dylan@example.com",
    );
    await userEvent.type(
      document.querySelector('textarea[name="message"]') as HTMLElement,
      "I need a new website for my small business.",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    // Captcha blocks actual submission but validation should pass — no fields invalid
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /first name/i }),
      ).toHaveAttribute("aria-invalid", "false");
    });
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("treats whitespace-only first name as empty", async () => {
    renderForm();
    await userEvent.type(
      screen.getByRole("textbox", { name: /first name/i }),
      "   ",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /first name/i }),
      ).toHaveAttribute("aria-invalid", "true");
    });
  });
});
