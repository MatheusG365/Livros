// Compatibilidade com a versão anterior do projeto.
// O cadastro oficial agora usa a API em service/usuario/usuarios.js.
export async function cadastrarUsuario() {
  throw new Error("Use o cadastro de usuário da API.");
}
export async function verificarUsuario() { return null; }
