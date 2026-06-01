# ReciclaConsciente - Guia do Descarte Consciente

## 📌 Visão Geral
O **ReciclaConsciente** é uma plataforma web educacional e interativa dedicada à conscientização sobre o descarte correto de lixo eletrônico (e-lixo). O projeto combina conteúdo informativo detalhado com ferramentas práticas para ajudar cidadãos a localizar pontos de coleta e entender os riscos ambientais e à saúde causados pelo descarte inadequado de tecnologia.

Este é um projeto acadêmico desenvolvido para a **UNIP (Universidade Paulista)** com previsão/contexto para 2026.

---

## 🚀 Funcionalidades Principais

### 1. Central de Conscientização
- **A Crise Oculta:** Explicação sobre as categorias de e-lixo (Pequenos equipamentos, TI, Telas, Eletrodomésticos).
- **Perigo Químico:** Detalhamento técnico sobre os impactos do Chumbo (Pb), Mercúrio (Hg) e Cádmio (Cd) no corpo humano e no meio ambiente.
- **Estatísticas em Tempo Real:** Painel com contadores animados exibindo dados globais e nacionais sobre a produção de resíduos eletrônicos.

### 2. Guia Prático de Descarte
- Sistema de abas interativas que fornece instruções passo a passo para:
  - **Smartphones/Tablets:** Backup, limpeza de dados e remoção de chips.
  - **Notebooks/PCs:** Preparação de HDs/SSDs e periféricos.
  - **Pilhas e Baterias:** Armazenamento seguro e isolamento de terminais.
  - **Eletrodomésticos:** Limpeza e logística de grandes volumes.

### 3. Localizador de Ecopontos (Mapa Interativo)
- **Geolocalização:** Permite encontrar pontos de coleta próximos usando a localização atual do usuário.
- **Busca por Endereço:** Integração com geocodificação para localizar pontos em qualquer região.
- **Integração com OpenStreetMap:** Exibe ecopontos reais cadastrados na base de dados global.
- **Rotas:** Link direto para o Google Maps para traçar rotas de condução até o ecoponto selecionado.

### 4. Gamificação e Recompensa
- **Download de Ebook:** O acesso ao guia completo em PDF ("Lixo Eletrônico: O que fazer com seus aparelhos velhos") é liberado automaticamente após o usuário enviar um feedback através do formulário integrado.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5 & CSS3:** Uso extensivo de variáveis CSS, Grid Layout, Flexbox e animações nativas.
- **JavaScript (Vanilla):** Lógica pura para manipulação de DOM, integração de APIs e animações, sem dependência de frameworks pesados.
- **Leaflet.js:** Biblioteca open-source para mapas interativos.
- **Font Awesome:** Ícones vetoriais para interface.
- **Google Fonts:** Tipografia moderna (Inter e Montserrat).

### Backend & Integrações
- **Vercel Serverless Functions (Node.js):** Proxy customizado para as APIs Nominatim e Overpass, garantindo segurança, tratamento de CORS e identificação de User-Agent adequada.
- **Nominatim API:** Serviço de geocodificação do OpenStreetMap.
- **Overpass API:** Ferramenta de mineração de dados para extrair locais de reciclagem do OpenStreetMap.
- **Web3Forms:** Serviço de processamento de formulários para envio de feedbacks via e-mail sem necessidade de backend próprio.

### Hospedagem
- **Vercel:** Plataforma de deploy contínuo com suporte a funções serverless e reescrita de URLs (`vercel.json`).

---

## 📂 Estrutura do Projeto

```text
reciclaconsciente/
├── index.html          # Estrutura principal e conteúdo SEO
├── style.css           # Estilização completa, temas e responsividade
├── script.js          # Lógica do mapa, abas, estatísticas e formulário
├── vercel.json         # Configuração de rotas e proxies da Vercel
├── api/                # Funções Serverless (Backend)
│   ├── nominatim.js    # Proxy para busca de endereços
│   └── overpass.js     # Proxy para busca de ecopontos
├── Lixo Eletrônico...  # Ebook educacional (PDF)
└── .git/               # Controle de versão
```

---

## 👨‍💻 Autor e Instituição
- **Desenvolvedor:** Pablo Alexandre de Vasconcelos
- **Curso:** Ciência da Computação
- **Instituição:** UNIP (Universidade Paulista)
- **Ano:** 2026

---

## 📄 Licença e Uso
Este projeto foi criado com fins educativos e de utilidade pública, promovendo a sustentabilidade e a preservação ambiental através da tecnologia consciente.