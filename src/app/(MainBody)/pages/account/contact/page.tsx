"use client";
import Layout1 from "@/views/layouts/layout1";
import ContactPage from "@/views/pages/account/contactPage";
import { NextPage } from "next";

const Contact: NextPage = () => {
  return (
    <Layout1>
      <ContactPage />
    </Layout1>
  );
};

export default Contact;
