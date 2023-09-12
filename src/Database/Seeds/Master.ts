#!/usr/bin/env node
import _ from 'lodash'
import MysqlConnect from '@Database/MysqlConnect'
import { CodeTypeEnum } from '@Entity/Codes'
import { exit } from 'node:process'
import Codes from '@Codes'

console.debug(`######################################################################`)
;(async () => {
    const conn = await MysqlConnect.getConnection()
    const codeData: Array<{ type: CodeTypeEnum; group_id: string; code_id: string; name: string }> = []

    _.forEach(Codes, (c) => {
        codeData.push({ type: `group` as CodeTypeEnum, group_id: c.id, code_id: `${c.id}000`, name: c.name })
        _.forEach(c.list, (l) => {
            codeData.push({
                type: `code` as CodeTypeEnum,
                group_id: c.id,
                code_id: `${c.id}${l.id}`,
                name: l.name,
            })
        })
    })

    await conn.query(`SET FOREIGN_KEY_CHECKS=0;`)
    await conn.query(`truncate table codes;`)
    await conn.query(`SET FOREIGN_KEY_CHECKS=1;`)

    for await (const code of codeData) {
        console.log(`group-id : ${code.group_id}\t code-id: ${code.code_id}\t name: ${code.name}`)

        const [result] = await conn.query(
            `insert into codes (type, group_id, code_id, name, created_at) values ('${code.type}', '${code.group_id}', '${code.code_id}', '${code.name}', now());`,
        )
        if (!result) {
            console.debug('seed insert error...')
            exit()
        }
    }

    console.debug(`######################################################################`)
    exit()
})()
