import nodemailer from "nodemailer";
// import { Resend } from "resend";
import { sendEmailDto, sendEmailResultDto } from "../dto/sendEmailDto";


export const loadCodeTemplate = (code: string) => {
  return `
  <div style="max-width:500px;margin:auto;font-family:Arial background:#f4f6fb;padding:20px;border-radius:10px;">
    <h2 style="color:#4f46e5;text-align:center;">Mã xác thực</h2>
    <p>Vui lòng sử dụng mã dưới đây để xác minh tài khoản:</p>
    <div style="text-align:center;margin:20px 0;">
      <span style="font-size:28px;letter-spacing:6px;font-weight:bold;background:#fff;padding:10px 20px;border-radius:8px;color:#4f46e5;">
        ${code}
      </span>
    </div>
    <p style="font-size:13px;color:#777;">Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ với người khác.</p>
  </div>`;
};

export const loadResetTemplate = (link: string) => {
  return `
      <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;">
        <h3 style="margin-top:0;">Reset password</h3>
        <p>Click vào nút bên dưới để đặt lại mật khẩu. Liên kết này sẽ hết hạn sau 15 phút.</p>
        <p style="text-align:center;margin:20px 0;">
          <a href="${link}" 
             style="display:inline-block;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;background:#4f46e5;color:#fff;">
            Đặt lại mật khẩu
          </a>
        </p>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      </div>
    `;
};

export const loadBidSuccessTemplateForBidder = (
  userName: string,
  productName: string,
  price: string
) => {
  return `
    <div style="
      max-width:500px;
      margin:auto;
      font-family:Arial,sans-serif;
      padding:20px;
      border-radius:8px;
      border:1px solid #eee;
      background:#ffffff;
    ">
      <h3 style="margin-top:0;color:#0ea5a4;">Thông báo ra giá thành công</h3>

      <p>Xin chào <strong>${userName}</strong>,</p>

      <p>
        Sản phẩm <strong>${productName}</strong> đang có giá 
        <strong style="color:#0ea5a4;">${price} VND</strong>.
      </p>

      <p>Đây là thông báo tự động liên quan đến sản phẩm của bạn.</p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Nếu bạn không yêu cầu thông báo này, vui lòng bỏ qua email này.
      </p>
    </div>
  `;
};

export const loadBidSuccessTemplateForSeller = (
  userName: string,
  productName: string,
  price: string
) => {
  return `
    <div style="
      max-width:500px;
      margin:auto;
      font-family:Arial,sans-serif;
      padding:20px;
      border-radius:8px;
      border:1px solid #eee;
      background:#ffffff;
    ">
      <h3 style="margin-top:0;color:#0ea5a4;">Thông báo ra giá thành công</h3>

      <p>Người dùng có tên <strong>${userName}</strong> đã ra giá thành công sản phẩm của bạn</p>

      <p>
        Sản phẩm <strong>${productName}</strong> đang có giá 
        <strong style="color:#0ea5a4;">${price} VND</strong>.
      </p>

      <p>Đây là thông báo tự động liên quan đến sản phẩm của bạn.</p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Nếu bạn không yêu cầu thông báo này, vui lòng bỏ qua email này.
      </p>
    </div>
  `;
};

export const loadBidFailedTemplate = (
  userName: string,
  productName: string,
  title: string,
  reason: string
) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;">
      <h3 style="margin-top:0;color:#0ea5a4;">${title}</h3>

      <p>Xin chào <strong>${userName}</strong>,</p>

      <p>
        Rất tiếc, bạn đã <strong>thất bại</strong>  trong đấu giá sản phẩm 
        <strong>${productName}</strong>.
      </p>

      <p><strong>Lý do:</strong> ${reason}</p>

      <p style="margin-top:20px;">
        Cảm ơn bạn đã tham gia phiên đấu giá. Chúc bạn may mắn ở những phiên tiếp theo!
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Đây là email tự động, vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};

