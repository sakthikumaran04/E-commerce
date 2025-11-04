import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import BestProducts from "@/components/BestProducts";

function Home() {
  

  return (
    <main className="px-32">
      <Hero />
      <Categories />
      <BestProducts categoryId={3}/>
    </main>
  );
}

export default Home;
