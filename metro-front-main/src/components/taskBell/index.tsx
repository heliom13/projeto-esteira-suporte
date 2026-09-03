import React, {useEffect, useState} from "react";
import {Badge, Button} from "antd";
import {CheckSquareOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {TaskService} from "../../services/task";
import {useWorkspace} from "../../contexts/WorkspaceContext";

type TaskBellProps = {
    color?: string;
};

export const TaskBell: React.FC<TaskBellProps> = ({color = "#4096ff"}) => {
    const navigate = useNavigate();
    const {workspace} = useWorkspace();
    const [unseenCount, setUnseenCount] = useState(0);
    const tasksPath = workspace === "regularizacao" ? "/regularizacao/tarefas" : "/tarefas";

    const fetchUnseenCount = () => {
        TaskService.getUnseenCount()
            .then((response) => setUnseenCount(response.data.count))
            .catch(() => {});
    };

    useEffect(() => {
        fetchUnseenCount();
        const intervalId = setInterval(fetchUnseenCount, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Badge count={unseenCount} style={{backgroundColor: "#ff4d4f"}} offset={[10, 0]}>
            <Button
                icon={<CheckSquareOutlined/>}
                type="primary"
                onClick={() => navigate(tasksPath)}
                style={{backgroundColor: color, height: "100%", border: "none"}}
            />
        </Badge>
    );
};
