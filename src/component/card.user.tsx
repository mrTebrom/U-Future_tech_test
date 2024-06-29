import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { IUser } from "../lib/interface/user.interface";
const { Meta } = Card;
export const UserCard = ({ user, destroy, edit }: { user: IUser; destroy: Function; edit: Function }) => {
  return (
    <Card
      style={{ maxWidth: 300 }}
      cover={
        <img
          alt={user.email}
          src={"http://localhost:5000/api/uploads/" + user.avatar}
        />
      }
      actions={[
        <EditOutlined
          key="edit"
          onClick={() => edit()}
        />,
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
