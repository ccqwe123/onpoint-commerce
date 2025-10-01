import Header from "@/Components/Header";
import MainContent from "@/Components/MainContent";
import Footer from "@/Components/Footer";
import { Helmet } from "react-helmet";

interface Props {
  welcomeText: string;
}

export default function Home({ welcomeText }: Props) {
  return (
    <>
      <Helmet>
        <title>OnPoint | Sales</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </>
  );
}
