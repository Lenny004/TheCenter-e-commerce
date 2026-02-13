# The Center

E-commerce de prendas de vestir. Estructura mínima con backend Flask (SQLite) y frontend React (Vite).

## Requisitos

- **Backend:** Python 3.10+
- **Frontend:** Node.js 18+ y npm

## Estructura del proyecto

Ruta del proyecto: `C:\Users\Adria\Documents\TheCenter-e-commerce`

```
TheCenter-e-commerce/
├── backend/          # Flask + SQLite
│   ├── app.py
│   ├── models.py
│   ├── requirements.txt
│   └── .env.example   (copiar a .env y configurar)
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Configuración

- **Backend:** En `backend/` copia `.env.example` a `.env` y ajusta valores (no commitear `.env`).
- **Frontend:** Opcionalmente crea `frontend/.env` con `VITE_API_URL=http://localhost:5000` si el backend no corre en ese host/puerto.

## Instalación y ejecución

Abre la carpeta del proyecto y en la terminal:

### Backend (puerto 5000)

```bash
cd backend
python -m venv venv
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD): venv\Scripts\activate.bat
# Linux/macOS: source venv/bin/activate

pip install -r requirements.txt
python app.py
```

El backend quedará en **http://localhost:5000**.

### Frontend (puerto 5173)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend quedará en **http://localhost:5173**.

## Comunicación frontend–backend

- El frontend llama al backend en `http://localhost:5000` (configurable con `VITE_API_URL` en `.env` del frontend).
- **Endpoint de prueba:** `GET /api/health` — la página de inicio lo consume y muestra el estado del backend.

## Próximos pasos (48h)

- **PBI 1.1:** Login/Registro básico  
- **PBI 1.2:** Listar productos con filtro simple  
- **PBI 1.3:** Carrito básico  

## Licencia

Uso educativo / proyecto UFG.
