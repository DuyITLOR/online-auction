import { Request, Response } from 'express';

import * as services from '../services/fullTextSerchService';

import { fullTextSearchDto } from '../dto/fullTextSearchDto';

export const fullTextSearchController = async (req: Request, res: Response) => {
    try {
        const data: fullTextSearchDto = {
            query: req.query.q as string,
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10
        };
        const results = await services.fullTextSearchService(data);
        res.status(200).json({
            success: true,
            message: 'Product created successfully',
            data: results,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'An error occurred during the full text search',
            error: errorMessage,
        });
    }
};