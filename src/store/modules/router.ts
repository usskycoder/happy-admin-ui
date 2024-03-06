import { defineStore } from 'pinia'
import { useMenuShowApi } from '@/api/sys/menu'
import { generateRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'

export const useRouterStore = defineStore('routerStore', {
	state: () => ({
		menuRoutes: [] as RouteRecordRaw[],
		searchMenu: [] as RouteRecordRaw[],
		routes: [] as RouteRecordRaw[]
	}),
	actions: {
		async getMenuRoutes() {
			const { data } = await useMenuShowApi()
			const routes = generateRoutes(data)

			this.menuRoutes.push(...routes)

			return this.menuRoutes
		},
		setSearchMenu(routers: RouteRecordRaw[]) {
			this.searchMenu = routers
		},
		setRoutes(routers: RouteRecordRaw[]) {
			this.routes = routers
		}
	}
})
