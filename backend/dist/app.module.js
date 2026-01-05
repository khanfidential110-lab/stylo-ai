"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const wardrobe_module_1 = require("./wardrobe/wardrobe.module");
const outfits_module_1 = require("./outfits/outfits.module");
const weather_module_1 = require("./weather/weather.module");
const chat_module_1 = require("./chat/chat.module");
const subscription_module_1 = require("./subscription/subscription.module");
const health_module_1 = require("./health/health.module");
const configuration_1 = require("./config/configuration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const databaseUrl = process.env.DATABASE_URL;
                    if (databaseUrl) {
                        return {
                            type: 'postgres',
                            url: databaseUrl,
                            entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
                            migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                            synchronize: process.env.NODE_ENV !== 'production',
                            logging: process.env.NODE_ENV === 'development',
                            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: configService.get('database.host'),
                        port: configService.get('database.port'),
                        username: configService.get('database.username'),
                        password: configService.get('database.password'),
                        database: configService.get('database.name'),
                        entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
                        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                        synchronize: configService.get('NODE_ENV') === 'development',
                        logging: configService.get('NODE_ENV') === 'development',
                    };
                },
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            wardrobe_module_1.WardrobeModule,
            outfits_module_1.OutfitsModule,
            weather_module_1.WeatherModule,
            chat_module_1.ChatModule,
            subscription_module_1.SubscriptionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map