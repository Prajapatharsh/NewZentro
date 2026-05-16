
import { useForm } from "react-hook-form";
import Input from "@/components/atoms/Input";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Loader2 } from "lucide-react";
import { useSignInMutation } from "@/store/apis/AuthApi";
import { AUTH_API_BASE_URL } from "@/lib/constants/config";

interface InputForm {
  email: string;
  password: string;
}

const SignIn = () => {
  const [signIn, { error, isLoading }] = useSignInMutation();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: InputForm) => {
    try {
      await signIn(formData).unwrap();
      navigate("/");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    console.log("Using AUTH API URL:", AUTH_API_BASE_URL);
    window.location.href = `${AUTH_API_BASE_URL}/auth/${provider}`;
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <main className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6">
            Sign In
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-center text-sm p-3 rounded mb-4">
              {(error as any)?.data?.message || (error as any)?.message || "An unexpected error occurred"}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              name="email"
              type="text"
              placeholder="Email"
              control={control}
              validation={{ required: "Email is required" }}
              error={errors.email?.message}
              className="py-2.5 text-sm"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              control={control}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              error={errors.password?.message}
              className="py-2.5 text-sm"
            />

            <Link
              to="/password-reset"
              className="block text-sm text-indigo-600 hover:underline mb-4"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              className={`w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors ${
                isLoading ? "cursor-not-allowed bg-gray-400" : ""
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Testing Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              🧪 Testing Accounts
            </h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                <strong>Admin:</strong> admin@example.com / password123
              </div>
              <div>
                <strong>User:</strong> user@example.com / password123
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              These accounts have different permissions for testing various
              features.
            </p>
          </div>

        </main>
      </div>
    </>
  );
};

export default SignIn;
