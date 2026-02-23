const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateExplanation = async (question, correctAnswer, userAnswer) => {
  const prompt = `
You are a GATE exam tutor.

Question: ${question}
Correct Answer: ${correctAnswer}
Student Answer: ${userAnswer}

Explain clearly:
1. Why the correct answer is correct
2. Why the student answer is wrong
3. Concept behind it
Keep it concise and exam-focused.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

module.exports = generateExplanation;