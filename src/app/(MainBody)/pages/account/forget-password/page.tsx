"use client"
import React from "react";
import { NextPage } from "next";
import Layout1 from "@/views/layouts/layout5";
import ForgetPasswordPage from "@/views/pages/account/forgetPasswordPage";

const ForgetPassword: NextPage = () => {
  return (
    <Layout1>
      <ForgetPasswordPage />
    </Layout1>
  );
};

export default ForgetPassword;
