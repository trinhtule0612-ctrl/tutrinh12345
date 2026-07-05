import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK
// Note: In a real app, this should be in .env.local as GEMINI_API_KEY
// For demo purposes and to prevent crash if not set, we'll gracefully handle missing keys
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình GEMINI_API_KEY trong biến môi trường.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { employeeName, positionName, competencies, overallScore } = body;

    if (!employeeName || !competencies) {
      return NextResponse.json(
        { error: 'Thiếu thông tin dữ liệu đầu vào' },
        { status: 400 }
      );
    }

    // Construct the prompt for Gemini
    const prompt = `
      Bạn là một chuyên gia Nhân sự (HR Expert) tư vấn về phát triển năng lực (Competency Development).
      Hãy phân tích dữ liệu đánh giá năng lực dưới đây và viết một báo cáo chi tiết, chuyên nghiệp bằng tiếng Việt.
      
      THÔNG TIN NHÂN VIÊN:
      - Tên: ${employeeName}
      - Vị trí: ${positionName}
      - Điểm đánh giá tổng hợp: ${overallScore}/5.0
      
      DỮ LIỆU ĐÁNH GIÁ CHI TIẾT (Theo khung ASK):
      ${competencies.map((c: any) => 
        `- Năng lực: ${c.name} (${c.askGroup}). Yêu cầu: ${c.required}, Thực tế: ${c.actual}, Khoảng cách (Gap): ${c.gap}`
      ).join('\n')}
      
      YÊU CẦU ĐẦU RA (Trả về ĐÚNG định dạng JSON sau, KHÔNG thêm bất kỳ văn bản nào khác ngoài JSON):
      {
        "summary": "Đoạn văn ngắn gọn (3-4 câu) tóm tắt tình hình năng lực hiện tại của nhân viên.",
        "strengths": ["Điểm mạnh 1 (dựa trên các năng lực vượt hoặc đạt yêu cầu)", "Điểm mạnh 2", ...],
        "weaknesses": ["Điểm yếu 1 (dựa trên các năng lực có gap âm)", "Điểm yếu 2", ...],
        "recommendations": ["Đề xuất hành động 1 cụ thể để cải thiện", "Đề xuất hành động 2", ...],
        "careerPath": "Nhận xét về tiềm năng thăng tiến và định hướng phát triển trong 6-12 tháng tới."
      }
    `;

    // Use Gemini 1.5 Flash for fast JSON generation
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const reportData = JSON.parse(responseText);

    return NextResponse.json({ data: reportData });
    
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xử lý yêu cầu AI: ' + error.message },
      { status: 500 }
    );
  }
}
