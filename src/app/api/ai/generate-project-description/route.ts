import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjectDescriptionBody = await req.json();

    const { experienceLevel, jobTitle, techStack } = body;

    if (!experienceLevel || !jobTitle || !techStack)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        { status: 400 },
      );

   const prompt = `
Generate a professional ATS-friendly resume project description.

Job Title:
${jobTitle}

Experience Level:
${experienceLevel}

Tech Stack Used:
${techStack}

Rules:
1. Return ONLY the project description text.
2. Do NOT include headings, labels, project titles, bullet points, markdown, quotes, or explanations.
3. Write in a professional, achievement-oriented resume style.
4. Describe a realistic project that matches the provided project name, job title, experience level, and tech stack.
5. Naturally incorporate the technologies as ATS-friendly keywords.
6. Highlight key functionalities, architecture, integrations, and technical implementation.
7. Use strong action verbs such as Developed, Built, Designed, Implemented, Optimized, Integrated, or Engineered.
8. Focus on technical contributions and business/user value.
9. Keep the description between 80 and 120 words.
10. Do NOT use first-person pronouns (I, me, my, we, our).
11. Do NOT include fake metrics, percentages, revenue figures, user counts, or achievements unless they can be reasonably inferred.
12. Ensure the description is suitable for direct inclusion in a professional resume.
13. Make the description sound like it was built by someone with the specified experience level.
14. Output only the final project description and nothing else.

Example Output:
Developed a full-stack task management application using Next.js, TypeScript, Node.js, Express.js, and MongoDB, enabling users to create, organize, and track tasks through an intuitive interface. Implemented secure authentication, RESTful APIs, responsive UI components, and efficient database operations to ensure scalability and performance. Integrated role-based access control and real-time updates while following modern development practices to deliver a reliable and user-friendly productivity solution.
`;
  
  const result = await generateAiContent(prompt);

  let projectDescription = result;

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Project Description created",
    data: {
        projectDescription
    }
  }, {status: 201})
       
  } catch (error: any) {
    console.log("Error in Skills generation api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message || error.toString() || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
