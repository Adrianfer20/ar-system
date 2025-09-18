import React from "react";
import SectionRegister from "@/features/tickets/components/SectionRegister";
import { Page, PageHeader } from "@/components/ui/Page";

const ClientesPage: React.FC = () => {
  return (
    <Page>
      <PageHeader
        title="Clientes"
        subtitle="Explora y filtra la lista de clientes registrados."
      />
      <div className="mt-6">
        <SectionRegister />
      </div>
    </Page>
  );
};

export default ClientesPage;
