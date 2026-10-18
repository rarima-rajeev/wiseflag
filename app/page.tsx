import Hero from "@/components/Hero";
import CardGrid from "@/components/CardGrid";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-center">
      <Hero />
      <CardGrid />
    </main>
  );
}
