import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません。Vercelの環境変数を確認してください。" },
      { status: 500 }
    );
  }

  try {
    const { name, reading, type } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `あなたは茶道と禅の専門家です。以下の${type}について、茶道を学んでいる方向けに解説してください。

「${name}」（${reading}）

以下の項目を含めてください：
1. 意味と解釈（2-3文）
2. 歴史的背景・出典（どの禅僧の言葉か、どの経典・語録に由来するか等）
3. 茶道との関わり（どのような茶席でふさわしいか、どんな心持ちで使うか）
4. 季節との関連（なぜこの季節にふさわしいか）

JSON形式で回答してください。キーは "interpretation", "history", "tea_connection", "season_relation" です。各値は日本語の文字列です。`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "AI APIの呼び出しに失敗しました。" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("\n") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI explanation error:", error);
    return NextResponse.json(
      { error: "AI解説の生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
