import { Request, Response } from 'express';
import * as services from '../services/settingService';
import { gatewayResponse } from '../utils/response';
import { HttpStatus } from '../utils/permission';
import { checkRole } from '../utils/checkRole';

export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await services.getAllSettings();
    const respone = gatewayResponse(
      HttpStatus.ok,
      settings,
      'Lấy tất cả setting thành công'
    );
    return res.status(respone.code).send(respone);
  } catch (err) {
    const msg = (err as Error).message || 'Lỗi từ settingControllers';
    const respone = gatewayResponse(HttpStatus.badRequest, null, msg);
    return res.status(respone.code).send(respone);
  }
};

export const createSetting = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const respone = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        'Không có quyền truy cập'
      );
      return res.status(respone.code).send(respone);
    }
    const roles = await checkRole(req.user.id);

    if (!roles.includes('ADMIN')) {
      const respone = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Chỉ ADMIN mới có quyền tạo setting'
      );
      return res.status(respone.code).send(respone);
    }

    const { key, value } = req.body;
    const setting = await services.createSetting(req.user.id, key, value);
    const respone = gatewayResponse(
      HttpStatus.created,
      setting,
      'Tạo setting thành công'
    );
    return res.status(respone.code).send(respone);
  } catch (err) {
    const msg = (err as Error).message || 'Lỗi từ settingControllers';
    const respone = gatewayResponse(HttpStatus.badRequest, null, msg);
    return res.status(respone.code).send(respone);
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      const respone = gatewayResponse(
        HttpStatus.unauthorized,
        null,
        'Không có quyền truy cập'
      );
      return res.status(respone.code).send(respone);
    }
    const roles = await checkRole(req.user.id);
    if (!roles.includes('ADMIN')) {
      const respone = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Chỉ ADMIN mới có quyền cập nhật setting'
      );
      return res.status(respone.code).send(respone);
    }
    const { settingId } = req.params;
    const { value } = req.body;

    if (!value) {
      const respone = gatewayResponse(
        HttpStatus.badRequest,
        null,
        'Value của setting không được để trống'
      );
      return res.status(respone.code).send(respone);
    }

    const setting = await services.updateSetting(settingId, value, req.user.id);
    const respone = gatewayResponse(
      HttpStatus.ok,
      setting,
      'Cập nhật setting thành công'
    );
    return res.status(respone.code).send(respone);
  } catch (err) {
    const msg = (err as Error).message || 'Lỗi từ settingControllers';
    const respone = gatewayResponse(HttpStatus.badRequest, null, msg);
    return res.status(respone.code).send(respone);
  }
};