export const loadNoBuyerTemplate = (userName: string, productName: string) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;background:#fff;">
      <h3 style="margin-top:0;color:#0ea5a4;">Đấu giá kết thúc — Không có người mua</h3>
      <p>Xin chào <strong>${userName}</strong>,</p>

      <p>
        Phiên đấu giá cho sản phẩm <strong>${productName}</strong> đã kết thúc nhưng hiện tại <strong>không có người mua</strong>.
      </p>

      <p style="margin-top:12px;">
        Bạn có thể:
      </p>
      <ul>
        <li>Đăng lại sản phẩm với mức giá khởi điểm khác</li>
        <li>Liên hệ hỗ trợ nếu cần trợ giúp</li>
      </ul>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#666;">Email tự động — vui lòng không trả lời.</p>
    </div>
  `;
};

export const loadOrderTemplate = (
  productName: string,
  winningPrice: string,
  sellerEmail: string,
  winnerEmail: string
) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;background:#fff;">
      <h3 style="margin-top:0;color:#0ea5a4;">Đấu giá thành công</h3>

      <p>Sản phẩm: <strong>${productName}</strong></p>

      <p>
        Giá đấu giá cuối cùng: 
        <strong style="color:#0ea5a4;">${winningPrice} VND</strong>
      </p>

      <p>
        <strong>Email người bán:</strong> ${sellerEmail}<br/>
        <strong>Email người thắng:</strong> ${winnerEmail}
      </p>

      <p style="margin-top:12px;">
        Vui lòng liên hệ với nhau để tiến hành thanh toán và giao nhận sản phẩm.
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Đây là email tự động — vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};

export const loadAskTemplate = (
  askerEmail: string,
  productName: string,
  question: string
) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;background:#fff;">
      <h3 style="margin-top:0;color:#0ea5a4;">Người mua đặt câu hỏi</h3>

      <p>
        <strong>${askerEmail}</strong> đã gửi câu hỏi về sản phẩm 
        <strong>${productName}</strong>.
      </p>

      <p style="margin-top:12px;">Nội dung câu hỏi:</p>

      <blockquote style="margin:12px 0;padding:12px;border-left:4px solid #eee;background:#fafafa;">
        ${question}
      </blockquote>

      <p style="margin-top:12px;">
        Vui lòng phản hồi sớm để người mua có thêm thông tin quyết định.
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Đây là email tự động — vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};

export const loadAnswerTemplate = (
  sellerEmail: string,
  productName: string,
  answer: string
) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;background:#fff;">
      <h3 style="margin-top:0;color:#0ea5a4;">Người bán đã trả lời</h3>

      <p>
        Người bán <strong>${sellerEmail}</strong> đã trả lời câu hỏi liên quan đến sản phẩm 
        <strong>${productName}</strong>.
      </p>

      <p style="margin-top:12px;">Nội dung câu trả lời:</p>

      <blockquote style="margin:12px 0;padding:12px;border-left:4px solid #eee;background:#fafafa;">
        ${answer}
      </blockquote>

      <p style="margin-top:12px;">
        Cảm ơn bạn đã quan tâm đến sản phẩm. Hãy tiếp tục theo dõi phiên đấu giá để cập nhật thêm thông tin.
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Đây là email tự động — vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};


// export const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 465,
//   secure: true, // true nếu port 465
//   auth: {
//     user: process.env.MAIL_USER,        // ví dụ: maddison53@ethereal.email
//     pass: process.env.MAIL_APP_PASSWORD // ví dụ: jn7jnAPss4f63QBp6D
//   },
// });

// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, 
//   auth: {
//     type: "OAuth2",
//     user: process.env.MAIL_USER,
//     clientId: process.env.GMAIL_CLIENT_ID,
//     clientSecret: process.env.GMAIL_CLIENT_SECRET,
//     refreshToken: process.env.GMAIL_REFRESH_TOKEN,
//     accessToken: process.env.GMAIL_ACCESS_TOKEN,
//   },
// });

// /**
//  * Verify khi app start (OK với Ethereal)
//  */
// transporter.verify((err, success) => {
//   if (err) {
//     console.error("SMTP verify failed:", err);
//   } else {
//     console.log("SMTP ready (Ethereal)");
//   }
// });

// /**
//  * Hàm gửi email
//  */
// export const sendEmail = async (data: {
//   email: string;
//   subject?: string;
//   content: string;
// }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: '"SnapBid" <no-reply@snapbid.test>',
//       to: data.email,
//       subject: data.subject ?? "Verification code",
//       html: data.content,
//     });

//     console.log("📧 Message ID:", info.messageId);
//     console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));

//     return {
//       success: true,
//       message: "Send email success",
//       previewUrl: nodemailer.getTestMessageUrl(info),
//     };
//   } catch (err: any) {
//     console.error("Send email failed:", err);
//     return {
//       success: false,
//       message: err?.message ?? "unknown error",
//     };
//   }
// };


export const transporter = nodemailer.createTransport({
  service: "gmail", // 👈 đúng shortcut Gmail
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USER,                 // group2hcmus@gmail.com
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

// verify khi app start
transporter.verify((err) => {
  if (err) {
    console.error("SMTP verify failed:", err);
  } else {
    console.log("SMTP ready (Gmail service)");
  }
});

export const sendEmail = async (data: {
  email: string;
  subject?: string;
  content: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"SnapBid" <${process.env.MAIL_USER}>`,
      to: data.email,
      subject: data.subject ?? "Verification code",
      html: data.content,
    });

    console.log(`Time: ${new Date().toISOString()} - Email: ${data.email} - subject: ${data.subject}` );

    return {
      success: true,
      message: "Send email success",
    };
  } catch (err: any) {
    console.error("Send email failed:", err);
    return {
      success: false,
      message: err?.message ?? "unknown error",
    };
  }
};
