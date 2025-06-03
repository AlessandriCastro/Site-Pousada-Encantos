import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cors from 'cors'
import routes from './routes.js'

const app = express()
const port = process.env.PORT || 3000

// Configuração do CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Middleware para processar JSON
app.use(express.json())

// Obter o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Servir arquivos estáticos
app.use(express.static(__dirname))

// Usar as rotas da API
app.use('/api', routes)

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em na porta ${port}`)
}) 