import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

export const getDefault = (req: Request, res: Response): void => {
    res.json({
        msg: 'API fonctionnelle'
    });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.utilisateur.findMany();
        res.json({ users });
    } catch (err) {
        // Typer l'erreur comme un objet Error
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des utilisateurs' });
        }
    }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
    const { nom, prenom, email, telephone, adresse, motDePasse, role } = req.body;

    if (!nom || !prenom || !email || !telephone || !adresse || !motDePasse || !role) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        const newUser = await prisma.utilisateur.create({
            data: {
                nom,
                prenom,
                email,
                telephone,
                adresse,
                motDePasse,
                role,
                inscritLe: new Date()
            }
        });
        res.status(201).json({
            message: 'Utilisateur ajouté avec succès',
            user: newUser
        });
    } catch (err) {
        // Typer l'erreur comme un objet Error
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'ajout de l\'utilisateur.' });
        }
    }
};

export const checkUser = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasse } = req.body;

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (user && user.motDePasse === motDePasse) {
            res.json({
                message: 'Compte correct',
                user
            });
        } else {
            res.status(404).json({ error: 'Compte incorrect' });
        }
    } catch (err) {
        // Typer l'erreur comme un objet Error
        if (err instanceof Error) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la vérification de l\'utilisateur' });
        }
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { id: Number(id) } // Convertir l'ID en nombre
        });

        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération de l\'utilisateur' });
        }
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, adresse, motDePasse, role } = req.body;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide' });
        return;
    }

    if (!nom || !prenom || !email || !telephone || !adresse || !motDePasse || !role) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        const updatedUser = await prisma.utilisateur.update({
            where: { id: parseInt(id) },
            data: {
                nom,
                prenom,
                email,
                telephone,
                adresse,
                motDePasse,
                role
            }
        });
        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser
        });
    } catch (err) {
        // Typer l'erreur comme un objet Error
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour de l\'utilisateur' });
        }
    }
};
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;

    if (!query) {
        res.status(400).json({ error: 'Le paramètre de recherche est requis.' });
        return;
    }

    try {
        const users = await prisma.utilisateur.findMany({
            where: {
                OR: [
                    { nom: { contains: query as string, mode: 'insensitive' } },
                    { prenom: { contains: query as string, mode: 'insensitive' } },
                    { email: { contains: query as string, mode: 'insensitive' } }
                ]
            }
        });

        res.json({ users });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la recherche des utilisateurs' });
        }
    }
};
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    if (!newPassword) {
        res.status(400).json({ error: 'Le nouveau mot de passe est requis.' });
        return;
    }

    try {
        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 est le coût du hachage

        // Mettre à jour le mot de passe dans la base de données
        const updatedUser = await prisma.utilisateur.update({
            where: { id: Number(id) },
            data: { motDePasse: hashedPassword }
        });

        res.status(200).json({
            message: 'Mot de passe mis à jour avec succès',
            user: updatedUser
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour du mot de passe' });
        }
    }
};