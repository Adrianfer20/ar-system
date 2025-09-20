import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import CreateClient from './create/CreateClient';
import CreateProfile from './create/CreateProfile';
import CreateTickets from './create/CreateTickets';
import ImportTickets from './create/ImportTickets';
import { Page, PageHeader } from '@/components/ui/Page';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tickets");

  const tabs = [
    { id: "tickets", label: "Registrar Tickets" },
    { id: "import", label: "Importar Tickets" },
    { id: "client", label: "Registrar Cliente" },
    { id: "profile", label: "Crear Perfil de Cliente" },
  ];

  return (
    <Page>
  <PageHeader title="Registro" subtitle="Gestiona el registro de clientes y tickets." />
      <div className="">
  <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "tickets" && <CreateTickets setActiveTab={setActiveTab} />}
          {activeTab === "import" && <ImportTickets setActiveTab={setActiveTab} />}
          {activeTab === "profile" && <CreateProfile setActiveTab={setActiveTab} />}
          {activeTab === "client" && <CreateClient setActiveTab={setActiveTab} />}
        </div>
      </div>
    </Page>
  );
};

export default RegisterPage;