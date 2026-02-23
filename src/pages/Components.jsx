import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeaderUnauthenticated } from "../components/HeaderUnauthenticated";
import { HeaderAuthenticated } from "../components/HeaderAuthenticated";

const Components = () => {
  return (
    <>
      <Header />
      <HeaderUnauthenticated />
      <HeaderAuthenticated />
      <Footer />
    </>
  );
};

export { Components };
