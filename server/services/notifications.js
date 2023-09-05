import { createTransport } from 'nodemailer';
import { renderTemplate } from './utils.js';

/**
 * Retrieves the SMTP configuration from the environment.
 * @param {any} env
 * @returns {any} SMTP configuration
 */
export function getSmtpConfig(env) {
  const {
    EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_USER,
    EMAIL_SMTP_PASSWORD,
  } = env;

  let config = {
    host: EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
  };

  if (EMAIL_SMTP_USER && EMAIL_SMTP_PASSWORD) {
    config.auth = {
      user: EMAIL_SMTP_USER,
      pass: EMAIL_SMTP_PASSWORD,
    };
  }

  return config;
}

/**
 * Sends a notification to the specified email address.
 * @param {string} email
 * @param {string} subject
 * @param {string} templatePath
 * @param {any} data
 * @param {any} env
 * @returns {Promise<any>} A promise that resolves to the result of the send operation.
 */
export async function sendNotification(
  email,
  subject,
  templatePath,
  data = {},
  env = process.env
) {
  const config = getSmtpConfig(env);
  const transport = createTransport(config);
  return await transport.sendMail({
    from: env.EMAIL_ADMIN,
    to: email,
    subject,
    html: await renderTemplate(templatePath, data),
  });
}
