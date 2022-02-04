import "src/utils/firebase";

import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";

import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { Spacer } from "src/components/spacer";
import { Heading, P } from "src/components/text";
import { EmailInput } from "src/components/text-input";
import { useToast } from "src/hooks/use-toast";
import { AuthLayout } from "src/layouts/auth";
import { api } from "src/utils/api-client";

export default function ForgotPassword() {
  const router = useRouter();
  const toast = useToast();

  const { form, use, reset } = useForm({
    defaultValues: { email: router.query.email },
    onSubmit: async (values) => {
      await api.post("/api/account/forgot-password", { email: values.email });
      reset({ email: "" });
      toast.show({
        message: "Reset password email has been sent",
      });
    },
  });

  return (
    <AuthLayout>
      <Heading level={2}>Forgot password?</Heading>
      <P>
        No problem. Enter your email below to reset it. You'll get an email with
        a link to confirm the email address.
      </P>

      <Spacer h="1.8rem" />
      <form ref={form} noValidate>
        <FormGrid gap=".6rem">
          <Field
            name="email"
            Input={EmailInput}
            inputProps={{ placeholder: "your@email.com" }}
            showError={false}
            required
          />
          <Button
            type="submit"
            size="large"
            intent="primary"
            disabled={use("isSubmitting")}
          >
            Reset password
          </Button>
        </FormGrid>
      </form>

      <P>
        Get back to the <Link href="/auth/sign-in">sign in</Link> page.
      </P>
    </AuthLayout>
  );
}
