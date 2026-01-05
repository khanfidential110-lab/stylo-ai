import { TemperatureUnit } from '../../database/entities/user.entity';
export declare class UpdateUserDto {
    name?: string;
    city?: string;
    timezone?: string;
    temperatureUnit?: TemperatureUnit;
}
