# Configuração de Ambiente

## Variáveis Necessárias

### WalletConnect Project ID
1. Acesse [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Crie um novo projeto
3. Copie o Project ID
4. Adicione ao arquivo `.env.local`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Desenvolvimento Local
Para desenvolvimento local com backend rodando:

```bash
VITE_API_BASE=http://localhost:5000/api
```

### Produção
Em produção no Vercel, as chamadas `/api/*` são automaticamente redirecionadas para `api.snelabs.space`.

## Arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id
# VITE_API_BASE=http://localhost:5000/api  # Apenas para desenvolvimento
```
