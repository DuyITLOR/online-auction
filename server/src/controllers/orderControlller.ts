import { Request, response, Response } from "express";
import { gatewayResponse } from "../utils/response";
import { HttpStatus } from "../utils/permission";
import { checkRole } from "../utils/checkRole";
import { orderQueryDto } from "../dto/orderDto";
import { uploadSingleFile } from "../utils/uploadImage";
import * as orderDto from '../dto/orderDto';
import * as orderService from "../services/orderService";

export const getOrder = async (req: Request, res: Response) => {
    try{
        if (!req.user) {
            const response = gatewayResponse(
                HttpStatus.unauthorized,
                null,
                "Token Invalid")
            return res.status(response.code).send(response);
        }

        const userId = req.user.id;
        let roles = await checkRole(userId);
        const query = req.query as orderQueryDto;
        
        const view = String(query.view ?? "").toUpperCase();
        
        if (view && !roles.includes(view))
        {   
            const response = gatewayResponse(HttpStatus.forbidden, null, "Tài khoản không có quyền truy cập");
            return res.status(response.code).send(response);
        }

        const orders = await orderService.getOrdersByQuery(
            view,
            {
                ...query,
                userId: userId
            }
        )

        if (!orders) {
            const response = gatewayResponse(HttpStatus.notFound, null, "Không tìm thấy đơn hàng");
            return res.status(response.code).send(response);
        }

        const response = gatewayResponse(HttpStatus.ok, orders, "Lấy danh sách đơn hàng thành công");
        return res.status(response.code).send(response);



    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        const response = gatewayResponse(HttpStatus.badRequest, null, message);
        return res.status(response.code).send(response);
    }
}


export const getOrderById = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            const response = gatewayResponse(
                HttpStatus.unauthorized,
                null,
                "Token Invalid"
            );
            return res.status(response.code).send(response);
        }

        const userId = req.user.id;
        let roles = await checkRole(userId);
        const orderId = req.params.id;
        const order = await orderService.getOrderById(orderId, userId)

        if(!order) {
            const response = gatewayResponse(HttpStatus.notFound, null, "Không tìm thấy đơn hàng");
            return res.status(response.code).send(response);
        }

        let role: "SELLER" | "BIDDER" | null = null;
        if (order.sellerId === userId && roles.includes("SELLER")) {
            role = "SELLER";
        }
        else if( order.buyerId === userId && roles.includes("BIDDER")) {
            role = "BIDDER";
        }

        if (!role) {
            const response = gatewayResponse(HttpStatus.forbidden, null, "Tài khoản không có quyền truy cập");
            return res.status(response.code).send(response);
        }

        let canCancel = false;
        if (role === "SELLER"){
            canCancel = true;
        }

        if (role === "BIDDER" && (order.status ===  "WAIT_SELLER_BANK_INFO")) {
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
            status: order.status,
            canCancel: canCancel,
            qrInfo: order.qrInfo,
            qrUrl: order.qrUrl,
            role: role
        }

        const response = gatewayResponse(HttpStatus.ok, data, "Lấy thông tin đơn hàng thành công");
        return res.status(response.code).send(response);
    } catch (error: any) {
        const response = gatewayResponse(HttpStatus.badRequest, null, error.message || "Lấy thông tin đơn hàng thất bại");
        return res.status(response.code).send(response);
    }
}


export const uploadBankInfo = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            const response = gatewayResponse(
                HttpStatus.unauthorized,
                null,
                "Token Invalid"
            );
            return res.status(response.code).send(response);
        }

        const userId = req.user.id;
        let roles = await checkRole(userId);
        
        if (!roles.includes("SELLER")) {
            const response = gatewayResponse(HttpStatus.forbidden, null, "Tài khoản của bạn không phải là seller");
            return res.status(response.code).send(response);
        }

        const uploadFile = await uploadSingleFile(req, "qrUrl");

        if (!uploadFile.success) {
            const response = gatewayResponse(HttpStatus.badRequest, null, uploadFile.message);
            return res.status(response.code).send(response);
        }
        const body: orderDto.orderBankInfo = {
            orderId: req.params.id,
            sellerId: userId,
            bankInfor: req.body.qrInfo,
            qrUrl: uploadFile.fileUrl as string,
        }   
        const order = await orderService.uploadBankInfo(body)

        if (!order) {
            const response = gatewayResponse(HttpStatus.badRequest, null, "Cập nhật thông tin ngân hàng thất bại");
            return res.status(response.code).send(response);
        }

        const response = gatewayResponse(HttpStatus.ok, order, "Cập nhật thông tin ngân hàng thành công");
        return res.status(response.code).send(response);

    } catch (error: any) {
        const response = gatewayResponse(HttpStatus.badRequest, null, error.message || "Cập nhật thông tin ngân hàng thất bại");
        return res.status(response.code).send(response);
    }
}