import { axios } from '@/utils/request'

const api = {
    dbAppVersion: '/system/appVersion'
}

export function getDbAppVersionList(parameter) {
    return axios({
        url: api.dbAppVersion + '/list',
        method: 'get',
        params: parameter
    })
}

export function saveDbAppVersion(parameter) {
    return axios({
        url: api.dbAppVersion + (parameter.id > 0 ? '/update' : '/save'),
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function delDbAppVersion(parameter) {
    return axios({
        url: api.dbAppVersion + '/remove',
        method: 'post',
        params: parameter
    })
}

export const dbAppVersionExport = api.dbAppVersion + '/export'