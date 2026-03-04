import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const createUser = async ({ username, email, password }) => {
  const response = await axios.post("http://localhost:3000/api/users", {
    username,
    email,
    password,
  });
  return response.data;
};

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/login">Have an account?</a>
            </p>

            <ul className="error-messages">
              <li>That email is already taken</li>
            </ul>

            <form
              onSubmit={handleSubmit(async (data) => {
                try {
                  await createUser(data);
                  navigate("/");
                } catch (error) {
                  console.error(error);
                }
              })}
            >
              <fieldset className="form-group">
                <input
                  {...register("username")}
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Username"
                />
              </fieldset>
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
              <button
                type="submit"
                className="btn btn-lg btn-primary pull-xs-right"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Register };
