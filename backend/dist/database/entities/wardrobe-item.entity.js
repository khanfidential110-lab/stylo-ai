"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardrobeItem = exports.Pattern = exports.Season = exports.ClothingCategory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var ClothingCategory;
(function (ClothingCategory) {
    ClothingCategory["TOPS"] = "tops";
    ClothingCategory["BOTTOMS"] = "bottoms";
    ClothingCategory["DRESSES"] = "dresses";
    ClothingCategory["OUTERWEAR"] = "outerwear";
    ClothingCategory["FOOTWEAR"] = "footwear";
    ClothingCategory["ACCESSORIES"] = "accessories";
    ClothingCategory["ACTIVEWEAR"] = "activewear";
    ClothingCategory["SWIMWEAR"] = "swimwear";
    ClothingCategory["SLEEPWEAR"] = "sleepwear";
    ClothingCategory["FORMAL"] = "formal";
})(ClothingCategory || (exports.ClothingCategory = ClothingCategory = {}));
var Season;
(function (Season) {
    Season["SPRING"] = "spring";
    Season["SUMMER"] = "summer";
    Season["FALL"] = "fall";
    Season["WINTER"] = "winter";
    Season["ALL_SEASON"] = "all-season";
})(Season || (exports.Season = Season = {}));
var Pattern;
(function (Pattern) {
    Pattern["SOLID"] = "solid";
    Pattern["STRIPED"] = "striped";
    Pattern["FLORAL"] = "floral";
    Pattern["PLAID"] = "plaid";
    Pattern["GEOMETRIC"] = "geometric";
    Pattern["POLKA_DOT"] = "polka-dot";
    Pattern["ABSTRACT"] = "abstract";
    Pattern["ANIMAL_PRINT"] = "animal-print";
    Pattern["CAMO"] = "camo";
    Pattern["TIE_DYE"] = "tie-dye";
})(Pattern || (exports.Pattern = Pattern = {}));
let WardrobeItem = class WardrobeItem {
};
exports.WardrobeItem = WardrobeItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WardrobeItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.wardrobeItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], WardrobeItem.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ClothingCategory,
    }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "subcategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_image_url' }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "originalImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_image_url', nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "processedImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_color', nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_color_hex', nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "primaryColorHex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'secondary_colors', type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], WardrobeItem.prototype, "secondaryColors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Pattern,
        nullable: true,
    }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "pattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Season, array: true, default: [] }),
    __metadata("design:type", Array)
], WardrobeItem.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], WardrobeItem.prototype, "occasions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'formality_score', nullable: true }),
    __metadata("design:type", Number)
], WardrobeItem.prototype, "formalityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WardrobeItem.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], WardrobeItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_favorite', default: false }),
    __metadata("design:type", Boolean)
], WardrobeItem.prototype, "isFavorite", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'times_worn', default: 0 }),
    __metadata("design:type", Number)
], WardrobeItem.prototype, "timesWorn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_worn_at', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WardrobeItem.prototype, "lastWornAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], WardrobeItem.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'ai_metadata', nullable: true }),
    __metadata("design:type", Object)
], WardrobeItem.prototype, "aiMetadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WardrobeItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WardrobeItem.prototype, "updatedAt", void 0);
exports.WardrobeItem = WardrobeItem = __decorate([
    (0, typeorm_1.Entity)('wardrobe_items')
], WardrobeItem);
//# sourceMappingURL=wardrobe-item.entity.js.map