import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

type ConnectionType = 'connect' | 'disconnect' | 'timeout';

export class MainPacketDto {
  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  @IsString()
  deviceId: string;
}

export class CanlogPacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    status: string
  }) {
    super(target.deviceId);
    this.status = target.status;
  }

  @IsString()
  status: string;
}

export class OtherPacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    getPacketUnixTime: number
  }) {
    super(target.deviceId);
    this.getPacketUnixTime = target.getPacketUnixTime;
  }

  @IsNumber()
  getPacketUnixTime: number;
}

export class ConnManagePacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    timeAction: number,
    connectionType: ConnectionType
  }) {
    super(target.deviceId);
    this.timeAction = target.timeAction;
    this.connectionType = target.connectionType;
  }

  @IsIn([ 'connect', 'disconnect', 'timeout' ])
  connectionType: ConnectionType;

  @IsNumber()
  timeAction: number;
}

export class DeviceStatusPacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    status: 'A' | 'N',
  }) {
    super(target.deviceId);
    this.status = target.status;
  }

  @IsIn([ 'A', 'N' ])
  status: 'A' | 'N';
}

export class ResponsePacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    response: string,
  }) {
    super(target.deviceId);
    this.response = target.response;
  }

  @IsString()
  response: string;
}

export class CommandLogPacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    result: string,
    command: string,
  }) {
    super(target.deviceId);
    this.result = target.result;
    this.command = target.command;
  }

  @IsString()
  result: string;
  @IsString()
  command: string;
}

export class RegInfoPacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    sim1: string,
    sim2: string,
    serial: number,
    series: number,
    dateCreate: number,
  }) {
    super(target.deviceId);
    this.sim1 = target.sim1;
    this.sim2 = target.sim2;
    this.serial = target.serial;
    this.series = target.series;
    this.dateCreate = target.dateCreate;
  }

  @IsString()
  @IsOptional()
  sim1: string;

  @IsString()
  @IsOptional()
  sim2: string;

  @IsNumber()
  serial: number;

  @IsNumber()
  series: number;

  @IsNumber()
  dateCreate: number;
}

export class NfcPacketDto extends MainPacketDto {
  constructor(target: {
    deviceId: string,
    nfcStatus: string,
    cell1: string,
    cell2: string,
    cell3: string,
    educationMode: string,
    workTimeStart: string,
    workTimeEnd: string,
    card1: string,
    card2: string,
    card3: string,
    card4: string,
  }) {
    super(target.deviceId);
    this.nfcStatus = target.nfcStatus;
    this.cell1 = target.cell1;
    this.cell2 = target.cell2;
    this.cell3 = target.cell3;
    this.educationMode = target.educationMode;
    this.workTimeStart = target.workTimeStart;
    this.workTimeEnd = target.workTimeEnd;
    this.card1 = target.card1;
    this.card2 = target.card2;
    this.card3 = target.card3;
    this.card4 = target.card4;
  }

  @IsString()
  nfcStatus: string;
  @IsString()
  cell1: string;
  @IsOptional()
  @IsString()
  cell2: string;
  @IsOptional()
  @IsString()
  cell3: string;
  @IsOptional()
  @IsString()
  educationMode: string;
  @IsString()
  workTimeStart: string;
  @IsString()
  workTimeEnd: string;
  @IsString()
  @IsOptional()
  card1: string;
  @IsString()
  @IsOptional()
  card2: string;
  @IsString()
  @IsOptional()
  card3: string;
  @IsString()
  @IsOptional()
  card4: string;
}
