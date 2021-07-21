export interface BindVehicleInterface {
  sim_id: string;
  event_ident?: string;
}
export interface CurrentBindVehicleInterface extends BindVehicleInterface {
  tokens: string[];
}

export interface PersonBindVehicleInterface extends BindVehicleInterface {
  expire_date?: number;
  token: string;
  client?: string;
}

export interface DeviceDataInterface {
  id: string;
  mFD: number;
  bin: string;
  binbuffer: Buffer;
  BufHeader: Buffer;
  BufEvents: Buffer;
  BufData: Buffer;
  hex: string;
  header: {
    ID_PAC: number;
    OFFS_DATA: number;
    PAC_CNT: number;
    rezerv: number;
    PAR: number;
  };
  data: {
    data: DataPacketInterface;
  };
  confirmation: string;
}

export interface DataPacketInterface {
  gsm_jamming: number;
  gps_jamming: number;
  lin_status: number;
  nfc_status: number;
  device_id: string;
  timegps: number;
  week: number;
  // status: number; добавили разбор
  terminalStatus: {
    hijacking: number;
    gpsReceiverInSleepMode: number;
    gpsAntennaConnectionError: number;
    defaultProfileUse: number;
    gpsReceiverError: number;
    parked: number;
    underProtection: number;
  };
  //
  height: number;
  speed: number;
  angle_direction: number;
  mileage: number;
  fuel_consumption: number;
  moto_hours: number;
  level_fuel: number;
  speed_engine: number;
  // pedal_position: number добавил разбор;
  pedalPosition: {
    pressedClutch: number;
    pressedBrake: number;
    cruiseEnabled: number;
    positionGasPedal: number;
  };
  //
  engine_temperature: number;
  service_mileage: number;
  level_fuel_acp1: number;
  level_fuel_acp2: number;
  level_fuel_acp3: number;
  level_fuel_acp4: number;
  charge_battery_terminal: number;
  // sensor1 разбираю состояние сухих контактов
  sensorState: {
    engineBlocked: number;
    doorControlDriver: number;
    doorControlPassenger: number;
    activateEmergencyAlarm: number;
    driverDoorStatus: number;
    passengerDoorStatus: number;
    trunkDoorStatus: number;
    hoodDoorStatus: number;
    ignitionWithoutPlugs: number;
    ignition: number;
    geoMonitoring: number;
    roadAccident: number;
    dangerousDriving: number;
  };
  // sensor2: string;
  // old_sensor1: string;
  sensorDriving: {
    braking: number;
    acceleration: number;
    turnLeft: number;
    turnRight: number;
    sharpBraking: number;
    sharpAcceleration: number;
    sharpTurnLeft: number;
    sharpTurnRight: number;
    offRoad: number;
  };
  // old_sensor2: string;
  voltage_battery: number;
  voltage_onboart: number;
  chip_temperature: number;
  gsm_level: number;
  satellitesNumber: number;
  latitude: number;
  longitude: number;
  unixtime: number;
  timegetpacket: number;
  // buffer: Buffer;
  doors: 'OPEN' | 'CLOSE';
  loc: any;
  SecurityStateFlagCan: {
    ignitions: number;
    factoryAlarmActivated: number;
    carClosedFactoryControlPanel: number;
    keyInIgnition: number;
    dynamicIgnition: number;
    passengerFrontDoorOpen: number;
    passengerRearDoorOpen: number;

    driverDoorOpen: number;
    passengerAllDoorOpen: number;
    trunkOpen: number;
    hoodOpen: number;
    HandBrakeActivated: number;
    FootBrakeActivated: number;
    enginedWorked: number;
    webastoOn: number;
  };
  emergencyCodes: {
    stop: number;
    oilPressureLevel: number;
    engineTemperature: number;
    handBrakeError: number;
    chargeBatteryError: number;
    airbag: number;

    checkEngine: number;
    lightingError: number;
    lowTireAirPressure: number;
    brakePads: number;
    warning: number;
    abs: number;
    lowLevelPetrol: number;

    espError: number;
    sparkPlugIndicator: number;
    fapError: number;
    electricalPressureAdjustment: number;
    parkingLights: number;
    lowBeamHeadlights: number;
    highBeamHeadlights: number;

    passengerSeatBelt: number;
    driverSeatBelt: number;
    readyStartMoving: number;
    cruiseControl: number;
    automaticRetarder: number;
    manualRetarder: number;
    conditionerOn: number;
  };
  lac: number;
  cell_id: number;
  gsm_level_full: number;
  gsm_registration: number;
  county_operator_code: number;
  version: number;
  device_type: number;
}
