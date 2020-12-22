import { IResolvers } from 'graphql-tools';
import faker from 'faker';

interface IUserLogin {
  email: string,
  password: string,
}

interface User {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

const users = new Array(6).fill(' ').map(_ => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}))

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string { return `👋 Hello world! 👋`; },
    login(_: void, args: IUserLogin): User | undefined { return users.find(
      ({email, password}) => email === args.email && password === args.password
    )},
    signup(_: void, args: void): User { return users[0] }
    users(_: void, args: void): User[] { return users }
  },
};

export default resolverMap;