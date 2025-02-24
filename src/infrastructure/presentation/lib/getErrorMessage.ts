// Utilitaire pour obtenir un message d'erreur clair si il est identifiable
// et une sérialisation de l'erreur sinon
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
