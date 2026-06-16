import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "../layouts/main";
import Clients from "../pages/client";
import ClientForm from "../pages/client/form";
import Flows from "../pages/flow";
import FlowForm from "../pages/flow/form";
import Properties from "../pages/property";
import PropertyForm from "../pages/property/form";
import Processes from "../pages/process";
import PropertySellForm from "../pages/process/form";
import StepForm from "../pages/steps/form";
import Steps from "../pages/steps";
import Flow from "../pages/flow/view";
import ChangeStep from "../pages/process/changeStep";
import Documents from "../pages/documents";
import DocumentsForm from "../pages/documents/form";
import Seller from "../pages/seller";
import SellerForm from "../pages/seller/form";
import MobileLayout from "../layouts/main/mobile";
import ExternalSale from "../pages/externalProcess";
import ExternalProcessProperty from "../pages/externalProperty";
import ExternalSaleSeller from "../pages/externalSeller";
import Login from "../pages/login";
import PrivateRoute from "./privateRoute";
import Home from "../pages/home";
import ForgotPassword from "../pages/login/edit";
import EndProcess from "../pages/process/endProcess";
import ProcessInvoice from "../pages/process/invoice";
import Proposal from "../pages/proposal/ProposalList"
import CreateProposal from "../pages/proposal/create"
import RoleBasedRoute from "./RoleBasedRoute";
import Error403 from "../pages/403/Error403";
import Users from "../pages/users";
import UsersCreate from "../pages/users/create";
import UsersEdit from "../pages/users/edit";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login/>}/>
                <Route path="redefinir-senha" element={<ForgotPassword/>}/>

                <Route path="external" element={<MobileLayout/>}>
                    <Route
                        path="cliente-comprador/:externalId"
                        element={<ExternalSale/>}
                    />
                    <Route path="imovel/:externalId" element={<ExternalProcessProperty/>}/>
                    <Route
                        path="vendedor/:externalId"
                        element={<ExternalSaleSeller/>}
                    />
                </Route>
                <Route element={<PrivateRoute/>}>
                    <Route element={<MainLayout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="bancos" element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST"]}/>}>
                            <Route path="" element={<Flows/>}/>
                            <Route path="cadastrar" element={<FlowForm/>}/>
                            <Route path="visualizar/:id" element={<Flow/>}/>
                            <Route path="atualizar/:id" element={<FlowForm/>}/>
                        </Route>
                        <Route path="passos" element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST"]}/>}>
                            <Route path="" element={<Steps/>}/>
                            <Route path="cadastrar" element={<StepForm/>}/>
                            <Route path="atualizar/:id" element={<StepForm/>}/>
                        </Route>
                        <Route path="cliente-comprador"
                               element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST", "SECRETARY"]}/>}>
                            <Route path="" element={<Clients/>}/>
                            <Route path="cadastrar" element={<ClientForm/>}/>
                            <Route path="atualizar/:id" element={<ClientForm/>}/>
                        </Route>
                        <Route path="cliente-vendedor"
                               element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST", "SECRETARY"]}/>}>
                            <Route path="" element={<Properties/>}/>
                            <Route path="cadastrar" element={<PropertyForm/>}/>
                            <Route path="atualizar/:id" element={<PropertyForm/>}/>
                        </Route>
                        <Route path="propostas" element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST"]}/>}>
                            <Route path="" element={<Proposal/>}/>
                            <Route path="cadastrar" element={<CreateProposal/>}/>
                            <Route path="cadastrar/:id" element={<CreateProposal/>}/>
                        </Route>
                        <Route path="processos"
                               element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST", "PROCESSOR"]}/>}>
                            <Route path="" element={<Processes/>}/>
                            <Route path="cadastrar" element={<PropertySellForm/>}/>
                            <Route path="mudar-etapa/:id" element={<ChangeStep/>}/>
                            <Route path="finalizar-processo/:id" element={<EndProcess/>}/>
                            <Route path="nota/:id" element={<ProcessInvoice/>}/>
                        </Route>
                        <Route path="documentos" element={<RoleBasedRoute requiredRoles={["ADMIN"]}/>}>
                            <Route path="" element={<Documents/>}/>
                            <Route path="cadastrar" element={<DocumentsForm/>}/>
                            <Route path="atualizar/:id" element={<DocumentsForm/>}/>
                        </Route>
                        <Route path="imobiliaria"
                               element={<RoleBasedRoute requiredRoles={["ADMIN", "ANALYST", "SECRETARY"]}/>}>
                            <Route path="" element={<Seller/>}/>
                            <Route path="cadastrar" element={<SellerForm/>}/>
                            <Route path="atualizar/:id" element={<SellerForm/>}/>
                        </Route>
                        <Route path="usuarios" element={<RoleBasedRoute requiredRoles={["ADMIN"]}/>}>
                            <Route path="" element={<Users/>}/>
                            <Route path="cadastrar" element={<UsersCreate/>}/>
                            <Route path="atualizar" element={<UsersEdit/>}/>
                        </Route>
                    </Route>
                </Route>
                <Route path="403" element={<Error403/>}/>
            </Routes>
        </BrowserRouter>
    );
}
