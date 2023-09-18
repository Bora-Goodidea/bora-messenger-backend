#!/usr/bin/env node
import lodash from 'lodash';
import MysqlConnect from '@Database/MysqlConnect';
import { CodeTypeEnum } from '@Entity/Codes';
import { exit } from 'node:process';
import Codes from '@Codes';

console.debug(`######################################################################`);
(async () => {
    console.debug(`:::::::::::::::::::::::::::::Codes Start::::::::::::::::::::::::::::::`);
    const conn = await MysqlConnect.getConnection();
    const codeData: Array<{ type: CodeTypeEnum; group_id: string; code_id: string; name: string }> = [];

    lodash.forEach(Codes, (c) => {
        codeData.push({ type: `group` as CodeTypeEnum, group_id: c.id, code_id: `${c.id}000`, name: c.name });
        lodash.forEach(c.list, (l) => {
            codeData.push({
                type: `code` as CodeTypeEnum,
                group_id: c.id,
                code_id: `${c.id}${l.id}`,
                name: l.name,
            });
        });
    });

    await conn.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await conn.query(`truncate table codes;`);
    await conn.query(`SET FOREIGN_KEY_CHECKS=1;`);

    for await (const code of codeData) {
        console.log(`group-id : ${code.group_id}\t code-id: ${code.code_id}\t name: ${code.name}`);

        const [result] = await conn.query(
            `insert into codes (type, group_id, code_id, name, created_at) values ('${code.type}', '${code.group_id}', '${code.code_id}', '${code.name}', now());`,
        );
        if (!result) {
            console.debug('code insert error...');
            exit();
        }
    }
    console.debug(`:::::::::::::::::::::::::::::Codes End::::::::::::::::::::::::::::::`);

    const [result] = await conn.query(`select * from media order by id asc limit 0,1`);
    if (lodash.isEmpty(result)) {
        console.debug(`:::::::::::::::::::::::::::::Media Start::::::::::::::::::::::::::::::`);
        const [inertResult] = await conn.query(
            `insert into media (type, path, filename, origin_name, size, created_at) values ('image/jpeg', '/profile', 'default_profile.jpg', 'default_profile.jpg', 28350, now());`,
        );
        if (!inertResult) {
            console.debug('media insert error...');
            exit();
        }
        console.debug(`:::::::::::::::::::::::::::::Media End::::::::::::::::::::::::::::::`);
    }

    console.debug(`######################################################################`);
    exit();
})();
