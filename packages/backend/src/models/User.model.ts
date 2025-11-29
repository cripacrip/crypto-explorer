import { Table, Column, Model, DefaultScope, Scopes, DataType } from 'sequelize-typescript';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Scopes(() => ({
  withPassword: {
    attributes: { exclude: [] },
  },
}))
@Table({
  timestamps: true,
  tableName: 'users',
  freezeTableName: true,
})
export default class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    unique: true,
    allowNull: false,
    type: DataType.STRING(50),
  })
  username!: string;

  @Column({
    unique: true,
    allowNull: false,
    type: DataType.STRING(100),
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  password!: string;

  @Column({
    allowNull: false,
    defaultValue: 'user',
    type: DataType.STRING(20),
  })
  role!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  refreshToken!: string | null;
}

// Helper functions for user operations
export const getUserById = async (id: number): Promise<User | null> => {
  const user = await User.findOne({
    where: { id },
  });
  return user;
};

export const getUserByCredentials = async ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<User | null> => {
  const where: Record<string, unknown> = {};

  if (username) where.username = username;
  if (email) where.email = email;

  const user = await User.scope('withPassword').findOne({
    where,
  });

  return user;
};

export const createUser = async ({
  username,
  email,
  password,
  role = 'user',
}: {
  username: string;
  email: string;
  password: string;
  role?: string;
}): Promise<User> => {
  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  return user;
};

export const updateUserRefreshToken = async (id: number, refreshToken: string | null): Promise<User | null> => {
  await User.update(
    { refreshToken },
    {
      where: { id },
    }
  );

  const user = await User.findOne({
    where: { id },
  });

  return user;
};
