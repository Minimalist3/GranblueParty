import cookieParser from 'cookie-parser';
import express from 'express';

import { passport_authenticate } from '../passport-providers'

const router = express.Router();

router.use(express.json()); // For parsing application/json body
router.use(cookieParser()); // For using cookies

// Load a Party from JSON object
router.post('/load', (req, res) => {
  req.context.models.getPartyByJSON(req, res);
});

// Load a party from an id
router.get('/load/:id', (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.removeHeader('ETag');
  req.context.models.getPartyById(req, res);
})

// Save or update a Party
router.post('/save', passport_authenticate('jwt',
  (req, res) => {  
    req.context.models.saveParty(req, res);
  })
);

// Delete a party
router.post('/delete', passport_authenticate('jwt',
  (req, res) => {
    req.context.models.deleteParty(req, res);
  })
);

// List parties of a user
router.get('/list', passport_authenticate('jwt',
  (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.removeHeader('ETag');
    req.context.models.listParties(req, res);
  })
);

// Getters
router.get('/characters', (req, res) => {  
  req.context.models.getAllCharacters(req, res);
});

router.get('/characters/:id', (req, res) => {
  req.context.models.getCharacter(req, res);
});

router.get('/classes', (req, res) => {
  req.context.models.getAllClasses(req, res);
});

router.get('/classes/:id', (req, res) => {
  req.context.models.getClass(req, res);
});

router.get('/summons', (req, res) => {  
  req.context.models.getAllSummons(req, res);
});

router.get('/summons/:id', (req, res) => {
  req.context.models.getSummon(req, res);
});

router.get('/skills', (req, res) => {
  req.context.models.getSkills(req, res);
});

router.get('/skills/:id', (req, res) => {
  req.context.models.getSkill(req, res);
});

router.get('/weapons', (req, res) => {  
  req.context.models.getAllWeapons(req, res);
});

router.get('/weapons/:id', (req, res) => {
  req.context.models.getWeapon(req, res);
});

export default router;