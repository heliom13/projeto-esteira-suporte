import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useWorkspace, Workspace} from "../contexts/WorkspaceContext";

type RequireWorkspaceProps = {
    workspace: Workspace;
};

const RequireWorkspace = ({workspace}: RequireWorkspaceProps) => {
    const {workspace: currentWorkspace} = useWorkspace();

    if (!currentWorkspace) {
        return <Navigate to="/escolha"/>;
    }

    if (currentWorkspace !== workspace) {
        return <Navigate to="/escolha"/>;
    }

    return <Outlet/>;
};

export default RequireWorkspace;
