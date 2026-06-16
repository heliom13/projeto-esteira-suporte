import {
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { rowProps } from "../../utils/FormUtils";
const { Title } = Typography;
const FormItem = Form.Item;

const DelayForm = (form: any, onFinish: any) => {
  const [hasDelay, setHasDelay] = useState(false);
  return (
    <Form
      id="delayForm"
      layout="vertical"
      colon={false}
      form={form}
      onFinish={onFinish}
    >
      <Title level={4}>Houve atraso?</Title>
      <Row {...rowProps}>
        <Col span={4}>
          <Checkbox type="checkbox" onClick={() => setHasDelay(true)}>
            SIM
          </Checkbox>
        </Col>
        <Col span={4}>
          <Checkbox type="checkbox" onClick={() => setHasDelay(false)}>
            NÃO
          </Checkbox>
        </Col>
      </Row>
      {hasDelay && (
        <Row {...rowProps}>
          <Col span={18}>
            <FormItem label="Motivo" name="reason">
              <Input placeholder="Motivo" />
            </FormItem>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default DelayForm;
