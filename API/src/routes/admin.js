import express from 'express';

const router = express.Router();

router.use(express.json()); // For parsing application/json body

router.get('/weapons', (req, res) => {  
  req.context.models.getAdminWeapons(req, res);
});

router.post('/weapons', (req, res) => {  
  req.context.models.saveAdminWeapons(req, res);
});

router.get('/summons', (req, res) => {  
  req.context.models.getAdminSummons(req, res);
});

router.post('/summons', (req, res) => {  
  req.context.models.saveAdminSummons(req, res);
});

export default router;