import { NextRequest, NextResponse } from "next/server";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: NextRequest, {params} : { params: Promise<{ resumeId: string }>}) {
  try {

    await connectDB();

    const user = await getCurrentUser();

    const {resumeId} = await params;

    const resume = await ResumeModel.findOne({
        _id: resumeId,
        user_id: user.userId,
    })

    if(!resume) return NextResponse.json<ApiResponse>({
        success: false,
        message: "Resume not found",
    }, {status: 404})

    return NextResponse.json<ApiResponse>({
        success: true,
        message: "Resume fetched successfully",
        data: resume
    }, {status: 200})

  } catch (error) {
    console.log("error in get resume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, {params} : { params: Promise<{ resumeId: string }>}) {
  try {

    await connectDB();

    const user = await getCurrentUser();

    const body = await req.json();

    const {resumeId} = await params;

    const updatedResume = await ResumeModel.findOneAndUpdate({
        _id: resumeId,
        user_id: user.userId,
    },
    {
        $set: body,
    },
    {
        new: true,
        runValidators: true,
    }
)

    if(!updatedResume) return NextResponse.json<ApiResponse>({
        success: false,
        message: "Updated Resume failed to update",
    }, {status: 400})

    return NextResponse.json<ApiResponse>({
        success: true,
        message: "Updated Resume successfully",
        data: updatedResume
    }, {status: 200})

  } catch (error) {
    console.log("error in updated resume api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}