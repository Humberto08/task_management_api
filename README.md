
## Task Manegement API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Tutorial: Construindo uma API RESTful com NestJS, TypeORM, e PostgreSQL

### Quem é o NestJs?
NestJS é um framework de desenvolvimento de aplicativos Node.js que utiliza TypeScript como linguagem principal. Inspirado por conceitos de programação orientada a objetos (OOP), programação funcional (FP) e arquitetura modular, NestJS facilita a criação de aplicações escaláveis e de fácil manutenção.

# Projeto

## Task Manegement API

Este projeto é uma API de gerenciamento de tarefas desenvolvida para estudar e aplicar conceitos avançados do framework NestJS, utilizando uma stack moderna e robusta.


## Stack da API

A API foi desenvolvida utilizando o `nestjs` e `nodejs`, junto das seguintes libs: `typescript`, `jest`. Para salvar os dados está sendo utilizando o `postgres`, por meio da ORM `typeOrm`. A aplicação também está containerizada com `docker` para facilitar o gerenciamento do ambiente.

## Funcionalidades

- CRUD de Tarefas: Implementado com Controllers, Services, Modules e Decorators.
- Validação de DTO: Utiliza `class-validator` para garantir que os dados recebidos estejam no formato correto.
- Variáveis de Ambiente: Configuradas com `ConfigService` para maior flexibilidade e segurança.
- Autenticação: Implementada com JWT (`JwtService`) e um guard personalizado (`AppGuard`) para proteger as rotas.
- Password Hashing: Utiliza bcrypt para garantir a segurança das senhas armazenadas.
- Banco de Dados: Integração planejada com PostgreSQL utilizando TypeORM.


## Execução da API

### Configuração
Para executar o projeto:

1 - Clone o respositório:
```bash 
git clone https://github.com/Humberto08/task_management_api.git
```

2 - Intale as dependências:
```
npm install
```
3 - Copie o arquivo .env.example e renomeie para .env, preenchendo todas as variáveis necessárias.

4 - Inicialize o container do banco de dados com Docker:
```
docker-compose up -d

```
5 - Execute as migrations com:
```
npm run migration:run

```

6 - Inicie o servidor em modo de desenvolvimento:
```
npm run start:dev
```

7 - Acesse o serviço em:
```
 http://localhost:3000.
```

8 - Acesse a documentação api em:
```
https://documenter.getpostman.com/view/24656609/2sA3s9CTA7
```

## Migrations
- Criar uma migration:
```
npm run migration:create --name=nome-da-migration
```

- Executar as migrations:
```
npm run migration:run
```

- Reverter as migrations:
```
npm run migration:revert
```


## Testes

Executa os testes usando Jest.
```
npm run test
```
Executa os testes em modo watch.
```
npm run test:watch
```

Executa os testes e gera um relatório de cobertura.
```
npm run test:cov
```

 API

Para subir a API, execute:
```
npm run start:dev
```
e acesse:
```
http://localhost:3000.
```


# Referências

NestJS: https://nestjs.com/

NodeJS: https://nodejs.org/pt

Jest: https://jestjs.io/pt-BR/

TypeORM: https://typeorm.io/

PostgreSQL: https://www.postgresql.org/


## Autores e colaboradores

- [@Humberto Luciano](https://www.github.com/Humberto08)


<div id='contatos' align="center">
  <p align="center">Made with 💜 by Humberto Luciano</p>
  <div id="contatos" align="center">
    <a href="https://www.linkedin.com/in/humberto-luciano/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
</div>
