import React from "react";
import NavBar from "../components/Navbar"; // Tvoja navigacija
import Map from "../components/Map";
import PageHeader from "../components/PageHeader";

const QuizLocation = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <PageHeader
          title="Gde se"
          highlight="takmičimo?"
          subtitle="Lokacija dogadjaja"
        />

        <div className="relative">
          <Map />
        </div>
      </main>
    </div>
  );
};

export default QuizLocation;
