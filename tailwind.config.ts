import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

		theme: {
			extend: {},
			//tentando criar uma paleta de cores
			textColor: {
				'roxo': {
					claro: '',
					default: '#4c1b49',
					escuro: ''
				},
				'lilas':{
					claro: '',
					default: '#9c80c2',
					escuro: ''
				},
				'verde': {
					claro: '',
					default: '#568d33',
					escuro: ''
				},
				'laranja':  {
					claro: '',
					default: '#ff5e1e',
					escuro: ''
				},
				'amarelo': {
					claro: '',
					default: '#e9bf6a',
					escuro: ''
				},
				'branco': {
					claro: '',
					default: '#ffffff',
					escuro: ''
				}

			}
	},

	plugins: [],
} satisfies Config;
