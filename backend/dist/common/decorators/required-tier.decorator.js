"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredTier = exports.REQUIRED_TIER_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRED_TIER_KEY = 'requiredTier';
const RequiredTier = (tier) => (0, common_1.SetMetadata)(exports.REQUIRED_TIER_KEY, tier);
exports.RequiredTier = RequiredTier;
//# sourceMappingURL=required-tier.decorator.js.map