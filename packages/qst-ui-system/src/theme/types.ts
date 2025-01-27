// theme css variable categories
export enum ThemeCategory {
  // 主题色
  Color = 'color',
  // 文字色
  TextColor = 'text-color',
  // 背景色
  BgColor = 'bg-color',
  // 边框色
  BorderColor = 'border-color',
  // 填充色
  FillColor = 'fill-color',
  // 自定义附加色
  ExtraColor = 'extra-color',
  // 圆角
  BorderRadius = 'border-radius',
  // 暂不启用box-shadow配置: BoxShadow = 'box-shadow',
  // 间距
  Spacing = 'spacing',
  // 字号
  FontSize = 'font-size',
  // 组件大小
  ComponentSize = 'component-size',
}

// 日间/夜间模式枚举
export enum DayNightModeEnum {
  light = 'light',
  dark = 'dark',
}

// 混合模式枚举，用于根据5种主色生成各主色的10个级别的亮色/暗色
export enum MixModeEnum {
  light = 'light',
  dark = 'dark',
}

export const cssVarCodex = {
  [ThemeCategory.Color]: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const,
  [ThemeCategory.TextColor]: ['primary', 'regular', 'secondary', 'placeholder', 'disabled'] as const,
  [ThemeCategory.BgColor]: ['DEFAULT', 'page', 'secondary'] as const,
  [ThemeCategory.BorderColor]: ['exlighter', 'lighter', 'light', 'DEFAULT', 'dark', 'darker', 'exdarker'] as const,
  [ThemeCategory.FillColor]: [
    'blank',
    'reverse',
    'exlighter',
    'lighter',
    'light',
    'DEFAULT',
    'dark',
    'darker',
    'exdarker',
  ] as const,
  // 非element-plus变量，根据项目实际情况自定义添加额外颜色
  [ThemeCategory.ExtraColor]: [] as string[],
  // border radius 在 element-plus 定义的变量之外，新增了'large'和'huge'值
  [ThemeCategory.BorderRadius]: ['small', 'base', 'large', 'huge', 'round', 'circle'] as const,
  // [ThemeCategory.BoxShadow]: ['DEFAULT', 'light', 'lighter', 'dark'],
  // spacing不是element-plus原有变量，例--el-spacing-sm
  [ThemeCategory.Spacing]: ['xxxs', 'xxs', 'xs', 'sm', 'md', 'DEFAULT', 'lg', 'xl', 'xxl', 'xxxl'] as const,
  // 在element-plus原有变量之外，新增xxl和xxxl两个字号
  [ThemeCategory.FontSize]: ['extra-small', 'small', 'base', 'medium', 'large', 'extra-large', 'xxl', 'xxxl'] as const,
  [ThemeCategory.ComponentSize]: ['mini', 'small', 'DEFAULT', 'large'] as const,
};

export type ThemeConfig = { [K in ThemeCategory]: Partial<Record<(typeof cssVarCodex)[K][number], string>> };

export interface UITheme {
  name: string;
  config: {
    [T in DayNightModeEnum]: ThemeConfig;
  };
}

/** 组件库计划支持'element-ui', 'element-plus', 'ant-design-vue', 'ant-design', 'vant' */
export type UILib = 'element-ui' | 'element-plus' | 'ant-design-vue' | 'ant-design' | 'vant';

/** 主题选项 */
export interface ThemeOption {
  /** 主题css变量命名空间 默认--el */
  namespace?: string;
  /** 主题列表 */
  themeList?: UITheme[];
  /** 主题样式设置完成后的回调函数 */
  onStylesSet?: () => void;
  /** 是否包含css重置样式(reset/normalize) 默认是 */
  cssReset?: boolean;
  /** 需要适配的组件库(进行样式覆盖/主题定制)  */
  uiLibs?: UILib | UILib[];
  /** 初始主题序号, 默认为主题列表中第一个主题 */
  initialThemeIndex?: number;
  /** 注入<head>内的样式id，默认qst_theme */
  styleTagId?: string;
  /** 开启自动重置样式注入功能：监控<head>中的样式顺序，如果新增样式标签，自动将主题样式重置到最底部，保证主题样式的覆盖作用，默认true */
  autoResetStyleInjection?: boolean;
}
