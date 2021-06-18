const columnsA = [
  { type: 'seq', title: '序号', width: 50 },
  { field: 'name', title: '资料名称' },
  { field: 'copies', title: '份数', editRender: { name: '$input', props: { type: 'number' } } },
  { field: 'remark', title: '备注', editRender: { name: 'textarea' } }
]

const columnsB = [
  { type: 'seq', title: '序号', width: 50 },
  { field: 'name', title: '观感质量检查项目' },
  { field: 'checkPoint', title: '检查点' },
  { field: 'aPoint', title: '好点', editRender: { name: '$input', props: { type: 'number' } } },
  { field: 'bPoint', title: '一般点', editRender: { name: '$input', props: { type: 'number' } } },
  { field: 'cPoint', title: '差点', editRender: { name: '$input', props: { type: 'number' } } },
  { field: 'remark', title: '备注', editRender: { name: 'textarea' } }
]

export default {
  // 质量控制资料-建筑与结构
  11: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 3, remark: '' },
      { id: 2, name: '工程定位测量、放线记录', copies: 0, remark: '' },
      { id: 3, name: '原材料出厂合格证书及进场试验、试验报告', copies: 5, remark: '' },
      { id: 4, name: '施工试验报告及见证检测报告', copies: 6, remark: '' },
      { id: 5, name: '隐蔽工程验收记录', copies: 6, remark: '' },
      { id: 6, name: '施工记录', copies: 10, remark: '' },
      { id: 7, name: '地基、基础、主体结构检验及抽样检测资料', copies: 2, remark: '' },
      { id: 8, name: '分项、分部工程质量验收记录', copies: 6, remark: '' },
      { id: 9, name: '工程质量事故调查处理资料', copies: 6, remark: '' },
      { id: 10, name: '新技术论证、备案及施工记录', copies: 6, remark: '' }
    ]
  },
  // 质量控制资料-给排水与供暖
  12: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 0, remark: '' },
      { id: 2, name: '原材料出厂合格证书及进场试验、试验报告', copies: 0, remark: '' },
      { id: 3, name: '管道、设备强度试验、严密性试验记录', copies: 0, remark: '' },
      { id: 4, name: '隐蔽工程验收记录', copies: 0, remark: '' },
      { id: 5, name: '系统清洗、灌水、通水、通球试验记录', copies: 0, remark: '' },
      { id: 6, name: '施工记录', copies: 0, remark: '' },
      { id: 7, name: '分项、分部工程质量验收记录', copies: 0, remark: '' },
      { id: 8, name: '新技术论证、备案及施工记录', copies: 0, remark: '' }
    ]
  },
  // 质量控制资料-通风与空调
  13: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 0, remark: '' },
      { id: 2, name: '原材料出厂合格证书及进场试验、试验报告', copies: 0, remark: '' },
      { id: 3, name: '制冷、空调、水管道强度试验、严密性试验记录', copies: 0, remark: '' },
      { id: 4, name: '隐蔽工程验收记录', copies: 0, remark: '' },
      { id: 5, name: '制冷设备运行调试记录', copies: 0, remark: '' },
      { id: 6, name: '通风、空调系统调试记录', copies: 0, remark: '' },
      { id: 7, name: '施工记录', copies: 0, remark: '' },
      { id: 8, name: '分项、分部工程质量验收记录', copies: 0, remark: '' },
      { id: 9, name: '新技术论证、备案及施工记录', copies: 0, remark: '' }
    ]
  },
  // 质量控制资料-建筑电气
  14: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 0, remark: '' },
      { id: 2, name: '原材料出厂合格证书及进场试验、试验报告', copies: 0, remark: '' },
      { id: 3, name: '设备调试记录', copies: 0, remark: '' },
      { id: 4, name: '接地、绝缘电阻测试记录', copies: 0, remark: '' },
      { id: 5, name: '隐蔽工程验收记录', copies: 0, remark: '' },
      { id: 6, name: '施工记录', copies: 0, remark: '' },
      { id: 7, name: '分项、分部工程质量验收记录', copies: 0, remark: '' },
      { id: 8, name: '新技术论证、备案及施工记录', copies: 0, remark: '' }
    ]
  },
  // 质量控制资料-智能建筑
  15: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 0, remark: '' },
      { id: 2, name: '原材料出厂合格证书及进场试验、试验报告', copies: 0, remark: '' },
      { id: 3, name: '隐蔽工程验收记录', copies: 0, remark: '' },
      { id: 4, name: '施工记录', copies: 0, remark: '' },
      { id: 5, name: '系统功能测定及设备调试记录', copies: 0, remark: '' },
      { id: 6, name: '系统技术、操作和维护手册', copies: 0, remark: '' },
      { id: 7, name: '系统管理、操作人员培训记录', copies: 0, remark: '' },
      { id: 8, name: '系统检查报告', copies: 0, remark: '' },
      { id: 9, name: '分项、分部工程质量验收记录', copies: 0, remark: '' },
      { id: 10, name: '新技术论证、备案及施工记录', copies: 0, remark: '' }
    ]
  },
  // 质量控制资料-建筑节能
  16: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 0, remark: '' },
      { id: 2, name: '原材料出厂合格证书及进场试验、试验报告', copies: 0, remark: '' },
      { id: 3, name: '隐蔽工程验收记录', copies: 0, remark: '' },
      { id: 4, name: '施工记录', copies: 0, remark: '' },
      { id: 5, name: '外墙、外窗节能检验报告', copies: 0, remark: '' },
      { id: 6, name: '设备系统节能检测报告', copies: 0, remark: '' },
      { id: 7, name: '分项、分部工程质量验收记录', copies: 0, remark: '' },
      { id: 8, name: '新技术论证、备案及施工记录', copies: 0, remark: '' }
    ]
  },
  // 质量控制资料-电梯
  17: {
    columns: columnsA,
    data: [
      { id: 1, name: '图纸会审记录、设计变更通知、工程洽商记录', copies: 0, remark: '' },
      { id: 2, name: '设备出厂合格证书及开箱检验记录', copies: 0, remark: '' },
      { id: 3, name: '隐蔽工程验收记录', copies: 0, remark: '' },
      { id: 4, name: '施工记录', copies: 0, remark: '' },
      { id: 5, name: '接地、绝缘电阻试验记录', copies: 0, remark: '' },
      { id: 6, name: '负荷试验、安全装置检查记录', copies: 0, remark: '' },
      { id: 7, name: '分项、分部工程质量验收记录', copies: 0, remark: '' },
      { id: 8, name: '新技术论证、备案及施工记录', copies: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-建筑与结构
  21: {
    columns: columnsB,
    data: [
      { id: 1, name: '主体结构外观', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '室外墙面', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 3, name: '变形缝、雨水管', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 4, name: '屋面', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 5, name: '室内墙面', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 6, name: '室内顶棚', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 7, name: '室内地面', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 8, name: '楼梯、踏步、护栏', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 9, name: '门窗', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 10, name: '雨罩、台阶、坡道、散水', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-给排水与供暖
  22: {
    columns: columnsB,
    data: [
      { id: 1, name: '管道接口、坡度、支架', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '卫生器具、支架、阀门', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 3, name: '检查口、扫除口、地漏', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-通风与空调
  23: {
    columns: columnsB,
    data: [
      { id: 1, name: '风管、支架', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '风口、风阀', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 3, name: '风机、空调设备', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 4, name: '管道、阀门、支架', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 5, name: '水泵、冷却塔', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 6, name: '绝热', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-建筑电气
  24: {
    columns: columnsB,
    data: [
      { id: 1, name: '配电箱、盘、板、接线盒', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '设备器具、开关、插座', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 3, name: '防雷、接地、防火', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-智能建筑
  25: {
    columns: columnsB,
    data: [
      { id: 1, name: '机房设备安装及布局', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '现场设备安装', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-建筑节能
  26: {
    columns: columnsB,
    data: [
      { id: 1, name: '配电箱、盘、板、接线盒', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '设备器具、开关、插座', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 3, name: '防雷、接地、防火', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 观感质量检查记录-电梯
  27: {
    columns: columnsB,
    data: [
      { id: 1, name: '运行、平层、开关门', checkPoint: 6, aPoint: 2, bPoint: 3, cPoint: 1, remark: '' },
      { id: 2, name: '层门、信号系统', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' },
      { id: 3, name: '机房', checkPoint: 0, aPoint: 0, bPoint: 0, cPoint: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-建筑与结构
  31: {
    columns: columnsA,
    data: [
      { id: 1, name: '地基承载力检验报告', copies: 0, remark: '' },
      { id: 2, name: '桩基承载力检验报告', copies: 0, remark: '' },
      { id: 3, name: '混凝土强度试验报告', copies: 0, remark: '' },
      { id: 4, name: '砂浆强度试验报告', copies: 0, remark: '' },
      { id: 5, name: '主体结构尺寸、位置抽查记录', copies: 0, remark: '' },
      { id: 6, name: '建筑物垂直高度、标高、全高测量记录', copies: 0, remark: '' },
      { id: 7, name: '屋面淋水或蓄水试验记录', copies: 0, remark: '' },
      { id: 8, name: '地下室渗漏水检查记录', copies: 0, remark: '' },
      { id: 9, name: '有防水要求的地面蓄水试验记录', copies: 0, remark: '' },
      { id: 10, name: '抽气（风）道检查记录', copies: 0, remark: '' },
      { id: 11, name: '外窗气密性、水密性、耐风压检测报告', copies: 0, remark: '' },
      { id: 12, name: '幕墙气密性、水密性、耐风压检测报告', copies: 0, remark: '' },
      { id: 13, name: '建筑物沉降观测测量记录', copies: 0, remark: '' },
      { id: 14, name: '节能、保温测试记录', copies: 0, remark: '' },
      { id: 15, name: '室内环境检测报告', copies: 0, remark: '' },
      { id: 16, name: '土壤氡气溶度检测报告', copies: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-给排水与供暖
  32: {
    columns: columnsA,
    data: [
      { id: 1, name: '给水管道通水试验记录', copies: 0, remark: '' },
      { id: 2, name: '晦气管道、散热器压力试验记录', copies: 0, remark: '' },
      { id: 3, name: '卫生器具满水试验记录', copies: 0, remark: '' },
      { id: 4, name: '消防管道、燃气管道压力试验记录', copies: 0, remark: '' },
      { id: 5, name: '排水干管通球试验记录', copies: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-通风与空调
  33: {
    columns: columnsA,
    data: [
      { id: 1, name: '通风、空调系统运行记录', copies: 0, remark: '' },
      { id: 2, name: '风量、温度测试记录', copies: 0, remark: '' },
      { id: 3, name: '空气能量回收装置测试记录', copies: 0, remark: '' },
      { id: 4, name: '洁净室洁净度测试记录', copies: 0, remark: '' },
      { id: 5, name: '制冷机组试运行调试记录', copies: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-建筑电气
  34: {
    columns: columnsA,
    data: [
      { id: 1, name: '建筑照明通电试运行记录', copies: 0, remark: '' },
      { id: 2, name: '灯具固定装置及悬吊装置的载荷强度试验记录', copies: 0, remark: '' },
      { id: 3, name: '绝缘电阻测试记录', copies: 0, remark: '' },
      { id: 4, name: '剩余电流动作保护器测试记录', copies: 0, remark: '' },
      { id: 5, name: '接地电阻测试记录', copies: 0, remark: '' },
      { id: 6, name: '接地故障回路阻抗测试记录', copies: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-智能建筑
  35: {
    columns: columnsA,
    data: [
      { id: 1, name: '系统运行记录', copies: 0, remark: '' },
      { id: 2, name: '系统电源及接地检测报告', copies: 0, remark: '' },
      { id: 3, name: '系统接地检测报告', copies: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-建筑节能
  36: {
    columns: columnsA,
    data: [
      { id: 1, name: '外墙节能构造检查记录或热工性能检验报告', copies: 0, remark: '' },
      { id: 2, name: '设备系统节能性能检查记录', copies: 0, remark: '' }
    ]
  },
  // 安全和功能检验资料-电梯
  37: {
    columns: columnsA,
    data: [
      { id: 1, name: '运行记录', copies: 0, remark: '' },
      { id: 2, name: '安全装置检查报告', copies: 0, remark: '' }
    ]
  }
}
