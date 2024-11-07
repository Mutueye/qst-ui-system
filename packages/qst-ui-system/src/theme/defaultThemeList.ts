import type { UITheme } from './theme';

export const defaultThemeList: UITheme[] = [
  {
    name: 'athena',
    config: {
      light: {
        color: {
          primary: '#217aff',
          success: '#12D678',
          warning: '#FFB115',
          danger: '#FF4D4F',
          info: '#96979C',
        },
        'text-color': {
          primary: '#131b26',
          regular: '#5f6165',
          secondary: '#96979c',
          placeholder: '#cacbd0',
          disabled: '#cacbd0',
        },
        'bg-color': {
          DEFAULT: '#ffffff',
          page: '#f7f8fd',
          secondary: '#f3f5fb',
        },
        'border-color': {
          exlighter: '#F6F7FA',
          lighter: '#F0F2F7',
          light: '#EAEDF4',
          DEFAULT: '#E1E6F0',
          dark: '#D0D5DF',
          darker: '#C8CCD7',
          exdarker: '#BEC2CF',
        },
        'fill-color': {
          blank: '#ffffff',
          reverse: '#000000',
          exlighter: '#fafcff',
          lighter: '#f8fafc',
          light: '#f5f7fa',
          DEFAULT: '#f0f2f5',
          dark: '#eeeeee',
          darker: '#e6e8eb',
          exdarker: '#D9DDE3',
        },
        'extra-color': {},
        'border-radius': {
          small: '2px',
          base: '4px',
          large: '6px',
          huge: '8px',
          round: '20px',
          circle: '100%',
        },
        spacing: {
          xxxs: '4px',
          xxs: '8px',
          xs: '12px',
          sm: '16px',
          md: '20px',
          DEFAULT: '24px',
          lg: '28px',
          xl: '32px',
          xxl: '36px',
          xxxl: '40px',
        },
        'font-size': {
          'extra-small': '12px',
          small: '12px',
          base: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
          xxl: '24px',
          xxxl: '28px',
        },
        'component-size': {
          mini: '24px',
          small: '28px',
          DEFAULT: '36px',
          large: '40px',
        },
      },
      dark: {
        color: {
          primary: '#217aff',
          success: '#12D678',
          warning: '#FFB115',
          danger: '#FF4D4F',
          info: '#96979C',
        },
        'text-color': {
          primary: '#ffffff',
          regular: '#cfd3dc',
          secondary: '#a3a6ad',
          placeholder: '#8d9095',
          disabled: '#6c6e72',
        },
        'bg-color': {
          DEFAULT: '#28303d',
          page: '#1b2431',
          secondary: '#121B27',
        },
        'border-color': {
          exlighter: '#212833',
          lighter: '#313a47',
          light: '#3a4554',
          DEFAULT: '#444f5e',
          dark: '#576273',
          darker: '#677282',
          exdarker: '#7F8896',
        },
        'fill-color': {
          blank: 'transparent',
          reverse: '#ffffff',
          exlighter: '#252c38',
          lighter: '#222b38',
          light: '#1f2733',
          DEFAULT: '#1e2633',
          dark: '#1a222e',
          darker: '#171e29',
          exdarker: '#111821',
        },
        'extra-color': {},
        'border-radius': {
          small: '2px',
          base: '4px',
          large: '6px',
          huge: '8px',
          round: '20px',
          circle: '100%',
        },
        spacing: {
          xxxs: '4px',
          xxs: '8px',
          xs: '12px',
          sm: '16px',
          md: '20px',
          DEFAULT: '24px',
          lg: '28px',
          xl: '32px',
          xxl: '36px',
          xxxl: '40px',
        },
        'font-size': {
          'extra-small': '12px',
          small: '12px',
          base: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
          xxl: '24px',
          xxxl: '28px',
        },
        'component-size': {
          mini: '24px',
          small: '28px',
          DEFAULT: '36px',
          large: '40px',
        },
      },
    },
  },
  {
    name: 'uplus',
    config: {
      light: {
        color: {
          primary: '#67aef7',
          success: '#62d65c',
          warning: '#f39800',
          danger: '#fc7373',
          info: '#969eb3',
        },
        'text-color': {
          primary: '#222222',
          regular: '#666666',
          secondary: '#999999',
          placeholder: '#bbbbbb',
          disabled: '#cccccc',
        },
        'bg-color': {
          DEFAULT: '#ffffff',
          page: '#f8f9fa',
          secondary: '#f2f3f4',
        },
        'border-color': {
          exlighter: '#f2f6fc',
          lighter: '#ebeef5',
          light: '#e4e7ed',
          DEFAULT: '#dcdfe6',
          dark: '#d4d7de',
          darker: '#cdd0d6',
          exdarker: '#cdd0d6',
        },
        'fill-color': {
          blank: '#ffffff',
          reverse: '#000000',
          exlighter: '#fafcff',
          lighter: '#fafafa',
          light: '#f5f7fa',
          DEFAULT: '#f0f2f5',
          dark: '#ebedf0',
          darker: '#e6e8eb',
          exdarker: '#e6e8eb',
        },
        'extra-color': {},
        'border-radius': {
          small: '2px',
          base: '4px',
          large: '6px',
          huge: '8px',
          round: '20px',
          circle: '100%',
        },
        spacing: {
          xxxs: '4px',
          xxs: '8px',
          xs: '12px',
          sm: '16px',
          md: '20px',
          DEFAULT: '24px',
          lg: '28px',
          xl: '32px',
          xxl: '36px',
          xxxl: '40px',
        },
        'font-size': {
          'extra-small': '12px',
          small: '13px',
          base: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
          xxl: '24px',
          xxxl: '28px',
        },
        'component-size': {
          mini: '24px',
          small: '32px',
          DEFAULT: '40px',
          large: '48px',
        },
      },
      dark: {
        color: {
          primary: '#67aef7',
          success: '#62d65c',
          warning: '#f39800',
          danger: '#fc7373',
          info: '#969eb3',
        },
        'text-color': {
          primary: '#e5eaf3',
          regular: '#cfd3dc',
          secondary: '#a3a6ad',
          placeholder: '#8d9095',
          disabled: '#6c6e72',
        },
        'bg-color': {
          DEFAULT: '#252525',
          page: '#181818',
          secondary: '#111111',
        },
        'border-color': {
          exlighter: '#2B2B2C',
          lighter: '#363637',
          light: '#414243',
          DEFAULT: '#4C4D4F',
          dark: '#58585B',
          darker: '#636466',
          exdarker: '#636466',
        },
        'fill-color': {
          blank: 'transparent',
          reverse: '#ffffff',
          exlighter: '#191919',
          lighter: '#1D1D1D',
          light: '#262727',
          DEFAULT: '#303030',
          dark: '#39393A',
          darker: '#424243',
          exdarker: '#424243',
        },
        'extra-color': {},
        'border-radius': {
          small: '2px',
          base: '4px',
          large: '6px',
          huge: '8px',
          round: '20px',
          circle: '100%',
        },
        spacing: {
          xxxs: '4px',
          xxs: '8px',
          xs: '12px',
          sm: '16px',
          md: '20px',
          DEFAULT: '24px',
          lg: '28px',
          xl: '32px',
          xxl: '36px',
          xxxl: '40px',
        },
        'font-size': {
          'extra-small': '12px',
          small: '13px',
          base: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
          xxl: '24px',
          xxxl: '28px',
        },
        'component-size': {
          mini: '24px',
          small: '32px',
          DEFAULT: '40px',
          large: '48px',
        },
      },
    },
  },
  {
    name: 'purple',
    config: {
      light: {
        color: {
          primary: '#7955FC',
          success: '#18D654',
          warning: '#faad14',
          danger: '#f5222d',
          info: '#8c8c8c',
        },
        'text-color': {
          primary: '#131b26',
          regular: '#5f6165',
          secondary: '#96979c',
          placeholder: '#cacbd0',
          disabled: '#c0c4cc',
        },
        'bg-color': {
          DEFAULT: '#ffffff',
          page: '#F6F5F7',
          secondary: '#F2F1F3',
        },
        'border-color': {
          exlighter: '#f2f6fc',
          lighter: '#ebeef5',
          light: '#e4e7ed',
          DEFAULT: '#dcdfe6',
          dark: '#d4d7de',
          darker: '#cdd0d6',
          exdarker: '#cdd0d6',
        },
        'fill-color': {
          blank: '#ffffff',
          reverse: '#000000',
          exlighter: '#fafcff',
          lighter: '#f8fafc',
          light: '#f5f7fa',
          DEFAULT: '#f0f2f5',
          dark: '#ebedf0',
          darker: '#e6e8eb',
          exdarker: '#e6e8eb',
        },
        'extra-color': {},
        'border-radius': {
          small: '4px',
          base: '6px',
          large: '8px',
          huge: '10px',
          round: '20px',
          circle: '100%',
        },
        spacing: {
          xxxs: '4px',
          xxs: '8px',
          xs: '12px',
          sm: '16px',
          md: '20px',
          DEFAULT: '24px',
          lg: '28px',
          xl: '32px',
          xxl: '36px',
          xxxl: '40px',
        },
        'font-size': {
          'extra-small': '12px',
          small: '13px',
          base: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
          xxl: '24px',
          xxxl: '28px',
        },
        'component-size': {
          mini: '24px',
          small: '28px',
          DEFAULT: '36px',
          large: '40px',
        },
      },
      dark: {
        color: {
          primary: '#7955FC',
          success: '#18D654',
          warning: '#faad14',
          danger: '#f5222d',
          info: '#8c8c8c',
        },
        'text-color': {
          primary: '#ffffff',
          regular: '#cfd3dc',
          secondary: '#a3a6ad',
          placeholder: '#8d9095',
          disabled: '#6c6e72',
        },
        'bg-color': {
          DEFAULT: '#202024',
          page: '#1C1A22',
          secondary: '#0F0E13',
        },
        'border-color': {
          exlighter: '#212833',
          lighter: '#313a47',
          light: '#3a4554',
          DEFAULT: '#444f5e',
          dark: '#576273',
          darker: '#677282',
          exdarker: '#677282',
        },
        'fill-color': {
          reverse: '#ffffff',
          blank: 'transparent',
          exlighter: '#252c38',
          lighter: '#222b38',
          light: '#1f2733',
          DEFAULT: '#1e2633',
          dark: '#1a222e',
          darker: '#171e29',
          exdarker: '#171e29',
        },
        'extra-color': {},
        'border-radius': {
          small: '4px',
          base: '6px',
          large: '8px',
          huge: '10px',
          round: '20px',
          circle: '100%',
        },
        spacing: {
          xxxs: '4px',
          xxs: '8px',
          xs: '12px',
          sm: '16px',
          md: '20px',
          DEFAULT: '24px',
          lg: '28px',
          xl: '32px',
          xxl: '36px',
          xxxl: '40px',
        },
        'font-size': {
          'extra-small': '12px',
          small: '13px',
          base: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
          xxl: '24px',
          xxxl: '28px',
        },
        'component-size': {
          mini: '24px',
          small: '28px',
          DEFAULT: '36px',
          large: '40px',
        },
      },
    },
  },
];
