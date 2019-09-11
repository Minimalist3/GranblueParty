import { Router } from 'express';

const router = Router();

router.get('/characters', (req, res) => {  
  req.context.models.getReleaseCharacters(req, res);
});

router.get('/summons', (req, res) => {  
  req.context.models.getReleaseSummons(req, res);
});

export default router;