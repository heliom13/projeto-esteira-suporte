import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buttonRadius } from "../../components/button";
import onNotification from "../../components/notification/notification";
import { DocumentsService } from "../../services/documents";
import { marginTop, primaryText } from "../../styles/stylesProps";
import { rowProps } from "../../utils/FormUtils";
const { Title } = Typography;
const { Text } = Typography;
const FormItem = Form.Item;

type DocumentProps = {
  id: number;
  description: string;
};

const Documents = () => {
  const [loading, setLoading] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setLoading(true);
    DocumentsService.deleteDocument(id)
      .then(() => {
        onNotification("success", {
          message: "Sucesso",
          description: "Documento excluído com sucesso",
        });
        fetchDocuments();
      })
      .catch(() => {
        setLoading(false);
        onNotification("error", {
          message: "Erro",
          description: "Não foi possível excluir o documento",
        });
      });
  };

  const fetchDocuments = useCallback(() => {
    setLoading(true);
    DocumentsService.typesDocuments()
      .then((response) => {
        setLoading(false);
        setDocumentsList(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onNotification("error", {
          message: "Erro",
          description: "Erro ao carregar os dados",
        });
      });
  }, []);

  useEffect(() => {
    fetchDocuments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Descrição",
      render: (r: DocumentProps) => <Text> {r.description} </Text>,
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: "Ação",
      render: (r: DocumentProps) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#FF8C00" }}
            onClick={() => navigate(`atualizar/${r.id}`)}
          />
          <Popconfirm
            title="Deseja excluir este documento?"
            onConfirm={() => handleDelete(r.id)}
            okText="Sim"
            cancelText="Não"
          >
            <DeleteOutlined style={{ color: "#B22222" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Spin spinning={loading} tip="Carregando...">
      <Title level={3} {...primaryText}>
        Documentos
      </Title>
      <Form layout="vertical">
        <Row {...rowProps}>
          <Col span={12}>
            <FormItem colon={false} label="Descrição" name="description">
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Space>
          <Button type="primary" icon={<SearchOutlined />} {...buttonRadius}>
            Pesquisar
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("cadastrar")}
            {...buttonRadius}
          >
            Cadastrar
          </Button>
        </Space>
      </Form>
      <Table
        columns={columns}
        dataSource={documentsList}
        {...marginTop}
        rowKey={(r: DocumentProps) => r.id}
      />
    </Spin>
  );
};
export default Documents;
