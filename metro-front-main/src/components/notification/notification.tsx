import { notification } from 'antd';

/*
AO CHAMAR MANDAR DE ACORDO COM O EXEMPLO
onNotification('tipo',{
    message: 'Mensagem',
    description: 'Descrição'
})
TIPOS:
success
error
warning
info
*/

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const onNotification = (type: NotificationType, data: any) => {
  return notification[type]({
    message: data.message,
    description: data.description,
  });
};

export default onNotification;