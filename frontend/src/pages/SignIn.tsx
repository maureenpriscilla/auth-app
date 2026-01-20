import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInRequest } from "../types/api";
import { signInSchema } from "../schemas/auth.schema";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInRequest) => {
    try {
        console.log("data >>>", data)
        const res = await client.post("/auth/signin", data);
        console.log("res >>>", res)
        signIn(res.data.token, { email: data.email });
        navigate("/profile");
    } catch (err: any) {
        console.error(err.response?.data);
        alert(err?.response?.data?.error || "Sign in failed");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Welcome back</h2>

        <div className="form-group">
          <label>Email</label>
          <input {...register("email")} />
          {formState.errors.email && (
            <p className="error">{formState.errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          {formState.errors.password && (
            <p className="error">{formState.errors.password.message}</p>
          )}
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
