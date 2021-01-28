import client from "../connect"
import { query as q } from "faunadb"
import { userType } from "../interface"

export enum accreditationPass {
    OWNER= 'OWNER'
}

export const workspaceBuilder = async (ref: any, user: userType) : Promise<any> => {
    const workspace: any = await client.query(
        q.Create(q.Collection('Workspaces'), {
            data: {name: `${user.firstName} - Personnal Space`}
        })
    )

    await client.query(
        q.Create(q.Collection('Pass'), {
            data: {
                user: ref,
                workspace: workspace.ref,
                accreditation: accreditationPass.OWNER
            }
        })
    )

    return workspace;
}
