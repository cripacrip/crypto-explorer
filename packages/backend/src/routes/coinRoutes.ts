import { Router } from 'express';
import { authenticateJwt } from '../middleware/authenticateJwt';
import { validateEndpoint } from '../middleware/validateEndpoint';
import { listCoins, showCoin } from '../controllers/coinController';

const router = Router({});

router.get('/', authenticateJwt, validateEndpoint(listCoins.schema), listCoins.handler);
router.get('/:id', authenticateJwt, validateEndpoint(showCoin.schema), showCoin.handler);

export default router;
