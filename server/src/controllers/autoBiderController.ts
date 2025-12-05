import { Request, Response } from "express";
import * as autoBidService from "../services/autoBidService";
import { gatewayResponse } from "../utils/response";
import { HttpStatus } from "../utils/permission";
import { checkRole } from "../utils/checkRole";
import { bidHistoryQueryDto } from "../dto/autoBidDto";

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


export const getBidCountByProduct = async (req: Request, res: Response) => {
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

    const data = await autoBidService.getBidCountByProductId(productId);
    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      "Bid count retrieved successfully"
    );
    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
}

export const getMaxBidByUser = async (req: Request, res: Response) => {
  try{
    const { productId } = req.params;
    const userId = req.user?.id;

    let roles = await checkRole(userId!);

    if (!roles.includes("BIDDER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Forbidden: User is not a bidder"
      );
      return res.status(response.code).send(response);
    }

    if (!productId || !userId) {
      const response = gatewayResponse(
        HttpStatus.badRequest,
        null,
        "Missing productId or userId parameter"
      );
      return res.status(response.code).send(response);
    }

    const data = await autoBidService.getMaxBidByUserId(productId, userId);
    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      "Get max bid successfully"
    );

    return res.status(response.code).send(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
}

export const getBidHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    let roles = await checkRole(userId!); 
    if (!roles.includes("BIDDER")) {
      const response = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Forbidden: User is not a bidder"
      );
      return res.status(response.code).send(response);
    }
    
    const queryParams = req.query as bidHistoryQueryDto;
    const data = await autoBidService.getAutoHistory(queryParams);

    if (!data) {
      const response = gatewayResponse(
        HttpStatus.notFound,
        null,
        "No bid history found"
      );
      return res.status(response.code).send(response);
    }

    const response = gatewayResponse(
      HttpStatus.ok,
      data,
      "Bid history retrieved successfully"
    );
    return res.status(response.code).send(response);

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
}