import { Request, Response } from "express";
import pool from "../db/connection";

export const addUser = (req: Request, res: Response): void => {
    const { nom, prenom, email, telephone, adresse, motDePasse, role } = req.body;

    // Vérifiez que tous les champs sont présents
    if (!nom || !prenom || !email || !telephone || !adresse || !motDePasse || !role) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    const query = `
        INSERT INTO utilisateur (nom, prenom, email, telephone, adresse, motDePasse, role, inscritLe)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
        RETURNING *;
    `;

    pool.query(query, [nom, prenom, email, telephone, adresse, motDePasse, role], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.' });
        } else {
            res.status(201).json({
                message: 'Utilisateur ajouté avec succès',
                user: result.rows[0]
            });
        }
    });
};

export const checkUser = (req: Request, res: Response): void => {
    const { email, motDePasse } = req.body;

    const query = 'SELECT * FROM utilisateur WHERE email = $1 AND motDePasse = $2';

    pool.query(query, [email, motDePasse], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur' });
        } else if (result.rows.length > 0) {
            res.json({
                message: 'Compte correct',
                user: result.rows[0]
            });
        } else {
            res.status(404).json({ error: 'Compte incorrect' });
        }
    });
};
export const getUsers = (req: Request, res: Response): void => {
    pool.query('SELECT * FROM utilisateur', (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        } else {
            res.json({
                users: result.rows
            });
        }
    });
};
// Récupérer un utilisateur par ID
export const getUserById = (req: Request, res: Response): void => {
    const { id } = req.params; // Récupère l'ID de l'utilisateur depuis les paramètres de la requête

    const query = 'SELECT * FROM utilisateur WHERE id = $1';

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        } else if (result.rows.length > 0) {
            res.json({
                user: result.rows[0]
            });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    });
};