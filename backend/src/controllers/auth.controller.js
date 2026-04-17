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

/**
 * Determina el tipo de usuario numérico a partir del rol en base de datos.
 * 1 = área pública (cliente). 2 = área privada (administración / vendedor).
 */
function userTypeFromRol(rol) {
    return rol === 'cliente' ? 1 : 2;
}

/**
 * GET /api/auth/setup-status
 * Indica si la base está sin usuarios: el primer registro debe ser administrador.
 */
export async function setupStatus(_req, res) {
    const count = await prisma.user.count();
    res.json({ needsAdminSetup: count === 0 });
}

// ── REGISTRO ────────────────────────────────────────────────────────────────
// Controlador para POST /api/auth/register

export async function register(req, res) {
    const { name, email, password, phone, rol } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
    }
    if (String(password).length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const userCount = await prisma.user.count();
    let effectiveRol;

    if (userCount === 0) {
        // Primer usuario: siempre administrador (no se acepta otro rol por API pública)
        effectiveRol = 'admin';
    } else {
        const requested = rol != null ? String(rol).trim() : 'cliente';
        if (requested === 'admin') {
            return res.status(403).json({
                error:
                    'No puedes registrarte como administrador aquí. Un administrador debe crear esa cuenta desde el panel.'
            });
        }
        effectiveRol = requested === 'vendedor' ? 'vendedor' : 'cliente';
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
                rol: effectiveRol
            }
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                rol: user.rol,
                userType: userTypeFromRol(user.rol)
            }
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
// Valida credenciales, calcula el tipo de usuario (1 = área pública, 2 = área privada)
// y devuelve token + usuario en el mismo formato estructural que el registro (objeto user).

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

    const userType = userTypeFromRol(user.rol);

    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol, userType },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            rol: user.rol,
            userType
        }
    });
}