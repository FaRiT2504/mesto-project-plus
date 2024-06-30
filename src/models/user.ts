import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface User {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<User> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, User>>;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    dafault: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    dafault: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (value: string) => validator.isURL(value),
      message: 'Некорректный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Некорректный Email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password')
    .then((user: User | null) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильный пароль'));
          }

          return user;
        });
    });
});
export default mongoose.model<User, UserModel>('user', userSchema);
