import cookieParser from 'cookie-parser';
import express from 'express';

import { passport_authenticate } from '../passport-providers'

const router = express.Router();

router.use(express.json()); // For parsing application/json body
router.use(cookieParser()); // For using cookies

// Base route: /daily

// Get lists of a user
router.get('/load', passport_authenticate('jwt',
  (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.removeHeader('ETag');
    req.context.models.dailyLoad(req, res);
  })
);

// Save lists
router.post('/save', passport_authenticate('jwt',
  (req, res) => {  
    req.context.models.dailySave(req, res);
  })
);

export default router;