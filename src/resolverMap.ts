import { IResolvers } from 'graphql-tools';
import { query as q } from 'faunadb'
import client from './connect'
import { userType, userLoginType } from './interface';
import { organizationBuilder } from './constructor/organization';
import { workspaceBuilder } from './constructor/workspace';


//TODO: Credentials Gestion
const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string { return `👋 Hello world! 👋`; },
    async login(_: void, args: userLoginType): Promise<userType | undefined> {
      const request : any = await client.query(
        q.Get(q.Match(q.Index('unique_User_email'), args.email))
      )

      return request?.data || undefined
    },
    async users(_: void, args: void): Promise<userType[]> {
      const request : any = await client.query(q.Map(
        q.Paginate(q.Match(q.Index('users'))),
        q.Lambda(x => q.Get(x))
      ))
      return request?.data?.map((data: any) => data.data) || []
    }
  },
  Mutation: {
    async signup(_: void, args: { user: userType }): Promise<boolean> {
      const {password, ...userData} = args.user;
      const user: any = await client.query(
        q.Create(q.Collection('Users'), { data: userData, credentials: { password: password }, })
      )
      const workpace: any = await workspaceBuilder(user.ref, user.data);
      await organizationBuilder(user.ref, user.data, workpace.ref);
      return true;
    }
  }
};

export default resolverMap;