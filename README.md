# 🍳 Pitadas & Descobertas

**Uma plataforma moderna de receitas culinárias com interface responsiva e busca inteligente**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Acesse%20Aqui-brightgreen)](https://devalex-full.github.io/Suas-Receitas-Favoritas/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/DevAlex-full)

## 📖 Sobre o Projeto

Pitadas & Descobertas é uma aplicação web que oferece um catálogo completo de receitas culinárias, permitindo aos usuários descobrir, pesquisar e filtrar receitas por categorias. O projeto utiliza a API TheMealDB para fornecer uma ampla variedade de receitas internacionais com descrições detalhadas, ingredientes e instruções de preparo.

### ✨ Principais Funcionalidades

- **🔍 Busca Inteligente**: Sistema de pesquisa em tempo real com debounce otimizado
- **🏷️ Filtros por Categoria**: Organização por doces, salgados e vegetarianos
- **📱 Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **🎨 Interface Moderna**: Design limpo com gradientes e animações suaves
- **📺 Integração com YouTube**: Links diretos para vídeos tutoriais
- **⚡ Performance Otimizada**: Carregamento assíncrono e lazy loading de imagens
- **🎭 Modal Interativo**: Visualização detalhada das receitas em modal

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design moderno com Flexbox, Grid e Custom Properties
- **JavaScript ES6+**: Funcionalidades interativas e consumo de API
- **Google Fonts**: Tipografia Poppins para melhor legibilidade

### API
- **TheMealDB API**: Base de dados de receitas internacionais
- **Fetch API**: Requisições HTTP assíncronas

### Metodologias
- **Mobile First**: Desenvolvimento priorizando dispositivos móveis
- **Progressive Enhancement**: Melhoria progressiva da experiência
- **Responsive Design**: Layout adaptável para todos os dispositivos

## 🚀 Funcionalidades Técnicas

### Arquitetura da Aplicação
```
src/
├── css/
│   ├── reset.css      # Reset CSS personalizado
│   └── main.css       # Estilos principais com CSS Variables
├── scripts/
│   └── engine.js      # Lógica principal da aplicação
└── index.html         # Estrutura HTML semântica
```

### Recursos Implementados

#### 🔄 Sistema de Busca Avançado
- Debounce de 800ms para otimizar requisições
- Busca por nome da receita
- Filtros por categoria com mapeamento inteligente
- Reset automático de filtros durante busca

#### 📊 Gerenciamento de Estado
- Cache local de receitas carregadas
- Controle de estado de loading e erro
- Sincronização entre busca e filtros

#### 🎯 UX/UI Otimizada
- Animações CSS com `transform` e `opacity`
- Lazy loading de imagens com fallback
- Indicador de progresso de scroll
- Menu mobile com animação hamburger

#### ⚡ Performance
- Requisições assíncronas otimizadas
- Throttling de eventos de scroll
- Imagens otimizadas com `object-fit`
- Animações com `will-change` para melhor performance

## 📱 Responsividade

O projeto utiliza uma abordagem **Mobile First** com breakpoints estratégicos:

- **Mobile**: < 768px (design base)
- **Tablet**: 768px - 1199px
- **Desktop**: ≥ 1200px

### Adaptações por Dispositivo
- Menu hamburger animado para mobile
- Grid responsivo com `auto-fill` e `minmax`
- Tipografia escalável com `clamp()` e viewport units
- Touch targets otimizados (mínimo 44px)

## 🎨 Design System

### Paleta de Cores
```css
:root {
    --primary-purple: #8b5cf6;
    --dark-purple: #6d28d9;
    --light-purple: #a78bfa;
    --purple-gradient: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
    --black: #000000;
    --dark-gray: #1f2937;
    --medium-gray: #374151;
    --light-gray: #f3f4f6;
    --white: #ffffff;
}
```

### Tipografia
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Escala**: Sistema de tamanhos responsivos

## 🔧 Como Executar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para API e Google Fonts)

### Instalação
```bash
# Clone o repositório
git clone https://github.com/DevAlex-full/Suas-Receitas-Favoritas.git

# Entre no diretório
cd Suas-Receitas-Favoritas

# Abra o arquivo index.html no navegador
# ou utilize um servidor local
npx live-server
```

### Estrutura de Arquivos
```
Suas-Receitas-Favoritas/
│
├── index.html          # Página principal
├── src/
│   ├── css/
│   │   ├── reset.css   # Reset CSS
│   │   └── main.css    # Estilos principais
│   └── scripts/
│       └── engine.js   # JavaScript principal
├── README.md           # Documentação
└── LICENSE            # Licença do projeto
```

## 🌐 API Integration

### TheMealDB API Endpoints
```javascript
const API_CONFIG = {
    BASE_URL: 'https://www.themealdb.com/api/json/v1/1/',
    ENDPOINTS: {
        SEARCH: 'search.php?s=',      // Busca por nome
        CATEGORY: 'filter.php?c=',    // Filtro por categoria
        RANDOM: 'random.php',         // Receita aleatória
        LOOKUP: 'lookup.php?i='       // Detalhes por ID
    }
};
```

### Mapeamento de Categorias
- **Doces**: Dessert
- **Salgados**: Beef, Chicken, Pork, Seafood, Pasta
- **Vegetarianos**: Vegetarian, Vegan

## ♿ Acessibilidade

- **Navegação por teclado**: Focus visível e ordem lógica
- **Screen readers**: Estrutura semântica e alt texts
- **Contraste**: Ratio mínimo de 4.5:1 para textos
- **Touch targets**: Mínimo 44px para elementos interativos
- **Reduced motion**: Respeita preferências de animação do usuário

## 🎯 Melhorias Futuras

- [ ] **PWA**: Service Worker para funcionalidade offline
- [ ] **Favoritos**: Sistema de receitas favoritas com LocalStorage
- [ ] **Filtros Avançados**: Tempo de preparo, dificuldade, ingredientes
- [ ] **Dark Mode**: Tema escuro com toggle
- [ ] **Internacionalização**: Suporte a múltiplos idiomas
- [ ] **Testes**: Implementação de testes unitários e E2E
- [ ] **Analytics**: Google Analytics para métricas de uso

## 📊 Métricas de Performance

### Lighthouse Score (Objetivo)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+

### Otimizações Implementadas
- Lazy loading de imagens
- CSS crítico inline
- JavaScript não-bloqueante
- Compressão de assets
- Cache de requisições API

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Guidelines de Contribuição
- Siga o padrão de código existente
- Adicione comentários em português
- Teste em múltiplos dispositivos
- Mantenha a responsividade
- Garanta acessibilidade

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**DevAlex-full**
- GitHub: [@DevAlex-full](https://github.com/DevAlex-full)
- LinkedIn: https://www.linkedin.com/in/alexander-bueno-43823a358/
- Email: alex.bueno22@hotmail.com

## 🙏 Agradecimentos

- **TheMealDB**: Pela API gratuita e completa
- **Google Fonts**: Pela tipografia Poppins
- **Comunidade Dev**: Pelas inspirações e feedbacks

---

<div align="center">

**🚀 Desenvolvido com ❤️ por DevAlex-full**

[⭐ Star este projeto](https://devalex-full.github.io/Suas-Receitas-Favoritas/) se ele foi útil para você!

</div>
