import Header from "@/Components/Header";
import MainContent from "@/Components/MainContent";
import Footer from "@/Components/Footer";
import { PageProps } from "@/types"; 
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

export default function Home({ auth }: PageProps) {
  return (
    <>
    <Head title="OnPoint | Sales" />
      <AuthenticatedLayout user={auth.user} className="flex flex-col relative">
        <MainContent />
        <Footer />
      </AuthenticatedLayout>
    </>
  );
}
