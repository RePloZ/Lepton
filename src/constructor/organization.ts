import { query as q } from 'faunadb'
import client from '../connect'
import { RoleMemberEnnum, userType } from '../interface'

const organizationBuilder = async (userRef: any, user: any, workspaceRef: any) : Promise<any> => {
    const organization: any = await client.query(
        q.Create(q.Collection('Organizations'), { data: {
            name: `${user.lastName} Organization`,
            workpaces: [workspaceRef]
          }
        })
    )

    await client.query(
        q.Create(q.Collection('Members'), {
          data: {
            organization : organization.ref,
            user: userRef,
            active: true,
            role: RoleMemberEnnum.OWNER
          }
        })
      )

    return organization;
}

export { organizationBuilder }