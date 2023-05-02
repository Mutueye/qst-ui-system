# qst-ui-system
QST前端UI基础库：
1. 对接设计端定制的颜色/间距/风格(圆角/边框)等主题规范，作为UI设计和前端开发之间的“接口”;
2. 将设计端定制的主题规范 关联到常用组件库的主题配置上;
3. 将设计端定制的主题规范 关联到常用css框架的配置上;
4. 通用的normalize(reset)样式和其他全局样式;
## 主要功能
- [x] 基于element-plus的css变量，生成主题变量配置：颜色/字色/背景色/圆角/间距/组件尺寸 等等，
- [x] 全局初始化样式：normalize，全局文字配置(字体/抗锯齿等)
- [ ] 组件库适配主题变量配置(样式覆盖)
  - [x] element-plus
  - [ ] element-ui
  - [ ] ant-design / ant-design-vue
  - [ ] vant
- [ ] css框架适配主题变量配置
  - [x] unocss
  - [ ] windicss
  - [ ] tailwind

## 对接&使用说明
设计端：
  1. 设计师使用[主题编辑器](https://mutueye.github.io/vite-vue3-scaffold/#/themeeditor)配置并导出json格式的主题列表
  2. 在UI设计的过程中遵循配置好的主题进行设计

前端：
  1. 在项目入口(main.js/main.ts)调用`initQstTheme()`初始化主题样式，引入设计端定制好的主题(不传则使用默认主题列表)
   
    ```js
    import { initQstTheme } from 'qst-ui-system';
    // 初始化qst主题，不传参数使用默认配置
    initQstTheme();
    // 参数示例：
    initQstTheme({
      /** css变量命名空间，如果使用element-plus切修改了element-plus的命名空间，需要和element-plus统一 */
      namespace: '--el',
      /** 主题列表，可以传入设计师定制的主题列表，不传使用默认主题列表 */
      themeList?: UITheme[];
      /** 主题样式设置完成后的回调函数 */
      onStylesSet?: () => void;
      /** 是否包含css重置样式(reset/normalize) 默认true */
      cssReset?: boolean;
      /** 需要适配的组件库(进行样式覆盖/主题定制)，默认'element-plus'  */
      uiLibs?: UILib | UILib[];
    })
    ```

  2. 如果使用element-plus组件库，则element组件自动适配引入的主题配置；其他组件库需要额外的步骤(WIP)
  3. 使用css框架(比如unocss)，可以方便的调用主题配置进行样式编写(需要在相应的配置文件中引入主题配置 WIP)

    ```js
    import { generateUnocssTheme } from 'qst-ui-system';
     // unocss配置
     {
      ...
      presets: [...],
      safelist: [...],
      transformers: [...]
      // 生成主题配置 参数为namespace，默认'--el'
      theme: generateUnocssTheme('--el'),
      ...
    }
    ```