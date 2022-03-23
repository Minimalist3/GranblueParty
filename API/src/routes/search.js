import { Router } from 'express';

const router = Router();

// Base route: /search

router.get('/characters', (req, res) => {  
  req.context.models.searchCharacters(req, res);
});

router.get('/weapons', (req, res) => {  
  req.context.models.searchWeapons(req, res);
});

router.get('/summons', (req, res) => {  
  req.context.models.searchSummons(req, res);
});

export default router;