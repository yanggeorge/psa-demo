import { createRootRoute, createRouter } from "@tanstack/react-router"
import { MainLayout } from "./layouts/main-layout"

// Import routes
import { Route as IndexRoute } from "./routes/index"
import { Route as GatesRoute } from "./routes/gates"
import { Route as BasicEventsRoute } from "./routes/basic-events"
import { Route as HouseEventsRoute } from "./routes/house-events"
import { Route as FaultTreeRoute } from "./routes/fault-tree"
import { Route as FaultTreeNameRoute } from "./routes/fault-tree/$treeName"

// 创建根路由
const rootRoute = createRootRoute({
  component: MainLayout,
})

// 注册所有路由
const routeTree = rootRoute.addChildren([
  IndexRoute,
  GatesRoute,
  BasicEventsRoute,
  HouseEventsRoute,
  FaultTreeRoute,
  FaultTreeNameRoute,
])

// 创建路由器
export const router = createRouter({ routeTree })

// 为类型安全声明路由类型
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
