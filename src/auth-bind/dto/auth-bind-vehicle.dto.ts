import { IsString } from 'class-validator';

export class AuthBindVehicleDto {
  constructor(target: { sim_id: string; token: string }) {
    this.sim_id = target.sim_id;
    this.token = target.token;
  }

  @IsString()
  sim_id: string;

  @IsString()
  token: string;
}
