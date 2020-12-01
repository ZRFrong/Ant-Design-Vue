import { axios } from '@/utils/request'

const api = {
    dbLand: '/fangyuanapi/land'
}

export function list(parameter) {

    return axios({
        url: api.dbLand + '/list',
        method: 'get',
        params: parameter
    })

}

export function saveDbLand(parameter) {
    return axios({
        url: api.dbLand + (parameter.landId > 0 ? '/update' : '/save'),
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function delDbLand(parameter) {
    return axios({
        url: api.dbLand + '/remove',
        method: 'post',
        params: parameter
    })
}

export const dbLandExport = api.dbLand + '/export'