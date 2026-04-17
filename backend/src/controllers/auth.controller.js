// ============================================================================
// Auth Controller — Qué hace: maneja registro y login
// ============================================================================
// Dependencias:
// - PrismaClient: acceso a la base de datos
// - bcrypt: cifrado de contraseñas (no almacenar contraseñas en texto plano)
// - jwt: emisión de tokens de acceso

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// ── REGISTRO ────────────────────────────────────────────────────────────────
// Controlador para POST /api/auth/register

export async function register(req, res) {
    const { name, email, password, phone, rol } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
    }

    // Costo del hash bcrypt (10 es el valor habitual recomendado)
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                rol: rol || 'cliente'
            }
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente.',
            user: { id: user.id, name: user.name, email: user.email, rol: user.rol }
        });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }
        throw err;
    }
}

// ── LOGIN ───────────────────────────────────────────────────────────────────
// Controlador para POST /api/auth/login

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Mensaje genérico si no existe el usuario (evita enumeración de cuentas)
    if (!user) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, rol: user.rol }
    });
}