import React, {useCallback, useContext, useState} from "react";

export type Workspace = "financiamento" | "regularizacao";

const STORAGE_KEY = "metro-workspace";

const WorkspaceContext = React.createContext(
    {} as {
        workspace: Workspace | null;
        setWorkspace(workspace: Workspace | null): void;
    }
);

type WorkspaceProviderProps = {
    children: React.ReactNode;
};

export const WorkspaceProvider = ({children}: WorkspaceProviderProps) => {
    const [workspace, setWorkspaceState] = useState<Workspace | null>(
        () => (localStorage.getItem(STORAGE_KEY) as Workspace | null) || null
    );

    const setWorkspace = useCallback((newWorkspace: Workspace | null) => {
        if (newWorkspace) {
            localStorage.setItem(STORAGE_KEY, newWorkspace);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
        setWorkspaceState(newWorkspace);
    }, []);

    return (
        <WorkspaceContext.Provider value={{workspace, setWorkspace}}>
            {children}
        </WorkspaceContext.Provider>
    );
};

// @ts-ignore
export const useWorkspace = () => useContext(WorkspaceContext);
