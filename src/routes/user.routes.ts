import { Router } from 'express';
import { addUser, checkUser, getUsers } from '../controllers/user.controller';

const router = Router();

router.get('/all', getUsers); // Ajout de la route pour récupérer tous les utilisateurs
router.post('/add', addUser);
router.post('/check', checkUser);

export default router;
