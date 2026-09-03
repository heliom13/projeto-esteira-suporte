import React, {useCallback, useEffect, useState} from "react";
import {Badge, Button, Dropdown, List, Typography} from "antd";
import {CheckSquareOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import "moment/locale/pt-br";
import {TaskService} from "../../services/task";
import {useWorkspace} from "../../contexts/WorkspaceContext";

const {Text} = Typography;

type TaskProps = {
    id: number;
    title: string;
    description: string | null;
    assignedByName: string;
    createdAt: string;
    seen: boolean;
};

type TaskBellProps = {
    color?: string;
};

export const TaskBell: React.FC<TaskBellProps> = ({color = "#4096ff"}) => {
    moment.locale("pt-br");
    const navigate = useNavigate();
    const {workspace} = useWorkspace();
    const [unseenTasks, setUnseenTasks] = useState<TaskProps[]>([]);
    const [open, setOpen] = useState(false);
    const tasksPath = workspace === "regularizacao" ? "/regularizacao/tarefas" : "/tarefas";

    const fetchMine = useCallback(() => {
        TaskService.getMine()
            .then((response) => {
                const unseen = (response.data as TaskProps[]).filter((task) => !task.seen);
                setUnseenTasks(unseen);
                if (unseen.length > 0) {
                    setOpen(true);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        fetchMine();
        const intervalId = setInterval(fetchMine, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchMine]);

    const dismiss = useCallback(() => {
        if (unseenTasks.length > 0) {
            TaskService.markAllSeen().then(() => setUnseenTasks([]));
        }
        setOpen(false);
    }, [unseenTasks]);

    const goToTasks = () => {
        dismiss();
        navigate(tasksPath);
    };

    const overlay = (
        <div
            style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                width: 320,
                padding: "12px 0",
            }}
        >
            <div style={{padding: "0 16px 8px", borderBottom: "1px solid #f0f0f0"}}>
                <Text strong>🔔 Novas tarefas atribuídas a você</Text>
            </div>
            <List
                dataSource={unseenTasks}
                style={{maxHeight: 320, overflowY: "auto"}}
                renderItem={(task) => (
                    <List.Item style={{padding: "10px 16px", cursor: "pointer"}} onClick={goToTasks}>
                        <List.Item.Meta
                            title={task.title}
                            description={
                                <span>
                                    Por {task.assignedByName} —{" "}
                                    {moment(task.createdAt).format("DD/MM [às] HH:mm")}
                                </span>
                            }
                        />
                    </List.Item>
                )}
            />
            <div style={{padding: "8px 16px 0"}}>
                <Button block onClick={dismiss}>
                    Marcar como visto
                </Button>
            </div>
        </div>
    );

    return (
        <Dropdown
            overlay={overlay}
            visible={open}
            onVisibleChange={(visible) => {
                if (!visible) dismiss();
            }}
            placement="bottomRight"
        >
            <Badge count={unseenTasks.length} style={{backgroundColor: "#ff4d4f"}} offset={[10, 0]}>
                <Button
                    icon={<CheckSquareOutlined/>}
                    type="primary"
                    onClick={goToTasks}
                    style={{backgroundColor: color, height: "100%", border: "none"}}
                />
            </Badge>
        </Dropdown>
    );
};
