import { Router } from 'express';

const router = Router();

// Base route: /spark

router.get('/characters', (req, res) => {  
  req.context.models.getSparkCharacters(req, res);
});

router.get('/summons', (req, res) => {  
  req.context.models.getSparkSummons(req, res);
});

export default router;