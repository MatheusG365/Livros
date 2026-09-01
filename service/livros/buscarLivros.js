import { listarLivros } from "./livros";

export async function buscarLivros({ setLivros, setCarregando, setErro } = {}) {
  setCarregando?.(true);
  setErro?.("");
  try {
    const lista = await listarLivros();
    setLivros?.(lista);
    return lista;
  } catch (error) {
    setErro?.(error.message || "Não foi possível carregar os livros.");
    throw error;
  } finally {
    setCarregando?.(false);
  }
}
