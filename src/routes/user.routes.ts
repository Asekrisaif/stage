import { Router } from 'express';
import { addUser, checkUser, getUsers, getUserById, updateUser, searchUsers } from '../controllers/user.controller';

const router = Router();

router.get('/all', getUsers); // Route pour récupérer tous les utilisateurs
router.post('/add', addUser); // Route pour ajouter un utilisateur
router.post('/check', checkUser); // Route pour vérifier un utilisateur
router.get('/search', searchUsers); // Route pour rechercher des utilisateurs (DOIT ÊTRE AVANT '/:id')
router.get('/:id', getUserById); // Route pour récupérer un utilisateur par son ID
router.put('/:id', updateUser); // Route pour mettre à jour un utilisateur par son ID

export default router;