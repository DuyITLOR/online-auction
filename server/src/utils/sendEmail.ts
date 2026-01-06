import nodemailer from 'nodemailer';
// import { Resend } from "resend";

import { sendEmailDto, sendEmailResultDto } from '../dto/sendEmailDto';

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
  price: string,
  productLink: string
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
        Sản phẩm <strong>${productName}</strong>, bạn đang tham giá đấu giá, hiện tại đang có giá 
        <strong style="color:#0ea5a4;">${price} VND</strong>.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a 
          href="${productLink}"
          style="display:inline-block;padding:12px 24px;background:#0ea5a4;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;"
        >
          Xem sản phẩm
        </a>
      </div>

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
  price: string,
  productLink: string
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
        Sản phẩm <strong>${productName}</strong> đang có giá là
        <strong style="color:#0ea5a4;">${price} VND</strong>.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a 
          href="${productLink}"
          style="display:inline-block;padding:12px 24px;background:#0ea5a4;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;"
        >
          Xem sản phẩm
        </a>
      </div>

      <p>Đây là thông báo tự động liên quan đến sản phẩm của bạn.</p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Nếu bạn không yêu cầu thông báo này, vui lòng bỏ qua email này.
      </p>
    </div>
  `;
};

export const loadOutbidTemplate = (
  userName: string,
  productName: string,
  currentPrice: string | number,
  productLink: string
) => {
  return `
    <div style="max-width:520px;margin:auto;font-family:Arial,sans-serif;padding:24px;border-radius:10px;border:1px solid #eee;background:#ffffff;">
      
      <h2 style="margin-top:0;color:#0ea5a4;">
        Bạn vừa bị vượt giá
      </h2>

      <p style="font-size:15px;line-height:1.6;">
        Chào <strong>${userName}</strong>,<br/>
        Giá đấu của bạn cho sản phẩm <strong>${productName}</strong> đã bị người khác vượt qua.
      </p>

      <div style="margin:20px 0;padding:16px;border-radius:8px;background:#f9fafb;border:1px solid #eee;">
        <p style="margin:0;font-size:14px;color:#555;">Giá hiện tại</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:bold;color:#0ea5a4;">
          ${currentPrice}
        </p>
      </div>

      <p style="font-size:14px;line-height:1.6;">
        Hiện tại bạn <strong>không còn là người dẫn đầu</strong> trong phiên đấu giá này.
        Nếu bạn vẫn quan tâm đến sản phẩm, hãy quay lại SnapBid để đặt giá mới và giành lại vị trí dẫn đầu.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a 
          href="${productLink}"
          style="display:inline-block;padding:12px 24px;background:#0ea5a4;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;"
        >
          Đặt giá ngay
        </a>
      </div>

      <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#777;text-align:center;">
        Đây là email tự động từ SnapBid — vui lòng không phản hồi lại email này.
      </p>

    </div>
  `;
};

export const loadBidFailedTemplate = (
  userName: string,
  productName: string,
  title: string,
  reason: string,
  productLink: string
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

      <p style="font-size:14px;line-height:1.6;">
        Hiện tại bạn <strong>không còn là người dẫn đầu</strong> trong phiên đấu giá này.
        Nếu bạn vẫn quan tâm đến sản phẩm, hãy quay lại SnapBid để đặt giá mới và giành lại vị trí dẫn đầu.
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a 
          href="${productLink}"
          style="display:inline-block;padding:12px 24px;background:#0ea5a4;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;"
        >
          Đặt giá ngay
        </a>
      </div>

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
  winnerEmail: string,
  orderLink: string
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


      <div style="text-align:center;margin:24px 0;">
        <a 
          href="${orderLink}"
          style="display:inline-block;padding:12px 24px;background:#0ea5a4;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;"
        >
          Thanh toán ngay
        </a>
      </div>



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

export const loadProductDescriptionChangedTemplate = (
  productName: string,
  productLink: string
) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;background:#fff;">
      <h3 style="margin-top:0;color:#0ea5a4;">Thông báo cập nhật sản phẩm</h3>

      <p>
        Mô tả của sản phẩm 
        <strong>${productName}</strong> đã được người bán cập nhật.
      </p>

      <p style="margin-top:12px;">
        Để đảm bảo bạn không bỏ lỡ bất kỳ thông tin quan trọng nào trước khi tham gia hoặc tiếp tục đấu giá,
        vui lòng xem lại nội dung mô tả mới nhất của sản phẩm.
      </p>

      <div style="margin:20px 0;text-align:center;">
        <a 
          href="${productLink}" 
          style="
            display:inline-block;
            padding:10px 16px;
            background:#0ea5a4;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Xem sản phẩm
        </a>
      </div>

      <p style="margin-top:12px;">
        Nếu bạn đang theo dõi hoặc đã đặt giá cho sản phẩm này, hãy kiểm tra lại để đảm bảo thông tin mới phù hợp với quyết định của bạn.
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Đây là email tự động — vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};

export const loadPasswordResetSuccessTemplate = (
  userName: string,
  email: string,
  newPassword: string
) => {
  return `
    <div style="max-width:500px;margin:auto;font-family:Arial,sans-serif;padding:20px;border-radius:8px;border:1px solid #eee;background:#fff;">
      <h3 style="margin-top:0;color:#0ea5a4;">Đặt lại mật khẩu thành công</h3>

      <p>
        Xin chào <strong>${userName}</strong>,
      </p>

      <p>
        Chúng tôi đã xử lý thành công yêu cầu đặt lại mật khẩu cho tài khoản:
        <strong>${email}</strong>
      </p>

      <p style="margin-top:12px;">
        Mật khẩu mới của bạn là:
      </p>

      <div style="margin:16px 0;padding:12px;background:#fafafa;border:1px dashed #0ea5a4;border-radius:6px;text-align:center;font-size:16px;font-weight:bold;">
        ${newPassword}
      </div>

      <p style="margin-top:12px;">
        Vui lòng đăng nhập bằng mật khẩu này và thay đổi lại mật khẩu của bạn ngay để đảm bảo an toàn cho tài khoản.
      </p>

      <p>
        Nếu bạn <strong>không phải</strong> là người yêu cầu đặt lại mật khẩu, vui lòng liên hệ ngay với bộ phận hỗ trợ của chúng tôi.
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />

      <p style="font-size:12px;color:#666;">
        Đây là email tự động — vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};

