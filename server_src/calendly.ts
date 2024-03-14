export interface ICalendlyTokens {
  clientId: string;
  clientSecret: string;
  webhookSigningKey: string;
  oauthLink: string;
}

export const calendlyTokens: ICalendlyTokens = {
  clientId: "MOCK",
  clientSecret: "MOCK",
  webhookSigningKey: "MOCK",
  oauthLink: "https://auth.calendly.com/oauth/authorize",
};
