import { Router } from 'express';

const router = Router();

// Base route: /teams

router.get('/list', (req, res) => {  
  res.setHeader("Cache-Control", "no-store");
  res.removeHeader('ETag');
  req.context.models.getTeams(req, res);
});

export default router;