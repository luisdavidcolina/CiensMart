"use client"
import React from "react";
import { NextPage } from "next";
import Layout1 from "@/views/layouts/layout5";
import CategoryPage from "@/views/Features/CategoryPage";
import Breadcrumb from "@/views/Containers/Breadcrumb";

const Category: NextPage = () => (
  <Layout1>
    <Breadcrumb parent="Element" title="Category" />
    <CategoryPage />
  </Layout1>
);

export default Category;
