import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionscontrollers = new SessionsController();

sessionsRouter.post('/', sessionscontrollers.create);

export default sessionsRouter;
