import { createFileRoute } from "@tanstack/react-router"
import { HouseEventsTable } from "@/components/tables/house-events-table"

export const Route = createFileRoute("/house-events")({
  component: HouseEventsTable,
})
