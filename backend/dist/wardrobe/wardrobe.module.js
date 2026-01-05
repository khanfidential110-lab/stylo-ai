"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardrobeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wardrobe_controller_1 = require("./wardrobe.controller");
const wardrobe_service_1 = require("./wardrobe.service");
const ai_service_1 = require("./ai.service");
const outfit_detection_service_1 = require("./outfit-detection.service");
const wardrobe_item_entity_1 = require("../database/entities/wardrobe-item.entity");
const user_entity_1 = require("../database/entities/user.entity");
let WardrobeModule = class WardrobeModule {
};
exports.WardrobeModule = WardrobeModule;
exports.WardrobeModule = WardrobeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wardrobe_item_entity_1.WardrobeItem, user_entity_1.User])],
        controllers: [wardrobe_controller_1.WardrobeController],
        providers: [wardrobe_service_1.WardrobeService, ai_service_1.AiService, outfit_detection_service_1.OutfitDetectionService],
        exports: [wardrobe_service_1.WardrobeService, ai_service_1.AiService, outfit_detection_service_1.OutfitDetectionService],
    })
], WardrobeModule);
//# sourceMappingURL=wardrobe.module.js.map