#!/usr/bin/env node
import MysqlConnect from '@Database/MysqlConnect';
import { exit } from 'node:process';
import { Logger } from '@Commons/Logger';
import { generateHexRandString } from '@Helper';
import { generateWords } from '@Commons/GenerateWords';
import lodash from 'lodash';

console.debug(`######################################################################`);
(async () => {
    const conn = await MysqlConnect.getConnection();

    const [messengerResult] = await conn.query(`select * from messenger_master`);

    if (!messengerResult) {
        console.log('messenger 를 먼저 등록해야 합니다..');
        exit();
    }

    for await (const room of JSON.parse(JSON.stringify(messengerResult))) {
        Logger.console(`room: ${room.id}`);
        const [targetResult] = await conn.query(`select * from messenger_target where room_id = '${room.id}'`);

        const targetUser: Array<number> = [];
        for await (const target of JSON.parse(JSON.stringify(targetResult))) {
            targetUser.push(target.user_id);
        }

        // 5~50 난수 발생
        const ranmdomLoop = Math.floor(Math.random() * 50) + 5;

        let chartCount = 0;
        for await (const chatLoop of [...Array(ranmdomLoop)]) {
            chartCount = chartCount + 1;

            const randTarget = lodash.shuffle(targetUser);
            const userId = randTarget[0];
            const targetId = randTarget[1];
            const chatCode = generateHexRandString();
            const generateWord = generateWords(Math.floor(Math.random() * 50) + 10);

            Logger.console(
                `${String(chartCount).padStart(2, `0`)} of ${String(ranmdomLoop).padStart(2, `0`)} ${String(chatLoop ? chatLoop : '')} : ${String(
                    userId,
                ).padStart(2, `0`)} to ${String(targetId).padStart(2, `0`)} : generateWords: ${generateWord}`,
            );
            await conn.query(
                `insert into messenger_chat (room_id, user_id, target_id, chat_code, message, checked, checked_at, created_at) values ('${room.id}', '${userId}', '${targetId}', '${chatCode}', '${generateWord}', 'N', null, now());`,
            );
        }
    }

    console.debug(`######################################################################`);
    exit();
})();
