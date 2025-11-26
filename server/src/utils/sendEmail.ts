import nodemailer from 'nodemailer';
import { sendEmailDto, sendEmailResultDto } from '../dto/sendEmailDto';

export interface VerifyEmailData {
  email: string;
  content: string; // nội dung hoặc mã xác thực
}

export const sendEmail = async (
  data: sendEmailDto
  // resources: VerifyEmailData
): Promise<sendEmailResultDto> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER || 'group2hcmus@gmail.com',
      pass: process.env.APP_PASSWORD || 'tgbpcgszidtfecmr',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"group 2 - Online Auction" <group2hcmus@gmail.com>',
      to: data.email,
      subject: data.subject ?? 'Verification code',
      text: 'Message from Online Auction', // plain‑text body
      html: data.content, // HTML body
    });

    return {
      success: true,
      message: 'Send email',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: false,
      message: 'unknown error',
    };
  }
};
