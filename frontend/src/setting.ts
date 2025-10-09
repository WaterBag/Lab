// *------------------------------------
/** 部署环境 */
export const HostMode = location.origin.includes('stag.tencent-cep') ? 'stag' : (location.origin.includes('tencent-cep') ? 'prod' : 'dev')

// * ----------------------- 项目通用配置 ---------------------------
type LayoutCfgModel = {
  /**
   * top表示只有顶栏没有侧边栏，导航菜单全在navBar
   * aside表示有侧边栏
   */
  layout: 'top' | 'aside';
  /**
   * 当layout为aside时生效
   * true时菜单项会被分割在navBar和aside
   * false时菜单项将只存在于aside
   */
  splitMenu: boolean;
};

/** 项目框架一些配置 */
export const LayoutCfg = reactive<LayoutCfgModel>({
  layout: 'aside',
  splitMenu: true,
})

/** 默认语言，只限制初次进入系统时的语言 */
export const defaultLang: LangEnum = 'zh'

/** 设置html文档title的后缀, 在这里不能自己套 $t() 因为尚未初始化i18n，SUFFIX_TITLE的值将会在使用处被进行 $t() 处理 */
export const SUFFIX_TITLE = 'AI平台'
