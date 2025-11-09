import nodemailer from 'nodemailer';

export interface VerifyEmailData {
  email: string;
  content: string; // nội dung hoặc mã xác thực
}

interface SendEmailResult {
  success: boolean;
  message: string;
  id?: string | null;
}

export const sendEmail = async (
  resources: VerifyEmailData
): Promise<SendEmailResult> => {
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
      to: resources.email,
      subject: 'Verification code',
      text: 'This is your code (Do not share it to anyone)', // plain‑text body
      html: `<b>${resources.content}</b>`, // HTML body
    });

    console.log(info.messageId);
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
