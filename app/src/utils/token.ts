export function generateToken(length: number) {
  const allowedCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  const token = [];
  for (let i = 0; i < length; i++) {
    const j = (Math.random() * (allowedCharacters.length - 1)).toFixed(0);
    token[i] = allowedCharacters[parseInt(j)];
  }
  return token.join("");
}

export function generateApiToken() {
  return `lk_${generateToken(32)}`;
}
