import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { GenerateSkillsBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSkillsBody = await req.json();

    const { experienceLevel, jobTitle } = body;

    if (!experienceLevel || !jobTitle)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

   const prompt = `
Generate technical resume skills based on the provided job title and experience level.

Job Title:
${jobTitle}

Experience Level:
${experienceLevel}

STRICT OUTPUT REQUIREMENTS:
- Return a valid JSON array.
- The response must start with [ and end with ].
- Do NOT wrap the array in quotes.
- Do NOT return an object.
- Do NOT return markdown.
- Do NOT return code fences.
- Do NOT return explanations, notes, headings, or extra text.
- Output ONLY the raw JSON array.

CONTENT RULES:
- Include ONLY technical skills.
- Exclude all soft skills and personality traits.
- Include relevant programming languages, frameworks, libraries, databases, cloud platforms, developer tools, and technologies.
- Generate 10-20 skills.
- Remove duplicates.
- Use standard industry-recognized skill names.
- Ensure skills are relevant to the job title and experience level.

Example of VALID output:
["JavaScript","TypeScript","React","Next.js","Node.js","Express.js","MongoDB","PostgreSQL","Docker","AWS"]

Example of INVALID output:
{"skills":["JavaScript","React"]}

Example of INVALID output:
"[\"JavaScript\",\"React\"]"

Example of INVALID output:
Technical Skills:
["JavaScript","React"]
`;
  
  const result = await generateAiContent(prompt);

  let skills = result;

  if (typeof skills === "string") {
    try {
        skills = JSON.parse(skills);
    } catch (err) {
        console.log("Failed to parse skills:", err);
    }
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Skills created",
    data: {
        skills
    }
  }, {status: 201})
       
  } catch (error) {
    console.log("Error in Skills generation api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
