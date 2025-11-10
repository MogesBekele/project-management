// get all workspaces for user

import prisma from "../config/prisma.js";




export const getUserWorkspaces = async (req, res )=>{
  try {
    const {userId}= await req.auth();
    const workspaces = await prisma.workspace.findMany({
      where:{
        members:{some:{userId: userId}}
      },
      include:{
        members:{include:{user:true}},
        projects:{
          include:{
            tasks:{include:{assignee:true, comments:{
              include:{user:true}
            }}},
            members:{include:{user:true}}
          }
        },
        owner:true
      }
    })
    res.status(200).json({workspaces})
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    res.status(500).json({ error: "An error occurred while fetching workspaces." });
    
  }
}


// add member to workspace


export const addMember= async (req, res)=>{
  try {
    const {userId} = await req.auth()
    const {workspaceId, email, role, message }= req.body;
    //check if user is owner of workspace
    const user = await prisma.user.findUnique({where:{email}})

    if(!user){
      return res.status(404).json({message: "user not found"})
    }

    if(!workspaceId|| !role){
      return res.status(400).json({message: "workspaceId and role are required"})

    }

    if(!["ADMIN", "MEMBER"].includes(role)){
      return res.status(400).json({message: "invalid role"})
    }

    //fetch workspace

    const workspace = await prisma.workspace.findUnique({
      where:{id:workspaceId}, include:{members:true}
    })

    if(!workspace){
      return res.status(404).json({message: "workspace not found"})
    }

    //check creator has admin role


    if(!workspace.members.find((member)=> member.userId=== userId && member.role==="ADMIN")){
      return res.status(401).json({message: "only admin can add members"})
    }

    // check if user is already a member

    const existingMember = workspace.members.find((member)=> member.userId=== user.id)

    if(existingMember){
      return res.status(400).json({message: "user is already a member"})
    }

    const member = await prisma.workspaceMember.create({
      data:{
        userId:user.id,
        workspaceId,
        role,
        message
      }
    })
    res.json({member, message: "member added successfully"})
    
  } catch (error) {
    console.error("Error adding member to workspace:", error);
    res.status(500).json({ error: "An error occurred while adding member to workspace." });
    
  }
}