import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { ImproveContentBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContentBody = await req.json();

    const { content } = body;

    if (!content)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

    const prompt = `
You are an expert resume writer, ATS optimization specialist, and recruiter.

Resume Content:
${content}

Task:
Improve and rewrite the provided resume content to make it more professional, ATS-friendly, concise, impactful, and recruiter-friendly.

Rules:
1. Return ONLY the improved content.
2. Do NOT include headings, labels, markdown, bullet points, numbering, quotes, explanations, notes, or commentary.
3. Preserve the original meaning, intent, and factual information.
4. Do NOT invent new skills, technologies, achievements, certifications, responsibilities, metrics, or experience that are not present in the original content.
5. Improve grammar, clarity, readability, professionalism, and keyword optimization.
6. Replace weak or passive language with strong, action-oriented language where appropriate.
7. Optimize for Applicant Tracking Systems (ATS) by naturally incorporating relevant industry-standard terminology already present in the content.
8. Remove filler words, redundancy, vague statements, and unnecessary phrases.
9. Ensure the content sounds professional, achievement-oriented, and suitable for a modern resume.
10. Maintain a concise format while maximizing impact.
11. Keep all technical terms, technologies, and domain-specific keywords intact.
12. Do NOT use first-person pronouns such as "I", "me", "my", "we", or "our".
13. If the content is already strong, refine wording and ATS optimization without significantly changing the structure.
14. Preserve the content type. For example:
    - Summary → return an improved summary.
    - Project description → return an improved project description.
    - Work experience description → return an improved work experience description.
    - Skills list → return an improved skills list.
15. Ensure the final output is suitable for direct placement in a professional resume.
16. Output only the rewritten content and nothing else.
`;
  
  const result = await generateAiContent(prompt);

  const AtsScore = result;

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "ATS Score Calculated",
    data: {
        AtsScore
    }
  }, {status: 201})
       
  } catch (error) {
    console.log("Error in improving content api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
