import { axios } from '@/utils/request'

const api = {
    operLog: '/system/operLog',
    loginLog: '/system/logininfor',
    sysJob: '/system/sysJob'


}

export default api

// OperLog
export function getOperLogList(parameter) {
    return axios({
        url: api.operLog + '/list',
        method: 'get',
        params: parameter
    })
}

export function delOperLog(parameter) {
    return axios({
        url: api.operLog + '/remove',
        method: 'post',
        params: parameter
    })
}
export function cleanOperLog() {
    return axios({
        url: api.operLog + '/clean',
        method: 'post'
    })
}
// LoginLog
export function getLoginLogList(parameter) {
    return axios({
        url: api.loginLog + '/list',
        method: 'get',
        params: parameter
    })
}
export function delLoginLog(parameter) {
    return axios({
        url: api.loginLog + '/remove',
        method: 'post',
        params: parameter
    })
}
export function cleanLoginLog() {
    return axios({
        url: api.loginLog + '/clean',
        method: 'post'
    })
}

export const operLogExport = api.operLog + '/export'



// sysJob
export function getSysJobList(parameter) {
    return axios({
        url: api.sysJob + '/list',
        method: 'get',
        params: parameter
    })
}

export function saveSysJob(parameter) {
    return axios({
        url: api.sysJob + (parameter.jobId > 0 ? '/update' : '/save'),
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function cronSysJob(parameter) {
    return axios({
        url: api.sysJob + 'checkCronExpressionIsValid',
        method: 'post',
        data: parameter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function delSysJob(parameter) {
    return axios({
        url: api.sysJob + '/remove',
        method: 'post',
        params: parameter
    })
}

export const sysJobExport = api.sysJob + '/export'