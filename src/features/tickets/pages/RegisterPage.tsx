import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import CreateClient from './create/CreateClient';
import CreateProfile from './create/CreateProfile';
import CreateTickets from './create/CreateTickets';
import SectionRegister from '../components/SectionRegister';
import { Page, PageHeader } from '@/components/ui/Page';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Información del Registro" },
    { id: "client", label: "Registrar Cliente" },
    { id: "profile", label: "Registrar Perfil de Cliente" },
    { id: "tickets", label: "Registrar Tickets" },
  ];

  return (
    <Page>
      <PageHeader
        title="Información de Registro"
        subtitle="Bienvenido a la página de registro de los clientes."
      />
      <div className="">
  <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="justified" />

        <div className="mt-6">
          {activeTab === "info" && <SectionRegister />}
          {activeTab === "client" && <CreateClient setActiveTab={setActiveTab} />}
          {activeTab === "profile" && <CreateProfile setActiveTab={setActiveTab} />}
          {activeTab === "tickets" && <CreateTickets setActiveTab={setActiveTab} />}
        </div>
      </div>
    </Page>
  );
};

export default RegisterPage;