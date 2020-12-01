import { axios } from '@/utils/request'

const api = {
    dbEquipmentTemp: '/fangyuanapi/temp',
    dbEquipment: '/fangyuanapi/dbEquipment',
    dbQrCode: '/fangyuanapi/qrcode'
}

// dbEquipmentTemp
export function getDbEquipmentTempList(parameter) {
    return axios({
        url: api.dbEquipmentTemp + '/list',
        method: 'get',
        params: parameter
    })
}

export function saveDbEquipmentTemp(parameter) {
    return axios({
        url: api.dbEquipmentTemp + (parameter.equipmentTemId > 0 ? '/update' : '/save'),
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function delDbEquipmentTemp(parameter) {
    return axios({
        url: api.dbEquipmentTemp + '/remove',
        method: 'post',
        params: parameter
    })
}

export const dbEquipmentTempExport = api.dbEquipmentTemp + '/export'

// dbEquipment
export function getDbEquipmentList(parameter) {
    return axios({
        url: api.dbEquipment + '/list',
        method: 'get',
        params: parameter
    })
}

export function saveDbEquipment(parameter) {
    return axios({
        url: api.dbEquipment + (parameter.equipmentId > 0 ? '/update' : '/save'),
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function delDbEquipment(parameter) {
    return axios({
        url: api.dbEquipment + '/remove',
        method: 'post',
        params: parameter
    })
}

export const dbEquipmentExport = api.dbEquipment + '/export'

// dbQrCode
export function getDbQrCodeList(parameter) {
    return axios({
        url: api.dbQrCode + '/list',
        method: 'get',
        params: parameter
    })
}

export function saveDbQrCode(parameter) {
    return axios({
        url: api.dbQrCode + (parameter.qrCodeId > 0 ? '/update' : '/save'),
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function delDbQrCode(parameter) {
    return axios({
        url: api.dbQrCode + '/remove',
        method: 'post',
        params: parameter
    })
}

export function generateQrCode(parameter) {
    return axios({
        url: api.dbQrCode + '/qrCodeGenerate',
        method: 'post',
        params: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const dbQrCodeExport = api.dbQrCode + '/export'