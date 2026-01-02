import { Request, Response } from "express";
import { gatewayResponse } from "../utils/response";
import { HttpStatus } from "../utils/permission";
import { checkRole } from "../utils/checkRole";
import { orderQueryDto } from "../dto/orderDto";
import { uploadSingleFile } from "../utils/uploadImage";
import * as orderDto from "../dto/orderDto";
import * as orderService from "../services/orderService";

export const getOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);
    const query = req.query as orderQueryDto;

    const view = String(query.view ?? "").toUpperCase();

    if (view && !roles.includes(view)) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản không có quyền truy cập"
      );
      return res.status(response.code).send(response);
    }

    const orders = await orderService.getOrdersByQuery(view, {
      ...query,
      userId: userId,
    });

    if (!orders) {
      const response = gatewayResponse(
        HttpStatus.notFound,
        null,
        "Không tìm thấy đơn hàng"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      orders,
      "Lấy danh sách đơn hàng thành công"
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Lỗi máy chủ nội bộ";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId, userId);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.notFound,
        null,
        "Không tìm thấy đơn hàng"
      );
      return res.status(response.code).send(response);
    }

    let role: "SELLER" | "BIDDER" | null = null;
    if (order.sellerId === userId && roles.includes("SELLER")) {
      role = "SELLER";
    } else if (order.buyerId === userId && roles.includes("BIDDER")) {
      role = "BIDDER";
    }

    if (!role) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản không có quyền truy cập"
      );
      return res.status(response.code).send(response);
    }

    let canCancel = false;
    if (role === "SELLER") {
      canCancel = true;
    }

    if (role === "BIDDER" && order.status === "WAIT_SELLER_BANK_INFO") {
      canCancel = true;
    }

    const data = {
      product: {
        title: order.product.title,
      },
      totalAmount: order.totalAmount,
      seller: {
        fullname: order.seller.fullname,
      },
      buyer: {
        fullname: order.buyer.fullname,
      },
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      status: order.status,
      canCancel: canCancel,
      qrInfo: order.qrInfo,
      qrUrl: order.qrUrl,
      buyerAddress: order.buyerAddress,
      buyerPhone: order.buyerPhone,
      billUrl: order.billUrl,
      shippingUrl: order.shippingUrl,
      shippingCode: order.shippingCode,
      productId: order.productId,
      role: role,
    };

    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      "Lấy thông tin đơn hàng thành công"
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      error.message || "Lấy thông tin đơn hàng thất bại"
    );
    return res.status(response.code).send(response);
  }
};

export const getOrderByProductId = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const productId = req.params.productId;
    const order = await orderService.getOrderByProductId(productId);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.notFound,
        null,
        "Không tìm thấy đơn hàng"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      order,
      "Lấy thông tin đơn hàng thành công"
    );
    return res.status(response.code).send(response);
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Lấy thông tin đơn hàng thất bại";
    const response = gatewayResponse(HttpStatus.badRequest, null, msg);
    return res.status(response.code).send(response);
  }
};

export const uploadBankInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);

    if (!roles.includes("SELLER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản của bạn không phải là người bán"
      );
      return res.status(response.code).send(response);
    }

    const uploadFile = await uploadSingleFile(req, "qrUrl");

    if (!uploadFile.success) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        uploadFile.message
      );
      return res.status(response.code).send(response);
    }
    const body: orderDto.orderBankInfo = {
      orderId: req.params.id,
      sellerId: userId,
      bankInfor: req.body.qrInfo,
      qrUrl: uploadFile.fileUrl as string,
    };
    const order = await orderService.uploadBankInfo(body);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Cập nhật thông tin ngân hàng thất bại"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      order,
      "Cập nhật thông tin ngân hàng thành công"
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      error.message || "Cập nhật thông tin ngân hàng thất bại"
    );
    return res.status(response.code).send(response);
  }
};

export const uploadPaymentInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);

    if (!roles.includes("BIDDER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản của bạn không phải là người mua"
      );
      return res.status(response.code).send(response);
    }

    const uploadFile = await uploadSingleFile(req, "billUrl");

    if (!uploadFile.success) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        uploadFile.message
      );
      return res.status(response.code).send(response);
    }

    const body: orderDto.orderPaymentInfo = {
      orderId: req.params.id,
      buyerId: userId,
      billUrl: uploadFile.fileUrl as string,
      buyerAddress: req.body.buyerAddress,
      buyerPhone: req.body.buyerPhone,
    };

    const order = await orderService.uploadPayment(body);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Cập nhật thông tin thanh toán thất bại"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      order,
      "Cập nhật thông tin thanh toán thành công"
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      error.message || "Cập nhật thông tin thanh toán thất bại"
    );
    return res.status(response.code).send(response);
  }
};

export const uploadShippingInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);

    if (!roles.includes("SELLER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản của bạn không phải là người bán"
      );
      return res.status(response.code).send(response);
    }

    const uploadFile = await uploadSingleFile(req, "shippingUrl");

    if (!uploadFile.success) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        uploadFile.message
      );
      return res.status(response.code).send(response);
    }

    const body: orderDto.orderShippingInfo = {
      orderId: req.params.id,
      sellerId: userId,
      shippingCode: req.body.shippingCode,
      shippingUrl: uploadFile.fileUrl as string,
    };

    const order = await orderService.uploadShippingInfo(body);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Cập nhật thông tin vận chuyển thất bại"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      order,
      "Cập nhật thông tin vận chuyển thành công"
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      error.message || "Cập nhật thông tin vận chuyển thất bại"
    );
    return res.status(response.code).send(response);
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);

    if (!roles.includes("BIDDER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản của bạn không phải là người mua"
      );
      return res.status(response.code).send(response);
    }

    const orderId = req.params.id;
    const order = await orderService.confirmReceive(orderId, userId);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Xác nhận đơn hàng thất bại"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      order,
      "Xác nhận đơn hàng thành công"
    );
    return res.status(response.code).send(response);
  } catch (error: any) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      error.message || "Xác nhận đơn hàng thất bại"
    );
    return res.status(response.code).send(response);
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token không hợp lệ"
      );
      return res.status(response.code).send(response);
    }

    const userId = req.user.id;
    let roles = await checkRole(userId);

    if (!roles.includes("SELLER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Tài khoản của bạn không phải là người bán"
      );
      return res.status(response.code).send(response);
    }

    const orderId = req.params.id;

    const data: orderDto.orderCancelInfo = {
      orderId: orderId,
      productId: req.body.productId,
      sellerId: userId,
      buyerId: req.body.buyerId,
      reason: req.body.reason,
    };

    const order = await orderService.cancelOrder(data);

    if (!order) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Hủy đơn hàng thất bại"
      );
      return res.status(response.code).send(response);
    }
  } catch (error: any) {
    const response = gatewayResponse(
      HttpStatus.badRequest,
      null,
      error.message || "Hủy đơn hàng thất bại"
    );
    return res.status(response.code).send(response);
  }
};
