import cookieParser from 'cookie-parser';
import express from 'express';

import { passport_authenticate } from '../passport-providers'

const router = express.Router();

router.use(express.json()); // For parsing application/json body
router.use(cookieParser()); // For using cookies

// Base route: /friendsum

// Get Friend summons of a user
router.get('/load/:id', 
  (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.removeHeader('ETag');
    req.context.models.friendSummonsLoad(req, res, req.params.id);
  }
);

// Save Friend summons
router.post('/save', passport_authenticate('jwt',
  (req, res) => {  
    req.context.models.friendSummonsSave(req, res);
  })
);

export default router;