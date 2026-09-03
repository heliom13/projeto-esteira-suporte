import React, {useCallback, useEffect, useRef, useState} from "react";
import {Avatar, Button, Input, Spin, Typography} from "antd";
import {SendOutlined} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/pt-br";
import styled from "styled-components";
import {ClientService} from "../../services/client";
import onNotification from "../../components/notification/notification";
import {useAuth} from "../../contexts/AuthContext";

const {Text} = Typography;
const {TextArea} = Input;

type NoteProps = {
    id: number;
    content: string;
    userName: string;
    userEmail: string;
    createdAt: string;
};

const initials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #f7f9fc;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div<{$own: boolean}>`
  display: flex;
  justify-content: ${(p) => (p.$own ? "flex-end" : "flex-start")};
  gap: 8px;
`;

const Bubble = styled.div<{$own: boolean}>`
  max-width: 65%;
  padding: 8px 12px;
  border-radius: 14px;
  border-bottom-right-radius: ${(p) => (p.$own ? "4px" : "14px")};
  border-bottom-left-radius: ${(p) => (p.$own ? "14px" : "4px")};
  background: ${(p) => (p.$own ? "#4762EA" : "#fff")};
  color: ${(p) => (p.$own ? "#fff" : "#222")};
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
`;

const InputBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
`;

const ClientChat: React.FC<{clientId: string | number}> = ({clientId}) => {
    moment.locale("pt-br");
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [notes, setNotes] = useState<NoteProps[]>([]);
    const [text, setText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchNotes = useCallback(() => {
        setLoading(true);
        ClientService.getNotes(clientId)
            .then((response) => setNotes(response.data))
            .finally(() => setLoading(false));
    }, [clientId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [notes]);

    const handleSend = () => {
        if (!text.trim()) return;
        setSending(true);
        ClientService.addNote(clientId, text.trim())
            .then((response) => {
                setNotes((prev) => [...prev, response.data]);
                setText("");
            })
            .catch(() => {
                onNotification("error", {message: "Erro", description: "Erro ao enviar nota"});
            })
            .finally(() => setSending(false));
    };

    return (
        <Spin spinning={loading} tip="Carregando...">
            <Text type="secondary" style={{display: "block", marginBottom: 12}}>
                💬 Anotações internas sobre este cliente — visível para toda a equipe.
            </Text>
            <ChatWrapper>
                <Messages>
                    {notes.length === 0 && !loading && (
                        <Text type="secondary" style={{textAlign: "center", marginTop: 40}}>
                            Nenhuma nota ainda. Comece a conversa abaixo.
                        </Text>
                    )}
                    {notes.map((note) => {
                        const own = note.userEmail === user?.email;
                        return (
                            <Row key={note.id} $own={own}>
                                {!own && <Avatar size="small">{initials(note.userName)}</Avatar>}
                                <div style={{display: "flex", flexDirection: "column", alignItems: own ? "flex-end" : "flex-start"}}>
                                    {!own && (
                                        <Text style={{fontSize: 12, color: "#888", marginBottom: 2}}>
                                            {note.userName}
                                        </Text>
                                    )}
                                    <Bubble $own={own}>
                                        <span style={{whiteSpace: "pre-wrap"}}>{note.content}</span>
                                    </Bubble>
                                    <Text style={{fontSize: 11, color: "#aaa", marginTop: 2}}>
                                        {moment(note.createdAt).format("DD/MM HH:mm")}
                                    </Text>
                                </div>
                            </Row>
                        );
                    })}
                    <div ref={messagesEndRef}/>
                </Messages>
                <InputBar>
                    <TextArea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Escreva uma nota..."
                        autoSize={{minRows: 1, maxRows: 4}}
                        onPressEnter={(e) => {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined/>}
                        loading={sending}
                        onClick={handleSend}
                        disabled={!text.trim()}
                    />
                </InputBar>
            </ChatWrapper>
        </Spin>
    );
};

export default ClientChat;
