import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

// Register your locales here
register('az', () => import('$lib/components/locales/az.json'));
register('tr', () => import('$lib/components/locales/tr.json'));
register('en', () => import('$lib/components/locales/en.json'));
register('ru', () => import('$lib/components/locales/ru.json'));

// Initialize with the default locale
init({
	initialLocale: getLocaleFromNavigator()?.slice(0, 2),
	fallbackLocale: 'az'
	// initialLocale: 'az'
});
