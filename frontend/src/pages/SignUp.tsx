import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpRequest } from "../types/api";
import { signUpSchema } from "../schemas/auth.schema";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const SignUp = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpRequest) => {
    try {
        await client.post("/auth/signup", data);

        // auto sign-in after successful signup
        const loginRes = await client.post("/auth/signin", data);
        signIn(loginRes.data.token, { email: data.email });
        
        // navigate to user's profile page
        navigate("/profile");
    } catch (err: any) {
        alert(err?.response?.data?.error || "Sign up failed");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create an account</h2>

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

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
