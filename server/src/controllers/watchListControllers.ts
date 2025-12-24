import * as watchListService from '../services/watchListService';
import { Request, Response } from 'express';
import { addWatchListDto, removeWatchListDto } from '../dto/watchListDto';
import { gatewayResponse } from '../utils/response';

export const addWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token invalid');
      return res.status(response.code).send(response);
    }
    const userId = req.user!.id;
    const body: addWatchListDto = req.body;

    const data = await watchListService.addWatchList(userId, body);
    const respone = gatewayResponse(201, data, 'Added to watch list');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Add watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Failed to add to watch list');
    res.status(respone.code).send(respone);
  }
};

export const removeWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token invalid');
      return res.status(response.code).send(response);
    }

    const userId = req.user!.id;
    const body: removeWatchListDto = req.body;

    const data = await watchListService.removeWatchList(userId, body);
    const respone = gatewayResponse(200, data, 'Removed from watch list');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Remove watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Failed to remove from watch list');
    res.status(respone.code).send(respone);
  }
};

export const getWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token invalid');
      return res.status(response.code).send(response);
    }

    const userId = req.user!.id;
    const query = req.query;

    const data = await watchListService.getWatchList(userId, query);
    const respone = gatewayResponse(200, data, 'Watch list retrieved');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Get watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Failed to get watch list');
    res.status(respone.code).send(respone);
  }
};

export const getAllWatchList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const response = gatewayResponse(400, null, 'Token invalid');
      return res.status(response.code).send(response);
    }

    const userId = req.user!.id;

    const data = await watchListService.getAllWatchList(userId);
    const respone = gatewayResponse(200, data, 'Watch list retrieved');
    res.status(respone.code).send(respone);
  } catch (error) {
    console.error('Get watchlist error:', error);

    const respone = gatewayResponse(400, null, 'Failed to get watch list');
    res.status(respone.code).send(respone);
  }
};
