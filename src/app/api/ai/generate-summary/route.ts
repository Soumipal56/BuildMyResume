import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { GenerateSummaryBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSummaryBody = await req.json();

    const { experienceLevel, skills, jobTitle } = body;

    if (!experienceLevel || !skills || !jobTitle)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

   const prompt = `
Generate a professional ATS-friendly resume summary.

Job Title:
${jobTitle}

Skills:
${skills}

Experience Level:
${experienceLevel}

Rules:
1. Return ONLY the resume summary.
2. Do NOT include headings, labels, bullet points, markdown, quotes, or explanations.
3. Keep the summary between 50 and 80 words.
4. Use a professional, recruiter-friendly tone.
5. Naturally include the provided job title and relevant skills as ATS keywords.
6. Highlight expertise, strengths, impact, and value relevant to the role.
7. Use concise, action-oriented language.
8. Optimize for Applicant Tracking Systems (ATS) and recruiter searches.
9. Do NOT use first-person pronouns (I, me, my).
10. Do NOT invent experience, achievements, certifications, or skills not provided.
11. Avoid generic filler phrases and buzzwords.
12. Ensure every sentence adds meaningful professional value.
13. Output only the final summary text and nothing else.
`;
  
  const result = await generateAiContent(prompt);

  const summary = result;

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Summary created",
    data: {
        summary
    }
  }, {status: 201})
       
  } catch (error) {
    console.log("Error in Generating summary api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
