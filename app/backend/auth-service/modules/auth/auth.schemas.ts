export const RegisterBody = {
  type: "object",
  required: ["username", "password"],
  additionalProperties: false,
  properties: {
    username: { type: "string", minLength: 3, maxLength: 32 },
    password: { type: "string", minLength: 8, maxLength: 128 },
  },
} as const;

export const LoginBody = RegisterBody;
