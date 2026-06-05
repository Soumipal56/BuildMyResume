import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperienceDescriptionBody = await req.json();

    const { experienceLevel, yearsOfExperience, techStack, jobRole } = body;

    if (!experienceLevel || !jobRole || !techStack)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

   const prompt = `
Generate a professional ATS-friendly work experience description for a resume.

Job Role:
${jobRole}

Experience Level:
${experienceLevel}

Years of Experience:
${yearsOfExperience}

Tech Stack:
${techStack}

Rules:
1. Return ONLY the work experience description.
2. Do NOT include headings, labels, bullet points, markdown, quotes, or explanations.
3. Write in a professional resume style suitable for ATS systems.
4. Generate realistic responsibilities and contributions based on the provided job role, experience level, years of experience, and tech stack.
5. Naturally incorporate the provided technologies as ATS-friendly keywords.
6. Use strong action verbs such as Developed, Designed, Implemented, Built, Optimized, Integrated, Automated, Maintained, and Collaborated.
7. Highlight software development, architecture, testing, debugging, deployment, performance optimization, and collaboration activities where appropriate.
8. Adjust the complexity and ownership of responsibilities according to the specified experience level and years of experience.
9. Keep the description between 100 and 150 words.
10. Do NOT use first-person pronouns (I, me, my, we, our).
11. Do NOT invent certifications, awards, leadership positions, or unrealistic achievements.
12. Do NOT include fake metrics, percentages, revenue figures, or user counts.
13. Ensure the description sounds like real professional experience and is suitable for direct inclusion in a resume.
14. Optimize for ATS keyword matching and recruiter readability.
15. Output only the final description text and nothing else.

Example Output:
Developed and maintained scalable web applications using React, Next.js, TypeScript, Node.js, and MongoDB, delivering responsive user interfaces and efficient backend services. Implemented RESTful APIs, authentication systems, and database integrations while optimizing application performance and reliability. Collaborated with cross-functional teams to translate business requirements into technical solutions, participated in code reviews, debugging, testing, and deployment activities, and followed modern software engineering practices to ensure maintainable and high-quality code. Contributed to application architecture, performance improvements, and feature development while leveraging Git, Docker, and cloud technologies to support efficient development workflows.`

  
  const result = await generateAiContent(prompt);

  let workExperienceDescription = result;

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Work Experience Description created",
    data: {
        workExperienceDescription
    }
  }, {status: 201})
       
  } catch (error: any) {
    console.log("Error in Work Experience Description generation api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message || error.toString() || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
