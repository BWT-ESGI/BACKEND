import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { PromotionModule } from './promotion/promotion.module';
import { SubmissionModule } from './submission/submission.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ReportModule } from './report/report.module';
import { DeliverableModule } from './deliverable/deliverable.module';
import { GroupModule } from './group/group.module';
import config from '@/config';
import { MinioModule } from './minio/minio.module';
import { DefenseModule } from './defense/defense.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        abortEarly: true,
      },
    }),
    MinioModule,
    DefenseModule,
    GroupModule,
    DeliverableModule,
    SubmissionModule,
    PromotionModule,
    ProjectModule,
    UsersModule,
    ReportModule,
    IamModule,
    EvaluationModule,
    StatisticsModule,
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: 'postgres',
          host: configService.postgres.host,
          port: configService.postgres.port,
          database: configService.postgres.name,
          username: configService.postgres.user,
          password: configService.postgres.password,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          synchronize: true,
          logging: true,
          ssl: false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
