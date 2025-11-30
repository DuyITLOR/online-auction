import { Request, Response } from "express";
import * as autoBidService from "../services/autoBidService";
import { gatewayResponse } from "../utils/response";
import { HttpStatus } from "../utils/permission";
import { checkRole } from "../utils/checkRole";

export const createAutoBid = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        "Token Invalid"
      );
      return res.status(response.code).send(response);
    }

    const bidderId = req.user.id;
    let roles = await checkRole(bidderId);

    if (!roles.includes("BIDDER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Forbidden: User is not a bidder"
      );
      return res.status(response.code).send(response);
    }
    const { productId, maxAutoBidAmount } = req.body;

    if (!productId || !maxAutoBidAmount) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Missing required fields"
      );
      return res.status(response.code).send(response);
    }

    const data = await autoBidService.createAutoBid({
      bidderId,
      productId,
      maxAutoBidAmount: Number(maxAutoBidAmount),
    });
    const response = gatewayResponse(
      HttpStatus.created,
      data,
      "Auto-bid created successfully"
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};

export const getHistoryAutoBisByProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Missing productId parameter"
      );
      return res.status(response.code).send(response);
    }

    const data = await autoBidService.getBidHistory(productId);
    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      "Auto-bid history retrieved successfully"
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};
