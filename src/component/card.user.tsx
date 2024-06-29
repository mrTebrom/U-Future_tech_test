import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { IUser } from "../lib/interface/user.interface";
const { Meta } = Card;
export const UserCard = ({ user, destroy }: { user: IUser; destroy: Function }) => {
  return (
    <Card
      style={{ width: 300 }}
      cover={
        <img
          alt={user.email}
          src={"http://localhost:5000/api/uploads/" + user.avatar}
        />
      }
      actions={[
        <EditOutlined key="edit" />,
        <DeleteOutlined
          key="ellipsis"
          onClick={() => destroy(user._id)}
        />,
      ]}
    >
      <Meta
        title={user.name}
        description={user.email}
      />
    </Card>
  );
};
