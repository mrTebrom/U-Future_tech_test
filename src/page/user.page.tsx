import { Button, Drawer, Space, Form, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { IUser } from "../lib/interface/user.interface";
import axios from "axios";
export const UserPage = () => {
  // Создание пользователья
  const [createUser, setCreateUser] = useState(false); // окно создание пользователья
  const showCreateUser = () => setCreateUser(true);
  const hideCreateUser = () => setCreateUser(false);
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
      <CreateUser
        open={createUser}
        close={hideCreateUser}
      />
    </>
  );
};

const CreateUser = ({ open, close }: { open: boolean; close: () => void }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const onFinish = (values: IUser) => {
    setLoading(true);
    // Добавить пользователя (может быть вызов API)
    axios.post("/api/user", { ...values, images: images });
    console.log(values);
    form.resetFields();
    setLoading(false);
    close();
  };
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
        onSuccess(data);
        setImages(data[0]);
      } else {
        onError("Upload failed");
      }
    } catch (err) {
      onError("Upload failed");
    }
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Создать пользователья"
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
          rules={[{ required: true, message: "Пожалуйста, введите URL фотографии" }]}
        >
          <Upload
            name="images"
            action="/api/uploads"
            customRequest={handleUpload}
          >
            <Button>Фотографии пользователя</Button>
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
