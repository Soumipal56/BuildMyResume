import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { GenerateProjectTechStackBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjectTechStackBody = await req.json();

    const { projectTitle, projectDescription } = body;

    if (!projectTitle)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing project title",
        },
        { status: 400 },
      );

   const prompt = `
Generate a list of technical skills/technologies (tech stack) used for a software project.

Project Title:
${projectTitle}

Project Description:
${projectDescription || 'No description provided.'}

STRICT OUTPUT REQUIREMENTS:
- Return a valid JSON array of strings.
- The response must start with [ and end with ].
- Do NOT wrap the array in quotes.
- Do NOT return an object.
- Do NOT return markdown.
- Do NOT return code fences.
- Output ONLY the raw JSON array.
- Include 3 to 10 relevant technologies.
`;
  
  const result = await generateAiContent(prompt);

  let techStack = result;

  if (typeof techStack === "string") {
    try {
        techStack = JSON.parse(techStack);
    } catch (err) {
        console.log("Failed to parse tech stack:", err);
    }
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Tech stack generated",
    data: {
        techStack
    }
  }, {status: 201})
       
  } catch (error) {
    console.log("Error in Tech Stack generation api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
