#!/usr/bin/env node
import MysqlConnect from '@Database/MysqlConnect';
import bcrypt from 'bcrypt';
import Config from '@Config';
import { exit } from 'node:process';
import { Logger } from '@Commons/Logger';
import { generateUUID } from '@Helper';

console.debug(`######################################################################`);
(async () => {
    const conn = await MysqlConnect.getConnection();
    await conn.query(`SET FOREIGN_KEY_CHECKS = 0;`);

    await conn.query(`truncate table users;`);
    await conn.query(`truncate table email_auth;`);
    await conn.query(`truncate table auth_token;`);
    await conn.query(`truncate table messenger_chart;`);
    await conn.query(`truncate table messenger_master;`);
    await conn.query(`truncate table password_reset;`);
    await conn.query(`truncate table profile;`);

    await conn.query(`SET FOREIGN_KEY_CHECKS = 1;`);

    let count = 0;
    for await (const loop of [...Array(50)]) {
        count = count + 1;

        const uid = generateUUID();
        const type = `010030`;
        const level = `030010`;
        const status = `020020`;
        const email = `bora${count}@gmail.com`;
        const password = `${bcrypt.hashSync('password', Number(Config.BCRYPT_SALT))}`;
        const nickname = `bora${count}`;

        const [userResult] = await conn.query(
            `insert into users (uid, type, level, status, email, password, nickname, email_verified_at, updated_at, created_at) values ('${uid}', '${type}', '${level}', '${status}', '${email}', '${password}', '${nickname}', now(), now(), now());`,
        );
        if (!userResult) {
            Logger.error(`${count} ${loop} ${email} users insert error...`);
            exit();
        }
        const insertId = JSON.parse(JSON.stringify(userResult)).insertId;

        const [emailAuthResult] = await conn.query(
            `insert into email_auth (user_id, auth_code, status, verified_at, created_at) values ('${insertId}', '${generateUUID()}', 'Y', now(), now());`,
        );
        if (!emailAuthResult) {
            Logger.error(`${count} ${loop} ${email} email_auth insert error...`);
            exit();
        }

        const [profileResult] = await conn.query(
            `insert into profile (user_id, profile_image_id, updated_at, created_at) values ('${insertId}', 1, now(), now());`,
        );
        if (!profileResult) {
            Logger.error(`${count} ${loop} ${email} profile insert error...`);
            exit();
        }

        Logger.info(`${count} ${loop} ${email} success........`);
    }

    console.debug(`######################################################################`);
    exit();
})();
