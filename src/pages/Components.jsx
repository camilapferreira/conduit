import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeatherUnauthenticated } from "../components/HeatherUnauthenticated";
import { HeatherAuthenticated } from "../components/HeatherAuthenticated";

const Components = () => {
  return (
    <>
      <Header />
      <HeatherUnauthenticated />
      <HeatherAuthenticated />
      <Footer />
    </>
  );
};

export { Components };
