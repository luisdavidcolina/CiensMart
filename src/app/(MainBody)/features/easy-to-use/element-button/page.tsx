"use client";
import Breadcrumb from "@/views/Containers/Breadcrumb";
import Button from "@/views/Features/button";
import Layout1 from "@/views/layouts/layout1";
import { NextPage } from "next";

const ButtonElement: NextPage = () => {
  return (
    <Layout1>
      <Breadcrumb parent="Element" title="Button" />
      <Button />
    </Layout1>
  );
};

export default ButtonElement;
