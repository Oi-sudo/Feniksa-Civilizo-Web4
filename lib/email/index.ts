export async function sendVerificationEmail(email: string, verificationUrl: string) {
  // Alpha console adapter. A real provider will replace this before public launch.
  console.info(`[Feniksa verification] ${email}: ${verificationUrl}`);
}
