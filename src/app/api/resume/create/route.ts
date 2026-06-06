import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 try{
   await connectDB()

   const userId = await getCurrentUser();

   if (!userId) {
      return NextResponse.json<ApiResponse>({
         success: false,
         message: "Unauthorized",
      }, { status: 401 });
   }
   
   // Read body for modal fields
   let body: any = {};
   try {
     body = await req.json();
   } catch (e) {
     // If no body provided, ignore
   }

   const newResume = await ResumeModel.create({
      user_id: userId,
      title: body.title || "",
      jobTitle: body.jobTitle || "",
      experienceLevel: body.experienceLevel || "",
      summary: "",
      personalInfo: {},
      workExperience: [],
      projects: [],
      education: [],
      certifications: [],
      skills: []
   })

   return NextResponse.json<ApiResponse>({
      success: true, message: "Resume created successfully",
      data: newResume
   }, { status: 201 })

    
 } catch (err) {
   console.log("Error in creating resume api", err)
   return NextResponse.json<ApiResponse>({
      success: false,
      message: "Something went wrong"
   }, { status: 500 })
 }
}

