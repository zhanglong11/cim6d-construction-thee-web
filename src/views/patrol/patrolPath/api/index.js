import http, { projectFile } from '@/utils/axios'

export default {
  file: {
    list: () => http.file.get(`/image/category/list`),
    add: data => http.file.post(`/image/category/add`, data),
    update: data => http.file.post(`/image/category/update`, data),
    delete: id => http.file.get(`/image/category/delete/${id}`)
  },
  doc: {
    // 获取文件目录树结构
    getLevelTreeDate: data => {
      return http.file.post(`/common/document/dirTree`, data)
    },
    // 获取文件列表
    getList: data => {
      return http.file.post('/common/document/list', data)
    },
    deleteById: id => {
      return http.file.get(`/common/document/delete/${id}`, {})
    },
    multipleDelete: data => {
      return http.file.post(`/common/document/batchDelete`, data)
    },
    // 移动
    move: data => {
      return http.file.post(`/common/document/batchMove`, data)
    },
    // 复制
    copy: data => {
      return http.file.post(`/common/document/batchCopy`, data)
    },
    // 重命名
    rename: data => {
      return http.file.post(`/common/document/rename`, data)
    },
    // 添加
    add: data => {
      return http.file.post(`/common/document/dir/add`, data)
    },
    // 上传文件
    uploadFile: data => {
      return http.file.post(`/common/document/file/add`, data, { contentType: 'multipart/form-data' })
    },
    download: id => {
      return http.file.get(`/noToken/common/document/download/${id}`, { responseType: 'blob' })
    },
    // 批量下载
    downloadMultiple: data => {
      return http.file.post(`/noToken/common/document/batchDownload`, data, { responseType: 'blob' })
    }
  }
}

/**
 * 公用文件接口(上传、下载、预览等)-根据fileIds批量获取file地址 @author yangjiaqi
 * @param {Array} ids ids
 */
export function getFileUrlByIds(ids) {
  return projectFile.post(`/file/commonFile/listByIds`, ids)
}
