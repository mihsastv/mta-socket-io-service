import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
      create table device_log_connection
      (
          device_id       varchar
              constraint device_log_connection_device_id_key
                  unique,
          last_connection integer
      );

      alter table device_log_connection
          owner to postgres;
      create table mta_subscribe_vehicle
      (
          id          serial  not null
              constraint mta_subscribe_vehicle_pk
                  primary key,
          sim_id      varchar not null,
          event_ident varchar not null,
          token       varchar not null,
          client      varchar,
          expire_date integer
      );

      alter table mta_subscribe_vehicle
          owner to postgres;

      create unique index mta_subscribe_vehicle_id_uindex
          on mta_subscribe_vehicle (id);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    drop table if exists device_log_connection;
    drop table if exists mta_subscribe_vehicle;
  `);
}
