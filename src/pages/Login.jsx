import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../components/AuthProvider";

const login = async ({ email, password }) => {
  const response = await axios.post("http://localhost:3000/api/users/login", {
    email,
    password,
  });
  return response.data;
};

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>

            <ul className="error-messages">
              <li>That email is already taken</li>
            </ul>

            <form
              onSubmit={handleSubmit(async (data) => {
                try {
                  const response = await login(data);
                  setToken(response.user.token);

                  navigate("/");
                } catch (error) {
                  console.error(error);
                }
              })}
            >
              <fieldset className="form-group">
                <input
                  {...register("email")}
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  {...register("password")}
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };
