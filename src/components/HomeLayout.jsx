const HomeLayout = ({ Header, Footer, children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export { HomeLayout };
