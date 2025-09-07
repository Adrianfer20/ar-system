import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import CreateClient from './create/CreateClient';
import CreateProfile from './create/CreateProfile';
import CreateTickets from './create/CreateTickets';
import SectionRegister from '../components/SectionRegister';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Información del Registro" },
    { id: "client", label: "Registrar Cliente" },
    { id: "profile", label: "Registrar Perfil de Cliente" },
    { id: "tickets", label: "Registrar Tickets" },
  ];

  return (
    <div>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold capitalize'>Informacion de Registro</h1>
        <p className='text-gray-600'>Bienvenido a la página de registro de los clientes.</p>
      </header>
      <div className="">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "info" && <SectionRegister />}
          {activeTab === "client" && <CreateClient setActiveTab={setActiveTab} />}
          {activeTab === "profile" && <CreateProfile setActiveTab={setActiveTab} />}
          {activeTab === "tickets" && <CreateTickets setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;