import express from 'express';
import cookieParser from 'cookie-parser';

import { passport_authenticate } from '../passport-providers'

const router = express.Router();

router.use(express.json()); // For parsing application/json body
router.use(cookieParser()); // For using cookies

// Base route: /user

router.post('/register', (req, res) => {
  req.context.models.userRegister(req, res);
});

router.post('/login', passport_authenticate('local',
  (req, res) => {
    req.context.models.userLogin(req, res);
  })
);

router.post('/infos', passport_authenticate('jwt',
  (req, res) => {
    req.context.models.userInfos(req, res);
  })
);

router.post('/email', passport_authenticate('jwt',
  (req, res) => {
    req.context.models.userSetEmail(req, res);
  })
);

router.post('/sendreset', (req, res) => {
  req.context.models.userSendResetPassword(req, res);
});

router.post('/reset', (req, res) => {
  req.context.models.userResetPassword(req, res);
});

router.post('/logout', passport_authenticate('jwt',
  (req, res) => {
    req.context.models.userLogout(req, res);
  })
);

router.post('/delete', passport_authenticate('jwt',
  (req, res) => {
    req.context.models.userDelete(req, res);
  })
);

export default router;