export const loadBlockedBidderTemplate = (
  userName: string,
  productName: string,
  reason: string
) => {
  return `
    <div style="
      max-width:500px;
      margin:auto;
      font-family:Arial,sans-serif;
      padding:20px;
      border-radius:8px;
      border:2px solid #dc2626;
      background:#fef2f2;
    ">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="
          display:inline-block;
          width:60px;
          height:60px;
          background:#dc2626;
          border-radius:50%;
          line-height:60px;
          font-size:32px;
          color:#fff;
        ">⚠</div>
      </div>

      <h3 style="
        margin-top:0;
        color:#dc2626;
        text-align:center;
        font-size:20px;
      ">Thông báo bị chặn khỏi cuộc đấu giá</h3>

      <p>Xin chào <strong>${userName}</strong>,</p>

      <p style="
        background:#fff;
        padding:15px;
        border-left:4px solid #dc2626;
        border-radius:4px;
        margin:20px 0;
      ">
        Bạn đã bị <strong style="color:#dc2626;">chặn</strong> khỏi việc tham gia đấu giá sản phẩm 
        <strong>${productName}</strong>.
      </p>

      <div style="
        background:#fff;
        padding:15px;
        border-radius:6px;
        margin:20px 0;
      ">
        <p style="margin:0 0 8px 0;color:#666;font-size:13px;"><strong>Lý do:</strong></p>
        <p style="margin:0;color:#374151;">${
          reason || 'Không được cung cấp'
        }</p>
      </div>

      <div style="
        background:#fef3c7;
        border:1px solid #fbbf24;
        padding:12px;
        border-radius:6px;
        margin:20px 0;
        font-size:14px;
      ">
        <strong>📌 Thông tin quan trọng:</strong>
        <ul style="margin:8px 0 0 0;padding-left:20px;">
          <li>Tất cả lệnh đấu giá tự động của bạn đã bị hủy</li>
          <li>Lịch sử ra giá của bạn đã bị xóa khỏi sản phẩm này</li>
          <li>Bạn không thể tham gia đấu giá sản phẩm này nữa</li>
        </ul>
      </div>

      <p style="margin-top:20px;font-size:14px;color:#666;">
        Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ với người bán hoặc bộ phận hỗ trợ.
      </p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">
        Đây là email tự động — vui lòng không phản hồi lại email này.
      </p>
    </div>
  `;
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USER, // group2hcmus@gmail.com
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

// verify khi app start
transporter.verify((err) => {
  if (err) {
    console.error('SMTP verify failed:', err);
  } else {
    console.log('SMTP ready (Gmail service)');
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
      subject: data.subject ?? 'Verification code',
      html: data.content,
    });

    console.log(
      `Time: ${new Date().toISOString()} - Email: ${data.email} - subject: ${
        data.subject
      }`
    );

    return {
      success: true,
      message: 'Send email success',
    };
  } catch (err: any) {
    console.error('Send email failed:', err);
    return {
      success: false,
      message: err?.message ?? 'unknown error',
    };
  }
};
