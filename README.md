# SENAI Booke / Livraria

Aplicativo React Native (Expo) para a atividade de consumo da API de livros.

## O que foi mantido

- Estrutura original de `components`, `screens` e `service`.
- Busca de livros e categorias pela API.
- Card, busca, categorias e identidade visual SENAI Booke.
- Assets e configuração Expo existentes.

## O que foi corrigido/adicionado

- Login com suporte à API e fallback para a conta cadastrada localmente.
- Cadastro de usuário continua **local**, sem enviar o usuário para a API.
- Favoritos só ficam disponíveis depois do login e são separados por usuário.
- Botão de sair aparece quando o usuário está logado.
- Favoritos persistem no aparelho.
- Cadastro de livro exige preço e envia o preço para a API.
- Filtro por faixa de preço + ordenação por preço.
- Câmera do celular no cadastro do livro.
- Troca entre câmera traseira e frontal.
- Pré-visualização e remoção da foto antes do cadastro.
- Ícones Ionicons no lugar dos emojis usados nos botões.
- Modo claro/escuro segue automaticamente o tema do sistema. Não existe mais botão manual de tema.
- Loading, erro e atualização dos livros.
- Tela de detalhes e tela exclusiva de favoritos.

## Instalação

Use Node.js compatível com Expo SDK 54.

```bash
npm install
npx expo start -c
```

Se o Expo pedir para alinhar uma dependência, execute:

```bash
npx expo install expo-camera
```

## Câmera

A câmera funciona em aparelho físico e precisa da permissão do sistema. No Expo Go, aceite a permissão quando solicitada.

O cadastro envia a URI da foto capturada no campo `imagem`. Isso pressupõe que o endpoint `POST /livros` aceite uma string nesse campo, como a estrutura usada pelo projeto original. Se a sua API exigir upload multipart para imagens, será necessário adaptar somente o service de cadastro.

## Tema

O aplicativo usa `useColorScheme()` e a configuração `userInterfaceStyle: automatic`. Ao trocar o tema do Android/iOS para claro ou escuro, o aplicativo acompanha automaticamente.
