import Quiz from "@models/Quiz";
import dbConnect from "@lib/db-connect";

export async function POST(request: Request) {
  await dbConnect();

  const quizJson = await request.json();

  try {
    const quiz = await Quiz.create(quizJson); // Assuming req.body is already in the correct format
    return new Response(JSON.stringify({ quiz }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error, success: false }), {
      status: 500,
    });
  }
}
