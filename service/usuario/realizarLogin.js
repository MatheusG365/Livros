import { requisicao } from "../api";
import { salvarToken, salvarUsuario } from "./usuarioStorage";

export async function realizarLogin(email, senha) {
  if (!email?.trim() || !senha) throw new Error("Informe e-mail e senha.");

  const dados = await requisicao("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), senha }),
  });

  const token = dados?.access_token || dados?.token || dados?.accessToken || dados?.data?.access_token || dados?.data?.token;
  if (!token) throw new Error("A API respondeu, mas não enviou o token de autenticação.");

  const usuario = dados?.usuario || dados?.user || dados?.data?.usuario || dados?.data?.user || {
    email: email.trim(),
  };

  await salvarToken(token);
  await salvarUsuario({ ...usuario, email: usuario.email || email.trim() });
  return { token, usuario };
}
