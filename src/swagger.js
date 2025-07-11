import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: "1.0.0",
        title: "SALETA API",
        description: "Some description..."
    },
    host: "localhost:3333",
    servers: [
        {
            url: 'http://localhost:3333'
        }
    ],
    tags: [
        { name: 'Itens', description: 'Gerenciamento de itens achados e perdidos' },
        { name: 'Usuários', description: 'Gerenciamento de usuários' },
        { name: 'Login', description: 'Autenticação de usuários' },
        { name: 'Sessão', description: 'Controle de sessões de acesso (entradas e saídas)' },
        { name: 'Porta', description: 'Endpoints para controle da porta' },
        { name: 'Video', description: 'Endpoints para streaming de vídeo' },
        { name: 'Configuração', description: 'Gerenciamento de configurações do sistema' },
    ],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Entre com o token JWT no formato: Bearer {token}'
            }
        }
    },
    securityDefinitions: {
    bearerAuth: { 
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "Insira o token JWT com o prefixo Bearer. Ex: Bearer {token}"
    }
  },
    security: [{
    bearerAuth: []
  }]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes.js','./config/udpConfig.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    import('./index.js');           // Your project's root file
});