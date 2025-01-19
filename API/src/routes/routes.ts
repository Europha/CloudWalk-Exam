import { Application, Request, Response } from 'express';
import { generateJwtToken } from '../helpers/jwtHelper';
import { authenticateJwt } from '../middlewares/authMiddleware';
import {fetchCsvData, getRandomPreview} from "../helpers/csvHelper.ts";
import * as path from "path";
import * as fs from "fs";
import {validateUserLogin} from "../Models/usersModel.ts";
import {checkClientIp} from "../Hooks/ipinfo.ts";
import {listBlacklist} from "../Models/listBlacklist.ts";

export function appRoutes(app: Application) {
    app.post('/api/token', async (req: Request, res: Response) => {
        const {username, password} = req.body;

        var terra = await validateUserLogin(username, password);
        console.log(terra)

        if (terra == true) {
            const token = generateJwtToken({username});
            res.json({token});
        } else {
            res.json({"message": "invalid login"});
        }


    });


    app.get('/api/data/csv', authenticateJwt, async (req: Request, res: Response) => {
        try {
            const csvFilePath = path.resolve(__dirname, './teste.csv');
            const data = await fetchCsvData(csvFilePath);

            res.json(data);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    });

    app.get('/api/data/preview', authenticateJwt, async (req: Request, res: Response) => {
        try {
            const csvFilePath = path.resolve(__dirname, './teste.csv');
            const {headers, data} = await fetchCsvData(csvFilePath);

            const previewData = getRandomPreview(data, 10);

            const includeHeaders = req.query.headers !== 'false';

            if (includeHeaders) {
                res.json({headers, previewData});
            } else {
                res.json(previewData);
            }
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    });

    app.get('/api/sec/ip', authenticateJwt, async (req: Request, res: Response) => {
        try {
            const depth = req.query.depth ? parseInt(req.query.depth as string, 10) : 1;
            const ban = !!req.query.ban;
            const data = await checkClientIp(req, res, depth, ban);

            res.json(data);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({error: error.message});
        }
    });
    app.get('/api/sec/list', authenticateJwt, async (req: Request, res: Response) => {
        try {
            const blacklistData = await listBlacklist();  // Call the listBlacklist function
            if (blacklistData) {
                res.json(blacklistData);  // Send the list of blacklisted IPs as JSON
            } else {
                res.status(404).json({ message: 'No blacklisted IPs found' });  // If no entries, send a 404
            }
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving blacklisted IPs', error: err.message });  // Handle errors
        }

    })
}

