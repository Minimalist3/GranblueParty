import { Router } from 'express';

const router = Router();

router.get('/characters', (req, res) => {  
  req.context.models.searchCharacters(req, res);
});

router.get('/weapons', (req, res) => {  
  req.context.models.searchWeapons(req, res);
});

export default router;