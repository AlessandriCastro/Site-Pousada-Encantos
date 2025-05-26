import express from 'express'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const router = express.Router()

// Obter o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Caminho para o arquivo de dados
const dbPath = join(__dirname, 'data', 'db.json')

// Função para ler dados do arquivo
async function readData() {
    try {
        const data = await fs.readFile(dbPath, 'utf8')
        const parsedData = JSON.parse(data)
        
        // Garantir que todos os arrays necessários existam
        if (!parsedData.reservas) parsedData.reservas = []
        if (!parsedData.contatos) parsedData.contatos = []
        if (!parsedData.usuarios) parsedData.usuarios = []
        if (!parsedData.pagamentos) parsedData.pagamentos = []
        
        return parsedData
    } catch (error) {
        // Criar diretório data se não existir
        await fs.mkdir(join(__dirname, 'data'), { recursive: true })
        // Criar arquivo db.json com estrutura inicial
        const initialData = { 
            reservas: [], 
            contatos: [], 
            usuarios: [], 
            pagamentos: [] 
        }
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2))
        return initialData
    }
}

// Função para escrever dados no arquivo
async function writeData(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2))
}

// Rotas de Reservas
router.post('/reservas', async (req, res) => {
    try {
        console.log('Recebendo dados da reserva:', req.body)
        const data = await readData()
        const novaReserva = {
            id: Date.now().toString(),
            ...req.body,
            dataCriacao: new Date().toISOString(),
            status: 'pendente'
        }
        data.reservas.push(novaReserva)
        await writeData(data)
        console.log('Nova reserva criada:', novaReserva)
        res.status(201).json(novaReserva)
    } catch (error) {
        console.error('Erro ao criar reserva:', error)
        res.status(500).json({ error: 'Erro ao criar reserva' })
    }
})

router.get('/reservas', async (req, res) => {
    try {
        const data = await readData()
        res.json(data.reservas)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar reservas' })
    }
})

router.get('/reservas/:id', async (req, res) => {
    try {
        const data = await readData()
        const reserva = data.reservas.find(r => r.id === req.params.id)
        
        if (!reserva) {
            console.log('Reserva não encontrada:', req.params.id)
            return res.status(404).json({ error: 'Reserva não encontrada' })
        }
        
        console.log('Reserva encontrada:', reserva)
        res.json(reserva)
    } catch (error) {
        console.error('Erro ao buscar reserva:', error)
        res.status(500).json({ error: 'Erro ao buscar reserva' })
    }
})

// Rotas de Pagamentos
router.post('/pagamentos', async (req, res) => {
    try {
        console.log('Recebendo dados do pagamento:', req.body)
        
        // Validar dados recebidos
        if (!req.body.reservaId || !req.body.valor) {
            console.error('Dados inválidos:', req.body)
            return res.status(400).json({ error: 'Dados do pagamento incompletos' })
        }

        const data = await readData()
        console.log('Dados lidos do arquivo:', data)
        
        // Verificar se a reserva existe
        const reserva = data.reservas.find(r => r.id === req.body.reservaId)
        if (!reserva) {
            console.error('Reserva não encontrada:', req.body.reservaId)
            return res.status(404).json({ error: 'Reserva não encontrada' })
        }

        console.log('Reserva encontrada:', reserva)

        // Criar novo pagamento
        const novoPagamento = {
            id: Date.now().toString(),
            reservaId: req.body.reservaId,
            valor: req.body.valor,
            dataPagamento: new Date().toISOString(),
            status: 'aprovado'
        }

        console.log('Novo pagamento a ser criado:', novoPagamento)

        // Garantir que o array de pagamentos existe
        if (!data.pagamentos) {
            data.pagamentos = []
        }

        // Adicionar pagamento ao array
        data.pagamentos.push(novoPagamento)

        // Atualizar status da reserva
        reserva.status = 'confirmada'

        // Salvar alterações
        await writeData(data)
        console.log('Dados salvos com sucesso')

        console.log('Pagamento processado com sucesso:', novoPagamento)
        res.status(201).json(novoPagamento)
    } catch (error) {
        console.error('Erro detalhado ao processar pagamento:', error)
        res.status(500).json({ 
            error: 'Erro ao processar pagamento',
            details: error.message 
        })
    }
})

export default router 