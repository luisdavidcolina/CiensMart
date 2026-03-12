"use client"
import React from "react";
import Layout1 from "@/views/layouts/layout5";
import CollectionBannerPage from "@/views/Features/CollectionBannerPage";
import Breadcrumb from "@/views/Containers/Breadcrumb";

const CollectionBanner = () => (
  <Layout1>
    <Breadcrumb parent="Element" title="Banner" />
    <CollectionBannerPage />
  </Layout1>
);

export default CollectionBanner;
