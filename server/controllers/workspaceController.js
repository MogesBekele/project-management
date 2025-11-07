// get all workspaces for user

import prisma from "../config/prisma";



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