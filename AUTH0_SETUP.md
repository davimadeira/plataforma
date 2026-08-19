# Login único do site e da escola online

Os dois projetos usam **uma única aplicação Auth0**. Assim, o aluno cria uma conta só e, ao abrir o segundo endereço, o Auth0 reconhece a sessão existente.

## 1. Criar a aplicação

1. Crie uma conta gratuita em <https://auth0.com/signup>.
2. No painel, abra **Applications > Applications > Create Application**.
3. Use o nome `Matheus Vidal` e o tipo **Regular Web Application**.
4. Em **Settings**, cadastre os valores abaixo.

### Allowed Callback URLs

```text
https://plataforma-theta-seven.vercel.app/auth/callback,
https://cursos-matheus-vidal.vercel.app/auth/callback,
http://localhost:3000/auth/callback,
http://localhost:3001/auth/callback
```

### Allowed Logout URLs

```text
https://plataforma-theta-seven.vercel.app,
https://cursos-matheus-vidal.vercel.app,
http://localhost:3000,
http://localhost:3001
```

### Allowed Web Origins

```text
https://plataforma-theta-seven.vercel.app,
https://cursos-matheus-vidal.vercel.app,
http://localhost:3000,
http://localhost:3001
```

## 2. Variáveis dos projetos na Vercel

Cadastre em **Settings > Environment Variables**, nos ambientes Production, Preview e Development.

Nos dois projetos:

```text
AUTH0_DOMAIN=dominio exibido no Auth0
AUTH0_CLIENT_ID=Client ID exibido no Auth0
AUTH0_CLIENT_SECRET=Client Secret exibido no Auth0
```

No projeto `plataforma`:

```text
APP_BASE_URL=https://plataforma-theta-seven.vercel.app
AUTH0_SECRET=uma chave aleatória com pelo menos 32 bytes
```

No projeto `cursos-matheus-vidal`:

```text
APP_BASE_URL=https://cursos-matheus-vidal.vercel.app
AUTH0_SECRET=outra chave aleatória com pelo menos 32 bytes
```

Depois de salvar, faça um novo deployment dos dois projetos.

## 3. Fluxo entregue

- O site institucional e o catálogo de cursos continuam públicos.
- `Minha conta`, `Minhas aulas` e os vídeos exigem autenticação.
- A mesma conta funciona nos dois endereços.
- A sessão central do Auth0 permite entrar no segundo endereço sem digitar a senha novamente.
- O painel administrativo continua separado e exige o PIN administrativo.
