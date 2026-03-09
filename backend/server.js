// ============================================================================
// The Center — Punto de entrada principal del servidor
// ============================================================================

import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[The Center] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[The Center] Entorno: ${process.env.NODE_ENV || 'development'}`);
});
