import { Display } from "@/components/Display";
import { ShortnerForm } from "@/components/ShortnerForm";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <ShortnerForm />
      <Display />
    </Fragment>
  );
}
