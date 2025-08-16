import { SimpleScroll } from "@/components/landing/simple-scroll";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <main className="flex-1 pt-20">
        <SimpleScroll />
      </main>
      <Footer />
    </>
  );
}
