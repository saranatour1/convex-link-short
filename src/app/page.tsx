import { Anon } from "@/components/Anon";
import { Display } from "@/components/Display";
import { ShortnerForm } from "@/components/ShortnerForm";

export default function Home() {
  return (
    <Anon>
      <ShortnerForm />
      <Display />
    </Anon>
  );
}
