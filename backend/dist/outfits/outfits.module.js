"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutfitsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const outfits_controller_1 = require("./outfits.controller");
const outfits_service_1 = require("./outfits.service");
const recommendation_service_1 = require("./recommendation.service");
const outfit_entity_1 = require("../database/entities/outfit.entity");
const outfit_calendar_entity_1 = require("../database/entities/outfit-calendar.entity");
const wardrobe_module_1 = require("../wardrobe/wardrobe.module");
const weather_module_1 = require("../weather/weather.module");
let OutfitsModule = class OutfitsModule {
};
exports.OutfitsModule = OutfitsModule;
exports.OutfitsModule = OutfitsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([outfit_entity_1.Outfit, outfit_calendar_entity_1.OutfitCalendar]),
            wardrobe_module_1.WardrobeModule,
            weather_module_1.WeatherModule,
        ],
        controllers: [outfits_controller_1.OutfitsController],
        providers: [outfits_service_1.OutfitsService, recommendation_service_1.RecommendationService],
        exports: [outfits_service_1.OutfitsService, recommendation_service_1.RecommendationService],
    })
], OutfitsModule);
//# sourceMappingURL=outfits.module.js.map