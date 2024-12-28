import express, { Request, Response } from 'express';

const testRouter = express.Router();

testRouter.get('/test', (req: Request, res: Response) => {
    res.status(200).json({ message: 'API is working!' });
});

export default testRouter;