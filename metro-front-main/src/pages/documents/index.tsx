import { ExportOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Row, Select, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { ClientService } from "../../services/client";
import { primaryText } from "../../styles/stylesProps";

const { Title, Text } = Typography;

type Client = { id: number; name: string; linkDrive?: string };

function extractDriveFolderId(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const Documents = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);

  useEffect(() => {
    setLoading(true);
    ClientService.getClients()
      .then((res) => setClients(res.data))
      .finally(() => setLoading(false));
  }, []);

  const folderId = selected?.linkDrive
    ? extractDriveFolderId(selected.linkDrive)
    : null;

  const embedUrl = folderId
    ? `https://drive.google.com/embeddedfolderview?id=${folderId}#list`
    : null;

  return (
    <Spin spinning={loading} tip="Carregando clientes...">
      <Title level={3} {...primaryText}>
        Documentos
      </Title>

      <Form layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={14} lg={10}>
            <Form.Item label="Cliente" colon={false}>
              <Select
                showSearch
                allowClear
                placeholder="Selecione ou pesquise um cliente..."
                optionFilterProp="label"
                onChange={(clientId: number) => {
                  const client = clients.find((c) => c.id === clientId) ?? null;
                  setSelected(client);
                }}
                options={clients.map((c) => ({ value: c.id, label: c.name }))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {selected && folderId && (
            <Col xs={24} md={10} style={{ display: "flex", alignItems: "flex-end", paddingBottom: 24 }}>
              <Button
                icon={<ExportOutlined />}
                href={selected.linkDrive!}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no Drive
              </Button>
            </Col>
          )}
        </Row>
      </Form>

      {!selected && (
        <div style={{
          textAlign: "center",
          padding: "60px 0",
          color: "#aaa",
        }}>
          <FolderOpenOutlined style={{ fontSize: 48, marginBottom: 12, display: "block" }} />
          <Text type="secondary">Selecione um cliente para visualizar os documentos.</Text>
        </div>
      )}

      {selected && !folderId && (
        <Alert
          type="warning"
          showIcon
          message="Pasta do Drive não configurada"
          description={`O cliente "${selected.name}" não tem uma pasta do Google Drive vinculada. Acesse o cadastro do cliente e preencha o campo "Link do Drive".`}
          style={{ maxWidth: 520 }}
        />
      )}

      {selected && folderId && (
        <div style={{
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #e6e9ef",
          marginTop: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <iframe
            src={embedUrl!}
            title={`Documentos — ${selected.name}`}
            width="100%"
            height="620"
            style={{ border: "none", display: "block" }}
            allow="autoplay"
          />
        </div>
      )}
    </Spin>
  );
};

export default Documents;
