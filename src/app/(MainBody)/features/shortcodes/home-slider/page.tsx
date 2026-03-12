"use client"
import React from "react";
import Layout1 from "@/views/layouts/layout5";
import HomeSliderPage from "@/views/Features/HomeSliderPage";
import Breadcrumb from "@/views/Containers/Breadcrumb";

const HomeSlider = () => (
  <Layout1>
    <Breadcrumb parent="Element" title="Home Slider" />
    <HomeSliderPage />
  </Layout1>
);

export default HomeSlider;
