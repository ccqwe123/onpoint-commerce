import Header from "@/Components/Header";
import MainContent from "@/Components/MainContent";
import Footer from "@/Components/Footer";

interface Props {
  welcomeText: string;
}

export default function Home({ welcomeText }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
