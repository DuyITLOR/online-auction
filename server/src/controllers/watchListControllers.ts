import * as watchListService from '../services/watchListService';
import { Request, Response } from 'express';
import { addWatchListDto, removeWatchListDto } from '../dto/watchListDto';
import { gatewayResponse } from '../utils/response';

export const addWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token không hợp lệ');
      return res.status(response.code).send(response);
    }
    const userId = req.user!.id;
    const body: addWatchListDto = req.body;

    const data = await watchListService.addWatchList(userId, body);
    const respone = gatewayResponse(201, data, 'Thêm vào danh sách theo dõi thành công');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Add watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Thêm vào danh sách theo dõi thất bại');
    res.status(respone.code).send(respone);
  }
};

export const removeWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token không hợp lệ');
      return res.status(response.code).send(response);
    }

    const userId = req.user!.id;
    const body: removeWatchListDto = req.body;

    const data = await watchListService.removeWatchList(userId, body);
    const respone = gatewayResponse(200, data, 'Xóa khỏi danh sách theo dõi thành công');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Remove watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Xóa khỏi danh sách theo dõi thất bại');
    res.status(respone.code).send(respone);
  }
};

export const getWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token không hợp lệ');
      return res.status(response.code).send(response);
    }

    const userId = req.user!.id;
    const query = req.query;

    const data = await watchListService.getWatchList(userId, query);
    const respone = gatewayResponse(200, data, 'Danh sách theo dõi được lấy thành công');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Get watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Lấy danh sách theo dõi thất bại');
    res.status(respone.code).send(respone);
  }
};

export const getAllWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token không hợp lệ');
      return res.status(response.code).send(response);
    }

    const userId = req.user!.id;

    const data = await watchListService.getAllWatchList(userId);
    const respone = gatewayResponse(200, data, 'Danh sách theo dõi được lấy thành công');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Get watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Lấy danh sách theo dõi thất bại');
    res.status(respone.code).send(respone);
  }
};
