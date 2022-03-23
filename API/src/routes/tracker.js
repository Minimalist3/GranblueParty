import cookieParser from 'cookie-parser';
import express from 'express';

import { passport_authenticate } from '../passport-providers'

const router = express.Router();

router.use(express.json()); // For parsing application/json body
router.use(cookieParser()); // For using cookies

// Base route: /tracker

router.get('/charas/:id', (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.removeHeader('ETag');
  req.context.models.getTrackerCharacters(req, res, req.params.id);
});

router.get('/summons/:id', (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.removeHeader('ETag');
  req.context.models.getTrackerSummons(req, res, req.params.id);
});

router.post('/save', passport_authenticate('jwt',
  (req, res) => {  
    req.context.models.saveCollection(req, res);
  })
);

export default router;