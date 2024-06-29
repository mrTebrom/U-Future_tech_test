import { Button, Drawer, Space, Form, Input, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IUser } from "../lib/interface/user.interface";
import axios from "axios";
import { UserCard } from "../component/card.user";

export const UserPage = () => {
  // Состояние для управления видимостью окна создания пользователя
  const [createUser, setCreateUser] = useState(false);

  // Функции для открытия и закрытия окна создания пользователя
  const showCreateUser = () => setCreateUser(true);
  const hideCreateUser = () => setCreateUser(false);

  // Состояние для хранения списка пользователей
  const [users, setUsers] = useState<IUser[]>([]);

  // Функция для получения списка пользователей
  const get = () => {
    axios.get("/api/user").then((result) => setUsers(result.data));
  };

  // Функция для удаления пользователя
  const destroy = (id: string) => {
    axios.delete("/api/user/" + id).then(get);
  };

  // Получение списка пользователей при монтировании компонента
  useEffect(get, []);

  return (
    <>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateUser}
        >
          Создать
        </Button>
      </Space>
      <br />
      <Space wrap>
        {users.map((item) => (
          <UserCard
            user={item}
            destroy={destroy}
            key={item._id}
          />
        ))}
      </Space>
      <CreateUser
        open={createUser}
        close={hideCreateUser}
        get={get}
      />
    </>
  );
};

const CreateUser = ({ open, close, get }: { open: boolean; close: () => void; get: () => void }) => {
  const [form] = Form.useForm(); // Форма Ant Design
  const [loading, setLoading] = useState(false); // Состояние для кнопки загрузки
  const [images, setImages] = useState<string[]>([]); // Состояние для хранения загруженных изображений

  // Функция, вызываемая при отправке формы
  const onFinish = async (values: IUser) => {
    setLoading(true);
    console.log("start");
    try {
      // Отправка данных пользователя на сервер с помощью axios
      await axios.post("/api/user", { ...values, images: images });
      console.log("axios ");
      message.success("Пользователь успешно создан");
      get(); // Обновление списка пользователей
      form.resetFields(); // Сброс полей формы
      close(); // Закрытие окна создания пользователя
    } catch (error) {
      console.log(error);
      message.error("Ошибка при создании пользователя");
    }
    setLoading(false);
  };

  // Функция для обработки загрузки файлов
  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data); // Уведомление об успешной загрузке
        setImages(data[0]); // Обновление состояния загруженных изображений
      } else {
        onError("Upload failed"); // Уведомление о неудачной загрузке
      }
    } catch (err) {
      onError("Upload failed"); // Уведомление о неудачной загрузке при ошибке
    }
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Создать пользователя"
    >
      <Form
        form={form}
        name="add_user"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: "Пожалуйста, введите имя пользователя" }]}
        >
          <Input placeholder="Имя пользователя" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Пожалуйста, введите адрес электронной почты" },
            { type: "email", message: "Пожалуйста, введите действительный адрес электронной почты" },
          ]}
        >
          <Input placeholder="Email пользователя" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Телефон"
          rules={[{ required: true, message: "Пожалуйста, введите номер телефона" }]}
        >
          <Input placeholder="Номер телефона пользователя" />
        </Form.Item>
        <Form.Item
          name="avatar"
          label="Фотография (URL)"
          rules={[{ required: true, message: "Пожалуйста, загрузите фотографию" }]}
        >
          <Upload
            name="images"
            action="/api/uploads"
            customRequest={handleUpload} // Использование кастомного запроса для загрузки
          >
            <Button>Загрузить фотографию</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ margin: "auto", display: "block" }}
          >
            Добавить пользователя
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
