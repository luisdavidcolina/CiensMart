"use client"
import React from "react";
import { NextPage } from "next";
import Layout1 from "@/views/layouts/layout5";
import CardsPage from "@/views/pages/account/cardsPage";

const Cards: NextPage = () => {
  return (
    <Layout1>
      <CardsPage />
    </Layout1>
  );
};

export default Cards;
