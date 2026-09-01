import * as LocalAuthentication from "expo-local-authentication";

export async function getBiometria() {
  try {
    // Verifica se o aparelho possui suporte à biometria
    const possuiHardware =
      await LocalAuthentication.hasHardwareAsync();

    if (!possuiHardware) {
      console.log("Este aparelho não possui suporte à biometria.");
      return false;
    }

    // Verifica se existe alguma biometria cadastrada
    const biometriaCadastrada =
      await LocalAuthentication.isEnrolledAsync();

    if (!biometriaCadastrada) {
      console.log("Nenhuma biometria cadastrada no aparelho.");

      return false;
    }

    // Solicita a digital / Face ID
    const resultado =
      await LocalAuthentication.authenticateAsync({
        promptMessage:
          "Confirme sua identidade para cadastrar o livro",
        cancelLabel: "Cancelar",
        fallbackLabel: "Usar senha do aparelho",
        disableDeviceFallback: false,
      });

    if (resultado.success) {
      console.log("Biometria confirmada com sucesso!");
      return true;
    }

    console.log("Biometria não confirmada.");
    return false;

  } catch (error) {
    console.log("Erro ao solicitar biometria:", error);
    return false;
  }
}