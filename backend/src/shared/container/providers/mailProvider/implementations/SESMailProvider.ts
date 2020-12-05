/* eslint-disable no-console */
import { injectable, inject, container } from 'tsyringe';

import nodemailer, { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/mailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {}

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    console.log('funcionou');
  }
}
