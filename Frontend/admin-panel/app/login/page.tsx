import AuthLoginComponent from "@/app/components/auth";

export const metadata = {
  title: "Admin Sign In | Pro-Read",
  description: "Secure login portal for Pro-Read platform administrators",
};

export default function LoginPage() {
  return <AuthLoginComponent />;
}
