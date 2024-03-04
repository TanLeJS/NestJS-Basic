import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { Subscriber } from 'rxjs';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { SubscriberSchema } from 'src/subscribers/schema/subscriber.schema';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Job.name, schema: JobSchema }
    ]),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS')
          }
        },

        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        },
        preview:
          configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
